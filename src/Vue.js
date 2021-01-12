import {observe} from "./core/Observer";
import Watcher from "./core/Watcher";
import Compile from "./compiler/Compile";
import {toArray} from "./utils";


class Vue {
    constructor(options) {
        this._watchers = [];

        this.data = options.data;
        let self = this;
        this.methods = options.methods ? options.methods : {};

        // 把methods赋值到vm实例上
        Object.keys(this.methods).forEach(m => {
            self[m] = self.methods[m];
        });

        this._textNodes = []; // 存放文本节点 在compile中使用

        Object.keys(this.data).forEach(function (key) {
            self.proxyKeys(key);
        });

        observe(this.data);
        new Compile(options.el, this);

        if (options.watch) {
            Object.keys(options.watch).forEach(key => {
                new Watcher(self, key, options.watch[key]);
            })
        }
        return this;
    }

    // this.data.XXX -> this.XXX
    proxyKeys(key) {
        let self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function () {
                return self.data[key];
            },
            set: function (newVal) {
                self.data[key] = newVal;
            }
        })
    }
}

// 混入对象
Vue.mixin = function (mixin) {

};

// 使用插件
Vue.use = function (plugin) {
    // 查看该插件是不是已经安装过了
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
        return this;
    }

    // 其他参数
    // 将类数组转为真正的数组，arguments除了第一个剩余参数传给args
    const args = toArray(arguments, 1);
    args.unshift(this); // Vue添加到args列表的最前面

    // 插件的类型，可以是install方法，也可以是一个包含install方法的对象
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    }
    else {
        plugin.apply(null, args);
    }

    installedPlugins.push(plugin);
    return this;
};

window.Vue = Vue;

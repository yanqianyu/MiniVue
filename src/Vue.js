import observe from "./core/Observer";
import Watcher from "./core/Watcher";
import Compile from "./compiler/Compile";
import {mergeOptions, toArray} from "./utils";


class Vue {
    constructor(options) {
        this._init(options);
        return this;
    }

    // 初始化数据和方法
    _init(options) {
        this.$options = options;
        // 观察者实例
        this._watchers = [];
        // Vue实例
        this._isVue = true;

        this._initData();
        this._initMethods();
        this._initWatch();
        this._compile();
    }

    // this._data.XXX -> this.XXX
    proxyKeys(key) {
        let self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function () {
                return self._data[key];
            },
            set: function (newVal) {
                self._data[key] = newVal;
            }
        })
    }

    _initData() {
        let data = this.$options.data;
        data = this._data = typeof data === 'function' ? data(): data || {};
        Object.keys(data).forEach(key => {
            this.proxyKeys(key);
        });

        // 监听数据
        observe(this._data);
    }

    _initWatch() {
        if (this.$options.watch) {
            Object.keys(this.$options.watch).forEach(key => {
                new Watcher(this, key, this.$options.watch[key]);
            })
        }
    }

    _initMethods() {
        const methods = this.$options.methods ? this.$options.methods : {};
        // 把methods赋值到vm实例上
        Object.keys(methods).forEach(m => {
            this[m] = methods[m];
        });
    }

    _compile() {
        this._textNodes = []; // 存放文本节点 在compile中使用
        new Compile(this.$options.el, this);
    }
}

// 混入对象
Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
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

// 创建子类
let cid = 1;
Vue.extend = function(extendOptions) {
    extendOptions = extendOptions || {};
    const Super = this;
    const SuperId = Super.cid;
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
        // 已经缓存过构造函数，直接返回
        return cachedCtors[SuperId];
    }

    const name = extendOptions.name || Super.Options.name;
    const Sub = function VueComponent(options) {
        this._init(options);
    };

    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;

    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    );

    Sub['super'] = Super;
    Sub.extent = Super.extend;
    Sub.component = Super.component;

    if (name) {
        Sub.options.components[name] = Sub;
    }

    // 缓存构造函数
    cachedCtors[SuperId] = Sub;
    return Sub;
};

// 注册或获取全局组件
Vue.component = function(id, definition) {
    if (!definition) {
        return this.options['components'][id];
    }
    else {
        definition.name = definition.name || id;
        definition = Vue.extend(definition);
        this.options['components'][id] = definition;
        return definition;
    }
};

window.Vue = Vue;

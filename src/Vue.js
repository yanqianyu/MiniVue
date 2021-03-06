import observe from "./core/Observer";
import Watcher from "./core/Watcher";
import Compile from "./compiler/Compile";
import {mergeOptions, toArray} from "./utils";
import directives from './directives/handles.js';
import Dep from "./core/Dep";

class Vue {
    constructor(options) {
        this._init(options);
        return this;
    }

    // 初始化数据和方法
    _init(options) {
        this.$parent = options.parent;
        // 观察者实例
        this._watchers = [];
        // Vue实例
        this._isVue = true;
        // 根组件
        this.$root = this.$parent ? this.$parent.$root: this;
        // 存放子组件
        this.$children = [];
        if (this.$parent) {
            this.$parent.$children.push(this)
        }

        // 合并参数
        options = this.$options = mergeOptions(this.constructor.options, options, this);
        this._callHook('beforeCreate');

        this._initMixins();
        this._initData();
        this._initMethods();
        this._initWatch();
        this._initComputed();
        this._callHook('created');

        if (options.el) {
            // Vuex也用的Vue，但是没模板，所以判断一下
            this._compile();
        }
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

    _initMixins() {
        let options = this.$options;
        if (options.mixin) {
            this.$options = mergeOptions(options, options.mixin);
        }
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

    _initComputed() {
        if (this.$options.computed) {
            const computed = this.$options.computed;
            Object.keys(computed).forEach(key => {
                Object.defineProperty(this, key, {
                    enumerable: true,
                    configurable: true,
                    get: makeComputedGetter(computed[key], this),
                    set: noop
                })
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

    // 生命周期钩子函数
    _callHook(hook) {
        const handlers = this.$options[hook];
        if (typeof handlers === 'function') {
            handlers.call(this)
        } else if (handlers) {
            handlers.forEach(handler => {
                handler.call(this)
            })
        }
    }

    _compile() {
        this._textNodes = []; // 存放文本节点 在compile中使用
        new Compile(this.$options.el, this);
    }
}

Vue.options = {
    directives,
    components: {},
    filters: {},
};

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


window.Vue = Vue;

// 空操作
function noop() {}

// 生成计算属性getter
function makeComputedGetter(getter, vm) {
    const watcher = new Watcher(vm, getter, null, {
        lazy: true
    });
    return function computedGetter() {
        if (watcher.dirty) {
            watcher.evaluate()
        }
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}

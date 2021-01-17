function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key) {return fn(obj[key], key)})
}

class Module {
    constructor(newModule) {
        this._raw = newModule;
        this._children = {};
        this.state = newModule.state;
    }

    getChild(key) {
        return this._children[key];
    }

    addChild(key, module) {
        this._children[key] = module;
    }

    forEachMutation(fn) {
        if (this._raw.mutations) {
            forEachValue(this._raw.mutations, fn);
        }
    }

    forEachAction(fn) {
        if (this._raw.actions) {
            forEachValue(this._raw.actions, fn);
        }
    }

    forEachGetter(fn) {
        if (this._raw.getters) {
            forEachValue(this._raw.getters, fn);
        }
    }

    forEachChild(fn) {
        forEachValue(this._children, fn);
    }
}

// 收集模块
// this.root = {
//     _raw: '根模块',
//     _children:{
//         a:{
//             _raw:"a模块",
//             _children:{
//                 c:{
//                     .....
//                 }
//             },
//             state:'a的状态'
//         },
//         b:{
//             _raw:"b模块",
//             _children:{},
//             state:'b的状态'
//         }
//     },
//     state:'根模块自己的状态'
// }
class ModuleCollection {
    constructor(options) {
        // 注册模块
        this.register([], options);
    }
    register(path, rootModule) {
        let newModule = new Module(rootModule);

        if (path.length === 0) {
            // 说明是根模块
            this.root = newModule;
        }
        else {
            let parent = path.splice(0, -1).reduce((memo, current) => {
                return memo.getChild(current);
            }, this.root);
            // todo
            parent.addChild(path[path.length - 1], newModule);
        }

        if (rootModule.modules) {
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module);
            })
        }

    }
}

function installModule(store, rootState, path, module) {
    module.forEachMutation((mutation, key) => {
        store._mutations[key] = (store._mutations[key] || []);
        store._mutations[key].push((payload) => {
            mutation.call(store, module.state, payload);
        })
    });

    module.forEachAction((action, key) => {
        store._actions[key] = (store._actions[key] || []);
        store._actions[key].push((payload) => {
            action.call(store, store, payload);
        })
    });

    module.forEachGetter((getter, key) => {
        store._wrapperGetters[key] = function () {
            return getter(module.state);
        }
    });

    module.forEachChild((child, key) => {
       installModule(store, rootState, path.concat(key), child);
    });
}

function resetStoreVM(store, state) {
    const computed = {}; // 计算属性
    store.getters = {};
    forEachValue(store._wrapperGetters, (fn, key) => {
        computed[key] = () => fn(this.state);
        Object.defineProperty(store.getters, key, {
            get: () => fn(store._vm[key])
        })
    });

    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed: computed
    });
}

class Store {
    constructor(options) {
        // 创建一个Vue实例并把store.state挂载到Vue的options上
        // 使得store.state变为响应式数据
        if (window.Vue) {
            install(window.Vue);
        }

        const state = options.state;
        this._mutations = {};
        this._actions = {};
        this._wrapperGetters = {};

        // 1. 模块收集
        this._modules = new ModuleCollection(options);

        // 2. 安装模块
        installModule(this, state, [], this._modules.root);

        // 3. 将状态和getters都定义在当前的vm上
        resetStoreVM(this, state);
    }

    get state() {
        return this._vm._data.$$state;
    }

    // Action与Mutation作用相同都是变更store.state中的数据，
    // 但是Action可以包含异步操作
    dispatch(type, payload) {
        this._actions[type].forEach(action => action.call(this, payload));
    }

    commit(type, payload) {
        this._mutations[type].forEach(mutation => mutation.call(this, payload));
    }

}

let Vue;
// Vue.use(plugin)
// Vue.use(Vuex)使得每个组件都可以拥有store实例
function install(_Vue) {
    Vue = _Vue;
    // Vue.mixin的作用是将mixin的内容混入到Vue的初始参数options中
    Vue.mixin({
        // 在beforeCreated阶段，$options还未初始化
        beforeCreate() {
            let options = this.$options;
            if (options.store) { // 如果是根组件
                this.$store = options.store;
            }
            else if (options.parent && options.parent.$store) { // 如果是子组件
                // 子组件的beforeCreated执行时，父组件已经执行完beforeCreated了，所以有$store了
                this.$store = options.parent.$store;
            }
        }
    })
}

let FakeVuex = {
    Store,
    install
};
window.FakeVuex = FakeVuex;

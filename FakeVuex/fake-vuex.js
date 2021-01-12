class Store {
    constructor(options) {
        // 创建一个Vue实例并把store.state挂载到Vue的options上
        // 使得store.state变为响应式数据
        this._vm = new Vue({
            data: {
                state: options.$state
            }
        });

        // getter
        let getters = options.getter || {};
        this.getters = {};
        Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get() {
                    return getters[getterName](this.state)
                }
            })
        });

        // mutation
        // this.$store.commit('XX', y)
        let mutations = options.mutations || {};
        this.mutations = {};
        Object.keys(mutations).forEach(mutationName => {
           this.mutations[mutationName] = (payload) => {
               mutations[mutationName](this.state, payload)
           }
        });

        // action
        // actions: {
        //      commit 是对this的解构，就是store实例
        //     asyncIncre({commit},arg){
        //         setTimeout(()=>{
        //             commit('incre',arg)
        //         },1000)
        //     }
        // },
        let actions = options.actions;
        this.actions = {};
        Object.keys(actions).forEach(actionName => {
            this.actions[actionName] = (payload) => {
                actions[actionName](this, payload);
            }
        })
    }

    get state() {
        return this._vm.state;
    }

    // Action与Mutation作用相同都是变更store.state中的数据，
    // 但是Action可以包含异步操作
    dispatch(type, payload) {
        return this.actions[type](payload);
    }

    commit(type, payload) {
        return this.mutations[type](payload);
    }

}

const prototypeAccessors = {state: {configurable: true}};

prototypeAccessors.state.get = function () {
    return this._vm._data.$$state
};

prototypeAccessors.state.set = function () {
};

Object.defineProperties(Store.prototype, prototypeAccessors);

// getters转换为Vue中的计算属性，从而实现依赖改变getter重新求值
Store.prototype.initGetters = function (getters) {
    let computed = {};
    Object.keys(getters).forEach(key => {
        computed[key] = () => getters[key](this.state);
    });
    return computed;
};

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
export default FakeVuex;

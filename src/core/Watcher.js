import Dep from "./Dep";

let uid = 0; // watcher实例的ID

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        vm._watchers.push(this);

        this.id = uid++;
        this.vm = vm;
        this.cb = cb;
        this.expOrFn = expOrFn;

        this.deps = [];
        this.depIds = new Set();

        this.value = this.get(); // 将自己添加到订阅器的操作
    }

    get() {
        window.target = this; // 缓存
        let value = this.vm.data[this.expOrFn];
        window.target = null; // 释放
        return value;
    }

    update() {
        const oldValue = this.value;
        this.value = this.get();
        console.log("oldValue " + oldValue);
        console.log("newValue " + this.value);
        this.cb.call(this.vm, this.value, oldValue);
    }

    addDep(dep) {
        // dep 和 watcher是多对多的关系
        if (!this.depIds.has(dep.id)) {
            this.deps.push(dep);
            this.depIds.add(dep.id);
            dep.addSub(this);
        }
    }
}

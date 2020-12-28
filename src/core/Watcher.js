export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        this.expOrFn = expOrFn;
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
}

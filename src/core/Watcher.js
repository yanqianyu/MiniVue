import Dep from "./Dep";
import {extend} from "../utils";

let uid = 0; // watcher实例的ID

export default class Watcher {
    constructor(vm, expOrFn, cb, options) {
        vm._watchers.push(this);

        if (options) {
            extend(this, options);
        }

        this.id = uid++;
        this.vm = vm;
        this.cb = cb;
        this.expOrFn = expOrFn;

        // 计算属性需要用到
        this.dirty = this.lazy;

        this.deps = [];
        this.depIds = new Set();

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
            this.setter = undefined;
        }
        else {
            const res = parseExpression(expOrFn);
            this.getter = res.get;
            this.setter = (value) => {
                vm[expOrFn] = value
            }
        }

        if (this.lazy) {
            this.value = undefined;
        }
        else {
            this.value = this.get(); // 将自己添加到订阅器的操作
        }
    }

    get() {
        const vm = this.vm;
        Dep.target = this; // 缓存
        let value = this.getter.call(vm, vm);
        Dep.target = null; // 释放
        return value;
    }

    set(value) {
        this.setter.call(this.vm, value);
    }

    update() {
        if (this.lazy) {
            this.dirty = true;
        }
        else {
            const oldValue = this.value;
            this.value = this.get();
            console.log("oldValue " + oldValue);
            console.log("newValue " + this.value);
            this.cb.call(this.vm, this.value, oldValue);
        }
    }

    addDep(dep) {
        // dep 和 watcher是多对多的关系
        if (!this.depIds.has(dep.id)) {
            this.deps.push(dep);
            this.depIds.add(dep.id);
            dep.addSub(this);
        }
    }

    evaluate() {
        const cur = Dep.target;
        this.value = this.get();
        this.dirty = false;
        Dep.target = cur;
    }

    depend() {
        this.deps.forEach(dep => dep.depend());
    }
}

// 如果要对{{obj.a.b.msg}} 求值 则建一个函数 返回 vm.obj.a.b.msg 值
function parseExpression(exp) {
    exp = exp.trim();
    const res = {exp};
    res.get = makeGetterFn(exp);
    return res
}

function makeGetterFn(body) {
    return new Function('vm', 'return vm.' + body)
}

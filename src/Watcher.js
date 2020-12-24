import Dep from "./Dep";

// expOrFn 为表达式或一个变量名
function Watcher(vm, expOrFn, callback) {
    vm._watchers.push(this);
    this.vm = vm;
    this.deps = [];
    this.cb = callback;

    this.getter = () => vm[expOrFn];
    this.setter = (val) => {
        vm[expOrFn] = val;
    };

    this.value = this.get();
}

Watcher.prototype.update = function () {
    const value = this.get();
    const oldVal = this.value;

    if (value !== oldVal) {
        this.cb.call(this.vm, value, oldVal);
    }

    this.value = value;
};

Watcher.prototype.get = function () {
    Dep.target = this;
    const value = this.getter();
    Dep.target = null;
    return value;
};

Watcher.prototype.set = function (val) {
    this.setter(val);
};

Watcher.prototype.addDep = function (dep) {
    if (this.deps.indexOf(dep) !== -1) {
        this.deps.push(dep);
        dep.addSub(this);
    }
};

export default Watcher;

import Dep from "./Dep";

function Watcher(vm, node, name) {
    // 将自己赋值给Dep函数对象的全局变量
    Dep.global = this;
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.update();
    Dep.global = null;
}

Watcher.prototype.update = function () {
    this.get();
    // 判断节点的类型改变试图的值
    switch (this.node.nodeType) {
        case 1:
            this.node.value = this.value;
            break;
        case 3:
            this.node.nodeValue = this.value;
            break;
        default:
            break;
    }
}

Watcher.prototype.get = function () {
    // 把this的value值赋值，触发data的defineProperty方法中的get方法
    this.value = this.vm[this.name];
}

export default Watcher;

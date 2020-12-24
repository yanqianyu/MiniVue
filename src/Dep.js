// Dep.target为watcher实例
Dep.target = null;

function Dep() {
    this.subs = [];
}

Dep.prototype = {
    depend() {
        // Dep.target为watcher实例
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    },
    addSub: function (sub) {
        // 增加订阅者
        this.subs.push(sub)
    },
    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            console.log(sub);
            // 触发订阅者update的通知方法
            sub.update();
        })
    }
};

export default Dep;

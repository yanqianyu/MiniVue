// Dep.target为watcher实例
Dep.target = null;

let uid = 0;

class Dep {
    constructor() {
        this.is = uid++;
        this.subs = [];
    }

    addSub (sub) {
        // 增加订阅者
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    }

    depend() {
        // Dep.target为watcher实例
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    notify () {
        // vue2.6这里还涉及了排序
        this.subs.forEach(function (sub) {
            console.log(sub);
            // 触发订阅者update的通知方法
            sub.update();
        })
    }
}

export default Dep;

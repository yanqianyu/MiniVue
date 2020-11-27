function Dep() {
    this.subs = [];
}

Dep.prototype = {
    add: function (sub) {
        // 增加订阅者
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            console.log(sub);
            // 触发订阅者update的通知方法
            sub.update();
        })
    }
}

export default Dep;

let did = 0;

export default class Dep {
    constructor() {
        this.id = did++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        remove(this.subs, sub);
    }

    depend() {
        if (Dep.target) {
            this.addSub(Dep.target);
            Dep.target.addDep(this);
        }
    }

    notify() {
        // stabilize the subscriber list first
        const subs = this.subs.slice();
        for(let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}

Dep.target = null;

function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}

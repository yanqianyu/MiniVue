import Dep from "./Dep";

export function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    // 递归
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key]);
    })
}

function defineReactive(data, key, val) {
    observe(val);

    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('get value of ' + key);
            dep.depend(); // 收集依赖
            return val;
        },
        set: function (newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            console.log('set value of ' + key);
            dep.notify(); // 触发更新
        }
    })
}

window.target = null;

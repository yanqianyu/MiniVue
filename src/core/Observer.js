import Dep from "./Dep";
import {def, hasOwn} from "../utils";

export default function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }

    let ob;
    if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
        ob = data.__ob__;
    }
    else if(!data._isVue) {
        ob = new Observer(data);
    }

    return ob;
}

export class Observer {
    constructor(data) {
        this.data = data;
        this.dep = new Dep();

        def(data, '__ob__', this);
        // 递归
        Object.keys(data).forEach(function (key) {
            defineReactive(data, key, data[key]);
        })
    }
}

function defineReactive(data, key, val) {
    // 递归子属性
    if (typeof val === 'object') {
        new Observer(data);
    }

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

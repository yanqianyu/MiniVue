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
        const keys = Object.keys(data);
        for (let i = 0, len = keys.length; i < len; i++) {
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}

function defineReactive(data, key, val) {
    let dep = new Dep();
    // 递归子属性
    let childOb = observe(val);
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if(Dep.target) {
                console.log(Dep.target);
                console.log('get value of ' + key);
                dep.depend(); // 收集依赖
                if (childOb) {
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set: function (newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            console.log('set value of ' + key + ' with ' + val);
            childOb = observe(newVal);
            dep.notify(); // 触发更新
        }
    })
}


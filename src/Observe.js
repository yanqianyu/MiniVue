import {defineReactive} from "./Compile";

export function observe(obj, vm) {
    Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
    })
}


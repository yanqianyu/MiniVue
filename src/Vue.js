import {observe} from "./core/Observer";
import Watcher from "./core/Watcher";
import Compile from "./compiler/Compile";


class Vue {
    constructor(options) {
       this.data = options.data;
       let self = this;

       Object.keys(this.data).forEach(function (key) {
           self.proxyKeys(key);
       });

       observe(this.data);
       new Compile(options.el, this);
       return this;
    }

    // this.data.XXX -> this.XXX
    proxyKeys(key) {
        let self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function () {
                return self.data[key];
            },
            set: function (newVal) {
                self.data[key] = newVal;
            }
        })
    }
}

window.Vue = Vue;

import {observe} from "./core/Observer";
import Watcher from "./core/Watcher";

class Vue {
    constructor(data, el, exp) {
       this.data = data;
       console.log(this);
       observe(data);
       el.innerHTML = this.data[exp];

       new Watcher(this, exp, function (value) {
           el.innerHTML = value;
       });
        return this;
    }
}

window.Vue = Vue;

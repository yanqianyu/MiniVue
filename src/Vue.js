import {nodeContainer} from "./Compile";
import {observe} from "./Observe";

// vue对象
function Vue(options) {
    this.data = options.data;
    var data = this.data;

    observe(data, this);

    var id = options.el;
    console.log(id);
    var dom = nodeContainer(document.getElementById(id), this);
    document.getElementById(id).appendChild(dom);
}

window.Vue = Vue;

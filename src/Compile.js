import Watcher from "./Watcher";

function Compile(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.onRe = /^(v-on:|@)/;
    this.modelRe = /^v-model/;
    this.bindRe = /^(v-bind:|:)/;
    this.dirs = [];
    this.init();
}

Compile.prototype = {
    init() {

    },

    parse(el) {
        const attrs = el.attributes;

    }
};

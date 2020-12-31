// 解析和绑定
// 1. 解析模版指令，并替换模板数据，初始化数据
// 2. 将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器

import Watcher from "../core/Watcher";
import handles from "../directives/handles";

const onRE = /^(v-on:|@)/;
const modelRE = /^v-model/;
const bindRE = /^(v-bind:|:)/;
const textRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const textRE2 = /[{}]/g;
export default class Compile {
    constructor(el, vm) {
        this.el = document.querySelector(el);
        this.vm = vm;
        this.dirs = []; // 指令
        this.handles = handles;
        this.init();
    }

    init() {
        this.parse(this.el);
        this.render();
    }

    addDir(handle, dirName, name, value, el) {
        this.dirs.push({
            vm: this.vm,
            dirName,
            handle,
            rawName: name,
            expOrFn: value,
            el
        })
    }

    parse(el) {
        const attrs = el.attributes;
        let name;
        let that = this;
        // [].slice.call 考虑兼容性
        [].slice.call(attrs).forEach(function (attr) {
            if (onRE.test(attr.name)) {
                // v-on
            }
            else if (bindRE.test(attr.name)) {
                // v-bind
            }
            else if (modelRE.test(attr.name)) {
                // v-model
                name = attr.name.replace(modelRE, '');
                that.addDir(that.handles.model, name, attr.name, attr.value, el);
            }
        });

        const children = el.childNodes;
        [].slice.call(children).forEach(ele => {
            switch (ele.nodeType) {
                // element node
                case 1:
                    this.parse(ele); break;
                // text node
                case 3:
                    if (textRE.test(ele.nodeValue)) {
                        this.vm._textNodes.push(ele);
                    }
                    break;
            }
        })
    }

    render() {
        const vm = this.vm;
        const that = this;
        this.dirs.forEach(dir => {
            const handle = dir.handle;
            if (handle.implement) {
                handle.implement(dir.vm, dir.el, dir.dirName, dir.expOrFn);
            }

            new Watcher(this.vm, dir.expOrFn, function (newVal, oldVal) {
                handle.update(dir.vm, dir.el, dir.expOrFn, newVal, oldVal);
            });
        });

        const handles = this.handles.textNode;
        vm._textNodes.forEach(e => {
            let array = e.nodeValue.match(textRE);
            let rawValue = e.nodeValue;
            array.forEach(str => {
                let variable = str.replace(textRE2, ''); // 去掉{{}}
                handles.implement(vm, e, variable);
                new Watcher(vm, variable, function (newVal, oldVal) {
                    handles.update(vm, newVal, oldVal, e, variable, rawValue, textRE, textRE2);
                })
            })
        })
    }
}


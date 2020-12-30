// 解析和绑定
// 1. 解析模版指令，并替换模板数据，初始化数据
// 2. 将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器

import Watcher from "../core/Watcher";

const textRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
export default class Compile {
    constructor(el, vm) {
        this.el = document.querySelector(el);
        this.vm = vm;
        this.fragment = null;
        this.init();
    }

    init() {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        }
        else {
            console.log('Dom元素不存在')
        }
    }

    nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while(child) {
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    }

    compile(node) {
        let nodeAttrs = node.attributes;
        let self = this;
        [].slice.call(nodeAttrs).forEach(function (attr) {
            let attrName = attr.name;
            if (self.isDirective(attrName)) {
                let exp = attr.value;
                let dir = attrName.substring(2);
                if (self.isEventDirective(dir)) {
                    // v-on
                    self.compileEvent(node, self.vm, exp, dir);
                }
                else {
                    // v-model
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        })
    }

    compileElement(el) {
        let childNodes = el.childNodes;
        let self = this;
        // 使用slice将NodeList转为数组（兼容性）
        [].slice.call(childNodes).forEach(function (node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;

            if (self.isElementNode(node)) {
                self.compile(node);
            }
            else if (self.isTextNode(node)) {
                self.compileText(node, text);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node); // 递归遍历子节点
            }
        })
    }

    compileText(node, text) {
        // <p> {{}} {{}} </p>的情况
        let self = this;
        let match;

        // {{title}} {{name}}
        // 全局匹配慎用test方法
        while ((match = textRE.exec(text))) {
            let exp = match[1]; // title
            let initText = this.vm[exp];
            this.updateText(node, initText);
            new Watcher(this.vm, exp, function (value) {
                self.updateText(node, value);
            });
        }
    }

    compileEvent(node, vm, exp, dir) {
        //v-XX:YY
        let eventType = dir.split(":")[1];
        let cb = vm.methods && vm.methods[exp];
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    }

    compileModel(node, vm, exp, dir) {
        let self = this;
        let val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value);
        });

        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        })
    }

    updateText(node, value) {
        // todo {{}} {{}}
        node.textContent = typeof value == 'undefined' ? '' : value;
    }

    modelUpdater(node, value) {
        node.value = typeof value == 'undefined' ? '' : value;
    }

    isDirective(attr) {
        // v-XX
        return attr.indexOf('v-') === 0;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }

    isEventDirective(dir) {
        // v-on
        return dir.indexOf('on:') === 0;
    }
}


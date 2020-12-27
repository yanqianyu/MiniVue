// 解析和绑定
// 1. 解析模版指令，并替换模板数据，初始化数据
// 2. 将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器

import Watcher from "../core/Watcher";

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

    // 先只处理{{XXX}}
    compileElement(el) {
        let childNodes = el.childNodes;
        let self = this;
        [].slice.call(childNodes).forEach(function (node) {
            let reg = /\{\{(.*)\}\}/;
            let text = node.textContent;

            if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node); // 递归遍历子节点
            }
        })
    }

    compileText(node, exp) {
        let self = this;
        let initText = this.vm[exp];
        console.log(initText);
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        })
    }

    updateText(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }
}


// 针对各种指令的回调函数
export default {
    on: {
        implement(vm, el, name, expOrFn) {
            el['on' + name] = vm[expOrFn].bind(vm);
        },
        update(vm, el, expOrFn, newVal, oldVal) {

        }
    },
    bind: {
        implement(vm, el, name, expOrFn) {
            el.setAttribute(expOrFn, vm[expOrFn]);
        },
        update(vm, el, expOrFn, newVal, oldVal) {
            el.setAttribute(expOrFn, newVal);
        }
    },
    model: {
        implement(vm, el, name, expOrFn) {
            el.value = vm[expOrFn];
            el.oninput = function () {
                vm[expOrFn] = this.value; // input中this指向input输入框
            }
        },
        update(vm, el, expOrFn, newValue, oldValue) {
            el.value = newValue;
        }
    },
    textNode: {
        implement(vm, textNode, variable) {
            textNode.nodeValue = textNode.nodeValue.replace(`{{${variable}}}`, vm[variable]);
        },
        update(vm, newVal, oldVal, textNode, variable, rawValue, re1, re2) {
            textNode.nodeValue = rawValue.replace(`{{${variable}}}`, newVal);
            let str = textNode.nodeValue;
            if (re1.test(str)) {
                let array = str.match(re1);
                array.forEach(e => {
                    let variable = e.replace(re2, '');
                    str = str.replace(e, vm[variable]);
                });
                textNode.nodeValue = str;
            }
        }
    },
    show: {
        implement(vm, el, name, expOrFn) {
            el.style.display = !!vm[expOrFn]? '': 'none';
        },
        update(vm, el, expOrFn, newVal, oldVal) {
            el.style.display = newVal? '': 'none';
        }
    }
}

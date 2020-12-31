// 针对各种指令的回调函数
export default {
    on: {
        implement(vm, el, name, expOrFn) {
            el['on' + name] = vm[expOrFn].bind(vm);
        },
        update(vm, el, expOrFn, newVal, oldVal) {

        }
    },
    model: {

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
    }
}

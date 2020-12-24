export default {
    bind: {
        implement(vm, el, name, expOrFn) {
            el.setAttribute(expOrFn, vm[expOrFn]);
        },
        update(vm, el, expOrFn, newVal, oldVal) {
            el.setAttribute(expOrFn, newVal);
        }
    }
}

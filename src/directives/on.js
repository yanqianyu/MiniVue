// v-on
export default {
    on: {
        implement(vm, el, name, expOrFn) {
            el['on' + name] = vm[expOrFn].bind(vm);
        },
        update(vm, el, expOrFn, newVal, oldVal) {

        }
    }
}

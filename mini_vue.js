// 虚拟节点容器
function nodeContainer(node, vm, flag) {
    var flag = flag || document.createDocumentFragment();

    var child;
    // 赋值作为判断条件，遍历所有的dom节点，
    // 如果遍历到底，node的firstChild就会undefined从而跳出while
    while(child = node.firstChild) {
        compile(child, vm);
        flag.appendChild(child);
        if (child.firstChild) {
            nodeContainer(child, vm, flag);
        }
    }
    return flag;
}

function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/g;
    if (node.nodeType === 1) {
        // 表示是个元素
        var attr = node.attributes;
        for(var i = 0; i < attr.length; i++) {
            // 判断节点中的指令是否含有v-model这个指令
            if (attr[i].nodeName === 'v-model') {
                var name = attr[i].nodeValue;

                node.addEventListener('input', function (e) {
                    vm[name] = e.target.value;
                })
                node.value = vm.data[name];
            }
        }
    }

    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1;
            name = name.trim();
            node.nodeValue = vm.data[name];
        }
    }
}

// vue对象
function Vue(options) {
    this.data = options.data;
    var data = this.data;

    observe(data, this);

    var id = options.el;
    var dom = nodeContainer(document.getElementById(id), this);
    document.getElementById(id).appendChild(dom);
}

function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        get: function () {
            return value;
        },
        set: function (newValue) {
            if (newValue === value) {
                return;
            }
            value = newValue;
        }
    })
}

function observe(obj, vm) {
    Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
    })
}

var Demo = new Vue({
    el: 'mvvm',
    data: {
        text: 'HelloWorld',
        d: '123'
    }
})

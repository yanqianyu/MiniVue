var obj = {};
// Object.defineProperty会直接在一个对象上定义一个新属性，
// 或者修改一个对象的现有属性，并返回这个对象
Object.defineProperty(obj, 'hello', {
    get: function () {
        // 拦截数据获取
        console.log("get方法被调用");
    },
    set: function (newValue) {
        // 拦截数据改变
        console.log("set方法被调用");
        document.getElementById('test').value = newValue;
        document.getElementById('test1').innerHTML = newValue;
    }
});

document.getElementById('test').addEventListener('input', function (e) {
    obj.hello = e.target.value;
})

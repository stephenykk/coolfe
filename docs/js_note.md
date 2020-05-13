# JS 知识点总结

## Array

### 高阶函数

```js
arr.every(cb);
arr.some(cb);
arr.filter(cb);
arr.forEach(cb);
arr.map(cb);
arr.reduce(cb);
arr.reduceRight(cb);
```

### 栈/队列操作

```js
arr.push(el); // => len
arr.pop(); // => el
arr.unshift(el); // => len
arr.shift(); // => el
```

### 排序

```js
arr.sort(cb);
arr.reverse(); // 反序
```

### 切片/合并

```js
arr.slice(start, end) // => slice
arr.splice(start, len, el1, el2, ...) // => remove slice
arr.concat(el1, el2, arr1) // => new arr, 参数为数组会自动展开
```

### 查元素/索引

```js
arr.indexOf(el); // => index or -1 严格相等比较 [1].indexOf('1') => -1
arr.lastIndexOf(el);
arr.find(cb);
arr.findIndex(cb);
arr.includes(el); // 严格相等比较 [1].includes('-1') => false
```

### 其他

```js
arr.fill(val);
arr.join(sep);

new Array(10).fill(1); // 生成指定数量元素的数组
Array.from(new Set([1,2,2,1])); // => [1,2] 生成数组 去重

```

## Function

### 具名函数

    ```js

    div.onclick = function showModal() {
        // 具名函数在函数体内总是可见的，方便调用自身
        console.log(typeof showModal)
    }

    ```

### arguments and arguments.callee.caller

```js
function foo() {
  // arguments   array-like object 不定参函数访问实参列表
  // arguments === foo.arguments
  var args = [].slice.call(arguments); // to real array
  console.log(args);

  // 引用函数自身，更推荐用具名函数
  // arguments.callee === foo
  console.log(arguments.callee.toString());

  // 调用当前函数的函数
  // arguments.callee.caller === foo.caller
  console.log(arguments.callee.caller.toString());
}

// 只有函数被调用时，arguments对象才会创建，未调用时其值为null
console.log("foo.arguments:", foo.arguments);

function main() {
  console.log("main start..");
  foo("hello", "world");
}
main();
```

### JSON.stringify(value[, replacer[, space]])

- value:
  必需， 要转换的 JavaScript 值（通常为对象或数组）。

- replacer:
  可选。用于转换结果的函数或数组。

  如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。

  如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。

- space:
  可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。

```js
var data = {
  name: "sandy",
  job: "singer",
  age: 28,
  home: { name: "hk", country: "cn" },
};

JSON.stingify(data);
JSON.stingify(data, null, 2);
JSON.stingify(data, null, "\t");

JSON.stringify(data, ["name", "job"], 2);

JSON.stringify(
  data,
  function (key, val) {
    // 逐层遍历data 初始时 key == '', val == data
    return typeof val === "string" ? "KK" + val : val;
  },
  2
);

JSON.stringify(
  data,
  function (key, val) {
    // 序列化结果不包含home字段
    return key === "home" ? undefined : val;
  },
  2
);
```

### fn.bind(thisObj, arg1, arg2, ..)

绑定函数上下文对象，还可以预设参数(_顺序绑定参数_), 返回偏函数

```js
var foo = function (a, b, c) {
  return (a - b) * c;
};
foo1 = foo.bind(null, 10, 2); // 顺序绑定多个预设参数
foo1(3); // => (10 - 2) * 3 => 24
```

### fn.call(thisObj, arg1, arg2, ...)

以指定对象为上下文，调用函数, 参数以列表形式传入

```js
var foo = function (a, b) {
  return (a - b) * this.times;
};
var obj = { times: 10 };
foo.call(obj, 10, 3); // => 70
```

### fn.apply(thisObj, args)

以指定对象为上下文，调用函数, 参数以数组形式传入 (_更灵活_)

```js
var foo = function (a, b) {
  return (a - b) * this.times;
};
var obj = { times: 10 };
foo.apply(obj, [10, 3]); // => 70
```

### setTimeout(fn, ms, args..)

```js
// setTimeout(要执行的代码, 等待的毫秒数)
// setTimeout(JavaScript函数, 等待的毫秒数)

// 1秒之后 eval('hello()')
setTimeout("hello()", 1000);
function hello() {
  console.log("hello world");
}

setTimeout(hello, 1000);

// setTimeout(fn, ms, args...)
setTimeout(
  function (name, feel) {
    console.log("hello,", name, "! how are you?", feel);
  },
  1000,
  "sandy",
  "good"
);
```

### new Function(arg, body)

显式创建一个函数，通常用来获取全局上下文对象

```js
// 一个参数都不传的情况  创建的就是一个空的函数
var emptyFn = new Function();

// 只传一个参数的情况 这个参数就是函数体
var hello = new Function("console.log('hello')");

// 传多个参数的情况，最后一个参数为函数体，前面的参数都是该函数的形参名
var sum = new Function("a", "b", "return a + b;");
console.log(sum(10, 20)); // => 30

// 获取全局对象
var getGlobal = new Function('return this');
console.log(getGlobal() === window) // in browser

var global = eval('this');
console.log(global === window)
```

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
Array.from(new Set([1, 2, 2, 1])); // => [1,2] 生成数组 去重
```

## Function

### IIF 立即执行函数

立即执行函数常用于创建独立的作用域，声明的变量不污染外部命名空间，或 返回闭包

```js
// 常用形式
(function () {
  console.log("call at once");
  var ms = 200;
  function hello() {
    console.log("hello world");
  }
  return function foo() {
    setTimeout(hello, ms);
  };
})();

+(function () {
  console.log("call at once too");
})();

!(function () {
  console.log("call at once too");
})();
```

### 形参数量 和 函数名

```js
function sum(a, b) {
  return a + b;
}
console.log(sum.length); // => 2
console.log(sum.name); // sum
```

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
var getGlobal = new Function("return this");
console.log(getGlobal() === window); // in browser

var global = eval("this");
console.log(global === window);
```

## Object

Object 是普通对象的构造函数，它上面有很多有用的方法(_内省方法_)

```js
//--- Object.assign 合并对象
// 将所有可枚举属性的值从一个或多个源对象复制到目标对象
Object.assign({}, defData, newData);

// 若 source包含getter, 要保证原样复制到目标，则应
Object.defineProperties(target, Object.getOwnPropertyDescriptors(soruce));

// 继承属性和不可枚举属性是不能拷贝的
const obj = Object.create(
  { foo: 1 },
  {
    // foo 是个继承属性。
    bar: {
      value: 2, // bar 是个不可枚举属性。
    },
    baz: {
      value: 3,
      enumerable: true, // baz 是个自身可枚举属性。
    },
  }
);
const copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }

// 原始类型会被包装为对象
const v1 = "abc";
const v2 = true;
const v3 = 10;
const v4 = Symbol("foo");
const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// 原始类型会被包装，null 和 undefined 会被忽略。
// 注意，只有字符串的包装对象才可能有自身可枚举属性。
console.log(obj); // { "0": "a", "1": "b", "2": "c" }

//--- deep clone
var cloneData = JSON.parse(JSON.stringify(data));

//--- Object.create(proto[, propertiesObject])
// Object.create 以某个对象为原型创建对象
var person = {
  hello: function () {
    console.log("hello! I am", this.name);
  },
};
var lucy = Object.create(person, {
  age: { value: 12, writable: true, enumerable: true, configurable: true },
});
lucy.name = "lucy";
lucy.hello();
console.log(lucy.age);
Object.getOwnPropertyDescriptor(lucy, "age");
console.log(lucy.__proto__ === person); // true

// 用 Object.create实现类式继承
function Shape() {
  this.x = 0;
  this.y = 0;
}
Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
};
function Rectangle() {
  Shape.apply(this, arguments);
}
Rectangle.prototype = Object.create(Shape.prototype); // {__proto__}
// Rectangle.prototype = new Shape() // 原型对象是父类的实例({__proto__})
Rectangle.prototype.constructor = Rectangle;

// 创建一个原型为null的空对象
o = Object.create(null);

// getter setter
var alice = Object.create(person, {
  // 省略了的属性特性默认为false,所以属性p是不可写,不可枚举,不可配置的:
  p: { value: 12 },
  _name: { value: "alice", writable: true },
  name: {
    // getter setter 内 this指向当前对象
    get: function () {
      return this._name;
    },
    set: function (val) {
      console.log("in setter this:", this);
      this._name = val;
    },
  },
});

// 没有指定 enumerable: true , 默认不可枚举
alice.propertyIsEnumerable("_name"); // false

//--- Object.defineProperties(obj, props)
// 直接在一个对象上定义新的属性或修改现有属性，并返回该对象。
// vue下，把响应式的对象属性复制到别的对象上
var alice = { name: "alice" };
ret = Object.defineProperties(alice, {
  age: { value: 12, writable: true },
  fav: { value: "shop", writable: true, enumerable: true },
});
console.log(ret === alice); // true
Object.keys(alice); // ['alice', 'fav']

//--- Object.defineProperty(obj, propName, descriptor)
// 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
// descriptor = {value, writable, enumerable, configurable, get , set}
var alice = { name: "alice" };
ret = Object.defineProperty(alice, "tall", { value: true, writable: true });
console.log(ret === alice);

// 继承的属性y不可写，则本地属性y，创建不了
let proto = Object.defineProperty({}, "y", { value: 1, configurable: true });
let foo = Object.create(proto, { x: { value: 1, writable: true } });
foo.x = 2;
console.log(foo.x); // 2
foo.y = 2;
console.log(foo.y); // 1
foo.hasOwnProperty("y"); // false

//--- 遍历对象
var lufy = { name: "lufy", age: 12, job: "captin" };
Object.entries(lufy); // 返回 可枚举属性的键值对数组 二维数组
// 方便的遍历方式
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}
// obj -> map
var obj = { foo: "bar", baz: 42 };
var map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }

// map -> obj
var arr = [
  ["foo", "food"],
  ["coo", "cool"],
];
Object.fromEntries(arr); // 键值对数组(二维数组)转换为对象
Object.fromEntries(map);

// obj map values
Object.fromEntries(Object.entries(lufy).map(([key, val]) => [key, val + "kk"]));

Object.defineProperty(lufy, "skill", { value: "stretch" });
Object.keys(lufy); // 返回 可枚举属性列表
Object.values(lufy); // 返回 可枚举属性对应的值列表
Object.getOwnPropertyNames(lufy); // 返回自有属性列表 不管是否可枚举
Object.getOwnPropertySymbols(obj); // 获取自有symbol属性列表

//--- in and for .. in
var zoro = {};
Object.defineProperty(zoro, "name", { value: "zoro" });
Object.defineProperty(zoro, "skill", { value: "sword", configurable: true });
// in 运算符 判断属性在对象上能否访问(不管是自有的还是继承的)
"name" in zoro; // true
// for .. in 只能遍历可枚举属性(不管是自有的还是继承的)
var hunter = { lonely: true };
Object.setPrototypeOf(zoro, hunter);
for (var p in zoro) console.log(p); // skill lonely,

//-- 获取和设置原型对象
// Object.getPrototypeOf(obj)
// Object.setPrototypeOf(obj, proto)
var sandy = Object.create(person, {
  name: { value: "sandy", writable: true },
  job: { value: "singer", writable: true, configurable: true },
});
Object.getPrototypeOf(sandy);
var singer = {
  hello: function () {
    console.log("hi~, I am", this.name, "Nice to see you!");
  },
};
Object.setPrototypeOf(sandy, singer);
sandy.hello();

//--- 获取属性描述符对象
Object.getOwnPropertyDescriptor(sandy, "job");
Object.getOwnPropertyDescriptors(sandy);

//--- 判断相同值
// Object.is(val1, val2) 有别于 == 和 === 比较, 不会做隐式类型转换
Object.is(window, window); // true
Object.is(null, undefined); // false
Object.is(NaN, NaN); // true
Object.is("hi", "hi"); // true
Object.is(-0, -0); // true
Object.is(0, -0); // false
Object.is(0, +0); // false
Object.is([], []); // false

//--- 对象扩展 冻结 密封

// 冻结
// 指对象不可扩展，所有属性都是不可配置的(configurable)，且所有数据属性（即没有getter或setter组件的访问器的属性）都是不可写的(writable)。
// 即 不可以: 加属性,删属性, 修改属性值
var comic = { name: "fullmetal", year: 2010 };
Object.freeze(comic); // return comic
Object.isFrozen(comic); // true 对象不可扩展 所有属性只读且不可配置
// 以下都无效
comic.hero = "yuki";
delete comic.name;
comic.year = 2011;
// 一个不可扩展的空对象同时也是一个冻结对象.
var vacuouslyFrozen = Object.preventExtensions({});
Object.isFrozen(vacuouslyFrozen); //=== true;
// 一个冻结对象也是一个密封对象.
Object.isSealed(frozenObj); //=== true
// 当然,更是一个不可扩展的对象.
Object.isExtensible(frozenObj); //=== false

// 密封
// 指不可扩展，且所有自身属性都不可配置（但不一定是不可写）
// 即 不可以：加属性，删属性
var book = { name: "two city", price: 12 };
Object.seal(book); // return book
Object.isSealed(book); // true 对象不可扩展 所有属性不可配置
// 以下无效
book.name = "war and peace";
book.author = "winter";

// 不可扩展
// 即 不可以： 加属性
var book2 = { name: "two city", price: 12 };
Object.preventExtensions(book2);
Object.isExtensible(book2);
// 以下无效
book2.from = "england";
```

普通对象的方法

```js
obj.hasOwnProperty(key);
obj.propertyIsEnumerable(key);
obj.isPrototypeOf(o);
obj.toString();
obj.valueOf();
obj.__proto__; // 访问原型对象
```

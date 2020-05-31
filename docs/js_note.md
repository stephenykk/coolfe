# JS 知识点总结

## let const

let，const 定义变量，即使在最外层也不会变成 window 的属性，只有 var 定义的变量才会成为 window 的属性。

## String

### str.replace

`stringObject.replace(regexp/substr,replacement)`  
replacement 必需。字符串 / 生成替换文本的函数  
replacement 中的 \$ 字符具有特定的含义。如下表所示，它说明从模式匹配得到的字符串将用于替换。

| 字符                           | 替换文本                                            |
| ------------------------------ | --------------------------------------------------- |
| $1、$2、...、\$99              | 与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。 |
| \$&                            | 与 regexp 相匹配的子串。                            |
| \$` | 位于匹配子串左侧的文本。 |
| \$'                            | 位于匹配子串右侧的文本。                            |
| \$\$                           | 直接量符号。                                        |

```js
name = "Doe, John";
name.replace(/(\w+)\s*, \s*(\w+)/, "$2 $1"); // John Doe

comic = "one piece";
comic.replace(/\s/, "$&-$&"); // one - piece
comic.replace(/\s/, "$'"); // onepiecepiece
comic.replace(/\s/, "$`"); // oneonepiece
comic.replace(/\s(\w)/, "-$1"); // one-piece
comic.replace(/\s/, "$$"); // one$piece
```

## 正则

- `.` 匹配单个任意字符，除了换行和行结束符。

- `|` 左右两边表达式之间 "或" 关系，匹配左边或者右边。

  ```js
  "I'm Tom, he is Jack".match(/Tom|Jack/); // Tom
  ```

- `()` 用于定义捕获组，可以单独拿到捕获组匹配项，捕获组内的匹配模式也可以被整体修饰。

  ```js
  "Let's go go go!".match(/(go\s*){3}/); // go go go
  RegExp.$1; //=>go

  "＄10.9,￥20.5".match(/(￥)(\d+\.?\d*)/); // ￥20.5
  RegExp.$1; //=> ￥
  RegExp.$2; //=> 20.5
  ```

- `[]` 匹配任意包含在[]内的一系列字符中的任意一个，不是多个。

  ```js
  "fgo".match(/[f-k]/); // fg
  ```

- `[^]` 匹配任意不包含在[]内的一系列字符中的任意一个，不是多个。
  ```js
  // [^abc]匹配 "a","b","c" 之外的任意一个字符，
  // [^A-F0-3]匹配 "A"到"F","0"到"3" 之外的任意一个字符
  ```
- `n$` 匹配任何结尾为 n 的字符串。

- `^n` 匹配任何开头为 n 的字符串。

- `?=n` 匹配任何其后紧接指定字符串 n 的字符串。

- `?!n` 匹配任何其后没有紧接指定字符串 n 的字符串。

- `(?:n)` 表示不输出捕获组信息。

- 捕获组与反向引用  
  捕获组：`()` 用于定义捕获组 `<td>(.*?)</td>`  
  反向引用：  
   小括号包含的表达式所匹配到的字符串不仅是在匹配结束后才可以使用， 在匹配过程中也可以使用.

  引用方法: 第 1 个左括号`(`捕获的内容, 对应 `/1`; 第 2 个左括号`(`捕获的内容, 对应 `/2` ...

  ```js
  '"hello"'.match(/('|")(.*?)(\1)/); // "hello"
  ```

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

### new 调用

判断是否 new func

```js
function Vue(options) {
  if (!(this instanceof Vue)) {
    warn("should use new Vue()");
  }

  this._init(options);
}
```

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

## 异步

[setTimeout 和 setImmediate 到底谁先执行，本文让你彻底理解 Event Loop](https://juejin.im/post/5e782486518825490455fb17)

[从 Generator 入手读懂 co 模块源码](https://www.cnblogs.com/dennisj/p/12744022.html)

## 内存

[JavaScript 的内存管理](https://juejin.im/post/5e2155cee51d4552455a8878)

JS 有如下数据类型

- 原始数据类型：String, Number, Boolean, Null, Undefined, Symbol
- 引用数据类型：Object

而存放这些数据的内存又可以分为两部分：栈内存（Stack）和堆内存（Heap）。

> 原始数据类型存在栈中，引用类型存在堆中。

### 栈内存

后进先出

### 堆内存

JS 中原始数据类型的内存大小是固定的，由系统自动分配内存。但是引用数据类型，比如 Object, Array，他们的大小不是固定的，所以是存在堆内存的。

JS 不允许直接操作堆内存，我们在操作对象时，操作的实际是对象的引用，而不是实际的对象。可以理解为对象在栈里面存了一个内存地址，这个地址指向了堆里面实际的对象。

### 垃圾回收

垃圾回收就是找出那些不再继续使用的变量，然后释放其占用的内存，垃圾回收器会按照固定的时间间隔周期性执行这一操作。

### 引用计数

使用引用计数会有一个很严重的问题：循环引用。循环引用指的是对象 A 中包含一个指向对象 B 的指针，而对象 B 中也包含一个指向对象 A 的引用。

```js
function problem() {
  var objectA = {};
  var objectB = {};

  objectA.a = objectB;
  objectB.b = objectA;
}
```

在这个例子中，objectA 和 objectB 通过各自的属性相互引用；也就是说，这两个对象的引用次数都是 2。当函数执行完毕后，objectA 和 objectB 还将继续存在，因为它们的引用次数永远不会是 0。

因为引用计数有这样的问题，现在浏览器已经不再使用这个算法了，这个算法主要存在于 IE 8 及以前的版本，现代浏览器更多的采用**标记-清除算法**

在老版的 IE 中一部分对象并不是原生 JavaScript 对象。例如，其 BOM 和 DOM 中的对象就是使用 C++以 COM（Component Object Model，组件对象模型）对象的形式实现的，而 COM 对象的垃圾 收集机制采用的就是引用计数策略。

```js
// dom对象 与 js对象 之间的循环引用
// 即使dom对象从页面移除，它占用的内存也不会被回收
var element = document.getElementById("some_element");
var myObject = new Object();
myObject.element = element;
element.someObject = myObject;

// 断开引用
myObject.element = null;
element.someObject = null;
```

> 为了解决上述问题，IE9 把 BOM 和 DOM 对象都转换成了真正的 JavaScript 对象。这样，就避免了两种垃圾收集算法并存导致的问题，也消除了常见的内存泄漏现象。

### 标记-清除算法

标记-清除算法就是当变量进入环境是，这个变量标记为“进入环境”；而当变量离开环境时，标记为“离开环境”，当垃圾回收时销毁那些带标记的值并回收他们的内存空间。

这里说的环境就是执行环境，执行环境定义了变量或函数有权访问的数据。每个执行环境都有一个与之关联的变量对象（variable object），环境中所定义的所有变量和函数都保存在这个对象中。执行环境中所有代码执行完毕后，该环境及其变量对象被销毁。

### 全局执行环境

在浏览器中，全局环境是 window，Node.js 中是 global 对象。

### 局部执行环境

每个函数都有自己的执行上下文。当执行流进入一个函数时，函数的上下文(EC)会被推入一个执行上下文栈(EC stack)中。当这个函数执行之后，栈将其执行上下文弹出，把控制权返回给之前的执行上下文。

造成内存泄漏的场景:

1. 全局变量会存在于整个应用生命周期，应用不退出不会回收，使用严格模式可以避免这种情况
2. 闭包因为自身特性，将函数内部变量暴露到了外部作用域，当其自身执行结束时，所暴露的变量并不会回收
3. 没有 clear 的定时器

### V8 的内存管理

V8 是有内存限制的，因为它最开始是为浏览器设计的，不太可能遇到大量内存的使用场景。关键原因还是垃圾回收所导致的线程暂停执行的时间过长。

Node.js 是可以通过配置修改内存限制的，更好的做法是使用 Buffer 对象，因为 Buffer 的内存是底层 C++分配的，不占用 JS 内存，所以他也就不受 V8 限制。

V8 采用了分代回收的策略，将内存分为两个生代：新生代和老生代

## 函数式编程

[常用 JS 函数-数组扁平化，缓存函数，柯里化函数，防抖和节流函数](https://juejin.im/post/5e3ff97de51d4527214ba3c9)  
[JavaScript 中的 compose 函数和 pipe 函数](https://juejin.im/post/5e3ff92be51d4526f16e3b90)  
[JavaScript 中的函数式编程](https://juejin.im/post/5e3ff8c4f265da57503cb7a8)

与函数式编程相对的是命令式编程 如下:

```js
// 数组每个数字加一, 命令式编程
let arr = [1, 2, 3, 4];
let newArr = [];
for (let i = 0; i < arr.length; i++) {
  newArr.push(arr[i] + 1);
}

console.log(newArr); // [2, 3, 4, 5]
```

函数式编程

```js
// 先拆加一出来
let add1 = (x) => x + 1;

// 然后拆遍历方法出来，通过遍历返回一个操作后的新数组
// fn是我们需要对每个数组想进行的操作
let createArr = (arr, fn) => {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(fn(arr[i]));
  }

  return newArr;
};

// 用这两个方法来得到我们期望的结果
const arr = [1, 2, 3, 4];
const newArr = createArr(arr, add1);
console.log(newArr); // [2, 3, 4, 5]

let add = (a) => {
  return (b) => {
    return a + b;
  };
};

let add1 = add(1); // 绑定部分参数的偏函数

let res = add1(4);
console.log(res); // 5
```

所以函数式编程就是将程序分解为一些更可重用、更可靠且更易于理解的部分，然后将他们组合起来，形成一个更易推理的程序整体。

### 纯函数

纯函数是指一个函数，如果它的调用参数相同，则永远返回相同的结果。

> 纯函数 不依赖外部，不影响外部(没有副作用)

```js
const calPrice = (price, discount) => price * discount;
```

## compose 函数 and pip 函数

[JavaScript 中的 compose 函数和 pipe 函数](https://juejin.im/post/5e3ff92be51d4526f16e3b90)

### compose 函数

compose 函数可以将需要嵌套执行的函数平铺，嵌套执行就是一个函数的返回值将作为另一个函数的参数

```js
const add = (x) => x + 10;
const multiply = (x) => x * 10;

// add函数的返回值作为multiply函数的参数
let res = multiply(add(10));
console.log(res); // 200
```

上面的计算方法就是函数的嵌套执行，而我们 compose 的作用就是将嵌套执行的方法作为参数平铺，嵌套执行的时候，里面的方法也就是右边的方法最开始执行，然后往左边返回

```js
// 参数从右往左执行，所以multiply在前，add在后
let res = compose(multiply, add)(10);

// compose 的实现
function compose(...fns) {
  return function (...args) {
    return fns.reduceRight(
      (lastRet, fn, i) => (i === fns.length - 1 ? fn(...lastRet) : fn(lastRet)),
      args
    );
  };
}
compose(multiple, add)(10); // 200
```

Redux 的中间件就是用 compose 实现的，webpack 中 loader 的加载顺序也是从右往左，这是因为他也是 compose 实现的。

### pipe 函数

pipe 函数就是从左到右执行的 compose

```js
// pipe 的实现
function pipe(...fns) {
  return function (...args) {
    return fns.reduce(
      (lastRet, fn, i) => (i === 0 ? fn(...lastRet) : fn(lastRet)),
      args
    );
  };
}
pipe(add, multiply)(10); // 200
```

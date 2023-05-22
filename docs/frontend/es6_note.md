# es6 notes

[ES6 入门教程](http://es6.ruanyifeng.com/#docs/intro)

## 安装
```sh
cnpm i --save-dev @babel/core @babel/cli @babel/preset-env

# 配置 .babelrc
{
    "presets": ["@babel/preset-env"],
    "plugins": []
}

# test.es
setTimeout(() => console.log('hi babel'), 1000)

# 编译到stdout
npx babel test.es
# 编译到文件
npx babel test.es -o test.js
# 批量编译文件夹
npx babel src -d lib
```
### babel-node
`@babel/node`模块的babel-node命令，提供一个支持 ES6 的 REPL 环境。

### babel/register
`@babel/register`模块改写require命令，为它加上一个钩子。此后，每当使用require加载.js、.jsx、.es和.es6后缀名的文件，就会先用 Babel 进行转码。


## let 和 const 命令
### 块级作用域
> ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。
> ES5常用的匿名立即执行函数表达式（匿名 IIFE） 创建独立作用域

for循环的计数器，就很合适使用let命令。
```js
// 变量i是let声明的，当前的i只在本轮循环有效，
// 所以每一次循环的i其实都是一个新的变量
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6

// for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，
// 而循环体内部是一个单独的子作用域。
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
### 暂时性死区
只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。
```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}


if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}

// “暂时性死区”也意味着typeof不再是一个百分之百安全的操作。
if(true) {
    typeof x; // ReferenceError
    let x;
}

// 有些“死区”比较隐蔽，不太容易发现。
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错
```

### 不允许重复声明
```js
// 报错
function func() {
  let a = 10;
  let a = 1;
}

function hello(name) {
    let name = 'alice' // error
}
```
### 块级作用域与函数声明
> ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。

```js
//  ES5 error
if(true) {
    function f() {}
}
```

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数; 但是最好不要这么做，用函数表达式比较好，因为各个环境实现的不一致。


### const命令
const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。

> const变量不可变，指的是引用地址不能变
> 不可变是变量指向的那个内存地址所保存的数据不得改动。
> 对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
> 但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针

```js
const MAX = 10
MAX = 12 // error

const ADMIN = {name: 'kk'}
ADMIN.name = 'alice' // ok

// 若要用对象作为常量，又希望真正不可变
// 可用 Object.freeze(o) 保证对象不可变
function constantize(obj) {
    Object.freeze(obj)
    Object.keys(obj).forEach(key => {
        let val = obj[key]
        if(val && typeof val === 'object') {
            constantize(val)
        }
    })
}

```

### ES6 声明变量的六种方法
ES5 只有两种声明变量的方法：var命令和function命令。   
ES6 添加let和const命令，import命令和class命令。

### 顶层对象的属性
顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

```js
var a = 1
window.a // 1

let b = 1
window.b // undefined
```

### globalThis对象

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- browser  window
- nodejs global
- webworker self

ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

垫片库global-this模拟了这个提案，可以在所有环境拿到globalThis。


## 变量的解构赋值
### 数组的解构赋值
ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
let [a, b, c] = [1, 2, 3];
// 只要等号两边的模式相同，左边的变量就会被赋予对应的值
let [foo, [[bar], baz]] = [1, [[2], 3]];
let [ , , third] = ["foo", "bar", "baz"];
let [head, ...tail] = [1, 2, 3, 4];

// 如果解构不成功，变量的值就等于undefined。
let [foo] = [];
let [bar, foo] = [1];

// 对于 Set 结构(具备 Iterator 接口)，也可以使用数组的解构赋值
let [x, y, z] = new Set(['a', 'b', 'c']);

// 只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a; // 注意 这里要加分号，不然会和下面语句一起解析，意思就变了
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs(); // 生成器函数返回的生成器对象，实现了 Iterator接口，所以可进行解构
sixth // 5

// 交换变量值
let a = b = 1;
([a, b] = [b, a + b]); // 需带上括号

```

默认值

```js
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
let [x = 1] = [null]; // x = null

// 如果默认值是一个表达式，那么这个表达式是惰性求值的，
// 即只有在用到的时候，才会求值。
function f() {
  console.log('hello');
}

let [x = f()] = [1]; // 没有执行f
```

### 对象的解构赋值
解构不仅可以用于数组，还可以用于对象
```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined

const { log } = console;
log('hello') // hello

// 如果变量名与属性名不一致，必须写成下面这样。
// 对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量
let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'

// 与数组一样，解构也可以用于嵌套结构的对象。
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"


let obj2 = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj2;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]


// 解构后不仅可赋值给变量，还可赋值给对象属性或数组元素
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```
> 注意，对象的解构赋值可以取到继承的属性。
```js
const obj = {};
const proto = { foo: 'bar' };
Object.setPrototypeOf(obj, proto);

const { foo } = obj; // 等同 const foo = obj.foo 所以会取到继承属性
foo // "bar"
```

默认值
```js
var {x: y = 3} = {};
y // 3

var {x: y = 3} = {x: 5};
y // 5

var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"
```

### 字符串解构赋值
字符串被转换成了一个类似数组的对象

```js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5
```
### 函数参数的解构赋值

```js
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3


function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

```


## 字符串的扩展
### 字符的unicode表示法
ES6 加强了对 Unicode 的支持，允许采用\uxxxx形式表示一个字符，其中xxxx表示字符的 Unicode 码点。
```js
"\u0061"
// "a"

// 这种表示法只限于码点在\u0000~\uFFFF之间的字符。
// 超出这个范围的字符，必须用两个双字节的形式表示。
"\uD842\uDFB7"
// "𠮷"

// 如果直接在\u后面跟上超过0xFFFF的数值（比如\u20BB7），
// JavaScript 会理解成\u20BB+7。
"\u20BB7"
// " 7"

// ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123   // 相当于 hello  所以 \u6f 可以当做普通字符 o

'\u{1F680}' === '\uD83D\uDE80'
// true
```

JavaScript 共有 6 种方法可以表示一个字符

```js
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true

```

### 字符串的遍历器接口
ES6 为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。

```js
for (let c of 'foo') {
    console.log(c)
}
// f
// o
// o

// 遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

### 模板字符串
模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```js
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`

// 如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。
let greeting = `\`Yo\` World!`;
```

### 标签模板
标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。

```js
alert`hello`
// 等同于
alert(['hello'])

let a = 5;
let b = 10;

console.log`Hello ${ a + b } world ${ a * b }`;
// 等同于
console.log(['Hello ', ' world ', ''], 15, 50);

```

“标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。

```js
let message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}

```

## 字符串的新增方法

```js
// ES5 提供String.fromCharCode()方法，用于从 Unicode 码点返回对应字符，
// 但是这个方法不能识别码点大于0xFFFF的字符
String.fromCharCode(0x20BB7)
'hello'.charCodeAt(0)

String.fromCodePoint(0x20BB7)
'hello'.codePointAt(0)

// 原始字符串 所见即所得
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"
String.raw`Hi\n${2+3}!` 


let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

// 这三个方法都支持第二个参数，表示开始搜索的位置
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false

'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"

// ES2017 引入了字符串补全长度的功能。
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"

const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```


## 正则的扩展

### RegExp构造函数
```js
var re1 = new RegExp('xyz', 'i');
var re2 = new RegExp(/xyz/i)
var re3 = new RegExp(/xyz/, 'i') // ES5 报错
var re4 = new RegExp(/xyz/ig, 'i') // ES6 ok, 忽略原正则表达式的修饰符
re4.flags // i
re4.source // xyz
// re4.global  re4.ignoreCase  re4.unicode re4.sticky  re4.multiline
```

### 字符串的正则方法

字符串对象共有 4 个方法，可以使用正则表达式

- str.match()
- str.replace()
- str.split()
- str.search()

### u修饰符
```js
// \uD83D\uDC2A是一个四个字节的 UTF-16 编码，代表一个字符。
// 但是，ES5 不支持四个字节的 UTF-16 编码，会将其识别为两个字符
/^\uD83D/.test('\uD83D\uDC2A') // true
/^\uD83D/u.test('\uD83D\uDC2A') // false

// 对于码点大于0xFFFF的 Unicode 字符，点字符不能识别，必须加上u修饰符。
var s = '𠮷';

/^.$/.test(s) // false
/^.$/u.test(s) // true

// ES6 新增了使用大括号表示 Unicode 字符，这种表示法在正则表达式中必须加上u修饰符，
// 才能识别当中的大括号，否则会被解读为量词。
/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true
/\u{20BB7}/u.test('𠮷') // true

// 使用u修饰符后，所有量词都会正确识别码点大于0xFFFF的 Unicode 字符。
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true

// u修饰符也影响到预定义模式
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true

function realStringLen(str) {
    var m = str.match(/[\s\S]/gu)
    return m ? m.length : 0
}
var s = '𠮷𠮷';

s.length // 4
realStringLen(s) // 2

// 有些 Unicode 字符的编码不同，但是字型很相近，比如，\u004B与\u212A都是大写的K。
/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true   \u212A == K
```

### y修饰符
除了u修饰符，ES6 还为正则表达式添加了y修饰符，叫做“粘连”（sticky）修饰符。
> y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于，g修饰符只要剩余位置中存在匹配就可，而y修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的涵义。
```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null r2.lastIndex == 3

r2.lastIndex = 4 // 从lastIndex开始继续匹配
r2.exec(s) // ['aa']

'a1a2a3'.match(/a\d/gy) // [ 'a1', 'a2', 'a3' ]


```

### s修饰符 dotAll模式
`.`通常代表换行之外的任意字符; dotAll模式，即点（dot）代表一切字符
```js
let re = /./
let re2 = /./s
re.test('\n') // false
re2.test('\n') // true
re2.dotAll // true
```

### 后行断言
> “先行断言”指的是，x只有在y前面才匹配，必须写成/x(?=y)/。
```js
// 先行断言例子
let str = '10 30% 40 50% numbers'
let re = /\d+(?=%)/g
str.match(re) // [30, 50]
let re2 = /\d+(?!\d*%)/g
str.match(re2) // [ '10', '40' ]

// 后行断言例子
var s = '$10 39 $22 60 numbers'
var r = /(?<=\$)\d+/g
s.match(r) // [ '10', '22' ]
var r2 = /(?<!\$\d*)\d+/g
s.match(r2) // [ '39', '60' ]

// “后行断言”的反斜杠引用，也与通常的顺序相反，必须放在对应的那个括号之前。
/(?<=(o)d\1)r/.exec('hodor')  // null
/(?<=\1d(o))r/.exec('hodor')  // ["r", "o"]

```

### 具名组匹配
```js
var r = /(?<year>\d{4})-(?<month>\d{2})/
var s = '1998-09'
var m = r.exec(s)
m.groups // {year: '1998' , month: '09'}

let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015

// 用\k<组名>引用
let re = /^(?<word>[a-z]+)!\k<word>$/;
re.test('abc!abc') // true
re.test('abc!ab') // false
```

### 获取匹配的索引 result.indices
```js
const text = 'zabbcdef';
const re = /ab/;
const result = re.exec(text);

result.index // 1  index属性是整个匹配结果（ab）的开始位置
result.indices // [ [1, 3] ]  indices属性是一个数组，成员是每个匹配的开始位置和结束位置的数组
```

### String.prototype.matchAll()

ES2020 增加了String.prototype.matchAll()方法，可以一次性取出所有匹配。不过，它返回的是一个遍历器（Iterator），而不是数组。

```js
const string = 'test1test2test3';
const regex = /t(e)(st(\d?))/g;

for (const match of string.matchAll(regex)) {
  console.log(match);
}
// ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"]
// ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"]
// ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]

// 遍历器转为数组是非常简单的，使用...运算符和Array.from()方法就可以了。
[...str.matchAll(re)]
Array.from(str.matchAll(re))
```

## 数值的扩展

### 二进制和八进制表示法
ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。
```js
0b111110111 === 503 // true
0o767 === 503 // true
0xa === 10 // 十六进制表示

// 转为十进制
Number('0b111')  // 7
Number('0o10')  // 8
```

## 函数的扩展

### 参数默认值
```js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

// 参数默认值是惰性求值的。
let x = 99
function show(v = x + 1) {
    console.log(v)
}
show() // 100
x = 100
show() // 101


// 解构赋值默认值
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5


// 通常情况下，定义了默认值的参数，应该是函数的尾参数。  

// 函数的length属性，不包括指定默认值的参数个数
(function (a, b, c = 5) {}).length // 2 
```
#### 参数作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
```js
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```
### rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```js
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10


// 函数的length属性，不包括 rest 参数。
(function(a, ...b) {}).length  // 1
```

### 严格模式
从 ES5 开始，函数内部可以设定为严格模式。
ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

> 先执行参数部分，再执行函数体，函数体内才知道是否严格模式

```js
// 报错
function doSomething(a, b = a) {
  'use strict';
  // code
}

// 报错
const doSomething = function ({a, b}) {
  'use strict';
  // code
};

// 报错
const doSomething = (...a) => {
  'use strict';
  // code
};
```
### name属性

```js
var hello = function() { console.log('hello, ', this.friend)}
hello.name // hello
var helloAlice = hello.bind({friend: 'alice'})
helloAlice.name // bound hello
```

### 箭头函数

```js
var f = v => v; // 单参数
var f = () => 5; // 无参数
var sum = (num1, num2) => num1 + num2; // 多参数

// 如果箭头函数的代码块部分多于一条语句，
// 就要使用大括号将它们括起来，并且使用return语句返回。
var add = (m , n) => {
    console.log('adding:', m , n)
    return m + n
}

// 返回对象字面量 加括号
let foo = () => ({ a: 1 });

// 如果箭头函数只有一行语句，且不需要返回值
let fn = () => void dosth()

// 参数解构赋值
const full = ({ first, last }) => first + ' ' + last;
// rest参数
const numsort = (...nums) => {
    nums.sort()
    return nums
}
```

箭头函数有几个使用注意点:

1. 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

2. 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

3. 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

4. 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

> this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。

```js
// 不适用场景
// 对象字面量定义
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--; // this指向全局对象
  }
}
```

### 尾调用优化
**什么是尾调用？**   
尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
```js
// 是尾调用
function f(x){
  return g(x);
}

// 不是
function f(x){
  let y = g(x);
  return y;
}

// 不是
function f(x){
  return g(x) + 1;
}

// 不是
function f(x){
  g(x); 
  // 隐式 return undefined
}

// 尾调用不一定出现在函数尾部，只要是最后一步操作即可
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```

> 我们知道，函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。
> 尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。

```js
// 是尾调用 但无法优化
// 因为内层函数inner用到了外层函数addOne的内部变量one。
// 把 one 传入内层函数 则可以做尾调用优化，减少栈帧
function addOne(a){
  var one = 1;

  function inner(b){
    return b + one;
  }

  return inner(a);
}
```

### 尾递归

> 尾调用，并且是调用自身

```js
// 不是尾调用
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120

function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120


function fibonacci(n , a = 1 , b =1) {
    if(n <= 1 ) return b
    return fibonacci(n - 1, b, a + b)
}
fibonacci(100)

```

> 递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。


## 数组的扩展

### 扩展运算符
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

```js
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]

function push(array, ...items) {
  array.push(...items);
}

// 扩展运算符后面还可以放置表达式
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
```

由于扩展运算符可以展开数组，所以不再需要apply方法，将数组转为函数的参数了。
```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

扩展运算符的应用
```js
// 复制数组
// ES5
const a1 = [1, 2];
const a2 = a1.concat();

// ES6
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;

// 合并数组
// ES5
var all = arr1.concat(arr2)

// ES6
var all = [...arr1, ...arr2]

// 扩展运算符可以与解构赋值结合起来，用于生成数组。
// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list

// 扩展运算符还可以将字符串转为真正的数组。
[...'hello'] // [ "h", "e", "l", "l", "o" ]

// 能够正确识别四个字节的 Unicode 字符。
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3

function realLength(str) {
    return [...str].length
}


// 任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组。
// NodeList对象实现了 Iterator 。
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

// 给Number类定义iterator接口
Number.prototype[Symbol.iterator] = function* () {
    let i = 0
    let num = this.valueOf()
    while(i < num) {
        yield i++
    }
}
let nums = [...10]

// 类数组对象可以用 Array.from() 转为数组 再应用扩展运算符
let args = [...Array.from(arguments)]

// Map or Set
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]

// Generator
const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

### Array.from()
Array.from方法用于将两类对象转为真正的数组：  
- 类似数组的对象（array-like object）
- 可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']


// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
  return p.textContent.length > 100;
});

// arguments对象
function foo() {
  var args = Array.from(arguments);
  // ...
}

// 只要是部署了 Iterator 接口的数据结构，Array.from都能将其转为数组。
Array.from('hello') // ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

// Array.from还可以接受第二个参数，作用类似于数组的map方法，
// 用来对每个元素进行处理，将处理后的值放入返回的数组。
// range
function range(n) {
    return Array.from({ length: n }, (v, i) => i);
}
let names2 = Array.from(spans, s => s.textContent)

```

### Array.of()
Array.of方法用于将一组值，转换为数组。

这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

### Array.prototype.copyWithin(target, start = 0 , end = this.length)
在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

```js
[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(0, 3, 4) // [4, 2, 3, 4, 5]
```

### arr.find() arr.findIndex()
`arr.find(function(val, i, arr) {}, thisObj)`  
`arr.findIndex(function(val, i, arr) {}, thisObj)`  

```js
// indexOf方法无法识别数组的NaN成员，但是findIndex方法可以借助Object.is方法做到
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```


### arr.fill(val, start, end)
fill方法使用给定值，填充一个数组。
```js
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

// fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

```

### 数组遍历 arr.entries()  arr.keys()  arr.values()
ES6 提供三个新的方法——entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，
```js
let arr = ['a' , 'b', 'c']
for(let key of arr.keys()) {
    console.log(key)
}

// 扩展运算符遍历key
[...arr.keys()]
// 扩展运算符遍历value
// 注意: node v10.x 并没有 arr.values() 方法
[...arr]
// 扩展运算符遍历entry
[...arr.entries()]


```

### arr.includes(val, start)
与字符串的includes方法类似
```js
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
// 用 Object.is() 判断相等
[1, 2, NaN].includes(NaN) // true

// Object.is() 
NaN === NaN  // false
-0 === +0 // true
Object.is(NaN, NaN) // true
Object.is(-0, +0) // false
Object.is([], []) // false

[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

// ES5
arr.some(val => val === el)
arr.indexOf(el) !== -1
// indexOf用 严格相等运算符（===）进行判断
[NaN].indexOf(NaN) // -1
```

### 扁平化 arr.flat(level = 1)  arr.flatMap(fn, thisObj)
```js
// level 默认为 1
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]

// 无限扁平化
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

// map完后再flat 同 arr.map(fn).flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```
### 数组的空位
空位不是undefined，一个位置的值等于undefined，依然是有值的。空位是没有任何值，in运算符可以说明这一点。
```js
arr = Array(3)
1 in arr // false
0 in [, , ,] // false

// ES5 空位处理
// forEach方法
[,'a'].forEach((x,i) => console.log(i)); // 1

// filter方法
['a',,'b'].filter(x => true) // ['a','b']

// every方法
[,'a'].every(x => x==='a') // true

// reduce方法
[1,,2].reduce((x,y) => x+y) // 3

// some方法
[,'a'].some(x => x !== 'a') // false

// map方法
[,'a'].map(x => 1) // [,1]

// join方法
[,'a',undefined,null].join('#') // "#a##"

// toString方法
[,'a',undefined,null].toString() // ",a,,"

// ES6 则是明确将空位转为undefined。

Array.from(['a',,'b']) // [ "a", undefined, "b" ]
[...['a',,'b']] // [ "a", undefined, "b" ]
function range(n) {
    return [...Array(n).keys()]
}

// copyWithin()会连空位一起拷贝。
[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]

// fill()会将空位视为正常的数组位置
new Array(3).fill('a') // ["a","a","a"]

// for...of循环也会遍历空位。
let arr = [, ,];
for (let i of arr) {
  console.log(1);
}
// 1
// 1
```

## 对象的扩展

### 简写对象字面量
```js
var name = 'alice'
var age = 12
// 属性名就是变量名, 属性值就是变量值
let alice = {
    name, 
    age,
    // 方法简写
    hello() {
        console.log('hello, guys')
    },
    _fav: 'sing',
    // 访问器属性
    get fav() {
        return this._fav
    },
    set fav(val) {
        this._fav = val
    }
}
// 注意，简写的对象方法不能用作构造函数，会报错。
const h = new alice.hello()  // TypeError: alice.hello is not a constructor
```

### 属性名表达式(计算属性)
```js
function getWeather() {
    return Math.random() > 0.5 ? 'sunny' : 'rainy'
}
function eventType() {
    return Math.random() > 0.5 ? 'click' : 'change'
}
let activeIndex = 1
let weather = getWeather()
let daily = {
    [weather]: true,
    ['day' + activeIndex]: 'yes',
    ['on' + eventType()]() {
        console.log('event callback')
    }
}

```

### 方法的name
```js
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"

const sHello = Symbol('hello')
const obj = {
  get foo() {},
  set foo(x) {},
  // symbol作为方法名
  [sHello]() {
      console.log('hi')
  }
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"

obj[sHello].name // [hello]
```

### 属性的枚举和遍历
目前，有四个操作会忽略enumerable为false的属性。

- `for...in` 循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

> 总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。

ES6 一共有 5 种方法可以遍历对象的属性。
- `for...in`  
    for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

- `Object.keys(obj)`  
    Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

- `Object.getOwnPropertyNames(obj)`   
    Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

- `Object.getOwnPropertySymbols(obj)`  
    Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

- `Reflect.ownKeys(obj)`  
    Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

属性遍历顺序：数值 字符串 symbol
```js
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
```

### super关键字
我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

> 注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。
> 目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。

JavaScript 引擎内部，super.foo等同于:

- foo为属性 Object.getPrototypeOf(this).foo
- foo为函数 Object.getPrototypeOf(this).foo.call(this)

```js
// 报错
const obj = {
  foo: super.foo
}

// 报错
const obj = {
  foo: () => super.foo
}

// 报错
const obj = {
  foo: function () {
    return super.foo
  }
}

// OK
const obj = {
    foo() {
        return super.foo
    }
}
```

### 对象的扩展运算符

#### 解构赋值
所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面
```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }

// 对象浅拷贝
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
x.a.b // 2

// 扩展运算符的解构赋值，不能复制继承自原型对象的属性
// 单纯的解构赋值，可以得到继承属性的值
let proto = {
    hello() {
        console.log('hello')
    },
    count: 10
}
let zoro = {name: 'zoro', age: 12, skill: 'sword'}
Object.setPrototypeOf(zoro, proto)
let {name, hello, ...others} = zoro
others // {age, skill} 没有count
hello() // hello


function wrapperFunction({ x, y, ...restConfig }) {
  // 使用 x 和 y 参数进行操作
  // 其余参数传给原始函数
  return baseFunction(restConfig);
}

```

#### 扩展对象
```js
// 浅拷贝对象
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }

// 合并对象
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);

// 修改部分属性
let zoro = {name: 'zoro', age: 12, skill: 'sword'}
let bzoro = {...zoro, age: 18}

// 后面跟表达式
const obj = {
  ...(x > 1 ? {a: 1} : {}),
  b: 2,
};
```

### 链判断运算符
链判断运算符 `?.` 直接在链式调用的时候判断，左侧的对象是否为null或undefined。如果是的，就不再往下运算，而是返回undefined
```js
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.()
// 等同于
a == null ? undefined : a()
```

### Null判断运算符
ES2020 引入了一个新的 Null 判断运算符??。它的行为类似||，但是只有运算符左侧的值为null或undefined时，才会返回右侧的值。
```js
const headerText = response.settings.headerText ?? 'Hello, world!';
```

### 对象的新增方法
#### Object.is()
ES6 提出“Same-value equality”（同值相等）算法，用来解决这个问题(*NaN不等于自身，以及+0等于-0*)。  
Object.is用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

#### Object.assign(target, source1, source2...)
Object.assign()方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
```js
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

#### Object.getOwnPropertyDescriptors()
- `Object.getOwnPropertyDescriptors(obj)` 返回所有自身属性的描述对象
- `Object.getOwnPropertyDescriptor(obj, prop)` 返回某个属性的描述对象
- `Object.defineProperty(obj, prop, descriptor)` 定义某个属性
- `Object.defineProperties(obj, descriptors)` 定义多个属性

```js
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));

// 浅拷贝对象 包括原型
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

### 访问和设置原型
```js
obj.__proto__
Object.getPrototypeOf(obj)
Object.setPrototypeOf(obj, proto)
```

### 对象遍历

- Object.keys(o)
- Object.values(o)
- Object.entries(o)
```js
let {keys, values, entries} = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}

for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}

for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}
```

### Object.fromEntries(arr)
Object.fromEntries() 方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。

> 注：node v10.x 没有Object.fromEntries()方法

```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```

## Symbol
从根本上防止属性名的冲突, 这就是 ES6 引入Symbol的原因  
ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，

> 前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

```js
let s = Symbol();

typeof s
// "symbol"

// Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

// Symbol 值不能与其他类型的值进行运算，会报错。
'hello' + s1

// Symbol 值可以显式转为字符串。
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

Boolean(sym) // true
```
> 注意，Symbol函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。


### symbol属性名的遍历
`Object.getOwnPropertySymbols()` 和 `Reflect.ownKeys()`
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols // [Symbol(a), Symbol(b)]

Reflect.ownKeys(obj)

```

### Symbol.for()  Symbol.keyFor()
我们希望重新使用同一个 Symbol 值，Symbol.for()方法可以做到这一点. 
> 描述字符串和symbol值的对应关系会被注册到全局

Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key。
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
Symbol.keyFor(s1) // foo
```

### 内置的Symbol值

#### Symbol.hasInstance
对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`

```js
class MyClass {
    [Symbol.hasInstance](obj) {
        return obj instanceof Array
    }
}
let obj = new MyClass()
[1,2] instanceof obj // true  obj[Symbol.hasInstance]([1,2])
[1, 2] instanceof Array  // true   Array[Symbol.hasInstance]([1, 2])
```
#### Symbol.isConcatSpreadable
对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。

```js
let friends = ['nami', 'zoro']
let op = []
friends[Symbol.isConcatSpreadable] = false
op.concat(friends) // [ [ 'nami', 'zoro', [Symbol(Symbol.isConcatSpreadable)]: false ] ]
```

#### Symbol.species
对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该构造函数

```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);

b instanceof MyArray // false
c instanceof Array // true
```
#### Symbol.match
对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。

```js
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](str)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

'e'.match(new MyMatcher()) // 1
```
#### Symbol.replace
对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。

```js
const x = {};
x[Symbol.replace] = (...s) => console.log(s);

'Hello'.replace(x, 'World') // ["Hello", "World"]
```

#### Symbol.search
```js
String.prototype.search(regexp)
// 等同于
regexp[Symbol.search](this)

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
'foobar'.search(new MySearch('foo')) // 0
```

#### Symbol.split
参考 Symbol.search


#### Symbol.iterator
对象的Symbol.iterator属性，指向该对象的默认遍历器方法。

```js
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

#### 其他内置Symbol
- `Symbol.toPrimitive`
- `Symbol.toStringTag`
- `Symbol.unscopables`

```js
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'

// 返回值 出现在toString方法返回的字符串之中
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

// 有 unscopables 时 指定 哪些属性会被with环境排除
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 2
}
```

## Set and Map

### Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

> Set内部用 Object.is 判断有无重复元素

```js
// new Set()
// set.add(val)  set.delete(val)  set.has(val)  set.clear()
// set.size

// 遍历方法
// set.keys()  set.values() set.entries()  set.forEach(fn, thisObj)
// 由于 Set 结构没有键名，只有键值，所以keys方法和values方法的行为完全一致。

const s = new Set(); // 无参数
let s2 = new Set(['nami', 'lufy']) // 数组
let s3 = new Set(document.querySelectorAll('div'));  // 类数组
set.size // 56

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

// Set是Iterable对象
for (let i of s) {
  console.log(i);
}
// 2 3 5 4

// 数组去重
let newArr = [...new Set(arr)]
let newArr2 = Array.from(new Set(arr))

// set.add(val) 返回 set
let op = new Set()
op.add('lufy').add('zoro')

[...op.keys()] // [ 'lufy', 'nami', 'robin' ]                                      
[...op.values()] // [ 'lufy', 'nami', 'robin' ]                                      
[...op.entries()] // [ [ 'lufy', 'lufy' ], [ 'nami', 'nami' ], [ 'robin', 'robin' ] ] 
op.forEach(console.log)

// Set 默认可遍历
[...op] // Set.prototype[Symbol.iterator] === Set.prototype.values

```

### WeakSet
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有三个区别。

- WeakSet 的成员只能是对象，而不能是其他类型的值。
- WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
- WeakSet不可遍历

> WeakSet 里面的引用，都不计入垃圾回收机制，所以就不会导致内存泄漏风险；对象在外部消失，WeakSet里的引用会自动消失

```js
// ws = new WeakSet()
// ws = new WeakSet(arr)
// ws = new WeakSet(arrlike)
// ws.add(val) ws.delete(val)  ws.has(val)

const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

let zoro = {name: 'zoro', age: 18}
ws.add(zoro)
ws.has(zoro) // true
ws.delete(zoro)
```

### Map
ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

> Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

```js
// map = new Map()
// map = new Map(pairList)
// map = new Map(set)
// map.size
// map.set(key, val)  map.get(key)
// map.has(key)  map.delete(key) map.clear()
// map.keys() map.values()  map.entries() //注意: 返回 MapIterator 对象 非数组  
// keysIt = map.keys()  keysIt.next() // => {value: xxx, done: false}
// map.forEach((val, key) => { .... })

const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

// Map  和 Set 一样 很容易遍历
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

// map.set(key,val) 返回map
map.set('a', 'apple').set('b', 'banana')

// 注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。
let cat = {name: 'mily'}
map.set(cat, 10)
map.set(cat, 20)

// Map默认遍历器为 entries
// Map.prototype[Symbol.iterator] = Map.prototype.entries
[...map]
[...map.keys()]
[...map.values()]
map.forEach(console.log)

```

### WeakMap
WeakMap 和 Map 的区别 同  WeakSet 和 Set 的区别

- 只接受对象作为键名
- 键名对象的引用是弱引用
- 不可遍历

```js
// wm = new WeakMsp()
// wm = new weakMap(list)
// wm.set(key, val) wm.get(key)
// wm.delete(key)  wm.clear()  wm.has(key)

const wm = new WeakMap()
// wm = new WeakMap([[zoro, 'sword'], [lufy, 'strentch']])
const zoro = {name: 'zoro'}
wm.set(zoro, {age: 10})
wm.get(zoro)

```

> 总之，WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。

## Proxy
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`var proxy = new Proxy(target, handler);`

```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    // target为目标对象/原始对象  receiver为proxy对象
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
// 上面代码说明，Proxy 实际上重载（overload）了点运算符

var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true

```

Proxy 支持的拦截操作，一共 13 种: 

- `get(target, propKey, receiver)`：拦截对象属性的读取，比如 `proxy.foo` 和 `proxy['foo']`
- `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如 `proxy.foo = v` 或 `proxy['foo'] = v`，返回一个布尔值
- `has(target, propKey)`：拦截 `propKey in proxy` 的操作，返回一个布尔值
- `deleteProperty(target, propKey)`：拦截 `delete proxy[propKey]` 的操作，返回一个布尔值
- `ownKeys(target)`：拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in` 循环，返回目标对象所有自身属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性
- `getOwnPropertyDescriptor(target, propKey)`：拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象
- `defineProperty(target, propKey, propDesc)`：拦截 `Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值
- `getPrototypeOf(target)`：拦截 `Object.getPrototypeOf(proxy)`，返回一个对象
- `setPrototypeOf(target, proto)`：拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值如果目标对象是函数，那么还有两种额外操作可以拦截
- `isExtensible(target)`：拦截 `Object.isExtensible(proxy)`，返回一个布尔值
- `preventExtensions(target)`：拦截 `Object.preventExtensions(proxy)`，返回一个布尔值
- `apply(target, object, args)`：拦截 Proxy 实例作为函数调用的操作，比如 `proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`
- `construct(target, args)`：拦截 Proxy 实例作为构造函数调用的操作，比如 `new proxy(...args)`

### Proxy.revocable()
Proxy.revocable()方法返回一个可取消的 Proxy 实例。

```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke(); // 之后 proxy 不再可用
proxy.foo // TypeError: Revoked
```

### this问题
不做任何拦截的情况下，也无法保证proxy对象与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
```js
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```

> Proxy 可以用来实现数据库的 ORM 层


## Reflect

Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。

- 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上; 并适当优化
- 运算符操作变成函数调用
- Reflect对象的方法与Proxy对象的方法一一对应， 可以在Reflect上获取默认行为

```js
Reflect.defineProperty(target, property, attributes)

// 运算符 变为 函数调用
'assign' in Object // true
Reflect.has(Object, 'assign') // true

var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
```

- Reflect.construct(target, args)
- Reflect.apply(target, thisArg, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.has(target, name)
- Reflect.deleteProperty(target, name)
- Reflect.ownKeys(target)
- Reflect.defineProperty(target, name, desc)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

## Promise对象
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。

Promise对象有以下两个特点。

- 对象的状态不受外界影响，只有异步操作的结果，可以决定当前是哪一种状态（pending, fulfilled, rejected)
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

> 如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

Promise对象提供统一的接口，使得控制异步操作更加容易，避免“回调地狱”。

Promise也有一些缺点。

- 无法取消Promise
- 无法跟踪进度

```js
// 基本用法
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(value => {
  // success
}, error => {
  // fail
})

// 同 promise.then(null, failCallback)
promise.catch(error => {
  // fail
}) 


function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}
let imgPromise = loadImageAsync(url).then(sucCallback).catch(failCallback)


// resolve(otherPromise)  则当前promise的状态完全取决于otherPromise
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

### Promise.prototype.then()
then 为 Promise 实例添加状态改变时的回调函数。

> then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

```js
// 链式then
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
```
### Promise.prototype.catch()
`Promise.prototype.catch()`方法是`.then(null, rejection)`的别名，用于指定发生错误时的回调函数。

> catch() 返回的也是新的promise

```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));

// 如果 Promise 状态已经变成resolved，再抛出错误是无效的。
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok

// Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});

// 错误被catch后 新promise状态变为fulfilled
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
    // 异步错误在下次事件循环抛出，.catch()是捕获不到的
    // setTimeout(() => throw new Error('outside err'), 100)
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on

```
> 一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。

### Promise.prototype.finally()
finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
// finally方法的回调函数不接受任何参数，这意味着没有办法知道，
// 前面的 Promise 状态到底是fulfilled还是rejected。

// 如果不使用finally方法，同样的语句需要为成功和失败两种情况各写一次。
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

### Promise.all()
Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});

const databasePromise = connectDatabase();

const booksPromise = databasePromise
  .then(findAllBooks);

const userPromise = databasePromise
  .then(getCurrentUser);

Promise.all([
  booksPromise,
  userPromise
])
.then(([books, user]) => pickTopRecommendations(books, user));
```

### Promise.race()
Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
// 如果 5 秒之内fetch方法无法返回结果，p的状态就会变为rejected
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

### Promise.allSettled()
Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。该方法由 ES2020 引入。

```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

### Promise.any()
Promise.any()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。该方法目前是一个第三阶段的提案 。

> Promise.any()跟Promise.race()方法很像，只有一点不同，就是不会因为某个 Promise 变成rejected状态而结束。

```js
var resolved = Promise.resolve(42);
var rejected = Promise.reject(-1);
var alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```

### Promise.resolve()
将现有对象转为 Promise 对象

- 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
- 如果参数是 thenable 对象，Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。
- 参数是一个原始值, 返回一个新的 Promise 对象，状态为resolved。

```js
Promise.resolve(promise) // promise
Promise.resolve(thenable) // return new Promise(thenable.then)
Promise.resolve(val) // return new Promise(resolve => resolve(val))
Promise.resolve() // return new Promise(resolve => resolve(undefined))
```

### Promise.reject()
Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

> 注意，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。

```js
const p = Promise.reject('出错了');

p.catch(function (s) {
  console.log(s)
});
// 出错了
```

### Promise.try()

```js
const f = () => console.log('now');
Promise.try(f); // f是同步的 则 同步执行，f是异步的则异步执行
console.log('next');
// now
// next


Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)

```

事实上，Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。

### Promise的应用
generator 和 promise 结合

```js
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);
```

## Iterator 和 for...of 循环
JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。这样就有了四种数据集合

Iterator 的作用有三个：
- 为各种数据结构，提供一个统一的、简便的访问接口；
- 使得数据结构的成员能够按某种次序排列；
- ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

> 每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

如果使用 TypeScript 的写法，遍历器接口（Iterable）、指针对象（Iterator）和next方法返回值的规格可以描述如下。

```js
interface Iterable {
  [Symbol.iterator]() : Iterator,
}

interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```

原生具备 Iterator 接口的数据结构如下。

- Array
- TypedArray
- String
- Map
- Set
- arguments 对象
- NodeList 对象

> 本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

### 用到Iterator的情况

- 解构赋值
- 扩展运算符
- yield*

```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];

// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()
- Promise.all()
- Promise.race()


### Iterator接口和Generator函数
Symbol.iterator方法的最简单实现，还是使用 Generator 函数。

```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```

### 遍历器对象的return(), throw()
return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。

```js
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}

// 情况一
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}

// 情况二
for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}
```

### for...of 循环
ES6 借鉴 C++、Java、C# 和 Python 语言，引入了for...of循环，作为遍历所有数据结构的统一的方法

> for...of循环内部调用的是数据结构的Symbol.iterator方法。

javaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6 提供for...of循环，允许遍历获得键值。

```js
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}

var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

let map = new Map().set('a', 1).set('b', 2);
for (let pair of map) {
  console.log(pair);
}
// ['a', 1]
// ['b', 2]

// map.keys()  map.values()  map.entries() 返回的都是Iterator对象

```

## Generator 函数的语法

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。


Generator 函数是一个普通函数，但是有两个特征:  

- function关键字与函数名之间有一个星号`*`
- 函数体内部使用 `yield` 表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```
> Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。

```js
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)) {
  console.log(f);
}
// 1, 2, 3, 4, 5, 6


function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
// 注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

### Generator.prototype.throw()
Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获
```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获。

```js
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```

### Generator.prototype.return()
Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return方法会导致立刻进入finally代码块，执行完以后，整个函数才会结束。

```js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

### next()、throw()、return() 的共同点
next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。

- next()是将yield表达式替换成一个值。
- throw()是将yield表达式替换成一个throw语句。
- return()是将yield表达式替换成一个return语句。

```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;


gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));


gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;

```

### `yield*` 表达式
如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。
```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';

  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i);
  }

  // 可用 yield* 简化
  // yield* foo()

  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// x
// a
// b
// y


```

### generator函数作为对象的属性
```js
// 简写
let obj = {
  * hello() {
    // ···
  }
};

// 同上
let obj = {
  hello: function* () {
    // ...
  }
}

```

### Generator函数的this
Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。

```js
// 不能 new generator函数
function* g() {
  // this !== iterator // this 不指向遍历器
  // return iterator // 总是返回遍历器
}

g.prototype.hello = function () {
  return 'hi!';
};

let iterator = g(); // iterator.__proto__ === g.prototype

iterator instanceof g // true
iterator.hello() // 'hi!'
```


## Generator 函数的异步应用
ES6 诞生以前，异步编程的方法，大概有下面四种。

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

Generator 函数将 JavaScript 异步编程带入了一个全新的阶段。


> Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。


Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：**函数体内外的数据交换和错误处理机制**。

### Thunk函数
Thunk 函数是自动执行 Generator 函数的一种方法。

求值策略: 传值调用 和 传名调用


**Thunk 函数的含义**
编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

```js
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);


// Thunk函数转换器
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```

thunkify包

```js
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

Generator函数自动执行

```js
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
// :( 但这只适用于同步操作
```

Thunk 函数的自动流程管理

```js
// 下面就是一个基于 Thunk 函数的 Generator 执行器。
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    // result.value 是一个thunk函数，封装了异步操作，
    // 等待传入回调函数，然后开始执行
    result.value(next);
  }

  next();
}

var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);


```

Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点。

### co模块
> co 模块是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 Generator 函数的自动执行。

```js
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

var co = require('co')
// co函数返回一个Promise对象
co(gen).then(function(){
  console.log('Generator 函数执行完成');
})
```
**co 模块的原理**

前面说过，Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

两种方法可以做到这一点。

- 回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。

- Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。

co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co

### 基于 Promise 对象的自动执行
```js
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```

## async 函数
ES2017 标准引入了 async 函数，使得异步操作变得更加方便。

async 函数是什么？一句话，它就是 Generator 函数的语法糖。

```js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

async函数对 Generator 函数的改进，体现在以下四点: 
- 内置执行器。(*不需要co*)
- 更好的语义。(*async和await，比起星号和yield，语义更清楚了*)
- 更广的适用性。(*await的东西可以是 Promise 对象和原始类型的值*)
- 返回值是 Promise (*Generator 函数的返回值是 Iterator 对象*)

async函数的使用形式
```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};

```

async函数返回一个 Promise 对象。
```js
// async函数内部return语句返回的值，会成为then方法回调函数的参数。
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"

// async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。
// 抛出的错误对象会被catch方法回调函数接收到。
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了

// 只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"

// await命令后面不是一个 Promise 对象，返回该值
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123

// sleep
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  })
}

// 用法
async function one2FiveInAsync() {
  for(let i = 1; i <= 5; i++) {
    console.log(i);
    await sleep(1000);
  }
}

one2FiveInAsync();

// await命令后面的 Promise 对象如果变为reject状态
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了


// 失败重试
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}

test();
```

async函数实现原理

```js
async function fn(args) {
  // ...
}

// 等同于
function fn(args) {
  function spawn(genF) {
    return new Promise(function(resolve, reject) {
      const gen = genF();
      function step(nextF) {
        let next;
        try {
          next = nextF();
        } catch(e) {
          return reject(e);
        }
        if(next.done) {
          return resolve(next.value);
        }
        Promise.resolve(next.value).then(function(v) {
          step(function() { return gen.next(v); });
        }, function(e) {
          step(function() { return gen.throw(e); });
        });
      }
      step(function() { return gen.next(undefined); });
    });
  }
}

```
### 顶层 await
目前，有一个语法提案，允许在模块的顶层独立使用await命令，使得上面那行代码不会报错了。这个提案的目的，是借用await解决模块异步加载的问题。

## Class的基本语法
基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```js
// 事实上，类的所有方法都定义在类的prototype属性上面。
class Point {
  constructor(x, y) {
    // 实例属性
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

typeof Point // "function"
Point === Point.prototype.constructor // true


// 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别

class Foo extends Base {
  constructor(props) {
    super(props)
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'


// 类中定义getter setter访问器属性
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

属性表达式
```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

class表达式
```js
// 具名类表达式
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
let inst = new MyClass();
inst.getClassName() // Me
// Me只在 Class 内部有定义
Me.name // ReferenceError: Me is not defined

// 匿名类表达式
const MyClass = class { /* ... */ };

// 立即实例化的类表达式
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```
注意点:
- 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式
- 类不存在变量提升（hoist）

### 静态方法
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

父类的静态方法，可以被子类继承。*子类的原型对象是父类*
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

// Bar.__proto__ === Foo
class Bar extends Foo {
  // 静态方法也是可以从super对象上调用的。
  static hello() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // 'hello'
```

### 实例属性的新写法
实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。

```js
// 实例属性写在构造函数内
class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

// 实例属性定义在类的顶层
class IncreasingCounter {
  _count = 0;

  // 现在有一个提案 提供了类的静态属性，
  static myStaticProp = 42;


  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

### new.target属性
new是从构造函数生成实例对象的命令。ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错

// Class 内部调用new.target
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4); // 输出 true



// 抽象类：只能被继承 不能实例化
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

## Class的继承
```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    // ColorPoint.__proto__ === Point
    // ColorPoint.__proto__.call(this, ...args)
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    // this.__proto__.__proto__.toString.call(this, ...args)
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}

// 如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    // A.call(this)
    super();
    this.x = 2;
    // this.__proto__.x = 3 // 但不允许改原型对象的属性
    // 所以等同 this.x = 3
    super.x = 3; 

    // this.__proto__.x
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }

  // 在静态方法之中，这时super将指向父类
  static myMethod(msg) {
    // super == 方法所在对象的原型对象 == B.__proto__ == A
    super.myMethod(msg);
  }

  // 在非静态方法之中，这时super将指向父类的原型对象
  myMethod(msg) {
    // this 指向子类实例
    // super == 方法所在对象的原型对象 == this.__proto__.__proto__
    super.myMethod(msg);
  }
}

let b = new B();
```
## Module 的语法
ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

> ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西


ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。

严格模式主要有以下限制。

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用with语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
- eval不会在它的外层作用域引入变量
- eval和arguments不能被重新赋值
- arguments不会自动反映函数参数的变化
- 不能使用arguments.callee
- 不能使用arguments.caller
- 禁止this指向全局对象
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 增加了保留字（比如protected、static和interface）


### export命令
模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。

```js
// export 后面跟声明语句或对象的简写形式
// 因为要确定输出接口名和内部变量的对应关系

// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;


// profile.js 另外一种写法
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };

// 输出函数或类
export function multiply(x, y) {
  return x * y;
};

export class Animal{}

// 输出接口名和内部变量名不需要一样，可用as关键字重命名
function hello() {}
export {hello as sayHello, hello as greeting}


// 错误写法

// 报错
var m = 1;
export m;

// 报错
function f() {}
export f;

// export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
// 外部的接口名总是指向内部foo变量  或者说外部接口是内部变量的别名
// 这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// export命令只能放在模块顶层

```


### import命令
```js
// 大括号里面输入的变量名，必须与被导入模块对外接口的名称相同

// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}

// 重命名输入变量
import { lastName as myLastName } from './profile.js';


// import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
import {a} from './module-a.js'
// 类似 const a = moduleA.a
a = {}; // Syntax Error : 'a' is read-only;


// 由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}

// import语句会执行所加载的模块，因此可以有下面的写法。
import 'lodash';

// 多次重复执行同一句import语句，那么只会执行一次
import './say-hello.js'
import './say-hello.js'

// 同样 say-hello 只会被执行一次
import {helloYou} from './say-hello.js'
import {helloMe} from './say-hello.js'

// 因为import在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.promise');
import React from 'React';
```

### 模块的整体加载
```js
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

// 注意，模块整体加载所在的那个对象（上例是circle），应该是可以静态分析的，所以不允许运行时改变。
// 下面的写法都是不允许的。
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};

```

### export default命令 
export default命令用于指定模块的默认输出。

```js
// export default 对外接口名称就是default, 所以可直接跟变量名 建立对应关系

// export-default.js
export default function foo() {
  console.log('foo');
}

// 或者写成

function foo() {
  console.log('foo');
}

export default foo;

// import命令后面才不用加大括号，因为只可能唯一对应export default命令。
import fooFn from './export-default.js'
// 同
import {default as fooFn} from './export-default.js'


// 本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';


// 正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;

// export default也可以用来输出类。
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();


import _, { each, forEach } from 'lodash';
```

### export 与 import 的复合写法
如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

// 注意 export 与 import 的复合写法
// 写成一行以后，foo和bar实际上并没有被导入当前模块
// 只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。

// 接口改名转发
export { foo as myFoo } from 'my_module';

// 接口整体转发
export * from 'my_module';

// 接口整体重命名导出，ES2020补上了这个写法。
export * as ns from "mod";
// 等同于
import * as ns from "mod";
export {ns};


// 具名接口改为默认接口
export { es6 as default } from './someModule';
// 默认接口也可以改名为具名接口
export { default as es6 } from './someModule';
```


### import()
import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中）。

> ES2020提案 引入import()函数，支持动态加载模块。

import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。

```js
// import()返回一个 Promise 对象
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });

// import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同
```

适用场景
```js
// 按需加载
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});

// 条件加载
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}

// 动态模块路径
import(f()).then(...);
```
注意点

```js
// 可用解构赋值获取导出接口
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});

// 用参数直接获得default接口
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});

// 重命名导出接口
import('./myModule.js')
.then(({default: theDefault}) => {
  console.log(theDefault);
});

// 同时加载多个模块
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   ···
});
```

## 异步遍历器
ES2018 引入了“异步遍历器”（Async Iterator），为异步操作提供原生的遍历器接口，即value和done这两个属性都是异步产生。

一个对象的同步遍历器的接口，部署在Symbol.iterator属性上面。同样地，对象的异步遍历器接口，部署在Symbol.asyncIterator属性上面。

```js
// 异步遍历器的最大的语法特点，就是调用遍历器的next方法，返回的是一个 Promise 对象; 而不是 {value, done} 对象
asyncIterator
  .next()
  .then(
    ({ value, done }) => /* ... */
  );

async function f() {
  const asyncIterable = createAsyncIterable(['a', 'b']);
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  console.log(await asyncIterator.next());
  // { value: 'a', done: false }
  console.log(await asyncIterator.next());
  // { value: 'b', done: false }
  console.log(await asyncIterator.next());
  // { value: undefined, done: true }
}  

// 注意，异步遍历器的next方法是可以连续调用的 不必等到上一步产生的 Promise 对象resolve以后再调用
const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = asyncIterable[Symbol.asyncIterator]();
const [{value: v1}, {value: v2}] = await Promise.all([
  asyncIterator.next(), asyncIterator.next()
]);

console.log(v1, v2); // a b


```

### for await...of
前面介绍过，for...of循环用于遍历同步的 Iterator 接口。新引入的for await...of循环，则是用于遍历异步的 Iterator 接口。

```js
async function f() {
  for await (const x of createAsyncIterable(['a', 'b'])) {
    console.log(x);
  }
}
// a
// b

// for await...of遍历部署了 asyncIterable 异步接口的对象
let body = '';

async function f() {
  for await(const data of req) body += data;
  const parsed = JSON.parse(body);
  console.log('got', parsed);
}


async function () {
  try {
    for await (const x of createRejectingIterable()) {
      console.log(x);
    }
  } catch (e) {
    console.error(e);
  }
}
```


### 异步 Generator 函数
就像 Generator 函数返回一个同步遍历器对象一样，异步 Generator 函数的作用，是返回一个异步遍历器对象。

在语法上，异步 Generator 函数就是async函数与 Generator 函数的结合。
```js
async function* gen() {
  yield 'hello';
}
const genObj = gen();
genObj.next().then(x => console.log(x));
// { value: 'hello', done: false }
```

异步遍历器的设计目的之一，就是 Generator 函数处理同步操作和异步操作时，能够使用同一套接口。

```js
// 同步 Generator 函数
function* map(iterable, func) {
  const iter = iterable[Symbol.iterator]();
  while (true) {
    const {value, done} = iter.next();
    if (done) break;
    yield func(value);
  }
}

// 异步 Generator 函数
async function* map(iterable, func) {
  const iter = iterable[Symbol.asyncIterator]();
  while (true) {
    const {value, done} = await iter.next();
    if (done) break;
    yield func(value);
  }
}

```

### `yield*` 语句
`yield*`语句也可以跟一个异步遍历器。
```js
async function* gen1() {
  yield 'a';
  yield 'b';
  return 2;
}

async function* gen2() {
  // result 最终会等于 2
  const result = yield* gen1();
}

// 与同步 Generator 函数一样，for await...of循环会展开yield*
(async function () {
  for await (const x of gen2()) {
    console.log(x);
  }
})();
// a
// b
```

## ArrayBuffer
ArrayBuffer对象、TypedArray视图和DataView视图是 JavaScript 操作二进制数据的一个接口。
>  这些对象早就存在，属于独立的规格（2011 年 2 月发布），ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。它们都是以数组的语法处理二进制数据，所以统称为二进制数组。

二进制数组由三类对象组成。

- ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。

- TypedArray视图：共包括 9 种类型的视图，比如Uint8Array（无符号 8 位整数）数组视图, Int16Array（16 位整数）数组视图, Float32Array（32 位浮点数）数组视图等等。

- DataView视图：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节序。

简单说，ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。

很多浏览器操作的 API，用到了二进制数组操作二进制数据，下面是其中的几个。

- Canvas
- File API
- Fetch API
- WebSockets
- XMLHttpRequest

### ArrrayBuffer对象
ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。

```js
const buf = new ArrayBuffer(32);
// 为了读写这段内容，需要为它指定视图。
const dataView = new DataView(buf);
dataView.getUint8(0) // 0

const buffer = new ArrayBuffer(12);
// 对同一段内存，分别建立两种视图
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0]  = 2;

x1[0] // 2  


// TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数
const typedArray = new Uint8Array([0,1,2]);
typedArray.length // 3

typedArray[0] = 5;
typedArray // [5, 1, 2]
```

### ArrayBuffer.prototype.byteLength
```js
const typedArray = new Uint8Array([0,1,2]);
typedArray.length // 3

const u32arr = new Uint32Array([20, 30])
u32arr.buffer.byteLength // 8

const buffer = new ArrayBuffer(32);
buffer.byteLength
// 32
```

### ArrayBuffer.prototype.slice()
```js
const buffer = new ArrayBuffer(8);
const newBuffer = buffer.slice(0, 3); // 复制一段buffer  到新的内存位置

```

### ArrayBuffer.isView(buf)
```js
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer) // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v) // true

```
TypedArray 数组提供 9 种构造函数，用来生成相应类型的数组实例。

构造函数有多种用法。

`TypedArray(buffer, byteOffset=0, length?)`

```js
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);
```

`TypedArray(length)`

视图还可以不通过ArrayBuffer对象，直接分配内存而生成

```js
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];
```

`TypedArray(typedArray)`

TypedArray 数组的构造函数，可以接受另一个TypedArray实例作为参数。

```js
// 只是复制了参数数组的值，对应的底层内存是不一样的
const x = new Int8Array([1, 1]);
const y = new Int8Array(x);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 1


// 基于同一段内存，构造不同的视图
const x = new Int8Array([1, 1]);
const y = new Int8Array(x.buffer);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 2
```

`TypedArray(arrayLikeObject)`

构造函数的参数也可以是一个普通数组，然后直接生成TypedArray实例。

```js
const typedArray = new Uint8Array([1, 2, 3, 4]);

// typedArray 数组也可以转换回普通数组。

const normalArray = [...typedArray];
// or
const normalArray = Array.from(typedArray);
// or
const normalArray = Array.prototype.slice.call(typedArray);
```

**数组方法 普通数组的操作方法和属性，对 TypedArray 数组完全适用 (除了concat)**

TypedArray 数组与普通数组一样，部署了 Iterator 接口，所以可以被遍历

```js
let ui8 = Uint8Array.of(0, 1, 2);
for (let byte of ui8) {
  console.log(byte);
}
// 0
// 1
// 2
```

### 字节序
```js
const buffer = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);

for (let i = 0; i < int32View.length; i++) {
  int32View[i] = i * 2;
}

const int16View = new Int16Array(buffer);

// x86的计算机都采用小端字节序(little endian)
for (let i = 0; i < int16View.length; i++) {
  console.log("Entry " + i + ": " + int16View[i]);
}
// Entry 0: 0
// Entry 1: 0
// Entry 2: 2
// Entry 3: 0
// Entry 4: 4
// Entry 5: 0
// Entry 6: 6
// Entry 7: 0
```

> 比如，一个占据四个字节的 16 进制数0x12345678，小端字节序储存顺序就是78563412；大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。目前，所有个人电脑几乎都是小端字节序，所以 TypedArray 数组内部也采用小端字节序读写数据，或者更准确的说，按照本机操作系统设定的字节序读写数据。


## Decorator

修饰器是一个函数，用来修饰类/类的方法

安装 `babel-core` 和 `babel-plugin-transform-decorators-legacy` 后，babel 可支持 Decorator

```bash
npm i babel-core babel-plugin-transform-decorators-legacy

#  .babelrc
{"plugins": ["transform-decorators-legacy"]}
```

示例

```js
// test.es

function test(target) {
    target.testable = 'yes';
}

@test class Animal {
    constructor(name) {
        this.name = name
    }

    print() {
        console.log('i am ' , this.name);
    }
}


let cat = new Animal('cat');
cat.print();

console.log('testable:', Animal.testable);

> babel-node test.es
# 或者 先转码
> babel -o test.js test.es
> node test.js
```

修饰器的行为类似下面这样:

```js
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

修饰器是在编译阶段运行的，也就是说，修饰器本质就是编译时执行的函数

### 装饰器的参数

装饰器支持入参，产生不同的装饰行为, _实际上返回的闭包，才是真正的装饰器_

```js
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```

### 装饰方法

```js
class Animal {
    constructor(name) {
        this.name = name
    }

    print() {
        console.log('i am ' , this.name);
    }

    @readonly
    color() {
      console.log('my color is blue');
    }
}


let cat = new Animal('cat');
cat.print();
cat.color();

console.log(Animal.testable);

function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

// 转码后的代码并没有这句
cat.color = function() { console.log('my color is dirty') }

cat.color(); // my color is blue
```

由于存在函数提升，使得修饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。

如下，装饰器是没起作用的

```js
var readOnly = require("some-decorator");

@readOnly
function foo() {
}
```

## Generator

Generator 是 ES6 的新特性，通过 yield 关键字，可以让函数的执行流挂起,为改变执行流程提供了可能。

```js
// generaor function
function* hello() {
    var x = yield 1;
    console.log(x); // 2: go home
    var y = yield 2;
    console.log(y); // 4: go school
    var z = yield 3;
    console.log(z); // 2: go company
}

// generator-iterator
var g = hello();
console.log(g.next()); // 1: {value: 1, done: false};
console.log(g.next('go home')); // 3: {value: 2, done: false}
console.log(g.next('go school')); // 5: {value: 3, done: false}
console.log(g.next('go company')); // 6: {value: undefined, done: true}
```

`generator-iterator` 和 `for ... of` 结合, 完成自定义的遍历逻辑

```js
function* objectEntries(obj) {
    let keys = Object.keys(obj);
    for(let key of keys) {
        yield [key, obj[key]];
    }
}

let jane = {first: 'Jane', last: 'Doe'};
for(let [key, val] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}

// 或者 generator-iterator 赋值给对象的 Symbol.iterator
jane[Symbol.iterator] = objectEntries
```

generator 有 throw 方法, 外部抛出异常，内部捕获

```js
var g = function* () {
    try {
        yield
    }catch(e) {
        console.log('内部捕获异常', e);
    }
}

var i = g();
i.next();
try {
    i.throw('a');
    i.throw('b');
}catch(e) {
    console.log('外部捕获异常', e);
}
```

# es6 notes

[ES6 入门教程](http://es6.ruanyifeng.com/#docs/intro)

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

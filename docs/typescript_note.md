# typescript notes

[typescript入门教程](https://www.runoob.com/w3cnote/getting-started-with-typescript.html)  
   
[typescript教程](https://www.runoob.com/typescript/ts-tutorial.html)  

[结合实例学习 Typescript（2.6w字）](https://juejin.im/post/6876981358346895368)

[Typescript gitbook](https://www.runoob.com/manual/gitbook/TypeScript/_book/)  


## 简介

`TypeScript` 是 JavaScript 的一个超集，主要提供了 `类型系统` 和对 `ES6` 的支持，由 Microsoft 开发。

优点:

1. 类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用；
1. 可以在编译阶段就发现大部分错误，这总比在运行时候出错好；
1. 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等；

语法特性:
- 类 Class
- 接口 Interface
- 类型注解 Type annotations
- 编译时类型检查
- 箭头函数

**TypeSctipt 增强代码的可读性和可维护性**

> TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法，因此现有的 JavaScript 代码可与 TypeScript 一起工作无需任何修改，TypeScript 通过类型注解提供编译时的静态类型检查。

## 安装

```bash
npm i -g typescript
tsc -v # 查看版本 验证安装成功

tsc hello.ts  # 自动生成 hello.js
tsc -w hello.ts # 监听改动
nodemon hello.js # hello.js修改后 重新执行
```

[在线编译预览](https://www.tslang.cn/play/index.html)

## 例子

使用 `.ts` 文件扩展名， 使用 typescript 编写使用 `React` 时，使用 `.tsx` 扩展名。

使用 `:` 指定变量的类型，`:` 的前后有没有空格都可以;

```ts
function sayHello(name: string, age: number): string {
  return "Hello, I am " + name + ',' + age + 'years old';
}
sayHello("Alice");

// 用接口重新定义
interface Person {
  name: string;
  age: number;
}
function hello(person: Person): string {
  return `Hello, I am ${person.name}, ${person.age} years old`
}
```

## 编译

使用 tsc 命令可编译 `.ts` 文件， 生成一个同名 `.js` 文件；编译的时候即使报错了，还是会生成编译结果(.js)，可通过 `tsconfig.json` 文件配置

```bash
tsc hello.ts
```

## 基础类型
基本类型的批注是number, string和boolean。而弱或动态类型的结构则是any类型

> any 完全不做类型检查，可以进行任意运算  
> unkown 只能进行有限的操作和运算  
> object 表示非原始类型  
> {} Object 表示null undefined之外的类型，差别 Object 会对 Object.prototype 原型上的方法做检查

例子
```ts
function add(left:number, right: number): number {
    return left + right
}
```
> 类型批注可以被导出到一个单独的声明文件以让使用类型的已被编译为JavaScript的TypeScript脚本的类型信息可用。
> 当类型没有给出时，TypeScript编译器利用类型推断以推断类型。

### boolean

```ts
let isDone: boolean = false;

// Boolean生成的包装对象不是boolean类型
// 在ts里，boolean类型是原始类型
let newBool: boolean = new Boolean(true); // 报错
```

### number

```ts
let num: number = 6;
let numtoo: number = NaN;
```

### string

```ts
let name: string = "lufy";
let greets: string = `my name is ${name}`;
```

### void

void 类型的变量只能赋值为 `undefined` 和 `null`

```ts
function hello(name: string): void {
  console.log("Hello", name, "!");
}
```

### null 和 undefined

undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null

与 void 的区别是，undefined 和 null 是所有类型的子类型, 可以赋值给其他任意类型

```ts
let und: undefined = undefined;
let nu: null = null;
let num: number = 10;
num = nu;
```

### any

any 用来表示允许赋值为任意类型

```ts
let x: any = "strong";
x = 10;
// 在任意值上访问任何属性和方法都是允许的，即不做类型检查
console.log(x.hello().slice(1));

let count; // 推断为任意类型 同 let count: any
```

变量如果在声明的时候，未指定其类型， 也没有赋值， 那么它会被推断(*类型推导*)为任意值类型而完全不做类型检查

## 数组

可理解为相同类型的一组数据，数组类型有多种定义方式

1. 类型 + 方括号 ( `type[]` )  
   定义类型数组 _这种方式定义的数组项中不允许出现其他的类型_
   ```ts
   let list: number[] = [1, 2, 3];
   ```
2. 数组泛型 ( `Array<type>` )
   ```ts
   let list: Array<number> = [1, 2, 3];

   // 若数组元素的类型允许多种
   let arr: (string | number)[] = ['hello', 10]
   let items: Array<number | string> = ['good', 1]
   ```

## 元组 tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同，简单理解为可定义一组不同类型的数据：

```ts
let tup:[string, number] = ['name', 20]
console.log(tup[0])

// 越界访问元组元素，会重复已知类型去做推断 ::不会推导后面元素类型，不确定是否可配置
// tup: [string, number, string, number, ...]

```

## 枚举 enum
枚举类型用于取值被限定在一定范围内的场景，如一周只有7天，一年只有4季等

**枚举初始化**
枚举初始化可以理解为给枚举成员赋值。每个枚举成员都需要带有一个值，在未赋值的情况下， 枚举成员会被赋值为从 0 开始， 步长为 1 递增的数字

```ts
enum Weeks {Mon, Tue, Wed, Thu, Fri, Sat, Sun}
// 提供值 返回索引，提供索引 返回值
Weeks['Mon'] // 0
Weeks[0] // Mon
Weeks.Tue // 1
```
手动赋值时， 未赋值的枚举成员会接着上一个枚举项递增（初始化）：

```ts
enum Weeks {
    Mon, Tue, Wed, Thu = 2, Fri, Sat = -1.5, Sun
};

console.log(Weeks['Mon']); // => 0
console.log(Weeks.Wed); // => 2
console.log(Weeks.Thu); // => 2
console.log(Weeks.Fri); // => 3
console.log(Weeks.Sun); // => -0.5
```
TypeScript 支持 数字 的和基于字符串的枚举。

```ts
// 数值枚举
enum Weeks {
    Sun, Mon, Tue, Wed, Thu, Fri, Sat
};

// 字符串枚举
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

// 异构枚举 (混合字符串和数字)
enum Gender {
    Male = 0,
    Female = "1",
}

```

### 常量枚举 const enum
常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员
```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

```

### 外部枚举 declare enum
外部枚举与声明语句一样，常出现在声明文件中

```ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

## never
永远不存在值的类型，一般用于错误处理函数。

```ts
// 返回never的函数必须存在无法达到的终点
function willError(message: string): never {
    throw new Error(message)
}
```

## symbol

自ECMAScript 2015起，symbol成为了一种新的原生类型，就像 number 和 string 一样。

symbol类型的值是通过Symbol构造函数创建的。Symbols是不可改变且唯一的。

```ts
let s1 = Symbol('hello')
let s2 = Symbol('hello')
s1 == s2 // false
```

## object
object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。

```ts

function create(opt: object): void {

}
create({name: 'alice'})
create(null) // null undefined 是其他类型的子类型
create(undefined)
create('bad') // 报错
create(100) // 报错
create(false) // 报错
create(Symbol('hi')) // 报错
```
## 内置对象
JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。

### ECMAScript 的内置对象

Boolean、Error、Date、RegExp 等

```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```
### DOM 和 BOM 的内置对象
Document、HTMLElement、Event、NodeList 等。

```ts
 function getLength(sth: string | number): number {
     return (<string>sth).length
 }
```

类型断言 值 as 类型 ( as 语法 )  
```ts
  let other: any = 'this is also string'
  let size: number = (other as string).length
```



## 接口
接口使用 interface 关键字声明。一般首字母大写，根据ts命名规范，接口名加前缀 I

```ts
interface Shape {
    name: string;
    width: number;
    height: number;
    color?: string; // 可选属性
}

function area(shape: Shape) {
    var area = shape.width * shape.height
    return `I'm a ${shape.name} with area ${area} cm square`
}

console.log(area({name: 'rectangle', width: 20, height: 10}))
console.log(area({width: 30, height: 20})) // error 缺少name

// 对函数参数对象做类型检查
function getFood({name, color} : {name: string, color: string}): string {
    return `this ${name} color is ${color}`
}

interface IFood {
    name: string,
    readonly color: string // 只读属性
}

function getFood2({name, color}: IFood): string {
    return `this ${name} color is ${color}`
}
// 对象字面量做额外属性检查 导致类型报错
getFood2({name: 'alice', color: 'red', age: 12}) // error 包含额外字段 age
getFood2({name: 'alice', color: 'red', age: 12} as IFood) // ok
// 或者 修改接口 支持其他字段
interface IFood {
    name: string,
    readonly color: string,
    [propName: string]: any
}
// 或者 用兼容类型转换
let obj = {name: 'alice', color: 'red', age: 12}
getFood2(obj)

// ReadonlyArray<T> 创建不可变数组
let rolist: ReadonlyArray<number> = [1,2]
rolist[1] = 10 // error readonly


// readonly vs const 的区别
// const 定义的变量不可重新赋值，但是其属性值是可改变的，而 readonly 定义的属性不可改变。
```

> 索引签名 和 调用签名  
> 接口可以用来描述 函数类型 数组类型和对象类型  

使用接口表示函数类型时，需要给接口定义一个调用签名，用来描述函数的参数和返回值的类型。如下：
```ts
interface SumFn {
  (num1: number, num2: number): number
}

let add: SumFn = (n1, n2) => {
  return n1 + n2
}
add(2, 5)
```

用接口表示可索引的类型 数组和对象
```ts
interface StrArray {
    [index: number]: string
}
const arr: StrArry = ['hello', 'alice']

interface StrObject {
    [key: string]: string
}
const obj: StrObject = {name: 'aclie', like: 'sing'}
```

继承接口
```ts
interface BaseInfo {
  name: string,
  age: number
}

interface UserInfo extends BaseInfo {
  address: string
}

const userInfo: UserInfo = {
  name: 'jack',
  age: 12,
  address: 'shanghai'
}

// 多重继承

interface AllInfo extends BaseInfo, AddressInfo {
  hobby: string
}

const allInfo: AllInfo = {
  name: 'mike',
  age: 12,
  address: 'beijing',
  hobby: 'song'
}

```

混合类型接口
```ts
interface Counter {
  // 函数参数和返回值类型
  (): void;
  // 函数属性及类型
  count: number;
  // 函数方法及返回值
  reset(): void;
}

// 定义一个函数，该函数返回Counter类型的函数
function getCounter(): Counter {
  const getCount = () => {
    getCount.count++
  }
  getCount.count = 0
  getCount.reset = function () {
    this.count = 0
  }
  return getCount
}

const getCount = getCounter()
getCount()        // 1
getCount()        // 2
getCount.reset()   // 0
```

## 箭头函数表达式（lambda表达式）
lambda表达式 ()=>{something}或()=>something 相当于js中的函数,它的好处是可以自动将函数中的this附加到上下文中。

```ts
var shape = {
    name: 'rectangle',
    popup: function() {
        console.log('this inside popup', this.name)
        setTimeout(() => {
            console.log('this inside setTimeout', this.name)
        }, 1000)
    }
}
shape.popup()
```

## 类
TypeScript中的类不仅具有ES6中类的全部功能，还提供了修饰符、抽象类等其他新功能。

```ts
class Shape {
    area: number;
    color: string;

    constructor(name: string, width: number, height: number) {
        this.area = width * height
        this.color = 'pink'
    };

    show() {
        return `I'm ${this.color} ${this.name} with area of ${this.area} cm square`
    }

}
var shape = new Shape('rectangle', 20, 30)
shape.show() // 因为类型注解没有name属性，所以访问this.name会报错


```
TypeScript 可以使用三种修饰符，分别是 public、private 和 protected。

public 和 private 访问修饰符。Public 成员可以在任何地方访问， private 成员只允许在类中访问

```ts
class Person {
    // 构造函数的 public name 等同下面的声明
    // name: string;

    private age: number;
    private sex: string;
    
    constructor(public name: string, age, sex) {
        // 构造函数参数内 public name 会自动做这个赋值
        // this.name = name
        this.age = age
        this.sex = sex
    }

    show() {
        return `I am ${this.name}, a ${this.sex}, ${this.age} yeas old~`
    }
}

var alice = new Person('alice', 10, 'girl')
console.log(alice.show())
console.log(alice.sex) // 编译会报错 sex是private属性
```
抽象类  
当构造函数修饰为 protected 时，该类只允许被继承，不能在包含它的类外被实例化：

```ts
class Animal {
  public name: string;
  protected constructor (name: string) {
    this.name = name
  }
}

class Cat extends Animal {
  constructor (name: string) {
    super(name)
  }
}

let cat = new Animal('mike')
// 报错：Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

## 继承
我们可以继承一个已存在的类并创建一个派生类，继承使用关键字 extends

```ts
class Shape3D extends Shape {
    volume: number;

    constructor(public name: string, width: number, height: number, length: number) {
        super(name, width, height)
        this.volume = length * this.area
    };

    show() {
        return `I'm ${this.name} with volume of ${this.volume} cm cue`
    };

    superShow() {
        return super.show()
    }
}
var cube = new Shape3D('cube', 30, 20, 10)
console.log(cube.show())
console.log(cube.superShow())
```
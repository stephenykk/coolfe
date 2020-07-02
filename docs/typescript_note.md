# typescript notes

## 简介

`TypeScript` 是 JavaScript 的一个超集，主要提供了 `类型系统` 和对 `ES6` 的支持，由 Microsoft 开发。

优点:

1. 类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用；
1. 可以在编译阶段就发现大部分错误，这总比在运行时候出错好；
1. 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等；

**TypeSctipt 增强代码的可读性和可维护性**

## 安装

```bash
npm i -g typescript
tsc -v # 查看版本 验证安装成功
```

[在线编译预览](https://www.tslang.cn/play/index.html)

## 例子

使用 `.ts` 文件扩展名， 使用 typescript 编写使用 `React` 时，使用 `.tsx` 扩展名。

使用 `:` 指定变量的类型，`:` 的前后有没有空格都可以;

```ts
function sayHello(person: string) {
  return "Hello," + person;
}
sayHello("Alice");
```

## 编译

使用 tsc 命令可编译 `.ts` 文件， 生成一个同名 `.js` 文件；编译的时候即使报错了，还是会生成编译结果(.js)，可通过 `tsconfig.json` 文件配置

```bash
tsc hello.ts
```

## 基础类型

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

变量如果在声明的时候，未指定其类型， 也没有赋值， 那么它会被推断(类型推论)为任意值类型而完全不被类型检查

## 数组

可理解为相同类型的一组数据，数组类型有多种定义方式

1. 类型 + 方括号 ( `type[ ]` )  
   定义类型数组 _这种方式定义的数组项中不允许出现其他的类型_
   ```ts
   let list: number[] = [1, 2, 3];
   ```
2. 数组泛型 ( `Array<type>` )
   ```ts
   let list: Array<number> = [1, 2, 3];
   ```

## 元组 tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同，简单理解为可定义一组不同类型的数据：

```ts
let tup:[string, number] = ['name', 20]
console.log(tup[0])

// 越界访问元组元素，会重复已知类型去做推断
// tup: [string, number, string, number, ...]
tup[2] = 'zoro'
tup[3] = true // 报错，该位置推断为 number

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
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

## 类型推论
变量申明如果没有明确的指定类型，那么 TypeScript 会依照类型推论的规则推断出一个类型.  
变量声明但是未赋值，会推论为 any

```ts
let day = 'seven';
// 等价于 let day: string = 'seven';
day = 4;
// 编译报错: error TS2322: Type 'number' is not assignable to type 'string'

let x; // 等价 let x: any
x = 100
x = 'good'
```
## 联合类型
表示取值可以为多种类型中的一种，使用 | 分隔每个类型  
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候, 我们只能访问此联合类型的所有类型里共有的属性或方法

```ts
let stringOrNumber:string | number;
stringOrNumber = 'seven';

function getLength(something: string | number): number {
  return something.length;
  // => 编译报错: length 不是 string类型 和 number类型 的共有属性, 所以报错
}
```

## 类型断言

类型断言（Type Assertion）可以用来手动指定一个值的类型。

当使用 tsx 时，只有 as语法断言是被允许的

类型断言有2种形式：

1. <类型>值 ( 尖括号语法 )  
    ```ts
    let some: any = 'this is a string'
    let len: number = (<string>some).length

    function getLength(sth: string | number): number {
        return (<string>sth).length
    }
    ```
2. 值 as 类型 ( as 语法 )  
    ```ts
    let other: any = 'this is also string'
    let size: number = (other as string).length
    ```






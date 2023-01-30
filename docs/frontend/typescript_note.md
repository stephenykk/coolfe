# typescript notes

[typescript 入门教程](https://www.runoob.com/w3cnote/getting-started-with-typescript.html)

[typescript 教程](https://www.runoob.com/typescript/ts-tutorial.html)

[结合实例学习 Typescript（2.6w 字）](https://juejin.im/post/6876981358346895368)

[Typescript gitbook](https://www.runoob.com/manual/gitbook/TypeScript/_book/)

[tsconfig.json 配置详解](https://www.cnblogs.com/terrymin/p/13897214.html)

[ts官方文档翻译](https://ts.yayujs.com/)

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
  return "Hello, I am " + name + "," + age + "years old";
}
sayHello("Alice");

// 用接口重新定义
interface Person {
  name: string;
  age: number;
}
function hello(person: Person): string {
  return `Hello, I am ${person.name}, ${person.age} years old`;
}
```

## 编译

使用 tsc 命令可编译 `.ts` 文件， 生成一个同名 `.js` 文件；编译的时候即使报错了，还是会生成编译结果(.js)，可通过 `tsconfig.json` 文件配置

```bash
tsc hello.ts
```

## 基础类型

基本类型的批注是 number, string 和 boolean。而弱或动态类型的结构则是 any 类型

> any 完全不做类型检查，可以进行任意运算  
> unkown 只能进行有限的操作和运算  
> object 表示非原始类型  
> {} Object 表示 null undefined 之外的类型，差别 Object 会对 Object.prototype 原型上的方法做检查

例子

```ts
function add(left: number, right: number): number {
  return left + right;
}
```

> 类型批注可以被导出到一个单独的声明文件以让使用类型的已被编译为 JavaScript 的 TypeScript 脚本的类型信息可用。
> 当类型没有给出时，TypeScript 编译器利用类型推断以推断类型。

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

变量如果在声明的时候，未指定其类型， 也没有赋值， 那么它会被推断(_类型推导_)为任意值类型而完全不做类型检查

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
   let arr: (string | number)[] = ["hello", 10];
   let items: Array<number | string> = ["good", 1];
   ```

## 元组 tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同，简单理解为可定义一组不同类型的数据：

```ts
let tup: [string, number] = ["name", 20];
console.log(tup[0]);

// 越界访问元组元素，会重复已知类型去做推断 ::不会推导后面元素类型，不确定是否可配置
// tup: [string, number, string, number, ...]
```

## 枚举 enum

枚举类型用于取值被限定在一定范围内的场景，如一周只有 7 天，一年只有 4 季等

**枚举初始化**
枚举初始化可以理解为给枚举成员赋值。每个枚举成员都需要带有一个值，在未赋值的情况下， 枚举成员会被赋值为从 0 开始， 步长为 1 递增的数字

```ts
enum Weeks {
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
  Sun,
}
// 提供值 返回索引，提供索引 返回值
Weeks["Mon"]; // 0
Weeks[0]; // Mon
Weeks.Tue; // 1
```

手动赋值时， 未赋值的枚举成员会接着上一个枚举项递增（初始化）：

```ts
enum Weeks {
  Mon,
  Tue,
  Wed,
  Thu = 2,
  Fri,
  Sat = -1.5,
  Sun,
}

console.log(Weeks["Mon"]); // => 0
console.log(Weeks.Wed); // => 2
console.log(Weeks.Thu); // => 2
console.log(Weeks.Fri); // => 3
console.log(Weeks.Sun); // => -0.5
```

TypeScript 支持 数字 的和基于字符串的枚举。

```ts
// 数值枚举
enum Weeks {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

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
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
```

### 外部枚举 declare enum

外部枚举与声明语句一样，常出现在声明文件中

```ts
declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
```

## never

永远不存在值的类型，一般用于错误处理函数。

```ts
// 返回never的函数必须存在无法达到的终点
function willError(message: string): never {
  throw new Error(message);
}
```

## symbol

自 ECMAScript 2015 起，symbol 成为了一种新的原始类型，就像 number 和 string 一样。

symbol 类型的值是通过 Symbol 构造函数创建的。Symbols 是不可改变且唯一的。

```ts
let s1 = Symbol("hello");
let s2 = Symbol("hello");
s1 == s2; // false
```

## object

object 表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

```ts
function create(opt: object): void {}
create({ name: "alice" });
create(null); // null undefined 是其他类型的子类型
create(undefined);
create("bad"); // 报错
create(100); // 报错
create(false); // 报错
create(Symbol("hi")); // 报错
```

## 内置对象

JavaScript 中有很多内置对象，它们可以直接在 TypeScript 中当做定义好了的类型。

### ECMAScript 的内置对象

Boolean、Error、Date、RegExp 等

```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

### DOM 和 BOM 的内置对象

Document、HTMLElement、Event、NodeList 等。

```ts
function getLength(sth: string | number): number {
  return (<string>sth).length;
}
```

类型断言 值 as 类型 ( as 语法 )

```ts
let other: any = "this is also string";
let size: number = (other as string).length;
```

## 接口

接口使用 interface 关键字声明。一般首字母大写，根据 ts 命名规范，接口名加前缀 I

```ts
interface Shape {
  name: string;
  width: number;
  height: number;
  color?: string; // 可选属性
}

function area(shape: Shape) {
  var area = shape.width * shape.height;
  return `I'm a ${shape.name} with area ${area} cm square`;
}

console.log(area({ name: "rectangle", width: 20, height: 10 }));
console.log(area({ width: 30, height: 20 })); // error 缺少name

// 对函数参数对象做类型检查
function getFood({ name, color }: { name: string; color: string }): string {
  return `this ${name} color is ${color}`;
}

interface IFood {
  name: string;
  readonly color: string; // 只读属性
}

function getFood2({ name, color }: IFood): string {
  return `this ${name} color is ${color}`;
}
// 对象字面量做额外属性检查 导致类型报错
getFood2({ name: "alice", color: "red", age: 12 }); // error 包含额外字段 age
getFood2({ name: "alice", color: "red", age: 12 } as IFood); // ok
// 或者 修改接口 支持其他字段
interface IFood {
  name: string;
  readonly color: string;
  [propName: string]: any;
}
// 或者 用兼容类型转换
let obj = { name: "alice", color: "red", age: 12 };
getFood2(obj);

// ReadonlyArray<T> 创建不可变数组
let rolist: ReadonlyArray<number> = [1, 2];
rolist[1] = 10; // error readonly

// readonly vs const 的区别
// const 定义的变量不可重新赋值，但是其属性值是可改变的，而 readonly 定义的属性不可改变。
```

> 索引签名 和 调用签名  
> 接口可以用来描述 函数类型 数组类型和对象类型

使用接口表示函数类型时，需要给接口定义一个调用签名，用来描述函数的参数和返回值的类型。如下：

```ts
interface SumFn {
  (num1: number, num2: number): number;
}

let add: SumFn = (n1, n2) => {
  return n1 + n2;
};
add(2, 5);
```

用接口表示可索引的类型 数组和对象

```ts
interface StrArray {
  [index: number]: string;
}
const arr: StrArry = ["hello", "alice"];

interface StrObject {
  [key: string]: string;
}
const obj: StrObject = { name: "aclie", like: "sing" };
```

继承接口

```ts
interface BaseInfo {
  name: string;
  age: number;
}

interface UserInfo extends BaseInfo {
  address: string;
}

const userInfo: UserInfo = {
  name: "jack",
  age: 12,
  address: "shanghai",
};

// 多重继承

interface AllInfo extends BaseInfo, AddressInfo {
  hobby: string;
}

const allInfo: AllInfo = {
  name: "mike",
  age: 12,
  address: "beijing",
  hobby: "song",
};
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
    getCount.count++;
  };
  getCount.count = 0;
  getCount.reset = function () {
    this.count = 0;
  };
  return getCount;
}

const counter = getCounter();
counter(); // 1
counter(); // 2
counter.reset(); // 0
```

## 箭头函数表达式（lambda 表达式）

lambda 表达式 ()=>{something}或()=>something 相当于 js 中的函数,它的好处是可以自动将函数中的 this 附加到上下文中。

```ts
var shape = {
  name: "rectangle",
  popup: function () {
    console.log("this inside popup", this.name);
    setTimeout(() => {
      console.log("this inside setTimeout", this.name);
    }, 1000);
  },
};
shape.popup();
```

## 类

TypeScript 中的类不仅具有 ES6 中类的全部功能，还提供了修饰符、抽象类等其他新功能。

```ts
class Shape {
  area: number;
  color: string;

  constructor(name: string, width: number, height: number) {
    this.area = width * height;
    this.color = "pink";
  }

  show() {
    return `I'm ${this.color} ${this.name} with area of ${this.area} cm square`;
  }
}
var shape = new Shape("rectangle", 20, 30);
shape.show(); // 因为类型注解没有name属性，所以访问this.name会报错
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
    this.age = age;
    this.sex = sex;
  }

  show() {
    return `I am ${this.name}, a ${this.sex}, ${this.age} yeas old~`;
  }
}

var alice = new Person("alice", 10, "girl");
console.log(alice.show());
console.log(alice.sex); // 编译会报错 sex是private属性
```

抽象类  
当构造函数修饰为 protected 时，该类只允许被继承，不能在包含它的类外被实例化：

```ts
class Animal {
  public name: string;
  protected constructor(name: string) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
}

let cat = new Animal("mike");
// 报错：Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

## 继承

我们可以继承一个已存在的类并创建一个派生类，继承使用关键字 extends

```ts
class Shape3D extends Shape {
  volume: number;

  constructor(
    public name: string,
    width: number,
    height: number,
    length: number
  ) {
    super(name, width, height);
    this.volume = length * this.area;
  }

  show() {
    return `I'm ${this.name} with volume of ${this.volume} cm cue`;
  }

  superShow() {
    return super.show();
  }
}
var cube = new Shape3D("cube", 30, 20, 10);
console.log(cube.show());
console.log(cube.superShow());
```


----


typescript 提供了类型系统和对ES6的支持

> vue3也是使用typescript开发的

类型：
- number
- string
- boolean
- void
- unknow
- any
- object
- {} Object


ts保证类型安全，帮助开发者在编译阶段发现错误

- any vs unknown 未知类型，有限操作
- object 非原始类型 vs {}  Object 非null 非undefined
- interface 支持声明合并 vs type 不支持声明合并 有块作用域 更通用，右侧可以是类型运算表达式
```ts
type A = number
type B = A | string
type ValueOf<T> = T[keyof T]  // 泛型

// 需要类型运算用type, 需要被扩展就用interface
```

- enum 支持value反向查找 vs const enum 不支持反向查找，因为不会生成对象，而是编译阶段做值替换
- 脚本模式 vs  模块模式 包含import or export
```ts
  // a.ts 脚本模式
  GlobalStore.foo = 'yes'
  declare var GlobalStore { // 声明全局对象的属性GlobalStore
    foo: string;
  }

  // b.ts 模块模式
  GlobalStore.foo = 'yes'
  declare global {
    var GlobalStore {
      foo: string;
    }
  }
  export {} // 包含export 模块模式
```

类型运算
- A & B 交集
- A | B 并集

索引签名  
索引签名可以定义对象内属性和值的类型

```ts
interface Props {
  [key: string]: number
}

```

类型键入  
类型键入允许ts像取对象属性一样使用类型
```ts
type User = {
  userid: number;
  friendList: {
    firstName: string;
    lastName: string;
  }[]
}

type FriendList = User['friendList']
type Friend = User['friendList'][number] // number是关键字，取数组项的类型
```

获取对象类型  `typeof value`
```ts
let s1 = 'hello' // let 声明变量 推断为宽松类型
type T1 = typeof s1 // string

const s2 = 'wrold' // const 声明常量 推断为严格类型
type T2 = typeof S2 // 'world'
```

获取类型的key组成的类型  `keyof Type`
```ts
type User = {
  id: number;
  name: string;
}

type UserKeys = keyof User // 'id' | 'name'

// enum 枚举类型既表示类型，也表示值（伴生对象），所以需要先用typeof enumType 获得类型
enum Direction {
  Up,
  Down
}
type DirectionKeys = keyof typeof Direction // 'Up' | 'Down'
```

extends的作用
- interface中，表示类型扩展
- 条件类型语句中，表示布尔运算
- 泛型中，表示类型约束
- class中，表示继承

```ts
// 表示类型扩展
interface A {
  a: string;
}
interface B extends A {
  b: string;
}

// 表示布尔运算
type Bar<T> = T extends string ? 'string' : never
type C = Bar<number> // never
type D = Bar<string> // 'string'
type E = Bar<'hi'> // 'string'

// 表示类型约束
type Res<T extends object> = T
type F = Res<number> // error
type G = Res<{}> // {}


class A {}
class B extends A {}


type K = '1' extends '1' | '2' ? 'true' : 'false' // "true"
type L = '1' | '2' extends '1' ? 'true' : 'false' // "false"

type M = { a: 1 } extends { a: 1, b: 1 } ? 'true' : 'false' // "false"
type N = { a: 1, b: 1 } extends { a: 1 } ? 'true' : 'false' // "true"

```

is 类型保护, 其他类型保护的关键字有：typeof instanceof in 

```ts
interface Fish {
  swim: () => {}
}

function isFish(pet: any) pet is Fish {
  return (pet as Fish).swim !== undefined
}

let pet = {} as unknown

if (isFish(pet)) {
  pet.swim() // ok
} else {
  pet.swim() // error
}

```

声明函数类型

```ts
declare function filter(
  arr: number[], 
  fn: (item: unknown) => boolean 
): number[]
```

泛型  
泛型好比方法，可以传入类型参数，得到新的类型
```ts
declare function filter<T> (
  arr: T[],
  fn: (item: unknown) => boolean
): T[]


// 类型参数约束 和 默认值
type MyEvent<T extends HTMLElement = HTMLElement> = {
  target: T,
  type: string
}
```

映射类型  in
```ts
type Props = {
  [key in 'count' | 'id']: number
}
```

内置泛型：Record<Keys, ValType>

```ts
type Keys = 'a' | 'b' | 'c'
type Users = Record<Keys, {name: string}>;

type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

内置泛型：Partial<T>  

```ts
type User {
  id: string;
  gender: 'male' | 'female'
}

type PartialUser = Partial<User>
function createUser(user: PartialUser = { gender: 'male' })

type Partial<T> = {
  [U in keyof T]?: T[U];
};
```

内置泛型：Required<T>  
Required 和 Partial 的作用相反，是将对象类型的属性都变成必须。

```ts
// -? 符号在这里表示的意思是去掉可选符号 ?
type Required<T> = {
  [U in keyof T]-?: T[U];
};

```

内置泛型：Readonly<T>  

```ts
type Readonly<T> = {
  readonly [U in keyof T]: T[U];
};
```

内置泛型：Pick<T, U> 

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

内置泛型：Omit<T, U> 
Omit 结合了 Pick 和 Exclude，将忽略对象类型中的部分 keys。

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

条件类型  

```ts
type IsString<T> = T extends string ? true : false

```
在处理并集时，条件类型还具有条件分配的逻辑，number | string 做条件运算等价于 number 条件运算 | string 条件运算

```ts
type ToArray<T> = T[]
type A = ToArray<number | string> // (string | number)[]

type ToArray2<T> = T extends unknown ? T[] : T[];
type B = ToArray2<number | string>; // string[] | number[]

```

infer 动态类型推导  

```ts
type ApiResponse<T> = {
  code: number
  data: T
};

type UserResponse = ApiResponse<{
  id: string,
  name: string
}>

type EventResponse = ApiResponse<{
  id: string,
  title: string
}>

type ApiResponseEntity<T> = T extends ApiResponse<infer U> ? U : never;

type User = ApiResponseEntity<UserResponse>; // { id: string; name: string; }
type Event = ApiResponseEntity<EventResponse>; // { id: string; title: string; }

```

内置泛型：ReturnType<T>  

```ts
type A = (a: number) => string
type B = ReturnType<A> // string

type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

内置泛型：Paramters<T>  
Parameters 用来获取方法的参数类型

```ts
type EventListenerParamsType = Parameters<typeof window.addEventListener>;

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P : never;

```

内置泛型：Exclude<T, U>  
Exclude 用来计算在 T 中而不在 U 中的类型

```ts
// T U 都是联合类型， 如 type T = 'a' | 'b' | 'c'
// 联合类型用在条件语句中时，每个类型项分别做条件运算
type Exclude<T, U> = T extends U ? never : T;

```

内置泛型：Extract<T, U>  
Extract 用来计算 T 中可以赋值给 U 的类型 , 和 `Exclude<T, U>` 刚好相反

```ts
type Extract<T, U> = T extends U ? T : never;
```

内置泛型：NonNullable

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

npm包具有类型提示  
- tsconfig.json 中， 配置 `declaration: true` , 编译时自动生成声明文件
- package.json 中, 定义 prepublish 编译ts, 每次 `npm publish` 时，完成ts编译
- package.json 中, 设置types字段，指向类型声明文件

```js
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true // 自动生成声明文件 d.ts
  }
}

// package.json
{
  "name": "@scope/awesome-typescript-package",
  "version": "0.0.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts", // 模块 types 路径
  "scripts": {
    "tsc": "tsc -p ./tsconfig.json",
    "prepublishOnly": "npm run tsc" // 每次执行 npm publish 之前，编译代码
  }
}

```


第三方模块的类型补充  

- 安装对应的类型文件 @types/xxx
- 配置 tsconfig.json, 自己扩展类型
  ```js
  // tsconfig.json
  {
    "compilerOptions": {
      "types": ["./types/*.d.ts"]
    }
  }

  // types/my.d.ts 利用声明合并，进行扩展
  declare global {
    interface JQuery {
      myPlugin: MyPlugin
    }
  }

  declare module 'react' {
    interface ImgHTMLAttributes<T> {
      loading?: 'lazy' | 'eager'
    }
  }
  ```


为什么 enum/class 可以作为 type 也可以作为 value？  
实际上，Typescript 支持类似伴生对象的模式，即把类型和对象配对绑定在一起。使用者可以一起导入二者。

```ts
type Currency = {
  unit: "EUR" | "GBP" | "JPY";
  value: number;
};

const Currency = {
  from: (value: number, unit: Currency["unit"] = "EUR"): Currency => {
    return {
      unit,
      value: value,
    };
  },
};

const currency: Currency = Currency.from(10);

```

为什么字面量会报错，而将字面量赋值之后就不会了  
Typescript 会对对象字面量的写法开启【多余属性检查】

为什么无法将 'right' 赋值给 “boolean | "right" | "left" | undefined” 类型  
Typescript 在做类型推导时会进行【类型拓宽】，故意推导出一个更宽泛的类型。修复方法 as const / 显示声明对象类型，不用推导  
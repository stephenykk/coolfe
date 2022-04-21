# babel notes

[Babel 快速入门](https://www.jiangruitao.com/babel/quick-start/)

Babel 是一个工具集，主要用于将 ES6 版本的 JavaScript 代码转为 ES5 等向后兼容的 JS 代码，从而可以运行在低版本浏览器或其它环境中。

## 配置文件

- babel.config.js
- .babelrc
- .babelrc.js
- package.json 字段

## 基础依赖包

- @babel/cli babel 命令行转码工具
- @babel/core babel 核心 npm 包，被@babel/cli 依赖
- @babel/preset-env ES6 转 ES5 的语法转换规则

## babel 转码工程通常包括

- babel 配置文件,如： babel.config.js
- babel 相关 npm 包, 如：@babel/core @babel/preset-env
- 需要转码的 js 文件

执行转码命令

`npx babel main.js -o compiled.js`

> `npx`是新版 nodejs 附带的命令，它运行时会在 `node_modules/.bin/` 下查找对应的命令， 上面的命令等价于 `node_modules/.bin/babel main.js -o compiled.js`
> 设置淘宝镜像源 `npm config set registry https://registry.npm.taobao.org`

## babel 的主要工作包括 2 部分

- 语法转换
- API 补齐

> 那什么是补齐 API？ 简单解释就是，通过 Polyfill 的方式在目标环境中添加缺失的特性 。

Babel 默认只转换新的 JavaScript 语法（syntax），而不转换新的 API。

**新的 API 分类两类：**

一类是 Promise、Map、Symbol、Proxy、Iterator 等全局对象及其对象自身的方法，例如 Object.assign，Promise.resolve；

另一类是新的实例方法，例如数组实例方法[1, 4, -5, 10].find((item) => item < 0)

如果想让 ES6 新的 API 在低版本浏览器正常运行，我们就不能只做语法转换。

> 在前端 web 工程里，最常规的做法是使用 polyfill，为当前环境提供一个垫片。所谓垫片，是指垫平不同浏览器之间差异的东西。polyfill 提供了全局的 ES6 对象以及通过修改原型链 Array.prototype 等实现对实例的实现。

_polyfill 广义上讲是为环境提供不支持的特性的一类文件或库，狭义上讲是 polyfill.js 文件以及@babel/polyfill 这个 npm 包。_

补齐 API 的方式除了通过引入 polyfill.js 文件 ，还有通过在构建工具入口文件（例如 webapck），babel 配置文件等方式进行。

```html
<!-- polyfill -->

<!-- 方式1 -->
<script src="https://cdn.bootcss.com/babel-polyfill/7.6.0/polyfill.js"></script>
```

```es6
// ES6新API
Array.from(new Set([1, 2, 3, 3])); // [1, 2, 3]
Array.from({ length: 3 }).map((_, i) => i); // [0, 1, 2]
Array.of(10); // [10]

arr = ["a", "b", [1, 2]];
arr.flat(1); // ['a', 'b', [1, 2]]
arr.flat(2); // ['a', 'b', 1, 2]

Object.assign(target, source);
```

## babel 的版本

目前，前端开发领域使用的 Babel 版本主要的 Babel6 和 Babel7 这两个版本。

你可能想问，怎么查看使用的 Babel 是哪个版本？

在入门章节，我们讲过 Babel 是一个工具集，而这个工具集是围绕@babel/core 这个核心 npm 包构成的。每次@babel/core 发布新版本的时候，整个工具集的其它 npm 包也都会跟着升级到与@babel/core 相同的版本号，即使它们的代码可能一行都没有改变。

因此，我们提到 Babel 版本的时候，通常是指@babel/core 这个 Babel 核心包的版本。

web 前端开发有必要了解这两个版本的变化。

Babel7 的 npm 包都是放在 babel 域下的，即在安装 npm 包的时候，我们是安装@babel/这种方式，例如@babel/cli、@babel/core 等。而在 Babel6，我们安装的包名是 babel-cli，babel-core 等。其实它们本质是一样的，都是 Babel 官方的 cli 命令行工具和 core 核心包，而且功能是一样的，只是名称版本变化了一下而已。在平时开发和学习的过程中，碰到'@babel/'和'babel-'应该下意识认识到他俩原本是一个包，只是版本不一样而已。

## babel 配置文件

无论是通过命令行工具 babel-cli 来进行编译，还是 webpack 这类的构建工具，通常情况下，我们都需要建立一个 Babel 配置文件来指定编译的规则。

Babel 的配置文件是 Babel 执行时默认会在当前目录寻找的文件，主要有.babelrc，.babelrc.js，babel.config.js 和 package.json。它们的配置项都是相同，作用也是一样的，只需要选择其中一种。

对于.babelrc，它的配置是这样子

```js
  {
    "presets": ["es2015", "react"],
    "plugins": ["transform-decorators-legacy", "transform-class-properties"]
  }
```

对于 babel.config.js 和.babelrc.js，它的配置是一样的，通过 module.exports 输出配置项

```js
module.exports = {
  presets: ["es2015", "react"],
  plugins: ["transform-decorators-legacy", "transform-class-properties"],
};
```

##

Babel 配置文件
一、配置文件

在前面几小节，我们已经简单使用过 Babel 的配置文件了。现在我们来深入学习它。

无论是通过命令行工具 babel-cli 来进行编译，还是 webpack 这类的构建工具，通常情况下，我们都需要建立一个 Babel 配置文件来指定编译的规则。

Babel 的配置文件是 Babel 执行时默认会在当前目录寻找的文件，主要有.babelrc，.babelrc.js，babel.config.js 和 package.json。它们的配置项都是相同，作用也是一样的，只需要选择其中一种。

对于.babelrc，它的配置是这样子
{
"presets": ["es2015", "react"],
"plugins": ["transform-decorators-legacy", "transform-class-properties"]
}

对于 babel.config.js 和.babelrc.js，它的配置是一样的，通过 module.exports 输出配置项

```nodejs
  module.exports = {
    "presets": ["es2015", "react"],
    "plugins": ["transform-decorators-legacy", "transform-class-properties"]
  }
```

对于 package.json，就是在 package.json 中增加一个 babel 属性和值，它的配置是这样子

```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "babel": {
    "presets": ["es2015", "react"],
    "plugins": ["transform-decorators-legacy", "transform-class-properties"]
  }
}
```

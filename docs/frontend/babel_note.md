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
```js
{
"presets": ["es2015", "react"],
"plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```

对于 babel.config.js 和.babelrc.js，它的配置是一样的，通过 module.exports 输出配置项

```js
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

-----

babel （Mono Repository , Lerna , fixed version 固定版本模式）工具集  转换高版本ES到低版本JS，是代码能运行在浏览器环境

配置文件  babel.config.js .babelrc .babelrc.js   package.json/babel字段 babel-loader

配置字段：
```js
{
  // presets: [presetName,  [presetName, options], ...]
  presets: ['@babel/env', '@babel/react', '@babel/typescript']
  plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-vue-jsx']
  env: {
      // npm-script  BABEL_ENV=lib , 可区分环境进行配置
      umd: { presets: [], plugins: []}
      lib: { presets: [], }
}
```


依赖包
- @babel/core
- @babel/cli
- @babel/preset-env
- @babel/polyfill

npx babel main.js -o main.out.js

npx node_modules/.bin/ 下查找命令或下载包
npm config set registry https://registry.npm.taobao.org

- 语法转换 (let const arrowFn, class, async/await, 解构赋值)
- polyfill 新的API ( Promise , Map , Set, Proxy, Iterator, fromEntries，Array.from, Array.of, arr.flat(n=1))


需要在配置文件中，browserlist字段指定目标浏览器是哪些，如： `browserlist: ['> 1%', 'not ie <= 8'>]`

目标浏览器配置(*除babel外，还影响 autoprefixer, postcss等插件*)：
- package.json browerlist字段
- .browserlistrc

> 如果没有browerlist配置，babel会把所有ES6语法转换为ES5,
> 如果指定了browerlist配置, 如 `browserlist: ['chrome 70']` 目标环境已支持的ES6语法，不会被转换
> babel.config.js中的targets配置优先级更高，有配置targets， 则忽略browserlist
> *通常，我们使用browserlist配置目标环境*

polyfill的方式
- script标签引入polyfill的cdn链接
- 代码中import @babel/polyfill
- webpack等构建工具入口文件加入 @babel/polyfill
- babel.config.js 中进行配置
  ```js
   {  presets: [ 
           [  '@babel/env', {
                  targets: { // object | string | string[]
                    'chrome': 58,
                    'ie': 11
                  },  // 目标环境
                   useBuiltIns: 'usage', // 'usage' | 'entry' | false 
                   corejs: { version: 2, proposals: true },
                   modules: 'cjs', 
            }]
       ]
    }

  ```

polyfill的补齐逻辑：
- `useBuiltIns: 'usage'`  
  仅对代码中用到的且目标环境不支持的新API进行补齐

- `useBuiltIns: 'entry'`
  需要在入口处导入polyfill包 `import '@babel/polyfill'`, 会对目标环境不支持的新API进行补齐(*即使代码中并没有用到的新API*)

corejs的版本
- 两种版本 `core-js@2` 和 `core-js@3` *建议用corejs3*，模块更全，如：`arr.flat方法 corejs2并没有`

modules参数 
指定需要把ES6模块转换为哪种模块语法
- 模块语法 amd cjs commonjs umd systemjs auto false

> 默认import语法转换为require语法, ESM -> commonjs
> `modules: false` 则表示保留ESM语法不转换，结合webpack等构建工具的tree-shaking功能，可优化包体积

@babel/polyfill 是 core-js/stable  regenerator-runtime/runtime 两个包的组合

执行顺序
- 插件比预设先执行
- 插件从前到后顺序执行
- 预设从后到前反序执行


preset和plugin的选择

古老的preset
- 年代preset   babel-preset-es2015
- stage preset  babel-preset-stage-3
- babel-preset-latest babel6最后一个preset, 包含所有之前的年代preset


常用的plugin:
- @babel/plugin-transform-runtime 


`@babel/plugin-transform-runtime`插件的作用  
babel做ES语法转换时(如：转换class语法), 会插入很多辅助函数；如果每个代码文件都这样插入同样的辅助函数，就会造成很大的重复和冗余。所以把所有转码需要的辅助函数都放到 `@babel/runtime`这个包里，转码时自动import `@babel/runtime`包里的辅助函数即可。

- `@babel/runtime`提供辅助函数模块  
- `@babel/plugin-transform-runtime` 自动把插入转码辅助函数，改为import辅助函数模块

`@babel/plugin-transform-runtime`三大作用
1. 内联的转码辅助函数，改为import `@babel/runtime`内的辅助函数
2. 代码用到core-js的API, 则自动引入 `@babel/runtime-corejs3/core-js-stable` 替代全局的 `core-js/stable`
3. 代码中用到generator/async时，则自动引入`@babel/runtime/regenerator` 代替全局的 `regenerator-runtime/runtime`

polyfill补齐新API的缺点，会污染全局环境，(如：创建全局Promise, 改写prototype, Array.prototype.flat)，作为第三方的库/包，这是要尽量避免的。(*如：项目的polyfill版本和第三方库的polyfill版本不一致，就会有风险*)

第三方库/包，应该直接import `@babel/runtime/corejs3`的新API的标准实现，而不是污染全局环境，具体配置如下:

```js
{
  "presets": ["@babel/env"],
  "plugins": [
    ["@babel/plugin-transform-runtime", { "corejs": 3 }] // 这样也能支持新API，并且不会污染全局环境
  ]
}
```

`@babel/runtime`和`@babel/runtime-corejs3`的区别
- `@babel/runtime`包含语法转换的辅助函数
- `@babel/runtime-corejs3` 增强版，包含语法转换的辅助函数 + corejs (*提供新API的对应模块*)

> 注意：如果我们使用@babel/plugin-transform-runtime来做polyfill的事情，那么就不要再使用之前讲过的polyfill方式了，无论是单独引入还是@babel/preset-env的方式。因为我们用transform-runtime来做api转换的目的是不污染全局作用域。

`@babel/plugin-transform-runtime`插件配置参数
```js
{ 
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "helpers": true, // 自动import语法转换辅助函数
          "corejs": false, // 替代polyfill, corejs-API转换
          "regenerator": true, // 替代regenerator-runtime/runtime, 避免污染window对象
          "useESModules": false,
          "absoluteRuntime": false,
          "version": "7.0.0-beta.0"
        }
      ]
    ]
  }
```



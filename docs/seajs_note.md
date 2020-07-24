# seajs 详解

`SeaJS` 是一个遵循 commonJS 规范的 javascript 模块加载框架，可以**实现 javascript 的模块化开发和模块化加载**(_kk:模块可按需加载或全部加载_)。

`SeaJS` 可以和 `jQuery` 完美集成，使用`SeaJS` 可提高 javascript 的可读性和清晰度，解决 javascript 编程中繁杂的依赖关系(_kk:大项目中 js 的数量众多和依赖关系复杂比较明显_)

`SeaJS` 的作者是淘宝前端工程师玉伯。

`SeaJS` 本身遵循 `KISS（Keep It Simple, Stupid）`理念进行开发，其本身仅有个位数的 API，因此学习起来毫无压力。在学习`SeaJS` 的过程中，处处能感受到 KISS 原则的精髓——仅做一件事，做好一件事。

本文首先通过一个例子直观对比传统 JavaScript 编程和使用`SeaJS` 的模块化 JavaScript 编程，然后详细讨论`SeaJS` 的使用方法，最后给出一些与`SeaJS` 相关的资料。

假设我们现在正在开发一个 Web 应用 TinyApp，我们决定在 TinyApp 中使用 jQuery 框架。TinyApp 的首页会用到 `module1.js`，`module1.js`依赖`module2.js`和`module3.js`，同时 `module3.js` 依赖 `module4.js`。

## 场景示例

**传统开发**

使用传统的开发方法，各个 js 文件代码如下：

    # module1.js:
    var module1 = {
        run: function(){
            return $.merge(['module1'], module2.run(), module3.run());
        }
    }

    # module2.js:
    var module2 = {
        run : function(){
            return ['module2'];
        }
    }

    # module3.js:
    var module3 = {
        run: function(){
           return $.merge(['module3'], module4.run() );
        }
    }

    # module4.js:
    var module4 = {
        run: function(){
            return ['module4'];
        }
    }

此时 index.html 需要引用 module1.js 及其所有下层依赖（注意顺序）：
  
 <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>my tinyapp</title>
</head>
<body>
<p class="content"></p>
<script type="text/javascript" src="./js/jquery-min.js"></script>
<script type="text/javascript" src="./js/module4.js"></script>
<script type="text/javascript" src="./js/module2.js"></script>
<script type="text/javascript" src="./js/module3.js"></script>
<script type="text/javascript" src="./js/module1.js"></script>
<script>
\$('.content').html(module1.run().join());
</script>
</body>
</html>

随着项目的进行，js 文件会越来越多，依赖关系也会越来越复杂，使得 js 代码和 html 里的 script 列表往往变得难以维护。

**SeaJS 模块化开发**

下面看看如何使用 SeaJS 实现相同的功能。

首先是 index.html：

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>my tinyapp</title>
    </head>
    <body>
        <p class="content"></p>
        <script type="text/javascript" src="./sea.js"></script>
        <script>
            // './init'=='./init.js'后缀可省略;
            // 参数init为 init.js的外部接口 即: exports属性
            seajs.use('./init', function(init) {
                init.initPage();
            });
        </script>
    </body>
    </html>

可以看到 html 页面不再需要引入所有依赖的 js 文件，而只是引入一个*sea.js*，*sea.js*会处理所有依赖，加载相应的 js 文件，加载策略可以选择在渲染页面时一次性加载所有 js 文件，也可以按需加载（_用到时才加载所需的 js_），具体加载策略使用方法下文讨论。

index.html 加载了 init 模块，并使用此模块的 initPage 方法初始化页面数据，这里先不讨论代码细节。

下面看一下模块化后 JavaScript 的写法：

    //init.js:
    define(function (require, exports, module) {
        var $ = require('jquery'); // jquery.js 省略后缀?
        var m1 = require('m1.js');

        //jquery1.6 $.merge只支持2个参数的情况，这里扩展一下
        __merge = $.merge;
        $.merge = function (first, second) {
            // param: array or fake array
            var argArr = Array.prototype.slice.call(arguments);
            return myreduce(argArr, __merge);
        };

        // $.merge(['dd'],['ee'],['ff'],['gg']);
        function myreduce(arr, fn) {
            var start = 0;
            if (arguments.length === 2) {
                result = arr[0];
                start = 1;
            } else {
                result = arguments[2];
            }

            arr.forEach(function (item, i) {
                if (i >= start) {
                    result = fn(result, arr[i]);
                }
            });

            return result;
        }

        exports.initPage = function () {
            $('.content').html(m1.run().join());
        }
    });

    //m1.js:
    define(function (require, exports, module) {
        var $ = require('jquery');
        var m2 = require('m2');
        var m3 = require('m3');

        exports.run = function () {
            return $.merge(['module1'], m2.run(), m3.run());
        };

    });


    //m2.js:
    define(function (require, exports, module) {
        exports.run = function () {
            return ['module2'];
        }
    });

    //m3.js:
    define(function (require, exports, module) {
        var $ = require('jquery');
        var m4 = require('m4');

        exports.run = function () {
            return $.merge(['module3'], m4.run());
        };
    });

    //m4.js:
    define(function (require, exports, module) {
        exports.run = function () {
            return ['module4'];
        };
    });

乍看之下代码似乎变多变复杂了，这是因为这个例子太简单，如果是大型项目，SeaJS 代码的优势就会显现出来。不过从这里我们还是能窥探到一些 SeaJS 的特性：

- html 页面不用再维护冗长的 script 标签列表，只要引入一个 sea.js 即可。
- js 代码以模块进行组织，各个模块通过 require 引入自己依赖的模块，代码清晰明了。

通过这个例子朋友们应该对 SeaJS 有了一个直观的印象，下面本文具体讨论 SeaJS 的使用。

## SeaJS 使用教程

### 下载及安装

    npm i seajs --save
    # 页面中引入
    <script src="sea.js"></script>

### SeaJS 基本开发原则

在讨论 SeaJS 的具体使用前，先介绍一下 SeaJS 的模块化理念和开发原则。

使用 SeaJS 开发 JavaScript 的基本原则就是：**一切皆为模块**。引入 SeaJS 后，编写 JavaScript 代码就变成了编写一个又一个模块。

> SeaJS 中模块的概念有点类似于面向对象中的类 , 模块可以拥有数据和方法，数据和方法可以定义为公共或私有，公共数据和方法可以供别的模块调用。

**另外，每个模块应该都定义在一个单独 js 文件中，即一个 js 文件对应一个模块。**

### 模块定义: define

define 可以接收三个参数：

    /**
    * Defines a module.
    * @param {string=} id The module id.
    * @param {Array.|string=} deps The module dependencies.
    * @param {function()|Object} factory The module factory function.
    */
    fn.define = function(id, deps, factory) {
        //code of function…
    }

上面是我从 SeaJS 源码中摘录出来的，define 可以接收的参数分别是**模块 ID**，**依赖模块数组**及**工厂函数**。

define 函数对于不同参数个数的解析规则如下：

- 如果只有一个参数，则赋值给 factory。
- 如果有两个参数，第二个赋值给 factory；第一个如果是 array 则赋值给 deps，否则赋值给 id。
- 如果有三个参数，则分别赋值给 id，deps 和 factory。

> 最后一个参数始终当做 工厂函数，倒数第 2 个参数根据是否数组，确定是 id 还是 deps

但是，包括 SeaJS 的官方示例在内几乎所有用到 define 的地方都只传递一个工厂函数进去，类似与如下代码：

    // 使用最多的模块定义方式 只传工厂函数
    define(function(require, exports, module) {
        //code
    });

个人建议遵循 SeaJS 官方示例的标准，用一个参数的 define 定义模块。那么 id 和 deps 会怎么处理呢？

id 是一个模块的标识字符串，define 只有 factory 参数时，id 会被默认赋值为此 js 文件的绝对路径。

> 如 example.com 下的 a.js 文件中使用 define 定义模块，则这个模块的 ID 会赋值为 “http://example.com/a.js”，没有特别的必要建议不要传入id。

deps 一般也不需要传入，需要用到的模块用 require 加载即可。

### 工厂函数 factory 解析

工厂函数是模块的主体和重点。在只传递 factory 给 define 时（_推荐写法_），factory 的三个参数分别是：

- `require` 模块加载函数，用于记载依赖模块。
- `exports` 接口点，将数据或方法定义在其上则将其暴露给外部调用。
- `module` 模块的元数据。

这三个参数可以根据需要选择是否需要显式指定。

下面说一下 module。module 是一个对象，存储了模块的元信息，具体如下：

- module.id 模块的 ID。
- module.dependencies 一个数组，存储了此模块依赖的所有模块的 ID 列表。
- module.exports 与 exports 指向同一个对象。

### 三种编写模块的模式

基于 exports 的模式：

    define(function (require, exports, module) {
        var a = require('a'); //引入a模块
        var b = require('b'); //引入b模块

        var data1 = 1; //私有数据

        var fn1 = function () { //私有方法
            return a.run(data1);
        }

        exports.data2 = 2; //公共数据

        exports.fn2 = function () { //公共方法
            return 'hello';
        }
    });

将公共数据和方法附加在 exports 上，也可以直接返回一个对象表示模块，如下：

    //工厂函数返回的对象会赋值给 module.exports
    define(function (require) {
        var a = require('a'); //引入a模块
        var b = require('b'); //引入b模块

        var data1 = 1; //私有数据

        var fn1 = function () { //私有方法
            return a.run(data1);
        }

        return {
            data2: 2,
            fn2: function () {
                return 'hello';
            }
        };
    });

如果模块定义没有其它代码，只返回一个对象，还可以有如下简化写法：(_合适返回 JSON 数据的模块_)

    // 直接传入1个json，则json会被赋值给 module.exports
    define({
        data: 1,
        fn: function () {
            return 'hello';
        }
    });

### 模块的载入和引用

**模块的寻址算法**

上文说过一个模块对应一个 js 文件，而载入模块时一般都是提供一个字符串参数告诉载入函数需要的模块，所以就需要有一套从字符串标识到实际模块所在文件路径的解析算法。`SeaJS`支持如下标识：

- 绝对地址
  给出 js 文件的绝对路径。 如: `require("http://example/js/a")` _kk:js 后缀可省略_

- 相对地址
  如：`require("./foo")` 则相对于当前 js 文件寻找模块 foo。

- 基址地址
  如果模块标识既不是绝对路径也不是以”./”开头，则相对 SeaJS 全局配置中的“base”来寻址，这种方法稍后讨论。

注意上面在载入模块时都不用传递后缀名`.js`，SeaJS 会自动添加`.js`。但是下面三种情况下不会添加：

- 载入`css`时，如: `require("./module1-style.css")`;
- 路径中含有`?`时，如: `require("http://example/js/a.json?cb=func")`;
- 路径以`#结尾`时，如: `require("http://example/js/a.json#")`;

根据应用场景的不同，SeaJS 提供了三个载入模块的 API，分别是`seajs.use()`，`require()`和`require.async()`，下面分别介绍:

**seajs.use()**

**seajs.use 主要用于载入入口模块。**
入口模块相当于 C 程序的 main 函数，同时也是整个模块依赖树的根。上面在 TinyApp 小例子中，init 就是入口模块。seajs.use 用法如下：

    // 单一模式
    seajs.use('./a');

    // 回调模式
    seajs.use('./a', function (a) {
        a.run();
    });

    // 多模块模式
    seajs.use(['./a', './b'], function (a, b) {
        a.run();
        b.run();
    });

一般`seajs.use`只用在页面载入入口模块，SeaJS 会顺着入口模块解析所有依赖模块并将它们加载。

如果入口模块只有一个，也可以通过给引入 sea.js 的 script 标签加入`data-main`属性来省略`seajs.use`，例如，上面 TinyApp 的 index.html 也可以改为如下写法：

    //data-main 指定入口模块 kk:貌似低版本的seajs不行
    <scriptsrc="./sea.js" data-main="./init" ></script>

**require()**

**require 是 SeaJS 主要的模块加载方法**，当在一个模块中需要用到其它模块时一般用 require 加载：
  
 // backbone
var \$ = require('jquery');

> 这里简要介绍一下 SeaJS 的自动加载机制。上文说过，使用 SeaJS 后 html 只要包含 sea.js 即可，那么其它 js 文件是如何加载进来的呢？
> SeaJS 会首先下载入口模块，然后顺着入口模块使用正则表达式匹配代码中所有的 require，再根据 require 中的文件路径标识下载相应的 js 文件，对下载来的 js 文件再迭代进行类似操作。
> 整个过程类似图的遍历操作（因为可能存在交叉循环依赖所以整个依赖数据结构是一个图而不是树）。

明白了上面这一点，下面的规则就很好理解了：

**传给 require 的路径标识必须是字符串字面量**，不能是表达式，如下面使用 require 的方法是错误的：

    //require的参数：路径标识必须是字符串字面量
    require('module'+'1'); // error,
    require('Module'.toLowerCase()); //error

**require.async()**

上文说过 SeaJS 会在 html 页面打开时通过静态分析一次性记载所有需要的 js 文件，如果想要某个 js 文件在用到时才下载，可以使用 require.async：

    require.async('/path/to/module/file',function(m) {
        //code
    });

这样只有在用到这个模块时，对应的 js 文件才会被下载，也就实现了 JavaScript 代码的按需加载。

    // init.js:
    define(function (require, exports, module) {
        var $ = require('jquery');
        var foo = require.async('foo', function (foo) {
            console.log('in callback');
        });
    });

### SeaJS 的全局配置

`seajs.config()`可以设置全局配置：

    seajs.config({
        base: 'path/to/jslib/',// 基地址
        alias: {// 别名
            'app': 'path/to/app/'
        },
        charset: 'utf-8',
        timeout: 20000,
        debug: false
    });

- `base` 基址路径。

        seajs.config({base: "http://example.com/js/3-party/"});

        // 会载入http://example.com/js/3-party/jquery.js
        var $ = require('jquery');

- `alias`
  对较长的常用路径设置别名。

- `charset`
  表示下载 js 时 script 标签的 charset 属性。

- `timeout`
  表示下载文件的最大时长，以毫秒为单位。

- `debug`
  表示是否工作在调试模式下。

### SeaJS 与现有 JS 库配合使用

要将现有 JS 库如 jQuery 与 SeaJS 一起使用，只需根据 SeaJS 的的模块定义规则对现有库进行一个封装。例如：
  
 // 把第三方库包装为模块
define(function () {

        // jQuery源码

        return $.noConflict();
    });

### SeaJS 项目的打包部署

SeaJS 本来集成了一个打包部署工具`spm`，后来作者为了更 KISS 一点，将`spm`拆出了 SeaJS 而成为了一个单独的项目。 `spm`的核心思想是将所有模块的代码都合并压缩后并入入口模块，由于 SeaJS 本身的特性，html 不需要做任何改动就可以很方便的在开发环境和生产环境 间切换。

其实，由于每个项目所用的 JS 合并和压缩工具不尽相同，所以 spm 可能并不是完全适合每个项目。在了解了 SeaJS 原理后，完全可以自己写一个符合自己项目特征的合并打包脚本。

> 如果一个模块为多个页面共用，这种情况 seajs 内部会怎么处理? 重复打包?

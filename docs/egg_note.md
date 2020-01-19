egg docs 
========

简介
---
Egg 提供web开发的核心功能和插件机制，并非大而全的框架。

Egg的插件机制具有高灵活性，**一个插件只做一件事件*** ， 如 `egg-view-nunjucks`, `egg-mysql`, Egg通过框架聚合各种插件，使得应用的开发成本变低。

Egg提倡约定优于配置（*优点在于 减少学习和沟通成本*），类似CI，Egg是在koa基础上的增强和扩展。约定不等于扩展性差，使用 **loader** 可为不同环境定义默认配置，还可以覆盖Egg的默认约定

与其他框架的对比
---
- Express 
    Express简单且扩展性强，在社区使用广泛，非常适合个人项目；但缺少约定，MVC模型会有各种奇怪的写法

- Sails 
    同样遵循 **约定优于配置** 的框架， 大集市模式，框架本身包含了其他功能


特性
---
- 提供基于Egg定制上层框架的能力
- 可扩展的插件机制
- 内置多进程管理
- 基于koa,性能优异
- 渐进式开发

Egg与Koa
---
Node.js是一个异步的世界，官方api都是callback形式的异步编程模型。callback的主要问题在于，回调嵌套，错误捕获和非线性执行，代码逻辑不直观；所以最终胜出的异步方案是Promise, 结合Generator提供的切换上下文的能力，实现async/await语法糖（*nodejs8*原生支持），就是最优的异步方案。

**async/await**
同步书写，异步执行，堪称完美

```js
    const fn = async function() {
        const user = await getUser();
        const posts = await fetchPosts(user.id)
        return {user, posts}
    }
    fn().then(res => console.log(res)).catch(err => console.error);
```

### Koa
Koa和Express的设计风格非常类似，底层也共用一套HTTP基础库

> Koa由Express的原班人马打造

**Middleware**
Koa的中间件和Express不同，Koa是洋葱圈模型(*层层深入，层层退出*)；Express是管道式模型(*一个接一个*)

！[中间件执行顺序图](https://raw.githubusercontent.com/koajs/koa/a7b6ed0529a58112bac4171e4729b8760a34ab8b/docs/middleware.gif)

**Context**
Express只有request和response两个对象，Koa增加Context对象,作为这次请求的上下文对象(*koa1是中间件的this, koa2作为中间件第一个参数*)

Context对象上也挂载了`request`和`response`对象,它们提供了很多便捷的方法和属性:

- get request.query
- get request.hostname
- set response.body
- set response.status

**异常处理**
`try/catch`就能够捕获`async/await`抛出的异常,所以在最外层设置一个异常处理的中间件，就能捕获的其他地方抛出的异常

```js
    async function onerror(ctx, next) {
        try {
            await next();
        } catch(err) {
            ctx.app.emit('error', err);
            ctx.body = 'server error';
            ctx.status = errr.status || 500
        }
    }
```

Egg继承Koa
---
Egg对Koa进行了扩展和增强

### 扩展
通过定义对应的js(`app/extend/[application | context | request | response].js`)来扩展对应对象的原型

例如： 增加js文件 `app/extend/context.js`

```js
    // app/extend/context.js
    module.exports = {
        get isIOS() {
            const iosReg = /iphone|ipad|ipod/i;
            return iosReg.test(this.get('user-agent'));
        }
    }

    // 使用扩展的属性
    // app/controller/home.js
    exports.handler = ctx => {
        ctx.body = ctx.isIOS ? 'is ios' : 'not ios';
    }
```

插件
---
Express 和 Koa 中，通常会引入许多的中间件来提供各种功能，如 `koa-session` 提供session支持, `koa-bodyparser`解析请求的body

Egg 提供了更强大的插件机制，让独立的功能模块更容易编写

一个插件可以包括:
- extend  扩展基础对象(`application, context, request, response`)，提供各种工具类和属性
- middleware  增加一个或多个中间件 提供前处理或后处理逻辑
- config  各个环境下插件的配置信息

Egg 和 Koa的版本关系
---

### Egg 1.x

Egg 1.x基于 Koa 1.x开发，Egg后来全面支持 `async/await` , 对Koa2.x的中间件也完全兼容, 所以应用层代码可完全用 `async/await` 来开发。

- 底层基于 Koa1.x, 异步方案基于co封装的 generator function
- 官方插件和Egg核心用generator function编写，必要时通过co包装兼容 async function
- 应用开发者可选择用 async function (*node.js 8.x*)  或 generator function(*node.js 6.x*)编写

### Egg.2.x

- 底层基于 Koa2.x 异步方案基于 async function
- 官方插件和Egg核心用 async function 编写
- 只支持 node.js 8 及以上版本

Egg 快速入门
---

### 快速初始化
使用脚手架`egg-init`

```shell
    npm i egg-init -g
    egg-init egg-example --type=simple
    cd egg-example
    npm i
    # boot
    npm run dev
    # test 不要启动时进行单元测试
    npm test
```

### 静态资源
Egg 内置 `static` 插件，默认映射 `/public/* --> app/public/*` 目录 

### 模板渲染
1. 安装对应的模板引擎插件，如： `npm i egg-view-nunjucks --save`
2. 开启插件
    ```js
        // config/plugin.js 
        exports.nunjucks = {
            enable: true,
            package: 'egg-view-nunjucks'
        };

        // config/config.default.js
        exports.keys = {your cookie sign}
        exports.view = {
            defaultViewEngine: 'nunjucks',
            mapping: {
                '.tpl': 'nunjucks'
            }
        }
    ```
>  **注意是 config目录，不是 app/config目录**

3. 编写模板文件，放到 `app/view`
    ```html
        <!-- app/view/news/list.tpl -->
        <html>
            <head>
                <title>Hacker News</title>
                <link rel="stylesheet" href="/public/css/news.css" />
            </head>
            <body>
                <ul class="news-view view">
                    {% for item in list %}
                        <li class="item">
                            <a href="{{item.url}}">{{item.title}}</a> 
                        </li>
                    {% endfor %}
                </ul>
            </body>
        </html>
    ```
4. 添加路由
    ```js
        // app/router.js
        module.exports = app => {
          const { router, controller } = app;
          router.get('/', controller.home.index);
          router.get('/news', controller.news.list);
        };
    ```

5. 添加controller    
    ```js
        //  app/controller/news.js
        const Controller = require('egg').Controller;

        class NewsController extends Controller {
            async list() {
                const dataList = {
                    list: [
                        { id: 1, title: 'this is news 1', url: '/news/1' },
                        { id: 2, title: 'this is news 2', url: '/news/2' },
                    ]
                }；

                await this.ctx.render('news/list.tpl', dataList);
            }
        }

        module.exports = NewsController
    ```
6. 访问 http://localhost:7001/news 预览

**提示，开发期间默认开启 `development` 插件，修改代码后，会自动重启worker**

7. 编写 service 
    实际上 controller 一般不产生数据，业务逻辑通常在 service 中处理

    ```js
        const Service = require('egg').Service

        class NewsService extends Service {
            async list(page = 1) {
                // read config
                const {serverUrl, pageSize} = this.config.news;
                // use build-in http client to GET hacker-news api
                const {data: idList} = await this.ctx.curl(`${serverUrl}/topstories.json`, {
                    data: {
                        orderBy: '"$key"',
                        startAt: `"${pageSize * (page - 1)}"`,
                        endAt: `"${pageSize * page -1}"`
                    },
                    dataType: 'json'
                });

                // parallel GET detail
                const newsList = await Promise.all(Object.keys(idList).map(key => {
                    const url = `${serverUrl}/item/${idList[key]}.json`;
                    return this.ctx.curl(url, {dataType: 'json'})
                }));

                return newsList.map(res => res.data);
            }
        }

        module.exports = NewsService;
    ```

8. 添加配置

    ```js
        // config/config.default.js
        config.news = {
          pageSize: 5,
          serverUrl: 'https://hacker-news.firebaseio.com/v0' // 貌似访问不了
        }
    ```
9. controller中调用service

    ```js
        const {ctx} = this;
        const page = ctx.query.page || 1;
        const newsList = await ctx.service.news.list(page);
        await ctx.render('news/list.tpl', {list: newsList});
    ```

10. 编写扩展
    ```js
        // app/extend/helper.js
        exports.padZero = function(n) {
            return n>9 ? n.toString() : '0' +n
        }

        // view/news/list.tpl
        <div>{{helper.padZero(item.id)}}<\/div>
    ```
11. 编写middleware  
假设编写一个禁止爬虫的middleware
    ```js
        // app/middleware/robot.js
        // options === app.config.robot
        module.exports = (options, app) => {
            return async function robotMiddleware(ctx, next) {
                const source = ctx.get('user-agent') || ''
                const math = options.ua.some(ua => ua.test(source))
                if(match) {
                    ctx.status = 404;
                    ctx.message = 'Go away, robot'
                }else {
                    await next();
                }
            }
        }
        // config/config.default.js add middleware robot
        exports.middleware = ['robot']

        // robot config
        exports.robot = {
            ua: [/baiduspider/i]
        }
    ```
`curl http://localhost:7001/news -A "baiduspider"`  预览结果

12. 配置文件
写业务时候，不可避免的需要配置文件，框架提供了强大的配置合并功能

- 支持根据环境变量加载对应配置，如 `config.local.js`, `config.prod.js`
- 应用、插件、框架都可以有自己的配置，将按顺序合并

### 单元测试
单元测试很重要，框架提供了`egg-bin` 帮助开发者编写测试  
测试文件应放到test目录下，以`*.test.js`形式命名

    ```js
        // test/app/middleware/robot.test.js
        const {app, mock, assert}  = require('egg-mock/bootstrap');
        describe('test/app/middleware/robot.test.js', function() {
            it('should block robot', function() {
                return app.httpRequest().get('/').set('User-Agent', 'baiduspider').expect(404)
                })
            })
    ```

`npm i egg-mock`,  然后配置 `npm scripts`

    ```js
        {
            scripts: {
                test: 'egg-bin test'
            }
        }
    ```

基础功能
---

### 目录结构

```
    egg-project
    ├── package.json
    ├── app.js (可选)
    ├── agent.js (可选)
    ├── app
    |   ├── router.js
    │   ├── controller
    │   |   └── home.js
    │   ├── service (可选)
    │   |   └── user.js
    │   ├── middleware (可选)
    │   |   └── response_time.js
    │   ├── schedule (可选)
    │   |   └── my_task.js
    │   ├── public (可选)
    │   |   └── reset.css
    │   ├── view (可选)
    │   |   └── home.tpl
    │   └── extend (可选)
    │       ├── helper.js (可选)
    │       ├── request.js (可选)
    │       ├── response.js (可选)
    │       ├── context.js (可选)
    │       ├── application.js (可选)
    │       └── agent.js (可选)
    ├── config
    |   ├── plugin.js
    |   ├── config.default.js
    │   ├── config.prod.js
    |   ├── config.test.js (可选)
    |   ├── config.local.js (可选)
    |   └── config.unittest.js (可选)
    └── test
        ├── middleware
        |   └── response_time.test.js
        └── controller
            └── home.test.js
```

### 框架内置基础对象
- 从Koa继承的 `Context`, `Application`, `Request`, `Response`
- 框架扩展的对象 `Controller`, `Service`, `Helper`, `Config`, `Logger`

### Application
全局对象，在一个应用中，只会实例化一个， 继承自 Koa.Application, 可以挂载一些全局的方法和对象

#### Application的事件
- server  http服务启动完后触发，一个worker进程只会触发一次
- error  运行时异常被onerror插件捕获后触发, 可以自定义日志上报
- request 和 response  应用接受请求和响应请求时触发，

```js
    // app.js
    module.exports = function(app) {
        app.once('server', server => {
            // websocket
        });

        app.on('error', (err, ctx) => {
            // report error
        });

        app.on('request', ctx => {
            // log recieve request
        });
        app.on('response', ctx => {
            // ctx.starttime is set by framework
            const used = Date.now() - ctx.starttime;
            // log total cost
        })
    }
```

几乎可以在应用的任何地方访问到Application对象

```js
    // app.js
    module.exports = app => {
        app.cache = new Cache();
    }

    // app/controller/user.js
    class UserController extend Controller {
        async fetch() {
            this.ctx.body = this.ctx.app.cache(this.ctx.query.id); // ctx.app
            // or
            this.ctx.body = this.app.cache(this.ctx.query.id); // this.app
        }
    }
```

Context
---
请求级别的对象，继承自Koa.Context; 每收到一个请求，框架会实例化一个context对象， ctx对象封装了该次用户请求的信息，提供了便捷方法获取请求信息或设置响应如： `ctx.query`, `ctx.status`, `ctx.body`, `ctx.service`

```js
    // koa1.x middleware
    function* middleware(next) {
        // this is instance of Context
        console.log(this.query);
        yield next
    }

    // koa2.x middleware
    async function middleware(ctx, next) {
        console.log(ctx.query);
        await next();
    }
    // app/schedule/refresh.js
    exports.task = async ctx => {
        await ctx.service.posts.refresh()
    }
    // controller or service
    class PostsService extends Service {
        async refresh() {
            // this.ctx
        }
    }
```

Request and Response
---
同样是请求级别的对象，分别继承自Koa.Request, Koa.Response, 封装了原生的http.request对象和http.response对象，提供一些更便捷的方法

```js
// ctx.request  and ctx.response
// app/controller/user.js
class UserController extends Controller {
    async fetch() {
        const {app, ctx} = this;
        const id = ctx.request.query.id
        ctx.response.body = app.cache.get(id);
    }
}
// koa会在context上代理一部分request和response对象上的方法和属性
ctx.query === ctx.request.query
ctx.request.body // 获取请求体
ctx.body === ctx.response.body // 设置响应体
ctx.status === ctx.response.status
```

Controller
---
Controller基类拥有如下属性
- ctx
- app
- config
- service  应用所有的service
- logger  为当前controller封装的logger对象

Controller基类的获取方式

```js
    // app/controller/user.js
    // egg上获取 require('egg').Controller
    const Controller = require('egg').Controller;
    class UserController extends Controller {
        //todo
    }
    // 返回控制器类
    module.exports = UserController 


    // app上获取 app.Controller
    // 返回会返回控制器类的函数
    module.exports = app => {
        return class UserController extends app.Controller {
            // todo
        }
    }
```

Service
---
Service基类拥有的属性和访问方式，参考Controller基类

Helper
---
Helper提供实用工具函数，Helper自身也是一个类，拥有和Controller基类同样的属性，所以helper中也能访问请求上下文对象和全局应用对象

helper的获取方式

```js
// app/controller/user.js
class UserController extends Controller {
    async fetch() {
        const {app, ctx} = this;
        const id = ctx.query.id
        const user = app.cache.get(id);
        ctx.body = ctx.helper.formatUser(user); // ctx.helper
    }
}
// 模板中 可直接使用helper
<div>{{helper.formatUser(user)}}<\/div>
```

Config
---
开发中，应当坚持配置和代码分离的原则，所有框架、插件和应用级别的配置都可以通过config对象获取到

获取方式   
通过`app.config`获取应用配置，也可在`Controller`, `Service`, `Helper`上通过 `this.config`获取到config对象

    ```js
        this.app
        this.ctx
        this.config // this is controller service
        app.config
        ctx.helper.config
    ```
    
Logger
---
框架提供了强大的日志功能，方便地打印各种级别的日志到对应的日志文件中。   
logger对象的方法:
- logger.debug()
- logger.info()
- logger.warn()
- logger.error();

框架提供了多个logger对象:
- App Logger   
    通过`app.logger`访问，用于记录一些应用级别的日志，如：启动信息
- App CoreLogger
    通过`app.coreLogger`访问，用于插件或框架打印日志，应用开发不应该使用它
- Context Logger
    通过`ctx.logger`访问，打印请求相关的日志，日志会自动加上请求api作为前缀，方便串联查看
- Context CoreLogger
    通过`ctx.coreLogger`访问，也是仅用于插件和框架
- Controller Logger and Servie Logger
    在controller和service中，通过`this.logger`访问，本质上是Context Logger, 但是会加上文件路径信息，方便定位日志的输出位置


Subscription
---
订阅模型是常见的开发模式, 框架提供 Subscription基类

```js
const Subscription = require('egg').Subscription

class Schedule extends Subscription {
    // 需要实现这个方法
    async subscribe() {
        // todo
    }
}
```
定时任务就是基于Subscription实现的


egg docs 
========
[eggjs文档](https://eggjs.org/zh-cn/intro/)  

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

![中间件执行顺序图](https://raw.githubusercontent.com/koajs/koa/a7b6ed0529a58112bac4171e4729b8760a34ab8b/docs/middleware.gif)

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
            },
            root: ['/data/act-static', path.join(__dirname, 'app/view')].join(',') // 查找模板文件的目录列表 逗号分隔
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

> 提示，开发期间默认开启 `development` 插件[详见](https://eggjs.org/en/core/development.html#mobileAside)，修改代码后，会自动重启worker  
需要 `config.env = local` development插件才会生效, `cross-env EGG_SERVER_ENV=local egg-bin dev` 这样也可以

7. 编写 service 
    实际上 controller 一般不产生数据，业务逻辑通常在 service 中处理

    ```js
        const Service = require('egg').Service

        class NewsService extends Service {
            async list(page = 1) {
                // read config
                const {serverUrl, pageSize} = this.config.news;
                // use build-in http client to GET hacker-news api
                // curl get or post 都通过 data 传数据（get data === query)
                // result = await ctx.curl(url, options) // options => {method, data, datType: 'json'}
                /* result => {
                    status: 200, 
                    data: {},  
                    headers: {'server', 'content-type', 'content-length', 'date', 'etag'}, 
                    res: {// 这里包含更多的信息
                        statusCode: 200, 
                        statusMessage: 'OK', 
                        headers: {'server', 'content-type', 'content-length', 'date', 'etag'}, 
                        data: {}
                    }
                } */
                const {data: idList} = await this.ctx.curl(`${serverUrl}/topstories.json`, {
                    data: {
                        orderBy: '"$key"',
                        startAt: `"${pageSize * (page - 1)}"`,
                        endAt: `"${pageSize * page -1}"`
                    },
                    dataType: 'json' // 注意 一般需要指定期待返回的数据类型 不然会是 buffer 类型
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

10. 编写扩展 _(扩展对象包括: application, context, request, response, helper)_ **注意: 不扩展controller service, 需自行实现**
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

- 支持根据环境变量(EGG_SERVER_ENV)加载对应配置，如 `config.local.js`, `config.prod.js`  
    ```js
    config.env === 'local' //默认
    // 执行 npm script: cross-env EGG_SERVER_ENV=pro egg-bin dev
    // 则会加载 config.pro.js  config.env === 'pro'

    ```
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
- ctx (ctx.helper)
- app (app.config Controller Service)
- config  (同 app.config)
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
Helper提供实用工具函数，Helper自身也是一个类，拥有和Controller基类同样的属性，所以helper中也能访问 ctx 和 app

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
        // 访问配置的方式
        app.config
        this.config // controller service helper 中访问config

        // config.default.js默认配置 各个运行环境都会加载
        // config.dev.js 开发环境配置 (执行npm script时 需要指定环境  cross-env EGG_SERVER_ENV=dev  egg-bin dev)

        // 修改默认端口  config.default.js
        config.cluster = {
            listen: {
                path: '',
                port: 8000,
                hostname: '0.0.0.0',
            }
        };

        // 指定调用中间件 
        config.middleware = ['robot', 'access']
        // 配置中间件选项
        config.robot = {blackList: [/baiduspider/i]}

        // 配置logger
        config.logger = {
            "dir": path.join(__dirname, '../logs'),  // 日志文件目录
            "encoding": "utf8",
            "env": "dev",
            "level": "INFO", // 日志级别  logger.debug(msg) debug日志不会记录
            "consoleLevel": "INFO",
            "disableConsoleAfterReady": true, // false 允许console.log输出到 stdout
            "outputJSON": false,
            "buffer": true,
            "appLogName": "topic-api-web.log",
            "coreLogName": "egg-web.log",
            "agentLogName": "egg-agent.log",
            "errorLogName": "common-error.log",
            "coreLogger": {},
            "allowDebugAtProd": false,
            "type": "application"
        }

        // 自定义logger
        config.customLogger = {
            access: {file: path.join(__dirname, '../logs/access.log')}
        }

        // 配置session egg内置session插件
        config.session = {
            key: 'EGG_SESS',
            maxAge: 24 * 3600 * 1000, // 1 天
            httpOnly: true,
            encrypt: true,
            renew: true, // 延迟session的有效期
        };
        
    ```

session
---
egg内置session插件

```js
let count = ctx.session.count // 读取
ctx.session.count = count + 1 // 设置
ctx.session.count = null // 删除

```

Logger
---
框架提供了强大的日志功能，方便地打印各种级别的日志到对应的日志文件中。   

logger 默认不是输出到项目下logs文件夹的，需要配置一下
```js
    // config/config.default.js

    exports.logger = {
            consoleLevel: 'INFO',
            dir: path.join(__dirname, '../logs')
        }

    /* 
    {
        "dir": "C:\\Users\\username\\logs\\topic-api",
        "encoding": "utf8",
        "env": "dev",
        "level": "INFO",
        "consoleLevel": "INFO",
        "disableConsoleAfterReady": true, // disableConsoleAfterReady: false 允许输出到 stdout
        "outputJSON": false,
        "buffer": true,
        "appLogName": "topic-api-web.log",
        "coreLogName": "egg-web.log",
        "agentLogName": "egg-agent.log",
        "errorLogName": "common-error.log",
        "coreLogger": {},
        "allowDebugAtProd": false,
        "type": "application"
    }

     */

    // 自定义logger
    config.customLogger = {
        access: {file: path.join(__dirname, '../logs/access.log')}
    }

    // 调用自定义logger
    this.app.getLogger('access').info('some msg')

```

logger对象的方法:
- logger.debug()
- logger.info()
- logger.warn()
- logger.error();

```js
    logger.info('query data: %j', data); // 打印对象
    logger.error(new Error('some error')); // 打印错误
    logger.error('this is error: %j', new Error('some error')); // 不能这样打印错误
    logger.info('num: %d, str: %s, data: %j', 10, 'hello', {go: 'good'})

```

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


框架内置基础对象
---
在本章，我们会初步介绍一下框架中内置的一些基础对象，包括从 Koa 继承而来的 4 个对象（Application, Context, Request, Response) 以及框架扩展的一些对象（Controller, Service, Helper, Config, Logger），在后续的文档阅读中我们会经常遇到它们。

### Application
Application 是全局应用对象，在一个应用中，只会实例化一个，它继承自 Koa.Application，在它上面我们可以挂载一些全局的方法和对象。我们可以轻松的在插件或者应用中扩展 Application 对象。

#### 事件
在框架运行时，会在 Application 实例上触发一些事件，可以监听这些事件做一些操作。

- server: 该事件一个 worker 进程只会触发一次，在 HTTP 服务完成启动后，会将 HTTP server 通过这个事件暴露出来给开发者。
- error: 运行时有任何的异常被 onerror 插件捕获后，都会触发 error 事件，将错误对象和关联的上下文（如果有）暴露给开发者，可以进行自定义的日志记录上报等处理。
- request 和 response: 应用收到请求和响应请求时，分别会触发 request 和 response 事件，并将当前请求上下文暴露出来，开发者可以监听这两个事件来进行日志记录。

```js
// app.js

module.exports = app => {
  app.once('server', server => {
    // websocket
  });
  app.on('error', (err, ctx) => {
    // report error
  });
  app.on('request', ctx => {
    // log receive request
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    const used = Date.now() - ctx.starttime;
    // log total cost
  });
};
```
#### 获取方式
Application 对象几乎可以在编写应用时的任何一个地方获取到，下面介绍几个经常用到的获取方式：

几乎所有被框架 Loader 加载的文件（Controller，Service，Schedule 等），都可以 export 一个函数，这个函数会被 Loader 调用，并使用 app 作为参数：

自定义启动脚本

```js
// app.js
module.exports = app => {
  app.cache = new Cache();
};
```

Controller 文件

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    // 在继承于 Controller, Service 基类的实例中，可以通过 this.app 访问到 Application 对象。
    this.ctx.body = this.app.cache.get(this.ctx.query.id);
    // 和 Koa 一样，在 Context 对象上，可以通过 ctx.app 访问到 Application 对象    
    this.ctx.body = this.ctx.app.cache.get(this.ctx.query.id);
  }
}
```


### Context
Context 是**一个请求级别的对象**，继承自 Koa.Context。在每一次收到用户请求时，框架会实例化一个 Context 对象，这个对象封装了这次用户请求的信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。框架会将所有的 Service 挂载到 Context 实例上，一些插件也会将一些其他的方法和对象挂载到它上面（*egg-sequelize 会将所有的 model 挂载在 Context 上*）。

#### 获取方式
最常见的 Context 实例获取方式是在 Middleware, Controller 以及 Service 中。

```js
// Middleware中获取ctx

// Koa v1
function* middleware(next) {
  // this is instance of Context
  console.log(this.query);
  yield next;
}

// Koa v2
async function middleware(ctx, next) {
  // ctx is instance of Context
  console.log(ctx.query);
}

// service or controller中 获取ctx
class UserService extends Service {
    async fetch() {
        let {ctx} = this
    }
}
```

非用户请求的场景下, 我们需要访问Context 实例上的 service / model 等对象时，可通过 Application.createAnonymousContext() 方法创建一个匿名 Context 实例：

```js
// app.js
module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    // preload before app start
    await ctx.service.posts.load();
  });
}
```

在定时任务中的每一个 task 都接受一个 Context 实例作为参数，以便我们更方便的执行一些定时的业务逻辑：

```js
// app/schedule/refresh.js
exports.task = async ctx => {
  await ctx.service.posts.refresh();
};
```


### Request & Response
`Request` 是**一个请求级别的对象**，继承自 Koa.Request。封装了 Node.js 原生的 HTTP Request 对象，提供了一系列辅助方法**获取 HTTP 请求常用参数**。

`Response` 是**一个请求级别的对象**，继承自 Koa.Response。封装了 Node.js 原生的 HTTP Response 对象，提供了一系列辅助方法**设置 HTTP 响应**。

#### 获取方式
可以在 Context 的实例上获取到当前请求的 Request(ctx.request) 和 Response(ctx.response) 实例。
```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.request.query.id;
    ctx.response.body = app.cache.get(id);
  }
}
```
> Koa 会在 Context 上代理一部分 Request 和 Response 上的方法和属性，参见 Koa.Context。
如上面例子中的 ctx.request.query.id 和 ctx.query.id 是等价的，ctx.response.body= 和 ctx.body= 是等价的。

> **需要注意的是，获取 POST 的 body 应该使用 ctx.request.body，而不是 ctx.body。**


### Controller
框架提供了一个 Controller 基类，并推荐所有的 Controller 都继承于该基类实现。这个 Controller 基类有下列属性：

- ctx - 当前请求的 Context 实例。
- app - 应用的 Application 实例。
- config - 应用的配置。
- service - 应用所有的 service。
- logger - 为当前 controller 封装的 logger 对象。
在 Controller 文件中，可以通过两种方式来引用 Controller 基类：

```js
// app/controller/user.js

// 从 egg 上获取（推荐）
const Controller = require('egg').Controller;
class UserController extends Controller {
  // implement
}
module.exports = UserController;

// 从 app 实例上获取
module.exports = app => {
  return class UserController extends app.Controller {
    // implement
  };
};
```

### Service
框架提供了一个 Service 基类，并推荐所有的 Service 都继承于该基类实现。

Service 基类的属性和 Controller 基类属性一致，访问方式也类似：

```js
// app/service/user.js

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
    let {app, ctx, config, service, logger} = this
    // implement
}
module.exports = UserService;

// 从 app 实例上获取
module.exports = app => {
  return class UserService extends app.Service {
    // implement
  };
};
```


### Helper
Helper 用来提供一些实用的 utility 函数。

Helper 自身是一个类，有和 Controller 基类一样的属性，它也**会在每次请求时进行实例化**，因此 Helper 上的所有函数也能获取到当前请求相关的上下文信息。

### 获取方式
可以在 Context 的实例上获取到当前请求的 Helper(ctx.helper) 实例。

```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.query.id;
    const user = app.cache.get(id);
    ctx.body = ctx.helper.formatUser(user);
  }
}
```

除此之外，Helper 的实例还可以在模板中获取到，例如可以在模板中获取到 security 插件提供的 shtml 方法。
```js
// app/view/home.nj
{{ helper.shtml(value) }}
```

### 自定义 helper 方法
应用开发中，我们可能经常要自定义一些 helper 方法，例如上面例子中的 formatUser，我们可以通过框架扩展的形式来自定义 helper 方法。

```js
// app/extend/helper.js
module.exports = {
  formatUser(user) {
    return only(user, [ 'name', 'phone' ]);
  }
};
```

### Config
我们推荐应用开发遵循**配置和代码分离的原则**，将一些需要硬编码的业务配置都放到配置文件中，同时配置文件支持各个不同的运行环境使用不同的配置，使用起来也非常方便，所有框架、插件和应用级别的配置都可以通过 Config 对象获取到。

### 获取方式
我们可以通过 `app.config` 从 Application 实例上获取到 config 对象，也可以在 `Controller, Service, Helper` 的实例上通过 `this.config` 获取到 config 对象。


### Logger
框架内置了功能强大的日志功能，可以非常方便的打印各种级别的日志到对应的日志文件中，每一个 logger 对象都提供了 4 个级别的方法：

- logger.debug()
- logger.info()
- logger.warn()
- logger.error()

各个 Logger 对象的获取方式和使用场景

- App Logger 
    通过 app.logger 来获取，如果我们想做一些应用级别的日志记录，如记录启动阶段的一些数据信息，记录一些业务上与请求无关的信息，都可以通过 App Logger 来完成。

- App CoreLogger  
    通过 app.coreLogger 来获取，一般我们在开发应用时都不应该通过 CoreLogger 打印日志，而框架和插件则需要通过它来打印应用级别的日志，这样可以更清晰的区分应用和框架打印的日志，通过 CoreLogger 打印的日志会放到和 Logger 不同的文件中。

- Context Logger  
    通过 ctx.logger 获取，从访问方式上我们可以看出来，Context Logger 一定是与请求相关的，它打印的日志都会在前面带上一些当前请求相关的信息（如 `[$userId/$ip/$traceId/${cost}ms $method $url]`），通过这些信息，我们可以从日志快速定位请求，并串联一次请求中的所有的日志。

- Context CoreLogger  
    通过 ctx.coreLogger 获取到它，和 Context Logger 的区别是一般只有插件和框架会通过它来记录日志。

- Controller Logger & Service Logger  
    可以在 Controller 和 Service 实例上通过 this.logger 获取到它们，它们本质上就是一个 Context Logger，不过在打印日志的时候还会额外的加上文件路径，方便定位日志的打印位置。

### Subscription
订阅模型是一种比较常见的开发模式，譬如消息中间件的消费者或调度任务。因此我们提供了 Subscription 基类来规范化这个模式。

可以通过以下方式来引用 Subscription 基类：

```js
const Subscription = require('egg').Subscription;

class Schedule extends Subscription {
  // 需要实现此方法
  // subscribe 可以为 async function 或 generator function
  async subscribe() {}
}
```

插件开发者可以根据自己的需求基于它定制订阅规范，如定时任务就是使用这种规范实现的。
koad notes
=====
简介
---
koa 是由 Express 原班人马打造的。 使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库。

安装
---

    nvm install 8
    npm i koa

实例
---
Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的

    var Koa = require('koa');
    var app = new Koa();
    // x-response-time
    app.use(async (ctx, next) => {
        var start = Date.now();
        await next(); // 1
        var ms = Date.now() - start; // 5
        ctx.set('X-Response-Time', `${ms}ms`);
    });
    // logger
    app.use(async (ctx, next) => {
        var start = Date.now();
        await next();// 2
        var ms = Date.now() - start; // 4
        console.log(`${ctx.method} ${ctx.url} ${ms}ms`);
    });
    app.use(async (ctx, next) => {
        ctx.body = 'Hello World'; // 3
    });
    app.listen(3000);


application对象
---

### app.listen(...)

`app.listen(...)` 是`Server.listen`方法的语法糖

    app.listen = function(port) {
        http.createServer(app.callback()).listen(port);
    }

### app.callback()
返回适用于 http.createServer() 方法的回调函数来处理请求。

### app.use(func)
将给定的中间件方法添加到此应用程序

### app.keys=
设置签名的 Cookie 密钥。设置带签名的cookie时使用

    app.keys = ['im a newer secret', 'i like turtle'];
    app.use(async (ctx, next) => {
        ctx.cookies.set('name', 'sidy', {signed: true});
    });


### app.context
app.context 是中间件参数 ctx 的原型对象。通过编辑 app.context 为 ctx 添加其他属性。这对于将 ctx 添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 require()），而更多地依赖于ctx，这可以被认为是一种反模式。

    // ctx上添加对数据库的引用
    app.context.db = db();
    app.use(async (ctx, next) => {
        console.log(ctx.db);
    });

错误处理
---
默认情况下，将所有错误输出到 stderr，除非 app.silent 为 true。 当 err.status 是 404 或 err.expose 是 true 时默认错误处理程序也不会输出错误。 要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个 “error” 事件侦听器：
    
    // 监听app的错误
    app.on('error', err => {
        console.error('server error:', err);
    });

如果 req/res 期间出现错误，并且 _无法_ 响应客户端，Context实例会被传递：

    app.on('error', (err, ctx) => {
        console.error('server error', err, ctx);
    });

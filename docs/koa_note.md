koad notes
=====

简介
---
Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

[koa文档](https://koa.bootcss.com/)


安装
---
Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持.
```bash    
    nvm install 8
    npm i koa
```
使用 Babel 实现 Async 方法
---

要在 node < 7.6 版本的 Koa 中使用 async 方法, 我们推荐使用 babel's require hook.
```js
    require('babel-register');
    // 应用的其余 require 需要被放到 hook 后面
    const app = require('./app');
    
    // .babelrc 配置
    {
      "plugins": ["transform-async-to-generator"]
    }
```
实例
---
Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的
```js
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
```

设置
---
应用程序设置是 app 实例上的属性，目前支持如下：

- app.env 默认是 NODE_ENV 或 "development"
- app.keys 签名的 cookie 密钥数组
- app.proxy 当真正的代理头字段将被信任时
- 忽略 .subdomains 的 app.subdomainOffset 偏移量，默认为 2
- app.proxyIpHeader 代理 ip 标头, 默认为 X-Forwarded-For
- app.maxIpsCount 从代理 ip 标头读取的最大 ips, 默认为 0 (代表无限)

```js
    // 传给构造函数 进行设置
    const Koa = require('koa');
    const app = new Koa({ proxy: true });
    
    // 直接在app实例上设置
    const Koa = require('koa');
    const app = new Koa();
    app.proxy = true;
```

application对象
---
Koa 应用程序不是 HTTP 服务器的1对1展现。 可以将一个或多个 Koa 应用程序安装在一起以形成具有单个HTTP服务器的更大应用程序。

### app.listen(...)

`app.listen(...)` 是`Server.listen`方法的语法糖

```js
    app.listen = function(port) {
        http.createServer(app.callback()).listen(port);
    }
```

您可以将同一个应用程序同时作为 HTTP 和 HTTPS 或多个地址：
```js
    const http = require('http');
    const https = require('https');
    const Koa = require('koa');
    const app = new Koa();
    http.createServer(app.callback()).listen(3000);
    https.createServer(app.callback()).listen(3001);
```    

### app.callback()
返回适用于 http.createServer() 方法的回调函数,用来处理请求。

### app.use(fn)
将给定的中间件方法添加到此应用程序

### app.keys=
设置签名的 Cookie 密钥
```js
    app.keys = ['im a newer secret', 'i like turtle'];
    app.use(async (ctx, next) => {
        ctx.cookies.set('name', 'sidy', {signed: true});
    });
```
keys被传递给 KeyGrip，但是你也可以传递你自己的 KeyGrip 实例
```js
    app.keys = ['im a newer secret', 'i like turtle'];
    app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');    
```

### app.context
**app.context 是中间件参数 ctx 的原型对象**。通过编辑 app.context 为 ctx 添加其他属性。这对于将 ctx 添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 require()），而更多地依赖于ctx，这可以被认为是一种反模式。
```js
    // ctx上添加对数据库的引用
    app.context.db = db();
    app.use(async (ctx, next) => {
        console.log(ctx.db);
    });
```

> ctx 上的许多属性都是使用Object.defineProperty() 定义的getter ，setter。你只能通过在 app.context 上使用 Object.defineProperty() 来编辑这些属性（不推荐）。 
> Object.definedProperty(obj, propName, {value, enumerable, writable, configurable, get, set})

错误处理
---
默认情况下，将所有错误输出到 stderr，除非 app.silent 为 true。 当 err.status 是 404 或 err.expose 是 true 时默认错误处理程序也不会输出错误。 要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个 “error” 事件侦听器：
```js    
    // 监听app的错误
    app.on('error', err => {
        console.error('server error:', err);
    });
```
如果 req/res 期间出现错误，并且 _无法_ 响应客户端，Context实例会被传递：
```js
    app.on('error', (err, ctx) => {
        console.error('server error', err, ctx);
    });
```

上下文(Context)
---
Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用  


_每个_ 请求都将创建一个 Context，并在中间件中作为接收器引用

```js
    app.use(async ctx => {
      ctx; // 这是 Context
      ctx.request; // 这是 koa Request
      ctx.response; // 这是 koa Response
      ctx.req; // 这是 nodejs Request
      ctx.res; // 这是 nodejs Response
    });
```
为方便起见许多上下文的访问器和方法直接委托给它们的 ctx.request或 ctx.response ，不然的话它们是相同的。 例如 ctx.type 和 ctx.length 委托给 response 对象，ctx.path 和 ctx.method 委托给 request。


**Context 具体方法和访问器**

- ctx.req  
    Node 的 request 对象.

- ctx.res  
    Node 的 response 对象.

    绕过 Koa 的 response 处理是 *不被支持的* , 应避免使用以下 node 属性：

        res.statusCode
        res.writeHead()
        res.write()
        res.end()


- ctx.request  
    koa 的 Request 对象.

- ctx.response  
    koa 的 Response 对象.

- ctx.state  
    推荐的命名空间，用于中间件之间传递数据和保存用于前端视图的数据。  

        ctx.state.user = await User.find(id);

- ctx.app  
    应用程序实例引用

- ctx.app.emit  
    Koa 应用扩展了nodejs内部 EventEmitter。

- ctx.cookies.get(name, [options])  
    获取 cookie
- ctx.cookies.set(name, value, [options])  
    设置 cookie, options参数如下:

    * `maxAge` 一个数字表示从 Date.now() 得到的毫秒数
    * `signed` cookie 签名值
    * `expires` cookie 过期的 Date
    * `path` cookie 路径, 默认是'/'
    * `domain` cookie 域名
    * `secure` 安全 cookie
    * `httpOnly` 服务器可访问 cookie, 默认是 true
    * `overwrite` 是否覆盖以前设置的同名的 cookie (默认是 false)

- ctx.throw([status], [msg], [properties])  
    Helper 方法抛出一个 .status 属性默认为 500 的错误，这将允许 Koa 做出适当地响应。

    允许以下组合：
    ```js
        ctx.throw(400);
        ctx.throw(400, 'name required');
        ctx.throw(400, 'name required', { user: user });

        // 例如 ctx.throw(400, 'name required') 等效于:
        const err = new Error('name required');
        err.status = 400;
        err.expose = true;
        throw err;

        // koa 使用 http-errors 来创建错误。status 只应作为第一个参数传递。
        ctx.throw(401, 'access_denied', { user: user });
    ```
    > 注意，这些是用户级错误，并用 err.expose 标记，这意味着消息适用于客户端响应，这通常不是错误消息的内容，因为您不想泄漏故障详细信息。



- ctx.assert(value, [status], [msg], [properties])  
    当 !value 时，Helper 方法抛出类似于 .throw() 的错误。这与 node 的 assert() 方法类似.
    ```js
        // koa 使用 http-assert 作为断言。
        ctx.assert(ctx.state.user, 401, 'User not found. Please login!');
    ```

- ctx.respond  
    为了绕过 Koa 的内置 response 处理，你可以显式设置 ctx.respond = false;。 如果您想要写入原始的 res 对象而不是让 Koa 处理你的 response，请使用此参数。

    > 请注意，Koa _不_ 支持使用此功能。这可能会破坏 Koa 中间件和 Koa 本身的预期功能。使用这个属性被认为是一个 hack，只是便于那些希望在 Koa 中使用传统的 fn(req, res) 功能和中间件的人。  
    

**Request 别名**  

以下访问器和 Request 别名等效：

- ctx.href
- ctx.method
- ctx.method=
- ctx.url
- ctx.url=
- ctx.originalUrl
- ctx.path
- ctx.path=
- ctx.header
- ctx.headers
- ctx.origin
- ctx.query
- ctx.query=
- ctx.querystring
- ctx.querystring=
- ctx.host
- ctx.hostname
- ctx.fresh
- ctx.stale
- ctx.socket
- ctx.protocol
- ctx.secure
- ctx.ip
- ctx.ips
- ctx.subdomains
- ctx.is()
- ctx.accepts()
- ctx.acceptsEncodings()
- ctx.acceptsCharsets()
- ctx.acceptsLanguages()
- ctx.get()

**Response 别名**  
以下访问器和 Response 别名等效：

- ctx.body
- ctx.body=
- ctx.status
- ctx.status=
- ctx.message
- ctx.message=
- ctx.length=
- ctx.length
- ctx.type=
- ctx.type
- ctx.headerSent
- ctx.redirect()
- ctx.attachment()
- ctx.set()
- ctx.append()
- ctx.remove()
- ctx.lastModified=
- ctx.etag=


请求(Request)
---
Koa Request 对象是在 node 的 vanilla 请求对象之上的抽象，提供了诸多对 HTTP 服务器开发有用的功能。


- request.header  
    请求标头对象。这与 node http.IncomingMessage 上的 headers 字段相同

- request.header=  
    设置请求标头对象。

- request.headers  
    请求标头对象。别名为 request.header.

- request.headers=  
    设置请求标头对象。别名为 request.header=.

- request.method  
    请求方法。

- request.method=  
    设置请求方法，对于实现诸如 methodOverride() 的中间件是有用的。

- request.length  
    返回以数字返回请求的 Content-Length，或 undefined。

- request.url  
    获取请求 URL.

- request.url=  
    设置请求 URL, 对 url 重写有用。

- request.originalUrl  
    获取请求原始URL。

- request.origin  
    获取URL的来源，包括 protocol 和 host。

        ctx.request.origin // => http://example.com

- request.href
    获取完整的请求URL，包括 protocol，host 和 url。

        ctx.request.href; // => http://example.com/foo/bar?q=1

- request.path  
    获取请求路径名。

- request.path=  
    设置请求路径名，并在存在时保留查询字符串。

- request.querystring  
    根据 ? 获取原始查询字符串.

- request.querystring=  
    设置原始查询字符串。

- request.search  
    使用 ? 获取原始查询字符串。

- request.search=  
    设置原始查询字符串。

- request.host  
    获取当前主机（hostname:port）。当 app.proxy 是 true 时支持 X-Forwarded-Host，否则使用 Host。

- request.hostname
    存在时获取主机名。当 app.proxy 是 true 时支持 X-Forwarded-Host，否则使用 Host。


- request.URL  
    获取 WHATWG 解析的 URL 对象。

- request.type  
    获取请求 Content-Type 不含参数 "charset"。

        const ct = ctx.request.type; // => "image/png"

- request.charset  
    在存在时获取请求字符集，或者 undefined：

        ctx.request.charset; // => "utf-8"

- request.query  
    获取解析的查询字符串, 当没有查询字符串时，返回一个空对象。请注意，此 getter _不_ 支持嵌套解析。

        例如 "color=blue&size=small":

        {
            color: 'blue',
            size: 'small'
        }

- request.query=  
    将查询字符串设置为给定对象。 请注意，此 setter _不_ 支持嵌套对象。

        ctx.query = { next: '/login' };

- request.fresh  
    检查请求缓存是否“新鲜”，也就是内容没有改变。此方法用于 If-None-Match / ETag, 和 If-Modified-Since 和 Last-Modified 之间的缓存协商。 在设置一个或多个这些响应头后应该引用它。

        // 新鲜度检查需要状态20x或304
        ctx.status = 200;
        ctx.set('ETag', '123');

        // 缓存是好的
        if (ctx.fresh) {
            ctx.status = 304;
            return;
        }

        // 缓存是陈旧的
        // 获取新数据
        ctx.body = await db.find('something');

- request.stale  
    相反与 request.fresh.

- request.protocol  
    返回请求协议，“https” 或 “http”。当 app.proxy 是 true 时支持 X-Forwarded-Proto。

- request.secure  
    通过 ctx.protocol == "https" 来检查请求是否通过 TLS 发出。

- request.ip  
    请求远程地址。 当 app.proxy 是 true 时支持 X-Forwarded-Proto。

- request.ips  
    当 X-Forwarded-For 存在并且 app.proxy 被启用时，这些 ips 的数组被返回，从上游 - >下游排序。 禁用时返回一个空数组

- request.subdomains  
    将子域返回为数组。

    子域是应用程序主域之前主机的点分隔部分。默认情况下，应用程序的域名假定为主机的最后两个部分。这可以通过设置 app.subdomainOffset 来更改。

    例如，如果域名为“tobi.ferrets.example.com”：

    如果 app.subdomainOffset 未设置, ctx.subdomains 是 ["ferrets", "tobi"]. 如果 app.subdomainOffset 是 3, ctx.subdomains 是 ["tobi"].

- request.is(types...)  
    检查传入请求是否包含 Content-Type 头字段， 并且包含任意的 mime type。 如果没有请求主体，返回 null。 如果没有内容类型，或者匹配失败，则返回 false。 反之则返回匹配的 content-type。
    ```js
        // 使用 Content-Type: text/html; charset=utf-8
        ctx.is('html'); // => 'html'
        ctx.is('text/html'); // => 'text/html'
        ctx.is('text/*', 'text/html'); // => 'text/html'

        // 当 Content-Type 是 application/json 时
        ctx.is('json', 'urlencoded'); // => 'json'
        ctx.is('application/json'); // => 'application/json'
        ctx.is('html', 'application/*'); // => 'application/json'

        ctx.is('html'); // => false
        例如，如果要确保仅将图像发送到给定路由：

        if (ctx.is('image/*')) {
            // 处理
        } else {
            ctx.throw(415, 'images only!');
        }
    ```

**内容协商**  
Koa的 request 对象包括由 accepts 和 negotiator 提供的有用的内容协商实体。


    request.accepts(types)
    request.acceptsEncodings(types)
    request.acceptsCharsets(charsets)
    request.acceptsLanguages(langs)

如果没有提供类型，则返回 所有 可接受的类型。

如果提供多种类型，将返回最佳匹配。 如果没有找到匹配项，则返回一个false，你应该向客户端发送一个406 "Not Acceptable" 响应。

如果接收到任何类型的接收头，则会返回第一个类型。 因此，你提供的类型的顺序很重要。

- request.accepts(types)  
    检查给定的 type(s) 是否可以接受，如果 true，返回最佳匹配，否则为 false。 type 值可能是一个或多个 mime 类型的字符串，如 application/json，扩展名称如 json，或数组 ["json", "html", "text/plain"]。

        // Accept: text/html
        ctx.accepts('html');
        // => "html"

        // Accept: text/*, application/json
        ctx.accepts('html');
        // => "html"
        ctx.accepts('text/html');
        // => "text/html"
        ctx.accepts('json', 'text');
        // => "json"
        ctx.accepts('application/json');
        // => "application/json"

        // Accept: text/*, application/json
        ctx.accepts('image/png');
        ctx.accepts('png');
        // => false

        // Accept: text/*;q=.5, application/json
        ctx.accepts(['html', 'json']);
        ctx.accepts('html', 'json');
        // => "json"

        // No Accept header
        ctx.accepts('html', 'json');
        // => "html"
        ctx.accepts('json', 'html');
        // => "json"
        你可以根据需要多次调用 ctx.accepts()，或使用 switch：

        switch (ctx.accepts('json', 'html', 'text')) {
        case 'json': break;
        case 'html': break;
        case 'text': break;
        default: ctx.throw(406, 'json, html, or text only');
        }

- request.acceptsEncodings(encodings)  
    检查 encodings 是否可以接受，返回最佳匹配为 true，否则为 false。 请注意，您应该将identity 作为编码之一！

        // Accept-Encoding: gzip
        ctx.acceptsEncodings('gzip', 'deflate', 'identity');
        // => "gzip"

        ctx.acceptsEncodings(['gzip', 'deflate', 'identity']);
        // => "gzip"

        // 当没有给出参数时，所有接受的编码将作为数组返回：
        // Accept-Encoding: gzip, deflate
        ctx.acceptsEncodings();
        // => ["gzip", "deflate", "identity"]

- request.acceptsCharsets(charsets)  
    检查 charsets 是否可以接受，在 true 时返回最佳匹配，否则为 false。

        // Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
        ctx.acceptsCharsets('utf-8', 'utf-7');
        // => "utf-8"

        ctx.acceptsCharsets(['utf-7', 'utf-8']);
        // => "utf-8"
        当没有参数被赋予所有被接受的字符集将作为数组返回：

        // Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
        ctx.acceptsCharsets();
        // => ["utf-8", "utf-7", "iso-8859-1"]
        request.acceptsLanguages(langs)
        检查 langs 是否可以接受，如果为 true，返回最佳匹配，否则为 false。

        // Accept-Language: en;q=0.8, es, pt
        ctx.acceptsLanguages('es', 'en');
        // => "es"

        ctx.acceptsLanguages(['en', 'es']);
        // => "es"
        当没有参数被赋予所有接受的语言将作为数组返回：

        // Accept-Language: en;q=0.8, es, pt
        ctx.acceptsLanguages();
        // => ["es", "pt", "en"]

- request.idempotent  
    检查请求是否是幂等的。

- request.socket  
    返回请求套接字。

- request.get(field)  
    返回请求标头。不区 field 的分大小写.

响应(Response)
---
Koa Response 对象是在 node 的 vanilla 响应对象之上的抽象，提供了诸多对 HTTP 服务器开发有用的功能。

- response.header  
    响应标头对象。

- response.headers  
    响应标头对象。别名是 response.header。

- response.socket  
    响应套接字。 作为 request.socket 指向 net.Socket 实例。

- response.status  
    获取响应状态。默认情况下，response.status 设置为 404 而不是像 node 的 res.statusCode 那样默认为 200。

- response.status=  
    通过数字代码设置响应状态：

    * 100 "continue"
    * 101 "switching protocols"
    * 102 "processing"
    * 200 "ok"
    * 201 "created"
    * 202 "accepted"
    * 203 "non-authoritative information"
    * 204 "no content"
    * 205 "reset content"
    * 206 "partial content"
    * 207 "multi-status"
    * 208 "already reported"
    * 226 "im used"
    * 300 "multiple choices"
    * 301 "moved permanently"
    * 302 "found"
    * 303 "see other"
    * 304 "not modified"
    * 305 "use proxy"
    * 307 "temporary redirect"
    * 308 "permanent redirect"
    * 400 "bad request"
    * 401 "unauthorized"
    * 402 "payment required"
    * 403 "forbidden"
    * 404 "not found"
    * 405 "method not allowed"
    * 406 "not acceptable"
    * 407 "proxy authentication required"
    * 408 "request timeout"
    * 409 "conflict"
    * 410 "gone"
    * 411 "length required"
    * 412 "precondition failed"
    * 413 "payload too large"
    * 414 "uri too long"
    * 415 "unsupported media type"
    * 416 "range not satisfiable"
    * 417 "expectation failed"
    * 418 "I'm a teapot"
    * 422 "unprocessable entity"
    * 423 "locked"
    * 424 "failed dependency"
    * 426 "upgrade required"
    * 428 "precondition required"
    * 429 "too many requests"
    * 431 "request header fields too large"
    * 500 "internal server error"
    * 501 "not implemented"
    * 502 "bad gateway"
    * 503 "service unavailable"
    * 504 "gateway timeout"
    * 505 "http version not supported"
    * 506 "variant also negotiates"
    * 507 "insufficient storage"
    * 508 "loop detected"
    * 510 "not extended"
    * 511 "network authentication required"

- response.message  
    获取响应的状态消息. 默认情况下, response.message 与 response.status 关联.

- response.message=  
    将响应的状态消息设置为给定值。

- response.length=  
    将响应的 Content-Length 设置为给定值。

- response.length  
    以数字返回响应的 Content-Length，或者从ctx.body推导出来，或者undefined。

- response.body  
    获取响应主体。

- response.body=  
    将响应体设置为以下之一：

    + String  
        Content-Type 默认为 text/html 或 text/plain, 同时默认字符集是 utf-8。Content-Length 字段自动计算。

    * Buffer  
        Content-Type 默认为 application/octet-stream, 并且 Content-Length 字段自动计算。

    * Stream  
        Content-Type 默认为 application/octet-stream。
        ```js
            //以下是流错误处理的示例，而不会自动破坏流：

            const PassThrough = require('stream').PassThrough;

            app.use(async ctx => {
            ctx.body = someHTTPStream.on('error', ctx.onerror).pipe(PassThrough());
            });
        ```
    * Object  
        Content-Type 默认为 application/json. 这包括普通的对象 { foo: 'bar' } 和数组 ['foo', 'bar']。

    * null  
        无内容响应  

- response.get(field)  
    不区分大小写获取响应标头字段值 field。

        const etag = ctx.response.get('ETag');

- response.has(field)  
    是否存在指定请求头，请求头名称不区分大小写.

        const rateLimited = ctx.response.has('X-RateLimit-Limit');

- response.set(field, value)  
    设置响应标头
        ctx.set('Cache-Control', 'no-cache');

- response.append(field, value)  
    用值 val 附加额外的标头 field。
        ctx.append('Link', '<http://127.0.0.1/>');

- response.set(fields)  
    用一个对象设置多个响应标头fields:
    ```js
        // 这将委托给 setHeader ，它通过指定的键设置或更新标头，并且不重置整个标头。
        ctx.set({
            'Etag': '1234',
            'Last-Modified': date
        });
    ```
- response.remove(field)  
    删除标头 field。

- response.type  
    获取响应 Content-Type 不含参数 "charset"。
        const ct = ctx.type; // => "image/png"

- response.type=  
    设置响应 Content-Type 通过 mime 字符串或文件扩展名。

        ctx.type = 'text/plain; charset=utf-8';
        ctx.type = 'image/png';
        ctx.type = '.png';
        ctx.type = 'png';

    > 注意: 在适当的情况下为你选择 charset, 比如 response.type = 'html' 将默认是 "utf-8". 如果你想覆盖 charset, 使用 ctx.set('Content-Type', 'text/html') 将响应头字段设置为直接值。

- response.is(types...)  
    非常类似 ctx.request.is(). 检查响应类型是否是所提供的类型之一。这对于创建操纵响应的中间件特别有用。
    ```js
        const minify = require('html-minifier');

        app.use(async (ctx, next) => {
        await next();

        if (!ctx.response.is('html')) return;

        let body = ctx.body;
        if (!body || body.pipe) return;

        if (Buffer.isBuffer(body)) body = body.toString();
            ctx.body = minify(body);
        });
    ```

- response.redirect(url, [alt])  
    执行 [302] 重定向到 url.

    ```js
        // 字符串 “back” 是特别提供Referrer支持的，当Referrer不存在时，使用 alt 或“/”。
        ctx.redirect('back');
        ctx.redirect('back', '/index.html');
        ctx.redirect('/login');
        ctx.redirect('http://google.com');

        // 要更改 “302” 的默认状态，只需在该调用之前或之后分配状态。要变更主体请在此调用之后:
        ctx.status = 301;
        ctx.redirect('/cart');
        ctx.body = 'Redirecting to shopping cart';
    ```

- response.attachment([filename], [options])  
    将 Content-Disposition 设置为 “附件” 以指示客户端提示下载。(可选)指定下载的 filename 和部分 参数。

- response.headerSent  
    检查是否已经发送了一个响应头。 用于查看客户端是否可能会收到错误通知。

- response.lastModified  
    将 Last-Modified 标头返回为 Date, 如果存在。

- response.lastModified=  
    将 Last-Modified 标头设置为适当的 UTC 字符串。您可以将其设置为 Date 或日期字符串。
        ctx.response.lastModified = new Date();

- response.etag=  
    设置包含 " 包裹的 ETag 响应， *请注意，没有相应的 response.etag getter。*
    
        ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');

- response.vary(field)  
    在 field 上变化。

- response.flushHeaders()  
    刷新任何设置的标头，并开始主体。
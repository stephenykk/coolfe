# puppeteer.js notes

## 简介
Puppeteer 是 Chrome开发团队2017年发布的一个 Node.js包，提供了一组用来操纵Chrome的API，通俗来说就是一个Headless Chrome浏览器，这Headless Chrome也可以配置成有UI的 。利用Puppeteer可以做到爬取页面数据，页面截屏或者生成PDF文件，前端自动化测试（模拟输入/点击/键盘行为）以及捕获站点的时间线，分析网站性能问题。


[w3cschool puppeteer教程](https://www.w3cschool.cn/puppeteer/)
[api](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageclickselector-options)

```js
const puppeteer = require('puppeteer')
async function main() {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()

    page.on('response', res => {
        const req = res.request()
        res.text().then(result => {
            console.log('请求地址：', req.method(), req.url(), res.status())
            // console.log('返回数据:', result)
        })
    })

    await page.goto('https://www.baidu.com', {waitUntil: 'networkidle2'})
    await page.waitFor(2 * 1000)
    let title = await page.evaluate(() => {
        return document.title
    })

    console.log(title)

    await browser.close()   
}


main()
```

## 使用实例

网页截图
```js
const puppeteer = require('puppeteer')

async function main() {
    const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 1200}});
    const page = await browser.newPage();

    // listen events
    page.once('load', (event) => {
        console.log('[LOAD] page has loaded.')
    });

    page.on('request', (request) => {
        console.log('[INFO] sending a request to:', request.url())
    });

    console.log('going to baidu...')
    await page.goto('https://www.baidu.com', {waitUntil: 'networkidle2'});
    await page.waitFor(3*1000);
    await page.screenshot({path: `baidu${Math.floor(Math.random() * 100)}.png`});
    await browser.close();
}

main();
```

监听console事件
```js
const puppeteer = require('puppeteer')

async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', message => {
        for(let i = 0; i < message.args().length; i++) {
            console.log(`${i}: ${message.args()[i]}`);
        }
    });
    await page.goto('https://www.baidu.com', {waitUntil: 'load'});
    await page.evaluate(function() {
        console.log('hello', 'kk', 'take good care of...', JSON.stringify({name: 'my hero', action: 'go ahead'}))
    });

    await browser.close();
}

main()
```
翻译抓取
```js
const puppeteer = require('puppeteer')

const words = ['原来有个故事', '从前订单很多', '亲爱的老师'];

async function main() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    console.log('going to dict...')
    await page.goto('http://dict.youdao.com/', {waitUntil: 'load'});
    
    for(const word of words) {
        console.log('trying...', word);
        await page.waitForSelector('#translateContent, #query')
        await page.type('#translateContent,#query', word);
        await Promise.all([page.waitForNavigation({waitUntil: 'load'}), page.click('#border + button, #f .s-btn')]);
        const con = await page.$eval('.trans-container .wordGroup:first-child .contentTitle, .trans-container p:nth-child(2)', el => el.textContent);
        console.log(`${word} 的英文翻译:${con}`)
        
    }

    await browser.close();
}

main();
```

> Puppeteer是通过使用Chrome DevTools Protocol(CDP)协议与浏览器进行通信
> 而Browser对应一个浏览器实例，可以拥有浏览器上下文，一个Browser可以包含多个BrowserContext。Page表示一个Tab页面，一个BrowserContext可以包含多个Page。每个页面都有一个主的Frame，ExecutionContext是Frame提供的一个JavasSript执行环境。


## browser实例

```js
const browser = await puppeteer.launch({
    devtools: true, //是否为每个选项卡自动打开DevTools面板
    headless: false,    //是否以无头模式运行浏览器。默认是true，除非devtools选项是true
    defaultViewport: { width: 1000, height: 1200 }, //为每个页面设置一个默认视口大小
    ignoreHTTPSErrors: true //是否在导航期间忽略 HTTPS 错误
})

const browser = await puppeteer.launch({
    // --remote-debugging-port=3333会启一个端口，在浏览器中访问http://127.0.0.1:3333/可以查看
    args: ['--remote-debugging-port=3333']
})


console.log(browser.wsEndpoint()) 
// ws://127.0.0.1:57546/devtools/browser/5d6ee624-6b5e-4b8c-b284-5e4800eac853
// 这就是devTool用于连接调试页面的连接


const puppeteer = require('puppeteer');
puppeteer.launch().then(async browser => { 
    const browserWSEndpoint = browser.wsEndpoint(); // 存储节点以便能重新连接到 Chromium   
    browser.disconnect();  // 从 Chromium 断开和 puppeteer 的连接
    const browser2 = await puppeteer.connect({browserWSEndpoint});  // 使用节点来重新建立连接  
    await browser2.close(); // 关闭 Chromium  
});
```

## page
`browser.newPage()` 生成页面对象。我们看下 `newPage()` 的代码实现

```js
/**
* @param {?string} contextId
* @return {!Promise<!Puppeteer.Page>}
*/
async _createPageInContext(contextId) {
    const {targetId} = await this._connection.send('Target.createTarget', {url: 'about:blank', browserContextId: contextId || undefined});
    const target = await this._targets.get(targetId);
    assert(await target._initializedPromise, 'Failed to create target for page');
    const page = await target.page();
    return page;
}


const page = await browser.newPage()
await page.goto(url, {
    waitUntil: 'networkidle0'
})
/*
waitUntil参数是来确定满足什么条件才认为页面跳转完成。包括以下事件：

    load - 页面的load事件触发时
    domcontentloaded - 页面的DOMContentLoaded事件触发时
    networkidle0 - 不再有网络连接时触发（至少500毫秒后）
    networkidle2 - 只有2个网络连接时触发（至少500毫秒后）
*/

// 添加cookie 
const cookies = [
    {
      name: 'token',
      value: 'system tokens', // 你系统自己的token
      domain: 'domain' // 需要种在哪个domain下
    }
]
await page.setCookie(...cookies)


// 模拟输入和点击

// 操作input输入 132 ，delay参数表示输入延迟
await page.type('.el-form-item:nth-child(1) input', '132', { delay: 20 })
// 操作点击
await page.click('.el-form-item:nth-child(2) .el-form-item__content label:nth-child(1)')
await page.focus('myInput')
await page.keyboard.sendCharacter('test')


// 监听响应
page.on('response', response => {
    const req = response.request()
    console.log(`Response的请求地址：${req.url()}，请求方式是：${req.method()}, 请求返回的状态${response.status()},`)
    let message = response.text()
    message.then(function (result) {
        console.log(`返回的数据：${result}`)
    })
})


// 截屏
// 截取url中的路径标示，作为保存图片的命名，防止保存后覆盖
const testName = decodeURIComponent(url.split('#/')[1]).replace(/\//g, '-')
await page.screenshot({
    path: `${testName}.png`,
    fullPage: true
})

```

Page对象主要使用三种manager来管理常见操作:

- FrameManager：页面行为管理。如跳转goto，点击clcik，模拟输入type，等待加载waitFor等

- NetworkManager：网络行为管理。如设置每个请求忽略缓存setCacheEnabled，请求拦截setRequestInterception等

- EmulationManager：模拟行为管理。只有一个方法，emulateViewport，模拟设备与视口尺寸

Page对象继承了eventEmitter接口，事件监听如下：

```js
    page.on('request', request => console.log('send:', request.url()))
    page.once('load', () => console.log('page loaded.'))
    page.off('request', fn);
    page.removeListener(event, fn);
```
page events:

- close
- console
- error
- dialog
- domcontentloaded
- load
- request requestfailed requestfinished
- response
- metrics
- ...

page namespace:

- keyboard
- mouse
- touchscreen
- tracing
- ...


page methods:

- page.$(selector)  
    page.mainFrame().$(selector) 的简写 在页面内执行 document.querySelector。如果没有元素匹配指定选择器，返回值是 null
- page.$$(selector)  
    page.mainFrame().$$(selector) 的简写
- page.$$eval(selector, pageFn [, ...args])  
    此方法在页面内执行 Array.from(document.querySelectorAll(selector))，然后把匹配到的元素数组作为第一个参数传给 pageFunction。 如果 pageFunction 返回的是 Promise，那么此方法会等 promise 完成后返回其返回值。
    ```js
        const divCounts = await page.$$eval('div', divs => divs.length)
    ```
- page.$eval(selector, pageFn [, ...args])  
    page.mainFrame().$eval(selector, pageFunction [, ...args])的简写  
    此方法在页面内执行 document.querySelector，然后把匹配到的元素作为第一个参数传给 pageFunction。 如果 pageFunction 返回的是 Promise，那么此方法会等 promise 完成后返回其返回值。 示例:
    ```js
        const serachVal = await page.$eval('#search', el => el.value)
        const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
        const html = await page.$eval('.main-con', el => el.outerHTML);
    ```

- page.$x(expression)  
    返回: `<Promise<Array<ElementHandle>>>` 此方法解析指定的XPath表达式。 

- page.addScriptTag(options)  
    options: 
    + url `<string>` 要添加的script的src 
    + path `<string>` 要注入frame的js文件路径. 如果 path 是相对路径, 那么相对 当前路径 解析。 
    + content `<string>` 要注入页面的js代码（即content） 
    + type `<string>` 脚本类型。 如果要注入 ES6 module，值为'module'。

- page.addStyleTag(options)
     添加一个指定link(url)的 `<link rel="stylesheet">` 标签。 或者添加一个指定代码(content)的 `<style type="text/css">` 标签, options 参考上面

- page.bringToFront()
- page.browser()
- page.click(selector [, options])  
    selector `<string>` 要点击的元素的选择器。 如果有多个匹配的元素, 点击第一个  
    options:
        + button  left/right/middle
        + clickCount
        + delay mousedown 和 mouseup 之间停留的时间，单位是毫秒

    返回: `<Promise>` Promise对象，匹配的元素被点击。 如果没有元素被点击，Promise对象将被rejected。

    此方法找到一个匹配 selector 选择器的元素，如果需要会把此元素滚动到可视，然后通过 page.mouse 点击它。 如果选择器没有匹配任何元素，此方法将会报错。 要注意如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation() Promise对象需要等待。 正确的等待点击后的跳转是这样的：
    ```js
        const [response] = Promise.all([ page.waitForNavigation(waitOptions), page.click(selector, clickOptions)])
    ```

- page.type(selector, text [, options])
- page.close([options])
- page.setUserAgent(userAgent)
- page.url()
- page.viewport()
- page.setViewport(viewport)
- page.title()
- page.content()
- page.setContent(html [, options])
- page.cookies([...urls]);
- page.setCookie(...cookies)
- page.deleteCookie(...cookies)
- page.waitFor(ms)
- page.waitForFunction(pageFunction [, options])
- page.emulate([options])
- page.emulateMedia(mediaType)
- page.evaluate(pageFn [, ...args])
- page.evaluateHandle(pageFn [, ...args])
- page.exposeFunction(name, puppetteerFunction)
- page.focus(selector)
- page.frames()
- page.goBack([options])
- page.goForward([options])
- page.goto(url [, options])
- page.hover(selector)
- page.isClosed()
- page.mainFrame()
- page.pdf([options])
- page.screenshot([options])
- page.reload([options])
- page.select(selector, ...values)
- page.setCacheEnabled([enabled])
- page.setExtraHTTPHeaders(headers)
- page.setJavaScriptEnabled(enabled)
- page.setRequestInterception(value)
- page.tap(selector)
- page.waitForNavigation([options])
- page.waitForRequest(url [, options])
- page.waitForResponse(url [, options])
- page.waitForSelector(selector [, options])
- page.workers()


## puppetter worker
```js
page.on('workercreated', worker => console.log('create worker:', worker.url()))

worker.url()
worker.evaluate(pageFunction [, ...args])
worker.evaluateHandle(pageFunction [, ...args])
worker.executionContext()
```

## puppetteer keyboard
```js
    await page.keyboard.sendCharacter('h')
    await page.keyboard.type('hello world')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.down('shift')
    for(let i; i < 'hello'.length; i++) await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Backspace');
    // type A
    await page.keyboard.down('shift')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('shift')
```

## puppeteer mouse
```js
    // 使用 ‘page.mouse’ 追踪 100x100 的矩形。
    await page.mouse.move(0, 0);
    await page.mouse.down();
    await page.mouse.move(0, 100);
    await page.mouse.move(100, 100);
    await page.mouse.move(100, 0);
    await page.mouse.move(0, 0);
    await page.mouse.up();

    await page.mouse.click(x, y [, options]) // options = {button, clickCount, delay}
    await page.mouse.move(x, y [, options])
    await page.mouse.down([options])
    await page.mouse.up([options])

```

## puppeteer consoleMessage
ConsoleMessage 对象由页面通过 console 事件分发

```js
consoleMessage.args()
consoleMessage.text()
consoleMessage.type()
```

## puppeteer frame

```js
// 一个从 iframe 元素中获取文本的例子
const frame = page.frames().find(frame => frame.name = 'myframe')
const kw = await frame.$eval('#kw', kwEl => kwEl.textContent)

// JSHandle 实例也可以作为 frame.evaluateHandle 的参数:
const ahandle = await frame.evaluateHandle(() => document.body)
const resultHandle = await frame.evaluateHandle(body => body.innerHTML, ahandle)
const result = await resultHandle.jsonValue()
console.log(result)
await resultHandle.dispose();
```

## puppeteer ExecutionContext
该类表示一个 JavaScript 执行的上下文。 Page 可能有许多执行上下文： 每个 frame 都有 "默认" 的执行上下文，它始终在将帧附加到 DOM 后创建。该上下文由 frame.executionContext() 方法返回。 Extensions 的内容脚本创建了其他执行上下文。 除了页面，执行上下文可以在 workers 中找到。

```js
executionContext.evaluate(pageFn [, ...args])
executionContext.evaluateHandle(pageFn [, ...args])
executionContext.frame()


const executionContext = await page.mainFrame().executionContext();
const result = await executionContext.evaluate(() = >Promise.resolve(8 * 7));
console.log(result); // 输出 "56"

// JSHandle 实例可以作为参数传递给 executionContext.evaluate：
const oneHandle = await executionContext.evaluateHandle(() = >1);
const twoHandle = await executionContext.evaluateHandle(() = >2);
const result = await executionContext.evaluate((a, b) = >a + b, oneHandle, twoHandle);
await oneHandle.dispose();
await twoHandle.dispose();
console.log(result); // 输出 '3'
```

## puppeteer JSHandle
JSHandle 表示页面内的 JavaScript 对象。 JSHandles 可以使用 page.evaluateHandle 方法创建。

JSHandle 可防止引用的 JavaScript 对象被垃圾收集，除非是句柄 disposed。 当原始框架被导航或父上下文被破坏时，JSHandles 会自动处理。 JSHandle 实例可以使用在 page.$eval()，page.evaluate() 和 page.evaluateHandle 方法。


```js
    const winHandle = await page.evaluateHandle(() => window);


    jsHandle.asElement()
    jsHandle.dispose()
    jsHandle.executionContext()
    jsHandle.getProperties()
    jsHandle.getProperty(propertyName)
    jsHandle.jsonValue()

```

## puppeteer ElementHandle
 ElementHandle 表示一个页内的 DOM 元素。ElementHandles 可以通过 page.$ 方法创建。 ElementHandle 实例可以在 page.$eval() 和 page.evaluate() 方法中作为参数。

```js
    elementHandle.$(selector)
    elementHandle.$$(selector)
    elementHandle.$eval(selector, pageFunction, ...args)
    elementHandle.$$eval(selector, pageFunction, ...args)
    elementHandle.$x(expression)
    elementHandle.asElement()
    elementHandle.boundingBox()
    elementHandle.boxModel()
    elementHandle.click([options])
    elementHandle.contentFrame()
    elementHandle.dispose()
    elementHandle.executionContext()
    elementHandle.focus()
    elementHandle.getProperties()
    elementHandle.getProperty(propertyName)
    elementHandle.hover()
    elementHandle.isIntersectingViewport()
    elementHandle.jsonValue()
    elementHandle.press(key[, options])
    elementHandle.screenshot([options])
    elementHandle.tap()
    elementHandle.toString()
    elementHandle.type(text[, options])
    elementHandle.uploadFile(...filePaths)

    const tweetHandle = await page.$('.tweet');
    expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe('100');
    expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe('10');
```

## puppeteer request
每当页面发送一个请求，例如网络请求，以下事件会被 puppeteer 页面触发：

- 'request' 
    当请求发起后页面会触发这个事件。
- 'response'
    请求收到响应的时候触发。
- 'requestfinished'
  请求完成并且响应体下载完成时触发 如果某些时候请求失败，后续不会触发 'requestfinished' 事件(可能也不会触发 'response' 事件)，而是触发 'requestfailed' 事件 如果请求得到一个重定向的响应，请求会成功地触发 'requestfinished' 事件，并且对重定向的 url 发起一个新的请求

```js

    request.abort([errorCode])
    request.continue([overrides])
    request.failure()
    request.frame()
    request.headers()
    request.isNavigationRequest()
    request.method()
    request.postData()
    request.redirectChain()
    request.resourceType()
    request.respond(response)
    request.response()
    request.url()

// 请求拦截
    await page.setRequestInterception(true);
    page.on('request', request = >{
        request.respond({
            status: 404,
            contentType: 'text/plain',
            body: 'Not Found!'
        });
    });
```

## puppeteer response
```js

    response.buffer()
    response.frame()
    response.fromCache()
    response.fromServiceWorker()
    response.headers()
    response.json()
    response.ok()
    response.remoteAddress()
    response.request()
    response.securityDetails()
    response.status()
    response.statusText()
    response.text()
    response.url()

```

## puppeteer target
```js

    target.browser()
    target.browserContext()
    target.createCDPSession()
    target.opener()
    target.page()
    target.type()
    target.url()
```

koa + puppeteer 截图
```js
async screenshot (ctx, next) {
    await next();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const rqBody = ctx.request.body;
   
    // 设置cookie
    const myCookie = rqBody.cookie;
    const url = requestBody.url;
    // 如果url没传，报错
    if (!url) {
        ...
    }
   // 如果cookie没传，报错
    if (!myCookie) {
        ...
    }
    // 设置viewport的大小
    page.setViewport({
        width: rqBody.viewWidth,
        height: rqBody.viewHeight
    });
    await page.setCookie({
        name: myCookie.name,
        value: myCookie.value,
        url: url
    })
    await page.goto(url);
    
    // 根据传入的selector字符串，对Node截图
    const mySelector = rqBody.selector || 'body';
    await page.waitForSelector(mySelector);
    const region = await page.evaluate((mySelector) => {
        let select = document.querySelector(mySelector);
        let selectParam = select.getBoundingClientRect();
        return Promise.resolve({
            x: selectParam.x,
            y: selectParam.y,
            width: selectParam.width,
            height: selectParam.height
        })
    }, mySelector);

    // 返回base64编码的图片
    const result= await page.screenshot({
        clip: {
            ...region
        },
        encoding: 'base64'
    });
    ctx.response.body = result;
    
    await browser.close();
}
```

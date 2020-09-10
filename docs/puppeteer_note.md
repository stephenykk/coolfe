# puppeteer.js notes

## 简介
Puppeteer 是 Chrome开发团队2017年发布的一个 Node.js包，提供了一组用来操纵Chrome的API，通俗来说就是一个Headless Chrome浏览器，这Headless Chrome也可以配置成有UI的 。利用Puppeteer可以做到爬取页面数据，页面截屏或者生成PDF文件，前端自动化测试（模拟输入/点击/键盘行为）以及捕获站点的时间线，分析网站性能问题。


[w3cschool puppeteer教程](https://www.w3cschool.cn/puppeteer/)
[api](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageclickselector-options)

```js
const puppeteer = require('puppeteer')
https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageclickselector-options
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
puppeteer.launch().then(async browser = >{ // 存储节点以便能重新连接到 Chromium  
const browserWSEndpoint = browser.wsEndpoint();  // 从 Chromium 断开和 puppeteer 的连接  browser.disconnect();  // 使用节点来重新建立连接  
const browser2 = await puppeteer.connect({browserWSEndpoint});  // 关闭 Chromium  
await browser2.close();});
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
      value: 'system tokens', //你系统自己的token
      domain: 'domain' //需要种在哪个domain下
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



koa+puppeteer 截图
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

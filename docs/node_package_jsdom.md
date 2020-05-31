# jsdom 使用指南

## 安装

```bash
    cnpm i jsdom --save
```

## 基本用法

```js
// dom = new JSDOM(html, option?)

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// 解析html，返回dom
const dom = new JSDOM("<!doctype html><p> hello jsdom</p>");
console.log(dom.window.document.querySelector("p").textContent);
```

## option.runScripts

```js
// dangerously
const dom = new JSDOM(
  `
    <body>
        <script>
            document.body.appendChild(document.createElement('hr'));
        </script>
    </body>`,
  { runScripts: "dangerously" }
);

console.log(dom.window.document.body.children.length);
// outside-only
const window = new JSDOM("", { runScripts: "outside-only" }).window;
window.eval('document.body.innerHTML = "HELLO WORLD" ');

console.log(window.document.body.textContent);
```

## option.beforeParse

已经创建`window`, `document`, 还没有解析 dom 时的事件钩子

```js
    var dom = new JSDOM('<p>hello</p>', {
        beforeParse(window) {
            window.document.childNodes.length === 0;
            // can shim or do sth else..
            window.requestAnimationFrame = function() {..}
        }
    })
```

## option

`url, referrer, contentType` 这些选项，只会影响`document`, `navigator`相应属性的值(**eg: document.referrer**)，对于解析 html 没什么关系。

```js
    const dom = new JSDOM(``, {
      url: "https://example.org/", // document.URL, document.documentURI
      referrer: "https://example.com/", // document.refrerer
      contentType: "text/html", // document.contentType
      userAgent: "Mellblomenator/9000", // navigator.userAgent
      includeNodeLocations: true,
      pretendToBeVisual: true, // document.hidden, document.visibilityState, window.requestAnimationFrame
      resources: 'default', // or 'usable'
      beforeParse(window){..}
    });
```

## JSDOM.fromURL(url, option? = {referrer, userAgent})

```js
JSDOM.fromURL("http://www.baidu.com").then((dom) => {
  console.log(dom.serialize());
});
```

## JSDOM.fromFile(fpath, option?)

```js
JSDOM.fromFile("example.html").then((dom) => {
  console.log(dom.serialize());
});
```

## JSDOM.fragment(html)

仅仅解析 html 字符串，返回 domcumentFragment；没有 window 和 document

```js
const frag = JSDOM.fragment("<p>hello</p><p>world</p>");
frag.childeNodes.length === 2;
frag.querySelector("p").textContent = "hihi";
```

## jsdom.runVMScript(script)

```js
const dom = new JSDOM("", { runScripts: "outside-only" });
var vm = require("vm"); // vm为nodejs原生模块
const { Script } = vm;
var s = new Script(`
        if (!this.ran) {
            this.ran = 0;
        }
        ++this.ran;
    `);
dom.runVMScript(s);
dom.runVMScript(s);
console.log(dom.window.ran);
// 执行脚本的其他方式
// window.eval(..)  window.document.createElement('script');
```

## jsdom.VirtualConsole

虚拟 console

## jsdom.CookieJar

cookie

## dom.serialize()

```js
const dom = new JSDOM("<!doctype html>hello");
console.log(dom.serialize());
// 同上
console.log(dom.window.document.documentElement.outerHTML);
```

## dom.nodeLocation(node)

```js
const dom = new JSDOM('<p>hello <img src="foo.jpg"/></p>', {
  includeNodeLocations: true,
});

var p = dom.window.document.querySelector("p");
console.log(dom.nodeLocation(p));
```

## dom.reconfigure(setting)

略

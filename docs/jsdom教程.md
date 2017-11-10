jsdom使用指南
===

安装
---

    cnpm i jsdom --save

使用
---

###基本用法
`dom = new JSDOM(html, option?)`

    const jsdom = require('jsdom');
    const {JSDOM} = jsdom;

    // 解析html，返回dom
    const dom = new JSDOM('<!doctype html><p> hello jsdom</p>');
    console.log(dom.window.document.querySelector('p').textContent);

###option.runScripts
    // dangerously
    const dom = new JSDOM(`
    <body>
        <script>
            document.body.appendChild(document.createElement('hr'));
        </script>
    </body>`, {runScripts: 'dangerously'});

    console.log(dom.window.document.body.children.length);
    // outside-only
    const window = new JSDOM('', {runScripts: 'outside-only'}).window;
    window.eval('document.body.innerHTML = "HELLO WORLD" ');
    
    console.log(window.document.body.textContent);

###option.beforeParse
已经创建`window`, `document`, 还没有解析dom时的事件钩子

    var dom = new JSDOM('<p>hello</p>', {
        beforeParse(window) {
            window.document.childNodes.length === 0;
            // can shim or do sth else..
            window.requestAnimationFrame = function() {..} 
        }
    })

###option
`url, referrer, contentType` 这些选项，只会影响`document`, `navigator`相应属性的值(**eg: document.referrer**)，对于解析html没什么关系。

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

###jsdom.runVMScript(script)

    const dom = new JSDOM('', {runScripts: 'outside-only'});
    var vm = require('vm'); // vm为nodejs原生模块
    const {Script} = vm;
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

###JSDOM.fromURL(url, option? = {referrer, userAgent})

    
    JSDOM.fromURL('http://www.baidu.com').then(dom => {
        console.log(dom.serialize());
    });

###JSDOM.fromFile(fpath, option?)

    JSDOM.fromFile('example.html').then(dom => {
        console.log(dom.serialize());
    })

###JSDOM.fragment(html)
仅仅解析html字符串，返回domcumentFragment；没有 window 和 document

    const frag = JSDOM.fragment('<p>hello</p><p>world</p>');
    frag.childeNodes.length === 2
    frag.querySelector('p').textContent = 'hihi';


###jsdom.VirtualConsole
虚拟console

###jsdom.CookieJar
cookie


###dom.serialize()

    const dom = new JSDOM('<!doctype html>hello');
    console.log(dom.serialize());
    // 同上
    console.log(dom.window.document.documentElement.outerHTML);

###dom.nodeLocation(node)

    const dom = new JSDOM('<p>hello <img src="foo.jpg"/></p>', {includeNodeLocations: true});

    var p = dom.window.document.querySelector('p');
    console.log(dom.nodeLocation(p));

###dom.reconfigure(setting)


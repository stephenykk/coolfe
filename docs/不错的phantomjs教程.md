phantomjs教程
========

[教程链接](http://www.phperz.com/special/45.html)

简介
---
PhantomJS 是一个基于WebKit的服务器端 JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。PhantomJS可以用于页面自动化，网络监测，网页截屏，以及无界面测试等



linux下使用phantomjs的问题
---
### 字体乱码，中文变方块
linux下保存截图发现会乱码，则可以安装一下字体解决
`yum install bitmap-fonts bitmap-fonts-cjk`

### 中文字体大小不对
多安装几个中文字体，如安装simsun.ttf

    // 下载字体文件， 通过xshell的sftp,上传到 /usr/share/fonts
    sftp:> cd /usr/share/fonts
    sftp:> put  #上传文件
    回到xshell
    cd /usr/share/fonts
    > mkfontscale
    > mkfontdir
    > fc-cache -fv #刷新字体缓存
    > fc-list :lang=zh #查看中文字体
    > fc-match Arial -s #字体匹配方式..



安装
---
    
    npm install -g phantomjs-prebuilt

使用
---
用 `phantomjs` 执行 `xx.js` 文件, 如: `phantomjs hello.js`, 或者用 `node` 执行 `callHello.js`

### 示例
    
    // hello.js
    console.log('Hello Phantomjs');
    phantom.exit(0);

    // callHello.js
    var phantomjs = require('phantomjs-prebuilt');
    var program = phantomjs.exec('./hello.js', url);
    program.on('exit', code => console.log(code));


    // getPage.js
    var page = require('webpage').create();
    var system = require('system');
    var url = system.args[1];

    page.open(url, function(status) {
        if(status == 'success') {
            var content = page.evalute(function() {
                return document.querySelector('.content').innerHTML;
            });
            console.log(content);
        }else {
            console.log('fail to load url');
        }
    });

    // renderPage.js png or pdf
    var page = require('webpage').create();
    var system = require('system');
    var url = system.args[1];

    page.open(url, status => {
        if(status === 'success') {
            page.pageSize = {
                format: 'A4',
                orientation: 'portrait',
                border: '1cm'
            };
            page.viewportSize = {
                width: 750,
                height: 1000
            }

            page.render('test.png');
            page.render('test.pdf');
        }
    });


### 内置的包
+ webpage
+ system

### API
+ page.scrollPosition
+ page.pageSize
+ page.viewportSize
+ page.open(url, callback);
+ page.render(fname);
+ page.evalute(fn); // fn可以访问 window, document
+ page.onConsoleMessage
+ page.onLoadStarted
+ page.onResourceRequested
+ page.onResourceReceived
+ page.onLoadFinished
+ page.includeJs(jsUrl)
+ phantom.exit(exitCode);





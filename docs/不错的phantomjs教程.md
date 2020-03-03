phantomjs教程
========

[教程](http://www.phperz.com/special/45.html)

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
    phantomjs -v #查看版本
    phantomjs -h #查看帮助

使用
---
用 `phantomjs` 执行 `xx.js` 文件, 如: `phantomjs hello.js`, 或者用 `node` 执行 `callHello.js`

### 示例
Hello World

```js    
    // hello.js
    console.log('Hello Phantomjs');
    phantom.exit(0);
    // 命令行执行
    // > phantomjs hello.js
```

获取脚本参数  
```js
// > phantomjs arg.js foo bar baz

// arg.js
var system = require('system');
if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} else {
    system.args.forEach(function (arg, i) {
            console.log(i + ': ' + arg);
    });
}
phantom.exit();
```


页面加载，并保存为图片或pdf
```js
    //> phantomjs getpage.js https://www.baidu.com

    // getPage.js
    var page = require('webpage').create();
    var system = require('system');
    var url = system.args[1]; // https://www.baidu.com
    var start = Date.now();

    if(!url) {
        console.warn('Missing URL');
        phantom.exit(1);
    }

    page.open(url, function(status) {
        var diff = Date.now() - start;
        if(status == 'success') {
            console.log('use ', diff, ' ms');
            // page.render('baidu.png');
            page.pageSize = {
                format: 'A4',
                orientation: 'portrait',
                border: '1cm'
            };
            page.viewportSize = {
                width: 750,
                height: 1000
            }

            page.render('baidu.png'); // 整个页面的截图 不仅仅首屏
            page.render('baidu.pdf');

            phantom.exit(0);
        }else {
            console.log('FAIL TO LOAD URL');
            phantom.exit(1);
        }
    });
```

页面加载 打印页面html
```js
var page = require('webpage').create();
var system = require('system');
var url = system.args[1];

if(!url) {
	console.warn('Missing URL');
	phantom.exit()
}

page.open(url, function(status) {
	if(status === 'success') {
		console.log(page.content); // 打印页面html
	} else {
		console.log('Fail to load');
	}

	phantom.exit();
});


```

代码运算
```js
    // phantomjs evaluate.js https://www.baidu.com

    // evaluate.js
    var page = require('webpage').create();
    var system = require('system');
    var url = system.args[1];
    if (!url) {
        console.warn('miss url');
        phantom.exit();
    }

    page.open(url, function(status) {
        var title = page.evaluate(function() {
            console.log('log:', document.title); // evaluate回调内document可用

            // dom 操作
            var txt = document.querySelector('.qrcode-text').textContent
            console.log('txt:', txt);

            return document.title;
        });
        console.log('page title is ', title);
        phantom.exit()
    });

    page.onConsoleMessage = function(msg) {// 页面控制台的输出都会打印
        console.log('MSG:', msg);
    };
```

包含外部js
```js
// phantomjs includejs.js https://www.baidu.com

var page = require('webpage').create();
var system = require('system');
var url = system.args[1];

if(!url) {
	console.warn('Missing URL');
	phantom.exit()
}

page.open(url, function(status) {
	if(status === 'success') {
		page.includeJs('https://cdn.bootcss.com/lodash.js/4.17.15/lodash.js', function() {
			var result = page.evaluate(function() {
				$('#kw').val('cnblogs');
				$('#su').submit();
				var arr = _.map(['hello', 'world', 'me'], function(v) {
					return v + '-m';
				});

				return arr;
			});

			console.log('result ', result);

			page.viewportSize = {width: 750, height: 1200}
			// 等待搜索结果
			setTimeout(function() {
				page.render('cnblogs.png');

				phantom.exit()
				
			}, 1000);
		})
	} else {
		console.warn('Load URL Fail')
		phantom.exit();
	}
})
```


网络请求及响应
```js
var page = require('webpage').create();
var system = require('system');
var url = system.args[1];

if(!url) {
	console.warn('Missing URL');
	phantom.exit()
}

page.onResourceRequested = function(req) {
	console.log('request:', JSON.stringify(req, null , 4));
};

page.onResourceReceived = function(res) {
	console.log('response:', JSON.stringify(res, null, 4));
};

page.open(url);
```

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





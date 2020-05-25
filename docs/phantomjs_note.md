# phantomjs 教程

[不错的phantomjs教程](http://www.phperz.com/special/45.html)

## 简介

PhantomJS 是一个基于 WebKit 的服务器端 JavaScript API。它全面支持 web 而不需浏览器支持，其快速，原生支持各种 Web 标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。PhantomJS 可以用于页面自动化，网络监测，网页截屏，以及无界面测试等

## linux 下使用 phantomjs 的问题

### 字体乱码，中文变方块

linux 下保存截图发现会乱码，则可以安装一下字体解决
`yum install bitmap-fonts bitmap-fonts-cjk`

### 中文字体大小不对

多安装几个中文字体，如安装 simsun.ttf

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

## 安装

    npm install -g phantomjs-prebuilt
    phantomjs -v #查看版本
    phantomjs -h #查看帮助

## 使用

用 `phantomjs` 执行 `xx.js` 文件, 如: `phantomjs hello.js`, 或者用 `node` 执行 `callHello.js`

### 示例

Hello World  
phantomjs 会向当前代码运行环境注入 phantom 对象

```js
// hello.js
var system = require("system");
console.log("Hello Phantomjs"); // print to stdout
system.standarderr.write("some error test"); // print to stderr

phantom.exit(0);
// 命令行执行
// > phantomjs hello.js

// callHello.js
var phantomjs = require("phantomjs-prebuilt");

// child = phantomjs.exec(jsfile, arg1, arg2,..)
var childProcess = phantomjs.exec("hello.js");
childProcess.stdout.on("data", function(data) {
  // data is buffer
  console.log("GOT:", data.toString());
});
childProcess.stderr.on("data", function(data) {
  console.error("GOT ERR:", data.toString());
});

// > node callHello.js
```

获取脚本参数

```js
// > phantomjs arg.js foo bar baz

// arg.js
var system = require("system");
// system.args => [arg.js, foo, bar, baz]
if (system.args.length === 1) {
  console.log("Try to pass some args when invoking this script!");
} else {
  system.args.forEach(function(arg, i) {
    console.log(i + ": " + arg);
  });
}
phantom.exit();
```

页面加载，并保存为图片或 pdf

```js
//> phantomjs getpage.js https://www.baidu.com

// getPage.js
var page = require("webpage").create();
var system = require("system");
var url = system.args[1]; // https://www.baidu.com
var start = Date.now();

if (!url) {
  console.warn("Missing URL");
  phantom.exit(1);
}

page.open(url, function(status) {
  var diff = Date.now() - start;
  if (status == "success") {
    console.log("use ", diff, " ms");
    // page.render('baidu.png');
    page.pageSize = {
      format: "A4",
      orientation: "portrait",
      border: "1cm"
    };
    page.viewportSize = {
      width: 750,
      height: 1000
    };

    page.render("baidu.png"); // 整个页面的截图 不仅仅首屏
    page.render("baidu.pdf");

    phantom.exit(0);
  } else {
    console.log("FAIL TO LOAD URL");
    phantom.exit(1);
  }
});
```

页面加载 打印页面 html

```js
var page = require("webpage").create();
var system = require("system");
var url = system.args[1];

if (!url) {
  console.warn("Missing URL");
  phantom.exit();
}

page.open(url, function(status) {
  if (status === "success") {
    console.log(page.content); // 打印页面html
  } else {
    console.log("Fail to load");
  }

  phantom.exit();
});
```

代码运算

```js
// phantomjs evaluate.js https://www.baidu.com

// evaluate.js
var page = require("webpage").create();
var system = require("system");
var url = system.args[1];
if (!url) {
  console.warn("miss url");
  phantom.exit();
}

page.open(url, function(status) {
  var title = page.evaluate(function() {
    console.log("log:", document.title); // evaluate回调内document可用

    window === this; // true

    // dom 操作
    var txt = document.querySelector(".qrcode-text").textContent;
    console.log("txt:", txt);

    return document.title;
  });
  console.log("page title is ", title);
  phantom.exit();
});

page.onConsoleMessage = function(msg) {
  // 页面控制台的输出都会打印
  console.log("MSG:", msg);
};
```

nodejs 调用 phantom, 加载页面并执行代码

```js
// getCmps.js
var page = require("webpage").create();
var system = require("system");

function stdoutLog(data) {
  console.log(data);
}

function stderrLog(msg) {
  system.standarderr.write(msg);
}

var url = system.args[1];
page.open(url, function(status) {
  if (status === "success") {
    var outerArr = ["foo", "bar"]
    var result = page.evaluate(function getComponents(outerArr) {
      // can use outerArr here

      // evaluate callback 内的console.log是页面内的console.log, 通过 page.onConsoleMessage监听
      if (window.Topic && window.Vue) {
        Topic.install(Vue);
        return { ok: true, data: Object.keys(Vue.options.components) };
      } else {
        return { ok: false, msg: "没有全局变量Topic 或 Vue" };
      }
    }, outerArr);

    if (result.ok) {
      stdoutLog(result.data);
    } else {
      stderrLog(result.msg);
    }
  } else {
    stderrLog("获取url失败:" + url);
  }

  phantom.exit();
});

// callGetCmps.js
var callGetCmps = async function() {
    let topicUrl = `${this.config.assetsDomain}/topic/page/pantest.html`;
    let result = await new Promise(resolve => {
      let prog = phantomjs.exec(
        path.join(__dirname, "../utils/getTopicCmps.js"),
        topicUrl
      );
    
      prog.stdout.on("data", async data => {
        data = data.toString();
        // let cmplist = JSON.parse(data)
        resolve({ ok: true, data });
      });
    
      prog.stderr.on("data", data => {
        data = data.toString();
        this.logger.error(data);
        resolve({ ok: false, msg: data });
      });
    });
    console.log("result:", result);
}

callGetCmps()

// > node getCmp.js
```

包含外部 js

```js
// phantomjs includejs.js https://www.baidu.com

var page = require("webpage").create();
var system = require("system");
var url = system.args[1];

if (!url) {
  console.warn("Missing URL");
  phantom.exit();
}

page.open(url, function(status) {
  if (status === "success") {
    page.includeJs(
      "https://cdn.bootcss.com/lodash.js/4.17.15/lodash.js",
      function() {
        var result = page.evaluate(function() {
          // dom 操作
          $("#kw").val("cnblogs");
          $("#su").submit();

          // 使用外部js
          var arr = _.map(["hello", "world", "me"], function(v) {
            return v + "-m";
          });

          return arr;
        });

        console.log("result ", result);

        page.viewportSize = { width: 750, height: 1200 };
        // 等待搜索结果
        setTimeout(function() {
          page.render("cnblogs.png");

          phantom.exit();
        }, 1000);
      }
    );
  } else {
    console.warn("Load URL Fail");
    phantom.exit();
  }
});
```

网络请求及响应

```js
var page = require("webpage").create();
var system = require("system");
var url = system.args[1];

if (!url) {
  console.warn("Missing URL");
  phantom.exit();
}

page.onResourceRequested = function(req) {
  console.log("request:", JSON.stringify(req, null, 4));
};

page.onResourceReceived = function(res) {
  console.log("response:", JSON.stringify(res, null, 4));
};

page.open(url);
```

### window 对象

代码运行在 window 环境下

```js
console.log(window === this); // true
phantom.exit();
```

> 注：如果使用 web page 模块打开页面，则请不要在此 window 对象下进行任何 DOM 相关的操作，因为这个 window 并不是 page 对象内的 window。如果想要执行 dom 相关操作，用 page.evaluate() 。

### phantom 对象

- phantom.args  
   传给 js 脚本的参数数组 如
  ```js
      // 执行 phantomjs test.js foo bar
      // test.js
      phantom.args => ['foo', 'bar']
      var system = require('system')
      system.args => ['test.js', 'foo', 'bar']
  ```
- phantom.scriptName  
   获取脚本名称

- phantom.cookies
  获取或设置 cookies, 相关 api 有

  - phantom.addCookie(Object)
  - phantom.deleteCookie(cookieName)
  - phantom.clearCookies()
  - phantom.cookiesEnable 获取或设置是否支持 cookie

- phantom.injectJs(fileName)  
   把 指定的外部 JS 文件注入到当前环境。执行这个方法时，phantomjs 首先会从当前目录检索此文件，如果找不到，则再到 phantom.libraryPath 指定的路径寻找。 phantom.libraryPath 这个 API 基本上就是为 phantom.injectJs()服务的。
- phantom.onError  
   当页面存在 js 错误，且没有被 page.onError 处理，则会被此 handler 捕获。
  ```js
  phantom.onError = function(msg, trace) {
    var msgStack = ["PHANTOM ERROR: " + msg];
    if (trace && trace.length) {
      msgStack.push("TRACE:");
      trace.forEach(function(t) {
        msgStack.push(
          " -> " +
            (t.file || t.sourceURL) +
            ": " +
            t.line +
            (t.function ? " (in function " + t.function + ")" : "")
        );
      });
    }
    console.error(msgStack.join("\n"));
    phantom.exit(1);
  };
  ```
- phantom.exit(returnValue)  
   退出程序

### web page 模块

处理具体的页面

```js
var page = require("webpage").create();
```

page 对象的 api:

- page.cookies  
   类似 phantom.cookies, 其他 cookie 相关 api:
  - page.addCookie()
  - page.deleteCookie()
  - page.clearCookie()
- 页面内容相关 page.content, page.url
  - page.content String：获取或设置当前页面的 html。
  - page.plainText String：这是一个只读属性，获取页面去除 html 标记的文本（考虑 \$.text()）。
  - page.url String：只读，获取当前页面的 url。
  - page.setContent()：允许修改 page.content 和 page.url 内容，会触发 reload。
- page.settings Object  
   对于当前页面的一些配置项。此 API 必须在 page.open()调用之前设置，否则不会起作用。以下是配置项：
  - javascriptEnabled 默认 true：是否执行页面内的 javascript
  - loadImages 默认 true：是否载入图片
  - userAgent ：传递给服务器的 userAgent 字符串
  - userName ：用于 http 访问授权的用户名
  - password ：用于 http 访问授权的密码
  - XSSAuditingEnabled 默认 false：是否监控跨域请求
  - resourceTimeout 单位 ms：定义资源请求的超时时间。如果设置了此项，则页面中如果有任何资源超过此时限未请求成功，则页面其他部分也会停止请求，并触发 onResourceTimeout()事件处理。
- page.customHeaders Object  
   phantom 允许在请求时在 http 请求头部添加额外信息，此设置项对这个 page 里面所有的请求都生效（包含页面和其他资源的请求）。添加的信息并没有限制，但如果设置 User-Agent 的值，那么这个值会覆盖掉 page.settings 里的设置值。示例：
  ```js
  page.customHeaders = {
    "X-Test": "foo",
    DNT: "1"
  };
  ```
- page.libraryPath String  
   与 phantom.libraryPath 类似，page 对象也支持设置 js 文件路径，同时可以通过相应的 page.injectJs()方法注入 javascript 文件。除了 page.injectJs()方法外，还有 page.includeJs()也可以加入 javascript 文件。它们的区别在于， page.injectJs()不强求此文件能访问得到，即使是一个不可访问的资源也可以。

- page.navigationLocked Boolean  
   设置是否允许离开当前页面，默认是允许。

- page.open()  
   请求页面或接口，有三种调用形式：

  - page.open(url, callback)
  - page.open(url, method, callback)
  - page.open(url, method, data, callback)
    callback()会在页面载入完成后调用，由 page.onLoadFinished 调用（时机晚于 page.onLoadFinished）。这个 callback 会接受一个参数 status，可能值为 "success"和 "fail"，指示页面是否加载成功。

- page.close()  
   调用 page.close()之后，会释放 page 所占用的内存，我们不可以在此之后再调用 page 实例。实际使用中，常常会遇到将一个 page 实例反复 open 的情况。在一个页面用完后，记得一定要执行 page.close()，这样在下一次 open 的时候，才不会重复分配堆栈空间。

- page.evaluate(fn, [param])  
   对于 page 打开的页面，与其进行一些交互。  
   page.evaluate()提供了在 page 打开页面的上下文执行 function 的功能（类比 Chrome 开发者工具的控制台）。  
   如下例：

  ```js
  page.open("http://m.bing.com", function(status) {
    var title = page.evaluate(function(s) {
      return document.querySelector(s).innerText;
    }, "title");
    console.log(title);
    phantom.exit();
  });
  ```

  fn 允许有一个返回值 return，并且此返回值最终作为 page.evaluate()的返回值。对于整个 phantom 进程而言， page.evaluate()是跑在一个沙盒中， fn 无法访问一切 phantom 域中的变量；同样 page.evaluate()方法外部也不应该尝试访问 page 上下文中的内容。那么如果两个作用域需要交换一些数据，只能依靠 param 和 return。不过限制很大， param 和 return 必须为能够转化为 JSON 字符串，换言之，只能是基本数据类型或者简单对象，像 DOM 节点、\$对象、function、闭包等就无能为力了。

  这个方法是同步的，异步方法： page.evaluateAsync()。

- page.render(filename)  
   page.render()能够把当前页面渲染成图片并输出到指定文件中。输出的文件格式由传入的文件扩展名决定，目前支持 PNG、 JPEG、 GIF、 PDF。

  ```js
  var page = require("webpage").create();
  page.open("http://github.com/", function() {
    page.render("github.png");
    phantom.exit();
  });
  ```

  有其他一些 API 会对 page.render()产生影响，如：

  page.zoomFactor Number： 设置缩放比率  
   page.clipRect Object：设置输出的矩形区域，  
   例如：

  ```js
  page.clipRect = {
    top: 14,
    left: 3,
    width: 400,
    height: 300
  };
  ```

- page.renderBase64()，不详述。

- page.sendEvent()  
   为了交互的需要（测试的需要），phantom 允许通过代码模拟一些交互事件（注意与 DOM 事件的区分）。  
   鼠标事件：  
   _API： sendEvent(mouseEventType[, mouseX, mouseY, button='left'])_
  mouseEventtype 可能的取值为： 'mouseup'、 'mousedown'、 'mousemove'、 'doubleclick'和 'click'，这个参数为必须的。  
   后两个参数为鼠标事件的坐标位置。最后一个参数为鼠标按键，只对需要按键的事件有效，默认为 'left'，可能值为 'right'、 'left'、 'middle'。

  键盘事件：  
   _API： sendEvent(keyboardEventType, keyOrKeys, [null, null, modifier])_
  keyboardEventType 可能的取值为 'keyup'、 'keydown'、 'keypress'，第 2 个参数传入一个键值或一个字符串。键值可以通过 page.event.key 来查询调用。第三和第四个参数无效，  
   第五个参数表示同时按下的修饰键。取值情况如下：

  - 0: 未使用修饰键
  - 0x02000000: Shift 键被按下
  - 0x04000000: Ctrl 键被按下
  - 0x08000000: Alt 键被按下

  `page.sendEvent('keypress', page.event.key.A, null, null, 0x02000000 | 0x08000000);`

- page.switchToFrame(frameName/framePosition)  
   切换 page 到对应的 frame， 其他类似的方法还有:

  - switchToChildFrame()
  - switchToParentFrame()
  - switchToFocusedFrame()
  - switchToMainFrame()

- page.uploadFile(selector, file)  
   页面中常常会有上传文件的操作，但 phantom 没有界面，因而也就没有办法选择文件上传，通过此方法可以模拟文件上传操作。示例如下：
  ```js
  page.uploadFile("input[name=image]", "/path/to/some/photo.jpg");
  ```
- 一些事件捕获 page.onAlert page.onConsoleMessage

  - page.onAlert 捕获 alert。
  - page.onPrompt 捕获 prompt。
  - page.onConfirm 捕获 confirm。
  - page.onConsoleMessage 捕获 console 消息。

  ```js
  var webPage = require("webpage");
  var page = webPage.create();
  page.onAlert = function(msg) {
    console.log("ALERT: " + msg);
  };
  page.onPrompt = function(msg, defaultVal) {
    if (msg === "What's your name?") {
      return "PhantomJS";
    }
    // 返回值就是prompt得到的值
    return defaultVal;
  };
  page.onConfirm = function(msg) {
    console.log("CONFIRM: " + msg);
    // 返回true相当于点击“确定”，返回false相当于点击“取消”
    return true;
  };
  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log(
      "CONSOLE: " + msg + " (from line #" + lineNum + ' in "' + sourceId + '")'
    );
  };
  ```

- page.onInitialized：在 page 创建后触发。
- page.onUrlChanged：在 url 发生变化时触发。首次加载页面， page.onUrlChanged 是在 page.onInitialized 之后触发。
- page.onNavigationRequested

  ```js
  page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log("Trying to navigate to: " + url);
    console.log("Caused by: " + type);
    console.log("Will actually navigate: " + willNavigate);
    console.log("Sent from the page's main frame: " + main);
  };
  /*
  url表示要跳转到的url
  
  type表示产生跳转的原因，可能值有 'Undefined'、 'LinkClicked'、 'FormSubmitted'、 'BackOrForward'、 'Reload'、 'FormResubmitted'、 'Other'
  
  willNavigate表示是否会跳转，由 page.navigationLocked控制
  
  main表示发生跳转的是否是主frame
  */
  ```

- page.onLoadStarted：在开始载入资源时触发。

- page.onLoadFinished：页面所有资源载入完成后触发。其实与 page.open()的回调函数等价。它接受一个参数 status，表示加载是否成功。参见 page.open()。

- page.onClosing：当在 phantom 域调用 page.close()或 page 上下文调用 window.close()时触发。

- page.onError： 捕获所有 page 上下文发生的 javascript 错误。参数是错误信息和调用堆栈，参见 phantom.onError。如果 page 不处理错误，那么这些错误会冒泡到 phantom 的 onError 处理器。

- page.onCreate：当 page 创建子窗口时触发，例如在 page 上下文中使用 window.open，但是子窗口再创建子窗口不会触发此事件。

- page.onResourceRequested：当页面请求一个资源时触发的事件，

  ```js
  page.onResourceRequested = function(requestData, networkRequest) {
    /*
          requestData == {
              id: 资源请求编号
              method: http请求方法，get/post等
              url：请求的URL
              time: 一个Date object，包含响应接收的时间
              headers: http头部的信息列表
          }
  
          networkRequest == {
              abort()：中断当前的请求。这样做会触发onResourceError
              changeUrl(url)：改变当前请求的目标url
              setHeader(key, value)：修改/添加http头部信息
          }
      */
  };
  ```

- page.onResourceReceived： 当一个资源请求的响应接收到后触发此事件

  ```js
  page.onResourceReceived = function(response) {
    /*
          response == {
              id: 资源请求编号
              url：请求的URL
              time: 一个Date object，包含响应接收的时间
              headers: http头部的信息列表
              bodySize: 已接收到的数据大小（全部数据或已接收的部分数据）
              contentType: 指定的内容类型
              redirectURL: 如果是一个重定向响应，那么此处是重定向到的url
              stage: “start”/ “end”
              status: http状态码，如：200
              statusText: http状态描述，如：OK
          }
      */
  };
  ```

- page.onResourceError：当资源加载失败时，触发此事件。

  ```js
  page.onResourceError = function(resourceError) {
    console.log(
      "Unable to load resource (#" +
        resourceError.id +
        "URL:" +
        resourceError.url +
        ")"
    );
    console.log(
      "Error code: " +
        resourceError.errorCode +
        ". Description: " +
        resourceError.errorString
    );
  };
  ```

- page.onResourceTimeout：请求资源超时会触发此事件
  ```js
  page.onResourceTimeout = function(timeoutError) {
    /*
          timeoutError == {
              id : 资源请求编号
              method : http请求方法，get/post等
              url：请求的URL
              time : 一个Date object，包含响应接收的时间
              headers : http头部的信息列表
              errorCode：错误代码
              errorString：错误信息
          }
      */
  };
  ```

### 一些 API

- page.scrollPosition
- page.pageSize
- page.viewportSize
- page.open(url, callback);
- page.render(fname);
- page.evalute(fn); // fn 可以访问 window, document
- page.onConsoleMessage
- page.onLoadStarted
- page.onResourceRequested
- page.onResourceReceived
- page.onLoadFinished
- page.includeJs(jsUrl)
- phantom.exit(exitCode);

phantom 包含了若干模块：

- webpage
- system
- fs
- child_process
- webserver

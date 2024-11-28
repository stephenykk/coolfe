# web开发的趁手兵器Fiddler 

## Fiddler 是什么

Fiddler 是一个 http 调试代理工具，可以用来查看、修改、重发、保存客户端和服务器之间的 http 通讯，也可以用来测试网站性能，诊断网络问题。
Fiddler 充当客户端和服务器之间的中间人，客户端和服务器之间的Http通信都经过 Fiddler，从而可以查看和修改通信内容。

*中间人攻击也是采用相同的原理，即使是Https的请求，也可以被抓取和解密*  

> Fiddler只能抓取应用层的Http通信，如果要查看更底层的通信细节，可以用 white sharps，wireshark 等工具。


**Fiddler 可以抓取localhost域名下的网络请求**

## 捕获 http 通讯

- 打开 fiddler，点击 `file/capture traffic`，或者直接按 `F12`，开始捕获 http 通讯。
- 在 `session list` 中可以看到捕获到的 http 通讯。

## 查看请求和响应

- 在 `session list` 中，双击一个 session，可以看到该 session 的请求和响应。
- 在 `Inspectors` 中，可以看到请求和响应的详细信息，包括请求头、响应头、响应体等。

## 抓取手机上的 http 通讯
1. 设置允许远程设备连接

允许远程设备连接 `tools/fiddler options/connection/allow remote computers to connect`

2. 手机安装 fiddler 证书

手机浏览器打开 `yourIP:8888`


## 选择会话

- 任意多选 `ctrl + click` 
- 多选连续的会话 `shift + click`
- 向上/向下单选 `ctrl + up/down`
- 向上/向下连续多选 `ctrl + shfit + up/down`
- 反选会话 `ctrl + i`  *焦点先定位到 session list*
- 选择当前会话的父会话 `P`  *很实用的功能，比如选择一个 js, 按`P`，就会定位到触发该js请求的html请求*
- 选择当前会话的子会话 `C`  *同样实用：选择 html 请求，按`C`, 定位所有由该 html 请求触发的静态资源请求*

## 查找会话
`ctrl + f` 打开查找对话框，可以设置只查找请求或只查找响应，查找内容可以指定header或body, 基本上可以满足大部分需求。


## 会话对比

选择两个会话，右键 选择 `compare` 命令(*需安装对比工具 winMerge*),  对比成功和失败的两次请求，方便找出差异。

## 删除会话

- 删除选中会话 `delete` 
- 删除未选中会话 `shift + delete` *同先反选`ctrl+i`, 再删除*
- 删除所有会话 `ctrl + x` 


## 配置hosts
可以通过Fiddler配置DNS映射，这样就不必在C盘的hosts文件中修改了。  

Hosts配置位于菜单 `Tools/Hosts`

## quickbox
quickbox 是 fiddler 的一个工具栏，可以快速执行一些操作, 如: 查找会话，设置断点等。   

`alt + q` 光标定位到 quickExec。

- 查找会话  
  + 在url根据关键字查找 `? keyword` 
  + 根据content-type查找 `select image`, `select json`
  + 根据hostname查找 `@target Hostname`
  + 根据响应的status查找 `=304`
  + 根据请求方法查找 `=post`
  + 根据content-length查找 `>1000`
  + 根据域名查找 `@google`
  + 根据请求头查找`select @Request.Accept html`
  + 根据响应头查找 `select @Response.set-cookie domain`

- 高亮会话
  + 设置高亮url包含关键字的会话 `bold /app.js` *实用功能: 后续捕获的匹配会话也会被高亮*
  + 取消高亮  `bold`

- 过滤会话
  + 根据content-type过滤，`allbut image` 删除所有会话，image会话除外
  + 根据content-type过滤 `keeponly image` 只保留image会话, 作用同上

- 断点
  + 设置断点，断点类型为 before request, url包含baidu的请求都会被中断 `bpu baidu` 
  + 清除断点  `bpu` *bpu 不带参数，则表示清除断点*
  + 设置断点，断点类型为 after response, url包含baidu的响应都会被中断 `bpafter baidu` 
  + 清除断点  `bpafter` *bpafter 不带参数，则表示清除断点*
  + 执行断点 `go`  *在 inspector 面板修改请求/响应内容后继续执行*
  + 根据请求方法设置断点  `bpm POST`
  + 清除 bpm 断点  `bpm`
  + 根据响应状态码设置断点  `bps 404`
  + 清除 bps 断点  `bps`

- 修改请求url
  可以把请求url的域名修改为本地ip，方便调试
  + 设置url替换  `urlreplace www.dev.com localhost`
  + 清除url替换  `urlreplace`

- 删除所有会话
  + 清除所有会话 `cls`
  + 清除所有会话 `clear`

## 构造请求
可以全新创建请求，或基于现有session创建请求

- compose 面板中，手动创建所有的请求参数
- 拖一个 session 到 compose 面板中，修改并发送改请求
- 按住`shift`, 点击 execute 按钮 , 会在请求发出前断点，允许再次修改

## autoResponder 自动响应

从左侧拖一个 session 到 autoresponder 中，默认会自动创建匹配规则和响应内容   

> 基于session创建的autoresponse, 默认规则精确匹配(EXACT:the-url)，默认响应为该 session 的 response(\*200-SESSION-6)   

用户可修改匹配规则，亦可修改响应内容，在 rule list 中选择该 rule, 按`enter`编辑响应内容。

**自动响应的匹配规则**  

- 普通字符串，匹配URL包含该字符串的请求 `hello.com`
- NOT:普通字符串，匹配URL不包含该字符串的请求 `NOT: hello.com`
- 通配符匹配所有请求 `*` 
- 精确匹配，URL完全相同的请求 `EXACT: http://localhost/test.php?foo=BAR`
- 正则匹配 `regex:(?inxs)http://localhost/\w+\.php` , `regex:.+(gif|png|jpg)$`
  正则修饰符:  
  + `i` _ignore case_ 忽略大小写
  + `n` _requires explicit capture groups_ 要求明确的捕获组
  + `s` _enables single-line syntax_ 单行
  + `x` _enables comments after the #character_ 支持# 后加注释

**自动响应的内容**  

- 本地文件
- `http://targetUrl` 重定向到目标url
- `*redir:http://targetUrl`
- `*bpu` 请求前断点
- `*bpafter` 响应前断点
- `*delay: Xms` 延迟发出请求
- `*header: hi=hello` 修改/新增请求头
- `*CORSPreflightAllow` 返回允许跨域的 header
- `*reset` Reset the client connection
- `*drop` close the client connection
- `*exit` 该规则什么都不做,让后续规则处理

**自动响应示例**  
将正则规则捕获到的参数，应用到目标 url
```shell
    rule: regex:youdao\.com(.\*)
    action: http://localhost/test.php$1
```


## FiddlerScript


Fiddler Script 是用 JScript.NET 语言写的，可以自动修改 Request 和 Response. 这样我们就无需手动设置"断点"。

> Fiddler Script实际上它是一个脚本文件 CustomRules.js ，保存在 C:\Users\sea\Documents\Fiddler2\Scripts\CustomRules.js

打开 Fiddler Script， 点击菜单 `Rules->Customize Rules` 或者 `ctrl + r`

### 主要方法

```js
    // 在这个方法中修改Request的内容， 我们用得最多,
    static function OnBeforeRequest(oSession: Session)



    // 在这个方法中修改Response的内容，
    static function OnBeforeResponse(oSession: Session)

```

### 常用对象和方法

fiddlerScript Editor 有智能提示

**对象**

- oSession  
   `oSession.url`, `oSession.fullUrl`, `oSession.host`, `oSession.hostname`, `oSession.oRequest`, `oSession.oResponse`, `oSession.HostNameIs()`, `oSession.uriContains()`

- FiddlerObject  
   `FiddlerObject.log()`

**方法**

- 字符串处理方法  
   `replace()`, `indexOf()`, `substring()`

### 例子

高亮请求 和 打印日志

```js
    function onBeforeRequest(oSession) {
        if(oSession.HostNameIs('www.cnblogs.com')) {
            oSession['ui-color'] = 'red'

            FiddlerObject.log(oSession.url) // 不带 http://
            FiddlerObject.log(oSession.fullUrl) // 带 http://
        }
    }
```

添加/删除 请求头

```js
    function OnBeforeRequest(oSession) {
        oSession.oRequest['x-hi'] = 'hello';
        oSession.RequestHeaders.Add('foo', 'foolish');
        oSession.RequestHeaders.Remove('Cache-Control'); // 删除请求头
        // or use oRequest
        oSession.oRequest.headers.Add('foo', 'foolish');
        oSession.oRequest.headers.Remove('Cache-Control');
    }
```

添加响应头部 支持 CORS

```js
    function onBeforeResponse(oSession) {
        if(oSession.HostNameIs('www.test.com')) {
            oSession.ResponseHeaders.Add('Access-Control-Allow-Origin', 'http://10.66.51.87:9091')
        }
    }
```

将请求重定向到其他主机

```js
    function OnBeforeRequest(oSession) {
        if(oSession.HostnameIs('test.com')) {
            // test.com:90/foo/bar -> localhost:90/foo/bar
            oSession.hostname = 'localhost';
        }

        if(oSession.host == 'foo.com:90') {
            oSession.host = 'bar.com:9012'; // host == hostname:port
        }

        if(oSession.fullUrl.indexOf('http://www.foo.com') == 0) {
            oSession.fullUrl = oSession.fullUrl.replace('http://www.foo.com', 'https://www.bar.com')
        }
    }
```

将一个 url 重定向到另外的 url

```js
    function OnBeforeRequest(oSession) {
        if(oSession.url == 'example.com/test.js') {
            // oSession.url 不包括protocol
            oSession.url = 'localhost.com/mock-test.js';
        }
    }
```

取消发送 cookie

```js
    function OnBeforeRequest(oSession) {
        oSession.oRequest.headers.Remove('Cookie');
    }
```

替换 html 文件的内容

```js
    function OnBeforeResponse(oSession) {
        if(oSession.HostnameIs('www.test.com') && oSession.oResponse.headers.ExistsAndContains('Content-type', 'text/html')) {
            var body = oSession.GetResponseBodyAsString();
            body = body.replace('foo', 'bar');
            oSession.utilSetResponseBody(body);
        }
    }
```

替换 json 文件的内容

```js
    function OnBeforeResponse(oSession) {
        if(oSession.HostnameIs('www.test.com') && oSession.oResponse.headers.ExistsAndContains('Content-type', 'application/json')) {
            var body = oSession.GetResponseBodyAsString();
            var json = JSON.parse(body);
            json.name = 'bar';
            oSession.utilSetResponseBody(JSON.stringify(json));
        }
    }
```

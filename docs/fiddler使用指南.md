fiddler使用指南
=============

fiddler 设置
-------
如果要手机抓包的话，需要设置fiddler, 允许远程设备连接 **tools/fiddler options/connection/allow remote computers to connect**

监控http通讯
-----------
开启/停止监控 
- `F12`
- *file/Capture traffic*
- quickExec box `start/stop`

选择会话
- `ctrl + click` 多选
- `shift + click` 选择连续的会话
- `ctrl + up/down` 向上/向下选择
- `ctrl + i` 反选会话 //焦点先定位到 session list
- `P` 选择当前会话的父会话 //对前端而言，比如选择一个js, 按`P`，就会定位到html文件
- `C` 选择子会话 //选择html文件，按`C`, 定位所有由该html发起的请求, 其实很有用 

查找会话
- `ctrl + f`
- quickExec box `? keyword` , `select image`, `@targetHostnmae`, `=304`

会话对比
选择两个会话，点击右键-compare(**需安装对比工具winMerge**), 这很有用(*两个请求，1个成功返回， 1个报错或被重定向了，这时可以对比两个session*)

删除会话
- `delete` 删除选中会话
- `shift + delete` 删除未选中会话
    这个其实蛮实用，比如我选中了 所有的图片session(select image) 然后想删掉其余的session, 减少干扰, `shift + delete`就很方便了(当然也可以先反选再delete)。
- `ctrl + x` 删除所有会话
- quickExec box `cls/clear` 删除所有会话

会话列表添加列
- quickExec `cols add accept @request.Accept`
- 在列标题点击右键, 选择 custom column

构造http请求
---------
- compose面板中，完全手动创建
- 拖一个session到compose面板中，修改并发送改请求
- 按住`shift`, 点击 execute按钮 , 会在请求发出前断点，允许再次修改


autoResponder自动响应
----------
从左侧拖一个session到autoresponder中，默认会自动创建规则 精确匹配(EXACT:the-url)，响应为该session的response(\*200-SESSION-6) *如果什么都不改，就是replay的效果*；可以在rule list中选择该rule, 按`enter`编辑响应内容, **非常实用的说**

自动响应的规则定义
- 普通字符串   `hello.com` // 匹配url包含 hello.com 的
- 通配符 `*`  // 匹配所有url
- `NOT: hello`  // 匹配url不包含hello的
- `EXACT: http://localhost/test.php?foo=BAR`  //精确匹配 包括大小写
- 正则 `regex:(?inxs)http://localhost/\w+\.php`
    如: `regex:.+`, `regex:.+jpg`, `regex:.+(gif|png|jpg)$`  
    正则支持修饰符 `inxs` 
    + `i` *ignore case*  忽略大小写
    + `n` *requires explicit capture groups* 要求明确的捕获组
    + `s` *enables single-line syntax* 单行
    + `x` *enables comments after the #character* 支持#后加注释

自动响应的内容
- 本地文件
- `http://targetUrl` 重定向到目标url(*原来的请求参数并无带过去*)
- `*redir:http://targetUrl`
- `*bpu`  请求前断点
- `*bpafter` 响应前断点
- `*delay: Xms` 延迟发出请求
- `*header: hi=hello` 修改/新增请求头
- `*CORSPreflightAllow` 返回允许跨域的header
- `*reset` Reset the client connection
- `*drop` close the client connection
- `*exit` 该规则什么都不做,让后续规则处理

实例: 将正则规则捕获到的参数，应用到目标url

    rule: regex:youdao\.com(.\*)
    action: http://localhost/test.php$1


quickExec
--------------
聚焦到quickExec box上: `ctrl + alt + f` 显示fiddler, `alt + q` 光标定位到quickExec, 此时如果session list中有选中，`ctrl + i` 可将选中会话的url粘贴到命令行中.

- `? hello` 搜索url包含 hello 的会话  
- `> 2000` 查询 content-length > 2kb的会话,  同 `>2k`
- `< 2000`
- `=301` 查询 statusCode=301的会话
- `=get` 查询 method=get的会话
- `@localhost` 查询hostname=localhost的会话
- `bold hello` 若后续的session的url包含hello,则加粗显示 **很实用**
- `bold` 不带参数 则清除之前的设定
- `bpafter api/get/user` 在匹配的session响应前断点
- `bpafter` 清除之前bpafter的断点
- `bps 302` 若session的statusCode=302 则断点 `bps` 清除断点
- `bpu hello` 若请求的url包含hello，则断点； `bpu` 清除断点
- `bpm post` 若method为post, 则请求前断点; 同 `bpv post`  `bpm` 清除断点
- `cls or clear` 清除session列表
- `g or go` 继续执行断点
- `help` 打开帮助网页
- `urlreplace findstr replacestr` 在url中找到匹配字符串，则替换；*似乎不支持正则*
- `start` 开始监听http请求
- `stop` 停止监听http请求
- `select image` 查询content-type，匹配关键字则选中响应session, `select html` `select javascript`
- `select ui-comments hello`
- `select @Request.Accept html`
- `select @Response.set-cookie domain`
- `allbut html` 同 `keeponly html` 只保留content-type匹配html的会话 **实用**
- `quit` 退出fiddler
- `!dns www.hello.com` 发起dns解析请求

fiddlerScript
------------
### 简介
Fiddler Script 是用JScript.NET语言写的。   

Fiddler 包含了一个脚本文件可以自动修改Http Request 和Response. 这样我们就不需要手动地下"断点"去修改了，实际上它是一个脚本文件CustomRules.js ，位于: C:\Users\sea\Documents\Fiddler2\Scripts\CustomRules.js 下。

> 打开CustomRules.js文件，点击菜单Rules->Customize Rules 或者 ctrl + r


### 主要方法

```
    // 在这个方法中修改Request的内容， 我们用得最多,
    static function OnBeforeRequest(oSession: Session)

     

    // 在这个方法中修改Response的内容，
    static function OnBeforeResponse(oSession: Session)

```

### 常用对象和方法
fiddlerScript Editor有智能提示

**对象**
- oSession  
    `oSession.url`, `oSession.fullUrl`, `oSession.host`, `oSession.hostname`,  `oSession.oRequest`, `oSession.oResponse`, `oSession.HostNameIs`    

- FiddlerObject  
    `FiddlerObject.log`

**方法**
- 字符串处理方法  
    `replace()`, `indexOf()`, `substring()`

### 例子

高亮请求 和 打印日志

```
    function onBeforeRequest(oSession) {
        if(oSession.HostNameIs('www.cnblogs.com')) {
            oSession['ui-color'] = 'red'

            FiddlerObject.log(oSession.url) // 不带 http://
            FiddlerObject.log(oSession.fullUrl) // 带 http://
        }
    }
```

添加/删除 请求头

```
    function OnBeforeRequest(oSession) {
        oSession.oRequest['x-hi'] = 'hello';
        oSession.RequestHeaders.Add('foo', 'foolish');
        oSession.RequestHeaders.Remove('Cache-Control'); // 删除请求头
        // or use oRequest
        oSession.oRequest.headers.Add('foo', 'foolish');
        oSession.oRequest.headers.Remove('Cache-Control');
    }
```

添加响应头部 支持CORS

```
    function onBeforeResponse(oSession) {
        if(oSession.HostNameIs('www.test.com')) {
            oSession.ResponseHeaders.Add('Access-Control-Allow-Origin', 'http://10.66.51.87:9091')
        }
    }
```

将请求重定向到其他主机

```
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

将一个url重定向到另外的url

```
    function OnBeforeRequest(oSession) {
        if(oSession.url == 'example.com/test.js') {
            // oSession.url 不包括protocol
            oSession.url = 'localhost.com/mock-test.js';  
        }
    }
```

取消发送cookie

```
    function OnBeforeRequest(oSession) {
        oSession.oRequest.headers.Remove('Cookie');
    }
```

替换html文件的内容

```
    function OnBeforeResponse(oSession) {
        if(oSession.HostnameIs('www.test.com') && oSession.oResponse.headers.ExistsAndContains('Content-type', 'text/html')) {
            
        }
    }
```


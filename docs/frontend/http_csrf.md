http csrf 攻击
===


[CSRF 详解与攻防实战](https://segmentfault.com/a/1190000006963312)


---

CSRF与XSS的异同：

相同:
在攻击手段上有点类似，都是在客户端执行恶意代码。

差异：
1. 源站攻击
  CSRF不仅可以在源站发起攻击，还可以引导用户访问其他危险网站，触发对源站的请求从而发起攻击；    
  XSS主要是在源站发起攻击。

  > XSS全称是跨站脚本攻击 即攻击者向某个Web页面中插入恶意的JavaScript脚本，而当普通用户访问时，该恶意脚本自动执行而从盗取用户的Cookie等信息。

  对于XSS的防御手段主要就是输入检查与输出检查，譬如对用户输入的文本框内容进行<、>这样的特殊字符检查。而输出检查则是指对于输出到网页的内容进行过滤或者编解码，譬如使用HTML编码将<转义。

2. 依赖JS
  CSRF不一定依赖于JavaScript;  
  XSS都需要执行javascript

3. 恶意代码位置  
   XSS攻击要求站点接受恶意代码，而对于CSRF攻击来说，恶意代码位于第三方站点上。过滤用户的输入可以防止恶意代码注入到某个站点，但是它无阻止法恶意代码在第三方站点上运行。

CSRF攻击是源于WEB的隐式身份验证机制，WEB的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却无法保证该请求是用户批准发送的。 

![csrf攻击过程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfbb3cd67fce464c8e9bffa9cb652c31~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

防范措施：
- cors不要设置 `access-control-allow-origin: *` 应该设置具体的可信域名，因为csrf攻击的恶意网站，用JS发起的请求是跨域请求
- 种cookie时，设置sameSite: strict / lax 和 httpOnly
  使用 SameSite 严格模式的缺点
    新标签重新打开也不携带 Cookie，需要用户重复登录
    二级域名无法共享 Cookie，需要用户重复登录
- 验证 HTTP Referer 字段, 通过referer判断是否来自可信网站的请求
  使用referer防范 CSRF 应当注意：
    + 请求发起者可以设置不携带 Referer，重定向也不会携带 Referer
    + Referer 由浏览器携带，也可能由于浏览器的实现差异导致问题，或者因为浏览器安全漏洞导致被篡改。
- 使用验证码校验
  对于重要操作如支付来说，可以使用验证码验证用户身份。
- CSRF Token
  在验证用户流程中多加个 CSRF Token 的验证，判断 Cookie 是否来自用户网站。那么第三网址发起的请求虽然携带 Cookie 但是获取不到用户网站的 CSRF Token，就可以在服务端设置拦截。

**CSRF检测工具：CSRFTester**


利用漏洞发起的跨站脚本攻击（XSS）比任何 CSRF 漏洞的风险都高，因为 CSRF 攻击有一个很大的限制，它只能引起状态变更，这使得攻击者无法收到 HTTP 响应的内容

诱骗受害者发起 POST 请求可能稍微困难一些。使用 GET 请求时，攻击者只需让受害者访问一个带有所有必要信息的 URL。而使用 POST 请求时，必须将请求体附加到请求中。不过攻击者可以设计一个带有 JavaScript 的网站，只要加载该网页就使用户浏览器发送未经授权的 POST 请求。

```js
<body onload="document.csrf.submit()">
  <form action="http://example.com/transfer" method="POST" name="csrf">
    <input type="hidden" name="amount" value="1000000" />
    <input type="hidden" name="account" value="Fred" />
  </form>
</body>

// 攻击者也可以通过设置相关属性使 IFrame 隐藏，从而发起攻击。
```
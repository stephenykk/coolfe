# vue ssr

什么是服务器端渲染 (SSR)？

在服务器端将组件渲染为的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器端渲染 (SSR) 的优势

- 更好的 SEO
- 更快的内容到达时间 (time-to-content)


> Google 和 Bing 可以很好对同步 JavaScript 应用程序进行索引

服务器端渲染的注意点：
- 浏览器相关的API和生命周期钩子，需特殊处理
- 额外的构建配置和部署
- 占用更多的服务器CPU计算资源，*加机器 配置缓存策略*

服务器端渲染 vs 预渲染 (SSR vs Prerendering)

- SSR 运行时，web服务器实时编译出html
- Prerendering 构建时，针对特定路由生产html文件

> 如果你使用 webpack，你可以使用 prerender-spa-plugin 轻松地添加预渲染。 *based on puppeteer or PhantomJS*
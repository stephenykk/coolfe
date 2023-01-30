# qiankun notes
[微前端 | 1. qiankun 基本用法](https://zhuanlan.zhihu.com/p/143728194?from_voters_page=true)

single-spa 和 qiankun 都是微前端框架，qiankun 本身就是基于 single-spa 做了二次开发。

具体来讲，single-spa 解决了以应用为维度的路由，应用的注册，监听，最重要的是赋予了应用生命周期和生命周期相关事件

qiankun 继承了这些特性，在其基础上增加了 js 沙箱、样式隔离、HTML Loader、预加载 等微前端系统所需的能力。

> qiakun 升级 2.0 后，支持多个微应用的同时加载，有了这个特性，我们基本可以像接入 iframe 一样方便的接入微应用。


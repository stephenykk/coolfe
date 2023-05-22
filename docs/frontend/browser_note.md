浏览器渲染机制
===

[requestAnimationFrame 刨根问底](https://cloud.tencent.com/developer/article/1775181)
[浅谈浏览器多进程与JS线程](https://segmentfault.com/a/1190000037526686) *非常全面的文章*
[Event Loop 和 JS 引擎、渲染引擎的关系](https://cloud.tencent.com/developer/article/1842244?from=article.detail.1728745) *带深入扩展*
[JavaScript 运行机制详解：再谈Event Loop](https://cloud.tencent.com/developer/article/1094232?from=article.detail.1843624) 


[preload与prefetch的使用和区别](https://www.jianshu.com/p/8920dc078689)

---

总结下运行机制：

执行一个宏任务（栈中没有就从事件队列中获取）
执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）



preload 和 prefetch 的区别

preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源。
prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源。
在VUE SSR生成的页面中，首页的资源均使用preload，而路由对应的资源，则使用prefetch。
对于当前页面很有必要的资源使用 preload，对于可能在将来的页面中使用的资源使用 prefetch。

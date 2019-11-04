h5 web worker
===
简介
---
[web worker简介](https://www.cnblogs.com/stephenykk/p/8608450.html)

有别于Java/C#等编程语言，Javascript运行在一个单线程环境中，对setTimeout/setInterval、ajax和dom事件的异步处理是依赖事件循环实现的。


Web Worker是什么
---
Web Worker 是HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中。Web Worker 规范中定义了两类工作线程，分别是专用线程Dedicated Worker和共享线程 Shared Worker，其中，Dedicated Worker只能为一个页面所使用，而Shared Worker则可以被多个页面所共享

![worker 线程执行流程](https://upload-images.jianshu.io/upload_images/2898168-e1c751121bf52723.png?imageMogr2/auto-orient/strip|imageView2/2/w/826/format/webp)

worker线程数据通讯方式
---
主线程与子线程数据通信方式有多种，通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是地址，子线程对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给子线程，后者再将它还原。

主线程与子线程之间也可以交换二进制数据，比如File、Blob、ArrayBuffer等对象，也可以在线程之间发送。但是，用拷贝方式发送二进制数据，会造成性能问题。比如，主线程向子线程发送一个50MB文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript允许主线程把二进制数据直接转移给子线程，转移后主线程无法再使用这些数据，这是为了防止出现多个线程同时修改数据的问题，这种转移数据的方法，叫做Transferable Objects。


```js
// Create a 32MB "file" and fill it.
var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
for (var i = 0; i < uInt8Array .length; ++i) {
    uInt8Array[i] = i;
}
worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);
```

API
---
在worker线程中，可以获得下列对象

- navigator对象
- location对象，只读
- XMLHttpRequest对象
- setTimeout/setInterval方法
- Application Cache
- 通过importScripts()方法加载其他脚本
- 创建新的Web Worker

worker线程不能获得下列对象

- DOM对象
- window对象
- document对象
- parent对象


```js
var worker = new Worker('task.js');
// 发送消息给worker
worker.postMessage({hello: 'worker'})
// 收到worker发来的消息
worker.onmessage = function(event) {
    console.log(event.data); // {hello: 'main'}
}
worker.onerror=function(error){
    console.log(error.filename,error.lineno,error.message);
}
// worker会随着页面关闭而结束，也可主动结束
worker.terminate();
```

task.js

```js
// 全局对象为self
// 收到主线程的消息 self.onmessage = fn
onmessage = function(event) {
    console.log(event.data); // {hello: 'worker'}
}
// 发消息给主线程 self.postMessage()
postMessage({hello: 'main'})

// 关闭自己
self.close()
```

Web Worker带来了什么
---
最后来总结Web Worker为javascript带来了什么，学习过程中，看到一些文章认为Web Worker为Javascript带来了多线程编程能力，我不认可这种观点。

Web Worker带来后台计算能力
---
Web Worker自身是由webkit多线程实现，但它并没有为Javasctipt语言带来多线程编程特性，我们现在仍然不能在Javascript代码中创建并管理一个线程，或者主动控制线程间的同步与锁等特性。
在我看来，Web Worker是worker编程模型在浏览器端Javascript语言中的应用。浏览器的运行时,同其他GUI程序类似，核心逻辑像是下面这个无限循环:

```js
while(true){  
    1 更新数据和对象状态  
    2 渲染可视化UI  
}
```

在Web Worker之前，Javascript执行引擎只能在一个单线程环境中完成这两项任务。而在其他典型GUI框架，如前文Swing库中，早已引入了Swing Worker来解决大量计算对UI渲染的阻塞问题。Web Worker的引入，是借鉴了worker编程模型，给单线程的Javascript带来了后台计算的能力。



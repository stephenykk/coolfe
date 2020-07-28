# h5 web worker

## 简介

[web worker 简介](https://www.cnblogs.com/stephenykk/p/8608450.html)

有别于 Java/C#等编程语言，Javascript 运行在一个单线程环境中，对 setTimeout/setInterval、ajax 和 dom 事件的异步处理是依赖事件循环实现的。

## Web Worker 是什么

Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。Web Worker 规范中定义了两类工作线程，分别是专用线程 Dedicated Worker 和共享线程 Shared Worker，其中，Dedicated Worker 只能为一个页面所使用，而 Shared Worker 则可以被多个页面所共享

![worker 线程执行流程](https://upload-images.jianshu.io/upload_images/2898168-e1c751121bf52723.png)

## worker 线程数据通讯方式

主线程与子线程数据通信方式有多种，通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是地址，子线程对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给子线程，后者再将它还原。

主线程与子线程之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等对象，也可以在线程之间发送。但是，用拷贝方式发送二进制数据，会造成性能问题。比如，主线程向子线程发送一个 50MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，转移后主线程无法再使用这些数据，这是为了防止出现多个线程同时修改数据的问题，这种转移数据的方法，叫做 Transferable Objects。

```js
// Create a 32MB "file" and fill it.
var uInt8Array = new Uint8Array(1024 * 1024 * 32); // 32MB
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i;
}
worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);
```

## API

在 worker 线程中，可以获得下列对象

- navigator 对象
- location 对象，只读
- XMLHttpRequest 对象
- setTimeout/setInterval 方法
- Application Cache
- 通过 importScripts()方法加载其他脚本
- 创建新的 Web Worker

worker 线程不能获得下列对象

- DOM 对象
- window 对象
- document 对象
- parent 对象

```js
var worker = new Worker("task.js");
// 发送消息给worker
worker.postMessage({ hello: "worker" });
// 收到worker发来的消息
worker.onmessage = function (event) {
  console.log(event.data); // {hello: 'main'}
};
worker.onerror = function (error) {
  console.log(error.filename, error.lineno, error.message);
};
// worker会随着页面关闭而结束，也可主动结束
worker.terminate();
```

task.js

```js
// 全局对象为self
// 收到主线程的消息 self.onmessage = fn
onmessage = function (event) {
  console.log(event.data); // {hello: 'worker'}
};
// 发消息给主线程 self.postMessage()
postMessage({ hello: "main" });

// 关闭自己
self.close();
```

## Web Worker 带来了什么

最后来总结 Web Worker 为 javascript 带来了什么，学习过程中，看到一些文章认为 Web Worker 为 Javascript 带来了多线程编程能力，我不认可这种观点。

## Web Worker 带来后台计算能力

Web Worker 自身是由 webkit 多线程实现，但它并没有为 Javasctipt 语言带来多线程编程特性，我们现在仍然不能在 Javascript 代码中创建并管理一个线程，或者主动控制线程间的同步与锁等特性。
在我看来，Web Worker 是 worker 编程模型在浏览器端 Javascript 语言中的应用。浏览器的运行时,同其他 GUI 程序类似，核心逻辑像是下面这个无限循环:

```js
while(true){
    1 更新数据和对象状态
    2 渲染可视化UI
}
```

在 Web Worker 之前，Javascript 执行引擎只能在一个单线程环境中完成这两项任务。而在其他典型 GUI 框架，如前文 Swing 库中，早已引入了 Swing Worker 来解决大量计算对 UI 渲染的阻塞问题。Web Worker 的引入，是借鉴了 worker 编程模型，给单线程的 Javascript 带来了后台计算的能力。

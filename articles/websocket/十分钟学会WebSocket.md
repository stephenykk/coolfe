# 十分钟学会 WebSocket

> 原文地址[十分钟学会 WebSocket - 掘金](https://juejin.cn/post/7317463986014453797)

## WebSocket 简介

WebSocket 是一种在客户端和服务器之间实现双向通信的网络协议。它通过在单个 TCP 连接上提供全双工通信功能，使得服务器可以主动向客户端推送数据，而不需要客户端发起请求。

## WebSocket 与 HTTP 的区别

与传统的 HTTP 协议相比，WebSocket 具有以下几个显著的区别：

-   **双向通信**：WebSocket 支持客户端和服务器之间的实时双向通信，而 HTTP 协议是单向请求-响应模式。
-   **低延迟**：由于 WebSocket 使用长连接，避免了 HTTP 的连接建立和断开过程，可以降低通信延迟。
-   **更少的数据传输**：WebSocket 头部信息相对较小，减少了数据传输的开销。
-   **跨域支持**：WebSocket 可以轻松跨域，而 HTTP 需要通过 CORS 等机制来实现。

## WebSocket 的工作原理

WebSocket 的握手过程和 HTTP 有所不同。客户端通过发送特定的 HTTP 请求进行握手，服务器收到请求后进行验证，如果验证通过，则会建立 WebSocket 连接。

建立连接后，客户端和服务器之间可以通过 WebSocket 发送和接收消息，可以使用文本、二进制数据等进行通信。

## WebSocket 的应用场景

WebSocket 的实时双向通信特性使得它在许多应用场景中发挥重要作用，例如：

-   **即时聊天**：WebSocket 可以实现实时的聊天功能，用户可以发送和接收消息，实现快速、低延迟的聊天体验。
-   **实时数据更新**：对于需要实时更新数据的应用，如股票行情、实时监控等，WebSocket 可以将数据实时推送给客户端，确保数据的及时更新。
-   **在线游戏**：在线游戏需要实时的双向通信，WebSocket 可以提供稳定的通信通道，支持实时交互和多人游戏。

## WebSocket 的使用

以下是使用 JavaScript 与 WebSocket 建立连接的示例代码：

```javascript
var Socket = new WebSocket("url, [protocol]");
```

以上代码中的第一个参数`url`, 指定连接的 URL。第二个参数`protocol`是可选的，指定了可接受的子协议。

#### WebSocket 属性

以下是 WebSocket 对象的属性。

| 属性                  | 描述                                                                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Socket.readyState     | 只读属性 readyState 表示连接状态，可以是以下值：0-表示连接尚未建立。1-表示连接已建立，可以进行通信。2-表示连接正在进行关闭。3-表示连接已经关闭或者连接不能打开。 |
| Socket.bufferedAmount | 只读属性 bufferedAmount 已被 send()放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。                                                                   |

-   0-表示连接尚未建立。
-   1-表示连接已建立，可以进行通信。
-   2-表示连接正在进行关闭。
-   3-表示连接已经关闭或者连接不能打开。

#### WebSocket 事件

以下是 WebSocket 对象的相关事件。

| 事件    | 事件处理程序     | 描述                       |
| ------- | ---------------- | -------------------------- |
| open    | Socket.onopen    | 连接建立时触发             |
| message | Socket.onmessage | 客户端接收服务端数据时触发 |
| error   | Socket.onerror   | 通信发生错误时触发         |
| close   | Socket.onclose   | 连接关闭时触发             |

-   下面是相关示例代码：

```javascript
Socket.onopen = function () {
    //连接建立时触发
    console.log("WebSocket连接已建立");
};

Socket.onmessage = function (event) {
    //客户端接收服务端数据时触发
    var message = event.data;
    console.log("收到消息：" + message);
};

Socket.onerror = function () {
    //通信发生错误时触发
    console.log("WebSocket连接发生了错误");
};

Socket.onclose = function () {
    //连接关闭时触发
    console.log("WebSocket连接已关闭");
};
```

#### WebSocket 方法

以下是 WebSocket 对象的相关方法。

| 方法           | 描述             |
| -------------- | ---------------- |
| Socket.send()  | 使用连接发送数据 |
| Socket.close() | 关闭连接         |

```javascript
//发送一条消息
Socket.send("你好");
//关闭WebSocket连接
Socket.close();
```

WebSocket 除了发送和接收文本消息外，还支持发送和接收二进制数据。对于发送二进制数据，可以使用 `send()` 方法传递一个 `ArrayBuffer` 或 `Blob` 对象，例如：

```javascript
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setUint32(0, 1234);
socket.send(buffer);
```

在接收二进制数据时，可以通过 `event.data` 获取到 `ArrayBuffer` 对象，然后进行处理。

## WebSocket 的心跳机制

WebSocket 的心跳机制是一种用于保持 WebSocket 连接的稳定性和活跃性的方法。心跳机制的目的是定期发送小的探测消息，以确保连接仍然有效，如果连接断开或出现问题，可以及时发现并采取措施。

下面是 WebSocket 心跳机制的详细步骤和相关代码示例：

**定义心跳间隔**：为了定期发送心跳消息，你需要定义一个心跳间隔，通常以毫秒为单位。在示例中，我们将心跳间隔设置为 30 秒。

```javascript
const heartbeatInterval = 30000; // 30秒
```

**定义心跳消息**：你需要定义用于发送心跳的消息内容。这通常是一个简单的字符串，如"heartbeat"，但可以根据应用的需求自定义。

```javascript
const heartbeatMessage = "heartbeat";
```

**设置心跳定时器**：一旦 WebSocket 连接打开，你可以使用`setInterval`函数设置一个定时器，以便每隔一段时间发送心跳消息。

```javascript
let heartbeat;

socket.addEventListener("open", () => {
    console.log("WebSocket连接已打开");

    heartbeat = setInterval(() => {
        socket.send(heartbeatMessage);
    }, heartbeatInterval);
});
```

**处理心跳消息**：当你接收到来自`服务器`的消息时，你需要检查它是否是心跳消息。这可以通过比较接收到的消息内容和心跳消息的内容来实现。

```javascript
socket.addEventListener("message", (event) => {
    const message = event.data;

    if (message === heartbeatMessage) {
        console.log("接收到心跳消息");
        // 在这里可以执行一些处理心跳消息的操作
    } else {
        console.log("接收到其他消息：", message);
        // 处理其他类型的消息
    }
});
```

**清除心跳定时器**：当 WebSocket 连接关闭时，你应该清除之前设置的心跳定时器，以防止继续发送心跳消息。

```javascript
socket.addEventListener("close", () => {
    console.log("WebSocket连接已关闭");

    clearInterval(heartbeat);
});
```

通过这些步骤，你可以实现 WebSocket 的心跳机制，确保连接的持续稳定，以适应长时间的通信需求。如果连接断开或出现问题，你可以根据需要添加进一步的错误处理机制。

## WebSocket 的安全性和跨域问题如何处理？

WebSocket 支持通过 `wss://` 前缀建立加密的安全连接，使用 TLS/SSL 加密通信，确保数据的安全性。在使用加密连接时，服务器需要配置相应的证书。

对于跨域问题，WebSocket 遵循同源策略，只能与同源的服务器建立连接。如果需要与不同域的服务器通信，可以使用 CORS（跨域资源共享）来进行跨域访问控制。

## 有哪些好用的客户端 WebSocket 第三方库

1.  **Socket.io-client**：[Socket.io](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttp%253A%252F%252Fsocket.io%252F&source=article&objectId=2371055 "https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttp%253A%252F%252Fsocket.io%252F&source=article&objectId=2371055") 是一个流行的实时通信库，它提供了客户端 JavaScript 库，可用于在浏览器中与 [Socket.io](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttp%253A%252F%252Fsocket.io%252F&source=article&objectId=2371055 "https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Flink.juejin.cn%2F%3Ftarget%3Dhttp%253A%252F%252Fsocket.io%252F&source=article&objectId=2371055") 服务器建立 WebSocket 连接。它支持自动重连、事件处理等功能，用于构建实时应用非常方便。
2.  **ReconnectingWebSocket**：ReconnectingWebSocket 是一个带有自动重连功能的 WebSocket 客户端库，可以很好地处理网络连接断开和重新连接的情况，适合用于浏览器端的 WebSocket 开发。
3.  **SockJS-client**：SockJS 提供了一个浏览器端的 JavaScript 客户端库，用于与 SockJS 服务器建立连接。它可以在不支持 WebSocket 的浏览器上自动降级到其他传输方式，具有良好的兼容性。
4.  **RxJS WebSocketSubject**：RxJS 是一个流式编程库，它提供了 WebSocketSubject 类，可以将 WebSocket 转换为可观察对象，方便进行响应式编程。
5.  **autobahn.js**：autobahn.js 是一个用于实现 WebSocket 和 WAMP（Web Application Messaging Protocol）的客户端库，在浏览器中可以方便地使用它来与 WAMP 路由进行通信。

这些库都提供了良好的接口封装和功能特性，可以根据项目需求选择适合的库来进行浏览器端的 WebSocket 开发。

## 总结

WebSocket 协议是一种基于 TCP 的应用层协议，它提供了在客户端和服务器之间进行双向通信的能力。相比传统的 HTTP 协议，它具有更低的延迟和更高的实时性。

WebSocket 协议通过建立一条持久化的连接来实现双向通信，从而避免了 HTTP 协议中频繁建立和断开连接的过程，减少了网络开销和服务器的负担。客户端可以发送消息给服务器，服务器也可以发送消息给客户端，实现了真正的双向通信。

在使用 WebSocket 协议时，客户端和服务器会进行一次握手过程，以建立起 WebSocket 连接。握手过程中，客户端会发送一个 HTTP 请求，请求头中包含 Upgrade 和 Connection 字段，告诉服务器它希望升级到 WebSocket 连接。服务器收到请求后会返回一个 HTTP 响应，响应头中包含 Upgrade 和 Connection 字段，以及一个 Sec-WebSocket-Accept 字段，用于验证请求的合法性。握手成功后，客户端和服务器就可以开始使用 WebSocket 协议进行通信了。

WebSocket 协议支持二进制数据和文本数据的传输，开发者可以根据实际需求进行选择。同时，WebSocket 还提供了心跳机制、自动重连等功能，可以提高连接的稳定性和可靠性。

总之，WebSocket 协议在实时通信、游戏、在线聊天等场景中得到了广泛应用，它为 Web 应用提供了更加高效、可靠的双向通信方式。

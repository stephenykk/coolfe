# h5 history notes

[H5 之 History API](https://www.jianshu.com/p/145d353de37a)

## 背景

作用：ajax获取数据时，可以改变历史记录，从而可以使用浏览器的后退和前进导航应用状态


## 介绍

History 对象最初设计来表示窗口的浏览历史。 但出于隐私方面的原因，History 对象不再允许脚本访问已经访问过的实际 URL。

Web应用通常都是动态地载入页面内容，并在不刷新页面的情况下就显示新的应用状态。  
如果想要提供用户能够通过浏览器的“后退”和“前进”按钮，直观地切换应用状态，像这类应用就必须自己管理应用的历史记录。



- Ajax有一个问题一直困扰着开发者，就是网页状态无法被添加到历史记录中，这意味着用户不能通过浏览器的“前进”和“后退”按钮前进或者退回到某个状态。
 
- 可以在历史记录中添加状态或改变状态
 
- 可以使用JavaScript来部分更新页面，又能更新地址栏和浏览器历史记录。
 
- 使用History API实现了地址栏改变而页面不跳转的效果。
 
- 在使用HTML5的状态管理机制时，请确保使用pushState()创造的每一个“假”URL，在Web服务器上都有一个真的、实际存在的URL与之对应。否则，单击“刷新”按钮会导致404错误。

- History API采用同源控制策略来保证安全性，避免恶意网站修改用户其他网站的历史记录


## 属性和方法

history 接口定义
```js

/*
interface History {
   readonly attribute long length;
   readonly attribute any state;
   void go(optional long delta);
   void back();
   void forward();
   void pushState(any data, DOMString title, optional DOMString? url = null);
   void replaceState(any data, DOMString title, optional DOMString? url = null);
 };
 */

```


-  `history.length`   
    历史记录的数量

- `history.back()`  
    等同 点击 后退 或 调用 `history.go(-1)
- `history.forward()`  
    等同 点击 前进 或 调用 `history.go(1)
- `history.go(number|URL)`  
    前进或后退若干步  
    history.go('kw')此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近
- `history.pushState(state, title, ?url)`  
    向history对象添加当前页面的记录，并且改变浏览器地址栏的URL  
    pushState()带来地址栏的变化不会触发 hash 跳转

    + `state` 是一个JavaScript对象，记录要插入到历史记录条目的相关信息 state会在onpopstate事件触发时作为参数传递过去
    + `title` 可选的标题，浏览器可以使用它 目前还没有浏览器实现
    + `url` 可选的URL，表示当前状态的位置, 受同源策略限制

    ```js
        history.pushState({username: "html5"}, "user account", "user.html")
        history.pushState({hello: 'world'}, 'My World')
        history.state // {hello: 'world'}
    ```    
- `history.replaceState()`  
    同 `history.pushState()`, 只是将当前页面状态替换为新的状态
- `history.state`  
    表示历史堆栈顶部的状态的值。这是一种可以不必等待popstate事件而查看状态而的方式

- `history.scrollRestoration`  
    允许Web应用程序在历史导航上显示地设置默认滚动恢复行为。此属性可以是自动的auto或者手动的manual

- `window.onpopstate`  
    History API还提供了onpopstate事件，该事件在窗口历史记录改变时被触发。
    当用户单击浏览器的后退和前进按钮时触发该事件。
    在事件处理函数中，读取触发触发事件的事件对象的state属性值。该属性为pushState()的第一个参数值。
    当你浏览会话历史记录时，不管你是点击前进或者后退按钮，还是使用history.go和history.back方法，popstate都会被触发。
    ```js
        window.addEventListener('popstate', function(event) {
            console.log('location: ' + document.location)
            console.log('state: ' + JSON.stringify(event.state))   
        })
    ```

## 两种管理历史记录的机制
 
### location.hash和onhashchange事件
 
设置location.hash属性会更新地址栏中的URL，同时会在浏览器的历史记录中添加一条记录。  
hash属性设置URL的片段标识符，通常是用于指定要滚动到的文档中某一部分的ID。   
但是location.hash不一定非要设置为一个元素的ID： 它可以设置成任何的字符串。

设置了location.hash属性后，接下来要实现允许用户通过“后退”和“前进”按钮来切换不同的文档状态。 
支持HTML5的浏览器一旦发现片段标识符发生了改变，就会在Window对象上触发hashchange事件。onhashchange回调函数，对location.hash的值进行解析，然后切换到对应的应用状态

### history.pushState 和 onpopstate事件
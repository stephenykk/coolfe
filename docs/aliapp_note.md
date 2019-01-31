支付宝小程序文档
===
小程序的核心是一个响应式的数据绑定系统，逻辑上分为视图层和逻辑层。这两层始终保持同步，只要在逻辑层修改数据(`this.setData({data: newData})`)，视图层就会相应的更新。


逻辑层 js 可以用 es2015 模块化语法组织代码：

```
    import util from './util'; // 载入相对路径
    import absolute from '/absolute'; // 载入项目根路径文件
    import lodash from 'lodash'; // 载入第三方 npm 模块
```

>> 注意：由于 node_modules 里第三方模块代码不会经过转换器，为了确保各个终端兼容，node_modules 下的代码需要转成 es5 格式再引用，模块格式推荐使用 es2015 的 import/export。



目录结构
---
+ assets
+ components
+ pages (pageA: index.js index.acss, index.axml, index.json, ...)
+ app.js
+ app.json
+ app.acss



文件类型
---
+ axml
    模板, 属性和子节点插值{{msg}}, 控制属性插值 a:if="{{show}}" a:for="{{todos}}", 事件绑定属性用驼峰风格,值为方法名 onChange="onTodoChanged"

    ```
    <view class="page-todos">
      <view class="user">
        <image class="avatar" src="{{user.avatar}}" background-size="cover"></image>
        <view class="nickname">{{user.nickName}}'s Todo List</view>
      </view>
      <view class="todo-items">
        <checkbox-group class="todo-items-group" onChange="onTodoChanged">
          <label class="todo-item" a:for="{{todos}}">
            <checkbox value="{{item.text}}" checked="{{item.completed}}" />
            <text class="{{item.completed ? 'checked' : ''}}">{{item.text}}</text>
          </label>
        </checkbox-group>
        <view class="todo-item">
          <button onTap="addTodo">Add Todo</button>
        </view>
      </view>
    </view>
    ```
+ acss
    - 支持rpx单位
    - 支持 @import "./other.acss"
+ js
    页面逻辑  
    - page.js 
        ```
        Page({
            data: {
                msg: 'hello'
            }, 
            onLoad() {}, 
            onReady() {}, 
            onShow(){}, 
            onHide() {}, 
            onUnload() {},
            myMeothod() {
                let newMsg = this.data.msg + '!'
                this.setData({msg: newMsg})
            } 
        })
        ```
    - app.js
        ```
        App({
            globalData: {}
            onLaunch() {}
        })
        ```
+ json
    - app.json
        小程序的全局配置  
        `{pages: [], window: {defaultTitle: xx, titleBarColor: #fffaaa}}`
    - page.json
        页面的配置  
        `{defaultTitle: xx}`

App
---
App代表顶层应用，管理所有页面和全局数据，以及提供生命周期方法。

App包括三个文件:
- app.js  # 应用入口
- app.ascc  # 全局样式
- app.json # 全局配置

App的声明周期:
只有当小程序进入后台一定时间，或占用系统资源过高，才会被真正销毁

- onLaunch(options) 应用启动   
    全局只触发一次 `options = {path, query, scene, referrerInfo: {appId, data}}`
- onShow(options) 从后台到前台
- onHide 从前台到后台
- onError 错误捕获 *经测试，不会捕获*

支付宝app实际启动小程序的链接，类似:  
`alipays://platformapi/startapp?appId=abc123&query=${encodeURIComponent('number=1&item=it01')}&page=${encodeURIComponent(pages/index/index)}`  
忽略page参数时，默认打开小程序的首页


### getApp()
全局的getApp()函数，可以获取到小程序实例

注意：
- App()必须在 app.js 里调用，且不能调用多次。
- App()中的方法和生命周期函数用 this 就可以拿到 app 实例, 不需调用 getApp()。
- 不要在 onLaunch 里调用getCurrentPages()，这个时候 page 还没有生成。
- 不要试图通过app实例，手动调用生命周期函数。


app.json
---
app.json用于全局配置，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。

```
{
  "pages": [
    "pages/index/index", // 第1个为首页
    "pages/logs/index"
  ],
  "window": {
    "defaultTitle": "Demo",
    "pullRefresh": true,
    "allowBounceVertical": true,
    "titleBarColor": "#eeeeee"
  },
  "tabBar": {
    "textColor": "#dddddd",
    "selectedColor": "#49a9ee",
    "backgroundColor": "#ffffff",
    "items": [
      { // tabBar 的第一个页面必须是首页
        "pagePath": "pages/index/index",
        "name": "首页",
        "icon": "images/icon1",
        "activeIcon": "images/icon1-active"
      },
      {
        "pagePath": "pages/logs/logs",
        "name": "日志"
        "icon": "images/icon2",
        "activeIcon": "images/icon2-active"
      }
    ]
  }
}
```

Page
---
Page代表应用的一个页面，负责页面展示和交互。由4个文件组成 `pageA.js`, `pageA.acss`, `pageA.axml`, `pageA.json`

```
<view>{{title}}</view>
<view>{{array[0].user}}</view>
<view onTap="handleTap">click me</view>

// Page(options) options包括 data, 生命周期函数，事件处理函数和其他方法
Page({
  data: {
    title: 'hello alimp',
    array: [{user: 'lin'}, {user: 'zhao'}]
  },
  handleTap() {
    this.setData({title: 'hello js'})
  }
})
```

page的生命周期包括:
- onLoad(query)
    `my.navigateTo({url: '/pages/todos/todos?foo=1&bar=2'})` 这时才能获得 query
- onReady
- onShow
- onHide
- onUnload
- onPullDownRefresh
    需手动调用 `my.stopPullDownRefresh` 停止下拉刷新
- onReachBottom
    上拉触底时触发 *可用于加载更多*
- onPageScroll
    高频调用，需注意节流
- onShareAppMessage
- onTitleClick  
    点击标题触发
- onOptionMenuClick   
    点击格外导航栏图标触发，可通过 my.canIUse('page.onOptionMenuClick') 判断


### this.setData(data, cb)
setData函数用于将数据从逻辑层发送到视图层。data的key可以非常灵活，以数据路径的形式给出，如 array[2].message、a.b.c.d，并且不需要在this.data中预先定义。

> 注意：setData回调函数自1.7.0之后才支持 my.canIUse('page.setData.callback')

### this.$spliceData()
$spliceData同样用于将数据从逻辑层发送到视图层，处理长列表的时候，性能更好。
`this.$spliceData({keyPath: [start, delCount, ...items]})`

```
Page({
  data: {
    a: {
      b: [1,2,3,4]
    }
  },
  onLoad(){
    this.$spliceData({ 'a.b': [1, 0, 5, 6] })
  },
})
```

> 注意：$spliceData自1.7.2之后才支持  `my.canIUse('page.$spliceData')`


### getCurrentPages()
全局函数getCurrentPages()用于获取当前页面栈

> 注意：不要尝试修改页面栈，会导致路由以及页面状态错误

page.json
---
页面的配置比app.json全局配置简单得多，只能设置window相关的配置项

```
{
    defaultTitle: "hello",
    titleBarColor: "#cccccc",
    optionMenu: {icon: "xx"} // 设置导航栏格外图标，目前支持设置属性 icon，值为图标 url（以 https/http 开头）或 base64 字符串，大小建议 30*30
}
```


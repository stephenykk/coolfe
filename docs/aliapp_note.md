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
        小程序的全局配置 `{pages: [], window: {defaultTitle: xx, titleBarColor: #fffaaa}}`
    - page.json
        页面的配置 `{defaultTitle: xx}`



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
    - 支持 @import "./other.acss";   
      @import 支持的路径
      ```
        @import "./button.acss"; /*相对路径*/
        @import "/button.acss"; /*项目绝对路径*/
        @import "third-party/button.acss"; /*第三方 npm 包路径*/
      ```
     - 组件支持使用style、class属性设置样式  
       style指定动态样式，class指定静态样式
     - 选择器  
        + .a-, .am- 开头的类选择器为系统组件占用，请不要使用
        + 不支持属性选择器
     - 全局样式与局部样式  
        app.acss定义全局样式，page.acss定义局部样式
     - 页面容器样式  
       每个页面中的根元素为 page, 设置页面背景色和高度等.. 

        ```
        page {
            background: #eeeeee;
            min-height: 100vh;
        }
        ```
      
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
- app.acss  # 全局样式
- app.json # 全局配置

App的生命周期:
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
    "titleBarColor": "#eeeeee",
    "pullRefresh": true,
    "allowBounceVertical": true,
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
    点击*格外导航栏图标*(titleBar右侧关闭按钮旁支持配置额外的icon)触发，可通过 my.canIUse('page.onOptionMenuClick') 判断


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
    optionMenu: {
        // 设置导航栏格外图标，icon为图标 url（以 https/http 开头）或 base64 字符串，大小建议 30*30
        icon: "https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png"
    } 
}
```

page.js
---
不建议直接修改page对象的data, 如:
```
// 更新students数组
onAdd(newStudent) {
    // 不推荐写法
    this.data.students.push(newStudent);
    this.setData({students: this.data.students})

    // 推荐 imutable data
    this.setData({student: [...this.data.students, newStudent]})
}
```


视图层
---
pageA.axml 页面内容渲染

### 数据绑定
`{{}}`中可以进行简单算术运算和三元表达式

```
<!-- 属性值和节点插值, 控制属性的插值 -->
<view class="tips {{checked ? 'active' : ''}}" data-type="{{type}}">{{msg}}</view>
<view a:if="{{visible}}">title bar</view>
<view a:for="{{items}}">{{item}}</view>

<!-- true/false boolean字面量 -->
<checkbox checked={{true}}></checkbox>

<!-- 数组字面量 -->
<view a:for="{{[zero, 1, 2, 3]}}">{{item}}</view>
<view a:for="{{[...friends, 'zoro', 'nami']}}"></view>

<!-- 对象字面量 -->
<view data-test="{{foo, bar}}">test obj</view>
<view data-test="{{...oldData, age: 3}">change fat</view>


<!-- 简单算术运算和三元表达式 -->
<view>{{ a + b + '!'}}, {{ a % 2 ? '奇数' : '偶数'}}</view>

Page({
    data: {
        msg: 'hello'
    }
});
```

### 列表渲染
```
<view a:for="{{items}}">{{item}}</view>
<view a:for="{{groupList}}" a:for-index="idx" a:for-item="group">
    {{idx}}. {{group.title}}
</view>


Page({
    data: {
        items: ['a', 'b', 'c']
    }
});
```

**a:key**
如果列表中项目的位置会动态改变或者有新的项目添加到列表中，同时希望列表中的项目保持自己的特征和状态（比如 <input/> 中的输入内容，<switch/> 的选中状态），需要使用 a:key 来指定列表中项目的唯一的标识符。

```
<view a:for="{{list}}" a:key="*this">
    <view onTap="bringToFront" data-value="{{item}}">
    {{item}}: click to bring to front
    </view>
</view>

<view a:for="{{groups}}" a:for-index="i" a:for-item="group" a:key="i"> {{group.title}} </view>
<view a:for="{{groups}}" a:for-index="j" a:for-item="group" a:key="group.id"> {{group.title}} </view>
```


**key**
key 是比 a:key 更通用的写法，里面可以填充任意表达式和字符串。

> 注意: key 不能设置在 block 上

```
<view a:for="{{list}}" key="{{item}}">hello</view>

<!-- 如果没有key设置，name有值时，即将渲染的input, 会复用旧的input, 输入内容被保留 -->
<input key="name" a:if="{{!name}}" placeholder="Enter your username" onInput="setName" />
<input key="email" a:else placeholder="Enter your email address" />
```


### 条件渲染

```
<view a:if="{{type == 'webview'}}">webview</view>
<view a:elif="{{type == 'app'}}">app</view>
<view a:else>alipay</view>

<!-- block 可用于包裹多个并列节点 -->
<block a:if="{{a > 3}}">
    <view> view1 </view>
    <view> view2 </view>
</block>

```

### 模板  
轻量级的展示型组件，可以用template实现，模板中也是可以绑定事件，事件回调定义在page中

`<template>` 的子节点只能是一个而不是多个

```
// 定义 template
<template name="staff">
    <view>FirstName='{{fname}}' , LastName='{{lname}}'</view>
</template>

// 使用template
<template is="staff">{{...staffA}}</template>
<template is="staff">{{...staffB}}</template>

Page({
    data: {
        staffA: {firstName: 'sindy', lastName: 'lin'},
        staffB: {firstName: 'meijing', lastName: 'xu'}
    }
});
```

### 事件
事件属性驼峰命名(on{Event}, catch{Event})，属性值为方法名;   

事件分为:
- 冒泡事件(touch and tap)  
  touchStart, touchEnd, touchMove, touchCancel, tap, longTap
- 非冒泡事件  
  其他事件都是非冒泡的

事件处理函数的参数为event对象:

```
{
  "type": "tap",
  "timeStamp": 13245456,
  "detail": {"value": "hi"}
  "target": {
    "id": "tapTestInner",
    "dataset": {
      "hi": "Alipay"
    },
    "targetDataset": {
      "hi": "AlipayInner"
    }
  },
  "currentTarget": {
    "id": "tapTest",
    "dataset": {
      "hi": "Alipay"
    }
  },
  touches: [{identifier, pageX, pageY, clientX, clientY}, ...],
  changedTouches: []
}
```


```
<view onTap="add"> add one </view>
<!-- catch{Event} 绑定方式，会阻止冒泡事件冒泡 -->
<view catchTap="add2"> add two </view>

Page({
    data: {
        count: 1
    },
    add() {
        this.setData({count: this.data.count + 1})
    }
})
```

### import and include
- import可以加载已经定义好的template, 让template可跨文件复用
- include可复用xml片段, 不支持数据入参

```
<!-- item.axml -->
<template name="item">
  <text>{{text}}</text>
</template>


<import src="./item.axml"/>
<template is="item" data="{{text: 'forbar'}}"/>

<!-- is属性值可以是动态的 -->
<block a:for="{{[1, 2, 3, 4, 5]}}">
    <template is="{{item % 2 == 0 ? 'even' : 'odd'}}"/>
</block>


<!-- index.axml -->
<include src="./header.axml"/>
<view> body </view>
<include src="./footer.axml"/>

<!-- 路径支持 -->
<import src="./a.axml"/> <!-- 相对路径 -->
<import src="/a.axml"/> <!-- 项目绝对路径 -->
<import src="third-party/x.axml"/> <!-- 第三方 npm 包路径 -->

```

### 自定义脚本 sjs
SJS(safe/subset javascript)是小程序的一套自定义脚本语言, 可用在 axml 中。

sjs 并不是javascript，但是它也支持部分常用的es6语法(let const 箭头函数，解构赋值, 默认参数，剩余参数，对象字面量增强)。有一套完整的语法约定，详见[文档](https://docs.alipay.com/mini/framework/sjs)

> 默认 `{{}}` 中只支持简单的表达式，不支持函数调用; sjs 类似于微信的wxs, 让``{{}}`中支持函数调用， sjs最大的用处应该是包含一些过滤器

```
// pageA.sjs 定义
const message = 'hello alipay'
const getMsg = x => x + '!!!';

export default {
  message,
  getMsg,
};

// pageA.axml 使用
<import-sjs name="m1" from="./pageA.sjs"/>
<view>{{m1.message}}</view>
<view>{{m1.getMsg(msg)}}</view>


// namedExport.sjs
export const x = 3;
export const y = 4;

<!-- 支持命名导出（named export） -->
<import-sjs from="../namedExport.sjs" name="{x, y: z}" />

// other.sjs 使用
import common from './common.sjs';
```

注意:
- sjs 只能定义在.sjs文件中。然后在axml中使用import-sjs引入。
- sjs 可以调用其他 sjs 文件中定义的函数。
- sjs 是 javascript 语言的子集，不要将其等同于javascript。
- sjs的运行环境和其他javascript代码是隔离的，sjs中不能调用其他javascript文件中定义的函数，也不能调用小程序提供的API。
- sjs函数不能作为组件的事件回调。
- sjs不依赖于运行时的基础库版本，可以在所有版本的小程序中运行。


### 自定义组件  
功能模块抽象成自定义组件，可以跨页面复用, 或者发布到npm上，跨小程序复用.  
自定义组件的组成:
- comA.axml
- comA.acss
- comA.js
- comA.json

```
    // comA.json
    {
        "component": true, // 声明自身是自定义组件
        "usingComponents": { // 导入的其他自定义子组件
            "foo": "/components/foo/index"
        }
    }

    // comA.js
    Component({
        mixins: [], // 不同组件代码逻辑复用
        data: {msg: 'hi'},
        props: {
            onAdd() {
                console.log('add')
            },
            age: 12
        },
        didMount() {
            // 渲染后回调
        },
        didUpdate() {
            // 更新后调用
        },
        didUnmount() {
            // 销毁后调用
        },
        methods: { // 事件的自定方法
            onTapHandler() {
                var newMsg = this.data.msg + '~~'
               this.setData({msg: newMsg})
            }
        }
    })
```

注意：  
- 与Page不同，自定义组件需要将事件处理函数定义在 methods 中。
- props 可指定默认属性，不能在自定义组件内部代码中修改。
- 如果需要调用父组件传递过来的函数，可以在methods中通过this.props调用

自定义组件支持slot 和 named slot, 可以构建出灵活的页面结构。

```
    <!-- comA -->
    <view>
        <button onTap="handleTap"></button>
        <slot>default content</slot>
        <slot name="hd">head</slot>
        <view>body</view>
        <slot name="end">end</slot>
    </view>
```

使用自定义组件，需在pageA.json中声明用到的自定义组件

```
    {
        "usingComponents": {
            "hello": "/components/hello/index" // 还可以是相对路径./hello/index 或第三方包路径 hello/index
        }
    }

    // pageA.axml
    <view><hello /></view>
    <view>
    
    <hello>
        <view slot="hd">this is title</view>
        <view slot="end">this is copyright</view>
    </hello>
    </view>
```


### 组件实例的属性

- this.data
- this.props
- this.setData
- this.$id, // 组件id
- this.is  // 组件路径
- this.$page // 组件的页面实例
- 
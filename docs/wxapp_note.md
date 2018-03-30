小程序文档
==========

体验
---
apis

    wx.getStorageSync('logs');
    wx.setStorageSync('logs', logs);
    wx.login({success: cb}); // 返回 session_key
    wx.getSetting({success: cb}); // 返回授权设置  authSetting: {'scope.userInfo', 'scope.userLocation'}
    wx.getUserInfo({success: cb}); // 返回 avatarUrl nickName...
    wx.navigateTo({url: '../logs/index'}); //方法基本都是异步，都传入options

    getApp(); // 全局方法
    getCurrentPages();
    App(opts);
    Page(opts);
    this.setData(data);

    app的事件：{onLaunch, onShow, onHide, onError}
    page的事件和生命周期： {onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onPageScroll}

    onLoad(query) {
        // query 获取路径后面的参数
    }

    onPullDownRefresh() {
        fetchData(() => {
            wx.stopPullDownRefresh(); // 需要停止页面的下拉刷新状态 ...
        });
    }

    onReachBotton() {
        // 触底距离 在 app.json / page.json 中设置 onReachBottomDistance
    }

    onPageScroll({scrollTop}) {
        // 页面滚动的回调 高频事件
    }

    onShareAppMessage() {
        // 定义了这个回调，右上角才有转发选项
        // 需返回 object, 定义转发内容
        return {
            title: '转发标题',
            path: '/pages/index/index?id=123' // 跳转页面
        }
    }
    
    wx.navigateTo({url, success, fail, complete});
    <navigator open-type="navigateTo" url=".." />
    wx.redirectTo({url, success, fail, complete});
    wx.navigateBack(n);
    wx.switchTab({url});
    wx.reLaunch({url});

框架
---
+ 视图层 `wxml` `wxss`
+ 逻辑层 `js`

### 响应式的数据绑定
数据改变，自动更新视图; 视图通过事件将用户的交互反馈给逻辑层

    // demo.wxml
    <view>Hello, {{name}}</view>
    <button bindtap="changeName">click me</button>

    Page({// options中可指定数据和方法,以及声明周期钩子
        data: {name: 'wechat', like: 'green'},
        changeName: function() {
            this.setData({name: 'Nami'}); // => data 为 {name: 'Nami', like: 'green'}
        }
    });

文件结构
---
有描述程序整体的app(*app.json, app.wxss, app.js*) 和 描述页面的page(*page.js, page.json, page.wxss, page.wxml*) 组成。

配置
---
`app.json` 配置页面的路径，窗口外观，网络超时和多tab等..

    {
        "pages": [ // 不用后缀名
            "pages/index/index", // 元素1代表初始页
            "pages/logs/index"
        ],
        "window": {
            "navigationBarTitleText": "hello winly",
            "navigationBarTextStyle": "white/black",
            "navigationBarBackgroundColor": "pink",
            "backgroundColor": "#ffffff",
            "backgroundTextStyle": "dark/light",
            "enablePullDownRefresh": true,
            "onReachBottomDistance": 50 // 50px
        },
        "tabBar": {// 可放在顶部/底部
            "list": [// tab最多[2,5]个
                {
                    "pagePath": "pages/index/index",
                    "text": "首页",
                    "iconPath": url,
                    "selectedIconPath": url
                },
                {
                    "pagePath": "pages/logs/index",
                    "text": "日志"
                }
            ],
            "color": "#333333",
            "selectedColor": "#ffffff",
            "backgroundColor": "pink",
            "borderStyle": "black/white",
            "position": "top/bottom"
        },
        "networkTimeout": {
            "request": 10000,
            "downloadFile": 10000,
            "uploadFile": 10000,
            "connectSocket": 60000
        },
        "debug": true // console面板打印调试信息
    }

`page.json`配置本页的窗口表现，会覆盖`app.json`中的window配置.

    {
        "navigationBarTextStyle": "#ffffff",
        "navigationBarBackgroundColor": "black/white",
        //.. 同app.json
        disableScroll: false // 设置不能滚动
    }

逻辑层
---

### 注册程序
App()函数用于注册程序, 如:

    App({
        onLaunch: function(options) {
            // 只触发一次
        },
        onShow: function(options) {
            // options = {path, query, scence, shareTicket, referrerInfo}
            // 前台到后台
        },
        onHide: function() {

        },
        onError: function() {

        },
        globalData: {},
        otherData: {},
        otherMethod: function() {}
    });

bindxx catchxx
bindtap catchtouchstart
bind:tap catch:touchstart
capture bubble

touchstart
touchmove
touchend
touchcancel
tap
longtap
longpress


capture-bind:xx
capture-catch:xx

*BaseEvent:*
type
timestamp
target: {id, tagName, dataset}
currentTarget

*CustomEvent extends BaseEvent:*
detail 自定义事件所带的数据


*TouchEvent extends BaseEvent:*
touches: [{identifier, pageX, pageY, clientX, clientY}, canvasTouch = {identifier, x, y}]
changedTouches: [{...}]

canvas no bubble stage event

触发事件，并传递参数

    <view bind:tap="choose" data-role="lufy"></view>
    // pagex.js
    choose(ev) {
        console.log(ev.currentTarget.dataset.role); // lufy
    }

---

*import and include*
import 有作用域的概念，即只会 import 目标文件中定义的 template，而不会 import 目标文件 import 的 template。   

include 可以将目标文件除了 `<template/>`  `<wxs/> `外的整个代码引入
    
    item.wxml:
    <template name="itemTpl">
        <text>{{text}}</text>
    </template>

    index.wxml:
    <import src="item.wxml" />
    <template is="itemTpl" data={{text: 'hello'}} />


    index.wxml:
    <include src="header.wxml" />
    <view>body</view>
    <include src="footer.wxml" />

    header.wxml:
        <view> i am header</view>
    footer.wxml:
        <view>this is footer</view>


    // wxs可以定义一些用于模板的函数，做类似过滤器和计算属性的事情
    <wxs module="m1">
        var msg = 'hello world';
        module.exports.message = msg;
    </wxs>
    <view>{{m1.message}}</view>

    <wxs module="m1">
        var getMax = function(array) {
            var max = undefined;
            for(var i = 0; i < array.length; i++) {
                max = max === undefined ? array[i] : (max >= array[i] ? max: array[i]);
            }
            return max;
        }

        module.exports.getMax = getMax;
    </wxs>

    <view>{{m1.getMax(array)}}</view>

    common.wxs:
    function sum(a, b) {
        return a + b;
    }

    function prod(a, b) {
        return a * b;
    }
    module.exports = {
        sum: sum,
        prod: prod
    }

    a.wxs:
    var ma = require('./common.wxs');
    ma.sum(2, 3);


    // *.wxs 可以被 *.wxml 文件或 *.wxs 文件引用

    b.wxs
    var a = require('./a.wxs');

    c.wxml
        <wxs src="./a.wxs" module="a"></wxs>



Number
------
n.toString()
n.toLocaleString()
n.valueOf()
n.toExponential()
n.toFixed(n)
n.toPrecision(n)

String
-----
s.valueOf()
s.localCompare(str)
s.toString()
s.charAt(n)
s.charCodeAt(n)
s.concat(str)
s.search(reOrStr)
s.indexOf(str)
s.lastIndexOf(str)
s.match(re)
s.replace(reOrStr)
s.split(sep)
s.slice(start, end)
s.substring(start, end)
s.substr(start, len)
s.toLowerCase()
s.toUpperCase()
s.trim()

Array
--------
arr.toString()
arr.concat()
arr.join()
arr.pop()
arr.push()
arr.shift()
arr.unshift()
arr.slice()
arr.splice()
arr.sort()
arr.indexOf()
arr.lastIndexOf()
arr.every()
arr.some()
arr.forEach()
arr.map()
arr.filter()
arr.reduce()
arr.reduceRight()

Date
--------------
dt = getDate('150000303')
dt = getDate('2017-7-12')
dt = getDate(2017,5,12, 20, 33, 22);
dt.parse()
dt.now()
dt.UTC()
dt.toString()
dt.toDateString()
dt.toTimeString()
dt.toLocaleString()
dt.toLocaleDateString()
dt.toLocaleTimeString()
dt.valueOf()
dt.getTime()
dt.getFullYear()
dt.getUTCFullYear()
...


Regexp
----
re = getRegExp(pattern, [flags])
re = getRegExp('x', 'img');
re.source
re.global
re.ignoreCase
re.multiline
re.lastIndex
re.exec()
re.test()
re.toString()

数据类型判断
---
数据类型判断，可根据 `constructor` 属性
[].constructor === 'Array' // 被修改的constructor属性
typeof [] === 'array';
typeof dt === 'object'
typeof re === 'object'; // 同js

基础类库
---

console (console.log)

Math
Math.E
Math.LN10
Math.LN2
Math.LOG2E
Math.LOG10E
Math.PI
Math.SQRT1_2
Math.SQRT2

Math.abs()
Math.min()
Math.max()
Math.random()
Math.round()
Math.floor()
Math.ceil()
...

JSON
---
JSON.stringify()
JSON.parse()


Number
---
Number.MAX_VALUE
Numbber.MIN_VALUE
Number.NEGATIVE_INFINITY
Number.POSITIVE_INFINITY

Global
---
NaN
isNaN()
undefined
parseInt()
parseFloat()
Infinity
isFinite()
decodeURI() / encodeURI()
decodeURIComponent() / encodeURIComponent()


wxss的扩展特性:
- 尺寸单位 `rpx` // 屏幕宽度1/750作为1个单位大小 和 vw单位无异
- 样式导入 `@import 'common.wxss';`

组件的样式:
- style 设动态的样式 `<view style="color:{{color}} />`
- class 设静态的样式 `<view class="normal" />`

支持的选择器:
**基本上支持大多数的选择器，可以放心使用**
- .class
- \#id
- element
- element, element
- ::after  / ::before

全局样式和局部样式:
- app.wxss 全局
- pageX.wxss 局部

基础组件
---


基础库
---
基础库与客户端的关系, 要对应版本才能跑起来
`wx.getSystemInfo()  / wx.getSystemInfoSync()` 获取基础库的版本号
`wx.canIUse()` 判断api、组件是否可用

### 接口兼容

    // 判断用户手机是否支持新api
    if(wx.openBluetoothAdapter) {
        wx.openBluetoothAdapter();
    } else {// tips
        wx.showModal({title: '提示', content: '请升级..'})
    }

### 接口参数兼容

    wx.showModal({
        success: function(res) {
            if(wx.canIUse('showModal.cancel')) {
                console.log(res.cancel);
            }
        }
    });

### 组件兼容

    Page({
        data: {
            canIUse: wx.canIUse('button.open-type.contact')
        }    
    });
    <button wx:if="{{canIUse}}" open-type="contact">客服消息<button>
    <contact-button wx:else><contact-button>

运行机制
---

- 冷启动 *首次/销毁后打开*
- 热启动 *后台->前台*

性能
---
提供性能分析工具和优化建议

page对象
---
`Page.prototype.route` (page.route) 可以获得当前页面的路径  
`Page.prorotype.setData(data, [callback])` , 更新数据，把数据发送到视图层，是异步操作。  
页面的数据对象较大时，属性访问路径会很深，所以setData方法做了些友好的处理，如：  
    this.setData({'a.b.c.d': {foo: 'good'}});
    this.setData({'friends[1].name', 'coco'});
    this.data.msg = 'hello'; // 这样并不能更新数据
    this.setData({msg: this.data.msg+'!!'}); // 应该类似这样去更新

page生命周期
---
视图层 和 逻辑层 各自初始化，逻辑层初始化后，触发onLoad, onShow, 并等待视图层通知(视图层初始化完啦)，收到通知后，发送初始数据到视图层，视图层进行首次渲染, 逻辑层等待视图层通知(视图层渲染完啦),  收到通知后，触发onReady(表示初次渲染完成，可与视图层进行交互), 然后等待用户交互事件， 收到事件通知执行setData, 触发视图层重新渲染; 页面切换时，可能触发 onHide, onShow, onUnload.


页面栈
---
小程序框架管理页面路由，应时刻关注页面栈的变化，`getCurrentPages()` , 栈顶的为当前页. 

+ `wx.redirectTo({url:..})` 替换当前页面，页面栈元素不增加
+ `wx.switchTab({url: ..})` tab切换时，清空页面栈，栈中只有当前页面
+ `wx.reLaunch({url: ..})` 重启小程序，清空，只保留指定的新页面
+ `wx.navigateTo({url: ..})` push新页面到栈中


模块化
---
采用类 cmd 模块方案，不过不会自动从 `node_modules` 查找模块，**只支持相对路径**。

    // util/common.js
    function sayHello(name) {
      console.log(`Hello ${name} !`)
    }
    function sayGoodbye(name) {
      console.log(`Goodbye ${name} !`)
    }
    module.exports = {
        sayHello,
        sayGoodbye
    }

    // pageA.js
    var common = require('./util/common.js');

视图层
---

    <!-- 数据绑定 -->
    <view> {{message}} </view>
    <view class="{{open ? 'open' : ''}}"> {{message}} </view>
    <view> {{a + b}} + {{c}} + d </view>
    <view>{{object.key}} {{array[0]}}</view>
    <view>{{"hello" + name}}</view>
    <view wx:if="{{length > 5}}"> </view>
    <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
    <template is="footer" data="{{for: a, bar: b}}"></template>
    <template is="footer" data="{{...obj1, ...obj2, e: 5}}"></template>
    <template is="objectCombine" data="{{foo, bar}}"></template>


    <!-- 列表渲染 -->
    <view wx:for="{{array}}" wx:for-item="item" wx:for-index="index" wx:key="index"> {{item}} </view>

    <!-- 条件渲染 -->
    <view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
    <view wx:elif="{{view == 'APP'}}"> APP </view>
    <view wx:else="{{view == 'MINA'}}"> MINA </view>
    <!-- 类似 block wx:if，也可以将 wx:for -->
    <block wx:for="{{[1, 2, 3]}}">
      <view> {{index}}: </view>
      <view> {{item}} </view>
    </block>

### 模板
WXML提供模板（template），可以在模板中定义代码片段，然后在不同的地方调用。  
模板拥有自己的作用域，只能使用 data 传入的数据以及模版定义文件中定义的 `<wxs />` 模块。

    <!--wxml-->
    <template name="staffName">
      <view>
        FirstName: {{firstName}}, LastName: {{lastName}}
      </view>
    </template>

    <template is="staffName" data="{{...staffA}}"></template>
    <template is="staffName" data="{{...staffB}}"></template>
    <template is="{{friendName}}" data="{{...friendData}}"></template>

### 事件
事件是视图层到逻辑层的通讯方式。事件对象可以携带额外信息，如 id, dataset, touches。   

    <view id="tapTest" data-hi="wechat" bindtap="tapName"> Click me! </view>

    Page({
      tapName: function(event) {
        console.log(event.target.dataset.hi) // wechat
        event.detail //自定义事件所携带的数据
        event.touches, event.changedTouches
      }
    })

事件分为冒泡事件和非冒泡事件  

冒泡事件: 

+ touchstart touchmove touchend touchcancel 
+ tap longtap longpress
+ transitionend 
+ animationstart animationend animationiteration
+ touchforcechange

非冒泡事件:

+ submit
+ input
+ scroll

bind事件绑定不会阻止事件向上冒泡，catch事件绑定可以阻止冒泡事件向上冒泡。
冒泡阶段事件绑定: bind  catch(不再向上冒泡);  
捕获阶段事件绑定: capture-bind, capture-catch(不再向下传递)

    <view bind:tap="handler1">hello</view>
    <view catch:tap="handler2">world</view>
    <view capture-bind:tap="handler3">today</view>
    <view capture-catch:tap="handler4">tommorrow</view>

    <view data-alpha-beta="1" data-alphaBeta="2" bindtap="bindViewTap"> DataSet Test </view>
    Page({
      bindViewTap:function(event){
        event.currentTarget.dataset.alphaBeta === 1 // - 会转为驼峰写法
        event.currentTarget.dataset.alphabeta === 2 // 大写会转为小写
      }
    })

自定义组件
---
基础版本库1.6.3+, 支持组件化开发  
类似于页面，一个自定义组件由 json wxml wxss js 4个文件组成。  

    // acom.json
    {
        "component": true
    }

    // acom.wxml
    <view class="inner">
      {{innerText}}
    </view>
    <slot></slot>  // 支持内容分发 和 多个内容分发

    // acom.js
    Component({
      properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        innerText: {
          type: String,
          value: 'default value',
        }
      },
      data: {
        // 这里是一些组件内部数据
        someData: {}
      },
      methods: {
        // 这里是一个自定义方法
        customMethod: function(){}
      }
    })

使用自定义组件

    // apage.json
    {
      "usingComponents": {
        "component-tag-name": "path/to/the/custom/component"
      }
    }

    // apage.wxml
    <view>
      <!-- 以下是对一个自定义组件的引用 自定义组件标签名 只能是小写字母、中划线和下划线的组合-->
      <component-tag-name inner-text="Some text"></component-tag-name>
    </view>

### 组件样式
组件样式的支持有限，需要注意以下问题:

+ 组件和引用组件的页面不能使用id选择器（#a）、属性选择器（[a]）和标签名选择器，请改用class选择器。
+ 继承样式，如 font 、 color ，会从组件外继承到组件内。 *继承样式能穿透到组件内，其他样式无效*
+ 除继承样式外， app.wxss 中的样式、组件所在页面的的样式对自定义组件无效。

### 外部样式类


    /* 组件 custom-component.js */
    Component({
      externalClasses: ['my-class']
    })

    <!-- 组件 custom-component.wxml -->
    <custom-component class="my-class">这段文本的颜色由组件外的 class 决定</custom-component>

### Component构造器

    Component({
        properties: {
            {type, value, observer},
            ...
        },
        data: {
            foo: foolish
        },
        methods: {
            hello() {
                //todo
            }
        },
        behaviors: [] // 类似mixin 组件间代码复用，
        created() {
            // 组件实例进入页面节点树时执行，注意此时不能调用 setData
        },
        attached() {
            // 组件实例已进入页面节点树时执行
        },
        ready() {
            // 在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
        },
        moved() {
            // 组件实例被移动到节点树另一个位置时执行
        },
        detached() {
            // 组件实例被从页面节点树移除时执行
        },
        relations: {},
        externalClasses: [],
        options: {}
    })

示例：

    Component({
      options: {
        multipleSlots: true
      },
      relations: {}

      behaviors: [],

      properties: {
        myProperty: { // 属性名
          type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
          value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
          observer: function(newVal, oldVal){} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        },
        myProperty2: String // 简化的定义方式
      },
      data: {}, // 私有数据，可用于模版渲染

      // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
      created() {},
      attached: function(){},
      ready() {},
      moved: function(){},
      detached: function(){},

      methods: {
        onMyButtonTap: function(){
          this.setData({
            // 更新属性和数据的方法与更新页面数据的方法类似
          })
        },
        _myPrivateMethod: function(){
          // 更新组件数据 this.replaceDataOnPath(), this.applyDataUpdates(); 等价于 this.setData(obj)

          // 内部方法建议以下划线开头
          this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData') // 这里将 data.A[0].B 设为 'myPrivateData'
          this.applyDataUpdates()
        },
        _propertyChange: function(newVal, oldVal) {

        }
      }

    })    

component实例的属性：

+ this.is // 组件的文件路径
+ this.id //节点id
+ this.dataset // 节点dataset
+ this.data // 包括内部数据和属性值

component实例的属性：

+ this.setData() 
+ this.hasBehavior()
+ this.triggerEvent()
+ this.createSelectorQuery()
+ this.selectComponent()
+ this.selectAllComponents()
+ this.getRelationNodes()

组件事件

事件系统是组件间交互的主要形式。自定义组件可以触发任意的事件，引用组件的页面可以监听这些事件

    <!-- 当自定义组件触发“myevent”事件时，调用“onMyEvent”方法 -->
    <component-tag-name bind:myevent="onMyEvent" />

    Page({
      onMyEvent: function(e){
        e.detail // 自定义组件触发事件时提供的detail对象
      }
    })


触发事件

    Component({
      properties: {}
      methods: {
        onTap: function(){
          var myEventDetail = {} // detail对象，提供给事件监听函数
          var myEventOption = {bubbles: false, composed: false, capturePhase: false} // 触发事件的选项
          this.triggerEvent('myevent', myEventDetail, myEventOption)
        }
      }
    })    


behavior  
类似mixin, 组件间代码复用的方式

    Behavior({
        behaviors: [],
        properties: {}, // merge cmp-first
        data: {}, // merge cmp-first
        attached() {}, //life-circle hook, called both
        methods: {} // merge cmp-first
    })

内置的behaviors

    Component({
        behaviors: ['wx://form-field']
    })

组件间关系  

    <custom-ul>
      <custom-li> item 1 </custom-li>
      <custom-li> item 2 </custom-li>
    </custom-ul>

    // path/to/custom-ul.js
    Component({
      relations: {
        './custom-li': {
          type: 'child', // 关联的目标节点应为子节点
          linked: function(target) {
            // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
          },
          linkChanged: function(target) {
            // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
          },
          unlinked: function(target) {
            // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
          }
        }
      },
      methods: {
        _getAllLi: function(){
          // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
          var nodes = this.getRelationNodes('path/to/custom-li')
        }
      },
      ready: function(){
        this._getAllLi()
      }
    })

    // path/to/custom-li.js
    Component({
      relations: {
        './custom-ul': {
          type: 'parent', // 关联的目标节点应为父节点
          linked: function(target) {
            // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
          },
          linkChanged: function(target) {
            // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
          },
          unlinked: function(target) {
            // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
          }
        }
      }
    })

> 注意：必须在两个组件定义中都加入relations定义，否则不会生效。


抽象节点  
实现动态组件

    {
        "usingComponents": {
            "my-radio": "components/my-radio"
        },
        "componentGenerics": {
            // "selectable": true,
            "selectable": {
                "default": "components/def-select"
            }
        }
    }

    <!-- selectable-group.wxml -->
    <view wx:for="{{labels}}">
      <label>
        <selectable disabled="{{false}}"></selectable>
        {{item}}
      </label>
    </view>
    <selectable-group generic:selectable="my-radio" />


插件
---
新建插件项目， 包含目录 `plugin` , `miniprogram`

    + miniprogram
       + pages
       - app.js
       - app.json
    + plugin
        + components
        - index.js
        - plugin.json


配置文件 plugin.json

    {
      "publicComponents": {
        "hello-component": "components/hello-component"
      },
      "main": "index.js"
    }

插件对外接口  
插件可以对外提供 JS方法 和 组件

    // pageA.js
    var WS = require('wsplugin');
    WS.dateFormat();
    // pageA.json
    {
        "usingComponents": {
            "itemgroup": "plugin://wsplugin/itemgroup"
        }
    }


上传和发布  
插件需要像小程序一样预览和上传, 没有体验版，但可以多个版本在线

插件请求签名  
插件在使用`wx.request`等网络api时，需加请求头 `X-WECHAT-HOSTSIGN`, 用于验证请求来源于小程序插件

    X-WECHAT-HOSTSIGN: {noncestr, timestamp, signature}
    // appid 小程序的appid, token 插件的token 都可在设置中找到
    signature = sha1(APPID + noncestr + timestamp + token);


分包
---
对小程序进行分包，可以优化小程序首次启动的下载时间，以及在多团队共同开发时可以更好的解耦协作.

分包/主包 都不能大于2M，所有包加起来不能大于4M

`subPackages`字段声明分包, 首页必须在主包内。 分包之间资源互相独立，不能引用。

    {
      "pages":[
        "pages/index",
        "pages/logs"
      ],
      "subPackages": [
        {
          "root": "packageA",
          "pages": [
            "pages/cat",
            "pages/dog"
          ]
        }, {
          "root": "packageB",
          "pages": [
            "pages/apple",
            "pages/banana"
          ]
        }
      ]
    }

多线程
---
worker线程和主线程通过`worker.postMessage()`, `worker.onmessage`通信，worker线程运行于独立的全局上下文，参考 web worker.

    // app.json
    {
        "worker": "workers" // 指定worker文件的存放目录
    }

    // workers/workerA.js
    var utils = require('./utils'); // 只能require workers下的文件
    // worker线程的全局环境有 worker对象
    worker.onMessage(res => console.log(res));
    worker.postMessage(result);

    // pageA.js
    var worker = wx.createWorker('/workers/workerA.js'); // 绝对路径
    worker.postMessage({msg: 'hello worker'});

    // 只能有1个worker线程，结束worker用
    worker.terminate();

兼容处理
---
+ 版本号比较 `compareVersion`
+ 兼容api `wx.methodName`

        if(wx.openBluetoothAdapter) {
            wx.openBluetoothAdapter()
        }else {
            wx.showModal({
                title: '提示',
                content: '请更新微信版本'
            })
        }

+ 兼容参数 `wx.canIUse()`

        wx.showModal({
            success(res) {
                if(wx.canIUse('showModal.cancel')) {
                    console.log(res.cancel);
                }
            }
        })

+ 兼容组件 `wx.canIUse()`

        Page({
            data: {
                canIUse: wx.canIUse('cover-view')
            }
        })
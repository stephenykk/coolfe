小程序文档
==========

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

BaseEvent:
type
timestamp
target: {id, tagName, dataset}
currentTarget

CustomEvent extends BaseEvent:
detail 自定义事件所带的数据


TouchEvent extends BaseEvent:
touches: [{identifier, pageX, pageY, clientX, clientY}, canvasTouch = {identifier, x, y}]
changedTouches: [{...}]

canvas no bubble stage event

----

import include

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


*.wxs 可以被 *.wxml 文件或 *.wxs 文件引用

b.wxs
var a = require('./a.wxs');

c.wxml
    <wxs src="./a.wxs" module="a"></wxs>



Number
------
n.toString()
n.valueOf()
n.toLocaleString()
n.toFixed(n)
n.toExponential()
n.toPresision(n)

String
-----
s.toString()
s.valueOf()
s.charAt(n)
s.charCodeAt(n)
s.concat(str)
s.indexOf(str)
s.lastIndexOf(str)
s.localCompare(str)
s.match(re)
s.replace(reOrStr)
s.search(reOrStr)
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
dt.UTC()
dt.now()
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
Infinity
undefined
parseInt()
parseFloat()
isNaN()
isFinite()
decodeURI() / encodeURI()
decodeURIComponent() / encodeURIComponent()


wxss的扩展特性:
- 尺寸单位 `rpx`
- 样式导入 `@import 'common.wxss';`

组件的样式:
- style 设动态的样式 `<view style="color:{{color}} />`
- class 设静态的样式 `<view class="normal" />`

支持的选择器:
- .class
- #id
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

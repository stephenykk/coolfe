# 快应用文档

## 简介

2018 年 3 月份，由小米，OPPO，VIVO，华为等 10 家国内主流厂商成立了快应用联盟，从技术规范层面做了统一，并保证了开发者开发的快应用可以直接在所有的联盟内厂商的手机设备上运行。

## 开发环境

1. 安装 nodejs 8.0+
2. 手机安装调试器[资源下载](https://www.quickapp.cn/docCenter/post/69)
3. 手机系统比较旧的话，可能还需安装**平台预览版** (小程序框架运行时)
4. 安装 toolkit, `npm i -g hap-toolkit`, `hap -v`, 更新 `hap update --force`
5. 创建项目 `hap init <projectName>`
6. 安装项目依赖 `cd <projectFolder>`, `npm i`
7. 运行项目代码 `npm run watch`, `npm run server`
8. 手机打开调试器，扫描返回的二维码,预览页面

## 编译项目

`npm run build` 编译打包，生成 rpk 包

编译打包成功后，项目根目录下会生成文件夹：build、dist

- build：临时产出，包含编译后的页面 js，图片等
- dist：最终产出，包含 rpk 文件。其实是将 build 目录下的资源打包压缩为一个文件，后缀名为 rpk，这个 rpk 文件就是项目编译后的最终产出

**自动编译项目**

`npm run watch` 修改代码，自动重新编译项目

## 安装 rpk 包

编译项目产出了 rpk 包后，请打开手机调试器

> 确保手机与 PC 在同一局域网, 如果手机与 PC 不在同一局域网，可以使用 USB 在线更新和本地安装预览运行效果

1. 启动 HTTP 服务器  
   项目的根目录运行如下命令，启动本地服务器

   ```
       npm run server
       npm run server -- --port 8090 # 自定义端口
   ```

2. 在手机上扫码安装
   - 手机打开快应用调试器 --> 关闭"开启 USB 调试"
   - 点击"扫码安装"，扫描终端窗口中的二维码即可完成配置（若扫描不成功，可在浏览器中打开页面：http://localhost:<your port>，扫描页面中的二维码）
   - 点击在线更新唤起平台运行 rpk 包

## 编译打包工程

`npm run build` 编译后的工程目录在/build 生成的应用路径为/dist/.rpk

## 增加 release 签名

通过 openssl 命令等工具生成签名文件 private.pem、certificate.pem

```
    openssl req -newkey rsa:2048 -nodes -keyout private.pem -x509 -days 3650 -out certificate.pem
```

## 发布程序包

发布程序包前需要增加 release 签名, 生成的应用路径为/dist/.release.rpk

```
    npm run release
    npm run release -- --debug # 临时使用debug签名
```

## 项目结构

```
├── sign                      rpk包签名模块
│   └── debug                 调试环境
│       ├── certificate.pem   证书文件
│       └── private.pem       私钥文件
├── src
│   ├── Common                公用的资源和组件文件
│   │   └── logo.png          应用图标
│   ├── Demo                  页面目录
│   |   └── index.ux          页面文件，可自定义页面名称
│   ├── app.ux                APP文件，可引入公共脚本，暴露公共数据和方法等
│   └── manifest.json         项目配置文件，配置应用图标、页面路由等
└── package.json              定义项目需要的各种模块及配置信息
```

### 配置信息

```
{
  "package": "com.application.demo", // 包名
  "name": "我的快应用demo", // 包中文名
  "versionName": "1.0.0", // 版本号
  "versionCode": "1", // 每次发布要加1
  "minPlatformVersion": "1020", // 框架的最低版本
  "icon": "/Common/logo.png",
  "features": [ // 用到接口
    { "name": "system.prompt" },
    { "name": "system.router" },
    { "name": "system.shortcut" }
  ],
  "permissions": [
    { "origin": "*" }
  ],
  "config": { // 应用配置数据 可在页面访问到 this.$app.$data
    "logLevel": "off"
  },
  "router": { // 路由 在这里的页面才会被编译 一个目录一个页面
    "entry": "Demo",
    "pages": {
      "Demo": { // 页面目录
        "component": "index" // 页面文件
      },
      "DemoDetail": {
        "component": "index"
      },
      "About": {
        "component": "index"
      }
    },
    "widgets": {
      "CardDemo": {
        "name": "CardDemo",
        "description": "快应用卡片展示",
        "component": "index",
        "path": "/CardDemo",
        "features": []
      }
    }
  },
  "display": { // 页面显示配置
    "titleBarBackgroundColor": "#f2f2f2",
    "titleBarTextColor": "#414141",
    "menu": true,
    "pages": {
      "Demo": {
        "titleBarText": "示例页",
        "menu": false
      },
      "DemoDetail": {
        "titleBarText": "详情页"
      },
      "About": {
        "menu": false
      }
    }
  }
}
```

### 依赖引入

快应用中支持 ES6 的 module 标准，使用 import 引入 js 依赖，也支持 CommonJs 规范

```
// 首先在 `manifest.json` 中配置 `fetch` 接口

// require引入
const fetch = require('@system.fetch')

// import引入
import fetch from '@system.fetch'
```

@import 方式引入外部样式

```
// 引入外部css文件
@import './style.css';

// 引入外部less文件
@import './style.less';
```

通过`<import>`标签引入自定义组件

```
<import name="my-component" src="./myComponent"></import>

<template>
  <div>
    <my-component></my-component>
  </div>
</template>
</script>
```

## 调试

### 日志

manifest.json 中修改日志级别

```
{
  "config": {
    "logLevel": "debug"
  }
}
```

### 查看日志

开发者可以使用 Android Studio 的 Android Monitor 输出来查看日志，还有下文主要介绍的通过 chrome devtools 调试界面 调试手机 app 端的页面

### 远程调试

远程调试准备
远程调试指的是通过快应用调试器、hap-toolkit 的远程调试命令 、chrome devtools 调试界面，来调试手机 app 端的页面

远程调试依赖 chrome 浏览器 ，chrome devtools 会与手机上调试工具建立 socket 连接，实时获取修改应用运行数据，进行调试

#### WIFI 调试 (手机和 PC 在同一局域网)

1. `npm run server`
2. 手机快应用调试器关闭 _开启 USB 调试_
3. 手机快应用调试器点击 *扫码安装*按钮, 安装 rpk 文件
4. 手机快应用调试器点击*开始调试*按钮, 会在手机打开应用，并在电脑激活 chrome devtools

### USB 调试 (手机和 PC 可不在同一局域网)

1. `npm run server`
2. 手机设置 -- 开发者选项 -- USB 调试
3. 手机快应用调试器选中 _开启 USB 调试_，手机通过 USB 数据线连接 PC
4. 手机快应用调试器点击*在线更新*按钮，安装 rpk 文件
5. 手机快应用调试器点击 _开始调试_ 按钮 **注意需要在电脑上安装手机的驱动**

## 框架

### 页面生命周期

页面的生命周期：onInit、onReady、onShow、onHide、onDestroy、onBackPress、onMenuPress
APP 的生命周期：onCreate、onDestroy

- `onInit`  
  表示 ViewModel 的数据已经准备好，可以开始使用页面中的数据

```
private: {
  // 生命周期的文本列表
  lcList: []
},
onInit () {
  this.$page.setTitleBar({ text: '生命周期' })

  this.lcList.push('onInit')

  console.info(`触发：onInit`)
  console.info(`执行：获取ViewModel的lcList属性：${this.lcList}`)   // 执行：获取ViewModel的lcList属性：onInit
  // $app信息
  console.info(`获取：manifest.json的config.data的数据：${this.$app.$data.name}`)
  console.info(`获取：APP文件中的数据：${this.$app.$def.data1.name}`)
  console.info(`执行：APP文件中的方法`, this.$app.$def.method1())
}
```

- `onReady`  
  表示 ViewModel 的模板已经编译完成，可以开始获取 DOM 节点（如：this.\$element(idxxx)）

```
onReady () {
  this.lcList.push('onReady')

  console.info(`触发：onReady`)
  console.info(`执行：获取模板节点：${this.$rootElement()}`)   // 执行：获取模板节点：<div attr={} style={"flexDirection":"column"}>...</div>
}
```

- `onShow`, `onHide`
  判断页面的显示状态，可以调用 ViewModel 的\$visible 属性

```
onShow () {
  this.lcList.push('onShow')

  console.info(`触发：onShow`)
  console.info(`执行：获取页面显示状态属性：${this.$visible}`)  // true
},
onHide () {
  this.lcList.push('onHide')

  console.info(`触发：onHide`)
  console.info(`执行：获取页面显示状态属性：${this.$visible}`)  // false
}
```

- `onDestroy`  
  页面被销毁时调用，被销毁的可能原因有：用户从当前页面返回到上一页，或者用户打开了太多的页面，框架自动销毁掉部分页面，避免占用资源

判断页面是否处于被销毁状态，可以调用 ViewModel 的\$valid 属性

```
onDestroy () {
  console.info(`触发：onDestroy`)
  console.info(`执行：页面要被销毁，销毁状态：${this.$valid}，应该做取消接口订阅监听的操作: geolocation.unsubscribe()`)    // true，即将销毁
  setTimeout(function () {
    console.info(`执行：页面已被销毁，不会执行`)                // 页面已销毁，不会执行
  }.bind(this), 0)
}
```

_setTimeout 之类的异步操作绑定在了当前页面上，因此当页面销毁之后异步调用不会执行_

- `onBackPreess`  
  当用户点击返回实体按键、左上角返回菜单、调用返回 API 时触发该事件

如果事件响应方法最后返回 true 表示不返回，自己处理业务逻辑（完毕后开发者自行调用 API router.back() 返回）；否则：不返回数据，或者返回其它数据：表示遵循系统逻辑：返回到上一页

```
onBackPress () {
  console.info(`触发：onBackPress`)

  // true：表示自己处理；否则默认返回上一页
  // return true
}
```

- `onMenuPress`  
  点击标题栏右侧的`...`菜单按钮

### 页面状态

- 显示 this.\$visible
- 隐藏 this.\$visible
- 销毁 this.\$valid

### App 的生命周期

`onCreate` and `onDestroy`

```
import { natives } from './util/asyncNatives'

export default {
  onCreate() {
    console.info('Application onCreate')
  },
  onDestroy() {
    console.info('Application onDestroy')
  },
  // 暴露给所有页面，在页面中通过：this.$app.$def.method1()访问
  method1() {
    console.info('这是APP的方法')
  },
  // 暴露给所有页面，在页面中通过：this.$app.$def.data1访问
  data1: {
    name: '这是APP存的数据'
  },
  natives
}
```

在 app.ux 中，开发者可以做一些独立于页面的操作。比如：引入公共的 JS 资源，然后暴露给所有页面

在 app.ux 中，通过 this.\$def 访问 app.ux 中定义的数据和方法

### 关于$app 与$app.\$def

$app 与$app.$def（后面简称$def）是两个不同的对象；

前者代表框架暴露给开发者的 APP 对象；后者代表开发者在 app.ux 中导出的对象，放置业务相关的全局数据和方法；

前者对象拥有 onCreate, onDestroy 生命周期；当应用启动时会执行 onCreate 方法，里面执行 this.variable1 的赋值是在\$app 对象上；

后者对象中的 onCreate, onDestroy 方法并不会执行，作用仅仅只是把方法复制到前者对象上而已；

这些全局方法在页面中：既可以通过 this.$app.method1()调用，也可以通过 this.$app.$def.method1()调用；不同之处在于前者可以取到之前赋值的 variable1 变量，而后者不可以取到（因为之前的赋值是在$app 对象上执行的）；

### 页面样式和布局

#### 盒模型

框架使用 border-box 模型，暂不支持 content-box 模型与 box-sizing 属性

### 长度单位

支持`px` 和 '%' 单位.  
在这里, `px`是已适配手机屏幕，类似`rem`的单位

> 项目基准宽度的设置在 `manifest.json`中的 config.designWidth, 默认 750; _即默认 750 分之 1 作为 1 个单位_

### 设置样式

- 内联样式 _动态样式_
- 外部样式 _静态样式_

### 支持选择器

- tag
- id
- class
- .class1, .class2
- .parent > .child
- .parent .son

### flex 布局

div 常用作 flex 容器，text, a, span, label 常作为文本容器, 其他组件不能直接放置文本

```
<template>
  <div class="tutorial-page">
    <div class="item">
      <text>item1</text>
    </div>
    <div class="item">
      <text>item2</text>
    </div>
  </div>
</template>

<style>
  .tutorial-page {
    /* 交叉轴居中 */
    align-items: center;
    /* 纵向排列 */
    flex-direction: column;
  }
  .tutorial-page > .item {
    /* 有剩余空间时，允许被拉伸 */
    /*flex-grow: 1;*/
    /* 空间不够用时，不允许被压缩 */
    flex-shrink: 0;
    /* 主轴居中 */
    justify-content: center;
    width: 200px;
    height: 100px;
    margin: 10px;
    background-color: #FF0000;
  }
</style>
```

### 动态修改样式

- 修改 class
- 修改内联样式 _(styleObj/styleStr/styleAttrVal)_

```
<template>
  <div style="flex-direction: column;">
    <!-- 修改 class -->
    <text class="normal-text {{ className }}" onclick="changeClassName">点击我修改文字颜色</text>
    <!-- 修改内联 style -->
    <text style="color: {{ textColor }}" onclick="changeInlineStyle">点击我修改文字颜色</text>
    <!-- 修改绑定的对象 (1030+) -->
    <text style="{{ styleObj }}" onclick="changeStyleObj">点击我修改文字颜色</text>
    <!-- 修改绑定的样式字符串 (1030+) -->
    <text style="{{ styleText }}" onclick="changeStyleText">点击我修改文字颜色</text>
  </div>
</template>

<style>
  .normal-text {
    font-weight: bold;
  }
  .text-blue {
    color: #0faeff;
  }
  .text-red {
    color: #f76160;
  }
</style>

<script>
  export default {
    private: {
      className: 'text-blue',
      textColor: '#0faeff',
      styleObj: {
        color: 'red'
      },
      styleText: 'color: blue'
    },
    onInit () {
      this.$page.setTitleBar({ text: '动态修改样式' })
    },
    changeClassName () {
      this.className = 'text-red'
    },
    changeInlineStyle () {
      this.textColor = '#f76160'
    },
    changeStyleObj () {
      this.styleObj = {
        color: 'yellow'
      }
    },
    changeStyleText () {
      this.styleText = 'color: green'
    }
  }
</script>
```

### 引入 less

需安装`less` , `less-loader`

```
<template>
  <div class="tutorial-page">
    <text id="title">less示例!</text>
  </div>
</template>

<style lang="less">
  /* 引入外部less文件 */
  @import './style.less';
  /* 使用less */
  .tutorial-page {
    justify-content: center;
    background-color: #00beaf;

    #title {
      color: #FF0000;
    }
  }
</style>
```

### 用 postcss 解析 css

1. 安装 `postcss-loader` 和 `precss`
2. 加配置文件`postcss.config.js`

   ```
   module.exports = {
       plugins: [require('precss')]
   }
   ```

3. 例子

```
<style lang="postcss">

  /* 使用postcss */
  .tutorial-page {
    justify-content: center;
    background-color: #00beaf;
    #title {
      color: #FF0000;
    }
  }
</style>
```

## 框架指令

### for

```
<template>
  <div class="tutorial-page">
    <!-- 方式1：默认$item代表数组中的元素, $idx代表数组中的索引 -->
    <div class="tutorial-row" for="{{list}}">
      <text>{{$idx}}.{{$item.name}}</text>
    </div>
    <!-- 方式2：自定义元素变量名称 -->
    <div class="tutorial-row" for="value in list">
      <text>{{$idx}}.{{value.name}}</text>
    </div>
    <!-- 方式3：自定义元素、索引的变量名称  *第一个参数代表索引 这个有点不习惯* -->
    <div class="tutorial-row" for="(personIndex, personItem) in list">
      <text>{{personIndex}}.{{personItem.name}}</text>
    </div>
  </div>
</template>

<style lang="less">
  .tutorial-page {
    flex-direction: column;
    .tutorial-row {
      width: 85%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
</style>

<script>
  export default {
    private: {
      list: [
        {name: 'aa'},
        { name: 'bb' }
      ]
    },
    onInit () {
      this.$page.setTitleBar({ text: '指令for' })
    }
  }
</script>
```

### if and show

`if/elif/else` 控制是否渲染组件, `show`控制是否显示组件

```
<template>
  <div class="tutorial-page">
    <text onclick="onClickShow">显示隐藏：</text>
    <text show="{{showVar}}">show: 渲染但控制是否显示</text>

    <text onclick="onClickCondition">条件指令：</text>
    <text if="{{conditionVar === 1}}">if: if条件</text>
    <text elif="{{conditionVar === 2}}">elif: elif条件</text>
    <text else>else: 其余</text>
  </div>
</template>

<style lang="less">
  .tutorial-page {
    flex-direction: column;
  }
</style>

<script>
  export default {
    private: {
      showVar: true,
      conditionVar: 1
    },
    onInit () {
      this.$page.setTitleBar({ text: '指令if与指令show' })
    },
    onClickShow () {
      this.showVar = !this.showVar
    },
    onClickCondition () {
      this.conditionVar = ++this.conditionVar % 3
    }
  }
</script>
```

### block

block 组件表达逻辑区块，本身不会渲染任何内容

```
<template>
  <div class="tutorial-page">
    <text onclick="toggleCityList">点击：控制是否显示城市</text>
    <div class="city" for="city in cities" if="{{showCityList === 1}}">
      <text>城市：{{city.name}}</text>
      <block if="{{city.showSpots}}" for="{{city.spots}}">
        <text>景点：{{$item.name}}</text>
      </block>
    </div>
  </div>
</template>
```

### slot

调用自定义组件时，注入自己的内容

```
<!-- par1.ux -->
<template>
  <div>
    <text>{{ header }}</text>
    <slot></slot>
    <text>{{ footer }}</text>
  </div>
</template>

<script>
  export default {
    props: [
      'header', 'footer'
    ]
  }
</script>

<!-- index.ux -->
<import src="./part1"></import>
<template>
  <part1 class="component" header="{{header}}" footer="{{footer}}">
    <text>slot节点内容</text>
  </part1>
</template>

<style>
  .component {
    flex-direction: column;
  }
</style>

<script>
  export default {
    private: {
      header: 'HEAD',
      footer: 'FOOT'
    },
    onInit () {
      this.$page.setTitleBar({ text: '组件slot' })
    }
  }
</script>
```

## 页面传参

### 页面跳转

- a 组件
- router 对象

### a 组件跳转

```
<template>
  <div class="tutorial-page">
    <!-- 以'/'开头的应用内页面的路径 -->
    <a href="/PageParams/receiveparams">跳转到接收参数页面</a>
    <!-- 以非'/'开头的应用内页面的名称 -->
    <a href="PageParams/receiveparams">跳转到接收参数页面</a>
    <!-- 特殊的,如果uri的值是'/',则跳转到path为'/'的页,没有则跳转到首页-->
    <a href="/">跳转到首页</a>
  </div>
</template>
```

> 组件 a 还提供调起电话、短信、邮件的功能和加载网页的能力

```
<template>
  <div class="tutorial-page">
    <!-- 包含完整schema的uri -->
    <a href="tel:10086">调起电话</a>
    <a href="sms:10086">调起短信</a>
    <a href="mailto:example@xx.com">调起邮件</a>
    <!-- 打开webview加载网页 -->
    <a href="https://www.baidu.com/">打开网页</a>
  </div>
</template>
```

a 组件传参

```
<template>
  <div class="tutorial-page">
    <!-- 添加参数 -->
    <a href="/PageParams/receiveparams?key=Hello, world!">携带参数key1跳转</a>
    <!-- 添加变量参数 -->
    <a href="/PageParams/receiveparams?key={{title}}">携带参数key2跳转</a>
  </div>
</template>
```

### router 对象跳转

router 接口使用，需先导入模块, `router.push()`, `router.replace()`, `router.back()` , `router.clear()`

> 注： router 接口不能调起电话 短信和邮箱

```
<template>
  <div class="tutorial-page">
    <input class="btn" type="button" value="跳转到接收参数页面" onclick="routePagePush"></input>
    <input class="btn" type="button" value="跳转到接收参数页面，当前页面无法返回" onclick="routePageReplace"></input>
    <input class="btn" type="button" value="返回上一页" onclick="routePageBack"></input>
    <input class="btn" type="button" value="清空页面记录，仅保留当前页面" onclick="routePageClear"></input>
  </div>
</template>

<style>
  .tutorial-page {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .btn {
    width: 550px;
    height: 86px;
    margin-top: 75px;
    border-radius: 43px;
    background-color: #09ba07;
    font-size: 30px;
    color: #ffffff;
  }
</style>

<script>
  // 导入模块
  import router from '@system.router'

  export default {
    onInit () {
      this.$page.setTitleBar({ text: '接口router切换页面' })
    },
    routePagePush () {
      // 跳转到应用内的某个页面
      router.push({
        uri: '/PageParams/receiveparams'
      })
    },
    routePageReplace () {
      // 跳转到应用内的某个页面，当前页面无法返回
      router.replace({
        uri: '/PageParams/receiveparams'
      })
    },
    routePageBack () {
      // 返回上一页面
      router.back()
    },
    routePageClear () {
      // 清空所有历史页面记录，仅保留当前页面
      router.clear()
    }
  }
</script>
```

router 接口传参

```
<script>
  // 导入模块
  import router from '@system.router'

  export default {
    private: {
      title: 'Hello, world!'
    },
    onInit () {
      this.$page.setTitleBar({ text: '接口router切换页面并传递参数' })
    },
    routePagePushWithParams () {
      // 跳转到应用内的某个页面
      router.push({
        uri: '/PageParams/receiveparams',
        params: { key: this.title }
      })
    },
    routePageReplaceWithParams () {
      // 跳转到应用内的某个页面，当前页面无法返回
      router.replace({
        uri: '/PageParams/receiveparams',
        params: { key: this.title }
      })
    }
  }
</script>
```

### 接收参数

页面对象的`protected`属性定义要接收的参数

- protected 内定义的属性，允许被应用内部页面请求传递的数据覆盖，不允许被应用外部请求传递的数据覆盖
- 若希望参数允许被应用外部请求传递的数据覆盖，请在页面的 ViewModel 的 public 属性中声明使用的属性

```
<template>
  <div class="tutorial-page">
    <text>page</text>
    <!-- template中显示页面传递的参数 -->
    <text>{{key}}</text>
  </div>
</template>

<style>
  .tutorial-page {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  export default {
    protected: {
      key: ''
    },
    onInit () {
      this.$page.setTitleBar({ text: '接收参数' })

      // js中输出页面传递的参数
      console.info('key: ' + this.key)
    }
  }
</script>
```

### 回传参数

借助 app 缓存数据

```
<script>
  export default {
    onCreate () {
      // 初始化 app 缓存的数据
      this.dataCache = {}
    },
    /**
     * 获取 app 缓存的数据
     * @param key
     */
    getAppData (key) {
      return this.dataCache[key]
    },
    /**
     * 设置 app 缓存的数据
     * @param key
     * @param val
     */
    setAppData (key, val) {
      this.dataCache[key] = val
    }
  }
</script>
```

```
<!-- pageA -->
<script>
  export default {
    private: {
      msg: ''
    },
    onInit () {
      this.$page.setTitleBar({ text: '页面A' })
    },
    onShow () {
      // 页面被切换显示时，从数据中检查是否有页面B传递来的数据
      const data = this.$app.getAppData('dataFromB')
      if (data && data.destPageName === 'pageA') {
        // 获取回传给本页面的数据
        this.msg = data.params && data.params.msg
      }
    }
  }
</script>
```

```
<!-- pageB -->
<template>
  <div class="tutorial-page">
    <text>页面B</text>
    <input style="width: 450px;" placeholder="请输入回传给页面A的信息" onchange="updateMsg"/>
  </div>
</template>

<style>
  .tutorial-page {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  export default {
    private: {
      msg: ''
    },
    onInit () {
      this.$page.setTitleBar({ text: '页面B' })
    },
    onHide () {
      // 页面被切换隐藏时，将要传递的数据对象写入
      this.$app.setAppData('dataFromB', {
        destPageName: 'pageA',
        params: {
          msg: this.msg
        }
      })
    },
    updateMsg (evt) {
      // 更新input输入的信息文本
      this.msg = evt.text
    }
  }
</script>
```

## 事件监听和触发

- 监听与移除监听事件：$on()、$off
- 触发 ViewModel 事件：\$emit()
- 监听原生组件事件
- 触发原生组件事件：\$emitElement()

### \$on(evtName, handler)

在当前页面注册监听事件， 可监听$emit()、 $dispatch()、 \$broadcast()等触发的自定义事件，不能用于注册组件节点的事件响应

```
export default {
  onInit() {
    this.$on('customEvtType1', this.customEvtType1Handler)
  },
  customEvtType1Handler(evt) {
    // 事件类型，事件参数
    console.info(
      `触发事件：类型：${evt.type}, 参数： ${JSON.stringify(evt.detail)}`
    )
  }
}
```

### \$off(evtName, [handler])

移除事件监听，参数 fnHandler 为可选，传递仅移除指定的响应函数，不传递则移除此事件的所有监听

```
export default {
  removeEventHandler() {
    // 不传递fnHandler：移除所有监听
    this.$off('customEvtType1')
    // 传递fnHandler：移除指定的监听函数
    this.$off('customEvtType1', this.customEvtType1Handler)
  }
}
```

### \$emit(eventName, evtDetail)

触发当前实例监听事件函数，与 \$on() 配合使用

```
export default {
  emitEvent() {
    this.$emit('customEvtType1', { params: '参数内容' })
  }
}
```

> 注意：$emit() 目前只触发 $on 所监听的事件

### 监听原生组件事件

原生组件支持一系列事件，如通用事件（如：click, disappear）、组件专有事件（如：focus）

通用事件简写
如：onclick,onchange 可简写成 @click,@change

```
<template>
  <div class="tutorial-page">
    <text id="elNode1" class="{{ elClassName + 1 }}" disabled="false" onclick="onClickHandler">组件节点1</text>
    <text id="elNode2" class="class-static-1 {{ elClassName + 2 }}" onclick="onClickHandler2('参数1', argName)">组件节点2</text>
  </div>
</template>

<style lang="less">
  .tutorial-page {
    flex-direction: column;
  }
</style>

<script>
  export default {
    private: {
      elClassName: 'class-dynamic',
      argName: '动态参数'
    },
    onClickHandler (evt) {
      // 事件类型，参数详情
      console.info(`触发事件：类型：${evt.type}, 详情： ${JSON.stringify(evt.detail)}`);

      if (evt.target) {
        console.info(`触发事件：节点：${evt.target.id}, ${evt.target.attr.disabled}`)
      }
    },
    onClickHandler2 (arg1, arg2, evt) {
      // 事件类型，事件参数，target
      console.info(`触发事件：类型：${evt.type}, 参数： ${arg1}, ${arg2}`);
    }
  }
</script>
```

### 触发原生组件事件

- 用户手动触发 如 点击
- 脚本触发 `this.$emitElement(evtName, evtDetail, id)`  
   触发指定组件 id 事件，通过 evt.detail 获取传递的参数；该方法对自定义组件无效

```
<template>
  <div class="tutorial-page">
    <text onclick="emitElement">触发组件节点的事件：click</text>
    <text id="elNode1" class="{{ elClassName + 1 }}" disabled="false" onclick="onClickHandler">组件节点1</text>
    <text id="elNode2" class="class-static-1 {{ elClassName + 2 }}" onclick="onClickHandler2('参数1', argName)">组件节点2</text>
  </div>
</template>

<style lang="less">
  .tutorial-page {
    flex-direction: column;
  }
</style>

<script>
  export default {
    private: {
      elClassName: 'class-dynamic',
      argName: '动态参数'
    },
    onClickHandler (evt) {
      // 事件类型，参数详情
      console.info(`触发事件：类型：${evt.type}, 详情： ${JSON.stringify(evt.detail)}`);

      if (evt.target) {
        console.info(`触发事件：节点：${evt.target.id}, ${evt.target.attr.disabled}`)
      }
    },
    onClickHandler2 (arg1, arg2, evt) {
      // 事件类型，事件参数，target
      console.info(`触发事件：类型：${evt.type}, 参数： ${arg1}, ${arg2}`);
    },
    emitElement () {
      // 注意：通过此类方式的事件不会携带target属性，开发者可以通过detail参数实现
      this.$emitElement('click', { params: '参数内容' }, 'elNode1')
    }
  }
</script>
```

### 使用原生组件的冒泡功能

1040+ 版本对某些通用事件开放了冒泡功能

```
<template>
  <div class="tutorial-page">
    <div id="parentNode" class="outer" onclick="onParentClickHandler">
      <text class="inner" id="childNode1" onclick="onChildClickHandler">子组件1</text>
      <text class="inner" id="childNode2">子组件2</text>
    </div>
  </div>
</template>

<style>
  .outer {
    width: 750px;
    height: 500px;
    background-color: #eeeeee;
  }

  .inner {
    flex: 1;
    margin: 100px;
    background-color: skyblue;
  }
</style>

<script>
  export default {
    onParentClickHandler (evt) {
      // 事件类型
      console.info(`触发父组件事件：类型：${evt.type}`);

      if (evt.target) {
        console.info(`事件目标节点：${this.getNodeName(evt.target)}`)
      }

      if (evt.currentTarget) {
        console.info(`事件发生节点：${this.getNodeName(evt.currentTarget)}`)
      }
    },
    onChildClickHandler (evt) {
      // 事件类型
      console.info(`触发子组件事件：类型：${evt.type}`)

      if (evt.target) {
        console.info(`事件目标节点：${this.getNodeName(evt.target)}`)
      }

      if (evt.currentTarget) {
        console.info(`事件发生节点：${this.getNodeName(evt.currentTarget)}`)
      }
    },
    getNodeName (node) {
      const parentNode = this.$element('parentNode')
      const childNode1 = this.$element('childNode1')
      const childNode2 = this.$element('childNode2')
      let name = ''

      switch (node) {
        case parentNode: {
          name = 'parentNode'
          break
        }
        case childNode1: {
          name = 'childNode1'
          break
        }
        case childNode2: {
          name = 'childNode2'
          break
        }
      }

      return name
    }
  }
</script>
```

## 父子组件通信

### 编写自定义组件

```
<template>
  <div class="my-cmp">
    <text>{{ prop1 }}</text>
    <text>{{ prop2Object.name }}</text>
  </div>
</template>

<script>
  // 子组件
  export default {
    props: [
      'prop1',
      'prop2Object'
    ],
    data: {},
    onInit () {
      console.info(`外部传递的数据：`, this.prop1, this.prop2Object)
    }
  }
</script>
```

自定义组件比页面组件的不同之处在于多了一个 props 属性，用于声明该组件可接受的外部数据传递；props 是一个数组，数组中每个元素是暴露的属性名称(驼峰风格 同 vue)

### 使用自定义组件

`<import name="comp-part1" src="./part1"></import>` name 指定标签名

```
<import name="comp-part1" src="./part1"></import>

<template>
  <div class="tutorial-page">
    <text class="tutorial-title">页面组件：</text>
    <text>{{ data1 }}</text>
    <text>{{ data2.name }}</text>
    <text onclick="evtType1Emit">触发$broadcast()</text>

    <comp-part1 prop1="{{data1}}" prop2-object="{{data2}}" onevt-type3="evtTypeHandler"></comp-part1>
  </div>
</template>

<script>
  // 父组件
  export default {
    private: {
      data1: 'string',
      data2: {
        name: 'object'
      }
    },
    onInit () {
      this.$page.setTitleBar({ text: '父子组件通信' })
    },
    evtTypeHandler (evt) {
      console.info(`父组件：事件响应: `, evt.type, evt.detail)
      // 结束事件传递
      // evt.stop()
    },
    evtType1Emit () {
      this.$broadcast('evtType1', { params: '额外参数' })
    }
  }
</script>
```

### 传递数据与数据改造

- 父子组件通信 props
- 子组件对传入数据修改 \$watch(props, changeOwnData)

```
<script>
  // 子组件
  export default {
    props: [
      'prop1',
      'prop2Object'
    ],
    data () {
      return {
        upperProp1: this.prop1
      }
    },
    onInit () {
      console.info(`外部传递的数据：`, this.prop1, this.prop2Object)

      // 监听数据变化
      this.$watch('prop1', 'watchPropsChange')
      this.$watch('prop2Object.name', 'watchPropsChange')
    },
    /**
     * 监听数据变化，你可以对数据处理后，设置值到data上
     * @param newV
     * @param oldV
     */
    watchPropsChange (newV, oldV) {
      console.info(`监听数据变化：`, newV, oldV)
      this.upperProp1 = newV && newV.toUpperCase()
    }
  }
</script>
```

### props 默认值

props 同 vue，可以为数组或对象

```
<script>
  // 子组件
  export default {
    props: {
      prop1: {
        default: 'Hello' //默认值
      },
      prop2Object: {} //不设置默认值
    },
    onInit() {
      console.info(`外部传递的数据：`, this.prop1, this.prop2Object);
    }
  }
</script>
```

### props 校验

1. 必填检查
2. 类型检查
3. 函数检查

```
<script>
  // 子组件
  export default {
    props: {
      prop1: Number,  // 仅类型检查
      prop2Object: {
        type: String,  // 类型检查
        required: true,  // 必填项检查
        validator: function (value) {  //函数检查
          // 这个值必须匹配下列字符串中的一个
          return ['success', 'warning', 'danger'].indexOf(value) !== -1
        }
      }
    },
    onInit() {
      console.info(`外部传递的数据：`, this.prop1, this.prop2Object);
    }
  }
</script>
```

### 父子组件间的数据交互

- 父组件传对象 prop，子组件可直接修改 prop 内的属性, 父组件能获取修改值
- 父组件$broadcast()触发事件，向下传递，子组件$on()监听
- 子组件$dispatch()触发事件，并冒泡, 父组件$on()监听
- 子组件\$emit()触发节点绑定的事件，执行父组件的回调方法

```
<script>
  // 子组件
  export default {
    props: [
      'prop1',
      'prop2Object'
    ],
    data () {
      return {
        upperProp1: this.prop1
      }
    },
    onInit () {
      console.info(`外部传递的数据：`, this.prop1, this.prop2Object)
      // 绑定VM的自定义事件
      this.$on('evtType1', this.evtTypeHandler)
      this.$on('evtType2', this.evtTypeHandler)
    },
    evtTypeHandler (evt) {
      console.info(`子组件：事件响应: `, evt.type, evt.detail)
      // 结束事件传递
      // evt.stop()
    },
    evtType2Emit () {
      this.$dispatch('evtType2', { params: '额外参数' })
    },
    evtType3Emit () {
      this.$emit('evtType3', { params: '额外参数' })
    }
  }
</script>
```

### 兄弟组件间的交互

- 发布/订阅(Pub/Sub)模式 (eventBus)
- 互相持有对方的 vm

```
<!-- 订阅端 -->
<template>
  <div class="tutorial-page">
    <text class="tutorial-title">自定义组件2:</text>
    <text>处理消息：{{msg}}</text>
    <text>事件内容：{{eventDetail}}</text>
  </div>
</template>

<style lang="less">
</style>

<script>
  // 子组件: part2
  export default {
    props: [],
    data () {
      return {
        msg: null,
        eventDetail: null
      }
    },
    processMessage (msg) {
      const now = (new Date).toISOString()
      this.msg = `${now}: ${msg}`
    },
    /**
     * 通过events对象：绑定事件
     */
    events: {
      customEventInVm2 (evt) {
        const now = (new Date).toISOString()
        this.eventDetail = `${now}: ${evt.detail}`
      }
    }
  }
</script>

<!-- 发布端 -->
<template>
  <div class="tutorial-page">
    <text class="tutorial-title">自定义组件3:</text>
    <text onclick="sendMesssage">点击发送消息</text>
  </div>
</template>

<style lang="less">
</style>

<script>
  // 子组件: part3
  export default {
    sendMesssage () {
      if (this.previousVm) {
        // Way1. 调用方法
        this.previousVm.processMessage('兄弟之间通信的消息内容')
        // Way2. 触发事件
        this.previousVm.$emit('customEventInVm2', '兄弟之间通信的消息内容')
      }
    }
  }
</script>
```

```
<import name="comp-part2" src="./part2"></import>
<import name="comp-part3" src="./part3"></import>

<template>
  <div class="tutorial-page">
    <!-- 兄弟VM通信 -->
    <comp-part2 id="sibling1"></comp-part2>
    <comp-part3 id="sibling2"></comp-part3>
  </div>
</template>

<style lang="less">
</style>

<script>
  // 父组件
  export default {
    onReady () {
      this.establishRef()
    },
    /**
     * 建立相互VM的引用
     */
    establishRef () {
      const siblingVm1 = this.$vm('sibling1')
      const siblingVm2 = this.$vm('sibling2')

      siblingVm1.parentVm = this
      siblingVm1.nextVm = siblingVm2
      siblingVm2.parentVm = this
      siblingVm2.previousVm = siblingVm1
    }
  }
</script>
```

## 使用 async

支持 async，需注入 polyfill  
把@babel/runtime/regenerator 注入到 app.ux 中，因为这个文件是所有页面脚本执行前都会执行的

```
<script>
  export default {
    private: {},
    onInit () {
      this.$page.setTitleBar({ text: '支持AsyncAwait' })
    },
    onReady () {
      this.testAsync()
    },
    /**
     * 测试Async
     */
    testAsync () {
      async function bar () {
        return 'bar'
      }
      async function foo() {
        const ret1 = await bar();
        console.info('PAGE: foo: ', ret1)
      }
      foo()
    }
  }
</script>
```

### native 接口中使用 async

Native 接口直接返回 Promise 1010+
该方法仅支持 platformVersion 1010+ 的异步接口。

### Native 接口返回 callback

```
// asyncNatives.js
import nativeFetch from '@system.fetch'

const natives = {
  /**
   * 网络请求
   * @param options
   * @return {Promise}
   */
  async fetch(options) {
    const p1 = new Promise((resolve, reject) => {
      options.success = function(data, code) {
        resolve({ data, code })
      }
      options.fail = function(data, code) {
        reject({ data, code })
      }
      nativeFetch.fetch(options)
    })
    return p1
  }
}

export { natives }
```

```
<script>
  export default {
    onReady () {
      this.testMockNatives()
    },
    /**
     * 测试async的native接口
     */
    async testMockNatives () {
      const { natives } = this.$app.$def
      // 成功示例
      const ret1 = await natives.fetch({
        url: 'https://statres.quickapp.cn/quickapp/quickapptool/release/platform/quickapp_platform.json',
      })
      console.info('fetch成功结果: ', JSON.stringify(ret1))
      // 失败示例
      const ret2 = await natives.fetch({
        url: 'http://www.Its_A_Wrong_URL.com/'
      })
      console.info('fetch失败结果: ', JSON.stringify(ret2))
    }
  }
</script>
```

## 优化技巧

### 函数共享

应用是多页面共享同一个 V8 Context，而 H5 页面通常是一个页面一个 V8 Context

开发者需要了解页面与 APP 之间，页面与页面之间的共享方式。

可以通过使用框架 API 实现函数共享, `this.$app.$def.myMethod`

### 性能优化

- 简化 viewModel 数据, _同样是 getter,setter 改造方案？对象数组，精简不需要的字段_
- 合理使用后代选择器, 减少节点匹配的性能损耗 _少用 tag, 少层级, class 名专指度高_
- 懒加载 推迟不可见区域的渲染 _图片懒加载 组件懒加载, list-item 滚动加载更多，tab 点击才渲染_

### 错误处理

避免读取 undefined 上的属性报错

```
<text> {{ a && a.b && a.b.c}} </text>
<!-- or -->
<!-- quickApp 插值表达式可以调用方法 同vue, Good -->
<text> {{checkEmpty(a, 'b', 'c')}}</text>

export default {
  checkEmpty(...args) {// 类似 —.get(a, 'b.c', false)
    let ret
    if (args.length > 0) {
      ret = args.shift()
      let tmp
      while (ret && args.length > 0) {
        tmp = args.shift()
        ret = ret[tmp]
      }
    }
    return ret || false
  }
}
```

装饰 JSON.parse 方法, 避免 JSON.parse() 解析报错

```
export function parseProxy() {
  const rawParse = JSON.parse
  JSON.parse = function(str, defaults) {
    try {
      return rawParse(str)
    } catch (err) {
      console.error(`JSON解析失败：${str}, ${err.stack}`)
      return defaults
    }
  }
}
```

页面出栈，viewModel 上的数据也会跟着销毁, 回调里方法 vm 的数据报错, 应该用\$valid 判断页面状态, 或者如下

```
/**
 * 在Function原型上定义bindPage方法：将回调函数绑定到页面对象，页面销毁时，不执行回调函数
 */
export function bindPageLC() {
  Function.prototype.bindPage = function(vmInst) {
    const fn = this
    return function() {
      if (!vmInst) {
        throw new Error(`使用错误：请传递VM对象`)
      }
      if (vmInst.$valid) {
        return fn.apply(vmInst, arguments)
      } else {
        console.info(`页面销毁时，不执行回调函数`)
      }
    }
  }
}

export default {
  private: {},
  request() {
    // 调用bindPage(this)返回：绑定了页面对象的回调函数，当页面销毁时，不执行回调函数
    fetch.fetch({
      success: function(ret) {
        // 数据操作等
      }.bindPage(this)
    })
  }
}
```

堆栈溢出例子

```
<template>
  <div id="content">
    <input type="button" class="button" @click="onTestClick" value="会引发堆栈溢出"/>
    <text>{{ stateText }}</text>
  </div>
</template>

<script>
  export default {
    private: {
      mContentNode: null,
      stateText: 'init state'
    },
    onReady() {
      /* 如将 $element('id')获取到内容，赋值给成员变量，则有可能引发堆栈溢出 */
      this.mContentNode = this.$element('content')
    },
    onTestClick() {
      /* 页面 DOM 存在成员变量的引用，当发生变化时，即是引发如上所述的一种必现方式 */
      this.stateText = 'new state'
    }
  }
</script>
```

因为赋值为 vm 属性，会触发大规模的数据驱动变化，导致内部出现异常循环，从而引发堆栈溢出报错，在未来版本中将会予以修复；

只要不将 \$element('id') 获取到内容，赋值给成员变量，即可规避堆栈溢出问题；

### 结构优化

结构优化的目的是减小页面以及整体 rpk 包的体积，减少冗余代码

整合常用 JS 库到 app.ux 中
在 app.ux 中引入常用的 JS 库，并暴露给每个页面使用；可以避免每个页面在打包时对 JS 的重复定义

## 长列表渲染

为了得到流畅的列表滚动体验，推荐开发者使用 list 组件替代 div 组件实现长列表布局，因为 Native 会复用相同 type 属性的 list-item

```
<template>
  <!-- 列表实现 -->
  <list class="tutorial-page" onscrollbottom="loadMoreData">
    <!-- 商品列表 -->
    <block for="productList">
      <list-item type="product" class="content-item" onclick="route($item.url)">
        <image class="img" src="{{$item.img}}"></image>
        <div class="text-wrap">
          <div class="top-line">
            <text class="text-name">{{$item.name}}</text>
            <text class="text-price">{{$item.price}}</text>
          </div>
          <text class="bottom-line">{{$item.brief}}</text>
        </div>
      </list-item>
    </block>

    <!-- 加载更多，type属性自定义命名为loadMore -->
    <list-item type="loadMore" class="load-more">
      <progress type="circular"></progress>
      <text>加载更多</text>
    </list-item>
  </list>
</template>
```

要实现 DOM 片段的复用，要求相同 type 属性的 DOM 结构完全相同。所以，设置相同 type 属性的 list-item 是优化列表滚动性能的关键

- list-item 内不能再嵌套 list
- list-item 的 type 属性为必填属性
- list-item 内部需谨慎使用 if 指令或 for 指令，因为相同 type 属性的 list-item 的 DOM 结构必须完全相同，而使用 if 指令或 for 指令会造成 DOM 结构差异

## tabs 组件

tabs 中封装了常见功能和效果：页签支持横向滚动，支持手势滑动切换内容页等  
tabs 内部仅支持子组件 tab-bar 和 tab-content，也可以只包含一个子组件，使用说明如下

- tab-bar 组件用来包含所有页签的标题，属性 mode 用来配置是否可滚动，：组件 -> 容器组件 -> tab-bar
- tab-content 组件用来包含所有页签的内容，详情请参考文档：组件 -> 容器组件 -> tab-content
- tab-bar 组件的第 n 个直接子节点对应 tab-content 中第 n 个直接子节点，具有联动效果

```
<template>
  <div class="tutorial-page">
    <!-- tabs组件 -->
    <tabs>
      <tab-bar class="tab-bar">
        <text>menu1</text>
        <text>menu2</text>
        <text>menu3</text>
      </tab-bar>
      <tab-content class="tab-content">
        <div class="tab-content-section">
          <text>content1</text>
        </div>
        <div class="tab-content-section">
          <text>content2</text>
        </div>
        <div class="tab-content-section">
          <text>content3</text>
        </div>
      </tab-content>
    </tabs>
  </div>
</template>
```

页签内容使用自定义子组件

```
<import name="tab-content-item" src="./tabitem"></import>
<template>
  <!-- tabs组件 -->
  <div class="tutorial-page">
    <tabs onchange="onChangeTabIndex">
      <tab-bar class="tab-bar">
        <text>menu1</text>
        <text>menu2</text>
        <text>menu3</text>
      </tab-bar>
      <tab-content class="tab-content">
        <tab-content-item index="0" itemdata="{{list[0]}}" current-index="{{currentIndex}}"></tab-content-item>
        <tab-content-item index="1" itemdata="{{list[1]}}" current-index="{{currentIndex}}"></tab-content-item>
        <tab-content-item index="2" itemdata="{{list[2]}}" current-index="{{currentIndex}}"></tab-content-item>
      </tab-content>
    </tabs>
  </div>
</template>

<style>
  .tutorial-page {
    flex: 1;
    flex-direction: column;
  }
  .tab-bar {
    height: 100px;
    border: 0px solid #eeeeee;
    border-bottom-width: 1px;
  }
  .tab-bar text {
    flex-grow: 1;
    text-align: center;
    margin: 10px;
  }
  .tab-content {
    flex: 1;
    background-color: #eeeeee;
  }
</style>

<script>
  export default {
    private: {
      list: [
        {title: 'content1'},
        {title: 'content2'},
        {title: 'content3'}
      ],
      currentIndex: 0
    },
    onInit () {
      this.$page.setTitleBar({ text: '页签内容使用自定义子组件' })
    },
    onChangeTabIndex (evt) {
      this.currentIndex = evt.index
    }
  }
</script>
```

## Deeplink

- `http://hapjs.org/app/<package>/[path][?key=value]`
- `https://hapjs.org/app/<package>/[path][?key=value]`
- `hap://app/<package>/[path][?key=value]`

参数说明：

- package: 应用包名，必选
- path: 应用内页面的 path，可选，默认为首页
- key-value: 希望传给页面的参数，可选，可以有多个

## H5 跳快应用

URL 跳转配置是指在 H5 页面中可以通过调用接口跳转到应用。

```
<!DOCTYPE html>
<html>
<head>
  <title>URL跳转配置</title>
  <script type="text/javascript" src="//statres.quickapp.cn/quickapp/js/routerinline.min.js"></script>
</head>
<body>
<!-- 调起应用 -->
<script type="text/javascript">
  // 无需用户确认的调用方式，xxx.yyy.zzz为包名
  appRouter("xxx.yyy.zzz", "/Home", { a: 1, b: 'abc' });
  // 需要用户确认的调用方式，xxx.yyy.zzz为包名
  appRouter('xxx.yyy.zzz', '/Home', { a: 1, b: 'abc' }, '显示给用户的应用名称');
</script>


<!-- 检测平台是否支持服务 -->
<script type="text/javascript">
  // 通过传递回调函数实现
  channelReady(function (bAvailable) {
    alert("是否存在框架服务：" + bAvailable)
  });
</script>

</body>
</html>
```

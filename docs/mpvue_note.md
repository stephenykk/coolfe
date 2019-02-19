mpvue notes
===

mpvue 是一个用vue开发小程序的框架，它改写了vue的*runtime*和*compiler*的实现，从而让小程序可以有vue一样的开发体验

mpvue的特性
---
- 彻底的组件化能力 (*像wepy的组件化比较弱,一个页面中使用多次使用同一组件会比较麻烦*)
- vue的开发体验
- 可用vuex管理数据状态
- webpack构建 hotreload
- 支持require第三方包
- vue-cli快速初始项目
- h5版代码转义为小程序代码，减少重复开发

配套基础设施
---

- mpvue-loader
- mpvue-webpack-target
- postcss-mpvue-wxss
- px2rpx-loader
- mpvue-lint

入门教程
---

### 安装

```
npm install -g vue-cli
vue init mpvue/mpvue-quickstart myProject
cd myProject
npm install

```

### 开发
1. `npm run dev`
2. 打开 微信开发者工具，引入项目即可预览


框架原理
---
- mpvue 保留了 vue.runtime 的核心方法，继承了 vue 的基础能力
- mpvue-template-compiler 将 vue模板 转换为 wxml
- 修改vue的构建配置，使其输出 小程序要求的(pageX.js, pageX.json, pageX.wxml, pageX.wxss)文件

vue实例
---

### 实例生命周期
基本上是融合了小程序App/Page生命周期和vue的生命周期

vue init -- injections & reactivity -->created  -- init MP liftcycle(onLoad/onShow/onReady) -->beforeMount -- create vm.$el and replace --> mounted --- update --> beforeDestroy -- teardown watchers and child components and events -->destroyed

> 注意: 小程序url参数通过 `onLoad(query)` 获得，mpvue进行了优化，可在组件onLoad/onShow之后，在方法内通过 `this.$root.$mp.query` 获得


模板语法
---
几乎全支持 vue模板，以下除外  

- v-html 指令
- 复杂的表达式  
    ```
    <!-- 不支持, 建议写 computed -->
    <p>{{ msg.split('').reverse().join(',')}}</p>

    <!-- 支持，写在@event内的表达式，是放到vdom里计算的 -->
    <ul>
        <li v-for="item in list">
            <div @click="handleClick(item, index, $event)">{{item.val}}</div>
        </li>
    </ul>
    ```

- 不支持过滤器

class 和 style 绑定
---

class的值可以是数组，对象，数组对象复合
```
<p :class="{ active: isActive }">111</p>
<p class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }">222</p>
<p class="static" :class="[activeClass, errorClass]">333</p>
<p class="static" v-bind:class="[isActive ? activeClass : '', errorClass]">444</p>
<p class="static" v-bind:class="[{ active: isActive }, errorClass]">555</p>
```


style的值可以是 对象， 对象数组

```
<p v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">666</p>
<p v-bind:style="[{ color: activeColor, fontSize: fontSize + 'px' }]">777</p>
```

条件渲染
---
同vue

列表渲染
---
同vue

事件处理
---
几乎完全支持vue的事件特性，mpvue引入vue的虚拟dom, 模板中的事件挂在vnode上,同时支持 自定义事件 和 $emit 机制

```
// 事件映射表，左侧为 WEB 事件，右侧为 小程序 对应事件
{
    click: 'tap',
    touchstart: 'touchstart',
    touchmove: 'touchmove',
    touchcancel: 'touchcancel',
    touchend: 'touchend',
    tap: 'tap',
    longtap: 'longtap',
    input: 'input',
    change: 'change',
    submit: 'submit',
    blur: 'blur',
    focus: 'focus',
    reset: 'reset',
    confirm: 'confirm',
    columnchange: 'columnchange',
    linechange: 'linechange',
    error: 'error',
    scrolltoupper: 'scrolltoupper',
    scrolltolower: 'scrolltolower',
    scroll: 'scroll'
}
```


> 在 input 和 textarea 中 change 事件会被转为 blur 事件。

注意事项:  

- 列表中没有的原生事件也可以使用例如 bindregionchange 事件直接在 dom 上将bind改为@ @regionchange,同时这个事件也非常特殊，它的 event type 有 begin 和 end 两个，导致我们无法在handleProxy 中区分到底是什么事件，所以你在监听此类事件的时候同时监听事件名和事件类型既 `<map @regionchange="functionName" @end="functionName" @begin="functionName"><map>`

- 小程序能力所致，bind 和 catch 事件同时绑定时候，只会触发 bind ,catch 不会被触发，要避免踩坑。
- 事件修饰符基本不适用

表单控件
---
建议开发过程中直接使用 微信小程序：表单组件 。用法示例：

```
<template>
  <div>
    <picker @change="bindPickerChange" :value="index" :range="array">
      <view class="picker">
        当前选择：{{array[index]}}
      </view>
    </picker>
  </div>
</template>

<script>
export default {
  data () {
    return {
      index: 0,
      array: ['A', 'B', 'C']
    }
  },
  methods: {
    bindPickerChange (e) {
      console.log(e)
    }
  }
}

</script>
```

组件
---
组件是vue的核心，mpvue只支持单文件组件的形式，因为要编译出wxml模板，动态组件，render等是不支持的

> 注意 小程序不支持动态插入wxml节点 (没有类似web appendChild的能力)

不支持列表
- 组件使用时绑定原生事件(如click) `<mycmp @click="handle" />`
- 组件使用时绑定 class 和 style, 因为自定义组件不会生成节点. `<mycmp :class="[foo, bar]" :style="{height: '100px'}" />`
- 异步组件
- 动态组件


mpvue 可以支持小程序的原生组件，比如： picker,map 等，需要注意的是原生组件上的事件绑定，需要以 vue 的事件绑定语法来绑定，如 `bindchange="eventName"` 事件，需要写成 `@change="eventName"`

```
<picker mode="date" :value="date" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
    <view class="picker">
      当前选择: {{date}}
    </view>
</picker>
```

TypeScript支持
---
[demo](https://github.com/WingGao/mpvue-ts-demo)


最佳实践
---
1. 精简 data 数据  
    data/props/computed 的数据，每次更新都会被序列化发送到JSRender进程
2. 合理使用双向绑定 mpvue 建议使用 v-model.lazy 绑定方式以优化性能


> 在所有的组件内可以通过 this.$root.$mp.appOptions 进行获取 app onLaunch/onShow 时候传递的 options


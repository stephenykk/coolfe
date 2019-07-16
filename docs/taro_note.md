taro notes
===

简介
---
Taro 是一套遵循 React 语法规范的 多端开发 解决方案, 可以将源代码分别编译成可以在不同端（微信小程序、H5、RN 等）运行的代码。

特性
---
### react语法风格
Taro 遵循 React 语法规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时支持使用 JSX 语法，让代码具有更丰富的表现力，使用 Taro 进行开发可以获得和 React 一致的开发体验。

```
    import taro, {Component} from '@tarojs/taro';
    import {View, Button, Text} from '@tarojs/commponent';

    export default class Index extends Component {
        constructor() {
            super(...arguments);
            this.state = {
                title: 'hello taro',
                numbers: [1, 2, 3]
            }
        }

        componentWillMount() {}
        
        componentDidMount() {}
        
        componentWillUpdate(nextProps, nextState) {}
        
        componentDidUpdate(prevProps, prevState) {}
        
        shouldComponentUpdate(nextProps, nextState) {
            return true;
        }

        add() {// 默认绑定了this为组件对象
            // do sth
        }

        render() {
          // htmlFor className onClick(属性名驼峰风格)
          // 数据绑定 {this.state.msg}
          // 循环渲染 {this.state.list.map(fn)}
          // 选择渲染 {this.state.success ? <View>1</view> : <View>0</View>}
            return (
                <View className='index'>
                    <View className='title'>{this.state.title}</View>
                    <View className="content">
                        {this.state.numbers.map(num => {
                            return <View className='item'>{num}</View>
                        })}
                        <Button className='add-btn' onClick={this.add}>添加</Button>
                    </View>
                </View>
            )
        }


    }
```

### 支持快速开发微信小程序

- 支持使用 npm/yarn 安装管理第三方依赖

- 支持使用 ES7/ES8 甚至更新的 ES 规范，一切都可自行配置

- 支持使用 CSS 预编译器，例如 Sass 等

- 支持使用 Redux 进行状态管理

- 小程序 API 优化，异步 API Promise 化等等

### 支持多端开发转化
微信小程序 支付宝小程序  react native 以及 H5 端

安装
---
全局安装脚手架 `@tarojs/cli`

使用 npm 或者 yarn 全局安装，或者直接使用npx

```
    npm i -g @tarojs/cli
    yarn global add @tarojs/cli

    taro init myApp  # 初始化项目
```


开发调用命令

```
// 开发微信小程序
# npm script
$ npm run dev:weapp
$ npm run build:weapp

# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp

# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp

// 开发百度小程序
# npm script
$ npm run dev:swan
$ npm run build:swan

# 仅限全局安装
$ taro build --type swan --watch
$ taro build --type swan

# npx 用户也可以使用
$ npx taro build --type swan --watch
$ npx taro build --type swan

// 开发支付宝小程序
# npm script
$ npm run dev:alipay
$ npm run build:alipay

# 仅限全局安装
$ taro build --type alipay --watch
$ taro build --type alipay

# npx 用户也可以使用
$ npx taro build --type alipay --watch
$ npx taro build --type alipay

// 开发h5页面
# npm script
$ npm run dev:h5

# 仅限全局安装
$ taro build --type h5 --watch

# npx 用户也可以使用
$ npx taro build --type h5 --watch
```

更新

```
// 更新 @tarojs/cli
# taro
$ taro update self

# npm
npm i -g @tarojs/cli@latest

# yarn
yarn global add @tarojs/cli@latest

// 更新项目依赖
taro update project
```

taro组成
---

NPM 包  | 描述
--------|------
@tarojs/taro   | taro 运行时框架
@tarojs/taro-h5 | taro h5 运行时框架
@tarojs/taro-rn | taro React Native 运行时框架
@tarojs/taro-weapp  | taro 微信小程序运行时框架
@tarojs/redux   | taro Redux 支持
@tarojs/router  | taro h5 路由
@tarojs/async-await 支持使用 asyn/await 语法
@tarojs/cli | taro 开发工具
@tarojs/taro-rn-runner  | taro ReactNative 打包编译工具
@tarojs/webpack-runner  | taro h5 端 webpack 打包编译工具
@tarojs/components  | taro 标准组件库，h5 版
@tarojs/components-rn   | taro 标准组件库，React Native 版
@tarojs/plugin-babel    | taro babel 编译插件
@tarojs/plugin-sass | taro sass 编译插件
@tarojs/plugin-less | taro less 编译插件
@tarojs/plugin-csso | taro css 压缩插件
@tarojs/plugin-uglifyjs | taro js 压缩插件
eslint-config-taro  | taro eslint 规则
eslint-plugin-taro  | taro eslint 插件

路由功能
---
在 Taro 中，路由功能是默认自带的。

```
Taro.navigateTo({url: '/pages/home/index?foo=bar&hi=hello'});
Taro.redirectTo({url: '/pages/home/index'});

// index.js
class Index extends Component {
    componentWillMount() {
        console.log(this.$router.params); // {foo:'bar', hi: 'hello'}
    }
}
```


设计稿及尺寸单位
---
在 Taro 中尺寸单位建议使用 px、 百分比 %, 设计稿量出来多少就写多少px, 小程序会转为rpx， h5会转为rem

如果你希望部分 px 单位不被转换成 rpx 或者 rem ，最简单的做法就是在 px 单位中增加一个大写字母，例如 Px 或者 PX 这样，则会被转换插件忽略。

项目配置文件，有指定设计稿大小
```
// config/index
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 640,
  ....
}
```

js生成的样式，用 pxTransform 转换为合适的单位. 如 `Taro.pxTransform(10)`

转换配置 config/index.js

```
{
  onePxTransform: true, //设置 1px 是否需要被转换
  unitPrecision: 5, //REM 单位允许的小数位。
  propList: ['*'], //允许转换的属性。
  selectorBlackList: [], //黑名单里的选择器将会被忽略。
  replace: true, //直接替换而不是追加一条进行覆盖。
  mediaQuery: false, //允许媒体查询里的 px 单位转换
  minPixelValue: 0 //设置一个可被转换的最小 px 值
}
```

对于头部包含注释 `/*postcss-pxtransform disable*/` 的文件，插件不予处理。


静态资源引用
---
在 Taro 中可以像使用 webpack 那样自由地引用静态资源，而且不需要安装任何 loader。

```
// import 样式
import './css/path/name.scss'

// import js
import hello, {fine} from './test.js'

// import 媒体资源
import logo from '../images/logo.png'
<Image src={logo} />
```


*小程序样式中引用本地资源*
小程序的样式中，默认不能直接引用本地资源，只能通过网络地址、Base64 的方式来进行资源引用，为了方便开发，Taro 提供了直接在样式文件中引用本地资源的方式，其原理是通过 PostCSS 的 postcss-url 插件将样式中本地资源引用转换成 Base64 格式，从而能正常加载。

配置:

```
// 小程序端样式引用本地资源内联
url: {
  enable: true,
  config: {
    limit: 10240 // 设定转换尺寸上限
  }
}
```


JSX
---

### 必须声明 Taro 和组件

```
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class Home extends Component {
  render () {
    return (
      <View>Hello World!</View>
    )
  }
}
```

`import Taro, { Component } from '@tarojs/taro'` 这句是必须的，变量 Taro 也是一个必须引入声明的变量，因为我们在编译期和运行时会依赖这个变量做一些特殊处理

### 首字母大写与驼峰式命名

```
import Taro, {Component} from '@tarojs/taro';
import HomePage from './pages/homePage';

class App extends Component {
    render() {
        return <HomePage msg='hello' />
    }
}
```

### 属性
可以使用 JavaScript 表达式；if 和 for语句不是表达式，不能用在属性上

```
import Taro, { Component } from '@tarojs/taro'


class App extends Components {
  render () {
    let description

    if (this.props.number % 2 == 0) {
      description = <Text>even</Text>
    } else {
      description = <Text>odd</Text>
    }

    return <View count={1+2+3}>{this.props.number} is an {description} number</View>
  }
}
```

React 可以使用 ... 拓展操作符来传递属性，但在 Taro 中你不能这么做。例如：

```
const props = {firstName: 'Plus', lastName: 'Second'}
return <Greeting {...props} />
```

嵌套

```
render () {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((todo) => <Text>{todo}</Text>)}
    </ul>
  )
}
```

false、null、undefined 和 true 都是有效的 children，但它们不会直接被渲染

```
<View />

<View></View>

<View>{false}</View>

<View>{null}</View>

<View>{undefined}</View>

<View>{true}</View>
```

这在根据条件来确定是否渲染 元素时非常有用。以下的 JSX 只会在 showHeader 为 true 时渲染组件。

```
<View>
  {showHeader && <Header />}
  <Content />
</View>
```

### 与 React/Nerv 最大的不同
属性不能传入 JSX 元素, 如下代码在 Nerv/React 中使用是没有问题的，但是在 Taro 中不能这么做。

```
const element = <Content footer={<View />} />
```


组件化 & Props
---
组件可以将 UI 切分成一些的独立的、可复用的部件，这样你就只需专注于构建每一个单独的部件。

组件从概念上看就像是函数，它可以接收任意的输入值（称之为“props”），并返回一个需要在页面上展示的 Taro 元素。

```
class Welcome extends Component {
  render () {
    return <View>Hello, {this.props.name}</View>
  }
}
```


自定义组件

```
// welcome.js
class Welcome extends Component {
  render () {
    return <View>Hello, {this.props.name}</View>
  }
}

// app.js
class App extends Component {
  render () {
    return <Welcome name="Wallace" />
  }
}
```

props是只读的， state是可变的

使用 PropTypes 检查类型

```
import PropTypes from 'prop-types';

class Greeting extends Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

*PropTypes 目前在小程序端还有些问题，但在 H5 端可以使用*

生命周期 & State
---

```
class Clock extends Component {
  constructor (props) {
    super(props) // 注意要调用父类的构造函数
    this.state = { date: new Date() } // 组件的初始状态
  }

  componentDidMount() {
    this.timer = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({date: new Date()});
  }

  render () {
    return (
      <View>
        <Text>Hello, world!</Text>
        <Text>现在的时间是 {this.state.date.toLocaleTimeString()}.</Text>
      </View>
    )
  }
}
```


正确地使用 State

1. 不要直接更新状态

```
this.state.user = 'sindy'; // wrong
this.setState({user: 'sindy'}) // right
```

2. 状态更新一定是异步的
Taro 可以将多个 setState() 调用合并成一个调用来提高性能。

因为 this.state 和 props 一定是异步更新的，所以你不能在 setState 马上拿到 state 的值，例如：

```
// 假设我们之前设置了 this.state.counter = 0
updateCounter () {
  this.setState({
    counter: 1
  })
  console.log(this.state.counter) // 这里 counter 还是 0
}

// 应该在回调中获取
this.setState({counter: 1}, () => { console.log(this.state.counter)});
```

> 这是 Taro 和 React 另一个不同的地方：React 的 setState 不一定总是异步的，他内部有一套事务机制控制，且 React 15/16 的实现也各不相同。而对于 Taro 而言，setState 之后，你提供的对象会被加入一个数组，然后在执行下一个 eventloop 的时候合并它们。


3. state 更新会被合并

```
class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        posts: [],
        comments: []
      }
    }

    componentDidMount() {
      fetchPosts().then(response => {
        // 更新 state里的posts, comments不受影响, like Object.assign
        this.setState({
          posts: response.posts
        });
      });

      fetchComments().then(response => {
        this.setState({
          comments: response.comments
        })
      })
    }
}
```

事件处理
---
###  Taro 事件绑定属性的命名采用驼峰式写法

```
<Button onClick={this.activateLasers}>
  Activate Lasers
</Button>
```

###  阻止事件冒泡 `e.stopPropagation()`

```
class Toggle extends Component {
  constructor (props) {
    super(props)
    this.state = {isToggleOn: true}
  }

  onClick = (e) => {
    e.stopPropagation()
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render () {
    return (
      <Button onClick={this.onClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </Button>
    )
  }
}
```


###  向事件处理程序传递参数

```
class Popper extends Component {
  constructor () {
    super(...arguments)
    this.state = { name:'Hello world!' }
  }

  // 你可以通过 bind 传入多个参数
  preventPop (name, test, e) {    //事件对象 e 要放在最后
    e.preventDefault()
  }

  render () {
    return <Button onClick={this.preventPop.bind(this, this.state.name, 'test')}></Button>
  }
}
```

> Taro 目前暂时不支持通过匿名函数传值，也不支持多层 lambda 嵌套。当你有传参需求时，请全部使用 bind 来处理。

### 任何组件的事件属性都要以 on 开头

```
const element = <View onClick={this.onTag} />
const element2 = <Input onFocus={this.onFocus} />
const element3 = <CustomElement onAnimationEnd={this.props.onAnimationEnd} />
```

条件渲染
---

### 元素变量
可以使用变量来储存元素。它可以帮助你有条件的渲染组件的一部分，而输出的其他部分不会更改。

```
// LoginStatus.js
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn
    // 这里最好初始化声明为 `null`，初始化又不赋值的话
    // 小程序可能会报警为变量为 undefined
    let status = null
    if (isLoggedIn) {
      status = <Text>已登录</Text>
    } else {
      status = <Text>未登录</Text>
    }

    return (
      <View>
        {status}
      </View>
    )
  }
}
// app.js
import LoginStatus from './LoginStatus'

// 这样会渲染 `已登录`
class App extends Component {
  render () {
    return (
      <View>
        <LoginStatus isLoggedIn={true} />
      </View>
    )
  }
}
```

声明变量并使用 if 语句是条件渲染组件的不错的方式，但有时你也想使用更简洁的语法

### 逻辑运算符 &&
你可以通过用花括号包裹代码在 JSX 中嵌入几乎任何表达式 ，也包括 JavaScript 的逻辑与 &&，它可以方便地条件渲染一个元素。

```
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn

    return (
      <View>
        {isLoggedIn && <Text>已登录</Text>}
        {!isLoggedIn && <Text>未登录</Text>}
      </View>
    )
  }
}
```

### 三元运算符（条件表达式）

```
class LoginStatus extends Component {
  render () {
    const isLoggedIn = this.props.isLoggedIn

    return (
      <View>
      {isLoggedIn
        ? <Text>已登录</Text>
        : <Text>未登录</Text>
      }
      </View>
    )
  }
}
```

列表渲染
---

```
const numbers = [...Array(100).keys()] // [0, 1, 2, ..., 98, 99]
const listItems = numbers.map((number) => {
  {/* 注意加上 key 属性 *}
  return <Text
    key={String(number)}
    className='li'
    >
    我是第 {number + 1} 个数字
  </Text>
})
```

数组元素中使用的 key 在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key：


key 会作为给 Taro 的提示，但不会传递给你的组件。如果您的组件中需要使用和 key 相同的值，请将其作为属性传递：


```
const content = posts.map((post) => {
  return <View key={post.id} id={post.id} >
    <Text>{post.title}</Text>
    <Text>{post.content}</Text>
  </View>
})
```

### 与 React 的不同
在 React 中，JSX 是会编译成普通的 JS 来执行，每一个 JSX 元素，其实会通过 createElement 函数创建成一个 JavaScript 对象（React Element）

但是 Taro 中，JSX 会编译成微信小程序模板字符串，因此你不能把 map 函数生成的模板当做一个数组来处理。当你需要这么做时，应该先处理需要循环的数组，再用处理好的数组来调用 map 函数

```
const list = this.state.list
  .filter(l => l.selected)
  .map(l => {
    return <li>{l.text}</li>
  })
```

*taro中 map返回的结果为模板字符串，不应再进一步处理*

Refs 引用
---

Refs 提供了一种访问在 render 方法中创建的 DOM 节点（小程序原生组件）或 Taro 组件实例的方式。

常规的 Taro 数据流中，props 是父组件与子组件交互的唯一方式。

### 不要过度使用 Refs
在组件层中，通常较高级别的 state 更为清晰。例如，相比于在 Dialog 组件中暴露 open() 和 close() 方法，最好传递 isOpen 属性。

### 创建 Refs
Taro 支持使用字符串和函数两种方式创建 Ref。

this.refs 访问到被定义的组件实例或 DOM 元素（小程序原生组件）。在微信小程序中，如果 ref 的是小程序原生组件，那么相当于使用 createSeletorQuery 取到小程序原生组件实例，如果是在 H5(Web) 环境中使用，那访问到的将是 @tarojs/components 对应组件的组件实例。

```
class MyComponent extends Component {

  componentDidMount () {
    // 如果 ref 的是小程序原生组件，那只有在 didMount 生命周期之后才能通过
    // this.refs.input 访问到小程序原生组件
    if (process.env.TARO_ENV === 'weapp') {
      // 这里 this.refs.input 访问的时候通过 `wx.createSeletorQuery` 取到的小程序原生组件
    } else if (process.env.TARO_ENV === 'h5') {
      // 这里 this.refs.input 访问到的是 `@tarojs/components` 的 `Input` 组件实例
    }
  }

  render () {
    return <Input ref='input' />
  }
}
```

通过函数创建 ref, 不管在任何情况下，Taro 都推荐你使用函数的方式创建 ref。

```
class MyComponent extends Component {

  roar () {
    // 会打印 `miao, miao, miao~`
    this.cat.miao()
  }

  refCat = (node) => this.cat = node // `this.cat` 会变成 `Cat` 组件实例的引用

  render () {
    return <Cat ref={this.refCat} />
  }
}

class Cat extends Components {
  miao () {
    console.log('miao, miao, miao~')
  }

  render () {
    return <View />
  }
}
```

内置环境变量
----

process.env.TARO_ENV 取值为 weapp / swan / alipay / h5 / rn, 在编译时会将不属于当前编译类型的代码去掉，只保留当前编译类型下的代码，

例如想在微信小程序和 H5 端分别引用不同资源

```
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name')
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name')
}
```

同时也可以在 JSX 中使用，决定不同端要加载的组件

```
render () {
  return (
    <View>
      {process.env.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
      {process.env.TARO_ENV === 'h5' && <ScrollViewH5 />}
    </View>
  )
}
```


微信小程序原生作用域获取
---
在 Taro 的页面和组件类中，this 指向的是 Taro 页面或组件的实例，例如

```
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Menu extends Component {
  static defaultProps = {
    data: []
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  componentWillMount () {
    console.log(this) // this -> 组件 Menu 的实例
  }

  render () {
    return <View />
  }
}
```

我们可以通过 this.$scope 就能访问到小程序原生的页面或组件的实例， 如: `Taro.createCanvasContext(canvasId, this.$scope)`


组件的外部样式和全局样式
---

编写组件样式时，需要注意以下几点：
- 组件和引用组件的页面不能使用 id 选择器（#a）、属性选择器（[a]）和标签名选择器，请改用 class 选择器。
- 组件和引用组件的页面中使用后代选择器（.a .b）在一些极端情况下会有非预期的表现，如遇，请避免使用。
- 子元素选择器（.a>.b）只能用于 View 组件与其子节点之间，用于其他组件可能导致非预期的情况。
- *继承样式，如 font 、 color ，会从组件外（父组件）继承到组件内。但是引用组件时在组件节点上书写的 className 无效。 （具体解决方案请参见下面的外部和全局样式介绍。）*
- 除继承样式外， app.scss 中的样式、组件所在页面的样式，均对自定义组件无效。

组件可以指定它所在节点的默认样式，使用 :host 选择器

```
/* 该自定义组件的默认样式 */
:host {
  color: yellow;
}
```

###  外部样式类

```
/* CustomComp.js */
export default class CustomComp extends Component {
  static defaultProps = {
    className: ''
  }

  render () {
    return <View className={this.props.className}>这段文本的颜色不会由组件外的 class 决定</View>
  }
}
/* MyPage.js */
export default MyPage extends Component {
  render () {
    return <CustomComp className="red-text" />
  }
}
/* MyPage.scss */
.red-text {
  color: red;
}
```

取而代之的，需要利用 externalClasses 定义段定义若干个外部样式类。
这个特性从小程序基础库版本 1.9.90 开始支持。

```
/* CustomComp.js */
export default CustomComp extends Component {
  static externalClasses = ['my-class']

  render () {
    return <View className="my-class">这段文本的颜色由组件外的 class 决定</View>
  }
}
/* MyPage.js */
export default MyPage extends Component {
  render () {
    return <CustomComp my-class="red-text" />
  }
}
/* MyPage.scss */
.red-text {
  color: red;
}
```

> 注意：externalClasses 需要使用 短横线命名法 (kebab-case)，而不是 React 惯用的 驼峰命名法 (camelCase)。否则无效。

### 全局样式类
使用外部样式类可以让组件使用指定的组件外样式类，如果希望组件外样式类能够完全影响组件内部，可以将组件构造器中的 options.addGlobalClass 字段置为 true。这个特性从小程序基础库版本 2.2.3 开始支持。

```
/* CustomComp.js */
export default CustomComp extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    return <View className="red-text">这段文本的颜色由组件外的 class 决定</View>
  }
}
/* 组件外的样式定义 */
.red-text {
  color: red;
}
```

最佳实践
---

###  JSX 支持程度

- 不能在包含 JSX 元素的 map 循环中使用 if 表达式
- 不能使用 Array#map 之外的方法操作 JSX 数组
- 不能在 JSX 参数中使用匿名函数
- 暂不支持在 render() 之外的方法定义 JSX
- 不允许在 JSX 参数(props)中传入 JSX 元素
- 不能在 JSX 参数中使用对象展开符
- 不支持无状态组件

自定义组件样式

给组件设置 defaultProps

组件传递函数属性名以 on 开头

小程序端不要在组件中打印传入的函数

小程序端不要将在模板中用到的数据设置为 undefined

小程序端不要在组件中打印 this.props.children

不要以 id、class、style 作为自定义组件的属性与内部 state 的名称

组件 state 与 props 里字段重名的问题

小程序中页面生命周期 componentWillMount 不一致问题

组件的 constructor 与 render 提前调用

JS 编码必须用单引号

环境变量 process.env.TARO_ENV使用

预加载

```
class Index extends Component {
  componentWillMount () {
    console.log('isFetching: ', this.isFetching)
    this.$preloadData
      .then(res => {
        console.log('res: ', res)
        this.isFetching = false
      })
  }

  componentWillPreload (params) {
    return this.fetchData(params.url)
  }

  fetchData () {
    this.isFetching = true
    ...
  }
}
```

全局变量

在 Taro 中推荐使用 Redux 来进行全局变量的管理，但是对于一些小型的应用， Redux 就可能显得比较重了，这时候如果想使用全局变量，推荐如下使用。

```
// global_data.js
const globalData = {}

export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
```

# 2023 再看 React 状态管理库

> 原文地址[2023 再看 React 状态管理库 - 掘金](https://juejin.cn/post/7195513281228898363?searchId=2024022812341241274B98744BCB602F1E)

# 什么是状态管理？

## 状态

状态是表示组件当前状况的 JS 对象。在 React 中，可以使用 useState 或者 this.state 维护组件内部状态，通过 props 传递给子组件使用。

为了避免状态传递过程中出现混乱，React 引入了“单向数据流”的理念。主要思想是组件不会改变接收的数据，只会监听数据的变化，当数据发生变化时他们会使用接收到的新值，而不是修改已有的值。当组件的更新机制触发后，他们只是使用新值进行重新渲染。

父子组件通信可以直接使用 props 和回调方式；深层次、远距离组件则要通过“状态提升”和 props 层层传递。

## 常见模式

React 状态管理的常见模式有：

-   状态提升：兄弟组件间是没法直接共享状态的，可以通过将状态提升到最近的祖先组件中，所有兄弟组件就可以通过 props 一级级传递获取状态；
-   状态组合：某些状态可能只在应用程序的特定子树中需要。最好将状态存储在尽可能接近实际需要的位置，这有助于优化渲染行为；
-   属性下钻：将父组件的状态以属性的形式一级级显示传递给嵌套子组件；
-   Provider：React Context 通过 Provider 包裹组件，被包裹的所有嵌套子组件都可以不用通过属性下钻而是通过 context 直接获取状态。

层层传递的 value onChange 会对一个优质代码库带来的毁灭性影响，粗暴地把数据塞在 redux 中也并不能让一个应用得到很好的拓展性和可维护性。

## 要解决的问题

状态管理库要解决的问题：

1.  从组件树的「任何地方」读取存储的状态
2.  写入存储状态的能力
3.  提供「优化渲染」的机制
4.  提供「优化内存使用」的机制
5.  与「并发模式的兼容性」
6.  数据的「持久化」
7.  「上下文丢失」问题
8.  「props失效」问题
9.  「孤儿」问题

## 心智模型

状态更新有两种心智模型：

-   不可变状态模型
-   可变状态模型

-   主要好处是可以使用原生 JS 方法；
-   基于 Proxy 的状态管理的一个缺点是状态不可预测，难以 debug。

因为 React 没有官方的状态管理方案，React 生态中状态管理库，百花齐放，演进出很多设计思想和心智模式。如何选择状态管理库就变得十分令人抓狂。

# React Context 

在多级嵌套组件场景下，使用“属性下钻”方式进行组件通信是一件成本极高的事情。为了解决这个问题，React 官方提供 Context 用于避免一级级属性传递。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b0ae4f6b2bd4f7081170216163821f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## Context 的问题

Context存在的问题也是老生常谈。在 react 里，context 是个反模式的东西，不同于 redux 等的细粒度响应式更新，context的值一旦变化，所有依赖该context的组件全部都会 force update，因为 context API 并不能细粒度地分析某个组件依赖了context 里的哪个属性，并且它可以穿透 React.memo 和 shouldComponentUpdate 的对比，把所有涉事组件强制刷新。

React官方文档在 [When to Use Context](https://reactjs.org/docs/context.html#when-to-use-context "https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fcontext.html%23when-to-use-context")一节中写道：

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。

综上，在系统中跟业务相关、会频繁变动的数据在共享时，应谨慎使用 context。

如果决定使用context，可以在一些场景中，将多个子组件依赖的不同context属性提升到一个父组件中，由父组件订阅context并以prop的方式下发，这样可以使用子组件的memo、shouldComponentUpdate生效。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b329102b3d454d0887a53cd6b8f6d0af~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

此外，官方文档还提到了[另外一个坑](https://zh-hans.reactjs.org/docs/context.html#caveats "https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fcontext.html%23caveats")，使用的时候也应该注意。

## 优点

-   作为React内置的hook，不需要引入第三方库；
-   书写还算方便。

## 缺点

-   Context 只能存储单一值，当数据量大起来时，你可能需要使用createContext创建大量context；
-   直接使用的话，会有一定的性能问题：每一次对state的某个值变更，都会导致其他使用该state的组件re-render，即使没有使用该值。 你可以通过useMemo来解决这个问题，但是就需要一定的成本来定制一个通用的解决方案；
-   无法处理异步请求。对于异步的逻辑，Context API并没有提供任何API，需要自己做封装；
-   无法处理数据间的联动。Context API并没有提供API来生成派生状态，同样也需要自行去封装一些方法来实现。

# React 外部状态管理库

## 概览

React 的外部状态管理库一直以来是 React 生态中非常内卷的一个领域。目前比较常见的状态管理库有 Redux（包括基于 Redux 的 Dva、Icestore）、Mobx、Zustand、Recoil、Jotai、Valtio、Hox 等。

从 npm trends 看各个状态管理库近一年的[下载量趋势](https://npmtrends.com/hox-vs-jotai-vs-mobx-vs-recoil-vs-redux-vs-valtio-vs-zustand "https://npmtrends.com/hox-vs-jotai-vs-mobx-vs-recoil-vs-redux-vs-valtio-vs-zustand")：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aad8931489b4118b0d61518a59c92b5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们可以看到 Redux 作为 React 状态管理的老大哥，下载量上依然遥遥领先其他库。Mobx 作为往年热度仅次于 Redux 的状态管理库，位置正逐步有被 zustand 超越的趋势。recoil/jotai/valtio 作为这两年热门的新兴库热度也在逐步上升。hox 则处于不温不火的尴尬地位。

将以上状态管理库按心智模型、诞生时间、star 数，绘制气泡图。以 React v16.8 版本为分水岭，状态管理库可分为 Class 时代和 Hooks 时代。Class 时代中 Redux 和 Mobx 都是非常优秀的状态库。随着 Hooks 时代的到来，状态管理的心智模型也逐步发生着演变。整体呈现从中心化到去中心化，从单一状态到原子状态，从 Provider 到拥抱 Hooks 等演变趋势。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/713f854973f8446690a68342aed0e05a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

下面，我们对上述状态管理库进行逐一对比介绍。

## Class 时代

### [Redux](https://cn.redux.js.org/introduction/getting-started "https://cn.redux.js.org/introduction/getting-started")

Redux 的灵感来源于 Flux 架构和函数式编程原理，状态更新可预测、可跟踪，提倡使用「单一存储」。这通常会「导致将所有的东西存储在一个大的单体存储中」。将UI和远程实体状态之间的所有东西都放在一个地方管理，这变得非常难以管理。对性能造成了不小的压力。

#### 单向数据流

他的工作流程大致如下：

-   用户在view层触发某个事件，通过dispatch发送了action和payload
-   action和payload被传入reducer函数，返回一个新的state
-   store拿到reducer返回的state并做更新，同时通知view层进行re-render

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3237134ee24c03998f4715ebc6fad2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

由此可看出 Redux 遵循“单向数据流”和“不可变状态模型”的设计思想。这使得 Redux 的状态变化是可预测、可调式的。

#### 三大原则

此外，Redux 还遵循三大原则：

-   单一数据源

整个应用的 [全局 state](https://cn.redux.js.org/understanding/thinking-in-redux/glossary#state "https://cn.redux.js.org/understanding/thinking-in-redux/glossary#state")被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 [store](https://cn.redux.js.org/understanding/thinking-in-redux/glossary#store "https://cn.redux.js.org/understanding/thinking-in-redux/glossary#store")中。

-   state 是只读的

唯一改变 state 的方法就是触发 [action](https://cn.redux.js.org/understanding/thinking-in-redux/glossary "https://cn.redux.js.org/understanding/thinking-in-redux/glossary")，action 是一个用于描述已发生事件的普通对象。

-   纯函数修改

通过 reducer 修改状态，reducer 是纯函数，它接收之前的 state 和 action，并返回新的 state。记住，一定要返回一个新的对象，而不是修改之前的 state。

#### 如何处理异步

redux没有规定如何处理异步数据流，最原始的方式就是使用Action Creators，也就是在制造action之前进行各种的异步操作，你可以把要复用的操作抽离出来。

当然这样并不优雅，在实际项目中我们通常使用类似redux-thunk、redux-saga这些中间件来支持处理异步。

#### 如何处理数据间联动

react-redux的useSelector获取状态后，你可以编写一些逻辑来处理派生状态。如果派生状态需要复用，记得给抽离出来。

#### 优点

-   繁荣的社区，像不支持异步这种问题是由成熟的中间件可以解决的，你遇到的问题多多少少可以在社区找到答案;
-   可扩展性高，中间件模式让你可以随心所欲的武装你的dispatch;
-   单一数据源且是树形结构，这让redux支持回溯，在调试上也更方便;
-   有成熟的开发调试工具 [redux devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd "https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd")。

#### 缺点

-   陡峭的学习曲线。将副作用扔给中间件来处理，导致社区一堆中间件，学习成本陡然增加。比如处理异步请求的 Redux-saga、计算衍生状态的 reselect；
-   大量的模版代码。使用 redux，开发者要编写大量和业务逻辑无关的模板代码，这给开发和后期维护都带来了额外的成本；
-   大状态量情况下，性能较差。state 更新会影响所有组件。每个 action 都会调用所有 reducer；
-   reducer 要返回新的对象，如果更新的值层级较深，更新成本也很高；
-   更多的内存占用，由于采用单一数据源，所有状态存储在一个 state 中，当某些状态不再需要使用时，也不会被垃圾回收释放内存；

当然，redux 也在致力于解决上述缺点。比如，[redux toolkit](https://cn.redux.js.org/introduction/why-rtk-is-redux-today "https://cn.redux.js.org/introduction/why-rtk-is-redux-today")就旨在让开发者使用标准方式编写 redux 逻辑。主要解决 redux 的 3 个问题：

-   配置 redux store 过于麻烦；
-   必须手动额外添加很多包才能正常使用 redux；
-   redux 需要太多模板代码。

不过，即使有 redux toolkit 的加持，redux 的学习成本依旧不低。

### [Dva](https://dvajs.com/ "https://dvajs.com/")

dva 首先是一个基于 [redux](https://github.com/reduxjs/redux "https://github.com/reduxjs/redux")和 [redux-saga](https://github.com/redux-saga/redux-saga "https://github.com/redux-saga/redux-saga")的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router "https://github.com/ReactTraining/react-router")和 [fetch](https://github.com/github/fetch "https://github.com/github/fetch")，所以也可以理解为一个轻量级的应用框架。

Dva 的特点：

-   易学易用，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://umijs.org/guide/with-dva.html "https://umijs.org/guide/with-dva.html")后更是降低为 0 API
-   elm 概念，通过 reducers, effects 和 subscriptions 组织 model
-   插件机制，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading "https://github.com/dvajs/dva/tree/master/packages/dva-loading")可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
-   支持 HMR，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr "https://github.com/dvajs/babel-plugin-dva-hmr")实现 components、routes 和 models 的 HMR

Dva 大幅降低了 Redux 的上手成本，过去也在社区拥有了拥趸，github star 数 16.1k。不过，从 2019.11 开始就没有新的版本发布，看起来已经处于不维护状态。

### [icestore](https://github.com/ice-lab/icestore "https://github.com/ice-lab/icestore")

icestore 是 [IceJs](https://ice3.alibaba-inc.com/v3/docs/guide/advanced/store "https://ice3.alibaba-inc.com/v3/docs/guide/advanced/store")内置状态管理库。icestore 是面向 React 应用的、简单友好的状态管理方案。

它包含以下核心特征：

-   简单、熟悉的 API：不需要额外的学习成本，只需要了解 React Hooks，对 Redux 用户友好。
-   集成异步处理：记录异步操作时的执行状态，简化视图中对于等待或错误的处理逻辑。
-   支持组件 Class 写法：友好的兼容策略可以让老项目享受轻量状态管理的乐趣。
-   良好的 TypeScript 支持：提供完整的 TypeScript 类型定义，在 VS Code 中能获得完整的类型检查和推断。

icestore 的灵感来自于 [rematch](https://github.com/rematch/rematch "https://github.com/rematch/rematch")和 [constate](https://github.com/diegohaz/constate "https://github.com/diegohaz/constate")。整体实现和 rematch 基本一致。rematch 是一个没有模板代码的 redux 最佳实践。icestore 整体配置简单，解决了 redux 学习成本高、大量模板代码等问题，同时又很好的支持了异步处理、TypeScript 和 SSR。

IceJS 自己给出的能力对照表：

-   O: 支持
-   X: 不支持
-   +: 需要额外地进行能力扩展

| 功能/库 | redux | constate | zustand | react-tracked | icestore |
| --- | --- | --- | --- | --- | --- |
| 框架 | Any | React | React | React | React |
| 简单性 | ★★ | ★★★★ | ★★★ | ★★★ | ★★★★ |
| 更少的模板代码 | ★ | ★★ | ★★★ | ★★★ | ★★★★ |
| 可配置性 | ★★ | ★★★ | ★★★ | ★★★ | ★★★★★ |
| 共享状态 | O | O | O | O | O |
| 复用状态 | O | O | O | O | O |
| 状态联动 | + | + | + | + | O |
| Class 组件支持 | O | + | + | + | O |
| Function 组件支持 | O | O | O | O | O |
| 异步更新的状态 | + | X | X | X | O |
| SSR | O | O | X | O | O |
| 持久化 | + | X | X | X | + |
| 懒加载模型 | + | + | + | + | O |
| 中心化 | + | X | X | X | O |
| 中间件或插件机制 | O | X | O | X | O |
| 开发者工具 | O | X | O | X | O |

## [Mobx](https://zh.mobx.js.org/react-integration.html "https://zh.mobx.js.org/react-integration.html")

### 设计思想

MobX 的主要思想是用「函数响应式编程」和「可变状态模型」使得状态管理变得简单和可扩展。

MobX背后的哲学很简单:

任何源自应用状态的东西都应该自动地获得。其中包括UI、数据序列化、服务器通讯，等等。

React 和 MobX 是一对强力组合。React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染。而MobX提供机制来存储和更新应用状态供 React 使用。

对于应用开发中的常见问题，React 和 MobX 都提供了最优和独特的解决方案。React 提供了优化UI渲染的机制， 这种机制就是通过使用虚拟DOM来减少昂贵的DOM变化的数量。MobX 提供了优化应用状态与 React 组件同步的机制，这种机制就是使用响应式虚拟依赖状态图表，它只有在真正需要的时候才更新并且永远保持是最新的。

### 心智模型

Mobx的心智模型和react很像，它区分了应用程序的三个概念：

-   State(状态)
-   Actions(动作)
-   Derivations(派生)

首先创建可观察的状态（Observable State），通过Action更新State，然后自动更新所有的派生（Derivations）。派生包括Computed value（类似useMemo或useSelector）、副作用函数(类似useEffect)和UI（render）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b08330a8937b4a37914f75ab85615a5f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Mobx虽然心智模型像 react，但是实现却是完完全全的 vue：mutable + proxy（为了兼容性，proxy实际上使用Object.defineProperty实现）。

使用反react的数据流模式，注定会有成本：

-   Mobx的响应式脱离了react自身的生命周期，就不得不显式声明其派生的作用时机和范围。比如副作用触发需要在useEffect里再跑一个autorun/reaction，要给DOM render包一层useObserver/Observer，都加大了开发成本。
-   Mobx会在组件挂载时收集依赖，和state建立联系，这个方式在即将到来的react 18的并发模式（Concurrent Mode）中，可能无法平滑地迁移。为此，react专门开发了[create-subscription](https://github.com/facebook/react/tree/main/packages/create-subscription "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Ftree%2Fmain%2Fpackages%2Fcreate-subscription")方法用于在组件中订阅外部源，但是实际的应用效果还未可知。

尤大本人也盖过章：React + MobX 本质上就是一个更繁琐的Vue。

### Mobx vs Redux

Mobx和Redux的对比，实际上可以归结为 面向对象 vs 函数式和 Mutable vs Immutable。

-   相比于redux的广播遍历dispatch，然后遍历判断引用来决定组件是否更新，mobx基于proxy可以精确收集依赖、局部更新组件（类似vue），理论上会有更好的性能，但redux认为这可能不是一个问题（[Won't calling “all my reducers” for each action be slow?](https://redux.js.org/faq/performance#wont-calling-all-my-reducers-for-each-action-be-slow "https://link.juejin.cn?target=https%3A%2F%2Fredux.js.org%2Ffaq%2Fperformance%23wont-calling-all-my-reducers-for-each-action-be-slow")）
-   Mobx因为数据只有一份引用，没有回溯能力，不像redux每次更新都相当于打了一个快照，调试时搭配[redux-logger](https://www.npmjs.com/package/redux-logger "https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fredux-logger")这样的中间件，可以很直观地看到数据流变化历史。
-   Mobx的学习成本更低，没有全家桶。
-   Mobx在更新state中深层嵌套属性时更方便，直接赋值就好了，redux则需要更新所有途经层级的引用（当然搭配[immer](https://www.npmjs.com/package/immer "https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fimmer")也不麻烦）。

## 优点

-   简单易用，没有模板代码；
-   精准更新，性能更好；

## 缺点

-   难以调试。由于采用可变状态模型，状态不可预测和追溯，难以 debug；
-   太过灵活，更容易导致 bug；

-   响应式是基于 Proxy 实现的，希望传递的是一个数组，拿到的却是一个 Proxy。排查问题时有点痛苦。

# Hooks 时代

Hooks  是 React 16.8 新增的特性，使得我们可以在函数组件中使用 state 以及其他 React 特性。

Hooks 的引入主要是为了解决 React Class 组件的以下问题：

-   在组件之间复用状态逻辑很难

Class 组件会将视图和状态逻辑糅杂在一起，如果想复用组件中的状态逻辑，需要使用 render props 和高阶组件，但是这类方案需要重新组织组件结构，会形成组件的嵌套地狱，代码逻辑也会变得难以理解。

-   复杂组件的理解成本很高

Class 组件的状态逻辑会充斥在各个生命周期中，完全不相关的代码出现在同一个生命周期函数中，逻辑难以理解，容易引发 bug，且在多数情况下，很难将组件拆分成更小的粒度。

Hooks 是一种开发理念和组织理念的革新，有 3 个特性：

-   primitive。元数据化，将混沌的 state 打散为一个个元数据；
-   decentralization。去中心化，Class 时代的理念是“顶层下发”，Hooks 带来了强烈的“组件自治”理念；
-   algebraic effects。代数效应，剥离组件中的副作用，让开发者更专注业务逻辑。

代数效应是函数式编程中的一个概念，用于将副作用从函数调用中分离。

## 自下而上模式的崛起

我们可以看到以前的状态管理解决方案，如Redux，设计理念是状态 「自上而下」流动。它「倾向于在组件树的顶端吸走所有的状态」。状态被维护在组件树的高处，下面的组件通过选择器拉取他们需要的状态。

在新的组件构建理念中，一种「自下而上」的观点对构建具有组合模式的应用具有很好的指导作用。

而hook就是这种理念的践行者，即把可组合的部件放在一起形成一个更大的整体。

通过 hook，我们可以从具有巨大全局存储的「单体状态管理」转变为向自下而上的 「微状态管理」，通过hook消费更小的状态片。

像接下来要介绍的 Recoil 和 Jotai 这样的流行库以其 「原子状态」的概念体现了这种自下而上的理念。「原子是一个最小但完整的状态单位」。它们是小块的状态，可以连接在一起形成新的衍生状态。最终形成了一个应用状态图。

这个模型允许你自下而上地建立起「状态图」。并通过仅使图中已更新的原子失效来优化渲染。

这与拥有一个大的单体状态球形成鲜明对比，你可以「订阅并试图避免不必要的渲染」。

接下来我们要介绍 5 个 Hooks 时代的状态库，分别是 recoil、zustand、jotai、valtio、hox。比较有趣的是其中 3 个都是 [Daishi Kato](https://github.com/dai-shi "https://github.com/dai-shi")开发的，采用了不同的设计思想，但是都在短期内取得不错的社区热度，这 3 个库分别是 zustand、jotai、valtio，这三个词其实是“状态”在 3 种语言中的不同发音。

zustand 🇩🇪 德语 "状态"，jotai 🇯🇵 日语 "状态"、valtio 🇫🇮 芬兰语 "状态"。

## [Recoil](https://recoiljs.org/zh-hans/ "https://recoiljs.org/zh-hans/")

### 简介

[Recoil](https://recoiljs.org/zh-hans/ "https://recoiljs.org/zh-hans/") 是在React Europe 2020 Conference上 facebook 官方推出的专为 react 打造的状态管理库，动机是解决react 状态共享模式的局限性：

-   以往只能将state提升到公共祖先来实现状态共享，并且一旦这么做了，基本就无法将组件树的顶层（state 必须存在的地方）与叶子组件 (使用 state 的地方) 进行代码分割
-   Context 只能存储单一值，无法存储多个各自拥有消费者的值的集合

### 设计思想

Recoil的状态集是一个有向图 (directed graph)，正交且天然连结于React组件树。状态的变化从该图的顶点（atom）开始，流经纯函数 (selector) 再传入组件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f76308b8c1f14e398ecbf316639a9b53~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

Recoil 定义了一个有向图 (directed graph)，正交同时又天然连结于你的 React 树上。状态的变化从该图的顶点（我们称之为 atom）开始，流经纯函数 (我们称之为 selector) 再传入组件。基于这样的实现：

-   我们可以定义无需模板代码的 API，共享的状态拥有与 React 本地 state 一样简单的 get/set 接口 (当然如果需要，也可以使用 reducer 等进行封装)；
-   我们有了与 Concurrent 模式及其他 React 新特性兼容的可能性；
-   状态的定义是渐进式和分布式的，这使代码分割成为可能；
-   无需修改对应的组件，就能将它们本地的 state 用派生数据替换；
-   无需修改对应的组件，就能将派生数据在同步与异步间切换；
-   我们能将导航视为头等概念，甚至可以将状态的转变编码进链接中；
-   可以很轻松地以可回溯的方式持久化整个应用的状态，持久化的状态不会因为应用的改变而丢失。

正交：相互独立，相互间不可替代，并且可以组合起来实现其它功能

Recoil每一次状态变更都会生成一个不可变的快照，利用这个特性，可以快速实现应用导航相关的功能，例如状态回溯、跳转等。

### 核心方法

Recoil中定义状态的两个核心方法：

-   atom: 定义原子状态，即组件的某个状态最小集，
-   selector: 定义派生状态，其实就是computed value

消费状态的方法有 useRecoilState、useRecoilValue、useSetRecoilState 等，用法和 react 的 useState 类似，几乎没有上手成本。另外值得注意的是，recoil目前只支持FC的hook用法，Class组件想用的话可以通过HOC的方式获取状态并注入组件。

### 优点

-   状态原子化（atom），自由组合和订阅；并且状态定义是渐进式和分布式的，使代码分割成为可能；
-   没有模板代码，天然是 hook 模式，让 react 尽量保持原来的样子；
-   兼容并发模式（Concurrent Mode）；
-   提供对状态流的快照（snapshot）支持，可以轻松回溯应用状态，甚至将snopshot编码放进url，让任何人打开应用都能进入到同样的状态；

### 能力对照表

| 方案 | 学习成本 | 编码成本 | TS友好 | SSR | Code Split | 并发模式兼容 | 可调试性 | 生态繁荣 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Redux | 高 | 高 | 一般 | 支持 | 不支持 | 支持 | 好 | 高 |
| Mobx | 中 | 中 | 好 | 支持 | 支持 | 未知 | 差 | 中 |
| Recoil | 低 | 低 | 好 | 实践较少 | 支持 | 支持 | 好 | 低 |

## [Zustand](https://github.com/pmndrs/zustand "https://github.com/pmndrs/zustand")

### 简介

zustand 是一个轻量级状态管理库，和 redux 一样都是基于不可变状态模型和单向数据流的，状态对象 state 不可被修改，只能被替换。渲染优化要手动通过 selectors 进行。

### Zustand vs Redux

-   zustand 和 redux 是非常像的，都基于不可变状态模型，都基于单向数据流。
-   不过，redux 需要应用被 Context Provider 包裹，zustand 则不需要。
-   二者更新数据的方式不同，redux 基于 reducers，更新状态的 reducers 是严格的方法，这就使得状态更加可预测。zustand 不使用 reducers 而是通过更灵活的方法来更新状态。

### 特点

zustand 的特点：

-   轻量级；
-   中心化，单一 store；
-   不可变状态模型；
-   不固执。很少限制，非常开放。

## [Jotai](https://github.com/pmndrs/jotai "https://github.com/pmndrs/jotai")

### 简介

jotai 是一个小型全局状态管理库，它模仿了 useState、useReducer。jotai 有个叫做 atom 的概念，用于表示小的状态片段。和 zustand 不同的是，他是一个组件级别的状态管理库。和 zustand 相同的是同样都基于不可变状态模型。

jotai 是 Context 和订阅机制的结合，是面向 React 的一种全局状态管理库。如果你的需求是一个没有额外重复渲染的 Context，那 jotai 是个不错的选择。

### 特点

jotai 有两个特点：

-   语法简单
-   jotai 的状态不是全局状态

atom 可以在 React 组件的生命周期里创建和销毁。这通过多个 Context 是无法实现的，因为使用 Context 增加一个新的 state 意味着增加一个新的 Provider 组件，如果新增一个组件，它所有的子组件都会被重新挂载，会失去所有状态。

-   衍生 atom

atom 可以像积木一样被组合，生成新的 atom，从而实现复杂逻辑。

jotai 通过 atom 之间的依赖来实现自动渲染优化。

推荐场景：组件为中心的应用。

### Recoil vs Jotai

jotai 深受 recoil 启发，设计理念基本相同。但有以下不同：

-   最大的不同是是否需要键字符串，开发 jotai 的一大动力就是要省略键字符串。因为键属性必须是唯一的，键命名是一项艰巨的任务；
-   另一个不同是 jotai 不需要使用 Provider 包裹组件，这对开发者来说可以大幅降低开发成本和心理负担。

### Zustand vs Jotai

Zustand 和 Jotai 之间有两个主要不同：

-   Zustand 是单一 store，Jotai 由原子 atom 组合而成；
-   Zustand 的 store 存储在 React 外部，Jotai 的 store 存储在 React 内部。

## [Valtio](https://github.com/pmndrs/valtio "https://github.com/pmndrs/valtio")

### 简介

基于可变状态模型，利用 Proxy 获取一个和 React 集成在一起的不可变快照。

利用 Proxy 自动进行重新渲染优化，这个过程使用了状态使用跟踪技术。通过状态使用跟踪，可以检测到状态的哪部分被使用，让组件实现按使用重新渲染。同时，开发者也可以编写更少的代码。

### Valtio vs Zustand

zustand 基于不可变状态模型，valtio 基于可变状态模型。

valtio 通过属性访问自动进行渲染优化，zustand 推荐使用 selectors 手动进行渲染优化。

### Valtio vs Mobx

渲染优化上，valtio 使用 hook，mobx 使用高阶组件。

## [Hox](https://github.com/umijs/hox "https://github.com/umijs/hox")

### 从状态管理到状态共享

redux、zustand、recoil 这些状态管理库，它们虽然在一定程度上也可以帮我们解决数据共享的问题，但它们最本质的能力还是对数据的操作。它们被称做也确实应该被称做"状态管理"工具。

而 Hox 想解决的问题，不是如何组织和操作数据，不是数据流的分层、异步、细粒度，我们希望 Hox 只聚焦于一个痛点：在多个组件间共享状态。

如果你也意识到了，层层传递的 value onChange 会对一个优质代码库带来的毁灭性影响，粗暴地把数据塞在 redux 中也并不能让一个应用得到很好的拓展性和可维护性，那么 Hox 或许会是一个适合你的"状态共享"方案，它简单、轻量、可靠，适合无论大小的几乎所有项目。

### 优势

-   直接复用已有的 React 知识，几乎没有学习成本，你怎么写 React 组件，就可以怎么写 Store
-   为灵活重构而设计，在 Store 和组件中使用同一套 DSL 可以让你几乎 0 成本的将组件的局部状态转化为一个组件间共享的状态
-   同时支持局部状态和全局状态，在灵活和简单之间做到了很好的平衡
-   优秀的性能和 TypeScript 支持

# 总结

简单场景使用原生的useState、useReducer、useContext就能满足；还可以用 [Hox](https://www.npmjs.com/package/hox "https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhox")这样小而美的库将hook的状态直接拓展成持久化状态，几乎没有额外的心智负担。

复杂场景的应用，redux、mobx都是经受过千锤百炼的库，社区生态也很完备。

Redux高度模板化、分层化，职责划分清晰，塑造了其状态在可回溯、可维护性方面的优势；搭配thunk、saga这些中间件几乎是无所不能。

Mobx的优势是写法简单和高性能，但状态的可维护性不如redux，在并发模式中的兼容性也有待观察。

随着hook和有官方背景的recoil的出现，状态管理似乎在朝原子化、组件化的方向发展，这也符合react的组件化哲学。Redux的暴力遍历和分发或许已经是逆潮流的解法。

没有最好的状态管理库，只有最合适的状态管理库。

详细状态库能力对照表：

|  | Class 时代 | Hooks 时代 |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 传统流派 | 响应式流派 | 原子状态流派 | 传统流派 | 响应式流派 | 原子状态流派 |  |  |  |
|  | [redux](https://github.com/reduxjs/redux "https://github.com/reduxjs/redux") | [dvajs](https://github.com/dvajs/dva "https://github.com/dvajs/dva") | [icestore（ice内置）](https://github.com/ice-lab/icestore "https://github.com/ice-lab/icestore") | [mobx](https://github.com/mobxjs/mobx "https://github.com/mobxjs/mobx") | [recoil](https://github.com/facebookexperimental/Recoil "https://github.com/facebookexperimental/Recoil") | [zustand](https://github.com/pmndrs/zustand "https://github.com/pmndrs/zustand") | [Valtio](https://github.com/pmndrs/valtio "https://github.com/pmndrs/valtio") | [Jotai](https://github.com/pmndrs/jotai "https://github.com/pmndrs/jotai") | [hox](https://github.com/umijs/hox "https://github.com/umijs/hox") |
| STAR数 | 59k | 16.1k | 387 | 26k | 18.1k | 24.5k | 5.9k | 11.3k | 1.3k |
| 诞生时间 | 2011 | 2016.12 | 2019.3 | 2015.3 | 2019 | 2018 | 2020.11 | 2020.3 | 2019.1 |
| 特性 | 全局一棵状态树，利用context，通过action 触发变动，reducer纯函数修改store，最后导致props 变动，进而组件重新渲染 | 深度整合 redux、redux-saga，便于 redux 用户快速切换 | 类 dvajs，创造 icestore 的灵感来自于 rematch 和 constate。 | 基于ES6 proxy ，使用观察者/可观察模式的，当你修改一个值时，任何使用该值的组件都会自动重新渲染。 | 原子化管理状态，进行精确渲染。使用 Recoil 会为你创建一个数据流向图，从 atom（共享状态）到 selector（纯函数），再流向 React 组件。Atom 是组件可以订阅的 state 单位。selector 可以同步或异步改变此 state。 | 基于观察者/可观察模式，内部对通过 state 绑定的组件，添加到了订阅者队列，store中的属性相当于一个被观察者，当属性状态变更后，通知所有订阅了该数属性的组件进行更新 | 利用 Proxy 自动进行重新渲染优化，这个过程使用了状态使用跟踪技术。通过状态使用跟踪，可以检测到状态的哪部分被使用，让组件实现按使用重新渲染。同时，开发者也可以编写更少的代码。 | jotai 是一个小型全局状态管理库，它模仿了 useState、useReducer。jotai 有个叫做 atom 的概念，用于表示小的状态片段。和 zustand 不同的是，他是一个组件级别的状态管理库。和 zustand 相同的是同样都基于不可变状态模型。 | 类似于自定义hook，利用useState 能力，state状态变化触发组件重新渲染 |
| 学习成本 | 很高 | 低 | 低 | 中 | 低 | 低 | 低 | 低 | 低 |
| 使用成本 | 很高，模板代码多 | 低，仅有6个API | 低 | 中 | 低 | 低 | 低 | 低 | 低 |
| Typescript友好 | 友好 | 不友好，没有清晰的依赖关系，类型支持很差 | 友好 | 友好 | 友好 | 友好 | 友好 | 友好 | 友好 |
| 状态拆分 | react/toolkit createSlice | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| 性能 | 中等 | 中等 | 中等 | 好 | 好 | 中等 | 好 | 好 | 好 |
| 异步支持 | 不友好 | 友好 | 友好 | 友好 | 友好 | 友好 | 友好 | 友好 | 友好 |
| React concurrent 模式支持 | 支持 |  | 支持 | 支持 | 支持 | 支持 | 支持 | 支持 |  |
| 易于调试 | 是 | 是 | 是 | 否 | 是 | 是 | 否 | 是 |  |
| devtools | 有 | 有 | 有 | 无 | 无 | 有 | 无 | 无 | 无 |
| SSR | 支持 |  | 支持 | 支持 | 支持，但可能不健全 | 支持，但可能不健全 | 支持，但可能不健全 | 支持，但可能不健全 | 不支持 |

# 参考资料

-   [Do React Hooks Replace Redux?](https://medium.com/javascript-scene/do-react-hooks-replace-redux-210bab340672 "https://medium.com/javascript-scene/do-react-hooks-replace-redux-210bab340672")
-   [React 状态管理工具：我是这样选择的](https://developer.aliyun.com/article/1044636 "https://developer.aliyun.com/article/1044636")
-   [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367 "https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367")
-   [各流派 React 状态管理对比和原理实现](https://zhuanlan.zhihu.com/p/394106764 "https://zhuanlan.zhihu.com/p/394106764")
-   [盘点React常见的状态管理方式](https://juejin.cn/post/7106312479185043463 "https://juejin.cn/post/7106312479185043463")
-   [2022 年，我们再来谈谈 React 状态管理](https://juejin.cn/post/7063054916234772517 "https://juejin.cn/post/7063054916234772517")
-   [DvaJS](https://dvajs.com/ "https://dvajs.com/")
-   [支付宝前端应用架构的发展和选择](https://github.com/sorrycc/blog/issues/6 "https://github.com/sorrycc/blog/issues/6")
-   [HoxJS](https://hox.js.org/zh/ "https://hox.js.org/zh/")
-   [Redux vs Zustand](https://stackshare.io/stackups/reduxjs-vs-zustand "https://stackshare.io/stackups/reduxjs-vs-zustand")
-   [React 状态管理新浪潮](https://maimai.cn/article/detail?fid=1751803241&efid=i0f7DoHdYDIBq6kGhnbyMg "https://maimai.cn/article/detail?fid=1751803241&efid=i0f7DoHdYDIBq6kGhnbyMg")
-   [React-全局状态管理的群魔乱舞](https://mdnice.com/writing/43163f11504d4938897e0975a18c75b8 "https://mdnice.com/writing/43163f11504d4938897e0975a18c75b8")
-   [各流派 React 状态管理对比和原理实现 - mdnice 墨滴](https://mdnice.com/writing/123bc03401d44b22ade8f0bbce7638f6#writing-title "https://mdnice.com/writing/123bc03401d44b22ade8f0bbce7638f6#writing-title")
-   [自述 · Redux](https://www.redux.org.cn/ "https://www.redux.org.cn/")
-   [Recoil - Facebook 官方 React 状态管理器](https://zhuanlan.zhihu.com/p/141576138 "https://zhuanlan.zhihu.com/p/141576138")
-   [\[译\] React 状态管理的前世，今生和未来 - 开发者头条](https://toutiao.io/posts/ttvrzlk/preview "https://toutiao.io/posts/ttvrzlk/preview")
-   [2021年的React状态管理 - 掘金](https://juejin.cn/post/7026232873233416223 "https://juejin.cn/post/7026232873233416223")
-   [状态管理方案发展概览](https://www.sweetalkos.com/post/202 "https://www.sweetalkos.com/post/202")
-   [State Management: Overview | React Common Tools and Practices](https://react-community-tools-practices-cheatsheet.netlify.app/state-management/overview "https://react-community-tools-practices-cheatsheet.netlify.app/state-management/overview")
-   [Blogged Answers: Why React Context is Not a “State Management” Tool (and Why It Doesn’t Replace Redux)](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/ "https://blog.isquaredsoftware.com/2021/01/context-redux-differences/")
-   [zustand vs redux](https://docs.pmnd.rs/zustand/getting-started/comparison#redux "https://docs.pmnd.rs/zustand/getting-started/comparison#redux")
-   [hox - 下一代 React 状态管理器](https://zhuanlan.zhihu.com/p/88738712 "https://zhuanlan.zhihu.com/p/88738712")
-   [MobX vs Redux: Evaluating Two Popular Libraries For State Management | SPEC INDIA](https://www.spec-india.com/blog/mobx-vs-redux "https://www.spec-india.com/blog/mobx-vs-redux")
-   [React 状态管理的新浪潮](https://mp.weixin.qq.com/s/6Er2IQEXXNc8Sb5vVJZZOQ "https://mp.weixin.qq.com/s/6Er2IQEXXNc8Sb5vVJZZOQ")
-   [Redux 的性能问题](https://www.redux.org.cn/docs/faq/Performance.html "https://www.redux.org.cn/docs/faq/Performance.html")
-   [mobx vs redux](https://www.spec-india.com/blog/mobx-vs-redux "https://www.spec-india.com/blog/mobx-vs-redux")
-   [zustand vs jotai vs valtio](https://react-community-tools-practices-cheatsheet.netlify.app/state-management/poimandres/ "https://react-community-tools-practices-cheatsheet.netlify.app/state-management/poimandres/")
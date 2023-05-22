# react 优秀文章

[精益 React 学习指南 （Lean React）- 1.1 React 介绍 - SegmentFault 思否](https://segmentfault.com/a/1190000005140569)
[精益 React 学习指南 （Lean React）- 1.2 JSX 语法 - SegmentFault 思否](https://segmentfault.com/a/1190000005145610)
[精益 React 学习指南 （Lean React）- 1.3 React 组件 - SegmentFault 思否](https://segmentfault.com/a/1190000005151182)
[精益 React 学习指南 （Lean React）- 1.4 React 组件生命周期和方法 - SegmentFault 思否](https://segmentfault.com/a/1190000005161417)
[精益 React 学习指南 （Lean React）- 1.5 React 与 DOM - SegmentFault 思否](https://segmentfault.com/a/1190000005182270)
[精益 React 学习指南 （Lean React）- 1.6 Flux - SegmentFault 思否](https://segmentfault.com/a/1190000005348206)
[精益 React 学习指南 （Lean React）- 2.1 前端工程化概述 - SegmentFault 思否](https://segmentfault.com/a/1190000005594760)
[精益 React 学习指南 （Lean React）- 2.2 webpack - SegmentFault 思否](https://segmentfault.com/a/1190000005612506)
[精益 React 学习指南 （Lean React）- 3.4 掌控 redux 异步 - SegmentFault 思否](https://segmentfault.com/a/1190000005773725)
[精益 React 学习指南 （Lean React）- 3.5 compose redux sagas - SegmentFault 思否](https://segmentfault.com/a/1190000005776381)
[精益 React 学习指南 （Lean React）- 4.2 react patterns - SegmentFault 思否](https://segmentfault.com/a/1190000005838634)
[React源码解读之setState - SegmentFault 思否](https://segmentfault.com/a/1190000015713347/)
[React事务的一些理解 - SegmentFault 思否](https://segmentfault.com/a/1190000018033129?utm_source=sf-similar-article)
[React setState 源码解析 - SegmentFault 思否](https://segmentfault.com/a/1190000017094285?utm_source=sf-similar-article)


[深入浅出React高阶组件](https://segmentfault.com/a/1190000010371752)   
[深入理解 React 高阶组件](https://www.jianshu.com/p/0aae7d4d9bc1)  
[setState异步同步的问题](https://segmentfault.com/a/1190000039310035)
[React 关于setState同步或异步问题的理解](https://blog.csdn.net/Jack_lzx/article/details/121228647)
## react hooks

[React Hooks 系列](https://segmentfault.com/a/1190000023923059)
[React Hook快速入门](https://segmentfault.com/a/1190000019438921)

[React性能优化之useCallback、useMemo以及memo](https://blog.csdn.net/wuChiSha/article/details/107638689)
[前端React面试题总结](https://segmentfault.com/a/1190000041065787)
[React Hook实战](https://segmentfault.com/a/1190000038486334)
[烤透 React Hook](https://segmentfault.com/a/1190000023876566)
[React Hook 详解](https://segmentfault.com/a/1190000022208123)
[梳理useEffect和useLayoutEffect的原理与区别](https://segmentfault.com/a/1190000039087645)  *good*
[React hooks 的基础概念：hooks链表](https://segmentfault.com/a/1190000039076330)  *good*

---
ssr

reactDom.hydrateRoot(<App />, container)
hydrate时，会进行事件绑定，并且对渲染不一致的节点会抛出warning, 如文本内容包含 new Date().toString() 的时间输出，可通过给组件传入prop `suppressHydrationWarning={true}` 禁止抛出warning  

若组件确实需要在服务端和客户端有不同的内容输出，可以设置状态 `this.state={isClient: false}`, 然后在componentDidMount时，执行 `this.setState({isClient: true})` 这会触发再次渲染，得到对应客户端额外的UI，这是有多一次渲染的性能代价的



---

setState

![setState 同步异步](https://segmentfault.com/img/bVbj1Th?w=992&h=688)

----

高阶组件

更通俗地描述为，高阶组件通过包裹（wrapped）被传入的React组件，经过一系列处理，最终返回一个相对增强（enhanced）的React组件，供其他组件调用。

```js
export default function withHeader(WrappedComponent) {
  return class HOC extends Component {
    render() {
      return <div>
        <div className="demo-header">
          我是标题
        </div>
        <WrappedComponent {...this.props}/>
      </div>
    }
  }
}

// 这里使用了ES7里的decorator，来提升写法上的优雅，但是实际上它只是一个语法糖，下面这种写法也是可以的。
// const EnhanceDemo = withHeader(Demo);

@withHeader
export default class Demo extends Component {
  render() {
    return (
      <div>
        我是一个普通组件
      </div>
    );
  }
}

// ----
// 高阶组件工厂函数
export default function (title) { // 可接收参数
  return function (WrappedComponent) {
    return class HOC extends Component {
      render() {
        return <div>
          <div className="demo-header">
            {title
              ? title
              : '我是标题'}
          </div>
          <WrappedComponent {...this.props}/>
        </div>
      }
    }
  }
}

// 如果传入参数，则传入的参数将作为组件的标题呈现
@withHeader('Demo') 
export default class Demo extends Component {
  render() {
    return (
      //...
    );
  }
}

// 柯里化 只传递函数的一部分参数来调用它，让它返回一个函数去处理剩下的参数
// 这里的高阶函数工厂，其实就是一种柯里化处理，绑定了部分参数

```

高阶组件的主要功能是封装并抽离组件的通用逻辑，让此部分逻辑在组件间更好地被复用。

基于属性代理的方式

```js
// props透传给内部组件，并可做适当增强或修改
export default function withHeader(WrappedComponent) {
  return class HOC extends Component {
    render() {
      const newProps = {
        test:'hoc'
      }
      // 透传props，并且传递新的newProps
      return <div>
        <WrappedComponent {...this.props} {...newProps}/>
      </div>
    }
  }
}
```

基于反向继承的方式

```js
// 高阶组件继承低阶组件(被包装的组件)，可以访问低阶组件的各个属性
// 相比属性代理方式，它更像打入组件内部，对其进行修改。
export default function (WrappedComponent) {
  return class Inheritance extends WrappedComponent {
    componentDidMount() {
      // 可以方便地得到state，做一些更深入的修改。
      console.log(this.state);
    }
    render() {
      return super.render();
    }
  }
}
```

组合多个高阶组件

```js
@withHeader
@withLoading
class Demo extends Component{

}

// 使用compose可以简化上述过程，也能体现函数式编程的思想。
// compose函数实现方式有很多种，这里推荐其中一个recompact.compose，
const enhance = compose(withHeader,withLoading);
@enhance
class Demo extends Component{

}

// compose可以帮助我们组合任意个（包括0个）高阶函数，例如compose(a,b,c)返回一个新的函数d，函数d依然接受一个函数作为入参，只不过在内部会依次调用c,b,a，从表现层对使用者保持透明。
```



-----
[react fiber架构学习_神奇大叔的博客-CSDN博客_fiber架构](https://blog.csdn.net/weixin_43294560/article/details/122888711)

react fiber

current tree 和 workInProgress tree

Fiber 树的遍历是这样发生的。 *用深度优先遍历方式，完成fiber树的构建*

- 开始：Fiber 从最上面的 React 元素开始遍历，并为其创建一个 fiber 节点。
- 子节点：然后，它转到子元素，为这个元素创建一个 fiber 节点。这样继续下去，直到到达叶子元素。
- 兄弟节点： 现在，它检查是否有兄弟节点元素。如果有，它就遍历兄弟节点元素，然后再到兄弟姐妹的叶子元素。
- 返回：如果没有兄弟节点，那么它就返回到父节点。

fiber节点的指针有： return  child  sibling 组成fiber树(*链表形式*)

Fiber 使用 requestAnimationFrame 来处理优先级较高的更新，使用 requestIdleCallback 处理优先级较低的更新。因此，在调度工作时，Fiber 检查当前更新的优先级和 deadline （帧结束后的自由时间）。

提交阶段(*任务是同步执行的*)，workInProgress 树成为 current 树，因为它被用来渲染 UI。实际的 DOM 更新，如插入、更新、删除，以及对生命周期方法的调用或者更新相对应的引用 —— 发生在 effect 列表中的节点上。


实现空闲时间暂停、恢复任务的基本实现

```js
function myNonEssentialWork (deadline) {
  // 当回调函数是由于超时才得以执行的话，deadline.didTimeout为true
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout)			    
  {
  	  if(tasks.length > 0){
  	  	doWorkIfNeeded();
  	  } 
   }
  //如果当前帧没有执行完任务，交给下一帧的空闲时间去执行 
  if (tasks.length > 0) {
    requestIdleCallback(myNonEssentialWork);
  }
}
```

react并未使用原生requestIdleCallback，而是使用扩展实现的原因

- 回调并不会严格执行，比如在tab页切换后触发频率会降低
- 兼容性不行

react在不支持requestIdleCallback的浏览器中，通过requestAnimationFrame + MessageChannel模拟实现

```js
window.myRequestIdleCallback = function(callback,options){
    requestAnimationFrame((DOMHighResTimeStamp)=>{
       //requestAnimationFrame第一个参数表示执行时的时间戳
       //最迟执行时间，当前触发的时间+一帧的时间
        myRequestIdleCallback.IdleDeadline = DOMHighResTimeStamp + myRequestIdleCallback.activeAnimationTime
        myRequestIdleCallback.peedingCallback = callback;
        myRequestIdleCallback.channel.port1.postMessage('start');
    })
}
myRequestIdleCallback.activeAnimationTime = 1000/60; // 每一帧的时间 ms
myRequestIdleCallback.IdleDeadline; // 这一帧的截止时间
myRequestIdleCallback.timeRemaining = ()=> myRequestIdleCallback.IdleDeadline - performance.now(); // 执行到此语句还有多少空余时间剩余
myRequestIdleCallback.channel = new MessageChannel();
myRequestIdleCallback.channel.port2.onmessage = function(event){
    // 当收到消息的时候表示，浏览器已经空闲,处理该任务
    const currentTime = performance.now();//运行到当前回调函数的时刻
    // 如果deadline为true，意味着当前时间已经超出了每一帧的截止时间，也就等同于本帧没有任何时间可以处理回调函数，此帧过期
    const isDeadLine = currentTime > myRequestIdleCallback.IdleDeadline
    if( !isDeadLine || myRequestIdleCallback.tiemRemaing()>0){
        if(myRequestIdleCallback.peedingCallback){
        	//执行回调并传入一帧的剩余时间
            myRequestIdleCallback.peedingCallback({
                timeRemaining: myRequestIdleCallback.timeRemaining
            });
        }
    }
}
```

React Fiber把更新过程碎片化，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。

React Fiber一个更新过程被分为两个阶段(Phase)

- 第一个阶段 Reconciliation（协调） Phase
  在第一阶段Reconciliation Phase，包含React元素的作用，生命周期方法和渲染方法，以及应用于组件子元素的diff算法等相关内容。这个阶段是可以被打断的；
- 第二阶段Commit Phase 
  但是到了第二阶段Commit Phase，那就一鼓作气把DOM更新完，绝不会被打断



Reconciliation（协调调和阶段）
在render阶段时，React通过setState或ReactDOM.render来执行组件的更新，并确定需要在UI中更新的内容。如果是第一次渲染，React会为render方法返回的每个元素，创建一个新的fiber节点。在接下来的更新中，将重用和更新现有React元素的fiber 节点。**render阶段的结果是生成一个部分节点标记了side effects的fiber节点树**

render阶段可以异步执行。 React可以根据可用时间来处理一个或多个fiber节点，然后停止已完成的工作，并让出调度权来处理某些事件。然后它从它停止的地方继续。但有时候，它可能需要丢弃完成的工作并再次从头。由于在render阶段执行的工作不会导致任何用户可见的更改（如DOM更新），因此这些暂停是不会有问题的。

commit阶段
**side effects描述了在下一个commit阶段需要完成的工作**。在此阶段，React采用标有side effects的fiber树并将其应用于实例。它遍历side effects列表并执行DOM更新和用户可见的其他更改。在此阶段执行的工作，将会生成用户可见的变化，这就是React需要一次完成它们的原因。



-----

react应用性能优化


react的渲染机制是，生成虚拟dom, 进行dom diff, 进行最小化的dom更新；优化的关键是：减少不必要的渲染

1. 合理拆分组件 (*若一个页面是一个组件，任何状态变化都会导致全页面更新的*)
2. 使用 PureComponent, shouldComponentUpdate, React.memo(*函数组件适用*) 减少子组件的不必要渲染
3. 避免内联函数 / 用 useCallback 缓存函数
4. 避免用index作为key React.Fragment `<></>` 替代多余根div标签, 
5. 路由懒加载  
   ```js
   const AboutPage = () => import(/* webpackChunkName: "about" */ './about.js')
   export const AsyncAboutPage = props => {
    <React.Suspense fallback={Spinner}>
      <AboutPage {...props} />
    </React.Suspendse>
   }
   ```
6. 服务端渲染
   ```js
   // server side
   import { renderToString } from "react-dom/server";
   import MyPage from "./MyPage";
   app.get("/", (req, res) => {
     res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
     res.write("<div id='content'>");  
     res.write(renderToString(<MyPage/>));
     res.write("</div></body></html>");
     res.end();
   });

   // client side
   import ReactDOM from 'react-dom';
   import MyPage from "./MyPage";
   ReactDOM.render(<MyPage />, document.getElementById('app'));
   ```


React.memo(*用于函数组件*) 类似 PureComponent(*用于类组件*) , props state 浅比较 无变化，不重新渲染

在setTimeout 和 原生dom事件回调中，setState是同步的；生命周期和合成事件的回调中，setState是异步的，

如果希望在setState后马上得到最新值，可以这样

```js
handleClick() {
  // this.state.count == 1

  // 1. // setState回调中访问
  this.setState({count: this.state.count + 1}, () => console.log(this.state.count))

  //2. setTimeout(fn, 0)
  setTimeout(() => {
    this.setState({ count: this.state.count + 1})
    console.log(this.state.count) // 2
  })

  // 希望对count增加两次
  this.setState((state) => return {count: state.count + 1})
  this.setState((state) => return {count: state.count + 1})

}
```

钩入： 
状态 useState useReducer useContext  
生命周期 useEffect useLayoutEffect  
实例 useImperativeHandle useRef forwardRef  

hook 只能在函数组件/自定义hook内 顶层调用  eslint-plugin-react-hooks

每个hook调用(如: `useState()`) 都对应一个hook节点，节点之间形成链表，所以hook的顺序很重要，只能顶层调用，保证顺序不变
- mount阶段，从hook调用，创建hook节点，加入链表
- update阶段，从链表获取对应hook节点，取出保存的状态值
- hook链表保存在哪里呢？`currentlyRenderingFiber.memoizedState` 原来是保存在fiber节点上的


```js
// 创建 Hook 节点，同时将当前 Hook 添加到 Hook 链表中
const hook = mountWorkInProgressHook();

// 初始化 Hook 的状态，即读取初始 state 值
if (typeof initialState === 'function') {
  initialState = initialState();
}
hook.memoizedState = hook.baseState = initialState;

// 创建一个新的链表作为更新队列，用来存放更新（setXxx()）
  const queue = (hook.queue = {
    pending: null, // kk: 原来这里是一个循环链表 update1.next -> update2.next -> update3.next -> update1
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });
  
  // 创建一个 dispatch 方法（即 useState 返回的数组的第二个参数：setXxx()），
  // 该方法的作用是用来修改 state，并将此更新添加到更新队列中，另外还会将该更新和当前正在渲染的 fiber 绑定起来
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  
  // 返回当前 state 和 修改 state 的方法
  return [hook.memoizedState, dispatch];
}
```

存储 Hook 的数据结构——链表

上面 mountState() 的代码中出现了 const hook = mountWorkInProgressHook(); 这么一行代码，我们去看看其中的 mountWorkInProgressHook() 函数的内容，就可以知晓 Hook 的数据结构：

```js
// react-reconciler/src/ReactFiberHooks.js
function mountWorkInProgressHook(): Hook {
  // 新建一个 Hook
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,  // next 指向下一个 Hook
  };

  // workInProgressHook 指向当前组件 的 Hook 链表
  if (workInProgressHook === null) {
    // 如果当前组件的 Hook 链表为空，那么就将刚刚新建的 Hook 作为 Hook 链表的第一个节点（头结点） 
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 如果当前组件的 Hook 链表不为空，那么就将刚刚新建的 Hook 添加到 Hook 链表的末尾（作为尾结点）
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```
从上面的代码我们可以知道，一个函数组件中的所有 Hook 是以 链表 的形式存储的。链表中的每个节点就是一个 Hook，每个 Hook 节点的定义是这样的：
```js
export type Hook = {
  memoizedState: any, // Hook 自身维护的状态
  ...
  queue: UpdateQueue<any, any> | null, // Hook 自身维护的更新队列
  next: Hook | null, // next 指向下一个 Hook
};
```

整个 Hook 链表保存在哪里

假如原来还没有 Hook 链表，那么就会将新建的 Hook 节点作为 Hook 链表的头结点，然后把 Hook 链表的头结点保存在 currentlyRenderingFiber.memoizedState 中，也就是**当前 FiberNode 的 memoizedState 属性**（关于 FiberNode 的属性类型定义是写在 /react-reconciler/src/ReactFiber.js 中）。这样简单小小的一个赋值语句，就可以把当前组件和里面的各种 Hook 关联起来的。

> useState 实际上是一个简化版的 useReducer，之所以用户在使用 useState 时不需要传入 reducer，是因为 useState 默认使用 react 官方写好的 reducer：basicStateReducer


当我们调用更新 state 的方法（setXxx）的时候，即调用了 dispatchAction()，这个函数的工作是：新建一个新的 update 对象，添加到更新队列中（queue 链表）上，而且这实际是一个 循环链表。我们来看一下 dispatchAction() 的代码

```js
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
  ...
  // 为当前更新操作新建 update 对象
  const update: Update<S, A> = {
    expirationTime,
    suspenseConfig,
    action,
    eagerReducer: null,
    eagerState: null,
    next: (null: any),
  };
  ...
  // pending 指向的是最新的 update 对象
  // Append the update to the end of the list.
  const pending = queue.pending;
  if (pending === null) {
    // 如果更新队列为空，那么将当前的更新作为更新队列的第一个节点，并且让它的 next 属性指向自身，以此来保持为循环链表
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    // 如果更新队列为非空，那么就将当前的更新对象插入到列表的头部
    update.next = pending.next;
    // 链表的尾结点指向最新的头节点，以保持为一个循环链表
    pending.next = update;
  }
  // 让 queue.pending 指向最新的头节点
  queue.pending = update;
  
  ...
}
```
![hook链表解析图，很清晰](https://segmentfault.com/img/remote/1460000023876578)

何时触发组件更新（重新渲染）使组件到达Update 阶段

在将 update 对象添加到 Hook 的更新队列链表后，dispatchAction() 还会去判断当前调用 setXxx(action) 传入的值（action）和上一次渲染的 state（此时正显示在屏幕上的 state）作对比，看看有没有变化，如果有变化，则调用 scheduleWork() 安排 fiberNode 的更新工作（组件重新渲染），如果没变化，则直接跳过，不安排更新（组件重新渲染）：


```js
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
  ...
  // 生成 update 对象，并将 update 对象添加到更新队列链表中
  ...
  
  // 获取上一次渲染的 state （也就是此时正显示在屏幕上的 state）
  const currentState: S = (queue.lastRenderedState: any);
  
  // 获取当前最新计算出来的 state（这个 state 还没有渲染，只是“迫切想要”渲染）
  const eagerState = lastRenderedReducer(currentState, action); // 如果是 useState，这一句相当于是：const eagerState = action;
  update.eagerReducer = lastRenderedReducer;
  update.eagerState = eagerState;
  
  // 判断 eagerState（当前最新计算出来的 state）和 currentState （上一次渲染时 state） 的值是否相同，如果相同则直接跳过，不再安排 fiberNode 的更新工作（取消组件的重新渲染）
  if (is(eagerState, currentState)) {
    return;
  }
  
  ...
  
  // 触发 fiberNode 安排更新工作（组件重新渲染）
  scheduleWork(fiber, expirationTime);
}
```

调用 scheduleWork 还 不是 马上就更新 fiberNode 让组件重新渲染了，它其中还有各种更新优先级的判断处理还有更新的合并，例如这里的 useState，要等当前所有的 setXxx() 都逐一执行完了，假如其中有调用到 scheduleWork，最终会集中进行一次更新（组件的重新渲染）。

Hook 在 Update 阶段干了啥？

执行 setState() 会触发组件重新渲染，进入update阶段 这时就不是执行 mountState() 了，而是执行 updateState() 了。来看一波 updateState() 的源码：

```js
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}
```

大家可以发现，updateState() 里面实际上调用的是 updateReducer()，这也就再次实锤了 useState 实际上只是简化版的 useReducer 而已。因为我们调用 useState 的时候不会传入 reducer，所以这里会默认传一个 basicStateReducer 进去作为 reducer。

```js
// 默认 reducer
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}
```

接下来，我们来看看 updateReducer() 这个方法：

```js
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // 获取正在执行的处于更新阶段 Hook 节点
  const hook = updateWorkInProgressHook();
  // 获取更新队列链表
  const queue = hook.queue;
  ... 
  // 获取更新队列最初的 update 对象节点
  let first = baseQueue.next;
  // 初始化 newState
  let newState = current.baseState;
  ...
  let update = first;
  ... 
  do {
    ...
    // 循环遍历更新队列链表
    // 从最早的那个 update 对象开始遍历，每次遍历执行一次更新，去更新状态
    const action = update.action;
    newState = reducer(newState, action);
    update = update.next;
  } while (update !== null && update !== first);
  ...
  // 返回最新的状态和修改状态的方法
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```


**useState 运行流程**

上面介绍了 useState（useReducer）在 mount 阶段、 update 阶段分别做的事情以及组件何时触发组件更新，现在来总结一下 useState 整体的运行流程：

组件初次渲染（挂载）时 此时是第一次执行 useState，也就是 mount 阶段，所以执行的是 mountState。

- 在 Hook 链表上添加该 useState 的 Hook 节点
- 初始化 state 的值
- 返回此次渲染的 state 和 修改 state 的方法

当调用 setXxx/dispatchAction 时 创建 update 对象，并将 update 对象添加到该 Hook 节点的更新队列链表；

判断传入的值（action）和当前正在屏幕上渲染的 state 值是否相同，若相同则略过，若不相同，则调用 scheduleWork 安排组件的重新渲染；
当前所有 setXxx 都逐一执行完后，假如其中能满足（2）的条件，即有调用 scheduleWork 的话，则触发更新（组件重新渲染），进入 Update 阶段；

组件重新渲染（更新）时 组件重新渲染，进入 Update 阶段，即第 2 、第 3 、... n 次执行 useState：

- 获取该 useState Hook 的更新队列链表；
- 遍历这个更新队列链表，从最早的那一个 update 对象进行遍历，直至遍历到最近的添加那一个 update 对象，最后得到最新的 state 并返回，作为组件此次渲染的 state；
- 返回此次渲染的 state 和 修改 state 的方法


再康康 useEffect 的源码

useEffect 这个 Hook 也同理，它对应着也有 mountEffect 和 updateEffect。

```js
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  ...
  return mountEffectImpl(
    UpdateEffect | PassiveEffect,
    HookPassive,
    create,
    deps,
  );
}
```

mountEffect 只是作为一个入口，真正开始干活的是 mountEffectImpl：

```js
function mountEffectImpl(fiberEffectTag, hookEffectTag, create, deps): void {
  // 获取当前 Hook 节点，同时将当前 Hook 添加到 Hook 链表中
  const hook = mountWorkInProgressHook();
  
  // 获取依赖
  const nextDeps = deps === undefined ? null : deps;
  
  // pushEffect 的作用是将当前 effect 添加到 FiberNode 的 updateQueue 中，然后返回这个当前 effcet
  // 然后是把返回的当前 effect 保存到 Hook 节点的 memoizedState 属性中
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    undefined,
    nextDeps,
  );
}
```

在 mountEffectImpl 中，会依次获取当前 Hook 节点以及 useEffect 的依赖，并调用 pushEffect 将当前 effect 添加到 FiberNode 的 updateQueue 队列中以及将当 effect 保存在当前 Hook 节点的 memoizedState 属性中。

```js
function pushEffect(tag, create, destroy, deps) {
  const effect: Effect = {
    tag,
    create,
    destroy,
    deps,
    // Circular
    next: (null: any),
  };
  // 获取当前 FiberNode 的 updateQueue
  let componentUpdateQueue: null | FunctionComponentUpdateQueue = (currentlyRenderingFiber.updateQueue: any);
  
  if (componentUpdateQueue === null) {
    // 如果 updateQueue 为空，那就创建一个新的 updateQueue，其中 lastEffect 指向最新添加进来的 effect
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    // 将当前 effect 添加到 updateQueue 中，并同样保持循环链表的结构
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      // 假如 lastEffect 指向 null，说明此时链表还不是循环链表的结构，那么就要控制最新的 effect 的 next 的指向，使其变为循环链表的结构 
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      // 将当前 effect 添加到 updateQueue 中
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      // 令 lastEffect 始终指向最新添加进来的 effect
      componentUpdateQueue.lastEffect = effect;
    }
  }
  // 返回当前 effect
  return effect;
}
```

小结一下，useEffect 在 mount 阶段主要做的事情是：

- 创建当前 Hook 节点，并把它添加到 Hook 链表中；
- 获取本次 effect 的 deps 依赖；
- 将 effect 添加到 fiberNode 的 updateQueue 中。updateQueue 的 lastEffect 属性指向的始终是最新添加进队列的 effect，lastEffect 的 next 始终指向最早添加进来的 effect，以次来又形成一次 循环链表 的结构。

![useEffect updateQueque](https://segmentfault.com/img/remote/1460000023876579)

看完 mountEffect，再来看看 updateEffect：

```js
function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  ...
  return updateEffectImpl(
    UpdateEffect | PassiveEffect,
    HookPassive,
    create,
    deps,
  );
}

function updateEffectImpl(fiberEffectTag, hookEffectTag, create, deps): void {
  // 获取当前 Hook 节点，
  const hook = updateWorkInProgressHook();
  
  // 获取依赖
  const nextDeps = deps === undefined ? null : deps;
  
  // 初始化清除 effect 函数
  let destroy = undefined;

  if (currentHook !== null) {
    // 获取上一次渲染的 Hook 节点的 effect
    const prevEffect = currentHook.memoizedState;
    
    // 获取上一次渲染的 Hook 节点的 effect 的清除函数
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      // 获取上一次渲染的 Hook 节点的 effect 的依赖
      const prevDeps = prevEffect.deps;
      
      // 对比前后依赖的值是否相同
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 如果依赖的值相同，即依赖没有变化，那么就会给这个 effect 打上一个 NoHookEffect 的 tag，然后在组件渲染完以后会跳过这个 effect 的执行
        pushEffect(hookEffectTag, create, destroy, nextDeps);
        return;
      }
    }
  }

  currentlyRenderingFiber.effectTag |= fiberEffectTag;

  // pushEffect 的作用是将当前 effect 添加到 FiberNode 的 updateQueue 中，然后返回这个当前 effcet
  // 然后是把返回的当前 effect 保存到 Hook 节点的 memoizedState 属性中
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    destroy,
    nextDeps,
  );
}

```

update 阶段的 useEffect 和 mount 阶段所做的事情基本相似，唯独不一样就是 update 阶段会考虑 effect 的依赖是否有变化，如果没有变化，那么就给这次 effect 打上 NoHookEffect 的 tag，在最后 commit 阶段（组件视图渲染完成后）会跳过 effect 的执行。

useEffect 运行流程
一个使用 useEffect Hook 的函数组件，在运行的时候的运行流程如下：

组件初次渲染（挂载）：
执行 useEffect 时，将 useEffect Hook 添加到 Hook 链表中，然后创建 fiberNode 的 updateQueue，并把本次 effect 添加到 updateQueue 中；
渲染组件的 UI；
完成 UI 渲染后，执行本次 effect；
组件重新渲染（更新）：
执行 useEffect 时，将 useEffect Hook 添加到 Hook 链表中，判断依赖：

假如没有传入依赖（useEffect 没有传入第二个参数），那么直接给这个 effect 打上 “需要执行” 的 tag；
假如有传入依赖 deps 并且当前依赖和上次渲染时的依赖对比有发生改变，那么就给这个 effect 打上 “需要执行” 的 tag；
假如有传入依赖 deps，但是依赖没有发生改变，那么就给这个 effect 打上 “不需要执行” 的 tag（NoHookEffect）；
假如有传入依赖 deps，但是传入的是一个空数组 []，那么也给这个 effect 打上 “不需要执行” 的 tag（NoHookEffect）；
渲染组件的 UI；
假如有清除函数（effect 中的 return 内容），则执行上一次渲染的清除函数；如果依赖是 []，则先不用执行清除函数，而是等到组件销毁时才执行；
判断本次 effect 的 tag 是否为 “需要执行”，如果是则执行该 effect；如果是 tag 为 “不需要执行”（NoHookEffect） effect 则不需要执行，直接跳过；
组件销毁时：
在组件销毁之前，先执行完组件上次渲染时的清除函数



-----

hooks的意义

- 组件间复用状态相关的逻辑
在组件之间复用状态逻辑很难：React 没有提供将可复用的行为“附加”到组件的途径（例如，把组件连接到 store），如果你使用过 React 一段时间，你也许会熟悉一些解决此类问题的方案，比如 render props 和 高阶组件。但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。React 需要为共享状态逻辑提供更好的原生途径。
- 关注点分离，面向生命周期编程变为面向业务逻辑编程
复杂组件变得难以理解：我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑
- 更简洁，无需关注this的绑定
- 无需创建实例，开销更小

useState使用

- useState是简化版的useReducer
- useState的更新是替换，而不是合并。
- useState可以接收函数参数，并将函数的返回值作为初始值(便于复杂计算)
- useState的更新函数可以接收函数作为参数，函数的参数是前一状态的state值。
  ```js
  setCount((count)=> count + 1)
  ```
- 使用当前的值，对state进行更新不会触发渲染。
  ```js
  const [state, setState] = useState(0);
  // ...
  // 更新 state 不会触发组件重新渲染,(使用Object.is比较)
  setState(0);
  setState(0);
  ```

useEffect使用

- useEffect可以让我们在函数组件中执行副作用操作。事件绑定，数据请求，动态修改DOM。
- useEffect将会在每一次React渲染之后执行。无论是初次挂载时，还是更新。（当然这种行为我们可以控制）
- 如果你熟悉 React class 的生命周期函数，你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合

useContext使用

class组件使用context示例
```js
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

函数组件使用useContext示例

```js
const ThemeContext = React.createContext("light");
export default function APP() {
  // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
  // 无论多深，任何组件都能读取这个值。
  // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <div theme={theme}>{theme}</div>;
}
```
当组件上层最近的 `<ThemeContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 ThemeContext provider 的 context value 值。**kk: 若组件或其祖先组件使用 React.memo 或 shouldComponentUpdate，则不能感知到context的变化，contex变化时不会重新渲染**。

useReducer使用

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

指定初始 state
```js
// 1 直接传入初始state
const [state, dispatch] = useReducer(
  reducer,
  {count: initialCount}
);

// 2 用初始化函数，惰性初始化state
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```


useReducer && useContext 简单的代替 Redux
```js
import React, { useReducer, useContext, useEffect } from "react";

const store = {
    user: null,
    books: null,
    movies: null
};

function reducer(state, action) {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.user };
        case "setBooks":
            return { ...state, books: action.books };
        case "setMovies":
            return { ...state, movies: action.movies };
        default:
            throw new Error();
    }
}

const Context = React.createContext(null);

function App() {
    const [state, dispatch] = useReducer(reducer, store);

    const api = { state, dispatch };
    return (
        <Context.Provider value={api}>
            <User />
            <hr />
            <Books />
            <Movies />
        </Context.Provider>
    );
}

function User() {
    const { state, dispatch } = useContext(Context);
    useEffect(() => {
        ajax("/user").then(user => {
            dispatch({ type: "setUser", user: user });
        });
    }, []);
    return (
        <div>
            <h1>个人信息</h1>
            <div>name: {state.user ? state.user.name : ""}</div>
        </div>
    );
}

function Books() {
    const { state, dispatch } = useContext(Context);
    useEffect(() => {
        ajax("/books").then(books => {
            dispatch({ type: "setBooks", books: books });
        });
    }, []);
    return (
        <div>
            <h1>我的书籍</h1>
            <ol>
                {state.books ? state.books.map(book => <li key={book.id}>{book.name}</li>) : "加载中"}
            </ol>
        </div>
    );
}

function Movies() {
    const { state, dispatch } = useContext(Context);
    useEffect(() => {
        ajax("/movies").then(movies => {
            dispatch({ type: "setMovies", movies: movies });
        });
    }, []);
    return (
        <div>
            <h1>我的电影</h1>
            <ol>
                {state.movies
                    ? state.movies.map(movie => <li key={movie.id}>{movie.name}</li>)
                    : "加载中"}
            </ol>
        </div>
    );
}

// 帮助函数
// 两秒钟后，根据 path 返回一个对象，必定成功不会失败
function ajax(path) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (path === "/user") {
                resolve({
                    id: 1,
                    name: "Frank"
                });
            } else if (path === "/books") {
                resolve([
                    {
                        id: 1,
                        name: "JavaScript 高级程序设计"
                    },
                    {
                        id: 2,
                        name: "JavaScript 初级程序设计"
                    }
                ]);
            } else if (path === "/movies") {
                resolve([
                    {
                        id: 1,
                        name: "信条"
                    },
                    {
                        id: 2,
                        name: "八佰"
                    }
                ]);
            }
        }, 2000);
    });
}
```

useMemo使用

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
// 如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值
```


useCallback使用

```js
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
```

useRef使用

- **useRef 返回一个可变的 ref 对象**，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。
- **ref 这一种访问 DOM 的主要方式**。如果你将 ref 对象以 <div ref={myRef}></div> 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 .current 属性设置为相应的 DOM 节点。
- **myref.current的值 在每个渲染帧保持不变**。它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。因为它创建的是一个普通 Javascript 对象。而 useRef() 和自建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象。
- **myref.current的变化，不会触发渲染** 当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。

```js
// 1 class
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}

// 2 hook function
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

另外一个使用场景是获取 previous props 或 previous state：

```js
import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function APP() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  const prevCount = prevCountRef.current;

  useEffect(() => {
    prevCountRef.current = count;
  });

  const onClick = () => {
    setCount(count + 1);
  };

  return (
    <>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <div onClick={onClick}>onClick div</div>
    </>
  );
}
```

使用useRef来跨越渲染周期存储数据，而且对它修改也不会引起组件渲染
```js
import React, { useState, useEffect, useMemo, useRef } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  const timerID = useRef();

  useEffect(() => {
    timerID.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count > 10) {
      clearInterval(timerID.current);
    }
  });

  return (
    <>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Count: {count}, double: {doubleCount}
      </button>
    </>
  );
}

```

useLayoutEffect使用

可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。
useLayoutEffect 在浏览器渲染前执行
useEffect 在浏览器渲染完成后执行




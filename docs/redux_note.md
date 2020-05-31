# redux notes

转自[阮一峰的 redux 教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html),说的很清楚

React 只是 DOM 的一个抽象层，并不是 Web 应用的完整解决方案。对于大型的复杂应用来说, 组件树比较庞大, 组件之间的通信会比较困难

> 为了解决这个问题，2014 年 Facebook 提出了 Flux 架构的概念，引发了很多的实现。2015 年，Redux 出现，将 Flux 与函数式编程结合一起，很短时间内就成为了最热门的前端架构。

## 一. 什么情况下需要 redux

场景: 多交互、多数据源; 组件状态需要共享; 跨组件改变状态; 状态需要全局可读写

如果不使用 Redux 或者其他状态管理工具，不按照一定规律处理状态的读写，代码很快就会变成一团乱麻。你需要一种机制，可以在同一个地方查询状态、改变状态、传播状态的变化。

## 二. 设计思想

Redux 的设计思想很简单，就两句话。

- _web 应用是一个状态机，状态和视图一一对应_
- _所有状态都保存在一个对象中_

## 三. 基本概念和 API

### Store

Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。

Redux 提供 createStore 这个函数，用来生成 Store。

```js
import { createStore } from "redux";
const store = createStore(reducer);
```

createStore 函数接受另 reducer 函数作为参数，返回新生成的 Store 对象。

### State

Store 对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。

当前时刻的 State，可以通过 `store.getState()` 拿到。

```js
import { createStore } from "redux";
const store = createStore(reducer);

const state = store.getState();
```

Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。

### Action

State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。Action 就是 用户与 View 交互 所发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的 type 属性是必须的，表示 Action 的名称。其他属性可以自由设置，社区有一个规范可以参考。

```js
const action = {
  type: "ADD_TODO",
  payload: "Learn Redux",
};
```

上面代码中，Action 的名称是 ADD_TODO，它携带的信息是字符串 Learn Redux。

可以这样理解，Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

### Action Creator

View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。

```js
// 不用 actionCreator 的话
const action1 = {
  type: "ADD_TODO",
  payload: "Learn Java",
};
const action2 = {
  type: "ADD_TODO",
  payload: "Learn Redux",
};

// 用 actionCreator 的话
const ADD_TODO = "ADD_TODO";
function addToDo(payload) {
  return {
    type: ADD_TODO,
    payload,
  };
}
const action1 = addToDo("Learn Java");
const action2 = addToDo("Learn Redux");
```

上面代码中， addToDo 函数就是一个 Action Creator。

### store.dispatch()

store.dispatch()是 View 发出 Action 的唯一方法。

```js
import { createStore } from "redux";
const store = createStore(reducer);

store.dispatch({
  type: "ADD_TODO",
  payload: "Learn Redux",
});

// 或用 action Creator
store.dispatch(addToDo("Learn Redux"));
```

上面代码中，store.dispatch 接受一个 Action 对象作为参数，将它发送出去。

### Reducer

Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

Reducer 是一个函数，它接受 当前 State 和 Action 作为参数，返回一个新的 State。

```js
const reducer = function (state, action) {
  // change state
  return newState;
};
```

整个应用的初始状态，可以作为 State 的默认值。下面是一个实际的例子。

```js
const defaultState = 0;
const reducer = function(state = defaultState, action) {
    switch (action.type) {
        case 'ADD':
            return state + action.payload;
        case 'SUB'
            return state - action.payload;
        default:
            return state
    }
}
```

store.dispatch 方法会触发 Reducer 的自动执行。为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入 createStore 方法 `const store = createStore(reducer)`。

为什么这个函数叫做 Reducer 呢？因为它可以作为数组的 reduce 方法的参数。请看下面的例子，一系列 Action 对象按照顺序作为一个数组。

```js
const actions = [
  { type: "ADD", payload: 0 },
  { type: "ADD", payload: 1 },
  { type: "ADD", payload: 2 },
];

const total = actions.reduce(reducer, 0); // 3
```

数组的 reduce 方法接受 Reducer 函数作为参数，就可以直接得到最终的状态 3。

### 纯函数

Reducer 函数最重要的特征是，它是一个纯函数(相同的输入，返回相同的输出; 没有副作用的函数)。

由于 Reducer 是纯函数，就可以保证同样的 State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

```js
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```

### store.subscribe()

Store 允许使用 store.subscribe 方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```js
import { createStore } from "redux";
const store = createStore(reducer);

store.subscribe(listener);
```

显然，只要把 View 的更新函数（对于 React 项目，就是组件的 render 方法或 setState 方法）放入 listen，就会实现 View 的自动渲染。

store.subscribe 方法返回一个函数，调用这个函数就可以解除监听。

```js
var unsubscribe = store.subscribe(function () {
  console.log(store.getState());
});

unsubscribe();
```

## 四. Store 的实现

上一节介绍了 Redux 涉及的基本概念，可以发现 Store 提供了三个方法。

```js
store.dispatch();
store.getState();
store.subscribe();
```

```js
import { createStore } from "redux";
let { subscribe, getState, dispatch } = createStore(reducer);
```

createStore 方法还可以接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER);
```

上面代码中，window.STATE_FROM_SERVER 就是整个应用的状态初始值。注意，如果提供了这个参数，它会覆盖 Reducer 函数的默认初始值。

下面是 createStore 方法的一个简单实现，可以了解一下 Store 是怎么生成的。

```js
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  const subscrive = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  return { getState, disaptch, subscribe };
};
```

## 五. Reducer 的拆分

Reducer 函数负责生成 State。由于整个应用只有一个 State 对象，包含所有数据，对于大型应用来说，这个 State 必然十分庞大，导致 Reducer 函数也十分庞大。

```js
    const chatReducer = (state = defaultState, action = {}) {

        var chatLogReducer = function(chatLog, action) {...};
        var statusReducer = function(status, action) {...};
        var userReducer = function(user, action) {...};

        return {
            chatLog: chatLogReducer(state.chatLog, action),
            status: statusReducer(state.status, action),
            user: userReducer(state.user, action)
        }
    }
```

Redux 提供了一个 combineReducers 方法，用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer。

combineReduces 让代码更简单一点

```js
import { combinReducer } from "redux";
const chatReducer = combinReducers({
  chatLog: chatLogReducer,
  status: statusReducer,
  user: userReducer,
});
```

下面是 combineReducer 的简单实现。

```js
const combinReducers = (reducers) => {
  return (state = {}, action = {}) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](nextState[key], action);
      return nextState;
    }, state);
  };
};
```

可以把所有子 Reducer 放在一个文件里面，然后统一引入。

```js
import { combinReducers, createStore } from "redux";
import * as reducers from "./reducers";
const reducer = combinReducers(reducers);
const store = createStore(reducer);
```

## 六. redux 工作流程

1. 首先，用户与 View 交互，触发 Action `store.dispatch(action)`
2. Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action。 Reducer 会返回新的 State `newState = reducer(state, action)`。
3. State 一旦有变化，Store 就会调用监听函数, 更新视图 `component.setState()`。

## 七. 简单示例

```js
    import {createStore} from 'redux';
    import ReactDOM from 'react-dom';

    // 纯函数组件
    const Counter = ({value, onIncrement, onDecrement}) => {
        return (<div>
            <h2>{value}<h2>
            <button onClick={onIncrement}>+</button>
            <button onClick={onDecrement}>-</button>
        </div>)
    };

    const reducer = (state = 0, action = {}) => {
        switch(action.type) {
            case: 'INCREMENT':
                return state + 1;
            case: 'DECREMENT':
                return state  - 1;
            default:
                return state;
        }
    }

    const store = createStore(reducer);

    const render = () => {
        ReactDOM.render(
            <Counter
                value={store.getState()}
                onIncrement={store.dispatch({type: 'INCREMENT'})}
                onDecrement={store.dispatch({type:'DECREMENT'})} />,
            document.getElementById('example')
        )
    };

    render();
    store.subcribe(render);
```

## 八. 中间件与异步操作

前面介绍了 Redux 的基本做法：用户发出 Action，Reducer 函数算出新的 State，View 重新渲染

Action 发出以后，Reducer 立即算出 State，这叫做同步；Action 发出以后，过一段时间再执行 Reducer，这就是异步。

一个关键问题：怎么才能 Reducer 在异步操作结束后自动执行呢？

这就要用到新的工具：中间件（middleware）。

### 中间件的概念

哪个环节适合添加功能?

- Reducer：纯函数，只承担计算 State 的功能，不合适承担其他功能，也承担不了，因为理论上，纯函数不能进行读写操作。

- View：与 State 一一对应，可以看作 State 的视觉层，也不合适承担其他功能。

- Action：存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

想来想去，只有发送 Action 的这个步骤，即 store.dispatch()方法，可以添加功能。

举例来说，要添加日志功能

```js
let next = store.dispatch;
store.dispatch = (action) => {
  console.log("dispatching", action);
  next(action);
  console.log("next state:", store.getState());
};
```

上面代码中，对 store.dispatch 进行了重定义，在发送 Action 前后添加了打印功能。这就是中间件的雏形。

### 中间件的用法

常用的中间件基本被别人都写好了，重点关注怎么使用

```js
    import {applyMiddleware, createStore} = 'redux';
    import createLogger from 'redux-logger';
    const logger = createLogger();

    const store = createStore(reducer, applyMiddleware(logger));
```

上面代码中，redux-logger 提供一个生成器 createLogger，可以生成日志中间件 logger。然后，将它放在 applyMiddleware 方法之中，传入 createStore 方法，就完成了 store.dispatch()的功能增强。

这里有两点需要注意：

1. createStore 方法可以接受整个应用的初始状态作为参数，那样的话，applyMiddleware 就是第三个参数了。

```js
const store = createStore(reducer, initial_state, applyMiddleware(logger));
```

2. 中间件的次序有讲究。

```js
const store = createStore(reducer, applyMiddleware(thunk, promise, logger));
```

上面代码中，applyMiddleware 方法的三个参数，就是三个中间件。有的中间件有次序要求，使用前要查一下文档。比如，logger 就一定要放在最后，否则输出结果会不正确。

### applyMiddleware()

applyMiddlewares 这个方法到底是干什么的？

它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。下面是它的源码。

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };

    // chain = [function(next){return function(action) {...}}, function(next){return function(action) {...}]
    // compose 对chain中的函数 reduceRight
    chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return { ...store, dispatch };
  };
}
```

上面代码中，所有中间件被放进了一个数组 chain，然后嵌套执行，最后执行 store.dispatch。可以看到，中间件内部（middlewareAPI）可以拿到 getState 和 dispatch 这两个方法。

### redux-thunk 中间件

异步操作至少要送出两个 Action：用户触发第一个 Action，这个跟同步操作一样，没有问题；如何才能在操作结束时，系统自动送出第二个 Action 呢？

store.dispatch 方法正常情况下，参数只能是对象，不能是函数。

这时，就要使用中间件 redux-thunk。

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

// Note: this API requires redux@>=3.1.0
const store = createStore(reducer, applyMiddleware(thunk));
```

上面代码使用 redux-thunk 中间件，改造 store.dispatch，使得后者可以接受函数作为参数。

因此，异步操作的第一种解决方案就是，写出一个返回函数的 Action Creator，然后使用 redux-thunk 中间件改造 store.dispatch

### redux-promise

既然 Action Creator 可以返回函数，当然也可以返回其他值。另一种异步操作的解决方案，就是让 Action Creator 返回一个 Promise 对象。

这就需要使用 redux-promise 中间件。

```js
import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import reducer from "./reducers";

const store = createStore(reducer, applyMiddleware(promiseMiddleware));
```

这个中间件使得 store.dispatch 方法可以接受 Promise 对象作为参数。这时，Action Creator 有两种写法。写法一，返回值是一个 Promise 对象。

```js
    const fetchPosts =
      (dispatch, postTitle) => new Promise(function (resolve, reject) {
         dispatch(requestPosts(postTitle));
         return fetch(`/some/API/${postTitle}.json`)
           .then(response => {
             type: 'FETCH_POSTS',
             payload: response.json()
           });
    });
```

写法二，Action 对象的 payload 属性是一个 Promise 对象。这需要从 redux-actions 模块引入 createAction 方法，并且写法也要变成下面这样。

```js
    import { createAction } from 'redux-actions';

    class AsyncApp extends Component {
      componentDidMount() {
        const { dispatch, selectedPost } = this.props
        // 发出同步 Action
        dispatch(requestPosts(selectedPost));
        // 发出异步 Action
        dispatch(createAction(
          'FETCH_POSTS',
          fetch(`/some/API/${postTitle}.json`)
            .then(response => response.json())
        ));
      }
```

上面代码中，第二个 dispatch 方法发出的是异步 Action，只有等到操作结束，这个 Action 才会实际发出。注意，createAction 的第二个参数必须是一个 Promise 对象。

看一下 redux-promise 的源码，就会明白它内部是怎么操作的。

````js
    export default function promiseMiddleware({ dispatch }) {
      return next => action => {
        if (!isFSA(action)) { // isFluxStandardAction
          return isPromise(action)
            ? action.then(dispatch)
            : next(action);
        }

        return isPromise(action.payload)
          ? action.payload.then(
              result => dispatch({ ...action, payload: result }),
              error => {
                dispatch({ ...action, payload: error, error: true });
                return Promise.reject(error);
              }
            )
          : next(action);
      };
    }

```js

从上面代码可以看出，如果 Action 本身是一个 Promise，它 resolve 以后的值应该是一个 Action 对象，会被dispatch方法送出（action.then(dispatch)），但 reject 以后不会有任何动作；如果 Action 对象的payload属性是一个 Promise 对象，那么无论 resolve 和 reject，dispatch方法都会发出 Action。
````

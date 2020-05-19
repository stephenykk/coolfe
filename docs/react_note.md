react notes
==========

react特点
---
+ 声明范式
+ 虚拟dom
+ jsx
+ 组件化
+ 单向响应式数据流


简单示例

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Hello React!</title>
<script src="https://cdn.staticfile.org/react/16.4.0/umd/react.development.js"></script>
<script src="https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js"></script>
<script src="https://cdn.staticfile.org/babel-standalone/6.26.0/babel.min.js"></script>
</head>
<body>

<div id="example"></div>

<!-- jsx语法 type=text/babel -->
<script type="text/babel">
ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
);
</script>

</body>
</html>
```


>> 在浏览器中使用 Babel 来编译 JSX 效率是非常低的。


安装
---
使用 `create-react-app` 快速构建 React 开发环境

[react入门教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
---
### html模板
```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../build/react.js"></script>
    <script src="../build/react-dom.js"></script>
    <!-- 解析jsx -->
    <script src="../build/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <!-- text/babel for jsx -->
    <script type="text/babel">
      // ** Our code goes here! **
    </script>
  </body>
</html>
```

### ReactDOM.render()
```js
ReactDOM.render(
    <h1>Hello world!</h1>, // 根组件
    document.getElementById('exmpale') // 挂载点
)
```


### JSX语法
HTML 语言直接写在 JavaScript 语言之中，不加任何引号，这就是 JSX 的语法，它允许 HTML 与 JavaScript 的混写

```js
var names = ['Alice', 'Emily', 'Kate']
ReactDOM.render(
    <div>
    {
        names.map(function(name) {
            return <div>Hello, {name}</div>
        })
    }
    </div>,
    document.getElementById('example')
)
```
> JSX 的基本语法规则：遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用 JavaScript 规则解析。

JSX 允许直接在模板插入 JavaScript 变量。如果这个变量是一个数组，则会展开这个数组的所有成员

```js
var arr = [
    <h1>Hello world!</h1>,
    <h2>React is awesome</h2>
]
ReactDOM.render(
    <div>{arr}</div>,
    document.getElementById('example')
)
```
### 组件
React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。React.createClass 方法就用于生成一个组件类

```js
var HelloMessage = React.createClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>
  }
});

ReactDOM.render(
  <HelloMessage name="kk" />,
  document.getElmentById('example')
)
```
> 注意，组件类的第一个字母必须大写，否则会报错，比如HelloMessage不能写成helloMessage。另外，组件类只能包含一个顶层标签，否则也会报错。

添加组件属性，有一个地方需要注意，就是 class 属性需要写成 className ，for 属性需要写成 htmlFor ，这是因为 class 和 for 是 JavaScript 的保留字。

### this.props.children
this.props 对象的属性与组件的属性一一对应，但是有一个例外，就是 this.props.children 属性。它表示组件的所有子节点

```js
var NoteList = React.createClass({
  render: function() {
    return (
      <ol>
        {
          React.Children.map(this.props.children, function(child) {
            return <li>{child}</li>
          })
        }
      </ol>
    )
  }
});

ReactDOM.render(
  <NoteList>
    <span>Hello</span>
    <span>World</span>
  </NoteList>,
  document.body
)
```
这里需要注意， this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;如果有一个子节点，数据类型是 object ；如果有多个子节点，数据类型就是 array 。所以，处理 this.props.children 的时候要小心。

React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map 来遍历子节点，而不用担心 this.props.children 的数据类型是 undefined 还是 object

### PropTypes
组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求

```js
var MyTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  },
  render: function() {
    return <h1>{this.props.title}</h1>
  }
});

```

此外，getDefaultProps 方法可以用来设置组件属性的默认值

```js
var MyTitle = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'Hello World'
    }
  },
  render: function() {
    return <h1>{this.props.title}</h1>
  }
});

ReactDOM.render(
  <MyTitle />,
  document.body
)

```

### 获取真实DOM节点
组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。

有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性

```js
var MyComponent = React.createClass({
  handleClick: function() {
    this.refs.input.focus();
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="input" />
        <button onClick={this.handleClick}>focus the input</button>
      </div>
    )
  }
})

ReactDOM.render(
  <MyComponent />,
  document.body
)
```

### this.state
组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI 

```js
// getInitialState, this.setState, this.state
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false}
  },
  handlClick: function() {
    this.setState({liked: !this.state.liked})
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked'
    return (
      <p onClick={this.handleClick}>
        you {text} this, click to toggle
      </p>
    )
  }
})

ReactDOM.render(
  <LikeButton />,
  document.body
)
```
this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。

由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性


### 表单

用户在表单填入的内容，属于用户跟组件的互动，所以不能用 this.props 读取

```js
var Input = React.createClass({
  getInitialState: function() {
    return {value: 'Hello'}
  },
  handleChange: function(event) {
    this.setState({value: event.target.value})
  },
  render: function() {
    var value = this.state.value
    return (
      <div>
        <input type="text" value={value} onChange={this.handleChange} />
      </div>
    )
  }
});
ReactDOM.render(<Input />, document.body)
```

### 组件的生命周期

组件的生命周期分成三个状态：

- Mounting：已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。

- componentWillMount()
- componentDidMount()
- componentWillUpdate(object nextProps, object nextState)
- componentDidUpdate(object prevProps, object prevState)
- componentWillUnmount()

此外，React 还提供两种特殊状态的处理函数。
- componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
- shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

```js
var Hello = React.createClass({
  getInitialState: function() {
    return {opacity: 1.o}
  },
  componentDidMount: function() {
    this.timer = setInterval(function() {
      var opacity = this.state.opacity
      opacity -= 0.05
      if(opacity < 0.1) {
        opacity = 1.0
      }
      this.setState({opacity: opacity})
    }.bind(this), 1000);
  },
  render: function() {
    return (
      <div style={{opacity: this.state.opacity}}>
        Hello {this.props.name}
      </div>
    )
  }
});

ReactDOM.render(
  <Hello name="world" />,
  document.body
)
```

### Ajax
组件的数据来源，通常是通过 Ajax 请求从服务器获取，可以使用 componentDidMount 方法设置 Ajax 请求，等到请求成功，再用 this.setState 方法重新渲染 UI

```js
var UserGist = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    }
  },
  componentDidMount: function() {
    $.get(this.prop.source, function(result) {
      var lastGist = result[0];
      if(this.isMounted) {
        this.setState({
          username: lastGist.owner.login,
          lastGistUrl: lastGist.html_url
        })
      }
    }.bind(this))
  },
  render: function() {
    return (
      <div>
        {this.state.username}'s last gist is
        <a href={this.state.lastGistUrl}>here </a>
      </div>
    )
  }
});

ReactDOM.render(
  <UserGist source="https://api.github.com/users/octocat/gists" />,
  document.body
)
```

我们甚至可以把一个Promise对象传入组件

```js
var RepoList = React.createClass({
  getInitialState: function() {
    return  {loading: true, error: null, data: null}
  },
  componentDidMount() {
    this.props.promise.then(
      value => this.setState({loading: false, data:value}),
      error => this.setState({loading: false, error: error})
    );

  },
  render() {
    if(this.state.loading) {
      return <span>loading...</span>
    } else if(this.state.error !== null) {
      return <span>Error: {this.state.error.message}</span>
    } else {
      var repos = this.state.data.items
      var repoList = repos.map(repo => {
        return (
          <li><a href={repo.html_url}>{repo.name}</a>({repo.start} stars) <br/> {repo.description} </li>
        )
      });

      return (
        <main>
          <h1>Most popular javascript projects</h1>
          <ol>{repoList}</ol>
        </main>
      )
    }
  }

})
ReactDOM.render(
  <RepoList promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')} />,
  document.body
)
```
redux
---
参考[阮一峰的redux教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)，讲解的比较清楚。  

React 只是 DOM 的一个抽象层，并不是 Web 应用的完整解决方案。有两个方面，它没涉及。

- 代码结构
- 组件之间的通信

对于大型的复杂应用来说，这两方面恰恰是最关键的。为了解决这个问题，2014年 Facebook 提出了 Flux 架构的概念，引发了很多的实现。2015年，Redux 出现，将 Flux 与函数式编程结合一起，很短时间内就成为了最热门的前端架构。

### 适用场景

![redux](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091801.png)

简单说，如果你的UI层非常简单，没有很多互动，Redux 就是不必要的，用了反而增加复杂性。

> Redux 的适用场景：多交互、多数据源

从组件角度看，如果你的应用有以下场景，可以考虑使用 Redux。

- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

发生上面情况时，如果不使用 Redux 或者其他状态管理工具，不按照一定规律处理状态的读写，代码很快就会变成一团乱麻。你需要一种机制，可以在同一个地方查询状态、改变状态、传播状态的变化。

### 设计思想

1. Web 应用是一个状态机，视图与状态是一一对应的。
2. 所有的状态，保存在一个对象里面。

### store
Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。

Redux 提供createStore这个函数，用来生成 Store。

```js
import {createStore} from 'redux'
const store = createStore(fn)
```

### state
Store对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。

当前时刻的 State，可以通过store.getState()拿到。 Redux 规定， 一个 State 对应一个 View。
```js
import {createStore} from 'redux'
const store = createStore(fn)

const state = store.getState()
```

### action
State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。其他属性可以自由设置，社区有一个规范可以参考。

```js
action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
}

```

可以这样理解，Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

### action creator
View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。
```js
const ADD_TODO = 'ADD_TODO'
// addTodo函数就是一个 Action Creator
function addTodo(text) {
  type: ADD_TODO,
  payload: text
}
const action = addTodo('Learn Redux')
```

### store.dispatch(action)
store.dispatch()是 View 发出 Action 的唯一方法。
```js
import {createStore} from 'redux'
const store = createStore(fn)

const ADD_TODO = 'ADD_TODO'
// addTodo函数就是一个 Action Creator
function addTodo(text) {
  type: ADD_TODO,
  payload: text
}

// store.dispatch接受一个 Action 对象作为参数，将它发送出去。
store.dispatch(addTodo('Learn Redux'))
```

### reducer
Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State
```js
const reducer = function(state, action) {
  // ...
  return newState
}

```
整个应用的初始状态，可以作为 State 的默认值。下面是一个实际的例子。

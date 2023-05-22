# react notes

[印记中文react文档](https://react.docschina.org/docs/code-splitting.html)

## react 特点

- 声明范式
- 虚拟 dom
- jsx
- 组件化
- 单向响应式数据流

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
        document.getElementById("example")
      );
    </script>
  </body>
</html>
```

> 注: 在浏览器中使用 Babel 来编译 JSX 效率是非常低的

## 安装

使用 `create-react-app` 快速构建 React 开发环境

## [react 入门教程](http://www.ruanyifeng.com/blog/2015/03/react.html)

### html 模板

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

```jsx
ReactDOM.render(
  <h1>Hello world!</h1>, // 根组件
  document.getElementById("exmpale") // 挂载点
);
```

### JSX 语法

HTML 语言直接写在 JavaScript 语言之中，不加任何引号，这就是 JSX 的语法，它允许 HTML 与 JavaScript 的混写

```jsx
var names = ["Alice", "Emily", "Kate"];
ReactDOM.render(
  <div>
    {names.map(function (name) {
      return <div>Hello, {name}</div>;
    })}
  </div>,
  document.getElementById("example")
);
```

> JSX 的基本语法规则：遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用 JavaScript 规则解析。

JSX 允许直接在模板插入 JavaScript 变量。如果这个变量是一个数组，则会展开这个数组的所有成员

```jsx
var arr = [<h1>Hello world!</h1>, <h2>React is awesome</h2>];
ReactDOM.render(<div>{arr}</div>, document.getElementById("example"));
```

### 组件

React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。React.createClass 方法就用于生成一个组件类

```js
var HelloMessage = React.createClass({
  render: function () {
    return <h1>Hello, {this.props.name}</h1>;
  },
});

ReactDOM.render(<HelloMessage name="kk" />, document.getElmentById("example"));
```

> 注意，组件类的第一个字母必须大写，否则会报错，比如 HelloMessage 不能写成 helloMessage。另外，组件类只能包含一个顶层标签，否则也会报错。

添加组件属性，有一个地方需要注意，就是 class 属性需要写成 className ，for 属性需要写成 htmlFor ，这是因为 class 和 for 是 JavaScript 的保留字。

### this.props.children

this.props 对象的属性与组件的属性一一对应，但是有一个例外，就是 this.props.children 属性。它表示组件的所有子节点

```js
var NoteList = React.createClass({
  render: function () {
    return (
      <ol>
        {React.Children.map(this.props.children, function (child) {
          return <li>{child}</li>;
        })}
      </ol>
    );
  },
});

ReactDOM.render(
  <NoteList>
    <span>Hello</span>
    <span>World</span>
  </NoteList>,
  document.body
);
```

这里需要注意， this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;如果有一个子节点，数据类型是 object ；如果有多个子节点，数据类型就是 array 。所以，处理 this.props.children 的时候要小心。

React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map 来遍历子节点，而不用担心 this.props.children 的数据类型是 undefined 还是 object

### PropTypes

组件类的 PropTypes 属性，就是用来验证组件实例的属性是否符合要求

```js
var MyTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },
  render: function () {
    return <h1>{this.props.title}</h1>;
  },
});
```

此外，getDefaultProps 方法可以用来设置组件属性的默认值

```js
var MyTitle = React.createClass({
  getDefaultProps: function () {
    return {
      title: "Hello World",
    };
  },
  render: function () {
    return <h1>{this.props.title}</h1>;
  },
});

ReactDOM.render(<MyTitle />, document.body);
```

### 获取真实 DOM 节点

组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM 上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。

有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性

```js
var MyComponent = React.createClass({
  handleClick: function () {
    this.refs.input.focus();
  },
  render: function () {
    return (
      <div>
        <input type="text" ref="input" />
        <button onClick={() => this.handleClick()}>focus the input</button>
      </div>
    );
  },
});

ReactDOM.render(<MyComponent />, document.body);
```

### this.state

组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI

```js
// getInitialState, this.setState, this.state
var LikeButton = React.createClass({
  getInitialState: function () {
    return { liked: false };
  },
  handlClick: function () {
    this.setState({ liked: !this.state.liked });
  },
  render: function () {
    var text = this.state.liked ? "like" : "haven't liked";
    {/* React.createClass 自动绑定方法上下文 */ }
    return <p onClick={this.handleClick}>you {text} this, click to toggle</p>;
  },
});

ReactDOM.render(<LikeButton />, document.body);
```

this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。

由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性

### 表单

用户在表单填入的内容，属于用户跟组件的互动，所以不能用 this.props 读取

```js
var Input = React.createClass({
  getInitialState: function () {
    return { value: "Hello" };
  },
  handleChange: function (event) {
    this.setState({ value: event.target.value });
  },
  render: function () {
    var value = this.state.value;
    return (
      <div>
        <input type="text" value={value} onChange={this.handleChange} />
      </div>
    );
  },
});
ReactDOM.render(<Input />, document.body);
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
  getInitialState: function () {
    return {
      username: "",
      lastGistUrl: "",
    };
  },
  componentDidMount: function () {
    $.get(
      this.prop.source,
      function (result) {
        var lastGist = result[0];
        if (this.isMounted) {
          this.setState({
            username: lastGist.owner.login,
            lastGistUrl: lastGist.html_url,
          });
        }
      }.bind(this)
    );
  },
  render: function () {
    return (
      <div>
        {this.state.username}'s last gist is
        <a href={this.state.lastGistUrl}>here </a>
      </div>
    );
  },
});

ReactDOM.render(
  <UserGist source="https://api.github.com/users/octocat/gists" />,
  document.body
);
```

我们甚至可以把一个 Promise 对象传入组件

```js
var RepoList = React.createClass({
  getInitialState: function () {
    return { loading: true, error: null, data: null };
  },
  componentDidMount() {
    this.props.promise.then(
      (value) => this.setState({ loading: false, data: value }),
      (error) => this.setState({ loading: false, error: error })
    );
  },
  render() {
    if (this.state.loading) {
      return <span>loading...</span>;
    } else if (this.state.error !== null) {
      return <span>Error: {this.state.error.message}</span>;
    } else {
      var repos = this.state.data.items;
      var repoList = repos.map((repo) => {
        return (
          <li>
            <a href={repo.html_url}>{repo.name}</a>({repo.start} stars) <br />{" "}
            {repo.description}{" "}
          </li>
        );
      });

      return (
        <main>
          <h1>Most popular javascript projects</h1>
          <ol>{repoList}</ol>
        </main>
      );
    }
  },
});
ReactDOM.render(
  <RepoList
    promise={$.getJSON(
      "https://api.github.com/search/repositories?q=javascript&sort=stars"
    )}
  />,
  document.body
);
```

## redux

参考[阮一峰的 redux 教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)，讲解的比较清楚。  
[redux 知识点笔记](./redux_note.md)


## more about react
```js
import ReactDOM from 'react-dom'
ReactDOM.render(<h1>Hello World</h1>, document.getElementById('app'), callback?)

// jsx
var element = <h1>Hello React</h1>
```
### JSX 
JSX是一种javascript的语法扩展，可以很好地描述UI，具有JS的全部能力，本质上是 `React.createElement()` 调用，返回React元素  
组件化后，UI结构和行为重新结合  
属性使用驼峰命名 如 `tabIndex` , `className`  
JSX会转义表达式内容，防止XSS  

### React元素
元素是构成React应用的最小砖块，描述了要在屏幕上展示的内容   
元素是开销很低的普通对象，React DOM 负责保持DOM和元素一致  
组件由元素构成，可复用的逻辑单元

```jsx
// 元素渲染到页面
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));

```

React 元素是不可变对象。一旦被创建，你就无法更改它的子元素或者属性，更新 UI 唯一的方式是创建一个全新的元素，并将其传入 ReactDOM.render()。

```jsx
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);

```

React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期的状态。


### 组件和props
组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思  

组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

函数组件与 class 组件   

函数组件 本质上就是 JavaScript 函数
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}


class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”。

> 组件名称必须以大写字母开头。
> 我们建议从组件自身的角度命名 props，而不是依赖于调用组件的上下文命名。

```jsx
function Welcome(props) {  
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

`Props` 的只读性   
组件无论是使用函数声明还是通过 class 声明，都决不能修改自身的 props

React 非常灵活，但它也有一个严格的规则：

所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。


### State & 生命周期
State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。  

> 尽管 this.props 和 this.state 是 React 本身设置的，且都拥有特殊的含义，但是其实你可以向 class 中随意添加不参与数据流（比如计时器 ID）的额外字段。

```jsx
import React from 'react'

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {    
    this.setState({date: new Date()});  
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

正确地使用 State :

- 不要直接修改 State , 用 `this.setState()`
- 构造函数是唯一可以给 this.state 赋值的地方
- State 的更新可能是异步的 
  ```js
    // Correct, 计算下一个状态依赖当前状态时，用回调方式
    this.setState((state, props) => ({
      counter: state.counter + props.increment
    }));
  ```
- State 的更新会被合并 
  ```js
  class Example extends React.Component {
     constructor(props) {
        super(props);
        this.state = {
          posts: [],      
          comments: []    
        };
      }

     // 这里的合并是浅合并，
     // 所以 this.setState({comments}) 完整保留了 this.state.posts， 
     // 但是完全替换了 this.state.comments。
     componentDidMount() {
        fetchComments().then(response => {
          
          this.setState({
            comments: response.comments      });
        });
      }
  }
  ```
- 数据是向下流动的  
  组件可以选择把它的 state 作为 props 向下传递到它的子组件中：`<FormattedDate date={this.state.date} />`  
  这通常会被叫做“自上而下”或是“单向”的数据流。任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。

  如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。


### 事件处理

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。
- 
```jsx
function ActionLink() {
  function handleClick(e) {    
    e.preventDefault();    
    console.log('The link was clicked.');  
  }

  return (
    <a href="#" onClick={handleClick}>      
      Click me
    </a>
  );
}
```

class组件，事件绑定到方法

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的    
    this.handleClick = this.handleClick.bind(this);  
  }

  handleClick() {    
    this.setState(state => ({ isToggleOn: !state.isToggleOn }));  
  }

  render() {
    return (
      <button onClick={this.handleClick}>       
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

如果觉得使用 bind 很麻烦，这里有两种方式可以解决。

- *public class field*  
  ```jsx
  class LoggingButton extends React.Component {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。  
    // 注意: 这是 *实验性* 语法。  
    handleClick = () => {    
      console.log('this is:', this);  
    }

    render() {
      return (
        <button onClick={this.handleClick}>
          Click me
        </button>
      );
    }
  }
  ```
- 在回调中使用箭头函数  
  ```jsx
  class LoggingButton extends React.Component {
    handleClick() {
      console.log('this is:', this);
    }

    render() {
      // 此语法确保 `handleClick` 内的 `this` 已被绑定。    
      return (
        <button onClick={() => this.handleClick()}>
          Click me
        </button>
      );
    }
  }
  ```
  此语法问题在于每次渲染 LoggingButton 时都会创建不同的回调函数。在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题


向事件处理程序传递参数  

```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```
上述两种方式是等价的，分别通过箭头函数和 Function.prototype.bind 来实现。


### 条件渲染
React 中的条件渲染和 JavaScript 中的一样，使用 JavaScript 运算符 if 或者条件运算符去创建元素来表现当前的状态，然后让 React 根据它们来更新 UI

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {    
    return <UserGreeting />;  
  }  
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,  
  document.getElementById('root')
);
```

**元素变量**  
你可以使用变量来储存元素。 它可以帮助你有条件地渲染组件的一部分，而其他的渲染部分并不会因此而改变。

```jsx
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {      
      button = <LogoutButton onClick={this.handleLogoutClick} />;    
    } else {      
      button = <LoginButton onClick={this.handleLoginClick} />;    
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />        
        {button}      
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

**与运算符 && **
```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&        <h2>          You have {unreadMessages.length} unread messages.        </h2>      }    
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

**三目运算符 **

```jsx
class Example1 extends React.Component {
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      <div>
        The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.    </div>
    );
    }
}

class Example2 extends React.Component {
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      <div>
        {isLoggedIn        
          ? <LogoutButton onClick={this.handleLogoutClick} />
          : <LoginButton onClick={this.handleLoginClick} />      
        }
      </div>  
    );
  }
}
```

**阻止组件渲染 **  
让 render 方法直接返回 null，而不进行任何渲染
```jsx
function WarningBanner(props) {
  if (!props.warn) {    return null;  }
  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />        
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

在组件的 render 方法中返回 null 并不会影响组件的生命周期。例如，上面这个示例中，componentDidUpdate 依然会被调用

### 列表渲染和key
使用 map() 函数让数组元素转换为React元素

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>    <li key={number.toString()}>{number}</li>  );  

  return (
    <ul>{listItems}</ul>  
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,  
  document.getElementById('root')
);
```

一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用数据中的 id 来作为元素的 key

**用 key 提取组件**
元素的 key 只有放在就近的数组上下文中才有意义。
```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 元素的 key 应该在这里指定; 而不是 ListItem内部    
    <ListItem key={number.toString()} value={number} />  
  );

  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

key 只是在兄弟节点之间必须唯一 它们不需要是全局唯一的。

key 会传递信息给 React ，但不会传递给你的组件。如果你的组件中需要使用 key 属性的值，请用其他属性名显式传递这个值

```jsx
const content = posts.map((post) =>
  <Post
    key={post.id}    
    id={post.id}    
    title={post.title} />
);
```

JSX 允许在大括号中嵌入任何表达式，所以我们可以内联 map() 返回的结果：

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>        
        <ListItem 
          key={number.toString()}                  
          value={number} />      
      )}    
    </ul>
  );
}
```
### 表单
在 React 里，HTML 表单元素的工作方式和其他的 DOM 元素有些不同，这是因为表单元素通常会保持一些内部的 state

受控组件  
React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {    
    this.setState({value: event.target.value});  
  }
  
  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

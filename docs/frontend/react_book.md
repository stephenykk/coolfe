# react book reading notes

**深入 react 技术栈**

React 社区进一步强调不可变性（immutability）和单向数据流

> React 之所以流行，在于它平衡了函数式编程的约束与工程师的实用主义
> 函数式约定搭配实用主义，让我不禁想起 Facebook 一直倡导的黑客之道：Done is better than perfect。

## 认识 react

每次数据更新后，重新计算 Virtual DOM，并和上一次生成的 Virtual DOM 做对比，对发生
变化的部分做批量更新。React 也提供了直观的 shouldComponentUpdate 生命周期回调，来减少数
据变化后不必要的 Virtual DOM 对比过程，以保证性能。

> 平台无关性是 Virtual DOM 的最大好处

> 函数式编程，对应的是声明式编程，它是人类模仿自己逻辑思考方式发明出来的。声明式编程的本质是 lambda 演算 ①。
> 可以说，函数式编程才是 React 的精髓

在 React 中创建的虚拟元素可以分为两类，DOM 元素（DOM element）与组件元素（component element），分别对应着原生 DOM 元素与自定义组件元素

JSX 还可以通过命名空间的方式使用组件元素，以解决组件相同名称冲突的问题

```jsx
const App = () => <MUI.RaisedButton label="Default" />;
```

React 会将所有要显示到 DOM 的字符串转义，防止 XSS。 React 提供了 dangerouslySetInnerHTML 属性。正如其名，它的作用就是避免 React 转义字符，在确定必要的情况下可以使用它

```tsx
<div dangerouslySetInnerHTML={{ __html: "cc &copy; 2015" }} />
```

官方在 React 组件构建上提供了 3 种不同的方法：React.createClass、ES6 classes 和无状态
函数（stateless function）。

```jsx
// 1. React.createClass()
const Button = React.createClass({
  getDefaultProps() {
    return {
      color: "blue",
      text: "Confirm",
    };
  },
  render() {
    const { color, text } = this.props;
    return (
      <button className={`btn btn-${color}`}>
        <em>{text}</em>
      </button>
    );
  },
});

// 2. es6 class
import React, { Component } from "react";
class Button extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    color: "blue",
    text: "Confirm",
  };
  render() {
    const { color, text } = this.props;
    return (
      <button className={`btn btn-${color}`}>
        <em>{text}</em>
      </button>
    );
  }
}

// 2. 无状态组件 / 函数组件
// 无状态组件只传入 props 和 context 两个参数；也就是说，它不存在 state，也没有生命周
// 期方法，组件本身即上面两种 React 组件构建方法中的 render 方法。不过，像 propTypes 和
// defaultProps 还是可以通过向方法设置静态属性来实现的。
function Button({ color = "blue", text = "Confirm" }) {
  return (
    <button className={`btn btn-${color}`}>
      <em>{text}</em>
    </button>
  );
}
```

> 继承与组合的不同，它们可以用 IS-A 与 HAS-A 来区别

> React 的所有组件都继承自顶层类 React.Component。它的定义非常简洁，只是初始化了 React.Component 方法，声明了 props、context、refs 等，并在原型上定义了 setState 和 forceUpdate 方法。内部初始化的生命周期方法与 createClass 方式使用的是同一个方法创建的。

**单向数据流**

在 React 中，数据是自顶向下单向流动的，即从父组件到子组件。这条原则让组件之间的关系变得简单且可预测

state 与 props 是 React 组件中最重要的概念。如果顶层组件初始化 props，那么 React 会向下
遍历整棵组件树，重新尝试渲染所有相关的子组件。而 state 只关心每个组件自己内部的状态，
这些状态只能在组件内改变。把组件看成一个函数，那么它接受了 props 作为参数，内部由 state
作为函数的内部参数，返回一个 Virtual DOM 的实现。

> 值得注意的是，setState 是一个异步方法，一个生命周期内所有的 setState 方法会合并操作。

**ReactDOM**

```js
import React from 'react'
import ReactDom from 'react-dom'

ReactDOM.findDOMNode(cmp)
ReactDOM.unmountComponentAtNode(node)
ReactDOM.render(cmp, node, callback?)
ReactDOM.createPortal()
ReactDOM.unstable_renderSubtreeIntoContainer(parentCmp, nextEle, container, cb)
```

> 当组件在初次渲染之后再次更新时，React 不会把整个组件重新渲染一次，而会用它高效的 DOM diff 算法做局部的更新。这也是 React 最大的亮点之一！

**refs**

```jsx
import React, { Component } from "react";
class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.myTextInput !== null) {
      this.myTextInput.focus();
    }
  }
  render() {
    return (
      <div>
        {/* refs callback */}
        <input type="text" ref={(ref) => (this.myTextInput = ref)} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
```

对于 DOM 操作，不仅可以使用 findDOMNode 获得该组件 DOM，还可以使用 refs 获得组件内部的 DOM

```jsx
import React, { Component } from "react";
import ReactDOM from "react-dom";
class App extends Component {
  componentDidMount() {
    // myComp 是 Comp 的一个实例，因此需要用 findDOMNode 转换为相应的 DOM
    const myComp = this.refs.myComp;
    const dom = ReactDOM.findDOMNode(myComp);
  }
  render() {
    return (
      <div>
        <Comp ref="myComp" />
      </div>
    );
  }
}
```

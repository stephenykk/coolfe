微前端
===

[微前端讨论](https://www.yuque.com/kuitos/gky7yw/rhduwc)



----


微前端的价值：
- 工程价值  
  技术栈自由选择 开发体验 前端协同开发问题 渐进式的重构“巨石应用" 陈旧系统增加新功能模块 
- 产品价值
  平台类型系统会体现比较明显，比较容易集成其他子系统


既然「技术栈无关」是微前端的核心价值 具体到实现时，对应的就是：应用之间不应该有任何直接或间接的技术栈、依赖、以及实现上的耦合。


子应用是否具备不依赖宿主环境独立运行的能力

所以我认为正确的微前端方案的目标应该是：方案上跟使用 iframe 做微前端一样简单，同时又解决了 iframe 带来的各种体验上的问题。


如果不考虑体验问题，iframe 几乎是最完美的微前端解决方案了。 iframe的最强的就是就在于接入第三方应用0成本。

iframe原生提供了样式 脚本和Dom结构的硬隔离

iframe的问题：

- URL不同步（刷新页面，子页面就"回到解放前")  前进/后退 失效
- DOM结构不共享 （子页面要全屏居中弹窗比较难实现)
- 全局上下文隔离通信比较麻烦 (同步登录相关cookie, iframe内外通信 若子应用跨域，通信更困难)
- 加载慢 （每次进入子应用，都是整个页面加载）


子应用需要可以独立开发、运行和部署；减轻前端协同开发的问题

> 微前端和iframe的关系有点像docker和vmware的区别


qiankun 是一个生产可用的微前端框架，它基于 single-spa，具备 js 沙箱、样式隔离、HTML Loader、预加载 等微前端系统所需的能力。qiankun 可以用于任意 js 框架，微应用接入像嵌入一个 iframe 系统一样简单。


qiankun@2.0  将跳出 route-based 的微前端场景， 提供更加通用的微应用加载能力，让用户可以更加自由的组合微应用来搭建产品。 你应该可以在同一个页面中，加载多个不同的微应用

支持基于 Shadow DOM 的样式隔离

更灵活的 prefetch 的定制策略

**在多应用场景下，每个微应用的沙箱都是相互隔离的，也就是说每个微应用对全局的影响都会局限在微应用自己的作用域内。**比如 A 应用在 window 上新增了个属性 test，这个属性只能在 A 应用自己的作用域通过 window.test 获取到，主应用或者其他微应用都无法拿到这个变量。

为了更方便的同时装载多个微应用，我们提供了一个全新的 API `loadMicroApp` ，用于手动控制微应用：

```js
import { loadMicroApp } from 'qiankun';

/** 手动加载一个微应用 */
const microApp = loadMicroApp(
  {
    name: "microApp",
    entry: "https://localhost:7001/micro-app.html",
    container: "#microApp"
  }
)

// 手动卸载
microApp.mountPromise.then(() => microApp.unmount());
```

基于这个 api，你可以很容易的封装一个自己的微应用容器组件，比如：

```js
class MicroApp extends React.Component {
  
  microAppRef = null;
  
  componentDidMount() {
    const { name, entry } = this.props;
    this.microAppRef = loadMicroApp({ name, entry, container: '#container' });
  }
  
  componentWillUnmount() {
    this.microAppRef.mountPromise.then(() => this.microAppRef.unmount());
  }
  
  render() {
    return <div id="container"/>;
  }
}
```

兼容 IE11 的沙箱能力


*qiankun 1.x 在 IE 使用的主要阻碍就是 qiankun 的沙箱使用了 ES6 的 Proxy*，而这无法通过 ployfill 等方式弥补。这导致 IE 下的 qiankun 用户无法开启 qiankun 的沙箱功能，导致 js 隔离、样式隔离这些能力都无法启用。

为此，我们实现了一个 IE 特供的快照沙箱，用于这些不支持 Proxy 的浏览器；这不需要用户手动开启，在**代理沙箱**不支持的环境中，我们会自动降级到**快照沙箱**。


基于 shadow DOM 的样式隔离

我们引入了一个新的选项， `sandbox: { strictStyleIsolation?: boolean }` 在该选项开启的情况下，我们会以 Shadow DOM 的形式嵌入微应用，以此来做到应用样式的真正隔离

```js
import { loadMicroApp } from 'qiankun'

loadMicroApp({xxx}, { sandbox: { strictStyleIsolation: true } });
```

Shadow DOM 可以做到样式之间的真正隔离（而不是依赖分配前缀等约定式隔离），其形式如下：

![shadow dom](https://www.yuque.com/api/filetransfer/images?url=https%3A%2F%2Fintranetproxy.alipay.com%2Fskylark%2Flark%2F0%2F2020%2Fpng%2F115236%2F1586705805061-5df923f3-630d-46c4-9ed8-fe042afb2f21.png&sign=b6d0def52a5b44e32a718fc6d047cbadd0d504360e5d4b7f16784211431f72c2)



极简通信方案

微前端场景下，我们认为最合理的通信方案是通过 URL 及 CustomEvent 来处理。但在一些简单场景下，基于 props 的方案会更直接便捷，因此我们为 qiankun 用户提供这样一组 API 来完成应用间的通信

```js
// 主应用创建共享状态
import { initGloabalState } from 'qiankun';

initGloabalState({ user: 'kuitos' });

// 子应用监听状态变化
export function mount(props) {
  props.onGlobalStateChange((state, prevState) => {
    console.log(state, prevState);
  });
};

```

主应用中注册微应用

```js
import { registerMicroApps } from 'qiankun'

registerMicroApps(
  [
    {
      name: 'react16',
      entry: '//localhost:7100',
      activeRule: '/react',
      container: '#subapp-viewport',
    },
  ]
)
```

MicroApp组件

```js
import { MicroApp } from 'umi';

function MyPage(props) {
  const { loading } = props;
  
  if (loading) {
    return <Spin />;
  }
  
  return (
    <div>
      <MicroApp name="microApp1"/>
    </div>
  )
}
```

主应用和子应用通信

```js
// MicroApp组件方式加载 props
function MyPage() {
  const [name, setName] = useState(null);
  return <MicroApp name={name} onNameChange={newName => setName(newName)} />
}


// 路由绑定式 消费微应用
// src/app.ts
export function useQiankunStateForSlave() {
  const [globalState, setGlobalState] = useState({});
  
  return {
    globalState,
    setGlobalState,
  }
}

// 主应用需要变更 globalState 并自动触发子应用更新
import { useModel } from 'umi';

function MyPage() {
  const { setGlobalState } = useModel('@@qiankunStateForSlave');
  return <button onClick={() => setGlobalState({})}>修改主应用全局状态</button>
}

// 子应用消费全局状态
import { useModel } from 'umi';

function MyPage() {
  const masterState = useModel('@@qiankunStateFromMaster');
  
  return <div>{ masterState.userName }</div>
}

```

> 所有的软件工程原则也都会告诉我们，不遗余力、不计成本的去优化、解决一个技术问题是不可取的，尤其是在这个问题的投入产出比不高的情况下。


主子应用的样式隔离还是推荐构建时统一配置 prefix 的方案，比如 antd 就有这类配置，qiankun 官网也是这么推荐的


----

qiankun 使用

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```
当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

如果微应用不是直接跟路由关联的时候，你也可以选择手动加载微应用的方式：

```js
import { loadMicroApp } from 'qiankun';

loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```
微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

```js
**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```
除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：
```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

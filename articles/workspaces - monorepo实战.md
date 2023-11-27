workspaces - monorepo实战
===


# 前言

npm 自从v7开始，引入了一个十分强大的功能，那就是`workspaces`。另外，yarn和pnpm也拥有`workspaces`的能力。不过，从用法上来说，几乎是一模一样的。所以，学会了npm workspaces的话，自然而然也就学会了yarn和pnpm的了。

# 概览

本文会分四个部分进行介绍：

1.  什么是workspaces；
2.  多包管理；
3.  多项目管理；
4.  避坑；
5.  总结；

# 什么是workspaces？

顾名思义，workspaces就是多空间的概念，在npm中可以理解为多包。它的初衷是为了用来进行多包管理的，它可以让多个npm包在同一个项目中进行开发和管理变得非常方便：

-   它会将子包中所有的依赖包都提升到根目录中进行安装，提升包安装的速度；
-   它初始化后会自动将子包之间的依赖进行关联（软链接）；
-   因为同一个项目的关系，从而可以让各个子包共享一些流程，比如：eslint、stylelint、git hooks、publish flow等；

这个设计模式最初来自于Lerna，但Lerna对于多包管理，有着更强的能力，而且最新版的Lerna可以完全兼容npm或yarn的workspaces模式。不过因为本文讲的是workspaces，所以，对于Lerna有兴趣的同学，可以自行去[Lerna官网](https://lerna.js.org/ "https://lerna.js.org/")学习。

# 多包管理

多包管理上面已经说过它相对单包单独管理的好处。所以，我们通过实例的例子来让同学们感受一下workspaces为什么被我吹的这么牛批。

## 例子演示

项目地址我挂在github上了，有兴趣的同学可以自行查看[源码](https://github.com/CodeLittlePrince/demo-workspaces-multi-packages "https://github.com/CodeLittlePrince/demo-workspaces-multi-packages")。

### 1\. 升级npm到7或最新版

```shell
npm i -g npm@latest
```

### 2\. 创建项目

```shell
mkdir demo-workspaces-multi-packages
```

### 3\. 初始化项目

```shell
npm init -y
.
└── package.json
```

### 4\. 声明本项目是workspaces模式

`package.json`新增配置：

```json
"private":"true",
"workspaces": [
  "packages/*"
],
```

这里的`packages/*`表示我们的子包都在`packages`文件夹下。（对于workspaces的细节和更多用法本文不会一一介绍，文档非常清楚，本文讲究实战）

### 5\. 初始化子包`m1`

创建子包`m1`：

```shell
npm init -w packages/m1 -y
.
├── package.json
└── packages
    └── m1
        └── package.json
```

创建`m1`的主文件`index.js`：

```shell
echo "exports.name = 'kitty'" >> packages/m1/index.js
.
├── package.json
└── packages
    └── m1
        ├── index.js
        └── package.json
```

### 6\. 初始化子包`m2`

同样的方式，创建子包`m2`：

```shell
npm init -w packages/m2 -y
.
├── package.json
└── packages
    ├── m1
    │   ├── index.js
    │   └── package.json
    └── m2
        └── package.json
```

创建`m2`的主文件`index.js`：

```shell
echo "const { name } = require('m1')\nexports.name = name" >> packages/m2/index.js
.
├── package.json
└── packages
    ├── m1
    │   ├── index.js
    │   └── package.json
    └── m2
        ├── index.js
        └── package.json
```

因为这里`require('m1')`，所以需要添加`m1`依赖到`m2`的`package.json`中：

```shell
npm i -S m1 --workspace=m2
```

### 7\. 初始化子包`demo`

为了方便我们看到效果，再创建一个`demo`文件夹（多包管理推荐搞个demo子包进行整体效果测试）：

```shell
npm init -w packages/demo -y
echo "const { name } = require('m2')\nconsole.log(name)" >> packages/demo/index.js
.
├── package.json
└── packages
    ├── demo
    │   ├── index.js
    │   └── package.json
    ├── m1
    │   ├── index.js
    │   └── package.json
    └── m2
        ├── index.js
        └── package.json
```

额外的，这个demo包，我们并不像他进行发布，为了防止不小心发布，我们在`demo`的`package.json`中新增：

```json
"private":"true",
```

因为这里`require('m2')`，所以需要添加`m2`依赖到`demo`的`package.json`中：

```shell
npm i -S m2 --workspace=demo
```

我们看看这时候项目根目录的`node_modules`吧： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc1bc6f93b14c56a89403d82f45eb12~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 是不是很有意思？全是软链接，链接的指向就是`packages`文件夹下的各子包。

OK，搞了半天，我们运行`demo`看下效果吧：

```shell
node packages/demo/index.js
# 输出：
kitty
```

通过上面的例子，我们可以看出，`workspaces`对于本地子包之间的依赖处理的非常巧妙，也让开发者更加方便，尤其是多人开发的时候。另一个人在拉取完项目以后，只需要运行`npm install`，即可进行开发，软链接会自动建立好。

接下来，我们看`workspaces`项目中如果安装三方包的情况。

### 8\. 安装两个不同版本的包

```shell
npm i -S vue@2 --workspace=m1
npm i -S vue@3 --workspace=m2
```

例子中，我们想看看，因为我们的包都会被提升到根目录进行安装，那么不同版本的`vue`它会怎么处理呢？难道只会安装`vue3`的包吗？

结果： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/559ca75e893e451cac83aafe93e2cd2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 这样，我们就无需担心版本冲突的问题了，`workspaces`显然已经很好地解决了。

### 重点参数`--workspace`

在`workspaces`项目中，一个很核心的参数就是`--workspace`，因为从前文的安装包到子包的命令可以发现，和传统的安装包一样，都是使用`npm i -S 包名`或者`npm i -D 包名`，不同的仅仅是末尾加了`--workspace`。

那是不是对于其它的命令，比如`run`、`version`、`publish`等也是样的使用方式呢？答案是：Yes！

另外，如果我们子包的`package.json`中`scprits`全都有一个叫`test`的命令，我们想一次性运行所有子包的这个命令，可以使用`npm run test --workspaces`即可。 这样的话，对于我们的**Lint校验**或是**单测**都是非常方便的。

到此，workspaces在多包管理中启到的作用就基本介绍完了。值得一提的是，多包管理，实际项目中还是推荐使用`Lerna`，它对于版本依赖自动升级、发包提示、自动生成Log（Change Log / Release Note）、CI等都具有一套十分成熟的流程机制了。

# 多项目管理

目前的npm`workspaces`，个人认为是非常适合用来做多项目的整合（Monorepo）管理的 。

## 例子演示

项目地址我挂在github上了，有兴趣的同学可以自行查看[源码](https://github.com/CodeLittlePrince/demo-workspaces-multi-project "https://github.com/CodeLittlePrince/demo-workspaces-multi-project")。

### 1\. 创建项目

```shell
mkdir demo-workspaces-multi-project
```

### 2\. 初始化项目

```shell
npm init -y
.
└── package.json
```

### 3\. 声明本项目是workspaces模式

`package.json`新增配置：

```json
"private":"true",
"workspaces": [
  "projects/*"
],
```

### 4\. 初始化子项目`zoo`

创建子项目`zoo`：

```shell
npm init -w projects/zoo -y
.
├── package.json
└── packages
    └── zoo
        └── package.json
```

创建模板文件`index.html`，主内容为：

```html
<!-- projects/zoo/index.html -->
<body>
  <h1>Welcome to Zoo!</h1>
  <div id="app"></div>
</body>
```

创建项目入口js文件`index.js`，内容为：

```js
console.log('Zoo')
```

安装项目构建依赖包：

```shell
npm i -S webpack webpack-cli webpack-dev-server html-webpack-plugin webpack-merge --workspace=zoo

# projects/zoo/package.json
"private":"true",
"dependencies": {
  "html-webpack-plugin": "^5.5.0",
  "webpack": "^5.65.0",
  "webpack-cli": "^4.9.1",
  "webpack-dev-server": "^4.7.2"
}
```

创建webpack配置：

```js
// projects/zoo/webpack/base.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '../' + dir)
}

exports.config = {
  entry: resolve('src/index.js'),

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Zoo',
      filename: 'index.html',
      template: resolve('src/index.html')
    })
  ],
}

exports.resolve = resolve
```

```js
// projects/zoo/webpack/dev.config.js
const { config, resolve } = require('./base.config')
const { merge } = require('webpack-merge')

exports.default = merge(config, {
  mode: 'development',

  output: {
    filename: 'bundle.js',
  },
})
```

```js
// projects/zoo/webpack/prod.config.js
const { config, resolve } = require('./base.config')
const { merge } = require('webpack-merge')

exports.default = merge(config, {
  mode: 'production',

  output: {
    filename: 'bundle.js',
  },
})
```

zoo下的`package.json`新增命令：

```js
"scripts": {
  "dev": "webpack-dev-server --config webpack/dev.config.js --open",
  "prod": "webpack --config webpack/prod.config.js"
},
```

接下来就可以运行了，只需要在项目根目录使用：

```shell
npm run dev --workspace=zoo
```

即可进行本地开发。

效果： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08c4fcfcac4943d58eced7d9879db0b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

运行prod同理。

### 5\. 初始化子项目`shop`

创建子项目`shop`：

```shell
npm init -w projects/shop -y
```

其余步骤同初始化子项目`zoo`几乎一模一样，所以不再赘述。

最后的目录结构： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2acea9e545fa41eabe6d65b836adc740~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 共享

对于Monorepo，共享是最重要的一个优势。所以，我们来做一些共享的事情。

### 1\. 在packages下加个`share`空间，作为共享资源空间，并创建共享文件`Fish.js`：

```shell
npm init -w projects/share -y  
mkdir projects/share/js
touch projects/share/js/Fish.js
```

```js
// projects/share/js/Fish.js
class Fish {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  swim() {
    console.log('swim~')
  }

  print() {
    return '🐟 '
  }
}

module.exports = Fish
```

子项目`zoo`的入口文件改为：

```js
// projects/zoo/src/index.js
const Fish = require('share/js/Fish')
const fish = new Fish()
document.getElementById('app').textContent = fish.print()
```

子项目`zoo`的入口文件改为：

```js
// projects/zoo/src/index.js
const Fish = require('$share/js/Fish')
const fish = new Fish()
document.getElementById('app').textContent = fish.print()
```

运行`zoo`的`dev`看效果： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa966e365b3744178237922cc8bdab46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

修改子项目`shop`的入口文件后，会出现同样的效果。

也就是说，share文件夹下的东西，`zoo`和`shop`可以公用了，需要做的仅仅是新增一个webpack的`alias`而已！🎉

## 🤔思考 —— 我们为什么使用`workspaces`做集合项目，用传统方式不行吗？

传统方式：

1.  各个子项目都集合到一个项目中来。和上文不同的是，`package.json`只有一份，在根目录，所有项目中的npm包都安装到根目录，在根目录的`package.json`中定义**开发**和**部署**子项目的命令；
2.  各个子项目都集合到一个项目中来。和上文不同的是，虽然根目录和各个子包都各自有一份`package.json`，但基础的构建工具在根目录进行安装，比如上面提到的`webpack`、`webpack-cli`、`webpack-dev-server`、`html-webpack-plugin`、`webpack-merge`，全都在根目录进行安装，和业务相关的npm包都安装到各自子项目中；
3.  各个子项目都集合到一个项目中来。和上文不同的是，各个子包都各自有一份`package.json`，根目录无`package.json`；

方式1 —— 缺点：

-   命令混乱；
-   无法应对子项目之间存在npm包冲突的问题；（比如，A项目想用webpack4，B项目想用webpack5；或者A项目想用Vue2，而B项目想用Vue3）

方式2 —— 缺点：

-   如果子项目有相同的包，不得不在各个子项目中重复安装；
-   同样无法应对子项目之间存在npm包冲突的问题；（比如，A项目想用webpack4，B项目想用webpack5）
-   如果某天想把B项目移除，成本很高；

方式3 —— 缺点：

-   如果子项目有相同的包，不得不在各个子项目中重复安装；

那使用`workspaces`就很好的解决了上面的所有问题！

另外，对于已经存在的项目而言，比如我今年所接手的项目，一个是Web的，一个是Wap的，然后发现，因为他们属于同一个业务，所以有大量的代码可以复用，又因为只涉及这两个项目而已，把公共代码做成npm包又有点太杀鸡用牛刀，所以，过去一直采用的是复制、粘贴的模式。这显然是非常低效的。另外就是，mock服务也是个字项目单独一套，但是大多数接口的数据都是可以公用的，只是url前缀不同。最离谱的就是几百个银行图标都一模一样。所以，我打算将它俩合并成一个项目。而`workspaces`对于我来说，是一个对原项目改动量最小的方案。

## 怎么单独部署？

我们想要在构建机上只部署项目`zoo`，应该怎么做？

### 1\. 安装依赖包

```js
npm install --production --workspace=zoo 
```

这样的话，构建机上就只会安装`zoo`项目下的依赖包了。

### 2\. 构建

```js
npm run prod --workspace=zoo 
```

这样的话，就构建成功了！

# 避坑

npm的workspaces其实有隐藏的坑，所以我也罗列下。

## 坑一：npm install 默认模式的坑

npm v7开始，install会默认安装依赖包中的`peerDependencies`声明的包。新项目可能影响不大，但是，如果你是改造现有的项目。因为用了统一管理的方式，所以一般都会把子项目中的lock文件删掉，在根目录用统一的lock管理。然后，当你这么做了以后，可能坑爹的事情就出现了。 场景：我的子项目中用的是`webpack4`，然后，我们的构建相关的工具（webpack、babel、postcss、eslint、stylint等）都会封装到基础包中。这些包的依赖包中有一个包，在`package.json`声明中使用这样写：

```json
"peerDependencies": {
  "webpack": "^5.1.0"
},
```

然后，在根目录中`npm install`，然后再跑子项目发现项目跑不起来了。原因就是，项目居然安装的是`webpack5`的版本！

### 解决方案

-   方案1：在子项目的`package.json`中显示声明用的`webpack`版本；
-   方案2：去github和作者商量修复依赖包，如果他的包即兼容`webpack4`也兼容`webpack5`，应该写成，把声明改为： `"webpack": "^4.0.0 || ^5.0.0"`
-   方案3：`npm install --legacy-peer-deps`

个人真的觉得这是npm作者脑袋被驴踢了。对于yarn或者pnpm，他们的`workspaces`都不会用这种默认安装`peerDependencies`的模式。 作者原本是想，因为如果npm包的开发者声明了`peerDependencies`，如果我们使用过程中没有安装匹配的版本的包就可能导致项目跑不了，为了方便使用，他就采用了默认安装的模式。 但是，这种做法会导致那些`peerDependencies`不符合书写规范的包，在项目中配合使用出现问题。而且，即使新的包中包作者们开始注意书写规范，但是无法处理那些已经发布出去的老包，总不可能全都回收，然后一个个版本重新再发布一遍吧！

## 坑二：小版本包冲突

这其实是个人粗心导致的。

举个例子：`zoo`使用命令`npm i -S @vue2.2.1`引入vue，`shop`使用命令`npm i -S @vue2.2.2`引入vue。那么，项目会有两个版本的`vue`吗？不会。 原因我们可以看`zoo`项目下的`package.json`：

```json
"dependencies": {
  "html-webpack-plugin": "^5.5.0",
  "vue": "^2.2.1",
  "webpack": "^5.65.0",
  "webpack-cli": "^4.9.1",
  "webpack-dev-server": "^4.7.2",
  "webpack-merge": "^5.8.0"
}
```

恍然大悟。

### 解决方案

-   方案1：其实去掉`^`即可；
-   方案2：我们安装的时候可以使用`npm i --save-exact vue@2.2.1 --workspace=zoo`

# 总结

本文，利用了`workspaces`来做多包管理，以及多项目管理，体现出了`workspaces`的强大。因为我个人负责的项目一直以来都是使用npm来管理的，所以想要迁移到yarn或者pnpm存在未知的风险，而且，也尝试过，因为一些老包yarn2和pnpm都跑不起来。对于新的项目，个人也更推荐yarn2或者pnpm进行管理，它们比npm更加强大。

**本原文来自于个人[github博客](https://github.com/CodeLittlePrince/blog/issues/25 "https://github.com/CodeLittlePrince/blog/issues/25")，觉得好的小伙伴可以点个赞哈~** <(_￣▽￣_)/

文中多包管理和多项目管理的源码分别在：

-   [多包管理](https://github.com/CodeLittlePrince/demo-workspaces-multi-packages "https://github.com/CodeLittlePrince/demo-workspaces-multi-packages")
-   [多项目管理](https://github.com/CodeLittlePrince/demo-workspaces-multi-project "https://github.com/CodeLittlePrince/demo-workspaces-multi-project")

有兴趣的同学可以自行下载学习。
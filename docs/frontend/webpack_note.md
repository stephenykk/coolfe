# webpack note
[webpack 全面介绍](https://segmentfault.com/a/1190000041100811)
[webpack入门(二):html-webpack-plugin、webpack-dev-server - 简书](https://www.jianshu.com/p/33e3752be8e5)  
[webpack入门(三):loader - 简书](https://www.jianshu.com/p/2cb657eb83d6)
[webpack-dev-server核心概念](https://www.jianshu.com/p/e547fb9747e0)  
[Tree-Shaking性能优化实践 - 原理篇 - 漫思 - 博客园](https://www.cnblogs.com/sexintercourse/p/11901425.html)
[Webpack 教程 - 姜瑞涛的官方网站](https://www.jiangruitao.com/webpack/)
[三十分钟掌握Webpack性能优化](https://segmentfault.com/a/1190000015883378)

[精益 React 学习指南 （Lean React）- 2.5 webpack 进阶 - SegmentFault 思否](https://segmentfault.com/a/1190000005666159)

## 常用插件

[Webpack 插件: webpackbar & progress-bar-webpack-plugin 进度条插件](https://blog.csdn.net/weixin_44691608/article/details/117558101)

[html-webpack-plugin详解](https://www.cnblogs.com/wonyun/p/6030090.html)

## 常见问题
[webpack配置typescript项目 - 独角兕大王](https://www.cnblogs.com/double-W/p/13038799.html)

[配置babel-loader处理JSX语法 - 半忧](https://www.cnblogs.com/banyouxia/p/12169430.html)

## 有用文章
[使用require.context实现前端工程自动化 - 简书](https://www.jianshu.com/p/c894ea00dfec)

[webpack5 module federation](https://www.jianshu.com/p/3e2e467a6238)

----


webpack

模块打包工具，从入口文件开始，构建模块依赖图，把相关模块打包到一起

webpack中一切都是模块(*包括：图片 css 字体 js 等*)，但是webpack自身只能处理js，所以其他静态资源需要用loader转换为可识别的js模块形式。

> loader 赋予webpack处理各种类型文件的能力，loader 类似gulp 都是面向文件，做转换处理

> grunt, gulp是task runner, 面向文件，主要进行处理和转换；webpack是构建工具，面向项目工程，解决文件处理，开发效率，部署优化等一系列问题。

相关包
- webpack
- webpack-cli

配置文件  webpack.config.js  (*通常会对应环境有多份配置，基础配置 webpack.base.js 用 webpack-merge 合并配置*)

```js
module.exports = {
  // 基础目录 entry为相对路径时，是相对基础目录的
  // context 默认为工程根目录
  context: path.resolve(__dirname, 'src'), // 绝对路径
  mode: 'production', // production | development | none
  // entry为数组时，本质上还是单入口，其他文件会构建到最后一个文件，实际入口为最后的文件
  // entry为对象时，为多入口
  // entry还可以是函数，返回值为 string | string{} | object
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'), // 绝对路径
    // 多入口时 需设置占位符文件名, 如：[name].js
    // 可用占位符  [hash]  [name] [chunkhash] [contenthash]
    filename: 'bundle.js', // [name].js 多入口时配置
    chunkFilename: '[name].js', // 非entry chunk的文件名,  通常是异步chunk
    publicPath: '/',
    library: 'MyUtils',
    libraryTarget: 'umd',
    libraryExport: 'default',
    pathinfo: true // 输出源文件路径 很有用
  },
  externals: {
    axios: 'axios'
  },
  resolve: {
    alias: { '@': path.join(__dirname, 'src')},
    extensions: ['', '.js', '.ts', '.vue'],
    modules: ['node_modules']
  }
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: ['eslint-loader'],
        // 带参数形式
        // use: {loader: 'eslint-loader', options: {} }
        include: process.cwd(),
        enforce: 'pre', // pre | post 强制在所有loader前执行当前loader
      },
      {
        test: /\.jpe?g$/,
        // use: 'file-loader'
        use: {
          loader: 'url-loader',
          limit: 1024 * 8, // 小于8KB 转换为base64编码的dataURL
          name: '[name]-[contenthash:8].[ext]',
          publicPath: './dist/' // 优先级高于 output.publicPath
        }
      },
      {
        test: /\.(js|ts)x?$/,
        include: process.cwd(),
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        // css-loader @import和背景图等转换为require, 
        // style-loader 把css字符变为style标签，插入页面中  
        // *loader从后到前反序执行*
        use: ['style-loader', 'css-loader'] 
      }
    ]
  },
  plugins: [],
  devtool: 'source-map' // 开启sourceMap
}
```

`import()` 方法可动态导入模块

```js
const router = new VueRouter({
  routes: [{
    path: '/foo',
    component: () => import('./foo.vue')
  }]
})

// 古老的动态导入模块语法 require.ensure(modName, callback)
```

- `main-[hash].js`  hash是根据所有文件计算得到的hash值
- `main-[chunkhash].js` chunkhash是根据每个chunk文件计算得到的hash值
- `main-[contenthash].css` 类似chunkhash, 在 miniExtractPlugin 中提取独立css文件，配置文件名


loader本质是一个函数，接受模块资源，把它处理成webpack能使用的形式

常见loader

- style-loader css-loader scss-loader
- babel-loader
- vue-loader
- file-loader url-loader

resource 和 issuer
```js
// app.js
import './css/main.scss'

// app.js 为issuer; main.scss为resource
```

插件是webpack的重要组成部分，webpack自身也是建立在插件系统之上的

常用插件
- clean-webpack-plugin
- copy-webpack-plugin
- html-webpack-plugin
- terser-webpack-plugin



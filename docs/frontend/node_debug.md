# nodejs debug

## 内置 debug 模块

node debug myscript.js # 命令行下 debug 简单方便，什么都不用装

## node-inspector

在 Nodejs 升级到 8.0 之后安装 `npm install -g node-inspector`会提示报错，到 node-inspector 的 issue 区找了问题的[解决方案](https://github.com/node-inspector/node-inspector/issues/1013)。

用 node-inspect 替代 node-inspector

### 安装 node-inspect

`npm install --global node-inspect` , [node-inspect 使用文档](https://nodejs.org/api/debugger.html)

### 使用

1. 启动程序进行调试  
   `node --inspect app.js` # 适用 httpServer 不会立即结束进程的  
   `node --inspect-brk myscript.js` # 适用 普通的 js 脚本，如一些文件处理工具

2. 在 chrome 中的地址栏输入 `chrome://inspect`

3. 如果是调试 httpServer 类程序，用浏览器打开应用的 url 即可 (**如 http://localhost:3000**)

> 注 node --debug myscript.js, node --debug-brk myscript.js 已改为 --inspect --inspect-brk

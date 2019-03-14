nodejs debug
===

内置debug模块
---
node debug myscript.js # 命令行下debug 简单方便，什么都不用装

node-inspector
---
在Nodejs升级到8.0之后安装  `npm install -g node-inspector `会提示报错，到node-inspector的issue区找了问题的[解决方案](https://github.com/node-inspector/node-inspector/issues/1013)。

用 node-inspect 替代 node-inspector

### 安装 node-inspect

`npm install --global node-inspect` , [node-inspect使用文档](https://nodejs.org/api/debugger.html)

### 使用

1. 启动程序进行调试  
    `node --inspect app.js` # 适用 httpServer 不会立即结束进程的  
    `node --inspect-brk myscript.js` # 适用 普通的js脚本，如一些文件处理工具

2. 在chrome中的地址栏输入 `chrome://inspect`

3. 如果是调试httpServer类程序，用浏览器打开应用的url即可 (**如 http://localhost:3000**)

> 注 node --debug myscript.js, node --debug-brk myscript.js 已改为 --inspect  --inspect-brk

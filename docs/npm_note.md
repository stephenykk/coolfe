# npm note

[npm scripts 使用指南 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
## 发布包(publish)

1. npm adduser  
   注意 registry 需要是默认的 `https://registry.npmjs.org/` 淘宝镜像貌似没有注册功能

   ```shell
   	npm i -g nrm
   	nrm ls
   	nrm use npm
   	npm adduser
   ```

1. npm whoami  
   只有成功调用 `npm adduser` 后，才知道 whoami

1. npm publish  
   `npm adduser` 后，就可以发布自己的包了

## 配置(config , c)

- npm get registry
- npm config get registry # 同上
- npm c get registry # 同上

- npm set registry https://registry.npm.taobao.org
- npm config set registry https://registry.npm.taobao.org # 同上
- npm c set registry https://registry.npm.taobao.org # 同上
- npm set @mydomain:registry https://registry.mynpm.com # 为特定 scope 的包 指定镜像源
- npm set myproj:port 9090 # 为 myproj 项目添加配置 通过环境变量 npm_package_config_port 访问

- npm set hello test
- npm config delete hello
- npm config # 显示帮助提示
- npm config list # 显示各项配置
- npm config list -l # 显示全部配置
- npm config edit # 直接编辑配置文件

- npm get prefix -g  
   全局安装的 node_modules 所在目录
- npm get prefix  
   在当前目录向上找 直至找到包含 node_modules 的目录; 一般地在项目的子目录执行 install , 会装在 prefix 目录的 node_modules 下; 也有例外的情况，不确定具体机制是啥

## package.json

- npm init -y

## 搜索包(search, s, se, find)

- npm search ripple # 用淘宝镜像会报错 直接在命令行返回结果
- cnpm search ripple # 会用浏览器打开淘宝镜像，搜索关键字

## 安装包(install, i)

- npm i express
  默认本地安装 `npm set global true` 可设置默认全局安装, 然后在具体项目链接全局的包，避免重复安装

  ```
    npm set global true
    npm i lodash
    npm ls lodash
    cd myProject
    # 从全局目录的lodash链接到当前项目
    npm link loash

    # 常用选项 -D (--save-dev) -P (--save-prod)
    npm i vue -P
    npm i webpack -D

    # 安装本地的包
    # npm i <folder>
    mkdir ../bar
    cd ../bar
    npm init -y
    echo console.log('hello') > index.js
    cd ../foo
    npm i ../bar
    npm ls # 本地包链接到了当前项目 类似 npm link, 修改本地包代码，在当前项目能立即看到效果
  ```

- npm i -g express # 全局安装

## 查看已安装的包(list , ls)

- npm ls vue
- npm list # 查看所有本地包
- npm list # npm ls 查看本地目录安装的包列表
- npm ls -g # 查看全局安装的包列表
- npm ls -g express # 查看全局安装的某个包 确认包已安装

## 查询包信息(view , v , info)

- npm view opn # 包的摘要信息 包不需要安装在本地
- npm view opn version # 包 package.json 具体字段查看
- npm view opn author
- npm view opn description
- npm view lodash repository.url

## 包更新

- npm rebuild mypkg # 修改内容后重新构建包
- npm outdated # 查看过时的包
- npm update
- npm update lodash

## 包卸载

- npm uninstall lodash
- npm uni jquery
- npm uninstall -g lodash

## npm link

在本地开发 npm 模块的时候，我们可以使用 npm link 命令，将 npm 模块链接到对应的运行项目中去，方便地对模块进行调试和测试
修改源模块，链接的模块也会同步修改(_类似引用，有别于快捷方式，linux 有软链接和硬链接之分，windows 貌似没有类似概念_)

### 本地模块链接到全局

```shell
  cd my-module
   npm link
   # 查看全局模块的安装路径
   npm get prefix
  # 打开对应目录 看是否成功链接过去
```

### 全局模块链接到本地项目

```shell
    cd my-project
    npm link lodash
```

## package-lock.json

`package-lock.json`保证其他人安装到一样的依赖。

```shell
# package-lock.json 不会被发布出去
# package-lock.json 会被重命名为 shrinkwrap.json, shrinkwrap.json可以发布出去
npm shrinkwrap

```

## 查看包的主页

```shell
# 会用浏览器打开 npm v vue homepage
npm home vue
```

## 查看帮助

```shell
# 查看npm的帮助文档(网页版)
npm help npm

# 查看某个命令的帮助
npm help install

```

## npm-scripts

```shell
npm start
npm stop
npm test
npm restart
npm publish
npm unpublish

npm run dev
npm run-script dev # 同上
npm run myscript  # premyscript myscript postmyscript 都会被执行

# 可以访问 package.json 的字段
# "dev": "echo %npm_package_name%"

# 可以访问 npm 的配置信息
# npm set hi hello
# "dev": "echo %npm_config_hi%"

```

## npm explore <pkg>

```bash
# 打开新的命令行，工作目录切换到依赖包根目录 _很方便_
npm explore  lodash

```

常见问题

- `npm install --unsafe-perm`  
   npm 出于安全考虑不支持以 root 用户运行，即使你用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了。

  为了避免这种情况，要么按照 npm 的规矩来，专门建一个用于运行 npm 的高权限用户；要么加 --unsafe-perm 参数，这样就不会切换到 nobody 上，运行时是哪个用户就是哪个用户，即使是 root。

## npm 常用模块

### 构建/包管理

- browserify
- grunt/grunt-cli
- gulp/gulp-util
- bower
- yo/yeomen-generator
- css/js/编译
- coffee-script
- less
- node-sass
- uglify-js
- clean-css
- uglifycss
- stylus
- marked : markdown 编译为 html
- xml2js : xml 编译为 js 对象或 json
- js-yaml : 解析 yaml
- jsdom : 对 dom 操作

### 框架

- express
- connect

### 测试

- karma
- mocha
- chai

### 工具函数

- underscore
- lodash
- moment
- node-uuid
- mime : 获取 mime 信息
- semver ： semver 版本号处理
- minimatch : 正则匹配
- xtend : extend 方法
- cheerio : jquery 的轻量级版本
- jquery
- word-wrap
- shelljs : node 中提供 unix shell 命令支持
- pkginfo : 读取模块的 package.json
- validator ： string validate
- iconv-lite ： 编码
- clone : clone 对象或数组
- nib : stylus mixin 及工具
- inherits : prototype 扩展，相比原生浏览器支持良好
- cjson ： json loader
- escodegen ： js 生成器
- esprima ： js 解析器
- md5 : 生成 md5
- matchdep : 获取模块依赖，package.json

### http/网络

- request
- socket.io
- ws : websocket,类似 socket.io
- statsd : 获取 udp metrics
- body-parser : 内容格式的中间件，结合 express 使用
- morgan ： http request 的 logger 中间件
- oauth
- http-proxy : 代理服务器
- urlrouter : connect 路由中间件
- tiny-lr ： live reload server 及中间件
- connect-url-rewrite ： 正则 rewrite url 中间件

### 异步

- async
- q : promises/A+
- when
- bluebird
- when
- es6-promise
- 流/stream
- event-stream : 对 stream 的操作
- through/through2 : 对 stream 的构造和操作
- concat-stream : 对 stream 进行 concat 操作
- tar : 压缩
- block-stream : 指定 block 大小的流

### 文件操作

- mkdirp
- glob ： 正则匹配文件
- fs-extra : 复制、建目录、删除等 fs 扩展操作
- wrench ： 递归的文件操作
- rimraf : rm -rf 操作
- watchr ： 文件改动 watching
- gaze ： 同 watchr
- graceful-fs ： fs 封装
- ncp ： 异步 cp 文件
- temp ： 临时文件生成及操作

### 模板引擎

- handlebars
- jade
- ejs
- mustache
- velocity/velocityjs

### 数据库

- redis
- mongoose
- mysql
- pg ： postgreSql

### 命令行辅助

- commander : 菜单，命令及 help
- optimist : 命令行解析，同 commander
- minimist : 更简单的参数处理
- yargs ： 同 minimist
- prompt ： 命令行交互 prompt
- inquirer : 命令行交互 api，prompt、questions 等等
- debug
- winston : log 扩展封装
- log4js ： 同 winston
- colors ： console 颜色
- chalk ： 同 colors
- cli-table
- forever : 一直执行脚本

### node 管理

- pm2 : node 应用进程管理及状态监测
- n : node 版本管理


## 常见问题

1. node-sass安装或编译失败：MSBUILD : error MSB3428: 未能加载 Visual C++ 组件“VCBuild.exe”
   > 错误原因：缺少windows构建插件
   > 解决方法：npm install --global --production windows-build-tools  （如果目录在C盘下，需要管理员权限运行，全局安装windows构建工具）

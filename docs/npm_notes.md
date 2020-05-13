npm_notes
===


发布包(publish)
---
1. npm adduser  
   注意 registry需要是默认的 `https://registry.npmjs.org/` 淘宝镜像貌似没有注册功能
   ```
   	npm i -g nrm 
   	nrm ls
   	nrm use npm
   	npm adduser
   ```

1. npm whoami  
   只有成功调用 `npm adduser` 后，才知道 whoami

1. npm publish  
   `npm adduser` 后，就可以发布自己的包了


配置(config , c)
---
- npm get registry
- npm config get registry # 同上
- npm c get registry # 同上

- npm set registry https://registry.npm.taobao.org   
- npm config set registry https://registry.npm.taobao.org # 同上
- npm c set registry https://registry.npm.taobao.org # 同上
- npm set @mydomain:registry https://registry.mynpm.com # 为特定scope的包 指定镜像源
- npm set myproj:port 9090  # 为myproj项目添加配置 通过环境变量 npm_package_config_port 访问

- npm set hello test
- npm config delete hello
- npm config  # 显示帮助提示
- npm config list # 显示各项配置
- npm config list -l # 显示全部配置
- npm config edit # 直接编辑配置文件

- npm get prefix -g  
    全局安装的node_modules所在目录
- npm get prefix   
    在当前目录向上找 直至找到包含 node_modules的目录; 一般地在项目的子目录执行 install , 会装在prefix目录的node_modules下; 也有例外的情况，不确定具体机制是啥

package.json
---
- npm init -y 


搜索包(search, s, se, find)
---
- npm search ripple # 用淘宝镜像会报错 直接在命令行返回结果
- cnpm search ripple # 会用浏览器打开淘宝镜像，搜索关键字

安装包(install, i)
---
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

查看已安装的包(list , ls)
---
- npm ls vue
- npm list # 查看所有本地包
- npm list  # npm ls 查看本地目录安装的包列表
- npm ls -g # 查看全局安装的包列表
- npm ls -g express # 查看全局安装的某个包 确认包已安装



查询包信息(view , v , info)
---
- npm view opn  # 包的摘要信息 包不需要安装在本地
- npm view opn version # 包 package.json 具体字段查看
- npm view opn author
- npm view opn description
- npm view lodash repository.url


包更新
---
- npm rebuild mypkg # 修改内容后重新构建包
- npm outdated # 查看过时的包
- npm update
- npm update lodash


包卸载
---
- npm uninstall lodash
- npm uni jquery
- npm uninstall -g lodash

npm link
---
在本地开发npm模块的时候，我们可以使用npm link命令，将npm 模块链接到对应的运行项目中去，方便地对模块进行调试和测试
修改源模块，链接的模块也会同步修改(*类似引用，有别于快捷方式，linux有软链接和硬链接之分，windows貌似没有类似概念*)

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

package-lock.json
---
`package-lock.json`保证其他人安装到一样的依赖。

```shell
# package-lock.json 不会被发布出去
# package-lock.json 会被重命名为 shrinkwrap.json, shrinkwrap.json可以发布出去
npm shrinkwrap

```

查看包的主页
---
```shell
# 会用浏览器打开 npm v vue homepage
npm home vue 
```

查看帮助
---
```shell
# 查看npm的帮助文档(网页版)
npm help npm

# 查看某个命令的帮助
npm help install

```


npm-scripts
---
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

npm explore <pkg>
---
```bash
# 打开新的命令行，工作目录切换到依赖包根目录 _很方便_
npm explore  lodash

```

常见问题
- `npm install --unsafe-perm`  
   npm 出于安全考虑不支持以 root 用户运行，即使你用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了。

   为了避免这种情况，要么按照 npm 的规矩来，专门建一个用于运行 npm 的高权限用户；要么加 --unsafe-perm 参数，这样就不会切换到 nobody 上，运行时是哪个用户就是哪个用户，即使是 root。

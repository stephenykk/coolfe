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

- npm set hello test
- npm config delete hello
- npm config  # 显示帮助提示
- npm config list # 显示各项配置
- npm config list -l # 显示全部配置
- npm config edit # 直接编辑配置文件

- npm get prefix -g # 全局安装的node_modules所在目录
- npm get prefix # 同上 就是 -g 或没有 -g 一样样

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
     npm link loash
   ```
- npm i -g express # 全局安装


查看已安装的包
---
- npm ls vue
- npm list # 查看所有本地包
- npm list  # npm ls 查看本地目录安装的包列表
- npm ls -g # 查看全局安装的包列表
- npm ls -g express # 查看全局安装的某个包 确认包已安装



查询包信息(view, list, ls)
---
- npm view opn  # 包的摘要信息
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


npm_notes
===


发布包(publish)
---
1. npm adduser  // 注意 registry需要时默认的 https://registry.npmjs.org/ 淘宝镜像貌似没有注册功能
1. npm whoami
1. npm publish 

配置(config , c)
---
- npm get registry
- npm config get registry // 同上
- npm c get registry // 同上

- npm set registry https://registry.npm.taobao.org   
- npm config set registry https://registry.npm.taobao.org // 同上
- npm c set registry https://registry.npm.taobao.org // 同上

- npm set hello test
- npm config delete hello
- npm config  // 显示帮助提示
- npm config list // 显示各项配置
- npm config list -l // 显示全部配置
- npm config edit // 直接编辑配置文件

- npm get prefix -g // 全局安装的node_modules所在目录
- npm get prefix // 同上 就是 -g 或没有 -g 一样样

package.json
---
- npm init -y 


搜索包(search, s, se, find)
---
- npm search ripple // 用淘宝镜像会报错 直接在命令行返回结果
- cnpm search ripple // 会用浏览器打开淘宝镜像，搜索关键字


查看已安装的包
---
- npm ls vue
- npm list // 查看所有

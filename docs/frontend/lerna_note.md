# lerna note
[lerna中文教程](https://segmentfault.com/a/1190000019350611?utm_source=tag-newest)
[lerna入门指南 - 前端向后的个人空间](https://my.oschina.net/u/4581386/blog/4368559)

## 简介

**Lerna是一个工具，它优化了使用git和npm管理多包存储库的工作流**

将大型代码库拆分为独立的版本包对于代码共享非常有用。 然而，在许多存储库中进行更改是麻烦和难以跟踪的事情。为了解决这些（和许多其他）问题，一些项目将它们的代码库组织成多包存储库。 像 Babel、React、Angular、Ember、Meteor、Jest 等等。

Lerna 是一个优化使用 git 和 npm 管理多包存储库的工作流工具，用于管理具有多个包的 JavaScript 项目。 

> 多包存储库：一个代码仓库 包含多个npm包的代码

lerna仓库目录结构

```shell
my-lerna-repo/
  package.json
  packages/
    package-1/
      package.json
    package-2/
      package.json
```

Lerna 中的两个主要命令是 `lerna bootstrap` 和 `lerna publish`。 bootstrap 将把 repo 中的依赖关系链接在一起。 publish 将有助于发布软件包更新。

创建lerna仓库
```shell
git init hello-lerna && cd hello-lerna
lerna init
cd packages
mkdir hello-lerna-core && cd $_ && npm init -y
cd ..
mkdir hello-lerna-utils && cd $_ && npm init -y
cd ../hello-lerna-core
vim package.json # 把 hello-lerna-utils 添加到dependencies中
lerna bootstrap # 建立包之间的关联，软链接到 node_modules
git remote add origin yourUrl
git add .
git comit -m "first lerna repo"
npm whoami # 确认登录npm registry
lerna publish # 发布包
```

## 工作的两种模式
### Fixed/Locked mode (default)

vue,babel都是用这种，在publish的时候,会在lerna.json文件里面"version": "0.1.5",,依据这个号，进行增加，只选择一次，其他有改动的包自动更新版本号。

### Independent mode

lerna init --independent初始化项目。
lerna.json文件里面"version": "independent",

每次publish时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改。

### lerna script
```shell
lerna init
lerna bootstrap
lerna publish
lerna create
lerna add
lerna list
lerna import
lerna run
lerna exec
lerna link
lerna clean
lerna changed
lerna version
```

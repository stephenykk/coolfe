# yarn notes

## 安装
有以下几种方式:
1. 下载 `.msi` 安装包
2. 安装 `chocolatey` , 然后 `choco install yarn`
3. `npm i -g yarn`

`yarn --version` 能输出版本号，说明安装成功.

## 用法

    # 初始化项目, 问答的方式生成 package.json, 同 npm init
    yarn init

    # 安装依赖包 通过 npm registry 安装指定的包, 会修改 packge.json 和 yarn.lock 文件
    yarn add [packagek]  # 安装最新版本
    yarn add [package]@[version] # 安装指定版本
    yarn add [package]@[tag] # 安装某个tag对应的版本? eg: yarn add package-name@beta
    # --安装其他类型的依赖
    yarn add --dev [package]
    yarn add --peer [package]
    yarn add --optional [package]
    # --安装选项
    yarn install --flat # 同一依赖包仅安装一次
    yarn install --force # 强制重新下载所有依赖包
    yarn install --production # 只安装productionDependencies字段列出的依赖包


    # 更新依赖包
    yarn upgrade [package] # 更新到最新版本
    yarn upgrade [packge]@[version] # 更新到指定版本
    yarn upgrade [package]@[tag]

    # 删除依赖包
    yarn remove [package]

    # 在项目目录下，安装package.json中列出的依赖包 同 npm install
    yarn
    yarn install  # 同上

    # 发布包
    yarn publish # 在项目根目录下执行

## CLI 命令

### yarn add

    # 通过 npm registry 安装指定的包
    yarn add vue
    yarn add vue@2.x
    yarn add vue@beta

    # 安装本地文件系统的包
    yarn add file:/path/to/local/folder
    yarn add file:/path/to/local/tarball.tgz

    # 通过git仓库安装包
    yarn add <git remote url>
    yarn add <git remote url>@<commit/tag>
    yarn add https://my-project.org/package.tgz

    # 全局安装包
    yarn global add <package>

    # 安装为开发依赖包
    yarn add <package> [--dev/-D]
    # 安装为peer依赖包
    yarn add <package> [--peer/-P]
    # 安装为optional依赖包
    yarn add <package> [--optional/-O]

    # 安装指定版本的包
    yarn add <package> [--exact/-E]
    yarn add foo@1.2.3 # 默认安装相同主版本的最新的包 如这里，可能会安装到 foo@1.9.8
    yarn add foo@1.2.3 --exact # 将安装 foo@1.2.3

    # 安装相同副版本的包
    yarn add <package> [--tilde/-T]
    yarn add foo@1.2.3 --tilde # 将会安装 foo@1.2.9

### yarn bin

查看当前目录下的 `yarn bin` 目录(可执行文件的存放目录), 同 `npm bin`

### yarn cache

    # Yarn 会在用户目录下创建缓存文件夹，保存下载过的包, `yarn cache list` 列出所有缓存的包
    yarn cache list

    # 打印当前yarn的全局缓存文件夹
    yarn cache dir

    # 清除缓存
    yarn cache clean

    # 修改缓存目录
    yarn config set cache-folder <path>

    # 为命令指定缓存目录
    yarn <command> --cache-folder <path> # eg: yarn add vue --cache-folder /my-yarn-cache

### yarn check

校验当前项目的 `package.json` 文件里的依赖版本和 `yarn.lock`文件中列出的版本是否匹配

`yarn check --integrity` 检验包是否被篡改..

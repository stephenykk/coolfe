# pnpm 使用教程

## workspace

### 初始化 monorepo 项目结构

```bash
# 创建root project
mkdir mono-project
cd mono-project
pnpm init

# 创建 workspace 配置文件
# pnpm-workspace.yaml
packages:
  - "examples/*"
  - "shares/*"

mkdir -p examples/app
mkdir -p shares/down-cli

cd examples/app
pnpm init

cd shares/down-cli
pnpm init

```

配置子项目的`package.json`文件, app 依赖 down-cli

_app/package.json_ 配置如下

```json
{
    "name": "app",
    "scripts": {
        "down": "down --help",
        "hi": "echo app hello"
    },
    "dependencies": {
        "down-cli": "workspace:*"
    }
}
```

_down-cli/package.json_ 配置如下:

```json
{
    "name": "down-cli",
    "scripts": {
        "hi": "echo down hello"
    },
    "bin": {
        "down": "bin/index.js"
    }
}
```

_down-cli/bin/index.js_

```js
#!/usr/bin/env node
console.log("down command starting..");
```

### 安装依赖

在 root project 下面执行 `pnpm i`, pnpm 会自动安装依赖，子项目间的相互依赖会 link 到对应项目的 node_modules 文件夹下.

比如, 以上的项目结构，`app/node_modules/down-cli` 会软链接到 `down-cli/bin/index.js`

### 执行子项目的命令

配置 root project 的 npm scripts 执行指定子项目的命令

`mono-project/package.json`

```json
{
    "name": "mono-project",
    "scripts": {
        "app-hi": "pnpm run --filter app hi",
        "app-hi2": "pnpm run --filter ./examples/* hi",
        "down": "pnpm --filter app down"
    }
}
```

更多 `--filter` 参数的用法可查帮助信息 `pnpm help run`

在 root project 下执行, `pnpm down` 可测试子项目的命令，实现脚本工具(`down-cli`)的开发调试

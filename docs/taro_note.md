taro notes
===

简介
---
Taro 是一套遵循 React 语法规范的 多端开发 解决方案, 可以将源代码分别编译出可以在不同端（微信小程序、H5、RN 等）运行的代码。

特性
---
### react语法风格
Taro 遵循 React 语法规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时支持使用 JSX 语法，让代码具有更丰富的表现力，使用 Taro 进行开发可以获得和 React 一致的开发体验。

```
    import taro, {Component} from '@tarojs/taro';
    import {View, Button, Text} from '@tarojs/commponent';

    export default class Index extends Component {
        constructor() {
            super(...arguments);
            this.state = {
                title: 'hello taro',
                numbers: [1, 2, 3]
            }
        }

        componentWillMount() {}
        
        componentDidMount() {}
        
        componentWillUpdate(nextProps, nextState) {}
        
        componentDidUpdate(prevProps, prevState) {}
        
        shouldComponentUpdate(nextProps, nextState) {
            return true;
        }

        add() {
            // do sth
        }

        render() {
            return (
                <View className='index'>
                    <View className='title'>{this.state.title}</View>
                    <View className="content">
                        {this.state.numbers.map(num => {
                            return <View className='item'>{num}</View>
                        })}
                        <Button className='add-btn' onClick={this.add}>添加</Button>
                    </View>
                </View>
            )
        }


    }
```

### 支持快速开发微信小程序

- 支持使用 npm/yarn 安装管理第三方依赖

- 支持使用 ES7/ES8 甚至更新的 ES 规范，一切都可自行配置

- 支持使用 CSS 预编译器，例如 Sass 等

- 支持使用 Redux 进行状态管理

- 小程序 API 优化，异步 API Promise 化等等

### 支持多端开发转化
微信小程序 支付宝小程序  react native 以及 H5 端

安装
---
全局安装脚手架 `@tarojs/cli`

使用 npm 或者 yarn 全局安装，或者直接使用npx

```
    npm i -g @tarojs/cli
    yarn global add @tarojs/cli

    taro init myApp  # 初始化项目
```


开发调用命令

```
// 开发微信小程序
# npm script
$ npm run dev:weapp
$ npm run build:weapp

# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp

# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp

// 开发百度小程序
# npm script
$ npm run dev:swan
$ npm run build:swan

# 仅限全局安装
$ taro build --type swan --watch
$ taro build --type swan

# npx 用户也可以使用
$ npx taro build --type swan --watch
$ npx taro build --type swan

// 开发支付宝小程序
# npm script
$ npm run dev:alipay
$ npm run build:alipay

# 仅限全局安装
$ taro build --type alipay --watch
$ taro build --type alipay

# npx 用户也可以使用
$ npx taro build --type alipay --watch
$ npx taro build --type alipay

// 开发h5页面
# npm script
$ npm run dev:h5

# 仅限全局安装
$ taro build --type h5 --watch

# npx 用户也可以使用
$ npx taro build --type h5 --watch
```

更新

```
// 更新 @tarojs/cli
# taro
$ taro update self

# npm
npm i -g @tarojs/cli@latest

# yarn
yarn global add @tarojs/cli@latest

// 更新项目依赖
taro update project
```

taro组成
---

NPM 包  | 描述
--------|------
@tarojs/taro   | taro 运行时框架
@tarojs/taro-h5 | taro h5 运行时框架
@tarojs/taro-rn | taro React Native 运行时框架
@tarojs/taro-weapp  | taro 微信小程序运行时框架
@tarojs/redux   | taro Redux 支持
@tarojs/router  | taro h5 路由
@tarojs/async-await 支持使用 asyn/await 语法
@tarojs/cli | taro 开发工具
@tarojs/taro-rn-runner  | taro ReactNative 打包编译工具
@tarojs/webpack-runner  | taro h5 端 webpack 打包编译工具
@tarojs/components  | taro 标准组件库，h5 版
@tarojs/components-rn   | taro 标准组件库，React Native 版
@tarojs/plugin-babel    | taro babel 编译插件
@tarojs/plugin-sass | taro sass 编译插件
@tarojs/plugin-less | taro less 编译插件
@tarojs/plugin-csso | taro css 压缩插件
@tarojs/plugin-uglifyjs | taro js 压缩插件
eslint-config-taro  | taro eslint 规则
eslint-plugin-taro  | taro eslint 插件
# eslint notes

[文档](http://eslint.cn/)

## 简介

ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于2013年6月创建.  
ESLint使用 Node.js 编写  

## 常用设置

1. 代码段禁用 eslint

```js
/* eslint-disable */
alert("foo");
/* eslint-enable */
```


2. 整个文件禁用特定的eslint规则

```js
/* eslint-disable no-debugger, no-console */
console.log('test') //犀牛前端部落
```

3. 块禁用特定eslint规则
```js
/* eslint-disable no-debugger, no-console */
console.log('test')
/* eslint-enable no-alert, no-console */
```

4. 行禁用特定eslint规则
```js
console.log('test') // eslint-disable-line no-console
```


## 配置文件

[.eslintrc配置说明](https://www.jianshu.com/p/a09a5a222a76)

ESLint 支持几种格式的配置文件，如果同一个目录下有多个配置文件，ESLint 只会使用一个。优先级顺序如下：

- JavaScript - 使用 .eslintrc.js 然后输出一个配置对象。
- YAML - 使用 .eslintrc.yaml 或 .eslintrc.yml 去定义配置的结构。
- JSON -使用 .eslintrc.json 去定义配置的结构，ESLint 的 JSON 文件允许 JavaScript 风格的注释。
- Deprecated -使用 .eslintrc，可以使 JSON 也可以是 YAML。
- package.json - 在 package.json 里创建一个 eslintConfig 属性，在那里定义你的配置。

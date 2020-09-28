# eslint notes

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

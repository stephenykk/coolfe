# jest note
[jest 使用文档](https://jestjs.io/zh-Hans/docs/getting-started)

安装
---
```shell
yarn add --dev jest
yarn global add jest # 全局安装
```

例子
---
```js
// sum.js
function sum(a, b) {
  return a + b
}
module.exports = sum
```
测试文件

```js
// sum.test.js
const sum = require('./sum.js')
test('add 1 + 2 toEqual 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

package.json npm script

```json
{
  "test": "jest"
}
```


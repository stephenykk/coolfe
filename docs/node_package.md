常用的nodejs模块
===

fs-extra
---
### 简介
可以完全替代原生模块 fs, fs-extra提供的方法都支持promise(*如果没传入callback, 则返回promise*)

### 文档 

`npm home fs-extra`


### 常用方法

```js
var fse = require('fs-extra')

// promise-style
fse.copy('/tmp/foo', '/tmp/foobk')
   .then(() => console.log('success'))
   .catch(err => console.error(err));

// callback-style error-first
fse.copy('/tmp/foo', '/tmp/foobk', err => {
    if(err) return console.error(err);
    console.log('success')
});

// await-style
async copyFile() {
    try {
        await fse.copy('/tmp/foo', '/tmp/foobk')
        console.log('success')
    }catch(e) {
        console.error(e);
    }
}

copyFile()


// :: outputFile(file, data[, options][, callback])
// 上级目录不存在 会自动创建
const fs = require('fs-extra')

const file = '/tmp/this/path/does/not/exist/file.txt'

// With a callback:
fs.outputFile(file, 'hello!', err => {
  console.log(err) // => null

  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return console.error(err)
    console.log(data) // => hello!
  })
})

// With Promises:
fs.outputFile(file, 'hello!')
.then(() => fs.readFile(file, 'utf8'))
.then(data => {
  console.log(data) // => hello!
})
.catch(err => {
  console.error(err)
})

// With async/await:
async function example (f) {
  try {
    await fs.outputFile(f, 'hello!')

    const data = await fs.readFile(f, 'utf8')

    console.log(data) // => hello!
  } catch (err) {
    console.error(err)
  }
}

example(file)


// ::outputJson(file, object[, options][, callback])
// 上级目录不存在 会自动创建
const fs = require('fs-extra')

const file = '/tmp/this/path/does/not/exist/file.json'
// With async/await:
async function example (f) {
  try {
    await fs.outputJson(f, {name: 'sandy', job: 'singer'})

    const data = await fs.readJson(f)

    console.log(data.name) // => sandy
  } catch (err) {
    console.error(err)
  }
}

example(file)

// ::ensureDir(dir[,options][,callback])
// 确保目录存在 类似 mkidr -p
// With async/await:
async function example (directory) {
  try {
    await fs.ensureDir(directory)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
example(dir)


```

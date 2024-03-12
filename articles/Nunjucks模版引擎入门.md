# Nunjucks模版引擎入门

> 原文地址[nunjucks模版引擎入门 - 掘金](https://juejin.cn/post/6844903801812418574?searchId=20240312111911B06AD6FE8008D931C8D6)

## 1.nunjucks


Nunjucks是Mozilla开发的一个纯JavaScript编写的模板引擎，既可以用在Node环境下，又可以运行在浏览器端

## 2.安装

```bash
npm install nunjucks
```

## 3\. 使用

### 3.1 渲染字符串

```bash
let nunjucks = require('nunjucks')
// autoescape 自动转移非法字符
nunjucks.configure({autoescape:true})
let ret = nunjucks.renderString('hello {{username}}',{username:'blued'})
console.log(ret) // hello blued

```

### 3.2 渲染模版文件

新建 view 目录，新建user.html文件

```bash
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div>
    hello {{name}}
    <div>
</body>
</html>
```

js

```bash
const nunjucks = require('nunjucks')
const path = require('path')
// 如何渲染模版文件
let data = {name:'blued'}
// 配置模版文件的所在目录
nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true
})

let result = nunjucks.render('user.html',data)
console.log(result)

```

输出结果如下

```bash
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div>
    hello blued
    <div>
</body>
</html>
```

### 3.3 express

```bash
// 3.nunjucks.js
// 如何在express 中使用模版引擎
let express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
let app = express()
nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true,
  express:app//这个蚕食其实是在向app里注入渲染模版的方法
})
app.get('/',function(req,res){
  // render 方法是express内置的
res.render('user.html',{name:'blued'})
})
app.listen(8010)

```

node nunjucks.js 运行

访问http://localhost:8010/

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/20/1699893cb89b753c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

## 4\. 语法

### 4.1 变量

变量会从模版上下文获取，如果你想显示一个变量可以:

```bash
{{username}}
```

### 4.2 过滤器

过滤器是一些可以执行变量的函数，通过管道操作符（|）调用，并可接受参数。

```bash
let nunjucks = require('nunjucks')
nunjucks.configure({autoescape:true})
// 使用过滤器
let ret = nunjucks.renderString("{{username|join('-')}}",
{username:['blued','city']})
console.log(ret) //blued-city

let ret2 = nunjucks.renderString("{{username|replace('city','there')|capitalize}}",
{username:'blued city'})
console.log(ret2)// Blued there
```

### 4.3 if

if 为分支语句，与 javascript 中的 if 类似。

```bash
let nunjucks = require('nunjucks')
nunjucks.configure({autoescape:true})
// 使用判断
let ret = nunjucks.renderString(`
{% if score >90 %}
优秀
{% elseif score >80%}
良好
{% elseif score >60%}
及格
{% else %}
不及格
{% endif %}
`,
{score:70})
console.log(ret) // 及格
```

### 4.4 for

for 可以遍历数组 (arrays) 和对象 (dictionaries)。

```bash
let nunjucks = require('nunjucks')
nunjucks.configure({autoescape:true})
// 使用判断 loop.index为索引
let ret = nunjucks.renderString(`
 <ul>
 {% for user in users %}
   <li>{{loop.index}} {{user.id}}:{{user.name}}</li>
 {% endfor %}
 </ul>
`,
{users:[
  {id:1,name:'blued1'},
  {id:2,name:'blued2'},
  {id:3,name:'blued3'},
  {id:4,name:'blued4'},
  {id:5,name:'blued5'}
]})
console.log(ret)

```

输出结果：

```bash
<ul>
 
   <li>1 1:blued1</li>
 
   <li>2 2:blued2</li>
 
   <li>3 3:blued3</li>
 
   <li>4 4:blued4</li>
 
   <li>5 5:blued5</li>
 
 </ul>
```

-   loop.index: 当前循环数 (1 indexed)
-   loop.index0: 当前循环数 (0 indexed)
-   loop.revindex: 当前循环数，从后往前 (1 indexed)
-   loop.revindex0: 当前循环数，从后往前 (0 based)
-   loop.first: 是否第一个
-   loop.last: 是否最后一个
-   loop.length: 总数

使用一下看看效果

```bash
let nunjucks = require('nunjucks')
nunjucks.configure({autoescape:true})
// 使用判断
let ret = nunjucks.renderString(`
 <ul>
 {% for user in users %}
   <li>
   loop.index--{{loop.index}}
   loop.index0--{{loop.index0}}
   loop.revindex--{{loop.revindex}}
   loop.revindex0--{{loop.revindex0}}
   loop.first--{{loop.first}}
   loop.last --{{loop.last}}
   loop.length --{{loop.length}}
    {{user.id}}:{{user.name}}
    </li>
 {% endfor %}
 </ul>
`,
{users:[
  {id:1,name:'blued1'},
  {id:2,name:'blued2'},
  {id:3,name:'blued3'}
]})
console.log(ret)

```

输出结果:

```bash
 <ul>
 
   <li>
      loop.index--1
      loop.index0--0
      loop.revindex--3
      loop.revindex0--2
      loop.first--true
      loop.last --false
      loop.length --3

      1:blued1
    </li>
 
   <li>
      loop.index--2
      loop.index0--1
      loop.revindex--2
      loop.revindex0--1
      loop.first--false
      loop.last --false
      loop.length --3

      2:blued2
    </li>
 
   <li>
      loop.index--3
      loop.index0--2
      loop.revindex--1
      loop.revindex0--0
      loop.first--false
      loop.last --true
      loop.length --3

      3:blued3
    </li>
 
 </ul>
```

### 4.5 模版继承

-   模版继承可以达到模版复用的效果，当写一个模版的时候可以定义"blocks",子模版可以覆盖他
-   支持多层继承

新建一个layout.html作为一个模版一个一个模版模版(为了方便查看这里只保留了body内容)

```bash
<body>
  <h1>我是头</h1>
  {% block content%}
    我是layout模板的内容name= {{name}}
  {% endblock%}
  <h1>我是尾</h1>
</body>
```

nunjucks.js

```bash
const nunjucks = require('nunjucks')
const path = require('path')
// 如何渲染模版文件
let data = {name:'blued'}
// 配置模版文件的所在目录
nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true
})

let result = nunjucks.render('layout.html',data)
console.log(result)

```

输出结果:

```bash
<body>
  <h1>我是头</h1>
  
    我是layout模板的内容name= blued
  
  <h1>我是尾</h1>
</body>
```

接下来我们看一下是如何继承的 新建一个login.html文件

```bash
{% extends "layout.html" %}

{% block content%}
    <form action="">
        用户名 <input type="teåxt">
    </form>
{% endblock%}
```

使用`extends`关键字，注意模版名称一定要为字符串像这样`"layout.html"`,否则会报错哦。 接下来修改js 文件，渲染'login.html'

```bash
let result = nunjucks.render('login.html',data)
console.log(result)
```

输出结果：

```bash
<body>
  <h1>我是头</h1>
  
    <form action="">
        用户名 <input type="teåxt">
    </form>

  <h1>我是尾</h1>
</body>
```

是不是很简单就实现了继承呢，如果你有多个页面头尾都一样，只有内容不一样就能派上用场了呢！

### 4.6 包含

`include`关键字可以引入其他的模版，可以在多模版之间共享一些小模版，如果某个模版已使用了继承那么`include`将会非常有用。

```bash
//nunjucks.js

const nunjucks = require('nunjucks')
const path = require('path')
// 模版的包含
let data = {users:[{id:1,name:'z1'},{id:2,name:'z2'}]}
// 配置模版文件的所在目录
nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true
})

let result = nunjucks.render('users.html',data)
console.log(result)
```

users.html

```bash
{% extends "layout.html"%}
{% block content %}
<ul style='border:1px solid red'>
  {% for user in users %}
    {% include "item.html" %}
  {% endfor%}
</ul>
{% endblock %}
```

item.html

```bash
<li>名次：{{loop.index}}:{{user.id}}:{{user.name}}</li>
```

输出结果：

```bash
<body>
  <h1>我是头</h1>
  
<ul style='border:1px solid red'>
  
    <li>名次：1:1:z1</li>
  
    <li>名次：2:2:z2</li>
  
</ul>

  <h1>我是尾</h1>
</body>
```

## 参考资料

-   [getting-started](https://mozilla.github.io/nunjucks/cn/getting-started.html "https://mozilla.github.io/nunjucks/cn/getting-started.html")
-   [nunjucks](https://mozilla.github.io/nunjucks/cn/templating.html#part-d0678dc0cc4cc122 "https://mozilla.github.io/nunjucks/cn/templating.html#part-d0678dc0cc4cc122")
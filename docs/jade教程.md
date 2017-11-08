jade入门教程
=====
jade是一种html预处理语言，通常成为模板引擎。jade之于html, 好比sass之于css。

> jade省略掉尖括号，用缩进表示层级关系

doctype
---

    doctype html
    doctype xml
    doctype transitional
    doctype strict

    doctype html
    html
        head
            title hello world

标签
---

    ul
        li item a
        li item b
        li item c

注释
---
jade支持单行注释和多行注释，并且可指定是否输出到源代码中

    // 这个注释会输出到编译后的文件中
    p 上面为单行注释
    //- 这个单行注释不会输出到编译后的文件
    p 这个单行注释，jade文件中可见

    //
        多行注释，行1
        多行注释，行2
    p hello
    //- 
        多行注释不输出 行1
        多行注释不输出 行2
    p world


属性
---

    input(type='checkbox', checked)
    input(
        type='checkbox'
        name='agree'
        checked
    )

    //- 声明变量，根据变量值设置属性
    - var checked = true
    p(class=checked ? 'checked' : 'normal')
    - var url = '/about'
    a(class={active: url == '/about'} href='/about') About Me
    a(class={active: url == '/'} href='/') Home

    //- 对于常用的类名和id,提供方便的语法
    .links links
    #hello  hello div

    //- style属性可接受对象
    a(style={color: 'red', background: 'green'}) shopping

    //- 特殊语法&attributes, 添加自定义属性
    - var attrs = {'data-foo': 'foolish'}
    p#test(data-hi='hello')&attributes(attrs)


文本
---
jade支持三种文本输出方式: 单行文本，多行文本和管道文本.

    // 单行文本内容直接跟着标签后
    p 这是单行文本内容
    // 管道文本 缩进并使用管道符
    p
        | 这是第1行
        | 这是第2行
        | 这是第3行
    // 多行文本需要在标签后加点号
    p.
        这是多行文本1 注意缩进
        这是多行文本2 注意缩进
        这是多行文本3 注意缩进

代码嵌入
---
+ 使用符号`-`, 代码中特殊符号不会被转义.
    
        - for (var i=0; i<4; i++)
          li <a></a>

+ 使用符号 `=`, 代码中的特殊符号会被转义.

        p
            = 'this code is <escaped>!'

+ 使用符号 `!=`, 特殊符号会被转义.

        p
            != 'That code will not be <escaped>!'


插值语法
---
字符串插值 和 标签插值

    // 转义字符串插值 #{}
    - var intro = '<span>jade cool preprocess html</span>'
    p this is safe: #{intro}

    // 不转义字符串插值 !{}
    - var hi = '<span>nice to meet you</span>'
    p this is not safe: !{hi}

    // 标签插值
    p #[a(href="jade.com") jade]

条件语句
---

    - var user = {desc: 'hello sindy'}
    - var auth = true
    #user
        if user.desc
            h2.desc
            p.desc-con= user.desc
        else if auth
            h2.desc
            p.desc-con.
                user has no description
                why not say something..
        else
            h1.desc
            p no desc and not auth...


    // unless 条件不满足则...
    - var has = false
    unless has
        p you not have this gift..

分支语句
---

    - friends = 10
    case friends
        when 0
            p you has no friends
        when 1
            p you has a friend
        default
            p you have #{friends} friends

遍历语句
---

    // 遍历数组
    ul
        each val, index in ['zero', 'one', 'two']
            li= index + ': ' + val
    // 遍历对象
    ul.obj
        each val, key in {name: 'sindy', age: 18}
            li= key + ': ' + val


循环语句
---

    // 循环语句while
    - var n = 4
    while n > 0
        li= n--


mixin
---
mixin是复用jade代码的重要方式

    // 声明mixin
    mixin list
        ul
            li foo
            li bar
            li baz
    // 使用mixin
    + list
    + list

    // 声明可入参的mixin
    mixin pet(name)
        li.pet= name
    // 使用mixin
    ul
        + pet('cat')
        + pet('dog')


    // 剩余参数用...表示
    mixin mylist(id, ...items)
        ul(id=id)
            each item in items
                li= item
    + mylist('roles', 'nami', 'lufy', 'zoro')
    
    // 内容分发占位符 block
    mixin article(title)
        .article
            .article-wrapper
                h1.title= title
                if block
                    block
                else
                    p no content to slot..

    + article('welcome to jade')
    + article('jade is cool')
        p this is my style
        p time is fast, don't you know?

// 调用mixin时，传递属性
mixin link(href, name)
    a(href=href)&attributes(attributes)= name

+ link('www.baidu.com', 'goto baidu')(class="btn-link")


include
---
文件/代码片段包含，是实现复用的另一种重要方式.

    //- index.jade
    doctype html
    html
        include ./includes/header.jade
        body
            h1 my site
            include ./includes/footer.jade


extends
---
继承代码片段，并可做修改

    //- layout.jade
    doctype html
    html
        head
            block title
                title default title
        body
            block content
                h1 default content

    //- index.jade
    extends ./layout.jade

    block title
        title Welcom to my blog

    block content
        h1 this is my blog

    //- index2.jade prepend append
    extends ./layout.jade

    block prepend title
        meta(name='charset', content='utf-8')
    block append content
        p hello sindy
# [转]SASS 用法指南

> 转自 [阮一峰 SASS 用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html)

## 什么是 SASS

SASS 是一种 CSS 的开发工具，提供了许多便利的写法，大大节省了设计者的时间，使得 CSS 的开发，变得简单和可维护。

## 安装和使用

### 2.1 安装

SASS 是 Ruby 语言写的，但是两者的语法没有关系。不懂 Ruby，照样使用。只是必须先[安装 Ruby](https://www.cnblogs.com/mingforyou/archive/2012/08/11/2633215.html)，然后再安装 SASS。
假定你已经安装好了 Ruby，接着在命令行输入下面的命令：
```bash
    ruby -v
    gem -v
    gem install sass
    sass -v
```
然后，就可以使用了。

### 2.2 使用

SASS 文件就是普通的文本文件，里面可以直接使用 CSS 语法。文件后缀名是 `.scss`，意思为 Sassy CSS。  

下面的命令，可以在屏幕上显示.scss 文件转化的 css 代码
```bash
 sass test.scss
```
test.scss

```scss  
    $h: 100px;
    $color: pink;
    .test {
        height: $h;
        .main {
            color: $color;
        }
    }
```
如果要将显示结果保存成文件，后面再跟一个.css 文件名。
```bash
    sass test.scss test.css
```
SASS 提供四个编译风格的选项：

- nested：嵌套缩进的 css 代码，它是默认值。
- expanded：没有缩进扩展的 css 代码。
- compact：简洁格式的 css 代码。
- compressed：压缩后的 css 代码。

生产环境当中，一般使用最后一个选项。
```bash
    sass --style compressed test.sass test.css
```
你也可以让 SASS 监听某个文件或目录，一旦源文件有变动，就自动生成编译后的版本。
```bash
    # watch a file
    sass --watch input.scss:output.css
    # watch a directory
    sass --watch app/sass:public/stylesheets
```
SASS 的官方网站，提供了一个[在线转换器](https://www.sassmeister.com/)。你可以在那里，试运行下面的各种例子。

## 基本用法

### 3.1 变量

SASS 允许使用变量，所有变量以`$`开头。
```scss
    $blue : #1875e7;　
    div {
    　color : $blue;
    }
```
如果变量需要镶嵌在字符串之中，就必须需要写在 `#{}` 之中。
```scss
    $side : left;
    .rounded {
    　　border-#{$side}-radius: 5px;
    }
```
三元表达式
```scss
    $h: 110px;
    $con: if($h > 90px, 'sohi', 'solow');
    div {
        content: $con;
    }
```
### 默认变量值

默认变量值在进行组件化开发时，比较有用.
```scss
    // 在默认变量值声明前，声明的同名变量，覆盖默认值
    $baseLineHeight: 2em;
    // 默认变量值
    $baseLineHeight: 1.3em !default
```
### 变量插值

`#{合法的表达式,即可}` 如: `#{px2rem($x)}rem`
```scss
    $h: 10px;
    @function sum(n) {
        @return n + 12;
    }
    .test {
        height: #{sum($h)}px;
    }
```
### 多值变量

分为 list 和 map, 类似数组和对象

- list
  通过空格，逗号或小括号分隔多个值,   
  可用函数 `nth($list, $index)`取值，相关函数有( `length($list)`, `append($list, $item, [$seperator])`, `join($list, $list2)`)
    ```scss
        // 一维数组
        $list: 10px 5px;
        .test {
            padding: $list;
        }

        // 二维数组
        $2dlist: 10px 5px, 20px 10px;
        $2dlist2: (10px 5px) (20px 10px);
        .box {
            padding: nth($2dlist, 1);
            &:hover {
                padding: nth($2dlist, 2);
            }
        }

        $colors: blue darkblue;
        .link{
            color: nth($colors, 1);
            &:hover{
                color: nth($colors, 2);
            }
        }
    ```
- map  
  map 数据以 `key:value` 的形式出现，value 还可以是 list 类型数据.  
  如: `$map: ($key: $val, $key2: $val2)`, 通过 `map-get($map, $key)` 取值, 相关函数(`map-merge($map1, $map2)`,` map-keys($map)`, `map-values($map)`)
    ```scss
        $heading: (h1: 4em, h2: 3em, h3: 2em);
        // @each 遍历map
        @each $header, $size in $heading {
            // 变量用作选择器
            #{$header} {
                font-size: $size;
            }
        }

        .header1 {
            font-size: map-get($heading, h1);
        }
    ```
### 3.2 计算功能

SASS 允许在代码中使用算式：
```scss
    body {
    　　margin: (14px/2);
    　　top: 50px + 100px;
    　　right: $var * 10%;
    }
```
### 3.3 嵌套
SASS 允许选择器嵌套。比如，下面的 CSS 代码：
```scss
    div h1 {
    　　color : red;
    }
```
可以写成：
```scss
    div {
    　　hi {
    　　　　color:red;
    　　}
    }
```
复合属性也可用嵌套方式表示，比如 border-color 属性，可以写成：
```scss
    p {
        // 嵌套的方式 表达复合属性
        // 注意，border 后面必须加上冒号
    　　border: {
    　　　　color: red;
            width: 3px;
    　　}
    }
```


在嵌套的代码块内，可以使用 `&` 引用父元素。比如 a:hover 伪类，可以写成：

```scss
    a {
    　　&:hover { color: #ffb3ff; }
    }
```

### 3.4 注释
SASS 共有两种注释风格。

标准的 CSS 注释 `/* comment */` ，会保留到编译后的文件。  
单行注释 `// comment`，只保留在 SASS 源文件中，编译后被省略。

`/*!` 表示这是"重要注释"。即使是压缩模式编译，也会保留这行注释，通常可以用于声明版权信息。
```scss
    /*!
    　　重要注释！
    */
```
## 代码的重用

### 4.1 继承

SASS 允许一个选择器，继承另一个选择器。比如，现有 class1：
```scss
    .class1 {
    　　border: 1px solid #ddd;
    }
```
class2 要继承 class1，就要使用 `@extend` 命令：
```scss
    .class2 {
    　　@extend .class1;
    　　font-size:120%;
    }
```
### 4.2 Mixin

Mixin 有点像 C 语言的宏（macro），是可以重用的代码块。

使用 `@mixin` 命令，定义一个代码块。
```scss
    @mixin left {
    　　float: left;
    　　margin-left: 10px;
    }
```
使用 `@include` 命令，调用这个 mixin。
```scss
    div {
    　　@include left;
    }
```
mixin 的强大之处，在于可以指定参数和缺省值。
```scss
    @mixin left($value: 10px) {
    　　float: left;
    　　margin-right: $value;
    }
```
使用的时候，根据需要加入参数：
```scss
    div {
    　　@include left(20px);
    }
```
下面是一个 mixin 的实例，用来生成浏览器前缀。
```scss
    @mixin rounded($vert, $horz, $radius: 10px) {
    　　border-#{$vert}-#{$horz}-radius: $radius;
    　　-moz-border-radius-#{$vert}#{$horz}: $radius;
    　　-webkit-border-#{$vert}-#{$horz}-radius: $radius;
    }
```
使用的时候，可以像下面这样调用：
```scss
    #navbar li { @include rounded(top, left); }
    #footer { @include rounded(top, left, 5px); }
```
### mixin 选择性入参
```scss
    @mixin box($border: 1px solid #eee, $pad: 10px) {
        border: $border;
        padding: $pad;
    }

    .box {
        @include box($pad: 22px);
    }
```
### mixin 传入多组值参数
```scss
    // 剩余参数 like coffee-script
    @mixin box-shadow($shadow...) {
        box-shadow: $shadow;
    }

    .my-box {
        @include box-shadow(0 2px 2px rgba(0,0,0,.2), 3px 2px 0px rgba(233,0,0,.5));
    }
```
### 4.3 颜色函数

SASS 提供了一些内置的颜色函数，以便生成系列颜色。
```scss
    lighten(#cc3, 10%) // #d6d65c
    darken(#cc3, 10%) // #a3a329
    grayscale(#cc3) // #808080
    complement(#cc3) // #33c
```
### 4.4 插入文件

`@import` 命令，用来插入外部文件。
```scss
    @import "path/filename.scss";
```
如果插入的是.css 文件，则等同于 css 的 import 命令。
```scss
    @import "foo.css";
```

## 高级用法

### 5.1 条件语句
`@if` 可以用来判断：
```scss
    p {
    　　@if 1 + 1 == 2 { border: 1px solid; }
    　　@if 5 < 3 { border: 2px dotted; }
    }

    p {
        @if not($isBlack) {
            background: white;
        }
    }

    // @if用not,or,and分别表示非，或，与 ,例子：
    $a:   false !default;
    $b:   true !default;

    @if not($a){
        p{
            color:#fff;
        }
    }
    div{
        font-size:12px;
        @if $a or $b{
            width:100px;
        }
    }

    li{
        line-height:16px;
        @if $a and $b{
            float:left;
        }
    }
```
配套的还有 `@else` 命令：
```scss
    @if lightness($color) > 30% {
    　　background-color: #000;
    } @else {
    　　background-color: #fff;
    }
```
### 5.2 循环语句

SASS 支持 for 循环：
```scss
    // 遍历范围
    @for $i from 1 to 10 {
    　　.border-#{$i} {
    　　　　border: #{$i}px solid blue;
    　　}
    }
```
也支持 while 循环：
```scss
    $i: 6;
    // 条件遍历
    @while $i > 0 {
    　　.item-#{$i} { width: 2em * $i; }
    　　$i: $i - 2;
    }
```
each 命令，作用与 for 类似：
```scss
    // 遍历列表 或 map
    @each $member in a, b, c, d {
    　　.#{$member} {
    　　　　background-image: url("/image/#{$member}.jpg");
    　　}
    }
```
### 5.3 自定义函数
SASS 允许用户编写自己的函数。
```scss
    @function double($n) {
    　　@return $n * 2;
    }
    #sidebar {
    　　width: double(5px);
    }
```
## 内置函数

### list 函数

- length(\$list);
- nth($list, $index);
- append($list, $item, [$seperator]);
- join($list1, $list2);
- index($list, $val);
- set-nth($list, $n, \$val);
- ...

### map 函数

- map-get($map, $key);
- map-merge($map1, $map2);
- map-remove($map, $keys...);
- map-keys(\$map);
- map-values(\$map);
- map-has-key($map, $key);
- ...

### color 函数

- lighten($color, $amount);
- darken($color, $amount);
- ...

### string 函数

- quote(\$str)
- unquote(\$str)
- str-length(\$str)
- str-insert($str, $con, \$index);
- str-index($str, $substr);
- str-slice($str, $start-at, \$end-at);
- to-upper-case(\$str);
- to-lower-case(\$str);

### number 函数

- percentage(\$num)
- round(\$num);
- ceil(\$num);
- floor(\$num);
- min(\$num);
- max(\$num);
- abs(\$num);
- random([$limit]);
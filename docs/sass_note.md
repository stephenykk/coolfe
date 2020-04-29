[转]SASS用法指南
==========
> 转自[阮一峰 SASS用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html)

一、什么是SASS
---

SASS是一种CSS的开发工具，提供了许多便利的写法，大大节省了设计者的时间，使得CSS的开发，变得简单和可维护。
本文总结了SASS的主要用法。我的目标是，有了这篇文章，日常的一般使用就不需要去看官方文档了。

二、安装和使用
----

### 2.1 安装

SASS是Ruby语言写的，但是两者的语法没有关系。不懂Ruby，照样使用。只是必须先[安装Ruby](https://www.cnblogs.com/mingforyou/archive/2012/08/11/2633215.html)，然后再安装SASS。
假定你已经安装好了Ruby，接着在命令行输入下面的命令：

    ruby -v
    gem -v
    gem install sass
    sass -v

然后，就可以使用了。

###2.2 使用

SASS文件就是普通的文本文件，里面可以直接使用CSS语法。文件后缀名是.scss，意思为Sassy CSS。

下面的命令，可以在屏幕上显示.scss文件转化的css代码。（假设文件名为test。）
    
    sass test.scss

    # test.scss
    $h: 100px;
    $color: pink;
    .test {
        height: $h;
        .main {
            color: $color;
        }
    }

如果要将显示结果保存成文件，后面再跟一个.css文件名。

    sass test.scss test.css

SASS提供四个编译风格的选项：

* nested：嵌套缩进的css代码，它是默认值。
* expanded：没有缩进的、扩展的css代码。
* compact：简洁格式的css代码。
* compressed：压缩后的css代码。

生产环境当中，一般使用最后一个选项。

    sass --style compressed test.sass test.css

你也可以让SASS监听某个文件或目录，一旦源文件有变动，就自动生成编译后的版本。

    // watch a file
    sass --watch input.scss:output.css
    // watch a directory
    sass --watch app/sass:public/stylesheets

SASS的官方网站，提供了一个[在线转换器](https://www.sassmeister.com/)。你可以在那里，试运行下面的各种例子。


三、基本用法
---

###3.1 变量

SASS允许使用变量，所有变量以$开头。

    $blue : #1875e7;　
    div {
    　color : $blue;
    }

如果变量需要镶嵌在字符串之中，就必须需要写在#{}之中。

    $side : left;
    .rounded {
    　　border-#{$side}-radius: 5px;
    }

三元表达式

    $h: 110px;
    $con: if($h > 90px, 'sohi', 'solow');
    div {
        content: $con;
    }

### 默认变量值
默认变量在进行组件化开发时，比较有用.

    // 在默认变量值声明前，声明的同名变量，覆盖默认值
    $baseLineHeight: 2em;
    // 默认变量值
    $baseLineHeight: 1.3em !default

### 变量插值
`#{合法的表达式,即可}` 如: `#{px2rem($x)}rem`

    $h: 10px;
    @function sum(n) {
        @return n + 12;
    }
    .test {
        height: #{sum($h)}px;
    }

### 多值变量
分为list和map, 类似数组和对象

+ list 
    通过空格，逗号或小括号分隔多个值,可用函数 `nth($list, $index)`取值，相关函数有( length($list), append($list, $item, [$seperator]), join($list, $list2))

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

+ map
    map数据以key:value的形式出现，value还可以是list类型数据.
    如: $map: ($key: $val, $key2: $val2), 通过 map-get($map, $key)取值, 相关函数(map-merge($map1, $map2), map-keys($map), map-values($map))

        $heading: (h1: 4em, h2: 3em, h3: 2em);
        @each $header, $size in $heading {
            #{$header} {
                font-size: $size;
            }
        }

        .header1 {
            font-size: map-get($heading, h1);
        }


###3.2 计算功能

SASS允许在代码中使用算式：

    body {
    　　margin: (14px/2);
    　　top: 50px + 100px;
    　　right: $var * 10%;
    }


###3.3 嵌套
SASS允许选择器嵌套。比如，下面的CSS代码：

    div h1 {
    　　color : red;
    }

可以写成：

    div {
    　　hi {
    　　　　color:red;
    　　}
    }

属性也可以嵌套，比如border-color属性，可以写成：

    p {
    　　border: {
    　　　　color: red;
            width: 3px;
    　　}
    }

*注意，border后面必须加上冒号。*
在嵌套的代码块内，可以使用&引用父元素。比如a:hover伪类，可以写成：

    a {
    　　&:hover { color: #ffb3ff; }
    }

###3.4 注释
SASS共有两种注释风格。

标准的CSS注释 /* comment */ ，会保留到编译后的文件。 
单行注释 // comment，只保留在SASS源文件中，编译后被省略。 

在/*后面加一个感叹号，表示这是"重要注释"。即使是压缩模式编译，也会保留这行注释，通常可以用于声明版权信息。

    /*! 
    　　重要注释！
    */

四、代码的重用
---

###4.1 继承

SASS允许一个选择器，继承另一个选择器。比如，现有class1：

    .class1 {
    　　border: 1px solid #ddd;
    }

class2要继承class1，就要使用@extend命令：

    .class2 {
    　　@extend .class1;
    　　font-size:120%;
    }

###4.2 Mixin

Mixin有点像C语言的宏（macro），是可以重用的代码块。

使用@mixin命令，定义一个代码块。

    @mixin left {
    　　float: left;
    　　margin-left: 10px;
    }

使用@include命令，调用这个mixin。

    div {
    　　@include left;
    }

mixin的强大之处，在于可以指定参数和缺省值。

    @mixin left($value: 10px) {
    　　float: left;
    　　margin-right: $value;
    }

使用的时候，根据需要加入参数：

    div {
    　　@include left(20px);
    }

下面是一个mixin的实例，用来生成浏览器前缀。

    @mixin rounded($vert, $horz, $radius: 10px) {
    　　border-#{$vert}-#{$horz}-radius: $radius;
    　　-moz-border-radius-#{$vert}#{$horz}: $radius;
    　　-webkit-border-#{$vert}-#{$horz}-radius: $radius;
    }

使用的时候，可以像下面这样调用：

    #navbar li { @include rounded(top, left); }
    #footer { @include rounded(top, left, 5px); }


### mixin选择性入参

    @mixin box($border: 1px solid #eee, $pad: 10px) {
        border: $border;
        padding: $pad;
    }

    .box {
        @include box($pad: 22px);
    }

### mixin传入多组值参数

    @mixin box-shadow($shadow...) {
        box-shadow: $shadow;
    }

    .my-box {
        @include box-shadow(0 2px 2px rgba(0,0,0,.2), 3px 2px 0px rgba(233,0,0,.5));
    }


###4.3 颜色函数

SASS提供了一些内置的颜色函数，以便生成系列颜色。

    lighten(#cc3, 10%) // #d6d65c
    darken(#cc3, 10%) // #a3a329
    grayscale(#cc3) // #808080
    complement(#cc3) // #33c

###4.4 插入文件

@import命令，用来插入外部文件。

    @import "path/filename.scss";

如果插入的是.css文件，则等同于css的import命令。

    @import "foo.css";

五、高级用法
---

###5.1 条件语句
@if可以用来判断：

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

配套的还有@else命令：

    @if lightness($color) > 30% {
    　　background-color: #000;
    } @else {
    　　background-color: #fff;
    }

###5.2 循环语句

SASS支持for循环：

    @for $i from 1 to 10 {
    　　.border-#{$i} {
    　　　　border: #{$i}px solid blue;
    　　}
    }

也支持while循环：

    $i: 6;
    @while $i > 0 {
    　　.item-#{$i} { width: 2em * $i; }
    　　$i: $i - 2;
    }

each命令，作用与for类似：

    @each $member in a, b, c, d {
    　　.#{$member} {
    　　　　background-image: url("/image/#{$member}.jpg");
    　　}
    }

###5.3 自定义函数
SASS允许用户编写自己的函数。

    @function double($n) {
    　　@return $n * 2;
    }
    #sidebar {
    　　width: double(5px);
    }

内置函数
----

### list函数
+ length($list);
+ nth($list, $index);
+ append($list, $item, [$seperator]);
+ join($list1, $list2);
+ index($list, $val);
+ set-nth($list, $n, $val);
+ ...

### map函数
+ map-get($map, $key);
+ map-merge($map1, $map2);
+ map-remove($map, $keys...);
+ map-keys($map);
+ map-values($map);
+ map-has-key($map, $key);
+ ...

### color函数
+ lighten($color, $amount);
+ darken($color, $amount);
+ ...

### string函数
+ quote($str)
+ unquote($str)
+ str-length($str)
+ str-insert($str, $con, $index);
+ str-index($str, $substr);
+ str-slice($str, $start-at, $end-at);
+ to-upper-case($str);
+ to-lower-case($str);

### number函数
+ percentage($num)
+ round($num);
+ ceil($num);
+ floor($num);
+ min($num);
+ max($num);
+ abs($num);
+ random([$limit]);
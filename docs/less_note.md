# less notes

## 安装命令行工具

```bash
npm i less -g
less style.less style.css
```

## 在浏览器环境中直接使用 Less

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.8.1/less.min.js"></script>
```

## 简介

Less （Leaner Style Sheets 的缩写） 是一门向后兼容的 CSS 扩展语言

## 变量

```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}

// Variables
@mySelector: banner;

// Usage
.@{mySelector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

// Variables
@images: "../img";

// Usage
body {
  color: #444;
  background: url("@{images}/white-sand.png");
}

// Variables
@themes: "../../src/themes";

// Usage
@import "@{themes}/tidal-wave.less";

@fnord: "I am fnord.";
@var: "fnord";
content: @@var;
```

## 混合

```less
// 混合定义, 无参数时和普通class定义一样
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

// 使用混合
#menu a {
  color: #111;
  .bordered(); // 无参数时 括号可省略
}

.my-mixin {
  color: black;
}
.my-other-mixin() {
  // 显示声明mixin, 不会输出到css中，仅用于编译时
  background: white;
}

// 块级元素水平居中
.blockCenter(@rpx: auto) {
  // 设置参数默认值 @var: auto
  margin-left: @rpx;
  margin-right: @rpx;
}

.class {
  .my-mixin;
  .my-other-mixin;
}
```

## 扩展

```less
nav ul {
  &:extend(.inline);
  background: blue;
}

.bucket {
  tr {
    // nested ruleset with target selector
    color: blue;
  }
}
.some-class:extend(.bucket tr) {
} // nested ruleset is recognized
```

## 嵌套

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}

.clearfix {
  display: block;
  zoom: 1;

  &:after {
    // & 代表外层父选择器
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

## 计算

```less
// numbers are converted into the same units
@conversion-1: 5cm + 10mm; // result is 6cm
@conversion-2: 2 - 3cm - 5mm; // result is -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // result is 4px

// example with variables
@base: 5%;
@filler: @base * 2; // result is 10%
@other: @base + @filler; // result is 15%
```

## 转义

转义符 `~`

```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

## 函数

[参见：函数手册](https://less.bootcss.com/functions/)

```less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```

## Maps

less 3.5+ , 可以将 mixins 中的规则看做 map 对象

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

## 注释

```less
/* 一个块注释
 * style comment! */
@var: red;

// 这一行被注释掉了！
@var: white;
```

## 导入

被导入文件的变量，在当前文件可用

```less
@import "./vars" // vars.less
  @import "library"; // library.less
@import "typo.css";
```

## mixin guide 条件判断

用法一:when 放在函数后面

```less
.bgcolor(@color) when(lightness(@color) > 50%) {
  background-color: red;
}
.bgcolor(@color) when(lightness(@color) <= 50%) {
  background-color: yellow;
}
```

用法二：when 放在选择器后面

```less
@isBlue: 1;
.setBrd when(@isBlue = 1) {
  border: 1px solid blue;
}
.setBrd when(@isBlue = 0) {
  border: 1px solid red;
}
```

用法三：单独使用 when 进行判断，此时需要在 when 前加上“&”符号

```less
.oneLine(@h: 30px, @center: false) {
  height: @h;
  line-height: @h;
  & when (@center) {
    text-align: center;
  }
}
```

### 判断

- 布尔值 less 中任何非 true 的值都是 false，如 @aaa:"1"、#012 等等
- 比较运算符 >、>=、<=、<、=
- 逻辑运算符 `and` `,` `not`
- 判断函数 isstring, isnumber, iscolor, iskeyword, isurl, ispixel, isem, isunit, ispercent

```less
& when (@s1 > 10%) and (@c1 > #444 ) {
  //与
  .box-part5&:before {
    content: "and";
  }
}
& when (@s1 > 10%) , (@c1 > #444 ) {
  //或，注意less用逗号代替
  .box-part5&:before {
    content: "or";
  }
}
& when not (@c1 > #444 ) {
  //非
  .box-part5&:before {
    content: "not";
  }
}
```

## mixin guild 循环

用函数递归模拟循环

```less
.for(@i,@cor) when(@i <= 6) {
  //@i、@cor循环的初值
  .for(@i + 1,@cor + #222); //@i + 1 相当于"++i"
  .box-part@{i} {
    width: 50px;
    height: 50px;
  }
}
.for(1,#F51);
```

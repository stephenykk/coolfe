
# SVG 从入门到后悔，怎么不早点学起来（图解版）

> 原文地址[SVG 从入门到后悔，怎么不早点学起来（图解版） - 掘金](https://juejin.cn/post/7118985770408345630)  

> 在我接触 `SVG` 之前，我觉得这是一个很高深的东西，有点恐惧。我第一次接触 `SVG` 是在 [iconfont网站](https://www.iconfont.cn/ "https://www.iconfont.cn/")，我没理它是什么东西，反正就跟着教程用。第二次接触就是在 **《CSS揭秘（图灵出品）》** 这本书，里面会讲到 `SVG` 相关的内容，而我选择了跳过这部分内容。。。

  

之后是怎么学会的我也忘了。

最近时间比较多，就把我懂的知识用人话整理出来，方便查询。

  

本文主要把 **“可视”** 方面的内容整理出来，操作交互方面(动画、交互事件等) 的内容留到下一篇~

  
  

# 什么是SVG

在学习 `SVG` 之前，首先要了解 **位图** 和 **矢量图** 的区别。

简单来说：

-   位图：放大会失真图像边缘有锯齿；是由像素点组成；前端的 `Canvas` 就是位图效果。
-   矢量图：放大不会失真；使用 `XML` 描述图形。

我在 [知乎](https://zhuanlan.zhihu.com/p/322297530 "https://zhuanlan.zhihu.com/p/322297530") 上找了一个图对说明一下。

左边是位图，右边是矢量图

![01.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eef29b6d6ab496ea356153dc86c4379~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

  

那么 `SVG` 是什么呢？它是矢量图的其中一种格式。**它是用 `XML` 来描述图形的**。

对于初学 `SVG` 的前端来说，可以简单的理解为 **“`SVG` 是一套新标签”**。

所以可以使用 `CSS` 来设置样式，也可以使用 `JS` 对 `SVG` 进行操作。

  
  

# SVG的使用方式

## 使用方法

`SVG` 的使用方式有很多种，我最推荐直接在 `HTML` 中直接使用，也就是直接当 `HTML` 标签使用。

我在 [《SVG 在前端的7种使用方法》](https://juejin.cn/post/7117876752633823269 "https://juejin.cn/post/7117876752633823269") 里记录了几种使用方法：

1.  在浏览器直接打开
2.  内嵌到 `HTML` 中（推荐⭐⭐⭐）
3.  `CSS` 背景图（推荐⭐）
4.  使用 `img` 标签引入（推荐⭐）
5.  使用 `iframe` 标签引入（不推荐❌）
6.  使用 `embed` 标签引入（不推荐❌）
7.  使用 `object` 标签引入（不推荐❌）

  

## SVG默认宽高

在 `HTML` 中使用 `SVG` ，直接用 `<svg>` 标签即可。

```html
<svg></svg>
```

在不给 `<svg>` 设置宽高时，它的默认宽度是 `300px` ，默认高度是 `150px` 。这点和 `<canvas>` 是一样的。

  
  

# 基础图形

`HTML` 的元素大多数默认都是矩形，`SVG` 在形状上更加丰富。

  

## 矩形 rect

矩形使用 `<rect>` 标签，默认填充色是黑色，当只设置宽高时，渲染出来的矩形就是黑色的矩形。

稍后还会说明如何设置样式（比如边框、填充色等），这里只列出矩形基础属性：

-   `x`: 左上角x轴坐标
-   `y`: 左上角y轴坐标
-   `width`: 宽度
-   `height`: 高度
-   `rx`: 圆角，x轴的半径
-   `ry`: 圆角，y轴的半径

  

### 基础款（只设置宽高）

![02.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef09b8dd2c84915b28a5097f8143708~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <rect width="200" height="100"></rect>
</svg>
```

  

### 设置矩形位置

通过 `x` 和 `y` 可以设置矩形位置

![03.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f240bc549d5f4501b5c544845bb1a8c7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <rect
    x="30"
    y="20"
    width="200"
    height="100"
  >
  </rect>
</svg>
```

  

### 圆角矩形

![04.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af9428c33e134103847509a90678da26~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <rect
    width="200"
    height="100"
    rx="20"
    ry="40"
  >
  </rect>
</svg>
```

`rx` 是设置x轴的半径，`ry` 设置y轴的半径。

`rx` 的最大值是矩形宽度的一半，`ry` 的最大值是矩形高度的一半。

  

当只设置 `rx` 或者 `ry` 其中一个值时，另一个属性也会使用一样的值。

比如

![05.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4832f6785cc948d39769fb7defd19c24~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <rect
    width="200"
    height="100"
    rx="30"
  >
  </rect>
</svg>
```

此时 `rx` 和 `ry` 都是 `30`。

  

### rect版的圆形

圆角的概念和 `CSS` 的 `border-radius` 有点像，所以有没有一种可能，用 `<rect>` 也可以画圆形呢？

![06.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91ef92a7a49345a2a0696085fb7591fc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <rect
    width="100"
    height="100"
    rx="50"
  >
  </rect>
</svg>
```

只要把宽高设成一样，圆角设成宽度的一半就能实现圆形。这是在 `HTML` 里的实现方式之一。

同理也用 `<rect>` 实现椭圆，但在 `SVG` 中是不会这样做的。因为 `SVG` 里有专门的圆形和椭圆的标签。

  
  

## 圆形 circle

圆形使用 `<circle>` 标签，基础属性有：

-   `cx`: 圆心在x轴的坐标
-   `cy`: 圆心在y轴的坐标
-   `r`: 半径

  

![07.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6d746f227a34941b08c9e2c587707ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <circle
    cx="60"
    cy="80"
    r="50"
  >
  </circle>
</svg>
```

  

## 椭圆 ellipse

椭圆使用 `<ellipse>` 标签，基础属性有：

-   `cx`: 圆心在x轴的坐标
-   `cy`: 圆心在y轴的坐标
-   `rx`: x轴的半径
-   `ry`: y轴的半径

  

![08.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35ab0aab13a641e2ba8cecf391e00379~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <ellipse
    cx="100"
    cy="40"
    rx="80"
    ry="30"
  >
  </ellipse>
</svg>
```

`<ellipse>` 和 `<circle>` 差不多，只是将半径拆成x轴和y轴的。

  

## 直线 line

直线使用 `<line>` 标签，基础属性有：

-   `x1`: 起始点x坐标
-   `y1`: 起始点y坐标
-   `x2`: 结束点x坐标
-   `y2`: 结束点y坐标
-   `stroke`: 描边颜色

  

![09.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a584888020894fb98df173429b07948a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <line
    x1="30"
    y1="40"
    x2="200"
    y2="180"
    stroke="blue"
  >
  </line>
</svg>
```

  

只有 `x1` 和 `x2` ，没有 `x3` ，也没有 `y3` 。

需要注意的是，`<line>` 需要使用设置 `stroke` 属性才会有绘制效果。

  

## 折线 polyline

使用 `<polyline>` 可以绘制折线，基础属性有：

-   `points`: 点集
-   `stroke`: 描边颜色
-   `fill`: 填充颜色

  

![10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecd80ea81d0642dd8b9c28f4ba34eca6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <polyline
    points="10 10, 200 80, 230 230"
    stroke="#000"
    fill="none"
  >
  </polyline>
</svg>
```

`points` 接受的值是一串点集，点集是两两一组表示一个坐标。

其实点集完全不需要用逗号隔开，上面的例子中我使用了逗号隔开，完全是为了让自己阅读代码时比价易懂。一个逗号分隔一个 `xy` 坐标。

  

在绘制折线是，我通常是将 `fill` 设置成 `none` ，因为 `fill` 默认值是黑色，如果不设置成 `none` 会出现以下效果：

![11.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7299a934a96c4f95a407feb3de4991e5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <polyline
    points="10 10, 200 80, 230 230"
    stroke="#000"
  >
  </polyline>
</svg>
```

将 `fill` 设置成 `none` 后，必须设置 `stroke` 为一个有颜色的值，不然不会有渲染效果。

  

## 多边形 polygon

多边形使用 `<polygon>` 标签，基础属性和 `<polyline>` 差不多：

-   `points`: 点集
-   `stroke`: 描边颜色
-   `fill`: 填充颜色

`<polygon>` 会自动闭合（自动将起始点和结束点链接起来）。

  

![12.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02f3905351b4e9880e758bd1f92eab9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <polygon points="10 10, 200 80, 230 230"></polygon>
</svg>
```

  

## 直线路径 path

其实在 `SVG` 里，所有基本图形都是 `<path>` 的简写。所有描述轮廓的数据都放在 `d` 属性里，`d` 是 `data` 的简写。

`d` 属性又包括以下主要的关键字（注意大小写！）：

-   M: 起始点坐标，`moveto` 的意思。每个路径都必须以 `M` 开始。`M` 传入 `x` 和 `y` 坐标，用逗号或者空格隔开。
-   `L`: 轮廓坐标，`lineto` 的意思。`L` 是跟在 `M` 后面的。它也是可以传入一个或多个坐标。大写的 `L` 是一个**绝对位置**。
-   l: 这是小写 `L`，和 `L` 的作用差不多，但 `l` 是一个**相对位置**。
-   `H`: 和上一个点的Y坐标相等，是 `horizontal lineto` 的意思。它是一个**绝对位置**。
-   `h`: 和 `H` 差不多，但 `h` 使用的是**相对定位**。
-   `V`: 和上一个点的X坐标相等，是`vertical lineto` 的意思。它是一个**绝对位置**。
-   `v`: 这是一个小写的 `v` ，和大写 `V` 的差不多，但小写 `v` 是一个相对定位。
-   `Z`: 关闭当前路径，`closepath` 的意思。它会绘制一条直线回到当前子路径的起点。

  

概念说了一堆，还是用写 `demo` 的方式来展示会更加直观。

  

### 基础版

![13.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a47d12dfb95f48c69f95417455716e01~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 L 50 40 L 100 10"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

上面的例子里，通过1个 `M` 和3个 `L` 描绘了3个点。

使用 `stroke` 设置描边的颜色，使用 `fill="none"` 将填充色改成透明。最后就形成上图的效果。

  

### 简写

如果全是使用大写 `L` 来描述每个点的位置，那可以把 `L` 也去掉，直接写点集。

![13.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c873affc630a4e4d98519b4265b06f6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 50 40 100 10"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

上面的 `d="M 10 10 50 40 100 10"` 等同于 `d="M 10 10 L 50 40 L 100 10"` 。

  

### 闭合路径

在 `d` 的数据集里，使用 `Z` 可以闭合路径。

![14.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/700d0f6142c047a18f699566d40505f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 L 50 40 L 100 10 Z"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

  

### 轮廓坐标相对位置 l

使用 `L` 的小写方式 `l` 可以实现相对位置写法。

![15.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8a0a789bbca4434b4eb5ae821f86efc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 l 50 40 l 100 10 Z"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

上面的代码中，`d="M 10 10 l 50 40 l 100 10 Z"` 等同于 `d="M 10 10 L 60 50 L 160 60 Z"` 。

`l` 里的参数会与前一个点的 `x` 和 `y` 进行相加，得到一个新的坐标。

  

### H 和 h

`H` 后面只需传入 `X坐标` 即可，它的 `Y坐标` 与前一个点相同。

![16.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d4327d8999a4392b02fe126f052796c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 H 100"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

上面的代码中，`d="M 10 10 H 100"` 等同于 `d="M 10 10 L 100 10"`

  

而 `h` 和 `H` 的作用差不多，只不过传入的数据会和前一个点的 `X坐标` 相加，形成一个新的点，这就是相对位置。

![17.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/462b2385a3cc4f96ad30c436b0047b12~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 h 100"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

可以讲 `H` 和 `h` 的例子产生的图片对照一下。

  

### V 和 v

`V` 后面只需传入 `Y坐标` 即可，它的 `X坐标` 与前一个点相同。

![18.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f757aaebe054f1982820693d541b63e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 V 100"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

  

`v` 和 `V` 的作用差不多，小写 `v` 是一个相对位置。

![19.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a69323f368a4a67a52869c17f05ce60~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="300" height="300" style="border: 1px solid red;">
  <path
    d="M 10 10 v 100"
    stroke="blue"
    fill="none"
  >
  </path>
</svg>
```

  

## 曲线 - 椭圆弧路径 path

在 `SVG` 中，画曲线其实有很多种方法。我觉得最简单的是 **椭圆弧曲线**，其实还有 **贝塞尔曲线**、**三次贝塞尔曲线** 等一系列复杂的曲线。但我觉得这对初学者来说可能一下子难以接受，所以我在 [《Canvas 从入门到劝朋友放弃（图解版）》](https://juejin.cn/post/7116784455561248775 "https://juejin.cn/post/7116784455561248775") 里也没写。之后打算再写一篇贝塞尔曲线相关的文章骗点赞~

  

### 什么是椭圆弧？

前面讲到的 `直线路径 path` 是比较好理解的，它把所有点都用直线连接起来即可。只要确定2个点就可以画出一根线段。

  

但如果只用两个点，可以产生无数条曲线。所以需要添加更多的参数来确定如何绘制一条曲线。而在种种方法中，我认为 **椭圆弧曲线** 是最简单的。

  

**椭圆弧曲线**，顾名思义就是和椭圆有关的。如果在椭圆上选择两个点，就可以截取2条曲线。

![20.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/419e1eb7bd6d4c6894feaab8d0e8f8fb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

比如这样，红线处就将椭圆截取成2段弧线。

  

### 椭圆弧公式

在 `SVG` 中可以使用 `path` 配合 `A属性` 绘制椭圆弧。

```js
A(rx, ry, xr, laf, sf, x, y)
```

-   `rx`: 椭圆X轴半径
-   `ry`: 椭圆Y轴半径
-   `xr`: 椭圆旋转角度
-   `laf`: 是否选择弧长较长的那一段。0: 短边（小于180度）; 1: 长边（大于等于180度）
-   `sf`: 是否顺时针绘制。0: 逆时针; 1: 顺时针
-   `x`: 终点X轴坐标
-   `y`: 终点Y轴坐标

  

上面的公式中并没有开始点，**开始点是由 `M` 决定的**。

也就是说，**确定2个点，再确定椭圆半径，就可画出2个椭圆**

![21.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6db6b5653674d7e934107f6d5622ee0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

  

通过开始点和结束点裁切，可以得到4条弧线，也就是说2个点可以确定2个相同旋转角度的椭圆的位置，可以切出4条弧线。

![22.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92e39f6d36e473e97365a9e2e281b3b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 红 -->
  <path
    d="M 125 75 A 100 50 0 0 0 225 125"
    stroke="red"
    fill="none"
  />

  <!-- 黄 -->
  <path
    d="M 125 75 A 100 50 0 0 1 225 125"
    stroke="yellow"
    fill="none"
  />

  <!-- 蓝 -->
  <path
    d="M 125 75 A 100 50 0 1 0 225 125"
    stroke="blue"
    fill="none"
  />

  <!-- 绿 -->
  <path
    d="M 125 75 A 100 50 0 1 1 225 125"
    stroke="green"
    fill="none"
  />
</svg>
```

绘制弧线是比较抽象的，通常我是不会手动绘制的，我会使用 **Illustrator** 绘制，然后生成 `SVG` 来使用。

  
  

# 设置样式的方法

设置 `SVG` 元素样式其实和 `CSS` 差不多，常见的方法有4种。

-   属性样式
-   内联样式
-   内部样式
-   外部样式

  

## 属性样式

直接在元素属性上设置样式，比如将矩形填充色改成粉红

![23.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b742ff5a4c2f468a84029ea623bd0777~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="pink"
  />
</svg>
```

  

## 内联样式

把所有样式写在 `style` 属性里

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    style="fill: pink;"
  />
</svg>
```

  

## 内部样式

将样式写在 `<style>` 标签里

```html
<style>
  .rect {
    fill: pink;
  }
</style>

<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    class="rect"
  />
</svg>
```

  

## 外部样式

将样式写在 `.css` 文件里，然后在页面中引入该 `CSS` 文件。

  
  

# 常用样式设置

`SVG` 设置样式的属性和 `CSS` 稍微有点不同，但初学时不需要了解太深入，我们只需将常用的学会即可。

比如填充色、描边颜色等。

  

说到颜色，`SVG` 和 `CSS` 支持的颜色值其实差不多的，比如：

-   关键字: red、pink、blue 等
-   十六进制: 支持3位或6位，`#0f0`、`#00ff00`
-   RGB 和 RGBA: 比如 `rgb(10, 20, 30)` 或 `rgba(10, 20, 30, 0.4)`
-   HSL 和 HSLA

  

接下来讲到的所有常规属性，除了在元素属性上设置之外，都支持在 `CSS` 中设置。

  

## 填充 fill

要填充图案颜色，可以设置 `fill` 属性。这个属性在前面的例子也使用过多次。

`fill` 默认是 `#000000` ，也就是黑色。

![24.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a86f2b14fa83420181705b42c20da859~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="greenyellow"
  />
</svg>
```

  

也可以使用 `none` 或者 `transparent` 将填充色设置成透明。

  

## 填充色的不透明度 fill-opacity

如果想让填充色有点 **半透明** 的感觉，可以设置 `fill-opacity` 属性，也可以在 `fill` 属性中使用 `RGBA` 或者 `HSLA`。

本例使用 `fill-opacity` 设置，它的取值是 `0 - 1`，`0` 代表完全透明，`1` 代表完全不透明。小于 `0` 的值会被改为 `0`，大于 `1` 的值会被改为 `1` 。

![25.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39e6e863c00d47afbc6e91973132e035~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="red"
    fill-opacity="0.2"
  />
</svg>
```

  

`fill` 属性中使用 `RGBA` 或者 `HSLA` 的方式你自己动手试试看~

  

## 描边颜色 stroke

可以通过 `stroke` 属性设置描边的颜色，之前也使用过。如果不设置 `stroke` ，图形默认是没有描边颜色的。

![26.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7991c5b330cf45c79772b2dc1fe54d29~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="none"
    stroke="blue"
  />
</svg>
```

我将填充色设置成透明，方便观察蓝色边框。

  

## 描边颜色的不透明度 stroke-opacity

和 `fill-opacity` 差不多，只不过 `stroke-opacity` 是设置描边的不透明度

![27.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b38f1b7a73a94d409ecccca4300a4b16~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="none"
    stroke="blue"
    stroke-opacity="0.3"
  />
</svg>
```

  

## 描边宽度 stroke-width

如果需要调整描边的宽度，可以使用 `stroke-width`，它接收一个数值

![28.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdeee4356ca64641906e9ec7909a32f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <rect
    x="100"
    y="100"
    width="200"
    height="100"
    fill="none"
    stroke="blue"
    stroke-width="10"
  />
</svg>
```

  

## 虚线描边 stroke-dasharray

边框的 **点线** 或者 **虚线** 样式，可以使用 `stroke-dasharray` 设置，这和 [`Canvas` 里设置虚线](https://juejin.cn/post/7116784455561248775#heading-44 "https://juejin.cn/post/7116784455561248775#heading-44")的操作其实是差不多。

`stroke-dasharray` 接收一串数字，这串数字可以用来代表 **线的长度和空隙的长度**，数字之间用逗号或者空格分隔。

建议传入偶数个数字。但如果你传入了奇数个数字，`SVG` 会将这串数字重复一遍，使它的数量变成 **偶数个** 。

![29.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8d0fe7eb56a48f7a85a6ab40a829a90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <line
    x1="30"
    y1="30"
    x2="300"
    y2="30"
    stroke="blue"
  />

  <line
    x1="30"
    y1="70"
    x2="300"
    y2="70"
    stroke="blue"
    stroke-dasharray="20 10"
  />

  <line
    x1="30"
    y1="110"
    x2="300"
    y2="110"
    stroke="blue"
    stroke-dasharray="20 10 30"
  />
</svg>
```

  

## 虚线偏移量 stroke-dashoffset

虚线还可以通过 `stroke-dashoffset` 属性设置偏移量，它接收一个数值类型的值。

![30.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81d44c222d2e49c49482f7f22db2ca19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <line
    x1="30"
    y1="30"
    x2="300"
    y2="30"
    stroke="blue"
    stroke-width="10"
    stroke-dasharray="20 10 30"
  />

  <line
    x1="30"
    y1="90"
    x2="300"
    y2="90"
    stroke="blue"
    stroke-width="10"
    stroke-dasharray="20 10 30"
    stroke-dashoffset="10"
  />
</svg>
```

我加粗了虚线，方便观察偏移量。

  

## 线帽 stroke-linecap

线帽就是线的起始点和结束点的位置，用 `stroke-linecap` 属性可以设置线帽样式。

线帽有3个值：

-   `butt`: 平头（默认值）
-   `round`: 圆头
-   `square`: 方头

  

![31.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3911af0e4e594d90b021dafc98e05f47~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 平头 -->
  <line
    x1="30"
    y1="30"
    x2="300"
    y2="30"
    stroke="blue"
    stroke-width="10"
    stroke-linecap="butt"
  />

  <!-- 圆头 -->
  <line
    x1="30"
    y1="70"
    x2="300"
    y2="70"
    stroke="blue"
    stroke-width="10"
    stroke-linecap="round"
  />

  <!-- 方头 -->
  <line
    x1="30"
    y1="110"
    x2="300"
    y2="110"
    stroke="blue"
    stroke-width="10"
    stroke-linecap="square"
  />
</svg>
```

可以看到 `square` 比 `butt` 要稍微长一丢丢。

  

## 拐角 stroke-linejoin

拐角就是折线的交接点，可以使用 `stroke-linejoin` 设置，它接收以下属性：

-   `miter`: 尖角（默认）
-   `round`: 圆角
-   `bevel`: 平角

  

![32.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/974398b426ed4bd48e1f452890f44784~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 尖角 -->
  <polyline
    points="30 60, 60 30, 90 60"
    fill="none"
    stroke="blue"
    stroke-width="20"
    stroke-linejoin="miter"
  />

  <!-- 圆角 -->
  <polyline
    points="30 120, 60 90, 90 120"
    fill="none"
    stroke="blue"
    stroke-width="20"
    stroke-linejoin="round"
  />

  <!-- 平角 -->
  <polyline
    points="30 180, 60 150, 90 180"
    fill="none"
    stroke="blue"
    stroke-width="20"
    stroke-linejoin="bevel"
  />
</svg>
```

  

## 消除锯齿 shape-rendering

如果你觉得 `SVG` 在浏览器显示出来的图像有点模糊，那可能是开启了 **反锯齿** 功能，可以通过 `CSS` 属性关闭该功能。

```css
shape-rendering: crispEdges;
```

将该属性设置到对应的 `svg` 元素上，就会关闭反锯齿功能，突显看起来就会清晰很对，但在某些情况关闭了该功能会让图像看起来有点毛躁的感觉。

  

如果想开启反锯齿功能，可以这样设置：`shape-rendering: geometricPrecision;`

  
  

# 文本元素 text

`SVG` 可以使用 `<text>` 标签渲染文本。文本是有 **“基线”** 概念的，这个概念和 `CSS` 的一样。这里推荐 [AndyHu](https://juejin.cn/user/1635686563185870 "https://juejin.cn/user/1635686563185870") 的文章，可以快速搞懂基线。[《彻底搞懂vertical-align 底线、基线、中线的含义》](https://juejin.cn/post/7114690589480157214 "https://juejin.cn/post/7114690589480157214")

  

## 基础版

和 `Canvas` 一样，`SVG` 的文本对齐方式是以第一个字基线的左下角为基准。

![33.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8579e26725cf4294a98d69e2b80f076d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <text>雷猴啊</text>
</svg>
```

可以看到，文字跑去左上角了。但这并不是我们想要的效果。

`SVG` 如果没设置字号，它会跟随父元素的字号，一直往上跟跟跟上去。

在本例中，默认字号是跟随了浏览器的，也就是 `16px` 。

如果我们想看到文本，就需要将文字往下移动 `16px`，因为本文的对齐方式是以第一个字的基线的左下角为参考，默认的位置坐标是 `(0, 0)` ，现在要将y轴坐标改成 `16px` 才能完整显示文本

  

![34.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b61ca14c81e94138a59dba81d9f37fd4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <text y="16">雷猴啊</text>
</svg>
```

  

## 设置字号 font-size

![35.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dd866f3ce7f43e5bc02d0fe04da7f95~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <text
    y="60"
    font-size="60"
  >
    雷猴啊
  </text>
</svg>
```

  

## 粗体 font-weight

使用 `font-weight` 可以将文本设置成粗体。

-   `normal`: 默认（非粗体）
-   `bold`: 粗体

这和 `CSS` 是一样的

  

![36.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac564db188604d638704db4af3e1e393~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 默认 -->
  <text
    y="60"
    font-size="60"
    font-weight="normal"
  >
    雷猴啊
  </text>

  <!-- 粗体 -->
  <text
    y="140"
    font-size="60"
    font-weight="bold"
  >
    雷猴啊
  </text>
</svg>
```

  

## 装饰线 text-decoration

和 `CSS` 一样，可以使用 `text-decoration` 设置装饰线

-   `none`：默认
-   `underline`: 下划线
-   `overline`: 上划线
-   `line-through`: 删除线

  

![37.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b03f2eb38d3494bafe4f13de46c7102~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 默认 -->
  <text
    y="30"
    font-size="30"
    text-decoration="none"
  >
    雷猴啊
  </text>

  <!-- 上划线 -->
  <text
    y="100"
    font-size="30"
    text-decoration="overline"
  >
    雷猴啊
  </text>

  <!-- 删除线 -->
  <text
    y="170"
    font-size="30"
    text-decoration="line-through"
  >
    雷猴啊
  </text>

  <!-- 下划线 -->
  <text
    y="240"
    font-size="30"
    text-decoration="underline"
  >
    雷猴啊
  </text>
</svg>
```

  

## 水平对齐方式 text-anchor

可以通过 `text-anchor` 属性设置文本水平对齐方式。

如果本子是从左向右书写，那这几个参数的意思就是：

-   `start`: 左对齐
-   `middle`: 居中对齐
-   `end`: 右对齐

  

## 多行文本

多行文可以使用本 `<tspan>` 标签辅助实现

![38.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82d8a556d1e54a2286ad634be4b92d25~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <text fill="blue">
    <tspan x="10" y="30" fill="red">雷猴</tspan>
    <tspan x="10" y="60">鲨鱼辣椒</tspan>
    <tspan x="10" y="90">蟑螂恶霸</tspan>
    <tspan x="10" y="120">蝎子莱莱</tspan>
  </text>
</svg>
```

`<tspan>` 要放在 `<text>` 里，而且会继承 `<text>` 设置的样式。

如果在 `<tspan>` 里设置的样式和 `<text>` 的样式有冲突，最后会使用 `<tspan>` 的样式。

  

## 水平对齐方式

![39.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd05734f164a4f7caf9f833086dff52d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 参考线 -->
  <path d="M 200 0 200 400" stroke="red"></path>

  <!-- 左对齐 -->
  <text
    x="200"
    y="100"
    text-anchor="start"
  >
    雷猴
  </text>

  <!-- 居中对齐 -->
  <text
    x="200"
    y="130"
    text-anchor="middle"
  >
    雷猴
  </text>

  <!-- 右对齐 -->
  <text
    x="200"
    y="160"
    text-anchor="end"
  >
    雷猴
  </text>
</svg>
```

  

## 垂直对齐方式 dominant-baseline

可以通过 `dominant-baseline` 属性设置文本垂直对齐方式

-   `auto`: 默认的对齐方式，保持与父元素相同的配置。
-   `text-after-edge`: 在基线上方
-   `middle`: 居中基线
-   `text-before-edge`: 在基线下方

  

![40.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d27d392f8cf4223a123da41d2d58187~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <!-- 参考线 -->
  <path d="M 0 200 400 200" stroke="red"></path>

  <!-- 默认 -->
  <text
    x="20"
    y="200"
    dominant-baseline="auto"
  >
    雷猴
  </text>

  <!-- 在基线上方 -->
  <text
    x="80"
    y="200"
    dominant-baseline="text-after-edge"
  >
    雷猴
  </text>

  <!-- 居中基线 -->
  <text
    x="160"
    y="200"
    dominant-baseline="middle"
  >
    雷猴
  </text>

  <!-- 在基线下方 -->
  <text
    x="240"
    y="200"
    dominant-baseline="text-before-edge"
  >
    雷猴
  </text>
</svg>
```

  

## 纵向文字 writing-mode

将 `writing-mode` 设置成 `tb` 就可以让文字纵向排列。

需要注意英文和中文的文字角度！

  

![41.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9ab67ef495440ada364a58363cf6fa9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <text x="20" y="20" writing-mode="tb">Hello World!</text>
  <text x="100" y="20" writing-mode="tb">鲨鱼辣椒</text>
</svg>
```

  

有些教程里面会讲 `glyph-orientation-vertical` 属性可以旋转文字方向，但不推荐这个方法，因为现在的浏览器可能不再支持它了。

可以看看这个文档的说明：[《glyph-orientation-vertical》](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/glyph-orientation-vertical "https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/glyph-orientation-vertical")

  
  

# 超链接

和 `HTML` 一样，超链接可以使用 `<a>` 标签实现。

在 `SVG` 里，链接要放在 `xlink:href` 属性里。

如果希望鼠标放到链接上出现提示信息，可以在 `xlink:title` 属性里编写提示信息。

如需在新窗口打开链接，可以设置 `target="_blank"` 。

  

![42.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/383590dc95cd4564b61e9ee8225fdf30~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <a xlink:href="https://juejin.cn/post/7116784455561248775" xlink:title="canvas" target="_blank">
    <text x="20" y="20">也学学Canvas吧</text>
  </a>
</svg>
```

此时点击图片上的链接就会跳到对应的页面。

  

`<a>` 标签里除了可以包裹文本外，还可以包裹各种图形和图片等元素。

  
  

# 图片 image

在 `SVG` 中可以使用 `<image>` 标签加载图片，包括位图。

`<image>` 是使用 `xlink:href` 属性获取图片的

![43.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d94a1bdbffba4c4eb9b7658b3ebf446a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```html
<svg width="400" height="400" style="border: 1px solid red;">
  <image xlink:href="./img.jpg"></image>
</svg>
```

图片标签其实没什么好说的，和 `HTML` 的 `<img>` 标签用法差不多。

  
  

# 总结

通过上面这么多例子应该对 `SVG` 有一个大致的了解了。`SVG` 在前端编码中，感觉就像一堆新的标签。我们只要当它是 `HTML` 那样使用就行了。

  

本文记录的所有知识点都是 `SVG` 基础中的基础。

下一篇会介绍进阶的标签。比如实现渐变、分组，还会介绍比较难理解的坐标系统。

  
  

# 代码仓库

⭐[雷猴 SVG](https://gitee.com/k21vin/thunder-monkey-svg "https://gitee.com/k21vin/thunder-monkey-svg")

  
  

# 推荐阅读

👍[《Fabric.js 从入门到膨胀》](https://juejin.cn/post/7026941253845516324 "https://juejin.cn/post/7026941253845516324")

👍[《『Three.js』起飞！》](https://juejin.cn/post/7101683178741432356 "https://juejin.cn/post/7101683178741432356")

👍[《Canvas 从入门到劝朋友放弃（图解版）》](https://juejin.cn/post/7116784455561248775 "https://juejin.cn/post/7116784455561248775")

👍[《SVG 在前端的7种使用方法，你还知道哪几种？》](https://juejin.cn/post/7117876752633823269 "https://juejin.cn/post/7117876752633823269")

  

**点赞 + 关注 + 收藏 = 学会了**
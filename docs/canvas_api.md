# canvas api

## 简介

[教程](https://www.w3cschool.cn/kqjhm/kqjhm-7z8a25wt.html)

### 例子

```html
<!-- 
    <canvas> 标签只有两个属性—— width和height，这两个属性是可选的。
    当我们没有定义时，Canvas 的默认大小为300像素×150像素
    也可以通过样式控制canvas的大小
-->
<canvas id="mycanvas" width="200" height="300">
  您的浏览器不支持canvas
</canvas>

<script>
  var canvas = document.getElementById("mycanvas");
  var ctx = canvas.getContext("2d");
</script>
```

## 绘制基础图形

### Canvas 坐标

canvas 是一个二维网格，以左上角坐标为(0,0)

### 绘图步骤:

1. 查找 canvas 元素
2. 创建 context 对象(CanvasRenderingContext2D)
3. 绘制图像

### 绘制矩形

HTML 中的元素 canvas 只支持一种原生的图形绘制：矩形。所有其他的图形的绘制都至少需要生成一条路径。

```js
// 绘制一个填充的矩形
// fillRect( x ,y ,width, height)

// 绘制一个矩形的边框
// strokeRect( x ,y ,width, height)

// 清除指定矩形区域，让清除部分完全透明
// clearRect( x ,y ,width, height)

var canvas = document.getElementById("mycanvas");
if (canvas.getContext) {
  var ctx = canvas.getContext("2d");
  ctx.strokeRect(20, 20, 100, 100);
  ctx.fillRect(40, 40, 50, 50);
  ctx.clearRect(50, 50, 30, 30);
}
```

### 绘制路径

图形的基本元素是路径。路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。路径都是闭合的。

绘制路径图形的步骤：

- 创建路径起始点。 `ctx.beginPath()`
- 使用画图命令去画出路径。移动笔触 `ctx.moveTo(x,y)`, 画直线 `ctx.lineTo(x, y)`
  ```js
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.lineTo(150, 250);
  ctx.lineTo(300, 250);
  ctx.stroke(); // ctx.fill()
  ctx.closePath();
  ```
- 封闭路径。`ctx.closePath()`
- 一旦路径生成，就能通过描边或填充路径区域来渲染图形。`ctx.stroke()` `ctx.fill()`
  > 注意：当你调用 fill()函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 closePath()函数。但是调用 stroke()时不会自动闭合。

### 弧线

绘制圆弧或者圆，我们使用 arc()方法

```js
/* 
画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，参数anticlockwise 为一个布尔值。为true时，是逆时针方向，否则顺时针方向。

注意：arc()函数中的角度单位是弧度，不是角度数。角度与弧度的转换:radians=(Math.PI/180)*degrees
 */
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

ctx.beginPath();
ctx.arc(70, 70, 50, 0, Math.PI / 2, true); // 圆底部切线为0度 右侧切线为90度
ctx.stroke();

ctx.beginPath();
ctx.arc(180, 70, 50, 0, Math.PI / 2, false);
ctx.stroke();

ctx.beginPath();
ctx.arc(300, 70, 50, 0, Math.PI / 2, true);
ctx.fill();

ctx.beginPath();
ctx.arc(400, 70, 50, 0, Math.PI / 2, false);
ctx.fill();
```

###贝塞尔（bezier）以及二次贝塞尔

路径类型就是 贝塞尔曲线。二次以及三次贝塞尔曲线都十分有用，一般用来绘制复杂有规律的图形。

```js
// 绘制二次贝塞尔曲线，x,y为结束点，cp1x,cp1y为控制点。
quadraticCurveTo(cp1x, cp1y, x, y);

// 绘制三次贝塞尔曲线，x,y为结束点，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二。
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
```

### 矩形

`ctx.rect(x, y, width, height)`

### Path2D 对象

用来缓存或记录绘画命令，这样你将能快速地回顾路径

```js
new Path2D();     // 空的Path对象
new Path2D(path); // 克隆Path对象
new Path2D(d);    // 从SVG建立Path对象

var path=new Path2D();
path.rect(120,120,50,50);
ctx.stroke(path);

// 添加了一条路径到当前路径（可能添加了一个变换矩阵）
Path2D.addPath(path [, transform])​


// 使用 SVG paths
// 这条路径将先移动到点 (M10 10) 然后再水平移动80个单位 (h 80)，然后下移80个单位 (v 80)，接着左移80个单位 (h -80)，再回到起点处 (z)。
var p = new Path2D("M10 10 h 80 v 80 h -80 Z");
```

## 颜色、样式和阴影

> 注意: 一旦您设置了 strokeStyle 或者 fillStyle 的值，那么这个新值就会成为新绘制的图形的默认值。如果你要给每个图形上不同的颜色，你需要重新设置 fillStyle 或 strokeStyle 的值。

```js
// 设置图形的填充颜色。
ctx.fillStyle = color;

// 设置图形轮廓的颜色。
ctx.strokeStyle = color;

// color 可以是表示 CSS 颜色值的字符串，渐变对象或者图案对象

for (var i = 1; i < 6; i++) {
  for (var j = 1; j < 6; j++) {
    ctx.fillStyle =
      "rgb(" +
      Math.floor(255 - 42.5 * i) +
      "," +
      Math.floor(255 - 42.5 * j) +
      ",0)";
    ctx.fillRect(j * 25, i * 25, 25, 25);
  }
}
```

### 线型的样式

设置线条宽度。 `ctx.lineWidth = value`

```js
ctx.strokeStyle = "#e78170";
for (var i = 0; i < 10; i++) {
  ctx.lineWidth = 1 + i;
  ctx.beginPath();
  ctx.moveTo(25 + i * 14, 25);
  ctx.lineTo(25 + i * 14, 140);
  ctx.stroke();
}
```

设置线条末端样式。`ctx.lineCap = {type}`

- butt 线段末端以方形结束。
- round 线段末端以圆形结束。
- square 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域

设定线条与线条间接合处的样式。`ctx.lineJoin = {type}`

- round 通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度。
- bevel 在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角。
- miter 通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域。这个设置可以通过 miterLimit 属性看到效果

`ctx.miterLimit = value`  
限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。

`ctx.getLineDash()`  
返回一个包含当前虚线样式，长度为非负偶数的数组。

`ctx.setLineDash(segments)`  
设置当前虚线样式。

`ctx.lineDashOffset = value`  
设置虚线样式的起始偏移量。

### 渐变 Gradients

我们还可以用线性或者径向的渐变来填充或描边

- 线性渐变
  `ctx.createLinearGradient(x1, y1, x2, y2)` 渐变的起点 (x1,y1) 与终点 (x2,y2)。

- 径向渐变
  `ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)` createRadialGradient 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。

创建出 canvasGradient 对象后，我们就可以用 addColorStop 方法给它上色了。

`gradient.addColorStop(position, color)`  
position 参数必须是一个 0.0 与 1.0 之间的数值，color 参数必须是一个有效的 CSS 颜色值（如 #FFF， rgba(0,0,0,1)，等等）

```js
var linearGradient = ctx.createLinearGradient(50, 50, 250, 250);
linearGradient.addColorStop(0, "yellow");
linearGradient.addColorStop(0.5, "red");
linearGradient.addColorStop(1, "green");
ctx.fillStyle = linearGradient;
ctx.fillRect(50, 50, 200, 200);

// 径向渐变 同心渐变
var gradient = ctx.createRadialGradient(100, 100, 40, 100, 100, 100);
gradient.addColorStop(0, "red");
gradient.addColorStop(0.5, "yellow");
gradient.addColorStop(1, "blue");
ctx.fillStyle = gradient;
ctx.fillRect(20, 20, 160, 160);

// 不同心但外圆包含内圆
var gradient = ctx.createRadialGradient(250, 250, 20, 260, 260, 50);
gradient.addColorStop(0, "red");
gradient.addColorStop(0.5, "yellow");
gradient.addColorStop(1, "blue");
ctx.fillStyle = gradient;
ctx.fillRect(50, 50, 400, 400);
ctx.fill();
```

### 图案样式 Patterns

`ctx.createPattern(image, type)`  
Type 必须是下面的字符串值之一：

- repeat，
- repeat-x，
- repeat-y,
- no-repeat。

```js
var img = new Image();
img.src = "diamond.png";
img.onload = function() {
  var ptrn = ctx.createPattern(img, "repeat");
  ctx.fillStyle = ptrn;
  ctx.fillRect(250, 250, 80, 80);
};
```

### 阴影 Shadows

- shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。
- shadowBlur 用于设定阴影的模糊程度
- shadowColor 设定阴影颜色效果，默认是全透明的黑色。

```js
var img = new Image();
img.src = "mm.jpg";
img.onload = function() {
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#333";
  ctx.drawImage(img, 10, 10);
};
```

### Canvas 填充规则

`ctx.fill(mode)` mode 两个可能的值： "nonzero" "evenodd" 默认值"evenodd"

```js
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2, true);
ctx.arc(100, 100, 20, 0, Math.PI * 2, true);
ctx.fill("evenodd");
```

## 绘制文本

- `ctx.font` 设置文本的样式。
- `ctx.textAlign` 文本对齐选项. 可选值：start, end, left, right or center. 默认值是 start。
- `ctx.textBaseline` 基线对齐选项. 可选值：top, hanging, middle, alphabetic, ideographic, bottom。默认值是 alphabetic。
- `ctx.direction` 文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。

- `ctx.measureText()` 返回一个 TextMetrics 对象的宽度

```js
ctx.fillText(text, x, y [, maxWidth])

ctx.strokeText(text, x, y [, maxWidth])

```

## 图像绘制

`ctx.drawImage()`

```js
var img = new Image();

img.src = "xx.jpg";

img.onload = function() {
  // 等待图片加载完毕后再执行绘制
  ctx.drawImage(img, 0, 0);
};

// imageEle = document.getElementByid('myimage')

// ctx.drawImage(imageEle, 0, 0) // 写到目标位置
// drawImage(image, x, y, width, height) // 画入时缩放大小 跟原图比例不一致，会变形
// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) // 切片并缩放写入目标位置


```

## 变形
绘制复杂图形就必不可少的方法

```js
ctx.save() // 保存 canvas 状态
ctx.restore() // 恢复 canvas 状态

```
Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。  

Canvas 状态是以堆(stack)的方式保存的，每一次调用 save 方法，当前的状态就会被推入堆中保存起来。 

*这种状态包括*
1. 当前应用的变形（即移动，旋转和缩放） 
2. strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值. 
3. 当前的裁切路径（clipping path） 

你可以调用任意多次 save 方法。 每一次调用 restore 方法，上一个保存的状态就从堆中弹出，所有设定都恢复。

```js
ctx.fillStyle="red";
ctx.fillRect(10,10,50,50);
ctx.save();
ctx.fillStyle="blue";
ctx.fillRect(20,20,30,30);
ctx.restore();
ctx.fillRect(30,30,10,10);
```


**变形**  
在Canvas中，变形包括移动、旋转、缩放、变形，跟CSS3中的2D转换类似。
> 注意：原有内容不会受变形的影响，变形只是坐标变换，新绘制的图形就是在变换后的坐标轴里绘制的。


### 移动（translate）
`ctx.translate(x, y)`  canvas的坐标原点移动到指定位置(实际是整个坐标系移动了)

```js
ctx.fillRect(0,0,100,100);
ctx.save();
ctx.translate(60,60);
ctx.fillStyle="red";
ctx.fillRect(0,0,100,100);
ctx.restore();
```
### 旋转（rotate）
`ctx.rotate(angle)`  以坐标原点为中心旋转canvas(实际是整个坐标系旋转了) *角度(angle)，它是顺时针方向的，以弧度为单位的值*

```js
ctx.beginPath();
ctx.moveTo(0,50);
ctx.lineTo(100,50);
ctx.stroke();
ctx.save();
ctx.rotate(Math.PI/12);
ctx.strokeStyle="red";
ctx.beginPath();
ctx.moveTo(0,50);
ctx.lineTo(100,50);
ctx.stroke();
ctx.restore();
```
### 缩放（scale）
`ctx.scale(xScale, yScale)` 以坐标原点为中心缩放canvas(实际是整个坐标系缩放了)

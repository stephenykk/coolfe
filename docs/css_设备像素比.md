# devicePixelRatio notes

[移动端设计尺寸基础知识](https://m.sj33.cn/digital/wyll/201504/43652.html)  
[逻辑分辨率和物理分辨率到底是什么呀？](https://www.zhihu.com/question/40506180?sort=created)


## 像素和视口

### 像素
以iphone6为例

**分辨率：750pt x 1334pt**

    指的是屏幕上水平有750个物理像素，垂直有1334个物理像素。

**屏幕尺寸：4.7in**

    指的是屏幕对角线长度。

**屏幕像素密度：326ppi**

    指的是每英寸屏幕所拥有的像素数，在显示器中，dpi = ppi。dpi强调的是每英寸多少点。屏幕像素密度 = 分辨率 / 屏幕尺寸。

**设备像素**

    设备屏幕的物理像素，任何设备的物理像素的数量都是固定的。

**设备像素比**

    缩写为dpr，设备像素比 = 物理像素 / css像素（垂直或水平），可以通过window.devicePixelRatio获取。

    iphone6的css像素为375x667，dpr为2，则物理像素为750x1334，还有一台设备，css像素为375x667，dpr为1，此时物理像素为375x667。

**设备独立像素**

    也叫做逻辑像素(对于前端来说，和我们的css像素是一样的)，这个不同的设备是不一样的。在viewport为理想视口模式时， 如iphone6此时的viewport为375px，代表着我们在css中写375px就可以达到全屏的效果；

**css像素**

    为web开发者创造的，在css/JavaScript中使用的一个抽象的层。1个css像素相当于多少个设备像素取决于屏幕的特性(是否高密度)和用户进行的缩放。当用户放大得越大，一个css像素覆盖的设备像素就越多。

### PC端和移动端不同的视口

以下涉及的像素均为CSS像素，并且默认不考虑缩放。

- 布局视口

    在pc端，和浏览器可视窗口宽度一致。  
    在移动端，默认情况下，布局视口的宽度远大于浏览器宽度，CSS布局会根据它来计算  
    ![布局视口示意图](https://img-blog.csdnimg.cn/20190219000244147.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE1MjQxMDcx,size_16,color_FFFFFF,t_70)  
    `document.documentElement.clientWidth` 可得到布局视口宽度

- 视觉视口 
    视觉视口是用户正在看到的网站的区域内CSS像素的数量，用户可以通过缩放来操作视觉视口。  
    缩放不会改变布局视口的宽度，但是会影响视觉视口容纳内容的多少；当缩小的时候，屏幕覆盖的CSS像素变多  
    `screen.width` 可得到理想视口的宽度(*device-width*); `screen.width * window.devicePixelRatio` 可得到设备宽度的物理像素数量  
    `window.innerWidth` 看得到可是区域宽度的像素数量

- 理想视口  
    `<meta name="device" content="width=device-width,initial-scale=1">`  
    *width=device-width* 告诉浏览器布局视口的宽度应该与理想视口的宽度一致。定义理想视口是浏览器的工作。  
    媒体查询的时候，查询的宽度是布局视口的宽度。  
    *initial-scale=1*，意思是初始缩放的比例是1，设置之后，会将布局视口的尺寸设置为缩放后的尺寸，而缩放的尺寸就是基于屏幕的宽度来的，也就起到了和和 width = device-width同样的效果。



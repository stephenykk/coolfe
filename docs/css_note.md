css notes
===

居中
---
水平居中
```scss

//  内联元素居中(inline / inline-block)
// :: text-align
.parent {
    text-align: center;
    .child {display: inline-block;}
}

// 块级元素居中
// :: margin: auto
.content {
    display: block;
    margin: 0 auto;
    width: 80%;
}

// 绝对定位元素居中
// :: left + tranlateX
.abs {
    position: absolute;
    left: 50%;
    transform: translateX(-50%); // 回退自身宽度50%的距离
}

// :: left right + margin: auto
.abs {
    position: absolute;
    width: 200px;
    height: 300px;
    left: 0;
    right: 0;
    margin: auto;
}

// flex-item居中
// :: justify-content
.flex-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
}
// :: margin: auto
.flex-container {
    display: flex;
    .only-child {
        margin: 0 auto;
    }
}


```

垂直居中
```scss
// 普通元素 (parent table-cell)
// :: table-cell vertical-align
.parent {
    height: 200px;
    display: table-cell;
    vertical-align: center;
}


// 绝对定位元素
// :: top  translateY
.abs {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
// :: top bottom margin: auto
.abs {
    position: absolute;
    width: 200px;
    height: 300px;
    top: 0;
    bottom: 0;
    margin: auto;
}

// flex-item居中
// :: align-items
.flex-container {
    height: 300px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

// 内联元素居中 (::after vertical-align: center)
// :: inline-block vertical-align: center
.container {
    height: 100px;
    &::after {
        content: '';
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: center;
    }
}
```

水平垂直均居中
```scss
// 绝对定位元素
.abs {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}
.abs {
    position: absolute;
    width: 80%;
    height: 300px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}


// flex-item
.flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

```


多列布局
---
[一篇文章搞定多列布局--等宽，等高，自适应](https://juejin.im/post/5e1eabcbf265da3ded025229)
aside(固定宽度) + main(自适应宽度)

```scss

// 浮动布局
// :: float + margin
.aside {
    float: left;
    width: 200px;
}
.main {
    margin-left: 200px;
}

// :: float + overflow 左边可以不定宽度
.aside {
    float: left;
    width: 200px;
}
.main {
    overflow: hidden; // BFC
}

// 绝对定位布局
// :: absolute + margin
.page {
    position: relative;
    .aside {
        position: absolute;
        width: 200px;
        left: 0;
        top: 0;
    }
    .main {
        margin-left: 200px;
    }
}

// 表格布局 可以不定宽
// :: display: table  table-cell
.page {
    display: table;
    width: 100%;
    table-layout: fixed;

    .aside {
        display: table-cell;
        width: 200px;
        padding-right: 20px;
    }
    .main {
        display: table-cell;
    }
}


// flex 布局 可以不定宽
.page {
    display: flex;
    .aside {
        width: 200px;
    }
    .main {
        flex: 1;
    }
}
```

> BFC（Block Formatting Context）块级格式上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。  

> 下列情况都可以形成一个BFC:
> 1. 浮动元素，float 除 none 以外的值； 
> 2. 定位元素，position（absolute，fixed）； 
> 3. display 为以下其中之一的值 inline-block，table-cell，table-caption； 
> 4. overflow 除了 visible 以外的值（hidden，auto，scroll）；

> BFC有如下特性：
> 1. 内部的Box会在垂直方向上一个接一个的放置。
> 2. 垂直方向上的距离由margin决定
> 3. bfc的区域不会与float的元素区域重叠。
> 4. 计算bfc的高度时，浮动元素也参与计算
> 5. bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。

等宽布局
```scss
// 浮动布局
.parent {
    margin-left: -20px; // 负外边距能让块级元素长度增加
    overflow: hidden;
    .col {
        float: left;
        width: 25%;
        box-sizing: border-box;
        padding-left: 20px;
    }
}

// 表格布局
.parent-wrap {
    margin-left: -20px;
    .parent {
        display: table;
        width: 100%;
        table-layout: fixed; // 表格列固定等宽
        .col {
            display: table-cell;
            padding-left: 20px;
        }
    }
}

// 不需要 parent-wrap 扩展表格宽度
.parent {
    display: table;
    table-layout: fixed;
    width:calc(100% + 20px);
    position: relative;
    left: -20px;
}

// flex布局
.parent {
    display:flex;
    .col {
        flex: 1,
        margin-top: 20px;
    }
}
```

等高布局  
等高布局要实现的就是当一列高度被撑高时，另一列也会跟着被撑高

```scss
// 表格布局
// 表格的一行里面不同的单元格天生就是等高的
.parent {
    display: table;
    width: 100%;
    table-layout: fixed;
    .col {
        display: table-cell;
    }
    .aside {
        width: 200px;
        border-right: 20px solid transparent;
    }
}

// flex布局
.parent {
    display:flex;
    align-items: stretch; // 默认
}

// 浮动布局(极大负边距)
.parent {
    overflow: hidden;
    .aside {
        float: left;
    }
    .main {
        overflow: hidden;
    }
    .aside, .main {
        padding-bottom: 9999px;
        margin-bottom: -9999px;
    }
}
```

Grid布局  
Grid是一个比flex还要强大的布局方案

```scss
// aside + main
.parent {
    display: grid;
    gride-template-columns: 200px auto;
    gride-column-gap: 10px;
}

```

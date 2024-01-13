# markdown note

## 标题

```markdown
    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题
    ###### 六级标题

    一级标题
    ===

    二级标题
    ---
```

## 字体

```markdown
    **加粗**
    *斜体*
    ***斜体加粗***
    ~~删除线~~
```

## 引用

```markdown
    >这是引用
    >>二级引用
    >>>>>多级引用 大于号的数量可以任意
```

## 分割线

```markdown
    ---
    ***
```

## 图片

![blockchain](https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/
u=702257389,1274025419&fm=27&gp=0.jpg "区块链")

```markdown
    ![图片alt](图片地址 "图片title")
```

## 超链接

和图片的语法很像，就是少了前面的`!`  
[简书](http://jianshu.com)

```markdown
    [链接文本](链接地址, 链接title)
```

## 列表

### 无序列表

```markdown
    - 列表1
    - 列表1
    - 列表1

    + 列表a
    + 列表a
    + 列表a

    * 列表A
    * 列表A
    * 列表A
```

### 有序列表

```markdown
    1. 有序1
    2. 有序2
    3. 有序3

    1. 有序a
    1. 有序b
    1. 有序c
```

### 列表嵌套

```markdown
    // 注意嵌套列表要缩进3个空格，或1个tab
    1. javascript
       - 变量
       - 继承
    2. python
       - 变量
       - 继承
```

## 表格

```markdown
    // 第二行区分表头和内容
    // 文字默认居左对齐，两边加:表示居中对齐；右边加: 表示居右对齐
    表头1|表头2居中对齐|表头3右对齐
    ---|:---:|---:
    行1内容 | 行1内容 | 行1内容
    行2内容 | 行2内容 | 行2内容
```

## 代码

````markdown
    `inline code`

    ```js
        var s = 'block code'
        var s2 = 'block code line2'
    ```
````

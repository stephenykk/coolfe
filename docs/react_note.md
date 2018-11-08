react notes
==========

react特点
---
+ 声明范式
+ 虚拟dom
+ jsx
+ 组件化
+ 单向响应式数据流


简单示例

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Hello React!</title>
<script src="https://cdn.staticfile.org/react/16.4.0/umd/react.development.js"></script>
<script src="https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js"></script>
<script src="https://cdn.staticfile.org/babel-standalone/6.26.0/babel.min.js"></script>
</head>
<body>

<div id="example"></div>
<script type="text/babel">
ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
);
</script>

</body>
</html>
```


>> 在浏览器中使用 Babel 来编译 JSX 效率是非常低的。



# echarts 官方文档摘要

## 简单实例

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script src="echarts.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width:600px; height:400px"></div>
    <script>
      var mychart = echarts.init(document.getElementById("chart"));
      mychart.setOption({
        title: {
          text: "Hello Echarts",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [{ name: "销量", type: "bar", data: [5, 20, 36, 10, 10, 20] }],
      });
    </script>
  </body>
</html>
```

## itemStyle

itemStyle 都会有`normal` 和 `emphasis`两个选项，分别表示常态和 hover 态的样式.

```js
series: [
  {
    itemStyle: {
      normal: {
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "rgba(0,0,0,0.5)",
      },
      emphasis: { shadowColor: "rgba(200,0,0,0.5)" },
    },
  },
];
```

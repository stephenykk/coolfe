# echarts 官方文档摘要

[Echart文档](https://echarts.apache.org/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts)

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
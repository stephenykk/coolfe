# 移动端调试方案

## vconsole

把vcnsole的cdn链接放网页内

## eruda
把eruda的cdn链接放网页内

## spy-debugger

```js
npm i -g spy-debugger

// 集成anyproxy + weinre
// 自动为html页面插入，weinre的targetScript
// weinre的targetScript是https协议的
spy-debugger  

```

## weinre + charles

问题:
target script为http协议的，https网站会阻断该script加载

解决方法: 
[ngrok内网穿透提供https域名](https://www.undefinednull.com/2015/03/17/remote-debugging-localhost-with-weinre/#:~:text=As%20of%20now%2C%20weinre%20target%20script%20doesn%27t%20not,the%20pages%2C%20the%20browser%20will%20block%20the%20script.)


```js
npm i -g weinre

// 开启调试服务器和客户端
// weinre的targetScript为http协议的，插入到https的网页，会被浏览器阻断
weinre --boundHost localhost --httpPort 7890

```

## chrome devtools 真机调试

1. 手机开启USB调试
2. 手机用数据线连接电脑
3. 打开chrome devtools
4. 电脑翻墙


## light proxy

基于nodejs的抓包工具
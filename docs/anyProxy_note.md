# anyproxy notes

[文档](http://anyproxy.io/cn/#%E9%85%8D%E7%BD%AEosx%E7%B3%BB%E7%BB%9F%E4%BB%A3%E7%90%86)

## 安装

```shell
npm i -g anyproxy
```

## 启动

```shell
# http://localhost:8002 下载证书，添加到信任根证书
anyproxy -i # 支持抓取https

# 没有抓取效果，还需要手动设置系统代理， 127.0.0.1 8001
```

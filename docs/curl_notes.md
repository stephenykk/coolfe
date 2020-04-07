# curl_notes

curl 是一种命令行工具，作用是发出网络请求，然后得到和提取数据，显示在"标准输出"（stdout）上面。

参考[curl 用法指南](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

使用示例：

```bash
# curl url 获取网页源码
curl www.sina.com

# curl -o file url 网页源码(响应体)导出到文件
curl -o sina.html www.sina.com

# curl -L url 自动跳转，获取 url 重定向后的内容
curl -L www.sina.com
# 用eggjs起个web服务，controller.home.index中 ctx.redirect('https://www.baidu.com')
curl http://localhost:7001 # 301 不会返回百度首页内容
curl -L http://localhost:7001 # 会返回百度首页内容

# curl -i url 增加显示响应头
curl -i www.sina.com # 返回响应头和响应体

# curl -I url 只显示响应头
curl -I www.sina.com

# curl -v url #显示完整的 http 通信过程
curl -v www.sina.com

# curl --trace output.txt url 显示更加详细的数据
curl --trace output.txt www.baidu.com

# curl -G --data "foo=bar" url GET 请求并带参数
curl -G --data "login=1&name=sindy" localhost:7001

# curl -X POST --data 'data' --header 'header' url POST请求
curl -X POST http://127.0.0.1:7001/form --data '{"name":"controller"}' --header 'Content-Type:application/json'
curl -iv -d "@data.json" http://localhost:7002/component/create --cookie 'csrfToken=REhEag2ATP5vfl2Za6aOXoCT' --header 'x-csrf-token:REhEag2ATP5vfl2Za6aOXoCT' --header 'content-type: application/json' -o out.txt # 多个header要用多个--header选项

# --data-urlencode 自动urlencode数据
curl -X POST --data-urlencode "val" url #指定请求方法 并带参数(_会把参数 urlencode_)
# --data 默认不encode数据
curl -X POST --data "val" url #指定请求方法 并带参数(_不会把参数 urlencode_) --data 同 -d

# -d 参数用于发送 POST 请求的数据体。
curl -d 'login=emma&password=123' -X POST https://google.com/login
# 可用多个-d发送多个键值对数据
curl -d 'login=emma' -d 'password=123' -X POST  https://google.com/login

# 用-d参数以后，HTTP 请求会自动加上标头Content-Type : application/x-www-form-urlencoded。并且会自动将请求转为 POST 方法，因此可以省略-X POST。
# -d参数可以读取本地文本文件的数据，向服务器发送。
curl -d '@data.txt' https://google.com/login

# 文件上传
curl --form upload=@localfilename --form press=ok url

# 指定 ua 同 curl -A val url
curl --user-agent val url

# 指定 referer
curl --referer val url

# 指定 cookie
curl --cookie "name=xx" url

# 返回的 cookie 保存为文件
curl -c cookies.txt http://example.com

# 发送 cookie 文件
curl -b cookies.txt http://example.com

# 增加请求头 同 curl -H val url , curl --header val url
curl --head "content-type: application/json" url

# http 认证
curl --user name:password url
```

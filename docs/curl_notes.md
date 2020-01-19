curl_notes
===
curl是一种命令行工具，作用是发出网络请求，然后得到和提取数据，显示在"标准输出"（stdout）上面。

参考[curl用法指南](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

- curl url  #获取网页源码
   ```shell
   curl www.sina.com
   ```
- curl -o file url # 网页源码导出到文件
   ```shell
    curl -o sina.html www.sina.com
    ```
- curl -L url #自动跳转，获取url重定向后的内容
  ```shell
  curl -L www.sina.com
  // 用eggjs起个服务，controller.home.index中ctx.redirect('https://www.baidu.com')
  curl http://localhost:7001 不会返回百度首页的html, 这就是不加-L参的效果啦
  ```
- curl -i url #增加显示响应头 返回响应头和响应体
  ```shell
  curl -i www.sina.com
  ```
- curl -I url #只显示响应头
  ```shell
  curl -I www.sina.com
  ```
- curl -v url #显示完整的http通信过程
  ```shell
  curl -v www.sina.com
  ```
- curl --trace output.txt  url #显示更加详细的数据

- curl -G --data "login=xx&name=xx" localhost:7001  # GET请求并带参数

- curl -X POST --data-urlencode "val" url #指定请求方法 并带参数(*会把参数urlencode*)
- curl -X POST --data "val" url  #指定请求方法 并带参数(*不会把参数urlencode*)    --data 同 -d
   ```shell
   # -d 参数用于发送 POST 请求的数据体。
   curl -d 'login=emma&password=123' -X POST https://google.com/login
    # 或者
   curl -d 'login=emma' -d 'password=123' -X POST  https://google.com/login
   # 用-d参数以后，HTTP 请求会自动加上标头Content-Type : application/x-www-form-urlencoded。并且会自动将请求转为 POST 方法，因此可以省略-X POST。   
   # -d参数可以读取本地文本文件的数据，向服务器发送。      
    curl -d '@data.txt' https://google.com/login   
  ```
- curl --form upload=@localfilename --form press=ok  url #文件上传
- curl --user-agent val url #指定ua   同 curl -A val url
- curl --referer val url #指定referer
- curl --cookie "name=xx" url #指定cookie
- curl -c cookies.txt http://example.com #保存返回的cookie
- curl -b cookies.txt http://example.com #发送指定的cookie
- curl --head "content-type: application/json" url  #增加请求头 同 curl -H val  url
- curl --user name:password url #http认证
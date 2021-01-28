# nginx note
[nginx入门教程](https://xuexb.github.io/learn-nginx/guide/)
[nginx 配置详解](https://www.jianshu.com/p/1593954d5faf)  
[nginx 重写规则配置](https://www.cnblogs.com/pengyunjing/p/8542200.html)  
[Nginx正向代理和反向代理详解 - 简书](https://www.jianshu.com/p/d7258c062751)  
[总结nginx中的location配置](http://www.fly63.com/article/detial/8552)  
[Nginx的location匹配规则](https://www.cnblogs.com/duhuo/p/8323812.html)

## Nginx简介

### Nginx出现的背景

在互联网产业远没有现在这么红火的时候，每个网站或者应用所需要支持的并发量不需要太大，所以最开始的服务器是Apache，它对高并发并不支持，所以它不是高性能的Web服务器，因为并发量上万之后，会导致服务器消耗大量内存，操作系统对其进行进程或线程间的切换也会消耗大量的CPU资源，导致Http请求的平均响应速度降低。

但是现在的互联网流量已经远远不是当时所能想象的，所以迫切需要一种高性能的，稳定的Web服务器。于是Nginx诞生了。

### Nginx的优点
1. 开源，它免费啊。
2. Nginx使用基于事件驱动架构，使得其可以支持数以百万级别的TCP连接
3. Nginx是一个跨平台服务器，可以运行在Linxu，Windows，MacOS等主流的操作系统中
4. 极为稳定。

### Nginx介绍
Nginx是一个高性能且开源的HTTP和反向代理Web服务器，同时也是一个IMAP、POP3、SMTP代理服务器；Nginx可以作为一个HTTP服务器进行网站的发布处理，另外Nginx可以作为反向代理进行负载均衡的实现。

使用场景：
- 反向代理
- http服务器
- 负载均衡服务器
- 邮件代理服务器


## Nginx的配置

![nginx.conf](https://upload-images.jianshu.io/upload_images/658641-457458febe07f065.png?imageMogr2/auto-orient/strip|imageView2/2/w/441/format/webp)

配置文件分4部分:
- main（全局设置）：设置的指令将影响其他所有设置；
- server（主机设置）：指令主要用于指定主机和端口、
- upstream（负载均衡服务器设置）：指令主要用于负载均衡，设置一系列的后端服务器
- location（URL匹配特定位置的设置）：用于匹配网页位置。

![server 块配置](https://upload-images.jianshu.io/upload_images/658641-02caaa1bc69a795f.png)


### location块

URL地址匹配是进行Nginx配置中最灵活的部分。 location支持正则表达式匹配，也支持条件判断匹配，用户可以通过location指令实现Nginx对动、静态网页进行过滤处理。使用location URL匹配配置还可以实现反向代理，用于实现PHP动态解析或者负载负载均衡。

![location块配置](https://upload-images.jianshu.io/upload_images/658641-262f6910d5c3f9ff.png)

alias与root的区别

- root    实际访问文件路径会拼接URL中的路径  $request_filename = $document_root + $document_uri
- alias   实际访问文件路径不会拼接URL中的路径


```nginx
    # 严格匹配：一，普通location，无任何前缀符号的；二，带=号前缀符号的严格匹配。
    location  /blogs  {
        root /home/jie; # 会在root下查找blogs目录，所以要先新建blogs文件夹
        autoindex on;
    }
    # curl localhost/blogs/a.html -> /home/jie/blogs/a.html
    # curl localhost/blogs 显示文件列表
    # localhost/blogshaha 也会匹配到 只要root下有对应目录即可

    location /comics {
      alias /home/pan/manhua; # alias值替代/comics, 
      autoindex on;
    }
    # curl localhost/comics/hi.html -> /home/pan/manhua/hi.html

    location ~ ^.+\.txt$ {
      root /home/pan;  # 注意 指令都需要分号结尾
    }
    # curl localhost/docs/hello.txt 会查找 /home/pan/docs/hello.txt

    location /documents/ {
      # matches any query beginning with /documents/ and continues searching,
      # so regular expressions will be checked. This will be matched only if
      # regular expressions don't find a match.
      [ configuration C ] 
    }


    location ^~ /images/ {
      # matches any query beginning with /images/ and halts searching,
      # so regular expressions will not be checked.
      [ configuration D ] 
    }
    location ~* \.(gif|jpg|jpeg)$ {
      # matches any request ending in gif, jpg, or jpeg. However, all
      # requests to the /images/ directory will be handled by
      # Configuration D.   
      [ configuration E ] 
    }
```

语法规则： 

`location [=|~|~*|^~] /uri/ { … }`

- = 开头表示精确匹配

- ^~ 开头表示uri以某个常规字符串开头，理解为匹配 url路径即可。nginx不对url做编码，因此请求为/static/20%/aa，可以被规则^~ /static/ /aa匹配到（注意是空格）。

- ~ 开头表示区分大小写的正则匹配

- ~* 开头表示不区分大小写的正则匹配

- !~和!~*分别为区分大小写不匹配及不区分大小写不匹配 的正则

- / 通用匹配，任何请求都会匹配到。


首先匹配 =，其次匹配^~, 其次是按文件中顺序的正则匹配，最后是交给 / 通用匹配。当有匹配成功时候，停止匹配，按当前匹配规则处理请求。

```js
// http://localhost/ 将匹配规则A
location = / {
   # 规则A
}
// http://localhost/login 将匹配规则B
location = /login {
   # 规则B
}
//  http://localhost/static/a.html 将匹配规则C
location ^~ /static/ {
   # 规则C
}

location ~ \.(gif|jpg|png|js|css)$ {
   # 规则D
}
// http://localhost/a.PNG 则匹配规则E
location ~* \.png$ {
   # 规则E
}
// http://localhost/a.XHTML
location !~ \.xhtml$ {
   # 规则F
}
location !~* \.xhtml$ {
   # 规则G
}
// http://localhost/category/id/1111 
location / {
   # 规则H
   proxy_pass http://tomcat:8080/
}
```


### ReWrite语法

- last – 基本上都用这个Flag。
- break – 中止Rewirte，不再继续匹配
- permanent – 返回永久重定向的HTTP状态301
- redirect – 返回临时重定向的HTTP状态302

**last 和 break关键字的区别**

- last 和 break 当出现在location 之外时，两者的作用是一致的没有任何差异

- last 和 break 当出现在location 内部时：  
  + last     使用了last 指令，rewrite 后会跳出location 作用域，重新开始再走一次刚才的行为
  + break    使用了break 指令，rewrite后不会跳出location 作用域，它的生命也在这个location中终结


**permanent 和 redirect关键字的区别**

- permanent   永久性重定向，请求日志中的状态码为301
- redirect    临时重定向，请求日志中的状态码为302


### 下面是可以用来判断的表达式：

- -f和!-f用来判断是否存在文件
- -d和!-d用来判断是否存在目录
- -e和!-e用来判断是否存在文件或目录
- -x和!-x用来判断文件是否可执行

### 下面是可以用作判断的全局变量
```js
// 例：http://localhost:88/test1/test2/test.php

$host：localhost
$server_port：88
$request_uri：http://localhost:88/test1/test2/test.php
$document_uri：/test1/test2/test.php
$document_root：D:\nginx/html
$request_filename：D:\nginx/html/test1/test2/test.php
```

### Redirect语法
```js
server {
    listen 80;
    server_name start.igrow.cn;
    index index.html index.php;
    root html;
    if ($http_host !~ "^star\.igrow\.cn$") {
        rewrite ^(.*) http://star.igrow.cn$1 redirect;
    }
}
```
### 防盗链
```js
location ~* \.(gif|jpg|swf)$ {
    valid_referers none blocked start.igrow.cn sta.igrow.cn;
    if ($invalid_referer) {
        rewrite ^/ http://$host/logo.png;
    }
}
```

### 根据文件类型设置过期时间
```js
location ~* \.(js|css|jpg|jpeg|gif|png|swf)$ {
    if (-f $request_filename) {
        expires 1h;
        break;
    }
}
```
### 禁止访问某个目录
```js
location ~* \.(txt|doc)${
  root /data/www/wwwroot/linuxtone/test;
  deny all;
}
```

一些可用的全局变量

```js
$args
$content_length
$content_type
$document_root
$document_uri
$host
$http_user_agent
$http_cookie
$limit_rate
$request_body_file
$request_method
$remote_addr
$remote_port
$remote_user
$request_filename
$request_uri
$query
```
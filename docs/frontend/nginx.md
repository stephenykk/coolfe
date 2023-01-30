# nginx note

[nginx 入门教程](https://xuexb.github.io/learn-nginx/guide/)
[nginx 配置详解](https://www.jianshu.com/p/1593954d5faf)  
[nginx 重写规则配置](https://www.cnblogs.com/pengyunjing/p/8542200.html)  
[Nginx 正向代理和反向代理详解 - 简书](https://www.jianshu.com/p/d7258c062751)  
[总结 nginx 中的 location 配置](http://www.fly63.com/article/detial/8552)  
[Nginx 的 location 匹配规则](https://www.cnblogs.com/duhuo/p/8323812.html)

## Nginx 简介

### Nginx 出现的背景

在互联网产业远没有现在这么红火的时候，每个网站或者应用所需要支持的并发量不需要太大，所以最开始的服务器是 Apache，它对高并发并不支持，所以它不是高性能的 Web 服务器，因为并发量上万之后，会导致服务器消耗大量内存，操作系统对其进行进程或线程间的切换也会消耗大量的 CPU 资源，导致 Http 请求的平均响应速度降低。

但是现在的互联网流量已经远远不是当时所能想象的，所以迫切需要一种高性能的，稳定的 Web 服务器。于是 Nginx 诞生了。

### Nginx 的优点

1. 开源，它免费啊。
2. Nginx 使用基于事件驱动架构，使得其可以支持数以百万级别的 TCP 连接
3. Nginx 是一个跨平台服务器，可以运行在 Linxu，Windows，MacOS 等主流的操作系统中
4. 极为稳定。

### Nginx 介绍

Nginx 是一个高性能且开源的 HTTP 和反向代理 Web 服务器，同时也是一个 IMAP、POP3、SMTP 代理服务器；Nginx 可以作为一个 HTTP 服务器进行网站的发布处理，另外 Nginx 可以作为反向代理进行负载均衡的实现。

使用场景：

- 反向代理
- http 服务器
- 负载均衡服务器
- 邮件代理服务器

## Nginx 的配置

![nginx.conf](https://upload-images.jianshu.io/upload_images/658641-457458febe07f065.png?imageMogr2/auto-orient/strip|imageView2/2/w/441/format/webp)

配置文件分 4 部分:

- main（全局设置）：设置的指令将影响其他所有设置；
- server（主机设置）：指令主要用于指定主机和端口、
- upstream（负载均衡服务器设置）：指令主要用于负载均衡，设置一系列的后端服务器
- location（URL 匹配特定位置的设置）：用于匹配网页位置。

![server 块配置](https://upload-images.jianshu.io/upload_images/658641-02caaa1bc69a795f.png)

配置示例

```js
user nobody nobody;
worker_processes 2;
err_log logs/error.log notice;
pid logs/nginx.pid;

events {
  use epoll;
  worker_connections 1000; # 每个nginx进程的最大连接数
}

http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 60; # 长连接的超时时间

  server {
    listen 88;
    server_name localhost;
    location / {
      root html;
    }
  }
}
```
### location 块

URL 地址匹配是进行 Nginx 配置中最灵活的部分。 location 支持正则表达式匹配，也支持条件判断匹配，用户可以通过 location 指令实现 Nginx 对动、静态网页进行过滤处理。使用 location URL 匹配配置还可以实现反向代理，用于实现 PHP 动态解析或者负载负载均衡。

![location块配置](https://upload-images.jianshu.io/upload_images/658641-262f6910d5c3f9ff.png)

alias 与 root 的区别

- root 配置根目录，在根目录中查找 *$document_uri对应的文件* $request_filename = $document_root + \$document_uri
- alias 配置别名目录，在别名目录中查找 *$document_uri去除匹配路径后剩余路径对应的文件*

```nginx
    # 严格匹配：一，普通location，无任何前缀符号的；二，带=号前缀符号的严格匹配。
    location  /blogs  { # $document_uri 起始位置匹配给定的路径或正则
        root /home/jie; # 会在root下查找blogs目录，所以要先新建blogs文件夹
        autoindex on;
    }
    # curl localhost/blogs/a.html -> /home/jie/blogs/a.html
    # curl localhost/blogs 显示文件列表
    # localhost/blogshaha 也会匹配到 只要root下有对应目录即可
    # curl localhost/lastyear/blogs 即使root下有对应目录也不会匹配到 `location /blogs`只匹配url以`/blogs`开头的情况

    location /comics {
      alias /home/pan/manhua; # alias值替代/comics,
      autoindex on;
    }
    # curl localhost/comics/hi.html -> /home/pan/manhua/hi.html

    location ~ ^.+\.txt$ {
      root /home/pan;  # 注意 指令都需要分号结尾
    }
    # curl localhost/docs/hello.txt 会查找 /home/pan/docs/hello.txt

    # curl localhost/documents/a.jpg -> 会匹配 configuration E
    # 以 /documents/ 开头这个专指度比较低，所以会继续查找 正则匹配 规则
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

- `=` 表示精确匹配

- `^~` 表示区分大小写的正则匹配uri的开始位置

- `~` 表示区分大小写的正则匹配

- `~*` 表示不区分大小写的正则匹配

- `!~` 和 `!~*` 分别为区分大小写不匹配及不区分大小写不匹配 的正则 *不用在 location 后面*

- `/` 通用匹配，任何请求都会匹配到。

首先匹配 `=`，其次匹配 `^~` , 其次是按文件中顺序的正则匹配，最后是交给 `/` 通用匹配。当有匹配成功时候，停止匹配，按当前匹配规则处理请求。

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
// http://localhost/a.XHTML 不确定是否有效
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

### ReWrite 语法

- `last`  基本上都用这个 Flag。
- `break`  中止 Rewirte，不再继续匹配
- `permanent`  返回永久重定向的 HTTP 状态 301
- `redirect`  返回临时重定向的 HTTP 状态 302

**last 和 break 关键字的区别**

- last 和 break 当出现在 location 之外时，两者的作用是一致的没有任何差异

- last 和 break 当出现在 location 内部时：
  - `last` 使用了 last 指令，rewrite 后会跳出 location 作用域，重新开始再走一次刚才的行为
  - `break` 使用了 break 指令，rewrite 后不会跳出 location 作用域，它的生命也在这个 location 中终结

**permanent 和 redirect 关键字的区别**

- `permanent` 永久性重定向，请求日志中的状态码为 301
- `redirect` 临时重定向，请求日志中的状态码为 302

### 下面是可以用来判断的表达式：

- `-f` 和 `!-f` 用来判断是否存在文件
- `-d` 和 `!-d` 用来判断是否存在目录
- `-e` 和 `!-e` 用来判断是否存在文件或目录
- `-x` 和 `!-x` 用来判断文件是否可执行

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

### Redirect 语法

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
$args;
$content_length;
$content_type;

$document_root;
$document_uri;

$host;
$query;

// header 可加上http_前缀访问
$http_origin;
$http_user_agent;
$http_cookie;

$limit_rate;

$request_body_file;
$request_method;
$request_uri;
$request_filename;

$remote_addr;
$remote_port;
$remote_user;
```

## 负载均衡配置

[负载均衡的 5 种策略](https://www.cnblogs.com/andashu/p/6377323.html)

nginx的upstream目前支持的5种方式的分配


1、轮询（默认）
每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

```js
upstream backserver {
  server 192.168.0.14;
  server 192.168.0.15;
}
```

2、指定权重
指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。

```js
upstream backserver {
  server 192.168.0.14 weight=10;
  server 192.168.0.15 weight=10;
}

```

3、IP绑定 ip_hash
每个请求按访问ip的hash结果分配，这样*每个访客固定访问一个后端服务器，可以解决session的问题*。
```js
upstream backserver {
  server 192.168.0.14:88;
  server 192.168.0.15:80;
  ip_hash;
}
```
4、fair（第三方）
按后端服务器的响应时间来分配请求，响应时间短的优先分配。
```js
upstream backserver {
  server 192.168.0.14:88;
  server 192.168.0.15:80;
  fair;
}
```
5、url_hash（第三方）
按访问url的hash结果来分配请求，使*每个url定向到同一个后端服务器，后端服务器为缓存时比较有用*。

```js
upstream backserver {
  server squid1:3128;
  server squid2:3128;
  hash $request_uri;
  hash_method crc32;
}
```

### 配置举例

```js
// 在需要使用负载均衡的server中增加
events {
  // todo
}

http {
  upstream backserver{
    ip_hash;
    server 127.0.0.1:9090 down;  # (down 表示当前的server暂时不参与负载)
    server 127.0.0.1:8080 weight=2; # (weight 默认为1.weight越大，负载的权重就越大)
    server 127.0.0.1:6060;
    server 127.0.0.1:7070 backup; # (其它所有的非backup机器down或者忙的时候，请求backup机器)
  }

  server {
    listen 88;
    server_name localhost;

    proxy_pass http://backserver/;

    location / {
      root html;
      autoindex on;
    }
  }
}

```

## nginx 之 proxy_pass详解
在nginx中配置proxy_pass代理转发时，如果在proxy_pass后面的url加/，表示绝对根路径；如果没有/，表示相对路径，把匹配的路径部分也给代理走。
 
*目标url为: proxy_pass指定的目标域名/路径 + uri移除已匹配路径后的剩余路径*

假设下面四种情况分别用 http://192.168.1.1/proxy/test.html 进行访问。
 
 
第一种：
```js
location /proxy/ {
    proxy_pass http://127.0.0.1/;
}
```
代理到URL：http://127.0.0.1/test.html
 
 
第二种（相对于第一种，最后少一个 / ）
```js
location /proxy/ {
    proxy_pass http://127.0.0.1;
}
```
代理到URL：http://127.0.0.1/proxy/test.html
 
 
第三种：
```js
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa/;
}
```
代理到URL：http://127.0.0.1/aaa/test.html
 
 
第四种（相对于第三种，最后少一个 / ）
```js
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa;
}
```
代理到URL：http://127.0.0.1/aaatest.html

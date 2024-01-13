# Nginx 和 PHP 的配置

> 原文地址[Nginx 和 PHP 的配置 - 知乎](https://zhuanlan.zhihu.com/p/97208252)

> 采用 nginx+php 作为 webserver 的架构模式，在现如今运用相当广泛。然而第一步需要实现的是如何让 nginx 正确的调用 php。由于 nginx 调用 php 并不是如同调用一个静态文件那么直接简单，是需要动态执行 php 脚本。所以涉及到了对 nginx.conf 文件的配置。这一步对新手而言需要动点脑筋，对于一般的熟手而言，也有不少同学并没有搞透彻为何要如此这般配置。本文的主要内容为如何在 nginx server 中正确配置 php 调用方法，以及配置的基本原理。

## 一、nginx 配置文件修改

### 配置文件位置

Nginx 的配置文件默认位置为：`/etc/nginx/nginx.conf`

在我的环境中 `nginx.conf` 在 `/etc/nginx/nginx.conf`

使用 vim 打开文件 nginx.conf

```php
vim /etc/nginx/nginx.conf
```

### 配置文件分析

```php
# nginx运行的用户名
user nginx;
# nginx启动进程,通常设置成和cpu的数量相等，这里为自动
worker_processes auto;

# errorlog文件位置
error_log /var/log/nginx/error.log;
# pid文件地址，记录了nginx的pid，方便进程管理
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
# 用来加载其他动态模块的配置
include /usr/share/nginx/modules/*.conf;

# 工作模式和连接数上限
events {
    # 每个worker_processes的最大并发链接数
    # 并发总数：worker_processes*worker_connections
    worker_connections 1024;
}

# 与提供http服务相关的一些配置参数类似的还有mail
http {
    # 设置日志的格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # access_log记录访问的用户、页面、浏览器、ip和其他的访问信息
    access_log  /var/log/nginx/access.log  main;

    # 这部分下面会单独解释
    # 设置nginx是否使用sendfile函数输出文件
    sendfile            on;
    # 数据包最大时发包(使用Nagle算法)
    tcp_nopush          on;
    # 立刻发送数据包(禁用Nagle算法)
    tcp_nodelay         on;
    # 链接超时时间
    keepalive_timeout   65;
    # 这个我也不清楚...
    types_hash_max_size 2048;

    # 引入文件扩展名与文件类型映射表
    include             /etc/nginx/mime.types;
    # 默认文件类型
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    # http服务上支持若干虚拟主机。
    # 每个虚拟主机一个对应的server配置项
    # 配置项里面包含该虚拟主机相关的配置。
    server {
        # 端口
        listen       80 default_server;
        listen       [::]:80 default_server;
        # 访问的域名
        server_name  _;
        # 默认网站根目录（www目录）
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.

        include /etc/nginx/default.d/*.conf;

        # 默认请求
        location / {
        }

        # 错误页(404)
        error_page 404 /404.html;
            location = /40x.html {
        }

        # 错误页(50X)
        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

### 要点说明

1、关于 error_log 可以设置 log 的类型(记录什么级别的信息)有：debug、info、notice、warn、error、crit 几种

2、关于 sendfile  
一般的网络传输过程  
硬盘 >> kernel buffer >> user buffer>> kernel socket buffer >>协议栈  
使用 sendfile 后  
硬盘 >> kernel buffer (快速拷贝到 kernelsocket buffer) >>协议栈  
可以显著提高传输性能。

3、tcp_nopush 和 tcp_nodelay  
tcp_nopush 只有在启用了 sendfile 时才起作用，  
在启用 tcp_nopush 后，程序接收到了数据包后不会马上发出，而是等待数据包最大时一次性发出，可以缓解网络拥堵。(Nagle 化)  
相反 tcp_nodelay 则是立即发出数据包.

### php fastcgi 配置

分析完了配置文件后开始配置环境。

因为只是配置 PHP 的服务器，而且只使用一个端口所以只需要改动 server 部分

在 vim 中点击‘i’进入编辑模式

```php
server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        # 这里改动了，也可以写你的域名
        server_name  192.168.17.26;

        # 默认网站根目录（www目录）
        root         /var/www/;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            # 这里改动了 定义首页索引文件的名称
            index index.php index.html index.htm;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }

        # 这里新加的
        # PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI协议默认配置.
        # Fastcgi服务器和程序(PHP,Python)沟通的协议.
        location ~ \.php$ {
            # 设置监听端口
            fastcgi_pass   127.0.0.1:9000;
            # 设置nginx的默认首页文件(上面已经设置过了，可以删除)
            fastcgi_index  index.php;
            # 设置脚本文件请求的路径
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            # 引入fastcgi的配置文件
            include        fastcgi_params;
        }
    }
```

修改完成后将 vim 编辑器切换到一般一半模式(Esc),然后输入:wq 保存退出。

之后重启 Nginx 服务

```php
service nginx restart
```

以上就配置成功了，但是上面的配置只是 nginx 配置部分，更多的内容需要继续学习。

### 测试

我们可以通过下面的方法判断 Nginx 配置是否成功。

在 Nginx 的网站根目录(/var/www/)下创建一个 php 文件，随便起名我的是 php_info.php

内容如下：

```text
<?php

    // 顺便可以看一下php的扩展全不全
    phpinfo();
```

进入你的网站看看能不能打开文件  
你的 ip/文件名 例如：192.168.17.26/php_info.php

![](https://pic3.zhimg.com/v2-3c25ba540c621c8ac2511b726e6c9b5a_r.jpg)

ok,我们可以看到配置成功了。

## 二、nginx+php 运行原理

上边我们已经配置成功了，现在我们来看下具体的原理。

首先简单的讲一讲原理，目前主流的 nginx+php 的运行原理如下：  
1、nginx 的`worker进程`直接管理每一个请求到 nginx 的网络请求。

2、对于 php 而言，由于在整个网络请求的过程中 php 是一个 cgi 程序的角色，所以采用名为`php-fpm的进程管理程序`来对这些被请求的 php 程序进行管理。php-fpm 程序也如同 nginx 一样，需要监听端口，并且有 master 和 worker 进程。worker 进程直接管理每一个 php 进程。

3、关于 fastcgi：fastcgi 是一种进程管理器，管理 cgi 进程。市面上有多种实现了 fastcgi 功能的进程管理器，php-fpm 就是其中的一种。再提一点，php-fpm 作为一种 fast-cgi 进程管理服务，会监听端口，`一般默认监听9000端口，并且是监听本机`，也就是只接收来自本机的端口请求，所以我们通常输入命令 netstat -nlpt|grep php-fpm 会得到：  
tcp 0 0 127.0.0.1:9000 0.0.0.0:\* LISTEN 1057/php-fpm  
这里的 127.0.0.1:9000 就是监听本机 9000 端口的意思。

4、关于 fastcgi 的配置文件，目前 fastcgi 的配置文件一般放在 nginx.conf 同级目录下，配置文件形式，一般有两种：fastcgi.conf 和 fastcgi_params。不同的 nginx 版本会有不同的配置文件，这两个配置文件有一个非常重要的区别：fastcgi_parames 文件中缺少下列配置：  
fastcgi_param SCRIPT_FILENAME fastcgi_script_name;  
我们可以打开 fastcgi_parames 文件加上上述行，也可以在要使用配置的地方动态添加。使得该配置生效。

5、`当需要处理php请求时，nginx的worker进程会将请求移交给php-fpm的worker进程进行处理，也就是最开头所说的nginx调用了php，其实严格得讲是nginx间接调用php`。

了解了上面的这五个简单原理，在 nginx 中配置 php 调用方法就变得易如反掌。

配置文件详解：

```php
server {
    listen       8011;
    server_name  test.cn;
    location ~ \.php?.*$ {
        root           /share/test;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

1、第一个大括号 server{ }：不必多说，代表一个独立的 server，  
2、listen 8011：代表该 server 监听 8011 端口  
3、location ~ .php?.\*${ }：代表一个能匹配对应 uri 的 location，用于匹配一类 uri，并对所匹配的 uri 请求做自定义的逻辑、配置。这里的 location，匹配了所有带.php 的 uri 请求，例如：[http://192.168.244.128](http://192.168.244.128/):8011/test.php/asdasd [http://192.168.244.128](http://192.168.244.128/):8011/index.php 等  
4、root /share/test：请求资源根目录，告诉匹配到该 location 下的 uri 到/share/teset 文件夹下去寻找同名资源。  
5、fastcgi_pass 127.0.0.1:9000：这行开始是本文的重点：这行代码的意思是，将进入到该 location 内的 uri 请求看做是 cgi 程序，并将请求发送到 9000 端口，交由 php-fpm 处理。  
6、fastcgi_param SCRIPT_FILENAME fastcgi_script_name; ：这行配置意思是：动态添加了一行 fastcgi 配置，配置内容为 SCRIPT_FILENAME，告知管理进程，cgi 脚本名称。由于我的 nginx 中只有 fastcgi_params 文件，没有 fastcgi.conf 文件，所以要使 php-fpm 知道 SCRIPT_FILENAME 的具体值，就必须要动态的添加这行配置。  
7、include fastcgi_params; 引入 fastcgi 配置文件  
以上就是最简洁版的 nginx 启动 php 脚本的最简配置，当重启 nginx 之后，在/share/test 目录下创建一个 xx.php 文件，输入<?php echo "hello world"; ?>保存，然后在浏览器中访问 localhost:8011/xx.php 就可以在网页上显示 hello world 了。

## 三、外网访问内网设置

外网 IP：[http://58.62.21.107](http://58.62.21.107/):8382 映射内网服务器 IP 192.168.17.56 的 82 端口，即：192.168.17.56:82,需要在`nginx.conf` 配置文件中开放 82 端口给 外网访问，即下面的配置：

```php
[root@ceshi www]# cat /etc/nginx/nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       82 default_server;   # 服务器端口，和外网映射的需保持一致
        listen       [::]:82 default_server; # 服务器端口，和外网映射的需保持一致
        server_name  192.168.17.56;
        root         /data/www/;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }


        # PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI协议默认配置.
        # Fastcgi服务器和程序(PHP,Python)沟通的协议.
        location ~ \.php$ {
            # 设置监听端口
            fastcgi_pass   127.0.0.1:9000;
            # 设置nginx的默认首页文件(上面已经设置过了，可以删除)
            fastcgi_index  index.php;
            # 设置脚本文件请求的路径
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            # 引入fastcgi的配置文件
            include        fastcgi_params;
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
```

> **以上内容希望帮助到大家，**很多 PHPer 在进阶的时候总会遇到一些问题和瓶颈，业务代码写多了没有方向感，不知道该从那里入手去提升，对此我整理了一些资料，包括但不限于：分布式架构、高可扩展、高性能、高并发、服务器性能调优、TP6，laravel，YII2，Redis，Swoole、Swoft、Kafka、Mysql 优化、shell 脚本、Docker、微服务、Nginx 等多个知识点高级进阶干货需要的可以免费分享给大家**，需要[请戳这里链接](https://shimo.im/docs/KcrgrdtVcJWVGG6D/read)** **_或者_** **知乎专栏**

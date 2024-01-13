# Nginx 如何使用 FastCGI

> 原文地址[Nginx 如何使用 FastCGI_nginx fastcgi-CSDN 博客](https://blog.csdn.net/ArtAndLife/article/details/110358105)

## 一、CGI 是什么：

关于 CGI 是什么，这篇文章已经讲的非常清楚：

[《万法归宗----CGI》](https://zhuanlan.zhihu.com/p/25013398)

下面简单概括一下关于 CGI 的基本概念：

CGI = Common Gateway Interface，“通用网关接口”：

（1）“通用”，几乎所有的语言都支持 CGI，都可以拿来编写 CGI 程序；

（2）“网关”，更形象的叫法是“协议翻译机”。通常与网关输入输出两端通信使用的是不同的协议，比如一方是 HTTP，另一方可能是其他协议，比如企业内部自定义的协议等；  
CGI 程序通常部署在 Web 服务器上（[Nginx](https://so.csdn.net/so/search?q=Nginx&spm=1001.2101.3001.7020)、Apache），Web 服务器调用 CGI 程序；

（3）“接口”，接口，API。

#### 什么是接口协议：

协议是什么自不必说，通信双方或多方共同遵守的约定。

但是协议也分很多种：

二级制协议 - - - TCP/IP，协议内容是某某某字节、某某某比特位是干嘛的；

字符协议 - - - HTTP，描述第一行是干嘛的，第二行是干嘛的，没固定长度，没固定格式，按字符关键字去匹配；

这两种都是“网络协议”，描述报文内容详细语义的协议。

但是接口协议不同，接口协议一般指的是进行交换的接口间需要遵从的通信方式和要求，例如 USB、Type-C、HDMI 等。

#### CGI 是如何工作的：

CGI 程序本质上是 OS 操作系统上的一个普通的可执行的应用程序，

CGI 可以理解为 Web 服务进程（Nginx 进程、Apache 进程）与一个运行在服务器上的 CGI 进程之间的协议，CGI 会把 HTTP 请求消息中的请求头（Header）设置成进程的环境变量，把 HTTP 请求的包体设置成标准输入 STDIN，进程的标准输出设置成 HTTP 响应（包含响应头和体），即返回一个 HTML。

`所以，CGI就是 Web服务器进程（Nginx、Apache）与 CGI进程 交互 的接口，输入HTTP请求（头和体），返回HTTP响应（头和体）。`

#### CGI 与 Web 应用服务器（Server）有何区别：

Nginx 收到客户端的 HTTP 请求后有几种处理方式，对于静态资源的请求可直接返回资源给客户端，那么何时需要转发请求给应用服务器（如 Tomcat），何时需要转发请求给 CGI？

**CGI 与应用服务器的最大区别是：**

Nginx 与应用服务器之间通信使用的是 HTTP 协议，与 CGI 通信使用的标准输入输出流。

也就是说，CGI 计算后产生的结果，是可以直接使用 printf()在客户端上打印出来的（使用的标准输出流 STDOUT），这样就有一些 web 场景必须要使用 CGI，例如 leetcode、实验楼等类型的在线编译工具，用户输入一段代码后编译结果就能在页面上打印显示出来。

（至于 CGI 如何计算，这个需要开发者去编写 CGI 的业务代码。）

---

## 二、CGI 的缺点与 FastCGI 的引出：

CGI 有一大硬伤：

每次 HTTP 请求 CGI，Web 服务器都要启动一个新的进程去运行这个 CGI 程序（颇具 Unix 特色的 fork-and-excute）。  
当用户量巨大时，这样的操作会严重拖慢 Web 服务器的性能。

因此引出 FastCGI，即一个常驻的进程池，由调度器负责将传递来的 CGI 请求传递给进程处理。

所以，FastCGI 即使常驻型的 CGI。

---

## 三、在 Nginx 中如何使用 FastCGI：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201203225251681.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FydEFuZExpZmU=,size_16,color_FFFFFF,t_70#pic_center)

#### 1\. 安装 FastCGI 库：

下载安装包后解压安装：

```auto
./configure
make
make install
123
```

#### 2\. 安装 spawn-fcgi：

```auto
./configure
make
cp  /src/spawn_fcgi  /usr/local/nginx/sbin    # 拷贝spawn_fcgi可执行程序到/nginx/sbin目录下
123
```

#### 3\. 编写一个 FastCGI 的测试小程序：

```c
#include <stdio.h>
#include <fcgi_stdio.h>

int main() {
	while(FCGI_Accept() >= 0) {
		printf("Content-type: text/html\r\n");
		printf("\r\n");
		printf("<title>fast CGI Hello!</title>");
		printf("<h1>This is My CGI!</h1>");
		printf("Thank you, CGI.\n");
	}
}
123456789101112
```

编译生成可执行文件：

```auto
gcc cgi_test.c -o cgi_test -lfcgi                     //动态编译
gcc cgi_test.c -o cgi_test /usr/local/lib/libfcgi.a	  //静态编译
12
```

（本机电脑中有点问题，动态编译一直报错找不到 libfcgi.so，解决方法是在 fcgi.conf 的配置文件中指定动态链接库的位置:[动态编译解决方法](https://www.it1352.com/217780.html)）

#### 4\. 使用 spawn-fcgi 工具启动 cgi_test 程序：

cgi_test 从本质上说只是一个普通的 Linux 进程，单独的运行它（./cgi_test）不会起任何作用，因此需要借助 spawn-fcgi 去指定 cgi_test 的监听 IP 地址和端口号。

```auto
cd /usr/local/sbin
./spawn-fcgi -a 127.0.0.1 -p 9002 -f /usr/local/cgi_test
12
```

spawn-fcgi 指定 cgi_test 绑定 IP 地址 127.0.0.1、监听端口号 9002，启动程序的绝对路径所在的 cgi_test。

启动成功后会打印提示：

```auto
spawn-fcgi: child spawned successfully: PID: 5432
1
```

**注：** spawn-fcgi 命令的参数：

```auto
./spawn-fcgi -h   		# 查看所有参数，其中主要的有：

-f <path>				# filename of the fcgi-application
-a <address>			# bind to IPv4/IPv6 address
-p <port>				# bind to TCP port
12345
```

#### 5\. 编写 Nginx 的配置文件：

```auto
worker_processes 1;

events {
	worker_connections 1024;
}

http {
	include mime.types;
	default_type application/octet-stream;

	server {
		listen 9000;

		location ~\ .cgi {
			fastcgi_pass 127.0.0.1:9002;
			fastcgi_index index.cgi;
			fastcgi_param SCRIPT_FILENAME cgi$fastcgi_script_name;
			include ../conf/fastcgi_params;
		}
	}
}
123456789101112131415161718192021
```

关于配置文件中配置项的含义：

```auto
fastcgi_pass :
	# 类似于proxy_pass，也是服务器代理的功能。
	# proxy_pass指示将HTTP请求转到upstream中，fastcgi_pass则指示将请求转给后面标注的IP地址端口

fastcgi_index  index.cgi :
	# 设置了fastcgi默认使用的脚本。就是当SCRIPT_FILENAME没有命中脚本的时候，使用的就是fastcgi_index设置的脚本。

fastcgi_params:
	# 设置fastcgi请求中的参数，具体设置的东西可以在$_SERVER中获取到

12345678910
```

随后使用编写的配置文件，启动 Nginx：

```auto
./sbin/nginx -c my_conf/my_conf.conf
1
```

**如何实现 FastCGI 负载均衡：**

```auto
http {
    upstream fastcgi_end {
		server 127.0.0.1:9002 weight = 2;
		server 127.0.0.1:9005 weight = 1;
	}

	server {
		listen 9000;
		location ~\ .cgi {
			fastcgi_pass fastcgi_end;
		}
	}
}
12345678910111213
```

#### 6\. 最后，在浏览器中访问 cgi 资源进行验证：

```auto
http://127.0.0.1:9000/123.cgi
1
```

显示页面：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201203232809958.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FydEFuZExpZmU=,size_16,color_FFFFFF,t_70#pic_center)

因为 Nginx 配置文件中的策略是凡是 “.cgi” 后缀结尾的请求一律转到 CGI 程序处理，所有浏览器中输入的 URI 可以是任意名字的 CGI 文件，例如 “123.cgi”。

---

**Tips：**

**1\. Nginx 配置文件中的正则表达式：**

```auto
http {
	server {
		location ~\ .cgi {

		}
	}

	server {
		location ~\ .(mp3|mp4) {

		}
	}
}
12345678910111213
```

`~\ .cgi`表示客户端的 HTTP 请求中的 URI 凡是以 “.cgi” 结尾的文件，都转到这个本 location 指示的服务器资源上去；  
`~\ .(mp3|mp4)`表示以 “.mp3” 或者 “.mp4” 后缀结尾的请求。

**2\. 网关和路由器的区别：**

简而言之，连接两个网络的设备，都是网关。

网关是一个大的概念，不具体特指一类产品，只要连接两个不同网络的设备都可以叫网关，路由器可以实现网关的功能。所谓网关，可以是路由器、三层交换机、防火墙等。

---

遗留问题：

FastCGI 内部的工作原理是什么？  
CGI 都提供哪些更高级的功能？如何编写一个更复杂的 CGI 程序？

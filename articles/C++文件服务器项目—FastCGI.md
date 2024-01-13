# C++文件服务器项目—FastCGI

> 原文地址[C++文件服务器项目—FastCGI—4 - 掘金](https://juejin.cn/post/7140874802205573128?searchId=202311152159546B91992401BA91F8A8BE)

# 前言

本文重点介绍 FastCGI 的概念、如何编写 FastCGI 程序，以及 nginx 如何配合 fastCGI 使用。源码地址：[gopherWxf git](https://github.com/gopherWxf/c-c-linux-LearningCode/tree/master/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%A1%B9%E7%9B%AE "https://github.com/gopherWxf/c-c-linux-LearningCode/tree/master/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%A1%B9%E7%9B%AE")

# 1\. CGI 概念理解

**CGI：通用网关接口**（**C**ommon **G**ateway **I**nterface/**CGI**）**描述了客户端和服务器程序之间传输数据的一种标准**，可以让一个客户端，从网页浏览器向执行在网络服务器上的程序请求数据。CGI 独立于任何语言的，CGI 程序可以用任何[脚本语言](http://zh.wikipedia.org/wiki/%E8%84%9A%E6%9C%AC%E8%AF%AD%E8%A8%80 "http://zh.wikipedia.org/wiki/%E8%84%9A%E6%9C%AC%E8%AF%AD%E8%A8%80")或者是完全独立[编程语言](http://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80 "http://zh.wikipedia.org/wiki/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80")实现，只要这个语言可以在这个系统上运行

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d91f7794b04e41e39ba95de10816b7f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```bash
http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man
```

比如上面这个 url 请求，web nginx server 是能够解析的，但是它不能处理，因为这里带了数据，是动态请求，而 nginx 只能处理静态请求。所以要把动态请求交给 CGI 去处理。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/080fa939592f44d5bcef252a7d530302~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> [http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man](http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man "http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man")
>
> 1.  用户通过浏览器访问服务器, 发送了一个请求, 请求的 url 如上
> 2.  服务器接收数据, 对接收的数据进行解析
> 3.  nginx 对于一些登录数据不知道如何处理, nginx 将数据发送给了 cgi 程序
>     -   服务器端会创建一个 CGI 进程
> 4.  CGI 进程执行
>     -   加载配置, 如果有需求加载配置文件获取数据
>     -   连接其他服务器: 比如数据库
>     -   逻辑处理:
>     -   得到处理结果, 将结果发送给服务器
>     -   退出
> 5.  服务器将 cgi 处理结果发送给客户端
>     -   每一个动态资源请求都有一个 CGI 进程
>     -   在服务器端 CGI 进程会被**频繁的创建销毁**
>     -   频繁的创建销毁 CGI 进程，服务器开销大, 效率低

# 2\. FastCGI 概念理解

fastCGI：快速通用网关接口（Fast Common Gateway Interface／FastCGI）是[通用网关接口](http://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8%E7%BD%91%E5%85%B3%E6%8E%A5%E5%8F%A3 "http://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8%E7%BD%91%E5%85%B3%E6%8E%A5%E5%8F%A3")（CGI）的改进，描述了客户端和服务器程序之间传输数据的一种标准。==FastCGI 致力于减少 Web 服务器**与**[**CGI**](http://zh.wikipedia.org/wiki/CGI "http://zh.wikipedia.org/wiki/CGI")[**程式**](http://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BC%8F "http://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BC%8F")**之间互动的开销，从而使服务器可以同时处理更多的 Web**请求==。与为每个请求创建一个新的进程不同，FastCGI 使用**持续的进程来处理一连串的请求**。这些进程由 FastCGI 进程管理器管理，而不是 web 服务器。

**fastCGI 与 CGI 的区别:** CGI 就是所谓的短生存期应用程序，FastCGI 就是所谓的长生存期应用程序。FastCGI 像是一个常驻(long-live)型的 CGI，它可以一直执行着，不会每次都要花费时间去 fork 一次。说人话：CGI 是来一个请求就 fork 一个进程，而 fastCGI 只会 fork 一个进程，多个请求都使用同一个进程。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fbaf0bb63fd4fc19942752d14d055d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> [http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man](http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man "http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man")
>
> 1.  用户通过浏览器访问服务器, 发送了一个请求, 请求的 url 如上
> 2.  服务器接收数据, 对接收的数据进行解析
> 3.  nginx 对于一些登录数据不知道如何处理, nginx 将数据发送给了 fastcgi 程序
>     -   通过本地套接字
>     -   网络通信的方式
> 4.  fastCGI 程序如何启动
>     -   不是由 web 服务器直接启动
>     -   通过一个 fastCGI 进程管理器启动
> 5.  fastcgi 启动
>     -   加载配置 - 可选
>     -   连接服务器 - 数据库
>     -   循环
>         -   服务器有请求 -> 处理
>         -   没有请求 -> 阻塞等待
> 6.  服务器将 fastCGI 的处理结果发送给客户端
>     -   通过本地套接字
>     -   网络通信的方式

# 3\. FastCGI 和 spawn-fcgi 安装

`fastCGI是一个框架`，它给我们提供了 api，它内部遵循 cgi 协议，以及与服务器通信的细节隐藏了。我们只需要遵循 fastCGI 的 api 接口去写程序，就可以与 nginx 配合使用了。

`spawn-fcgi是FastCGI的进程管理器`，也就是说我们编写的 FastCGI 程序，是由 spawn-fcgi 去启动，而不是由 nginx web 服务器去启动。

`spawn-fcgi-1.6.4.tar.gz`与`fcgi-2.4.1-SNAP-0910052249.tar.gz`都在前言的 git 源码处，需要的可以进 git hub 下载。

1.  安装 fastCGI

```bash
tar zxvf fcgi-2.4.1-SNAP-0910052249.tar.gz
cd fcgi-2.4.1-SNAP-0910052249/
./configure
make
make install
ldconfig
```

```bash
make
# make的时候如果出现EOF的错误，是因为这个cpp文件没有添加头文件
- fcgio.cpp:50:14: error: 'EOF' was not declared in this scope
- 没有包含对应的头文件:
	- stdio.h - c
	- cstdio -> c++
vi ./libfcgi/fcgio.cpp
#include<cstdio>
```

2.  安装 spawn-fcgi

```bash
tar -zxvf spawn-fcgi-1.6.4.tar.gz
cd spawn-fcgi-1.6.4/
./configure
make
make install
ldconfig
```

# 4\. FastCGI 和 Nginx 的关系

nginx 不能像 apache 那样直接执行外部可执行程序，但 nginx 可以作为代理服务器，将请求转发给后端服务器，这也是 nginx 的主要作用之一。其中 nginx 就支持 FastCGI 代理，接收客户端的请求，然后将请求转发给后端 fastcgi 进程。后文会介绍如何使用 C/C++编写 cgi/fastcgi，并部署到 nginx 中。

通过前面的介绍知道，fastcgi 进程由 FastCGI 进程管理器管理，而不是 nginx。这样就需要一个 FastCGI 管理，管理我们编写 fastcgi 程序。我们使用 spawn-fcgi 作为 FastCGI 进程管理器。

spawn-fcgi 是一个通用的 FastCGI 进程管理器，简单小巧，原先是属于 lighttpd 的一部分，后来由于使用比较广泛，所以就迁移出来作为独立项目了。spawn-fcgi 使用 pre-fork 模型，==功能主要是打开监听端口，绑定地址，然后 fork-and-exec 创建我们编写的 fastcgi 应用程序进程，退出完成工作==。fastcgi 应用程序初始化，然后进入死循环侦听 socket 的连接请求。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf67c349f41b4250874b1f5f9a4fbd5e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> [http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man](http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man "http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man")
>
> -   客户端访问, 发送请求
> -   nginx web 服务器, 无法处理用户提交的数据，将数据转发给 spawn-fcgi
> -   spawn-fcgi - 通信过程中的服务器角色
>     -   被动接收数据
>     -   在 spawn-fcgi 启动的时候给其绑定 IP 和端口
> -   fastCGI 程序
>     -   程序猿写的 -> login.c -> 可执行程序 login
>     -   使用 spawn-fcgi 进程管理器启动 login 程序, 得到一进程
>         -   login 进程处理请求数据
>         -   处理完后数据发送给 nginx
>         -   阻塞等待下一个请求的到来

# 5\. Nginx 数据转发-修改配置文件

nginx 的数据转发，需要修改 nginx 的配置文件 nginx.conf（/usr/local/nginx/conf）

```bash
通过请求的url http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man 转换为一个指令:
	- 去掉协议
	- 去掉域名/IP + 端口
	- 如果尾部有文件名 去掉
	- 去掉 ? + 后边的字符串
	- 剩下的就是服务器要处理的指令: /login
location /login
{
    # 转发这个数据, fastCGI进程
    fastcgi_pass 地址信息:端口;
    # fastcgi.conf 和nginx.conf在同一级目录: /usr/local/nginx/conf
    # 这个文件中定义了一些http通信的时候用到环境变量, nginx赋值的
    include fastcgi.conf;
}
地址信息:
	- localhost
	- 127.0.0.1
	- 192.168.1.100
端口: 找一个空闲的没有被占用的端口即可
```

# 6\. spawn-fcgi 如何启动

```bash
# 前提条件: 程序猿的fastCGI程序已经编写完毕 -> 可执行文件 login
spawn-fcgi -a IP地址 -p 端口 -f ./fastcgi可执行程序login
 - IP地址: 应该和nginx的 fastcgi_pass 配置项对应
 	- nginx: localhost       ->   IP: 127.0.0.1
	- nginx: 127.0.0.1	     ->   IP: 127.0.0.1
	- nginx: 192.168.109.101 ->   IP: 192.168.109.101
- 端口:
	应该和nginx的 fastcgi_pass 中的端口一致
```

# 7\. FastCGI 程序怎么写

## 7.1 echo.c 代码阅读与分析

进入 FastCGI 源码目录下的 example 目录，看 echo.c 是如何编写的

```bash
root@wxf:/source_code_dir/fcgi-2.4.1-SNAP-0910052249/examples# pwd
/source_code_dir/fcgi-2.4.1-SNAP-0910052249/examples
root@wxf:/source_code_dir/fcgi-2.4.1-SNAP-0910052249/examples# ls
authorizer      echo.c        echo.mak   echo-x.o    Makefile.am  size.o
authorizer.c    echo-cpp      echo.o     log-dump    Makefile.in  threaded
authorizer.mak  echo-cpp.cpp  echo-x     log-dump.c  size         threaded.c
authorizer.o    echo-cpp.mak  echo-x.c   log-dump.o  size.c       threaded-threaded.o
echo            echo-cpp.o    echox.mak  Makefile    size.mak

```

-   echo.c

```cpp
#ifndef lint
static const char rcsid[] = "$Id: echo.c,v 1.5 1999/07/28 00:29:37 roberts Exp $";
#endif /* not lint */

#include "fcgi_config.h"
#include <stdlib.h>

#ifdef HAVE_UNISTD_H
#include <unistd.h>
#endif

#ifdef _WIN32
#include <process.h>
#else
extern char **environ;
#endif

#include "fcgi_stdio.h"

static void PrintEnv(char *label, char **envp) {
    printf("%s:<br>\n<pre>\n", label);
    for (; *envp != NULL; envp++) {
        printf("%s\n", *envp);
    }
    printf("</pre><p>\n");
}

int main() {
    char **initialEnv = environ;
    int count = 0;

    while (FCGI_Accept() >= 0) {
        char *contentLength = getenv("CONTENT_LENGTH");
        int len;

        printf("Content-type: text/html\r\n"
               "\r\n"
               "<title>FastCGI echo</title>"
               "<h1>FastCGI echo</h1>\n"
               "Request number %d,  Process ID: %d<p>\n", ++count, getpid());

        if (contentLength != NULL) {
            len = strtol(contentLength, NULL, 10);
        }
        else {
            len = 0;
        }

        if (len <= 0) {
            printf("No data from standard input.<p>\n");
        }
        else {
            int i, ch;

            printf("Standard input:<br>\n<pre>\n");
            for (i = 0; i < len; i++) {
                if ((ch = getchar()) < 0) {
                    printf("Error: Not enough bytes received on standard input<p>\n");
                    break;
                }
                putchar(ch);
            }
            printf("\n</pre><p>\n");
        }

        PrintEnv("Request environment", environ);
        PrintEnv("Initial environment", initialEnv);
    } /* while */

    return 0;
}
```

`char **environ`是一个全局变量,在`#include <unistd.h>`中，它其实就是存储了 linux bash 中输入 env 打印出来的环境变量。所以 PrintEnv 这个函数就是把所有的键值对打印出来。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e27bff00775942228b4f4cccfb902abb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

程序显示往标准输出里面打印了这个 kv

```bash
printf("Content-type: text/html\r\n");
```

`while (FCGI_Accept() >= 0)`符合上文的分析，如果有请求来了那么就会进入循环。

通过环境变量，获取 http 请求报文头中这个字段的值。`CONTENT_LENGTH`其实就在`fastcgi.conf`中,在上文修改配置文件的时候，被 include 了。

```bash
char *contentLength = getenv("CONTENT_LENGTH");
```

然后从标准输入读这个长度的数据，再写入标准输出。

```cpp
for (i = 0; i < len; i++) {
    if ((ch = getchar()) < 0) {
        printf("Error: Not enough bytes received on standard input<p>\n");
        break;
    }
    putchar(ch);
}
```

## 7.2 fastCGI 接收与发送数据

从上文我们发现，该程序从标准输入读数据，往标准输出写数据。很明显，这里是做了重定向的。表面操作的是终端，实际被重定向到了内部被隐藏的 fd。

```bash
dup2(fd,STDIN_FILENO)
dup2(fd,STDOUT_FILENO)
```

## 7.3 fastCGI 程序编写流程与思路

```cpp
// http://localhost/login?user=zhang3&passwd=123456&age=12&sex=man
// 要包含的头文件
#include "fcgi_config.h" // 可选
#include "fcgi_stdio.h" // 必须的, 编译的时候找不到这个头文件, find->path , gcc -I
// 编写代码的流程
int main()
{
    // FCGI_Accept()是一个阻塞函数, nginx给fastcgi程序发送数据的时候解除阻塞
    while (FCGI_Accept() >= 0)
    {
        // 1. 接收数据
        	// 1.1 get方式提交数据 - 数据在请求行的第二部分，QUERY_STRING直接获取数据
        	// user=zhang3&passwd=123456&age=12&sex=man
        	char *text = getenv("QUERY_STRING");

        	// 1.2 post方式提交数据，只能获取数据长度，需要手动读出来
        	char *contentLength = getenv("CONTENT_LENGTH");
        	// 根据长度大小判断是否需要循环读-read

        // 2. 按照业务流程进行处理
        ...
        ...
        // 3. 将处理结果发送给nginx
        	// 3.1 数据回发的时候, 需要告诉nginx处理结果的格式 - 假设是html格式。只有Content-type需要指定，别的头部字段自动，不用我们管
        	// 要放在处理结果之前发送该kv字段
        	//Content-type后续会介绍
        	printf("Content-type: text/html\r\n");

			// 注意\r\n ,别忘了空行！
			printf("\r\n");

        	// 3.2 再将处理结果回发
        	printf("<html>处理结果</html>");
    }
}
```

## 7.4 实现一个 fastCGI 程序并测试

-   第一步：修改 Nginx 数据转发的配置文件

```bash
    location /upload/UploadAction {
        fastcgi_pass 192.168.109.101:10000;
        include fastcgi.conf;
    }
```

-   第二步：编写 fastCGI 程序

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "fcgi_stdio.h"

int main(int argc, char *argv[]) {
    int count = 0;
    while (FCGI_Accept() >= 0) {
        printf("Content-type: text/html\r\n");

        printf("\r\n");

        printf("<title>Fast CGI Hello WXF!</title>");
        printf("<h1>Fast CGI Hello WXF!</h1>");
        printf("Request number %d running on host <i>%s</i>\n", ++count, getenv("SERVER_NAME"));
    }
    return 0;
}
```

-   第三步：启动 fastcgi 进程管理器

```bash
root@wxf:/source_code_dir# gcc -o test fcgi.c -lfcgi
root@wxf:/source_code_dir# spawn-fcgi -a 192.168.109.101 -p 10000 -f ./test
spawn-fcgi: child spawned successfully: PID: 14487
```

-   第四步：测试

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed38f787ff664860aaeae7704b50b048~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

# 8\. 部署一个能够上传文件的网页

## 8.1 上传文件夹并修改 Nginx 的配置文件

至于为什么放在/usr/local/nginx/目录下不再赘述，不懂的读者可以翻阅我上一篇 nginx 的文章。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f289c85bb81b42d1a50ef82263ac200f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```bash
location / {
    root   zyFile2;
    index  index.html index.htm;
}
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99228f752f6a42e9a4a3457d0f7841f9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be0de860ca6e483ab0c4a7f125cec782~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 8.2 修改配置文件，实现数据转发

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79583a762c39452cb7623fc99f0083d6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

为什么是 404 Not Found？通过 html 的源码，我们发现发送的是 post 请求，并且路径是`/upload/UploadAction`。这意味着带数据的动态请求，nginx 是处理不了的，所以这个时候我们需要配置数据转发。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a97b7f2f5df47538153db8aca7bc76b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```bash
location /upload/UploadAction {
    fastcgi_pass 192.168.109.101:10000;
    include fastcgi.conf;
}
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f799fa0322e48c3959ca527e9c76bd9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)   `An error occurred`是因为虽然我们配置了数据转发，但是我们并没有启动 fastcgi 程序去处理这个请求。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0defe5a2081f4112b67777808affcb4e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

现在我们使用之前介绍过的 echo.c 当作 fastcgi 程序，实现回发的功能看看。

```cpp
root@wxf:/source_code_dir# gcc -o echo echo.c -lfcgi
root@wxf:/source_code_dir# spawn-fcgi -a 192.168.109.101 -p 10000 -f ./echo
spawn-fcgi: child spawned successfully: PID: 14762
```

注意这里不要上传太大的图片，因为我们回发的类型是`Content-type: text/html`，并不符合图片的类型。可以看到这里我们`上传的流程`成功了,我们并没有编写上传的代码，只是做了个 echo 而已。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c1169d2ba764667bb2968b1b3045cea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 8.3 reference & libfcgi.so.0 => not found 问题解决

没有对应的动态库，那么加上即可

```bash
root@wxf:/source_code_dir# gcc -o echo echo.c
/tmp/ccghTkS5.o: In function `PrintEnv':
echo.c:(.text+0x24): undefined reference to `FCGI_printf'
echo.c:(.text+0x41): undefined reference to `FCGI_printf'
echo.c:(.text+0x63): undefined reference to `FCGI_printf'
/tmp/ccghTkS5.o: In function `main':
echo.c:(.text+0xb6): undefined reference to `FCGI_printf'
echo.c:(.text+0xf6): undefined reference to `FCGI_printf'
/tmp/ccghTkS5.o:echo.c:(.text+0x109): more undefined references to `FCGI_printf' follow
/tmp/ccghTkS5.o: In function `main':
echo.c:(.text+0x117): undefined reference to `FCGI_getchar'
echo.c:(.text+0x131): undefined reference to `FCGI_printf'
echo.c:(.text+0x13d): undefined reference to `FCGI_putchar'
echo.c:(.text+0x15a): undefined reference to `FCGI_printf'
echo.c:(.text+0x188): undefined reference to `FCGI_Accept'
collect2: error: ld returned 1 exit status
```

```bash
root@wxf:/source_code_dir# cd fcgi-2.4.1-SNAP-0910052249/
root@wxf:/source_code_dir/fcgi-2.4.1-SNAP-0910052249# find ./ -name "lib*.so"
./libfcgi/.libs/libfcgi++.so
./libfcgi/.libs/libfcgi.so
root@wxf:/source_code_dir/fcgi-2.4.1-SNAP-0910052249# cd ..
root@wxf:/source_code_dir# gcc -o echo echo.c -lfcgi
```

`ldd echo`查看程序启动之后需要加载的动态库，如果发现 not found，那么就有问题了。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/725c9bbdb4f84894bbc9dd2c58bfb429~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)    使用 find 查找这个动态库的位置

```bash
root@wxf:/source_code_dir# find / -name "libfcgi.so"
/usr/local/lib/libfcgi.so
/source_code_dir/fcgi-2.4.1-SNAP-0910052249/libfcgi/.libs/libfcgi.so
```

我们需要让程序能够连接到这个动态库，就把这个/usr/local/lib 这个目录放到下面的配置文件，并用 ldconfig 更新。

```bash
root@wxf:/source_code_dir# vi /etc/ld.so.conf
...
root@wxf:/source_code_dir# ldconfig
```

上述问题发生的原因是因为，`手动安装这些源码make install之后，没有输入ldconfig导致的。`

# 9\. 其他知识点

## 9.1 HTTP 环境变量 -> fastcgi.conf

上文测试的 echo 程序回发了两个环境变量，`Request environment`和`Initial environment`。分别是 HTTP 请求的环境变量和 fastcgi 系统的环境变量。

`Request environment`中的环境变量都在`fastcgi.conf`中记录着。

`Initial environment`中的环境变量都在`bash： env` 打印出来的一样。

```bash
Request number 2, Process ID: 14762
Standard input:
------WebKitFormBoundaryM3hhJcyUYWxGGdPb
Content-Disposition: form-data; name="file"; filename="100k.png"
Content-Type: image/png

�PNG


IHDRdN)IDAT8c���?Y��,] M�:	�h��$FS�hJ�)�5��IEND�B`�
------WebKitFormBoundaryM3hhJcyUYWxGGdPb
Content-Disposition: form-data; name="tailor"

false
------WebKitFormBoundaryM3hhJcyUYWxGGdPb--

Request environment:
FCGI_ROLE=RESPONDER
SCRIPT_FILENAME=/usr/local/nginx/html/upload/UploadAction
QUERY_STRING=
REQUEST_METHOD=POST
CONTENT_TYPE=multipart/form-data; boundary=----WebKitFormBoundaryM3hhJcyUYWxGGdPb
CONTENT_LENGTH=377
SCRIPT_NAME=/upload/UploadAction
REQUEST_URI=/upload/UploadAction
DOCUMENT_URI=/upload/UploadAction
DOCUMENT_ROOT=/usr/local/nginx/html
SERVER_PROTOCOL=HTTP/1.1
REQUEST_SCHEME=http
GATEWAY_INTERFACE=CGI/1.1
SERVER_SOFTWARE=nginx/1.16.1
REMOTE_ADDR=192.168.109.1
REMOTE_PORT=55644
SERVER_ADDR=192.168.109.101
SERVER_PORT=80
SERVER_NAME=localhost
REDIRECT_STATUS=200
HTTP_HOST=192.168.109.101
HTTP_CONNECTION=keep-alive
HTTP_CONTENT_LENGTH=377
HTTP_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36
HTTP_CONTENT_TYPE=multipart/form-data; boundary=----WebKitFormBoundaryM3hhJcyUYWxGGdPb
HTTP_ACCEPT=*/*
HTTP_ORIGIN=http://192.168.109.101
HTTP_REFERER=http://192.168.109.101/demo.html
HTTP_ACCEPT_ENCODING=gzip, deflate
HTTP_ACCEPT_LANGUAGE=zh-CN,zh;q=0.9
Initial environment:
LESSOPEN=| /usr/bin/lesspipe %s
MAIL=/var/mail/root
USER=root
SSH_CLIENT=192.168.109.1 61011 22
SHLVL=1
OLDPWD=/usr/local/nginx/conf
HOME=/root
SSH_TTY=/dev/pts/0
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus
LOGNAME=root
_=/usr/local/bin/spawn-fcgi
XDG_SESSION_ID=1
TERM=xterm
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
XDG_RUNTIME_DIR=/run/user/0
DISPLAY=localhost:10.0
LANG=en_US.UTF-8
LS_COLORS=rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:
SHELL=/bin/bash
LESSCLOSE=/usr/bin/lesspipe %s %s
PWD=/source_code_dir
SSH_CONNECTION=192.168.109.1 61011 192.168.109.101 22
XDG_DATA_DIRS=/usr/local/share:/usr/share:/var/lib/snapd/desktop
```

最重要的就是下面四个。如果是 get 请求，则不会有 CONTENT_LENGTH 字段，参数在 QUERY_STRING 中。如果是 post 请求，则有 CONTENT_LENGTH 字段。

```bash
QUERY_STRING
REQUEST_METHOD
CONTENT_TYPE
CONTENT_LENGTH
```

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f09d89978ca4361b2df2b9eece0cbd4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

-   **fastCGI 环境变量 - fastcgi.conf**

    | 环境变量           | 说明                                               |
    | ------------------ | -------------------------------------------------- |
    | SCRIPT_FILENAME    | 脚本文件请求的路径                                 |
    | **QUERY_STRING**   | 请求的参数;如?app=123                              |
    | **REQUEST_METHOD** | 请求的动作(GET,POST)                               |
    | **CONTENT_TYPE**   | 请求头中的 Content-Type 字段                       |
    | **CONTENT_LENGTH** | 请求头中的 Content-length 字段                     |
    | SCRIPT_NAME        | 脚本名称                                           |
    | REQUEST_URI        | 请求的地址不带参数                                 |
    | DOCUMENT_URI       | 与$uri 相同                                        |
    | DOCUMENT_ROOT      | 网站的根目录。在 server 配置中 root 指令中指定的值 |
    | SERVER_PROTOCOL    | 请求使用的协议，通常是 HTTP/1.0 或 HTTP/1.1        |
    | GATEWAY_INTERFACE  | cgi 版本                                           |
    | SERVER_SOFTWARE    | nginx 版本号，可修改、隐藏                         |
    | REMOTE_ADDR        | 客户端 IP                                          |
    | REMOTE_PORT        | 客户端端口                                         |
    | SERVER_ADDR        | 服务器 IP 地址                                     |
    | SERVER_PORT        | 服务器端口                                         |
    | SERVER_NAME        | 服务器名，域名在 server 配置中指定的 server_name   |

## 9.2 常用的四种 Content-Type

-   **application/x-www-form-urlencoded**

```bash
# 请求行
POST http://www.example.com HTTP/1.1
# 请求头
Content-Type: application/x-www-form-urlencoded;charset=utf-8
# 空行
# 请求数据(向服务器提交的数据)，用&做间隔，就是application/x-www-form-urlencoded格式
title=test&user=kevin&passwd=32222
```

-   **application/json**

```bash
# 请求行
POST / HTTP/1.1
# 请求头
Content-Type: application/json;charset=utf-8
# 空行
# 请求数据，如果是json格式就必须是application/json
{"title":"test","sub":[1,2,3]}
```

-   **text/xml**

```bash
# 请求行
POST / HTTP/1.1
# 请求头
Content-Type: text/xml
# 空行
<?xml version="1.0" encoding="utf8"?>
# 请求数据
<methodcall>
    <methodname color="red">examples.getStateName</methodname>
    <params>
    	<value><i4>41</i4></value>
    </params>
</methodcall>
```

-   multipart/form-data

`multipart/form-data`是传输大文件常用的一种数据格式，在数据刚开始的时候有一个分界线，这个分界线是随机生成的，在结束的时候也有一个分界线。

```bash
------WebKitFormBoundaryPpL3BfPQ4cHShsBz
```

在分界线下面还有一个`Content-Disposition`和`Content-Type`，这是对文件属性的描述。文件内容在两个分界线中间，那么用这种格式我们就可以上传多个文件了，一个文件对应一个数据块。不同的数据块都是相同的格式(Content-Disposition + Content-Type + 空行 + 文件内容)；当然也可以上传一个大文件，分为多个小数据块。 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b49fa7127840efbb8d67bc16845282~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

文件的 Content-Type 不需要我们去记后面写什么，用到的时候直接查表即可：[tool.oschina.net/commons](https://tool.oschina.net/commons "https://tool.oschina.net/commons")

```bash
# 请求行
POST / HTTP/1.1
# 请求头
Content-Type: multipart/form-data
# 空行
# 发送的数据
------WebKitFormBoundaryPpL3BfPQ4cHShsBz \r\n
Content-Disposition: form-data; name="file"; filename="1.png"
Content-Type: image/png\r\n; md5="xxxxxxxxxx"
\r\n
.............文件内容................
.............文件内容................
------WebKitFormBoundaryPpL3BfPQ4cHShsBz
Content-Disposition: form-data; name="file"; filename="2.png"
\r\n
.............文件内容................
.............文件内容................
------WebKitFormBoundaryPpL3BfPQ4cHShsBz
Content-Disposition: form-data; name="tailor"
\r\n
false
------WebKitFormBoundaryPpL3BfPQ4cHShsBz--
```

# 10\. fastCGI 总结

1.  fastCGI 是什么？

    -   运行在服务器端的代码, 帮助服务器处理客户端提交的动态请求

2.  fastCGI 干什么？

    -   nginx 服务器处理不了动态请求，fastCGI 帮助服务器处理客户端提交的动态请求

3.  fastCGI 怎么用？

    -   前提条件 fastCGI 和 nginx 部署在同一台机器上
    -   nginx 如何转发数据

        ```nginx
        # 分析出客户端请求对应的指令 -- /test
        location /test
        {
            # 转发出去
            fastcgi_pass 地址:端口;
            include fastcgi.conf;
        }
        ```

    -   fastcgi 如何接收数据

        ```shell
        # 启动, 通过spawn-fcgi启动
        spawn-fcgi -a IP -p port -f ./fcgi
        # 编写fastCGI程序的时候
         - 接收数据: 调用读终端的函数就是接收数据
         - 发送数据: 调用写终端的函数就是发送数据
        ```

    -   fastcgi 如何处理数据

        ```c
        // 编写登录的fastCgI程序
        int main()
        {
            while(FCGI_Accept() >= 0)
            {
                // 1. 接收登录信息 -> 环境变量中
                // post -> 读数据块的长度 CONTENT-LENGTH
                // get -> 从请求行的第二部分读 QUEERY_STRING
                // 2. 处理数据
                // 3. 回发结果 -> 格式假设是json
                printf("Content-type: application/json\r\n");
                printf("\r\n");
                printf("{\"status\":\"OK\"}")
            }
        }
        ```

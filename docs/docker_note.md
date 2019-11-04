docker 入门
===
简介
---
Docker 是一个开源的应用容器引擎，基于 Go 语言 并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。

Docker 架构
---
Docker 包括三个基本概念:

- 镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
- 容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（Repository）：仓库可看着一个代码控制中心，用来保存镜像。

Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。

Docker 容器通过 Docker 镜像来创建。

容器与镜像的关系类似于面向对象编程中的对象与类。
![Docker 架构](https://www.runoob.com/wp-content/uploads/2016/04/576507-docker1.png)

概念	| 说明
--------|--------
Docker 镜像(Images) | Docker 镜像是用于创建 Docker 容器的模板，比如 Ubuntu 系统。
Docker 容器(Container) | 容器是独立运行的一个或一组应用，是镜像运行时的实体。
Docker 客户端(Client) | Docker 客户端通过命令行或者其他工具使用 Docker SDK (https://docs.docker.com/develop/sdk/) 与 Docker 的守护进程通信。
Docker 主机(Host) | 一个物理或者虚拟的机器用于执行 Docker 守护进程和容器。
Docker 仓库(Registry) | Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。 Docker Hub(https://hub.docker.com) 提供了庞大的镜像集合供使用。 一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像。 通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 <仓库名>:<标签> 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 latest 作为默认标签。
Docker Machine | Docker Machine是一个简化Docker安装的命令行工具，通过一个简单的命令行即可在相应的平台上安装Docker，比如VirtualBox、 Digital Ocean、Microsoft Azure。

安装
---
```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc
# 更新包索引
sudo apt-get update
# 安装依赖包
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# 添加 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 验证是否拥有带有指纹的密钥
sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

sudo apt-key fingerprint 0EBFCD8 验证指纹

sudo apt-get update

sudo apt-get install docker-ce


#添加官方pgp
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# ubuntu14.04 需要升级内核
sudo apt-get install --install-recommends linux-generic-lts-xenial

# 测试安装成功
sudo docker run hello-world

```

使用
---
Docker 允许你在容器内运行应用程序， 使用 docker run 命令来在容器内运行一个应用程序

```shell
# 下载镜像，并执行
sudo docker run ubuntu:15.10 /bin/echo "hello world"
```

### 运行交互式的容器
通过 docker 的两个参数 -i(*允许你对容器内的标准输入 (STDIN) 进行交互*) -t(*在新容器内指定一个伪终端或终端*)，让 docker 运行的容器实现"对话"的能力

```shell
sudo docker run -i -t ubuntu:15.10 /bin/bash
```

### 启动容器（后台模式）
使用 -d(*守护进程方式*) 参数创建一个以进程方式运行的容器

> -P 将容器内部使用的网络端口映射到我们使用的主机上

```shell
# 会返回容器id
sudo docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"

# 查看运行中的容器, 可查看 container_id 和运行状态
sudo docker ps

# 查看容器内的标准输出
sudo docker logs <container_id or container_name>

# 停止容器 
sudo docker stop <container_id or container_name>

# 启动已停止的容器 
sudo docker start <container_id or container_name>

# 重启容器 
sudo docker restart <container_id or container_name>


```


**Docker 客户端** 
直接输入 `docker` , 返回docker命令的帮助信息  
`docker <command> --help` 查看具体命令的帮助信息

### 进入容器

```shell

# 进入后台运行的容器 注意： 如果从这个容器退出，会导致容器的停止。
sudo docker attach <container_id or container_name>

# 进入容器执行命令 如果从这个容器退出，不会导致容器的停止。
sudo docker exec -it <container_id or container_name> /bin/bash
```


### 导出和导入容器
```shell
sudo docker export <container_id or container_name> > docker_out/ubuntu.tar
cat docker_out/ubuntu.tar | sudo docker import - test/ubuntu:v1 # 导入为镜像 test/ubuntu
# 查看本地镜像
sudo docker images

# 也可以通过url或文件夹来导入容器
sudo docker import http://example.com/exampleimage.tgz example/imagerepo

```

### 删除容器

```shell
sudo docker ps
sudo docker rm -f <container_id>
sudo docker ps

# 下面的命令可以清理掉所有处于终止状态的容器。
sudo docker container prune
```

### 运行一个 web 应用
```shell
docker pull training/webapp  # 载入镜像

docker run -d -P training/webapp python app.py # 运行容器
# 指定端口映射关系
docker run -d -p 5000:5000 training/webapp python app.py
# 浏览器打开地址 http://localhost:32768/ 可访问python启动的web服务

docker ps # 查看我们正在运行的容器 和 端口映射
docker port <container_id> # 查看容器的端口映射到宿主机的端口号
docker logs -f <container_id> # 查看容器的标准输出
docker top <container_id> # 查看容器内部的进程
docker ps -l # 查看最后一次创建的容器
docker inspect <container_id> # 查看容器的底层信息
docker stop <container_id>
docker start <container_id>
docker restart <container_id>
docker rm <container_id> # 需先停止 再删除  或者 -f 强制删除

```

### Docker 镜像使用

当运行容器时，使用的镜像如果在本地中不存在，docker 就会自动从 docker 镜像仓库中下载，默认是从 Docker Hub 公共镜像源下载

```shell
docker images # 列出本地主机上的镜像。
docker pull <image_name:tag> # 下载镜像 镜像的版本标签默认为latest
docker search <keyword> # 到docker hub搜索镜像
docker rmi <image_name> # 删除镜像 -f 强制删除

# 更新容器，提交为自己的新镜像
docker run -it ubuntu:15.10 /bin/bash
echo hello-world > hi
exit
docker commit -m="change by me" -a="pan" <container_id>  <new_image_name:tag>
docker images


# 基于Dockerfile 创建镜像
# Dockerfile 如下
FROM    ubuntu:15.10
MAINTAINER      Fisher "fisher@sudops.com"

RUN     /bin/echo 'root:123456' |chpasswd
RUN     useradd runoob
RUN     /bin/echo 'runoob:123456' |chpasswd
RUN     /bin/echo -e "LANG=\"en_US.UTF-8\"" >/etc/default/local
EXPOSE  22
EXPOSE  80
CMD     /usr/sbin/sshd -D

docker build -t pan/ubuntu:v2 .  # -t target指定镜像名称
docker images
docker run -it pan/ubuntu:v2 /bin/bash

# 设置镜像标签
docker tag <image_id> pan/ubuntu:dev
```

### Docker 容器连接
容器中可以运行一些网络应用，要让外部也可以访问这些应用，可以通过 -P 或 -p 参数来指定端口映射

```shell
docker run -d -P training/webapp python app.py
docker run -d -p 5000:5000 training/webapp python app.py # -p 容器内部端口绑定到指定的主机端口  -P 容器内部端口随机映射到主机的高端口
docker run -d -p 127.0.0.1:5001:5000 training/webapp python app.py # 指定ip
docker run -d -p 127.0.0.1:5000:5000/udp training/webapp python app.py # 绑定udp端口
docker port <container_id> <port> # 查看容器的端口映射到主机的哪个端口

```

### Docker 容器互联
端口映射并不是唯一把 docker 连接到另一个容器的方法。
docker 有一个连接系统允许将多个容器连接在一起，共享连接信息。
docker 连接会创建一个父子关系，其中父容器可以看到子容器的信息。

```shell
docker run -d -P --name runoob training/webapp python app.py # --name 给容器命名
docker ps

# 新建网络
docker network create -d bridge test-net # -d  网络类型，有 bridge、overlay
docker network ls

```

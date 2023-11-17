# linux系统命令及shell脚本实践指南

> 运维： 平台虚拟化 和 自动化运维

> 系统目标： 高稳定性 高可用性 和 高扩展性

> 知识不能太零散，要体系化，才能形成整体认知

> 用简单、朴素的语言讲解linux系统和它的使用方法


## linux的发展历史

BSD是linux的一个重要分支  

早期unix的两大分支
- systemV
- BSD

> 1984年，Richard Stallman创建GNU项目，目标是： 开发一个完全自由的unix操作系统

> 1994年，linux加入GNU,称为GNU项目的一员

### linux的特点
linux在服务器、桌面、行业定制和嵌入式等领域都有广泛的应用

- 免费开源
  免费下载，定制开发
- 模块化程度高
  linux内核设计成5部分：
  + 进程管理
  + 进程间通信
  + 内存管理
  + 虚拟文件系统
  + 网络
- 广泛的硬件支持
  由于开源，有大批程序员贡献代码，因而有着丰富的设备驱动资源，主流硬件支持很好
- 安全稳定
  linux有很多的安全技术措施：
  + 读写权限控制
  + 带保护的子系统
  + 审计跟踪
  + 核心授权
  + ...
- 多用户和多任务
  多用户同时登录使用系统，每个用户可同时运行多个程序
- 容易移植
  linux中95%的代码都是C语言写的，C语言是平台无关的高级语言。

### linux的发行版本：

- redhat
- centOS
- ubuntu

### linux的安装

linux安装必须要有两个分区： **根分区(/) 和 swap 分区(交换分区)**，其他可以设置的分区有/boot分区，/var分区等。

> 什么是交换分区   
> 交换分区是一个特殊的分区，作用相当于window下的虚拟内存。
> 交换分区的大小一般设置为物理内存的2倍即可，太大也没什么意义

> 什么是Grub  
> Grub是一个系统引导工具，用于加载内核，从而引导系统启动

> 什么是/boot分区  
> /boot分区用于放置linux启动所需的文件，比如: kernel, initrd文件

> 什么是DHCP  
> Dynamic Host Configuration Protocol的简写，动态主机配置协议  
> 自动为网络节点上的主机分配ip地址

安装方式:
- 图形安装模式
- 字符安装模式 输入 linux text



默认打开6个虚拟终端 tty1 , tty2, ... tty6 对应快捷键 `ctrl + alt + f1 ~ f6`,  `ctrl + alt + f7` 回到图形界面

运行级别 0 ~ 6  

- 0 关机
- 1 单用户模式 系统维护 (*忘记密码修改root密码*)
- 2 多用户模式 但是没网络
- 3 完全多用户模式 **最常用**
- 4 保留未使用
- 5 窗口模式 支持多用户和网络
- 6 重启

执行 startx 启动图形界面

## 系统引导过程

BIOS --> 加电自检(POST) --> MBR(0柱面0磁道1扇区 512字节 引导程序和分区表DPT) --> Grub引导程序 --> 根据配置加载kernel镜像 --> 运行/sbin/init(根据/etc/inittab开始初始化) --> 运行级别对应程序启动(/etc/rcX.d) --> /etc/rc.local --> 生成终端/X Window --> 用户登录

> Grub (Grand Unified Bootloader), 多系统引导程序  
> lilo (Linux Loader) 早期的系统引导程序
> MBR的512字节并装不下Grub, 所以Grub分2段执行
> Grub的配置文件 `/boot/grub/grub.conf`
> initrd (boot loader initilized RAM disk) boot loader用于初始化的内存磁盘，系统启动时的临时文件系统

## 查看帮助

### man <cmd>  

如: `man ls`  

man文件的种类: 

- 常见命令的说明
- 可调用的系统
- 函数库
- 设备文件
- 文件格式
- ...

```shell
# 查看命令存在哪些man文件中
man -f ls
man -f reboot
man 2 reboot # 第二章中 查看reboot的帮助信息
```

### info <cmd>
info是一个基于菜单的超文本系统

```shell
info ls
```


## linux用户管理

### 用户和用户组

#### UID和GID

UID是一个32位的整数  

用户分为3类:

- 普通用户  
  通常只有home目录，系统临时目录的操作权限  
  普通用户UID, >500

- 根用户  **超级用户**  
  具有完全控制权  
  root的UID为0

- 系统用户  
  系统运行时必须有的用户，但并不指真实的使用者。  
  如系统用户mysql, 系统用户UID 1～499

```bash
ps aux # 查看系统进程
```

用户组(用户组ID, GID)

```shell
id  # 快速查看环境"
```








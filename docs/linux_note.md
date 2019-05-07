linux_note
===

简介
---
Linux是一套免费使用和自由传播的类Unix操作系统，是一个基于POSIX和UNIX的多用户、多任务、支持多线程和多CPU的操作系统。

Linux的发行版
---
Linux的发行版简单说就是linux内核和应用软件的打包
目前市面上较知名的发行版有：Ubuntu、RedHat、CentOS、Debian、Fedora、SuSE、OpenSUSE、TurboLinux、BluePoint、RedFlag、Xterm、SlackWare等。


系统启动过程
---
- 内核引导  
BIOS自检，由设置的启动设备启动，操作系统接管硬件，读/boot目录的内核文件

- 运行init进程
读取配置 /etc/inittab

- 运行级别
许多程序需要开机启动。它们在Windows叫做"服务"（service），在Linux就叫做"守护进程"（daemon）。不同的场合需要启动不同的程序，所以就有了运行级别

init进程的一大任务，就是去运行这些开机启动的程序。

Linux系统有7个运行级别(runlevel)：

    + 运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
    + 运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登陆
    + 运行级别2：多用户状态(没有NFS)
    + 运行级别3：完全的多用户状态(有NFS)，登陆后进入控制台命令行模式
    + 运行级别4：系统未使用，保留
    + 运行级别5：X11控制台，登陆后进入图形GUI模式
    + 运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动

- 系统初始化  
真正的rc启动脚本，放在init.d目录，它们有类似的用法，一般都能接受 `start`, `stop`, `restart`, `status`等参数  
/etc/rc5.d中的rc脚本，通常都是K或S开头的链接文件，S开头则用`start`参数运行, K开头的则用`stop`参数运行

- 建立终端  
rc脚本执行完后，init会接着打开6个终端, 以便用户登录 

- 用户登录  
用户有三种登录方式:
  + 命令行登录
  +  ssh登录
  +  图形界面登录 *运行级别为 5，登录后进入KDE Gnome等窗口管理器*

- 终端切换  
`ctrl+alt+F1-F6` 切换终端1-6, `ctrl+alt+F7`返回图形界面


linux关机
---
正确的关机流程: sync > shotdown > reboot > halt  
关机指令 `shutdown`, `man shutdown` 查看帮助 
```
  shutdown -h 1 'machine will shutdown in 1 minute' # -h halt
  shutdown now # 马上关机
  shutdown -r +5 # 5分钟后重启
  shutdown -r now # 马上重启 
  reboot # 同 shutdown -r now
  shutdown -h 20:24 # 某时间点关机
  shutdown -c # 取消定时关机
  halt # 关机 同 shutdown -h now
  poweroff # 关机
  init 0 # 关机
  init 6 # 重启
```


linux系统目录结构
---
- `/bin`   
bin是binary的缩写，该目录存放最常用的命令
- `/boot`  
存放启动linux时用到的核心文件
- `/dev`  
dev是device的缩写, 存放外部设备 *linux中访问设备的方式和访问文件相同*
- `/etc`  
存放系统的配置文件
- `/home`  
用户的主目录，每个用户都有自己的主目录 *通常和用户名同名*
- `/lib`  
存放系统的动态链接共享库, 类似于windows中的dll文件,几乎所有应用程序都需要这些共享库
- `/lost+found`  
一般为空，非法关机后，会存放一些文件
- `/media`  
把识别的媒体设备挂载到该目录
- `/mnt`  
用户挂载的其他文件系统
- `/opt`  
存放额外安装的软件
- `/proc`
该目录是虚拟目录，是系统内存的映射，可以从中获取系统信息, 可直接修改里面的某些文件

- `/root`  
超级管理员的主目录

- `/sbin`  
存放系统管理相关的程序

- `selinux`  
Redhat/CentOS特有的，安全相关的文件

- `/srv`  
存放服务启动后需提取的数据

- `/sys`  
内核设备树的直观反映，创建内核对象时，会在这里新增对应的文件

- `/tmp`  
存放临时文件

- `usr`  
非常重要的目录，用户的程序和文件都放这里，类似windows的 `program files` 文件夹

- `usr/bin`  
普通用户使用的程序

- `/usr/sbin`  
超级管理员使用的程序

- `/usr/src`  
存放源码的目录

- `/var`  
存放经常被修改的文件，如 日志

- `/run`  
临时文件系统，存储系统启动以来的信息。系统重启时，会清空



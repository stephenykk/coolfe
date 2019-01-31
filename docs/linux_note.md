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
BIOS自检，有设置的启动设备启动，操作系统接管硬件，读/boot目录的内核文件

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



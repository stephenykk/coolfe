ubuntu notes
=======

基于debian, APT包管理

长按 super, 打开快捷键面板

启动器
---
alt + f1, 启动栏导航
super + tab 激活启动栏的应用
alt + f2, 运行命令  eg:  firefox   #open firefox
长按 super 显示快捷键表
ctrl + alt + [f1-f6] 打开1-6号控制台; ctrl + alt + f7 返回图形界面

搜索面板:
---
super + A 搜索应用
super + F 搜索文件
super + M 搜索音乐
super + V 搜索视频
按一下 super, ctrl + tab 切换各种搜索类型

HUD和菜单栏:
---
alt 输入当前应用的指令
长按 alt 显示菜单栏
alt + F10 显示展开的菜单

窗口切换
---
alt + tab  切换应用（注意： 以应用为单位切换，一个应用可以开多个窗口)
alt + \`  当前应用的多个窗口间切换 （当前应用打开多个窗口，如：打开多个资源管理器)

窗口控制
---
super + w 显示所有窗口
ctrl + super + d 最小化所有窗口(即： 显示桌面)
ctrl + super + up 最大化窗口
ctrl + super + down 还原/最小化窗口
ctrl + super + left/right 靠左/右半屏窗口大小
alt + F4 关闭窗口 同 windows
alt + space 窗口菜单
ctrl + alt + 数字键盘的方向键  指定窗口停靠位置
alt + 左键 拖动窗口
ctrl + w 关闭当前应用的当前窗口
ctrl + q 关闭当前应用的所有窗口


新版本的firefox安装在， ～/下载/firefox
已安装chromium

输入命令的方式:
1. 终端 terminal
2. 运行对话框 alt+f2
3. 控制台 ctrl+alt+f1..f6

关机:
sudo halt 退出系统(不会关闭电源) ;  sudo halt --poweroff 关机
sudo poweroff
sudo init 0
sudo shutdown now


分区
---
MBR 分区表 主分区 扩展分区
windows 用盘符标识分区
linux 分区这样表示： 
- /dev/hda   #第一块ide硬盘
- /dev/hda1  #第一块ide硬盘的第一个主分区
- /dev/hda5  #第一块ide硬盘的第一个逻辑分区
- /dev/sdb1  #第二块sata硬盘的第一个主分区

每个设备都用 /dev文件夹下的一个文件表示

安装
---
windows， 系统安装到分区
linux, 分区挂载到系统目录（/ ， swap分区， /home, /usr,  /var, /boot)

shell
---
GUI便是一种shell,实现人机交互。
CLI
tab 自动补全
语法： 命令 -参数  对象
cp hi hello

查看命令的帮助
ls --help
info ls
man ls 

终端下的快捷键(readline控件的通用快捷键)
移动  ctrl+f ctrl+b alt+f alt+b  ctrl+a ctrl+e
删除   ctrl+u  ctrl+k ctrl+h ctrl+w ctrl+d alt+d backspace alt+backspace
清屏 ctrl+l
历史命令导航  ctrl+r ctrl+p  ctrl+n
粘贴  ctrl+y

自动补全
tab
alt+=  alt+?
alt+!
alt+_
alt+*

linux下两种风格的键绑定： vi风格 和 emacs风格

命令组合
---

- &  背景任务   eg:  ls &
- ; 多命令顺序执行
- && 依次成功执行 js短路操作
- `subCommand` 包含子命令，子命令优先执行，结果代入 eg: touch `date +%m.%d` 


重定向
---
- `>`
- `>>`
- `|` eg: ls -al | less
- `<`


更友好的shell推荐 `fish`

环境变量 
---
配置文件路径:  /etc/environment

- $PATH 


程序和进程
---
命令就是linux系统中的程序


路径
---
绝对路径 /usr/local/bin /usr/bin /bin
相对路径 ../local/bin

cd /usr/bin 
cd ../bin 
cd -
cd ~   # 等同 cd 


pwd
ls -A # 不包含 .  ..
ls -al

软件
---
linux没有注册表概念，安装程序也只是拷贝文件到 bin ， etc, share , lib等目录中.

配置
---
用gedit， vim等直接编辑配置文件。

隐藏文件
---
.开头的文件/文件夹，系统默认隐藏, 需 ls -A 查看

文件类型
---
linux系统根据文件头信息判断文件类型，而不是扩展名
ls -l  查看
- d 文件夹
- - 普通文件
- l 链接
- b 块设备文件
- c 字符设备文件


文件权限
---
r(read) w(write) x(execute)

- chmod 755 some_file
- chmod a+x some_file
- chmod u-x some_file
- chmod g=x some_file
- chmod o+x some_file
- chown user:group some_file
- chgrp group some_file

用户
---
- su - root #切换用户

系统目录
---

- boot/ 启动文件
- dev/  设备文件
- proc/  内核与进程镜像
- mnt/ 临时挂载
- media/ 挂载媒体设备
- root/ root用户的$HOME
- home/ (user/, ..)
- bin/ 系统程序
- sbin/ 管理员系统程序
- lib/ 系统程序库文件
- etc/ 配置文件 
- usr/ (bin/ lib/ share/, src/, local/, ..)
- var/ 动态数据
- temp/ 临时文件
- lost+found/ 磁盘修复文件


系统启动
---
1. 读取MBR，启动Boot Manager(windows是 NTLDR， linux是 GRUB)
2. 加载系统内核，启动init进程(根进程)
3. init进程读取 /etc/inittab 文件的信息，进入预设的运行级别，按顺序运行该运行级别对应文件夹下的脚本(eg: /etc/rc3.d)
4. 根据/etc/rcS.d/下的脚本，启动Xwindow服务器 xorg
5. 启动登录管理器(GDM)

运行级别:

- 0 关机
- 1 单用户维护模式
- 2-5 多用户模式
- 6 重启

手动管理服务
---

eg:  /etc/rc2.d/K20powernowd start # start stop restart

若不确定当期运行级别，可运行 init.d下的脚本
eg: /etc/init.d/powernowd start


常用系统服务:
---
1. acpi-support
2. bootlogd
3. cron
4. dns-clean
5. gdm
6. halt
7. reboot
8. lvm
9. makedev
10. powernowd
12. rmnologin
13. rsync


配置文件
---
修改配置前，先备份 sudo cp aoo.conf aoo_`date +%y%m%d`

系统初始化: 
/etc/inittab  /etc/timezone  /etc/inetd.conf


文件系统:
/etc/fstab  /etc/mtab

用户系统:
/etc/passwd  /etc/shadow  /etc/group  /etc/gshadow /etc/sudoers

shell:
/etc/shell  /etc/inputrc  /etc/profile   /etc/bash.bashrc 

系统环境:
/etc/environment  /etc/updatedb.conf /etc/issue  /etc/issue.net  /etc/screenrc

网络:
/etc/iftab  /etc/hosts  /etc/hostname /etc/resolv.conf  /etc/network/interfaces

用户配置文件:

全局配置  eg: /etc/inputrc
用户配置  eg:  /home/user/.inputrc


软件安装
---
源码包 和 预编译包

### dpkg
dpkg不会安装软件的依赖，需手动安装.

deb包是预编译包, 包名约定: softwareName_version_revVersion_arch  eg: hello_2.3.2-ubuntu2_all.deb


vim
---


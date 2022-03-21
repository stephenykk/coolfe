# linux_note

## 简介

Linux 是一套免费使用和自由传播的类 Unix 操作系统，是一个基于 POSIX 和 UNIX 的多用户、多任务、支持多线程和多 CPU 的操作系统。

## Linux 的发行版

Linux 的发行版简单说就是 linux 内核和应用软件的打包
目前市面上较知名的发行版有：Ubuntu、RedHat、CentOS、Debian、Fedora、SuSE、OpenSUSE、TurboLinux、BluePoint、RedFlag、Xterm、SlackWare 等。

## 系统启动过程

- 内核引导  
  BIOS 自检，由设置的启动设备启动，操作系统接管硬件，读/boot 目录的内核文件

- 运行 init 进程
  读取配置 /etc/inittab

- 运行级别
  许多程序需要开机启动。它们在 Windows 叫做"服务"（service），在 Linux 就叫做"守护进程"（daemon）。不同的场合需要启动不同的程序，所以就有了运行级别

init 进程的一大任务，就是去运行这些开机启动的程序。

Linux 系统有 7 个运行级别(runlevel)：

    + 运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
    + 运行级别1：单用户工作状态，root权限，用于系统维护，禁止远程登陆
    + 运行级别2：多用户状态(没有NFS)
    + 运行级别3：完全的多用户状态(有NFS)，登陆后进入控制台命令行模式
    + 运行级别4：系统未使用，保留
    + 运行级别5：X11控制台，登陆后进入图形GUI模式
    + 运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动

- 系统初始化  
  真正的 rc 启动脚本，放在 init.d 目录，它们有类似的用法，一般都能接受 `start`, `stop`, `restart`, `status`等参数  
  /etc/rc5.d 中的 rc 脚本，通常都是 K 或 S 开头的链接文件，S 开头则用`start`参数运行, K 开头的则用`stop`参数运行

- 建立终端  
  rc 脚本执行完后，init 会接着打开 6 个终端, 以便用户登录

- 用户登录  
  用户有三种登录方式:

  - 命令行登录
  - ssh 登录
  - 图形界面登录 _运行级别为 5，登录后进入 KDE Gnome 等窗口管理器_

- 终端切换  
  `ctrl+alt+F1-F6` 切换终端 1-6, `ctrl+alt+F7`返回图形界面

## linux 关机

正确的关机流程: sync > shutdown > reboot > halt  
关机指令 `shutdown`, `man shutdown` 查看帮助

```
  shutdown -h 1 'machine will shutdown in 1 minute' # -h halt
  shutdown now # 马上关机
  shutdown -r now # 马上重启 同 reboot
  shutdown -r +5 # 5分钟后重启
  shutdown -h 20:24 # 某时间点关机
  shutdown -h now # 马上关机 同 halt
  shutdown -c # 取消定时关机
  poweroff # 关机
  init 0 # 关机
  init 6 # 重启
```

> shutdown 和 halt 的区别  
> halt 执行时﹐杀死应用进程﹐执行 sync 系统调用﹐文件系统写操作完成后就会停止内核，要手动关闭电源  
> shutdown 会停止应用进程 卸载文件系统 然后关闭电源

## linux 系统目录结构

- `/bin`  
  bin 是 binary 的缩写，该目录存放最常用的命令
- `/boot`  
  存放启动 linux 时用到的核心文件
- `/dev`  
  dev 是 device 的缩写, 存放外部设备 _linux 中访问设备的方式和访问文件相同_
- `/etc`  
  存放系统的配置文件
- `/home`  
  用户的主目录，每个用户都有自己的主目录 _通常和用户名同名_
- `/lib`  
  存放系统的动态链接共享库, 类似于 windows 中的 dll 文件,几乎所有应用程序都需要这些共享库
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
  Redhat/CentOS 特有的，安全相关的文件

- `/srv`  
  存放服务启动后需提取的数据

- `/sys`  
  内核设备树的直观反映，创建内核对象时，会在这里新增对应的文件

- `/tmp`  
  存放临时文件

- `usr`  
  非常重要的目录，用户的程序和文件都放这里，类似 windows 的 `program files` 文件夹

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

忘记密码的解决办法: 单用户模式 或 rescue 模式

linux 远程登录  
window 下远程登录客户端有 `secureCRT`, `Putty`, `SSH Secure Shell`, `Xshell`等

## linux 文件基本属性

```bash
  ls -al # 长列表格式 显示所有文件 包括 . ..
  ls -R # 递归地显示子目录内容
  ll # 同 ls -l
```

文件类型|属主权限|属组权限|其他用户的权限

文件类型:

- `d` 文件夹
- `-` 文件
- `l` 链接文件
- `b` 二进制文件/可执行文件/接口设备
- `c` 字符文件/串行端口设备

文件归属

- 文件属主 文件所有者
- 文件属组 所有者的同组用户
- 其他用户

> 文件所有者以外的用户又可以分为文件所有者的同组用户和其他用户。 对于 root 用户来说，一般情况下，文件的权限对其不起作用。

```bash
cat /etc/group | sort  # 查看用户组 (sort表示按字母排序) group_name:passwd:GID:user_list (passwd 为 x 表示加密)
cat /etc/passwd | sort # 查看用户信息 user_name:passwd:uid:gid:group_name:home_dir:default_shell
cat /etc/gshadow  # 用户组的密码文件 group_name:passwd 密码是加密的
cat /etc/shadow  # 用户的密码文件 user_name:passwd

whoami # 查看当前登录用户
groups <user> # 查看当前登录用户/指定用户 属于哪些组 如 groups root
ls /etc/sudoers.d #sudo用户列表

# 不同用户有不同权限 若没有x权限不能打开目录
sudo adduser test # 创建用户test
# sudo deluser test --remove-home  删除用户和用户的主目录
cd /opt
mkdir myfolder
ll # 查看
chown pan myfolder # 修改所有者为pan
chmod g-x,o-x myfolder # 同组和其他组的用户 取消执行权限
su test # 切换到test用户
cd myfolder # test用户没有myfolder的执行权限 所以打不开文件夹


alias # 查看别名

su - <user> # 切换用户 工作目录也切换到目标用户的home目录
su <user> # 只切换用户

tar -cvzf demo.tgz demoDir # 压缩文件夹
tar -zxvf demo.tar.gz -C /home/pan # 解压到指定路径下(该路径需要真实存在)
tar -tvf demo.tar  # 查看压缩包内容

```

### 更改文件属性

chgrp 更改文件属组

```bash
# chgrp [-R] 属组名 文件名
chgrp pan tmpdir
```

chown 更改文件所有者，也可同时属组

```bash
# chown [–R] 属主名 文件名
# chown [-R] 属主名:属组名 文件名
chown test:test tmpdir
```

chmod 更改文件权限  
Linux 文件属性有两种设置方法，一种是数字，一种是符号。

符号:

- a = all
- u = user 所有者
- g = group
- o = other

```bash
  chmod -R 700 hello # 用数字指定权限 相对方便
  chmod -R u+x hello # 属主+x权限
  chmod -R o-x hello # 其他用户-x权限
  chomd -R g+w hello # 属组+w权限
  chmod -R a+w hello # 所有用户+w权限
  chmod -R u=rxw hello # 设置所有者的权限
  chmod -R u=rxw,g=r,o=w hello # 设置三种用户的权限 (注意逗号分隔)

```

## linux 文件和目录管理

Linux 的目录结构为树状结构，最顶级的目录为根目录 /

- **绝对路径** 从根目录开始 `/home/pan`, `/media/pan`
- **相对路径** `./pan` or `../pan`

目录管理命令

- `ls` 列出目录内容
- `cd` 切换目录
- `pwd` 显示当前目录
- `mkdir` 创建目录
- `rmdir` 删除空目录
- `rm` 删除文件或目录
- `cp` 复制文件或目录 `cp -r folder folder2` 复制目录要加 `-r`
- `mv` 移动文件或目录, 也可以用来重命名文件或目录

> man ls 查看帮助文档

列出目录

```bash
  ls -a  # 全部文件，连同.开头的隐藏文件
  ls -d # 显示目录自身，而不是目录的内容
  ls -l # 长格式显示文件内容，包含文件的权限、大小和修改时间等
```

切换目录

```bash
  cd /root/hello
  cd ./foo
  cd ~ # 用户的主目录
  cd   # 不带参数 同上 则返回用户主目录
  cd - # 返回之前的目录
  cd .. # 上级目录
```

显示当前目录

```bash
  pwd
  pwd -P # 显示真实路径，而非链接文件的路径

  # 例子
  cd ~
  ln -s Music mp3 # 创建软链接 mp3
  cd mp3
  pwd -P

```

创建目录

```bash
mkdir dirname
mkdir -m 711 dirname # 配置文件的权限喔！直接配置，不需要看默认权限 (umask) 的脸色～
mkdir -p path/to/you/want # 创建多层目录

cd path/to/you/want
touch hello
rm -rf path/to/you/wan/*
rmdir -p path/to/you/want # rmdir 不能删除非空目录 所以要先用 rm
```

## 磁盘管理

- df 列出磁盘使用量
  `df [-ahHikmT] [目录或文件名]`

  - `-a`：列出所有的文件系统，包括系统特有的 /proc 等文件系统;
  - `-k`：以 KBytes 的容量显示各文件系统;
  - `-m`：以 MBytes 的容量显示各文件系统;
  - `-h`：以人们较易阅读的 GBytes，MBytes，KBytes 等格式自行显示;
  - `-H`：以 M = 1000K 取代 M = 1024K 的进位方式;
  - `-T`：显示文件系统类型，连同该分区的文件系统名称（例如 ext3）也列出;
  - `-i`：不用硬盘容量，而以 inode 的数量来显示

- du 查看文件/目录的使用空间  
  `du [-ahskm] [文件或目录]`

  - `-a`：列出所有的文件与目录容量，因为默认仅统计目录底下的文件量而已。
  - `-h`：以人们较易读的容量格式（G / M）显示;
  - `-s`：列出总量而已，而不列出每个各别的目录占用容量;
  - `-S`：不包括子目录下的总计(_当前目录下文件的总大小_)，与-s 有点差别。
  - `-k`：以 KBytes 列出容量显示;
  - `-m`：以 MBytes 列出容量显示;

  > 直接输入 du 没有加任何选项时，则 du 会分析当前所在目录的文件与目录所占用的硬盘空间。

- fdisk 分区工具
  `fdisk -l 【设备]` 显示指定设备/当前目录所在设备的分区信息
  `fdisk /dev/sda1` 对指定设备分区, (_q 退出，w 保存_)

- mkfs 分区格式化
  `mkfs -t 文件系统类型 设备`， 例如： mkfs -t mkfs.ext4 /dev/sda2

- fsck 文件系统检查  
  若系统掉电或磁盘发生问题，可用 fsck 进行检查, 详细用法见 `fsck -h`

- 磁盘挂载(mount)或卸载(umount)  
  `mount -L label -t 文件系统类型 挂载点 `umount -fn 设备文件名或挂载点

## 定时任务

crontab 命令(cron table)，它是 cron 的配置文件，也可以叫它作业列表，我们可以在以下文件夹内找到相关配置文件。

- /var/spool/cron/ 目录下存放的是每个用户包括 root 的 crontab 任务，每个任务以创建者的名字命名
- /etc/crontab 这个文件负责调度各种管理和维护任务。
- /etc/cron.d/ 这个目录用来存放任何要执行的 crontab 文件或脚本。

> 我们还可以把脚本放在/etc/cron.hourly、/etc/cron.daily、/etc/cron.weekly、/etc/cron.monthly 目录中，让它每小时/天/星期、月执行一次。

```bash
crontab [-u username]　　　　# 省略用户 表示操作当前用户的crontab
    -e      (编辑工作表)
    -l      (列出工作表里的命令)
    -r      (删除工作作)


crontab -e  # 编辑定时任务

# 语法
分 时 日 月 周 cmd

# 例子

# 每1分钟执行一次myCommand
# 默认不支持秒级别执行频率
* * * * * myCommand
# 每小时的第3和第15分钟执行
3,15 * * * * myCommand
# 在上午8点到11点的第3和第15分钟执行
3,15 8-11 * * * myCommand
# 每隔两天的上午8点到11点的第3和第15分钟执行
# * == */1 执行30次 每天1次 ,  而 */2 代表 12次，每2天执行1次
3,15 8-11 */2  *  * myCommand
# 每周一上午8点到11点的第3和第15分钟执行
3,15 8-11 * * 1 myCommand
# 每晚的21:30重启smb
30 21 * * * /etc/init.d/smb restart
# 每月1、10、22日的4 : 45重启smb
45 4 1,10,22 * * /etc/init.d/smb restart
# 每周六、周日的1 : 10重启smb
10 1 * * 6,0 /etc/init.d/smb restart
# 每天18 : 00至23 : 00之间每隔30分钟重启smb
0,30 18-23 * * * /etc/init.d/smb restart
# 每星期六的晚上11 : 00 pm重启smb
0 23 * * 6 /etc/init.d/smb restart
# 每一小时重启smb
* */1 * * * /etc/init.d/smb restart
# 晚上11点到早上7点之间，每隔一小时重启smb
* 23-7/1 * * * /etc/init.d/smb restart
```

## 常用命令

```bash
type curl # 查看命令的类型 *可以用来确认有没有这个命令*
type echo
type ifconfig

which mongo # 查看应用安装在哪里
whereis mongo


```

[linux 后台运行和关闭、查看后台任务](https://www.cnblogs.com/kaituorensheng/p/3980334.html)

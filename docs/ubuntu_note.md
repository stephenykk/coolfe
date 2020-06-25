# ubuntu notes

基于 debian, APT 包管理

## 启动器

- 长按 `super` 显示快捷键表
- `alt + f1` 启动栏导航
- `alt + f2`, 运行命令 _eg: firefox #open firefox_
- `super + tab` 激活启动栏的应用
- `super + 数字[1-9]` 激活对应的应用
- `super + shift + 数字[1-9]` 应用多开
- `alt+` ` 多开应用，窗口切换
- `ctrl + alt + [f1-f6]` 打开 1-6 号控制台】
- `ctrl + alt + f7` 返回图形界面

## 搜索面板:

- `super + A` 搜索应用
- `super + F` 搜索文件
- `super + M` 搜索音乐
- `super + C` 搜索照片
- `super + V` 搜索视频
- 按一下 `super`, `ctrl + tab` 切换各种搜索类型

## HUD(_head up display_)和菜单栏:

- `alt` 打开 HUD(_可快速搜索并执行菜单项_)
- 长按 `alt` 显示菜单栏
- `alt + F10` 显示展开的菜单
- `print` 截屏
- `alt+print` 当前窗口截屏

## 窗口切换

- `alt + tab` 切换应用（_注： 以应用为单位切换，一个应用可以开多个窗口_)
- `alt +` ` 当前应用的多个窗口间切换 （当前应用打开多个窗口，如：打开多个资源管理器)

## 窗口控制

- `super + w` 显示所有窗口
- `ctrl + super + d` 最小化所有窗口(即： 显示桌面)
- `ctrl + super + up` 最大化窗口
- `ctrl + super + down` 还原/最小化窗口
- `ctrl + super + left/right` 靠左/右半屏窗口大小
- `alt + F4` 关闭窗口 同 windows
- `alt + space` 窗口菜单
- `ctrl + alt + 数字键盘的方向键` 指定窗口停靠位置
- `alt + 左键` 拖动窗口
- `ctrl + w` 关闭当前应用的当前窗口
- `ctrl + q` 关闭当前应用的所有窗口
- `ctrl + alt + t` 打开终端
- `ctrl + d` 关闭终端

## 输入命令的方式

1. 终端 `terminal`
2. 运行对话框 `alt+f2`
3. 控制台 `ctrl+alt+[f1-f6]`

## 关机和重启

- `sudo halt` 退出系统(不会关闭电源) ;
- `sudo halt --poweroff` 关机
- `sudo poweroff` 关机
- `sudo init 0` 关机
- `sudo shutdown now` 关机
- `sudo reboot` 重启
- `sudo init 6` 重启

## 分区

MBR 分区表 主分区 扩展分区  
windows 用盘符标识分区

linux 分区这样表示：

- /dev/hda #第一块 ide 硬盘
- /dev/hda1 #第一块 ide 硬盘的第一个主分区 1-4 预留给主分区
- /dev/hda5 #第一块 ide 硬盘的第一个逻辑分区
- /dev/sdb1 #第二块 sata 硬盘的第一个主分区

每个设备都用 -**/dev 文件夹** 下的一个文件表示

## 安装

windows， 系统安装到分区  
linux, 分区挂载到系统目录（_/ ， swap 分区， /home, /usr, /var, /boot_)

## shell

GUI 便是一种 shell,实现人机交互。  
[ubuntu 终端常用快捷键，较全面](https://www.cnblogs.com/zzblrwg/p/9669869.html)

**CLI** 命令行  
`tab` 自动补全  
语法： 命令 -参数 对象  
`cp hi hello`

查看命令的帮助

- `<cmd> --help`
- `info <cmd>`
- `man <cmd>`

**终端下的快捷键**(_readline 控件的通用快捷键_)

- 移动 `ctrl+f` `ctrl+b` `alt+f` `alt+b` `ctrl+a` `ctrl+e`
- 删除 `ctrl+u` `ctrl+k` `ctrl+h` `ctrl+w` `ctrl+d` `alt+d` `backspace` `alt+backspace`
- 清屏 `ctrl+l`
- 历史命令导航 `ctrl+r` `ctrl+p` `ctrl+n`
- 粘贴 `ctrl+y`(_粘贴删除内容_) `shift+insert`

**自动补全**

- `tab` 只有 1 个匹配时，自动补全； 多个匹配时，列出
- `alt+=` 列出匹配文件 _不会自动补全_
- `alt+?` 同上
- `alt+!` 列出匹配命令
- `alt+_`
- `alt+*` 自动补上全部匹配项

linux 下两种风格的键绑定： vi 风格 和 emacs 风格

## 命令组合

- `&` 背景任务 eg: `ls &`
- `;` 多命令顺序执行
- `&&` 依次成功执行 _js 短路操作_
- <code>\`<cmd>\`</code> 包含子命令，子命令优先执行，结果代入 eg: <code>touch `date +%m.%d` </code>

## 重定向

- `>` 输出重定向
- `>>` 输出重定向 追加内容
- `|` 管道符 输出重定向 eg: `ls -al | less`
- `<` 输入重定向

更友好的 shell 推荐 **fish**

## 环境变量

配置文件路径: **/etc/environment**

```shell
    echo $PATH
    # 自定义环境变量
    export hi=hello
    echo $hi
    # 修改PATH
    export PATH=$PATH:/home/pan
    echo $PATH
```

## 程序和进程

命令就是 linux 系统中的程序

## 路径

绝对路径 _/usr/local/bin_ _/usr/bin_ _/bin_
相对路径 _../local/bin_

```shell
# 切换路径
cd /usr/bin
cd ../bin
cd - # 返回之前的路径
cd ~   # 等同 cd

pwd # 显示当前路径
ls -A # 不包含 .  ..
ls -al # 包含所有文件 长列表格式
```

## 软件

linux 没有注册表概念，安装程序也只是拷贝文件到 `bin` ， `etc`, `share` , `lib` 等目录中.

## 配置

用 gedit， vim 等直接编辑配置文件。

## 隐藏文件

`.` 开头的文件/文件夹，系统默认隐藏, 需 `ls -A` 查看

## 文件类型

linux 系统根据文件头信息判断文件类型，而不是扩展名
ls -l 查看

- d 文件夹
- - 普通文件
- l 链接
- b 块设备文件
- c 字符设备文件

## 文件权限

r(read) w(write) x(execute)

- chmod 755 some_file
- chmod a+x some_file
- chmod u-x some_file
- chmod g=x some_file
- chmod o+x some_file
- chown user:group some_file
- chgrp group some_file

## 用户

- su - root #切换用户

## 系统目录

- boot/ 启动文件
- dev/ 设备文件
- proc/ 内核与进程镜像
- mnt/ 临时挂载
- media/ 挂载媒体设备
- root/ root 用户的\$HOME
- home/ (userA/, userB/, ..)
- bin/ 系统程序
- sbin/ 管理员系统程序
- lib/ 系统程序库文件
- etc/ 配置文件
- usr/ (bin/ lib/ share/, src/, local/, ..)
- var/ 动态数据
- temp/ 临时文件
- lost+found/ 磁盘修复文件

## 系统启动

1. 读取 MBR，启动 Boot Manager(windows 是 NTLDR， linux 是 GRUB)
2. 加载系统内核，启动 init 进程(根进程)
3. init 进程读取 /etc/inittab 文件的信息，进入预设的运行级别，按顺序运行该运行级别对应文件夹下的脚本(eg: /etc/rc3.d)
4. 根据/etc/rcS.d/下的脚本，启动 Xwindow 服务器 xorg
5. 启动登录管理器(GDM)

运行级别:

- 0 关机
- 1 单用户维护模式
- 2-5 多用户模式
- 6 重启

## 手动管理服务

eg: /etc/rc2.d/K20powernowd start # start stop restart

若不确定当期运行级别，可运行 init.d 下的脚本
eg: /etc/init.d/powernowd start

## 常用系统服务:

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
11. rmnologin
12. rsync

## 配置文件

修改配置前，先备份 sudo cp aoo.conf aoo\_`date +%y%m%d`

系统初始化:
/etc/inittab /etc/timezone /etc/inetd.conf

文件系统:
/etc/fstab /etc/mtab

用户系统:
/etc/passwd /etc/shadow /etc/group /etc/gshadow /etc/sudoers

shell:
/etc/shell /etc/inputrc /etc/profile /etc/bash.bashrc

系统环境:
/etc/environment /etc/updatedb.conf /etc/issue /etc/issue.net /etc/screenrc

网络:
/etc/iftab /etc/hosts /etc/hostname /etc/resolv.conf /etc/network/interfaces

用户配置文件:

全局配置 eg: /etc/inputrc
用户配置 eg: /home/user/.inputrc # /home/pan/.inputrc

## 软件安装

源码包 和 预编译包

### dpkg

dpkg 不会安装软件的依赖，需手动安装.

deb 包是预编译包, 包名约定: softwareName_version_revVersion_arch eg: hello_2.3.2-ubuntu2_all.deb

## vim

## 其他

- 获取 Codename(版本代号) `lsb_release -a`
- 修改镜像源 `sudo vi /etc/apt/sources.list` , `sudo apt-get update`
- 系统是 32 位的还是 64 位的：`getconf LONG_BIT`
- 修改 root 密码 `sudo passwd root` 输入自己的密码，然后设置 root 密码
- 查看用户 id `id <userName>`
- 查看网络 `ifconfig` , `cat /etc/resolv.conf`
- 查看 nginx 默认配置 `cat /etc/default/nginx`
- 查看服务是否安装 `which nginx`, `whereis nginx`
- 升级 git
  ```shell
  sudo add-apt-repository ppa:git-core/ppa
  sudo apt-get update
  sudo apt-get install git
  ```

## 使用总结
### 查看版本信息
- cat /etc/issue
- lsb_release -a
- uname -a
### 命令行下打开图片
- `xdg-open <imgfile>`



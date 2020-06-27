# linux 命令行

[每天一个 linux 命令](https://yelog.org/2016/12/01/linux-command%EF%BC%881%EF%BC%89-ls/)

## 快捷键

```bash
# 关闭应用
ctrl + q 
ctrl + w # 关闭tab 或 应用 看情况

# 终端相关
ctrl + alt + t # 打开终端
win + a # 打开 dash 面板, 然后输入 terminal 打开终端
ctrl + d # 关闭终端
ctrl + l # 清屏
clear # 清屏
shift + pageUp # 向上滚动bash命令行的内容
shift + pageDown # 向下滚动bash命令行的内容
ctrl + shift + up # 逐行向上回滚

# 控制台
ctrl + alt + f1 - f6 # 进入控制台
ctrl + alt + f7 # 返回图形界面

# 切换用户
ctrl + alt + l
```

## home目录 文件夹名换回英文
```bash
export LANG=en_US
xdg-user-dirs-gtk-update
```

## 命令行下打开图片
```bash
xdg-open <imgFile>
```
## 命令行下打开文件夹
```bash
nautilus . # 打开当前目录
nautilus # 打开home目录
nautilus /your/path # 打开指定目录
```

## 安装软件
```bash
sudo apt-get install vim
sudo dpkg -i <vscode>
sudo apt --fix-broken install # 修复依赖问题 并继续安装
```

## 查看帮助

```bash
info shutdown
man shutdown
```

## 开/关机

```bash
# 关机
sudo init 0
sudo shutdown -h now
sudo poweroff
sudo shutdown -h 2 # 2分钟后关机
# 重启
sudo init 6
sudo shutdown -r now
sudo reboot

```

## 查看系统信息

### uname

```bash
uname -a # 查看系统信息
uname -o # 查看操作系统
```

### /etc/issue

```bash
cat /etc/issue  # 查看发行版本 centos or ubuntu
```

## 用户和用户组

### su

```bash
su - root # 切换到root用户 环境变量和工作目录也切换
su root # 只切换用户
su  # 同上 默认切换到root
```

### passwd

```bash
passwd <user> # 修改用户密码
passwd # 修改当前用户密码
# root权限可以设置简单密码
sudo passwd <user> # 以root身份修改用户密码

```

### who

```bash
who am i #查看当前用户 详细
who mom likes # 同上

# ubuntu
who -u
who -a
whoami #查看当前用户 简短
```

### /etc/passwd

```bash
cat /etc/passwd  # 查看所有用户 user:pwd:uid:gid:group::home_dir:default_shell
cat /etc/shadow # 用户密码文件 密文保存
```

### /etc/group

```bash
cat /etc/group # 查看系统所有用户组 group:pwd:gid:user_list
cat /etc/gshaow #用户组的密码文件
```

### groups

```bash
groups <user> # 查看用户所在的组
groups  # 查看当前用户所在的组
```

### adduser

```bash
sudo adduser alice # 添加用户
ls /home
```

### usermod

```bash
groups alice
usermod -G sudo alice # 添加到sudo组
usermod -d /home/foo alice # 修改用户主目录
usermod -g pan alice # 修改用户所属组
usermod -l alice-pan alice # 修改用户的登录名
usermod -s /bin/rbash alice # 修改用户登录时用的shell

id pan # 查看用户id uid gid..
finger pan # 查看用户信息 需 apt-get install finger
```
### useradd

```bash
# 没有主目录的用户，不能登录到图形界面
useradd lufy # 添加用户，但不为用户建立主目录
# 没有设置密码的用户不能使用
passwd lufy 

useradd -m zoro # 创建用户，并为用户建立主目录
useradd -g pan nami # 创建用户，并加入到已有用户组
useradd -s /bin/sh jobar # 创建用户 并指定登录所用的shell
# 用户的缺省UID从500向后顺序增加，500以下作为系统保留账号，可以指定UID
useradd -u 2090 robin # 创建用户 并指定用户的uid 
```
### userdel
```bash
userdel zoro  # 删除用户，但并不删除用户的主目录
useradd -m test
ls /home
userdel -r test # 删除用户的同时，删除用户的主目录，以释放硬盘空间
```

### groupadd
```bash
groupadd opmm # 添加组
cat /etc/group | tail -3
```

### groupmod
```bash
groupmod -n opms opmm # 重命名组
groupmod -g 2010 opms # 修改组id
```

### groupdel
```bash
groupdel opms # 删除组
```

### gpasswd
```bash
cat /etc/group # 查看组信息 组的成员列表
gpasswd -a user1 users # 把user1加入users组
gpasswd -d user1 users # 把user1移出users组
```

## 目录和文件

### cd

```bash
cd - # 返回之前的目录
cd ~ # 打开用户主目录
cd # 同上
```

### pwd

```bash
pwd # 显示当前目录
pwd -P # 显示真实路径 针对链接的目录
```

### ls

```bash
ls -lh <dir> # 查看目录内容
ls -F /etc # 使用字符标记不同类型的文件(@链接文件, /目录, \*可执行文件, _其实字体颜色也能区分文件类型_ )
ls -R <dir> # 递归地列出目录及其子目录的内容
ls -lt <dir> # 按时间排序，默认降序 最新的排前面 -t 以时间排序
ls -ltr <dir> # 按时间升序排列 -r 对目录反向排序。
ls -F /etc | grep /$ # 只列出子目录
ls -l /etc | grep ^d # 同上
ls -l /etc | grep "^-" # 只列出文件
```

### touch

```bash
touch <file> # 创建文本文件 _其实是修改文件的访问时间，当文件不存在时则创建_

```

### gedit

```bash
gedit <file> # 编辑文件 当不存在时，新建文件
```

### mkdir

```bash
mkdir <dir> # 创建文件夹
mkdir -p hello/world/folderA # 沿路径创建多层目录
rmdir -p hello/world/folderA # 删除
```

### mv

```bash
mv <src> <dest> # dest为文件夹则把 src 移入; dest为文件或不存在则移动
mv srcDir destDir # 把 srcDir 移入 destDir; 若 destDir 不存在，则重命名 srcDir 为 destDir
mv srcDir/* destDir # 把 srcDir 的内容移入 destDir
```

### cp

```bash
cp srcFile destFile # 复制文件
cp dbData dbData_`date +%Y-%m-%d` # 备份文件 常用操作 (会先执行反引号内的命令)
cp -r srcDir destDir # 复制文件夹
```

### rm

```bash
rm file # 删除文件
rm -rf dir # 删除文件夹 (注意:无法恢复)

# 批量删除时，排除个别文件
shopt -s extglob  # 开启extglob  -s 开启 -u 关闭
rm -rf !(dist.rar|node_modules)
```

### tail

```bash
tail -n 10 web.log # 查看文件末尾 10 行内容
tail web.log # 默认末尾10行
tail -3 web.log
tail -f web.log # 持续监听并显示末尾10行
```

### cat

```bash
cat file # 显示文件内容
cat file1 file2 # 显示多个文件内容
cat -n hello.txt # 查看文件内容 带行号显示
```

### find

```bash
find / -name <keyword> -type d # 从根目录开始递归地查找匹配的文件夹
find / -name bluetooth -type d

find / -name <keyword> -type f # 从根目录开始递归地查找匹配的文件
find / -name issue -type f

find / -name <keyword> -print # 从根目录开始递归地查找匹配的文件或文件夹
find / -name "node*" -print # 从根目录开始递归地查找 node 前缀的文件或文件夹
```

### grep

```bash
grep -r <keyword> dir # 递归地查找包含关键字的文件
cd ~
echo alice-fine > hello
echo alice-fine > hi
grep -r alice-fine .
```

## nginx

```bash
sudo apt-get update # 更新软件列表
sudo apt-get install nginx # 安装 nginx
sudo apt-get install curl # 安装curl
curl localhost # 验证 nginx 正常运行
sudo /etc/init.d/nginx {start|restart|stop} # nginx 启动/重启/停止
sudo nginx -s reload # 重启 nginx, 通常修改配置后执行
sudo service nginx {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade} # 启动 停止nginx服务
nginx -v # 显示 nginx 版本
sudo nginx -t # 测试配置文件的设置，可看到配置文件路径
```

## 安装和查看程序

```bash
sudo apt-get update
sudo apt-get install curl

whereis nginx # 查看 nginx 的安装路径
which nginx # 同上
```

## 环境变量

```bash
echo $PATH # 查看环境变量 PATH (注意:区分大小写)

#仅当前终端生效
export PATH=/usr/local/mongodb/bin:$PATH # 临时配置

#全局配置 /etc/profile
# vi /etc/profile , 添加 export PATH=/usr/local/mongodb/bin:$PATH 全局配置
#source /etc/profile # 让修改立即生效

#全局配置 /etc/environment
vim /etc/environment # 全局配置 直接修改环境变量配置文件

#当前用户生效
vim ~/.bashrc , 添加 export PATH=/usr/local/mongodb/bin:$PATH
```

## 磁盘

```bash
df -h #查看磁盘剩余空间
df -m #同上 文件大小m为单位
df -k #同上 文件大小k为单位

# super + A 输入 disks ,打开 disks 工具
# sudo hdparm -I /dev/sdb 查看硬盘参数
```

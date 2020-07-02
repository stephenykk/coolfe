# linux 命令行

[每天一个 linux 命令](https://yelog.org/2016/12/01/linux-command%EF%BC%881%EF%BC%89-ls/)

## 快捷键


```bash
# 关闭程序
ctrl + q # 关闭系统自带应用(firefox 文件浏览器 gedit, 配置弹窗等)
ctrl + w # ctrl + q 关闭不了，试试它

# 终端
win + a # 打开dash面板 然后输入 terminal 
ctrl + alt + t # 打开终端
ctrl + d # 关闭终端
ctrl + l # 清屏 同 clear
shift + pageUp # 向上滚动bash命令行的内容
shift + pageDown # 向下滚动bash命令行的内容
```

## 查看帮助

```bash
info shutdown # info 查看器 h 查看帮助 , q 退出 info 界面
man shutdown # less 查看器
```

## 开/关机

```bash
# 关机
sudo init 0 
sudo shutdown -h now
poweroff
# 定时关机
sudo shutdown -h 1 # 1分钟后关机
sudo shutdown -h 13:57

# 重启
sudo init 6 
sudo shutdown -r now
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

### lsb_release
```bash
lsb_release -a # 查看发行代号
lsb_release --help
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
sudo usermod -G sudo alice # 添加到sudo组
groups alice
su alice
sudo ls /
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

### xargs

xargs 是给命令传递参数的一个过滤器，也是组合多个命令的一个工具。

xargs 可以将管道或标准输入（stdin）数据转换成命令行参数，也能够从文件的输出中读取数据。

xargs 也可以将单行或多行文本输入转换为其他格式，例如多行变单行，单行变多行。

xargs 默认的命令是 echo，这意味着通过管道传递给 xargs 的输入将会包含换行和空白，不过通过 xargs 的处理，换行和空白将被空格取代。

xargs 是一个强有力的命令，它能够捕获一个命令的输出，然后传递给另外一个命令。

之所以能用到这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了 xargs 命令，例如：

- `-a file` 从文件中读入作为sdtin
- `-e flag` ，注意有的时候可能会是-E，flag必须是一个以空格分隔的标志，当xargs分析到含有flag这个标志的时候就停止。
- `-p` 当每次执行一个argument的时候询问一次用户。
- `-n num` 后面加次数，表示命令在执行的时候一次用的argument的个数，默认是用所有的。
- `-t` 表示先打印命令，然后再执行。
- `-i` 或者是-I，这得看linux支持了，将xargs的每项名称，一般是一行一行赋值给 {}，可以用 {} 代替。
- `-r` no-run-if-empty 当xargs的输入为空的时候则停止xargs，不用再去执行了。
- `-s num` 命令行的最大字符数，指的是 xargs 后面那个命令的最大命令行字符数。
- `-L num` 从标准输入一次读取 num 行送给 command 命令。
- `-l` 同 -L。
- `-d delim` 分隔符，默认的xargs分隔符是回车，argument的分隔符是空格，这里修改的是xargs的分隔符。
- `-x` exit的意思，主要是配合-s使用。。
- `-P` 修改最大的进程数，默认是1，为0时候为as many as it can ，这个例子我没有想到，应该平时都用不到的吧。

```shell
find /sbin -perm +700 |ls -l       #这个命令是错误的
find /sbin -perm +700 |xargs ls -l   #这样才是正确的

# 多行输入单行输出：
echo -e "one\ntwo\nthree\nfour" > data
cat data | xargs
# -n 选项多行输出：
cat data | xargs -n 2
# -d 选项可以自定义一个定界符：
echo can-you-see  | xargs -d-
# -I 参数插值
echo -e "one\ntwo\nthree" | xargs -I {} echo the number is {} !
# 复制所有图片文件到 /data/images 目录下
ls *.jpg | xargs -n1 -I {} cp {} /data/images

# xargs 结合 find 使用
find . -type f -name "*.log" -print0 | xargs -0 rm -f  # xargs -0 将 \0 作为定界符。

# 统计一个源代码目录中所有 php 文件的行数：
find . -type f -name "*.php" -print0 | xargs -0 wc -l

# 查找所有的 jpg 文件，并且压缩它们：
find . -type f -name "*.jpg" -print | xargs tar -czvf images.tar.gz

# 假如你有一个文件包含了很多你希望下载的 URL，你能够使用 xargs下载所有链接：
cat url-list.txt | xargs wget -c

```

### grep
Linux系统中grep命令是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹 配的行打印出来。grep全称是Global Regular Expression Print，表示全局正则表达式版本，它的使用权限是所有用户。

grep的工作方式是这样的，它在一个或多个文件中搜索字符串模板。如果模板包括空格，则必须被引用，模板后的所有字符串被看作文件名。搜索的结果被送到标准输出，不影响原文件内容。

grep可用于shell脚本，因为grep通过返回一个状态值来说明搜索的状态，如果模板搜索成功，则返回0，如果搜索不成功，则返回1，如果搜索的文件不存在，则返回2。我们利用这些返回值就可进行一些自动化的文本处理工作。

`grep [option] pattern file`  

用于过滤/搜索的特定字符。可使用正则表达式能多种命令配合使用，使用上十分灵活。

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

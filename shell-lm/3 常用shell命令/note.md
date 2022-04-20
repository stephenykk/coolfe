# 常用shell命令

## 查看文件和目录
```bash
ls
ls -s # 显示文件大小
ls -ahl # 长列表显示所有文件 
ls -ltr # 按时间顺序显示文件 默认降序， r 反序
ls -F | grep "/$" # 显示所有文件夹
ls -d dir*  # 显示dir开头的目录自身(默认显示目录内的文件)
ls -R images # 递归地显示目录下的所有内容
ls -li # 显示文件或目录的inode编号
ls -ln # 所有者和组用id表示
```

## 查看文件内容

cat [option] [file]...

```bash
cat file1 file2
cat -n file1 # 显示行号
cat -b file1 # 非空行加行号
cat > file  # 从键盘输入内容 输出到file
cat file1 file2 > allfile # 合并文件

tac file # 倒序显示文件内容

```

less file
more file

> less is more

```bash
more -5 notes
cat mynotes | more -5

less file1

```
less 搜索和浏览快捷键
- `/`  n N 下/上个结果
- `?`  n N 上/下个结果
- `ctrl+f/b` 翻页
- `ctrl+u/d` 翻半页

less 打开多个文件
`:e` 然后输入新文件名
`:n` 下一个文件
`:p` 上一个文件

less 书签功能
`m` 然后按任意字母，标记当前位置
单引号 + 之前字母，定位到对应标签

less 显示打开文件后 新增加的内容
`F` 输入大写F 由新内容则会更新

head 显示文件顶部开始的若干行/字符

```bash
head -n 10 file # 从开头到第10行
head -10 file # 同上
head -n -3 file # 从开头到倒数第3行
head -c 5 file # 显示前5个字符

```

tail 显示文件末尾的若干行/字符

```bash
tail -n 3 file
tail -3 file
tail -f file # 监听文件中新写入的行
tail -f file --pid 3012 # 进程结束时终止tail
tail -f notExistFile --retry # 持续尝试打开目前还不存在的文件

```

## 查看文件类型

file <filename>

```bash
file hello.txt
file -i hello.txt # MIME格式的文件类型信息
file -N * # 键值对形式的输出
```

## 统计文件信息（行数/单词数/字符数)

wc <file>

```bash
wc hello.txt
wc -l hello.txt # 行数
wc -w hello.txt # 单词数
wc -c hello.txt # 字符数
wc -L hello.txt # 最长的行的长度
```

## 查找文件和目录

find 是linux系统中最常用和重要的命令之一,可以根据文件名、文件大小、修改时间、权限等属性进行查找。

```bash
find /etc -name inittab
find /etc -name "*.conf"
find . -iname server.js  # 不区分文件名大小写
find . -type d -name tmp # 查找当前目录下名称为tmp目录
find . -type f -name "*.php" # 查找当前目录下的所有php文件
find . -type f ! -perm 777 # 查找当前目录下权限不是777的文件
find . -type f ! -perm /a+w # 查找只读文件
find . -type f -perm /a+x # 查找可执行文件
find /tmp -type f -name "*.log" -exec rm -f {} \; # 查找log文件并删除
find . -type f -empty # 找空文件
find . -type d -empty # 找空文件夹
find . -maxdepth 2 -type f -name "*.js" # 限制搜索深度
find . -type f -name ".*" # 找dotfile
find /tmp -user root # 所有者为root的文件
find /tmp -group sudo # 所属组为sudo的文件
find ~ -type f -mtime 3 # 3天前修改的文件
find ~ -type f -mtime +3 -mtime -5 # 3天前5天内修改过的文件
find . -type f -cmin -60 # 1小时内修改过的文件
find . -type f -amin -60 # 1小时内访问过的文件
find . -type f -size 50M # 大小是50M的文件
find . -type f -size +50M -size -100M # 大于50M小于100M的文件
 
```


## 操作文件和目录

touch 命令用于修改文件的时间戳 和 创建文件

- `-a` 只更新访问时间
- `-c` 不创建文件
- `-m` 只更新修改时间
- `-r` 用指定文件的时间替代当前时间
- `-t` 更新为指定时间


```bash
touch a-new-file # 新建文件
touch file{1..3} # 创建3个文件
touch -a hi.js
touch -m hi.js 
touch -r a.js b.js
ll . # 长列表显示的时间是文件的修改时间
touch -t 2112031020 hi.txt # 更新为21年12月3日10点20分

```

创建目录

mkdir <folder>

```bash
mkdir images
mkdir -p src/static/images # 递归创建目录层级
mkdir /home/jie/backup
mkdir -p -m 777 backup/code # 指定目录的权限
mkdir -p -m a=rwx backup/code # 同上

```


复制文件或目录

cp <srcFile> <dstFile>
cp -r <srcFolder> <dstFolder>
cp <file1> <file2>... <dstFolder>
cp -t <dstFolder> <file1> <file2>...

```bash
cp a.jpg a2.jpg
cp -r codes codes_bk
cp a.js b.js src
cp -t src a.js b.js
cp * /tmp # 复制当前目录下所有文件到tmp
cp -p server.js /codes/test/server.js # 保留所有文件属性(所有者 权限 访问时间等)

```

创建链接文件和目录

ln命令用于创建软链接或硬链接

- 软链接
  又称 符号链接，可以指向文件或目录, 对符号文件的读写，系统会转换为对源文件或目录的操
  作, 但是删除时，仅仅删除链接文件, 链接文件和源文件由各自的inode, 是不同的文件
- 硬链接
  多个文件路径指向同一个文件(inode相同), 其实是创建另一个文件路径，指向同一个inode, 硬链接只能指向文件，硬链接数为0，文件才真正被删除

ln <src> <dstLink>
ln -s <src> <dstLink>

```bash
ln hello.txt /tmp/hello_hdlink.txt
ln -s images /tmp/images_softlink

```

重命名文件

mv 命令移动或重命名文件/目录

mv <oldname> <newname>
mv file1 file2... dest

```bash
mv a.jpg b.jpg # 重命名
mv a.jpg images/ # 移动
mv a.jpg b.jpg images/
mv -i a.jpg images # 若目标文件夹已有同名文件，则提示
mv -u dirSrc/*  dstDir # 仅仅将dstDir没有的文件，移动进去
```

删除文件/目录

rm file1 file2..
rm -r dir

```bash
rm -rf dir # 强制删除目录所有内容 危险操作
rm *.log
rm -i  *.js # 删除前提示
rm ??? # 文件名只有3个字符
rm *.??
rm a*
rm [ab].js # 删除a.js b.js
```


管理文件和目录权限

3种角色的权限

- 所有者
- 所属用户组
- 其他用户

文件夹的执行权限(x) 控制用户能否打开文件夹

chmod [ugoa] [+-=][rwxug] file...

```bash
chmod a+x hi.js
chmod a=rx hi.js
chmod o-x hi.js
chmod 777 hi.js
chmod u=g hi.js # 设置用户的权限同用户组的权限
chmod u=o hi.js # 设置用户的权限同其他用户的权限
chmod -R 664 dir # 递归地修改目录下所有文件的权限
# 修改所有子目录的权限
find . -type d -exec chmod -R 775 {} \;

```


修改文件/目录的所有者/所有组

chown user dir
chgrp gpname dir

```bash
chown alice:pan codes # 同时修改所有者和所属组
chgrp pan codes
chown -R alice src
chown :nami images # 只修改用户组
chown alice:nami images_symlink # 修改软连接的所有者等，其实修改的是源文件的
chown -h alice:nami images_symlink # 修改软链接的所有者等

chown --from=alice nami:nami images # 从所有者alice,修改到新的所有者

```

设置用户和组权限位

setuid 设置用户标识 允许用户以所有者权限执行文件
setgid 设置组标识 允许用户以所属组的权限执行文件

> 注意安全问题，如 用户对文件设置来setuid权限位，且文件所有者是root, 则任意用户都可以用root权限执行该文件

查看是否设置setuid,setgid权限位

- `ls -l`
- `stat filename`

```bash
ls -l /usr/bin/passwd 
stat /usr/bin/passwd
chmod u+s example.sh # 设置uid
chmod 4775 exampe.sh # 4代表设置uid 同上
chmod g+s example.sh # 设置gid
chmod 2775 example.sh # 2代表设置gid 同上
chmod 0775 example.sh # 移除uid/gid权限位

```

## 文本处理

文本排序

sort 将文本的行排序，字母顺序
sort filename
sort -n filename
sort -r filename
sort -u filename # 移除重复的行

```bash
sort -u data data2 # 可对多个文件的内容排序
sort -t ',' -k2 data # 逗号分割为多个字段，按第2个字段排序
sort -t ',' -k2 -n -r data
```

文本去重

uniq filename
uniq -c filename

```bash
sort data | uniq
sort data | uniq -c # 重复行计数
sort data | uniq -d # 只显示重复的行 去重只显示一次
sort data | uniq -D # 显示重复行，并且不去重
sort data | uniq -d -c
sort data | uniq -u # 只显示不重复的行 与 -d 相反
sort data | uniq -w 2 # 只通过前面2个字符判断是否重复
sort data | uniq -w 2 -D # 显示重复的行
sort data | uniq -s 3 # 跳过比较前3个字符，与 -w 相反
uniq -f 1 text # 空格分割成多列，跳过第1列
```


删除和替换字符

tr 命令用于转换、删除和压缩重复字符
tr set1 set2  set1对应位置的字符被替换为set2对应位置的字符

```bash
echo linuxShell | tr lin LIN  # 小写转换为大写
echo how are you | tr a-z A-Z # 所有字符转换为大写
# {} 转换为 ()
echo {linuxShell} > idata
tr '{}' '()' < idata > odata # 同时重定向输入和输出
cat odata

# 空格转换为tab
echo "it is a long time" | tr [:space:] "\t"

# 压缩重复字符
echo "hello----world" | tr -s "-" " " # hello world

# 删除指定字符
echo "LongTimeAgo" | tr -d a-z  # 删除小写字母
echo "it is time 2:30" | tr -d [:digit:] # 删除数字
echo "it is time 2:30" | tr -c -d [:digit:] # 删除数字以外的字符
```

查询字符

grep 查询文本或者文件, 只显示匹配的行

grep pattern file
grep -e pattern -f file

```bash
grep alice /etc/passwd
grep -i one content.txt # 忽略大小写
grep -r console  src/utils # 搜索目录, 递归地查找包含指定内容的文件
grep -r -l console src/utils # 只显示包含指定内容文件的名称
grep -w one content.txt # 单词匹配 不匹配 gone
grep -c one content.txt # 匹配计数
grep -n one content.txt # 显示行号
grep -v one content.txt # 反转 显示不匹配的行
```

文件比较

diff 比较两个文件的差异

diff file1 file2

```bash
diff -w file1 file2 # 忽略空格差异，比较文件
diff -y file1 file2 # 并排的格式，显示差异
diff -y -w file1 file2 # -w 忽略空格
diff -y -W 100 file1 file2 # -W 指定列宽
diff -cw file1 file2 # 上下对比的格式显示差异
```


## 其他常用命令

查看主机名

hostname 查看/修改系统的主机名 

```bash
hostname # 查看系统主机名
sudo hostname my-notebook # 修改主机名, 只是临时修改，重启将恢复
sudo hostname -F host.txt # 从文件读取主机名

```

查看系统登录的用户

w  who命令

```bash
w  # 比较详细
who # 信息较少
who -b # 系统启动时间
who -l # 显示系统登录进程
who -m # 显示与当前标准输入关联的用户
who -r # 显示系统的运行级别

```

显示系统的运行时间

uptime


查看系统信息

uname

```bash
uname -a # 所有信息
uname # 显示内核名称
uname -n # 显示主机名 同 hostname
uname -r # 内核发行版本
uname -m # 系统硬件名称
uname -p # 处理器信息
uname -i # 硬件平台
uname --help
```

显示和设置日期/时间

date [option] [+format]

```bash
date # 以默认格式显示当前日期
date --date '20/2/2012' # 以默认格式显示指定日期
date --date='1 Oct 2012'
date --date='next week'
date --date='last month'
date --date='2 months ago'
date --date='last day'
date -f date.txt # 从文件读取多个日期按默认格式显示
sudo date --set 'last day' # 修改系统日期/时间 并没有设置日期的效果
date -u # utc时间
stat host.txt
date -r host.txt # 打印文件最近修改时间
date +%Y-%m-%d # 指定格式 

```

显示用户id

id [options] [username]

```bash
id # 显示当前用户 uid gid 用户名 组名 属于哪些组
id -u
id -u root # 查看uid
id -un # 显示用户名
id -g
id -gn # 显示组名
id -G # 显示属于哪些组
id -Gn
id -Gn alice

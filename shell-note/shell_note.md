# shell 学习笔记

shell脚本是管理linux的常用语言


```
shebang
run script 
.bashrc
.bash_history
cmd1; cmd2
echo printf
echo -n -e
printf formatStr val1 val2...
%s %-10s
宽度 左右对齐  精度
彩色输出 颜色转义序列
```
变量和环境变量

类型都是字符串
查看进程的环境变量
cat /proc/$pid/environ
cat /proc/$$/environ | xarg -0 -n 1
pgrep gedit

cat /proc/$(pgrep gedit)/environ | tr '\0' '\n'

环境变量是指未在当前进程定义，从父进程继承而来的变量

export color=blue

color=blue
export color

function sayhi() {
  echo hihi
}
export -f sayhi

echo $PATH | tr ':' '\n'
echo $PATH | xargs -d: -n 1
/etc/environment  /etc/profile
export PATH="$PATH:/home/jie/bin"

常见环境变量:
HOME PWD USER UID SHELL SHLVL

查看当前shell
echo $SHELL
echo $0

PS1  PS2
cat ~/.bashrc | grep PS

数学运算
let  $(())  $[] expr  bc
num=1
let num++
let num+=10
let num="num + 11"

count=1
echo $(( count + 10 ))

age=12
echo $[ age + 1 ]

width=10
echo $(expr $width + 1 )
echo `expr $width + 12`

bc 还支持浮点运算
h=4
echo "$h * 0.68" | bc
设置参数
echo "scale=2;3/8" | bc
进制转换
echo "obase=10;ibase=2;1010101" | bc
echo "sqrt(100)" | bc
echo "10^10" | bc

文件描述符是与文件输入、输出相关联的整数，用来跟踪已经打开的文件。
stdin 0 , stdout 1 , stderr 2

echo hello > out.log  # 同 1> out.log
echo world >> out.log # 同 1>> out.log
输出重定向默认是把stdout重定向
要把stderr重定向，可以指定stderr的文件描述符
ls nothisfile 2> err.log

所以要把命令的stdout stderr分别重定向到不同文件，可以这样:
ls nothisfile out.log 1> out.log 2> err.log

若希望把stdout stderr都重定向到同一个文件
ls nothisfile out.log > all.log 2>&1
或
ls nothisfile out.log &> all.log

/dev/null 黑洞设备
若希望不显示错误信息, stderr重定向到 /dev/null

ls nothisfile 2> /dev/null

$? 上一条命令的执行结果 0 成功, 非0 失败

tee 重定向到文件并且保持stdout输出
ls | tee ls.log | cat -n

file <filename>
ls | file -  # 用标准输出作为文件内容，标准输出默认的文件名为 - (或者理解为 标准输出被临时存到名为 - 的文件中)

stdin -> /dev/stdin
stdout -> /dev/stdout
stderr -> /dev/stderr

打印2次
echo have a rest | tee /dev/stdout

重定向脚本内部的文本块
cat <<EOF>log.txt
this is test msg
hello kk
see you
EOF


用exec创建自定义文件描述符，需要用 < > >> 指定文件的打开模式
exec 3<input.txt # 只读模式打开文件，指定描述符为3
cat <&3  # 从文件描述符3读取输入
exec 4>output.txt # 只写模式打开文件，指定描述符为4
echo hello >&4
exec 5>>aoutput.txt


普通数组和关联数组
arr=(1 2 3)
echo ${arr[@]}
arr[5]=time
arr[6]=silent
echo ${arr[*]}
echo ${!arr[@]} # 打印索引数组
echo ${#arr[@]} # 打印数组长度

声明关联数组
declare -A arr2
arr2=([apple]=red [banana]=yellow)
arr2[grape]=purple
echo ${arr2[@]} # 值列表
echo ${!arr2[@]} # 索引列表

别名可以使用alias 或 函数定义
别名定义在 ~/.bashrc, 则是持久的
alias rm='cp $@ ~/backup; rm $@'
\rm foo # 执行原始命令，忽略别名定义
unalias 删除别名

获取终端信息 tput stty
tput cols # 终端窗口的列数
tput lines # 终端窗口的行数
tput longname # 终端名
tput cup 10 10 # 设置光标的位置 cursorPosition
stty -echo # 禁止输入发送到终端
stty echo # 允许输入发送到终端


纪元时 1970-01-01 0:0:0
date +%s # 纪元时到当前时刻的总秒数 
date --date "1999-10-1" +%A # 查看某天是星期几

命令执行计时
startTime=$(date +%s)
sleep 3
ls .
endTime=$(date +%s)
diff=$(( endTime - startTime ))
echo excute time $diff seconds


调试脚本
bash -x demo.sh
只关注某段脚本
set -x 开启显示参数和命令
set +x 关闭显示参数和命令

命令 ':' 指不执行任何操作
function DEBUG() {
 [ "$_DEBUG" == "on" ] && $@ || :
}

for i in {1..10}
do
  DEBUG echo $i
done

_DEBUG=on bash debug.sh


shebang开启调试
#!/bin/bash -xv

函数定义 和 执行
function hi() {
   echo $1 $2
   echo $@
   echo $*
   return 0
}
bash函数支持递归
export -f hi # 导出函数，使函数在子shell可用
$? # 获取函数或命令的返回值
output=$(ls | cat -n) # 创建子shell，存储子shell的输出
output=`ls | cat -n`
()定义子shell, 子shell是独立的进程
pwd;
(cd /bin; ls) # 子shell的操作 不会影响父shell
pwd;


read -n 1 answer # 读取一个字符，就自动确认，读取值存入answer
read -s pass # 不回显输入
read -p "enter your name: " userName
read -t seconds isJump
read -d ":"  user  # 指定定界符 输入 : 则确认

IFS 内部字段分隔符 Internal Field Separator
data='name,score,class'
oldIFS=$IFS
IFS=,
for item in $data
do
  echo $item
done
IFS=$oldIFS


序列
{1..10}  {a..z} ./*.txt
for item in list
do
  cmd
done

for((i=0; i<10; i++))
{
  cmd
}
while condition
do
  cmd
done
until condition
do
  cmd
done

比较和测试
test []
短路操作:
[ condition ] && action
[ condition ] || action

[ $var -eq 0 -o $var -eq 1 ]

文件按系统测试
-f -d -x -r -w -L -e
字符串相等，最好用[[ ]]
[[ $str == "hello" ]]
[[ "$str" = "hello" ]]
-z -n
[[ "$str" == "hi" || "$str" == "hello" ]]
[[ -n "$str1" ]] && [[ -z "$str2" ]]
# 同上
[[ -n "$str1" && -z "$str2" ]]
# test 命令
if [ $var -eq 0 ]; then
if test $var -eq 0 ; then # 同上


------
cat file1 file2...
把stdin的内容和文件内容拼接起来
echo hello linux | cat - other.txt
cat -s out.log # 重复空白行转换为单个空白行
cat out.log | tr -s "\n" # 删除所有空行

script scriptreplay

find dir -maxdepth -type f -name "*.js" -exec ls -h
find . -print
find . -print0
find . -type f -iname "demo.jpg" -print
# 匹配多个条件之一
find . -type f \( -name "*.js" -o -name "*.ts" \) -print
# -path 匹配路径 -ipath
find . -type f -path "image" -print
# -regex -iregex 正则表达式匹配文件路径
find . -regex ".*\(\.py\|\.sh\)$" -print0
# -maxdepth -mindepth
# -type f d l p c b s
# -atime -mtime -ctime
find . -type f -atime -7 -print # 7天内访问过的文件
# -amin -mmin -cmin
find . -type f -amin +7 -print # 7分钟前访问过的文件
# -newer refFile 修改时间比参考文件更新的文件
find . -type f -newer file.txt -print
# -size +1M  基于文件大小搜索
find . -type f -size +10k
# -delete 删除找到的文件
find . -type f -name "*.swp" -delete
# -perm 644 基于文件权限查找 ! 表示条件取反
find . -type f -name "*.php" ! -perm 644 -print
# -user 根据文件所有者搜索
find . -type f -user pan -print
# -exec 对找到的文件执行命令 {} 代表找到的文件
find . -type f -user pan -exec chown alice {} \;
# 把10天前的txt文件复制到old文件夹
find . -type f -mtime +10 -name "*.txt" -exec cp {} old \;
# -exec 不支持多个命令，可以把命令写到shell脚本中
# -prune 排除某些目录
find . -path "*node_modules*" -prune -o -exec echo hello {} 11 \;
find . \( -path "*node_modules*" -prune \) -o \( -type f -print \)

# 多行转换为单行
cat data.log | xargs
# 单行转换为多行
echo hello hi hero | xargs -d " " -n 1
echo hello hi hero | xargs -d " " -i echo log: val is {} !

# xargs 内部默认使用 IFS 作为定界符

# \0 作为定界符更安全
find . -type f -name "*.txt" -print0 | xargs -0 rm


# 大小写转换
echo "hello can you feel me" | tr 'a-z' 'A-Z'
cat out.log | tr '\t' ' '
# 删除字符
echo hello 1 world 2, can 3 | tr -d '0-9'
# -c 补集 删除非数字字符
echo "hello 1 world 2 | tr -d -c '0-9'

# -s 压缩重复的字符
echo "one   kkkkey  lllong" | tr -s ' kl'

字符类:
alnum  alpha lower print...

# 转换为大写
tr '[:lower:]' '[:upper:]'

checksum 校验和，测试文件的完整性
md5sum  sha1sum
md5sum file1 file2...
md5sum out.log > out.log.md5
md5sum -c out.log.md5 # 校验文件的md5
sha1sum out.log > out.log.sha1
sha1sum -c out.log.sha1

md5deep

sort uniq
sort file1 file2.. > sorted.txt
sort file1 file2.. -o sorted.txt
sort file | uniq > uniqed.txt

# 按数字序排序
sort -n file1

# 逆序
sort -r file1

# 按月份排序
sort -M months.txt
# 检查文件是否已排序
sort -c file1
# 按照指定列排序
sort -k 2 data.txt
# 按第一个列的第2个字符作为key排序
sort -k 1.2,1.2 data.txt
# 自定义列分隔符
sort -d X -k 2 data.txt
# 忽略前缀空格，字典序排序
sort -bd data.txt
# 对排序后的数据 去重
uniq file1
sort file1 | uniq
sort -u file1
# 只显示没有重复的行
uniq -u file1
# 只显示重复的行
uniq -d file1
# 重复次数计数
uniq -c file1
# -s 跳过前n个字符 -w 用于比较的最大字符数
sort data.txt | uniq -s 2 -w 2

# tempfile命令，生成临时文件名
# 随机数环境变量 echo $RANDOM

# dd 生成指定大小的文件
dd if=/dev/zeo bs=100k count=1 of=dbdata.sql

# split -b size file prefix 按指定大小，分割文件
split -b 30k dbdata.sql db_
# 以4位数字作为后缀
split -b 30 -d -a 4 dbdata.sql db_ 
# -l 根据行数来分割文件
split -l 10 dbdata.sql db_

# csplit命令，根据文件内容确定分割点

# 文件名解析 basename.extname
filename='demo.jpg'
basename=${filename%.*} # 从末尾非贪婪匹配.* 并删除
extname=${filename#*.} # 从开始非贪婪匹配 *. 并删除

# 批量重命名文件
#!/bin/bash

count=1
for img in *.[jJ]pg *.[pP]ng
do
  newImg=image-$count.${img##*.}
  mv $img $newImg 2> /dev/null
  if [ $? -eq 0 ];
  then
     echo "renaming $img to $newImg"
     let count++
  fi
done

# rename命令重命名文件
rename *.JPG *.jpg
rename 's/JPG/jpg/g' *.JPG

# 拼写检查
echo hello | aspell list
echo xhexx | aspell list

# 列出文件中以指定单词开头的行
look word file1 # look命令
grep "^word" file1 # 同上
look luck # 查默认字典 /usr/share/dict


交互输入自动化
echo -e "alice\n12\n" | bash question.sh
bash question.sh < input.data

# question.sh
#!/bin/bash
read -p "name:" name
read -p "age: " age
echo "$name $age years old"


expect命令，实现交互输入的自动化


---------
文件类型: 目录 普通文件 块设备 字符设备 符号链接 套接字 命名管道等
atime 文件被访问时间
mtime  文件内容修改时间
ctime 文件属性修改时间

生成任意大小的文件
dd if=/dev/zero of=demo.file bs=1M count=1

文本文件的交集和差集
comm命令用于文件之间的比较
sort a.txt -o a.txt
sort b.txt -o b.txt
comm a.txt b.txt

mkdir -p foo/bar/zoo

文件权限： 文件所有者 文件所属组 其他用户
rwx rwS  setuid setgid
lrwxrwxrwx
lrwSrwSrwx
目录的特殊权限，粘滞位 sticky bit, 只有创建该目录的用户才能删除目录中的文件, 如 /tmp
drwxrwxrwt
drwxrwxrwT

chmod u=rwx g=rw o=r file1
chown user.group file1
chmod a+t dir
chmod 777 -R dir
chown user.group -R dir
chmod +s excutableFile # setuid 不能用在脚本文件

创建不可修改文件
sudo chattr  +i file1 # 设置文件不可修改 root用户也修改不了，只能再次修改属性 

touch file{1..3}.txt
touch -a file1 # 只修改atime
touch -m file1 # 只修改mtime
touch -d "2022-01-01" file1

# 创建符号链接
ln -s target symbolLinkName
ls -l | grep "^l" | awk '{ print $8 }'
find . -type l -print

# 获取符号链接的目标
readlink  symbolName

# 获取文件类型
file fileName 

while read line
do
  echo $line
done< <( find . -type f -print )
# <(find . -type f -print) 用子进程的输出代替文件名

# 挂载 卸载
mount umount

# 分区 fdisk

# 格式化文件系统  mkfs.ext4

# 挂载iso文件
mkdir /mnt/iso
mount -o loop linux.iso /mnt/iso

# 默认缓冲区满之后，才会写入物理设备, 若要强制立即写入  sudo sync

若想保留可引导光盘的可引导性，应该以磁盘镜像或iso文件的形式进行复制

U盘的可引导镜像 混合ISO

从cdrom创建iso
cat /dev/cdrom > image.iso
dd if=/dev/cdrom of=image.iso
mkisofs -V "label" -o image.iso sourceDir/

将iso文件写入USB设备
dd if=/dev/image.iso of=/dev/sdb1
cat image.iso > /dev/sdb1

diff -u file1 file2
diff -u file1 file2 > version.patch
patch -p1 file1 < version.patch # 打补丁后 file1 同 file2 内容一样
patch -p1 file1 < version.patch # 已打补丁，则撤销补丁 file1 回退到之前的内容

head -n 5 file1
head -n -5 file1 # 打印除末尾5行之外的所有行

seq 生成数字序列

tail -n 5 file1 # 打印末尾5行
tail -n +5 file1 # 打印除开头5行之外的所有行
tail -f out.log

pid=`pidof gedit`
tail -f note.md --pid $pid

列出当前目录下的所有文件夹
ls -d */
ls -F | grep "/$"
ls -l | grep "^d"
find . -maxdepth 1 -type d -print

pushd /var/www
popd
pushd +2
popd +2

wc 统计 行数 单词数 字符数
wc -l file
wc -w file
wc -c file



---------
正则表达式 
POSIX字符类 [:alpha:] [:upper:]
元字符: Perl风格正则表达式 \b \d \s

grep pattern file1 file2...
grep -E regex file1
egrep regex file1
grep -o -E regex file1 # 只输出匹配部分
grep -v pattern file1 # 返回不匹配的行
grep -c "color" file1 # 统计匹配的行数
grep -n "day" data.log # 显示行号
grep -l "day" *.log # 匹配在哪一个文件
grep -R patten dir
echo hello world  | grep -i "HELL" # 忽略大小写
grep -e patten1 -e patten2 file1 # 匹配多个正则
grep -f patternFile  file1
# 递归地搜索当前目录的 .log文件 
grep -r --include "*.log" "day" .
# --exclude  --exclude-dir --exclude-from file

# \0 定界符输出搜索结果
grep "day" file1 -lZ | xargs -0 rm

# -q 静默模式 不输出搜索结果
grep  -q "day" "*.log"

# 打印匹配行的上下文 -A -B -C
seq 10 | grep 5 -B 3

cut 按列进行文本切分
cut -f fieldList filename
cut -f 2,3 data.log
cut -f 1-3 data.log
# --complete 补集 除指定列之外的所有列
cut -f 2 --complete data.log
# -d 指定定界符
cut -f2 -d";" data.log
# -b 按字节切分 -c 按字符切分 -f 按字段切分
# --output-delimiter 输出定界符

sed (stream editor)
sed 's/pattern/replacement/' file
# 替换内容直接写入源文件
sed -i 's/pattern/replacement/' file 
# -g 替换同一行中的所有匹配
sed 's/pattern/replacement/g' file
# 从第2个匹配开始全局替换
echo thAthBthC | sed 's/th/TH/2g'
# 删除空白行
cat out.log | sed '/^$/d'
sed '/pattern/d'
# & 引用匹配内容
echo this is cool | sed 's/\w\+/[&]/g'
# 向后引用 \1 引用捕获分组的匹配内容
# 组合多个表达式
echo this is cool | sed 's/is/IS/' | sed 's/cool/COOL/'
echo this is cool | sed 's/is/IS/; s/cool/COOL/' # 同上

awk可以对行和列进行操作

awk 'BEGIN{} pattern{ cmds } END{}' file
awk 'BEGIN{ i=0 } { i++ } END{ print i }' data.log
# “” 用作print的字符串拼接
echo | awk '{ var1="v1"; var2="v2"; var3="v3"; print var1"-"var2"-"var3; }

# 特殊变量
NR 行号 Number of Record
NF 当前行的字段数 Number of Field
$0 当前行的内容
$1 第一个字段的值

awk '{ print $2, $3 }' students.txt
awk 'END{ print NR }' students.txt
# 成绩之和
awk 'BEGIN{ getline; sum=0 } { print $3; sum+=$3 } END{ print "result is:", sum }' students.txt
# -v 外部变量值传递给awk
read -p "what is your name:" name
echo | awk -v user="$name" '{ print user, ", you are welcome!" }'
# 传入多个外部变量
user="lili"
age=12
echo | awk '{ print kuser, kage }' kuser="$user" kage="$age"

awk '{ print $0 }' filename

# getline 读取行
seq 5 | awk 'BEGIN { getline; print "content of line 1", $0; } { print $0 }'
# 过滤条件
seq 10 | awk 'NR < 5 { print $0; }'
seq 10 | awk 'NR==1,NR==4 { print $0;}' # 打印1-4行
echo -e 'hello\nlinux\nis\ncool' | awk '/linux/{print $0;}'
echo -e 'hello\nlinux\nare\nso\ncool'
 | awk '!/linux/{print $0;}'
# 设置字段定界符 -F
awk -F: '{ print $NF }' /etc/passwd
awk 'BEGIN { FS=":" } { print $NF; }' /etc/passwd

# 将命令的输出读入变量
echo | awk '{"grep root /etc/passwd" | getline output;} END { print output; }

# awk中使用循环
echo | awk '{ for(i=0; i<10; i++) { print i; } }'

# awk字符串函数
length(str) index(str, search_str)
split(str, arr, delimiter)
substr(str, start_index, end_index)
sub(regex, replacement, str)
gsub(regex, replacement, str)
match(regex, str)


替换文本或文件中的字符串
sed 's/pattern/replacement/g' filename
cat data.txt | sed 's/\b[0-9]\{3\}\b/NUMBER/g' # 替换所有3位数

对文件中的行 单词 字符进行遍历
1. while read line 迭代每一行
while read line;
do
 echo $line;
done < file.txt

# 命令的输出重定向给 while read 
while read line;
do
 echo "log: $line"
done < <(echo -e "hello\nworld")

2. for word in $line 迭代每一个单词
while read line;
do
  echo -e "\nllog: $line"
  for word in $line:
  do
     echo "wlog: $word"
  done
done< <(echo "hello world\nlinux is great")

3. for((i=0; i<${#word}; i++)) 迭代每一个字符
word='hello'
for((i=0; i<${#word}; i++))
do
  echo "${word:$i:1}"
done

# paste 按列合并文件
paste nums.txt names.txt

# 打印多列数据的某一列 awk cut
awk '{print $1}' data.txt
ls -l | awk '{print $1" : "$9}'

# 打印某范围的行
ls -l | cat -n | awk 'NR==1,NR==3' # 打印1-3行
ls -l | cat -n | awk '/input*/, /out*/ # 用正则匹配开始行和结束行

# rev 回文字符串判断
echo "hello" | rev

# tac 逆序打印文件内容
seq 5 | tac

# head
awk 'NR <= 10' filename
# tail
awk '{ arr[NR] = $0 } END{ for(i=NR-9;i<NR;i++) { print arr[i] }' filename
# tac
awk '{ arr[NR] = $0 } END { for(i=NR;i>=1;i--) { print arr[i];}}' filename

# 变量参数扩展
msg="hello can you feel"
echo ${msg/hello/hi}
# ${msg:pos:len}  ${msg:pos}
echo ${msg:6:3}
echo ${msg:6}
# ${msg:pos:len} 支持负索引
echo ${msg:(-2)}


# wget curl
wget url1, url2, url3
# -o logfile 指定日志输出文件
wget url -o my.log
# -t 4 重试次数
wget url -o my.log -t 5
# --limit-rate 限速
wget --limit-rate 10k url
# -c 断点续传
wget -c url
# --quota 下载总大小限制
wget --quota url

# curl下载
curl url > data.file

# --mirror 镜像下载整站
wget --mirror www.test.com

wget -r -N -l depth url

# --user --password 提供http/ftp认证信息
wget --user lucy --password 123 url

# lynx 基于命令行的浏览器
lynx -dump url > index.html

curl url --silent # 不显示进度
curl url -o # 输出到文件，文件名同从url解析
curl url -o myfile.html
curl -C - url # 断点续传
curl --referer referUrl targetUrl
curl --cookie "user=lucy" url
curl --cookie-jar cookie.txt url # 另存cookie
curl --user-agent "chrome" url
curl -H "Host: www.demo.com" -H "hello: world" url
curl --limit-rate 20k url
curl --max-filesize 1m url
curl -u user:pass url
curl -I url # 只打印响应头 不下载文件


# tar tarball
tar -cf output.tar sources
tar -rvf old.tar newFile # -r 最加文件
tar -tf old.tar # 查看
tar -xf old.tar -C output/dir
tar -xvf old.tar file1 file2 # 只提取指定文件
# tar中使用stdin stdout
mkdir dist
tar -cf - file1 file2 | tar -xvf - -C ./dist
tar -Af old1.tar old2.tar # old2.tar合并到old1.tar
tar -uvvf old.tar file1 # -u 更加新 才添加到tar中
tar -df old.tar file1 file2 # -d 比较归档文件和源文件的差异
tar -f old.tar --delete file1 file2 # 从归档文件中删除指定文件
tar -cf data.tar * --exclude "*.txt" # 不归档txt文件
tar -cf data.tar * -X list.txt # 同上
# 归档时排除版本控制文件夹
tar --exclude-vcs -czvvf source.tar.gz myproject

# cpio 文件归档工具
echo file1 file2 | cpio -ov > archive.cpio

cpio -it < archive.cpio # 查看
cpio -id < archive.cpio # 提取文件

gzip filename
gunzip filename.gz
gzip -l file.gz # 查看压缩文件属性
# -c 将输出指定到stdout
cat -file | gzip -c > file.gz
# 归档并压缩
tar -czvvf archive.tar.gz file1 file2..
# -a 根据提供的压缩文件名推断用哪种压缩工具gzip bzip
tar -cavvf archive.tar.gz file1 file2..
# 压缩级别
gzip -9 test.jpg

# bzip 和 bunzip
bzip2 file1
bunzip2 file1.bz2
# 归档并压缩 bzip方式压缩
tar -cjvvf archive.tar.bz2 file1 file2..

# 加密工具和散列
crypt gpg

gpg -c pass.txt # 加密 生成加密文件 pass.txt.gpg
gpg pass.txt.gpg # 解密

# base64 用ascii字符串描述二进制数据
base64 file1 > baseFile.txt
base64 -d baseFile.txt > rawFile.txt

# md5sum 和 sha1sum都是单向散列算法，无法反推出原始数据，用于校验数据完整性
md5sum file1
sha1sum file1

# shadowlike散列(salted散列)
# 用openssl生成shadow密码
openssl passwd -1 -salt <saltStr> <password>

# rsync 数据备份工具，借助差异化计算和压缩技术最小化数据传输量，支持远程备份, cp本地备份

# 备份
rsync -av sourcePath destPath # -a 进行归档
rsync -av /home/alice/data lucy@192.168.0.4:/home/lucy/data # 备份到远端，只会复制更改过的文件

# 远程主机的数据恢复到本地, rsync 用 ssh 连接远程主机
rsync -av user@host:path  localPath

# -z 开启压缩
rsync -avz source dest
rsync -av images/ ~/imgback/ # 复制 images 文件夹下的内容到目标路径
rsync -av images ~/imgback # 复制 images文件夹到目标路径

# --exlude pattern 排除文件
# --exlude-from filePath
rsync -avz ~/codes /mnt/disk/back --exclude *.txt

# --delete 在目标端，删除那些在源端不存在的文件
rsync -avz source dest --delete


# git  版本管理
git init --bare
git config --global user.name alice
git config --global user.email alice@123.com
git commit --allow-empty -am "first commit"
git remote add origin https://github.com/alice/cool
git add fileOrDir
git rm file1
git commit -m "msg"
git log
git checkout branchName
git checkout commitId


dd 能够克隆任何类型的磁盘，包括分区表，引导记录等信息，基本上算是一个比特流复制工具
dd if=source of=target bs=blockSize count=n # 如没有指定count,dd会对输入文件一直复制，直到遇到文件结束标记(EOF)

# 分区复制到文件中
dd if=/dev/sda1 of=sda1_partition.img
# 用备份恢复分区
dd if=sda1_partition.img of=/dev/sda1
# 永久擦除一个分区的所有数据
dd if=/dev/zero of=/dev/sda2
# 在容量相同的硬盘间进行克隆
dd if=/dev/sda of=/dev/sdb
# 制作cd rom的镜像文件
dd if=/dev/cdrom of=cdrom.iso
# 用loopback的方式可以将任何dd生成的文件镜像进行挂载
mkdir /mnt/books
mount -o loop file.img /mnt/books

# 网络
tcp/ip 子网掩码 网关 路由 端口 dns
相关命令：ifconfig route nslookup host

网络接口用来连接网络。通常类UNIX系统都用 eth0 eth1 usb0 wlan0 这样的命名习惯

ifconfig 显示网络接口，子网掩码等信息
# 打印网络接口
ifconfig | cut -c-10 | tr -d ' ' | tr -s '\n'
ifconfig ifaceName

# 提取ip地址
ifconfig ens33 | grep -o "inet addr:[^ ]*" | tr -d "[[:alpha:] :]"
ifconfig ens33 | grep -o "inet addr:[^ ]*" | cut -d: -f2

# 设置网络接口的ip地址
ifconfig ifaceName ip
ifconfig wlan0 192.168.1.1

# 设置ip地址的子网掩码
ifconfig wlan0 192.168.1.1 netmask 255.255.255.0

# 设置mac地址
ifconfig eth0 hw ether 00:1c:bf:87:23:d5

# 查看本地dns设置
cat /etc/resolv.conf

ping www.baidu.com # 一个域名可以配置多个ip地址，dns只会返回其中一个

# dns查找工具 nslookup host
host www.baidu.com # 列出域名对应的所有ip地址

# nslookup 查询dns解析的详细信息

# 本地hosts文件 /etc/hosts
echo 192.168.0.9 hi.com >> /etc/hosts
nsloopup www.baidu.com

# 操作系统都维护着一个路由表
route # 查看路由表
route -n # 主机名以ip显示

# 设置默认网关
route add default gw ipAddr ifaceName
route add default gw 192.168.1.1 wlan0

# traceroute 显示报文经过的所有网关地址  hop 跳,  metric 节点间距离的度量
traceroute www.baidu.com

# 连通性测试 ping
ping www.baidu.com -c 3 # RTT（Round Trip Time) 还可以得到往返时间 判断网速

# 根据ping命令的返回状态 判断主机是否活动
ping www.baidu.com -c2
if [ $? -eq 0 ];
then
  echo active
else
  echo fail
fi

# 判断一组ip是否连通

for ip in 192.168.0.{1..255};
do
  ping $ip -c3 &> /dev/null;
  if [ $? -eq 0 ];
  then
    echo $ip is alive
  fi
done

# 安装fping工具
fping -a 192.168.1/24 -g 2> /dev/null

# 文件传输
ftp sftp rsync scp
ftp需要安装服务端和客户端
yum install -y vsftpd
yum install -y ftp
# 查看服务是否启动
pgrep vsftpd
sudo systemctl status vsftpd
# 启动服务
sudo systemctl start vsftpd
# 添加用户用于登录ftp
sudo useradd alice -g ftp -s /bin/bash
sudo passwd alice # 设置密码
 
ftp localhost/ip
!ls # 查看本地目录文件列表
lcd dir # 修改本地文件夹
ls # 查看服务器文件列表
get hello.txt
put world.txt

# sftp是类似ftp的文件传输系统，它运行在ssh连接之上. sftp利用ssh模拟ftp接口，不需要在远端安装并启动ftp服务器, 只需要运行openSSH服务器
# 查看openSSH是否启动
pgrep sshd

sftp user@ip # 连接远程主机，进行文件传输 内部命令和ftp基本相同
# 若ssh服务器不是运行在默认的22端口, 用 -oPort指定端口
sftp -oPort=223 user@ip

# rsync
rsync my.sh pan@remoteHost:/home/pan/

# scp (secure copy) 通过ssh加密通道传输文件数据
scp filename user@remoteHost:/home/target/path
scp user@remoteHost:/home/alice/zhongmo.txt ./mytest/
# -oPort指定端口 -r 递归复制目录 -p 保留文件的模式和权限

# 用脚本设置网络
ifconfig $iface down # 关闭接口
ifconfig $iface hw ether $hwAddr # 设置mac
ifconfig $iface $ip netmask $mask # 设置ip
route add default gw $gwip $iface # 设置网关

iwconfig 命令设置无线网卡
iwlist 扫描无线网络
iwlist scan

ssh自动登录
ssh采用基于公钥和私钥的加密技术进行认证
ssh-keygen -t rsa -C "some comment"
把生成的公钥放到服务器的 ～/.ssh/authorized_keys文件中
ssh user@remoteHost "cat >> ~/.ssh/authorized_keys" < ~/.ssh/id_rsa.pub
# 验证自动登录
ssh user@remoteHost ls
# 若ssh服务不是用默认端口22, 则连接时 -p 指定端口
ssh -p 224 user@remoteHost
# 在远程主机执行命令
ssh user@remoteHost "commands"
ssh pan@192.168.1.1 'whoami'
# 执行多条命令
ssh user@remoteHost "cmd1 ; cmd2; cmd3" > output.txt 2> err.log
echo "commands" | ssh user@remoteHost 

ssh pan@$myserver "echo user: $(whoami); echo OS: $(uname)"
$cmds="echo user: $(whoami); echo OS: $(uname)"
ssh pan@$myserver $cmds
# 获取服务器的运行时间
ssh pan@$myserver | awk '{ print $3 $4 $5 }'

# -C 启动数据压缩传输
ssh -C user@remoteHost cmd

# 数据重定向到远程shell命令
echo "hello" | ssh user@remoteHost cmd
ssh user@remoteHost cmd < local.file

# sshfs 本地挂载远程服务器的目录
sudo apt-get install sshfs -y
mkdir /mnt/server
sudo sshfs pan@$myserver:/home/pan /mnt/server
su - root
cd /mnt/server
umount /mnt/server # 取消挂载

# zenity 脚本化的GUI工具
sudo apt-get install zenity -y
# 消息弹窗
zenity --info --text "hello, kk"

# 在一组主机上执行命令，并发执行 &后台运行
ip_list="192.168.0.1 192.168.0.2"
user="alice"
command='export DISPLAY=:0; zenity --info --text "hi"
for host in $ip_list;
do
  ssh $user@$host "$command" &
done


# 网络流量和端口
端口侦听  端口连接 开放端口列表
lsof netstat
lsof 列出所有被活动进程打开的文件列表
lsof -i  # 列出所有打开的internet and network files 其中包含端口号

# 查看21端口和它的服务
sudo netstat -anp | grep 21

# -t 显示tcp端口 -n 主机以ip显示 -p 显示相关程序
netstat 需要root权限才能查看所有进程, 否则只能查看属于当前用户的进程

日志记录系统程序的运行情况

统计磁盘的使用情况
df (disk free)
du (disk usage)

# 查看文件占用多少磁盘空间
du file1 file2...
du -h data.txt
du -m data.txt # 以 Mb为单位
du -h . # 当前目录 和 它的子目录的空间占用统计
du -ah . # 当前目录 和 子目录所有文件大小统计
du -ah . | sort -k2 # 按文件名排序
du -ah . | sort -hr # 按文件大小倒序
# -s 只显示摘要信息, 统计指定文件夹的大小 没有明细文件的大小
du -sh . # 统计当前文件夹的大小
du -h . # 统计当前文件夹 和 它的子文件夹的大小
# -c 总计 显示总计行
du -ch file1 file2..
du -ch .
du -ch *.txt

用特定的单位打印文件
-b -k -m -B NByte 指定的块大小

--exclude 排除部分文件不统计
du -ah . --exclude "*.sh" # 注意要加双引号

--exclude-from file.txt 用文件指定要排除哪些文件不统计

--max-depth n 指定统计遍历的目录深度
-x 只统计单一的文件系统，若子目录为其他文件系统的挂载点，则不进行统计

使用du需要确保用户对目录由读取权限

# 找出指定目录中最大的10个文件
du -ak dir | sort -nrk 1 | head
# 上述方法包含列文件夹，排除掉
find . -type f -exec du -k {} \; | sort -nrk 1 | head

磁盘可用空间
du -h

计算命令的执行时间
time yourCmd # time命令会将执行时间输出到stderr
time bash my.sh
real时间： 真正从开始到结束的时间(包括被阻塞的等待时间)
user时间: 真正执行程序的时间,进程花费在用户模式的CPU时间
sys时间: 进程花费在内核模式的CPU时间

# -o 将执行时间输出文件
/usr/bin/time -o time.log bash my.sh # 用绝对路径指定time命令
# -a 追加方式输出执行时间到文件
/usr/bin/time -a -o time.log bash my.sh
# -f 指定输出格式
/usr/bin/time -f "耗时: %U" uname

time命令可以查看很多进程的信息，具体看 man time
/usr/bin/time -f "page size: %z bytes" ls > /dev/null


当前登录用户
who w whoami
w 最详细
TTY是与文本终端相关联的设备文件

users 列出当前登录的用户列表
同一个用户通过不同的伪终端登录，会重复显示
users | tr ' ' '\n' | sort -u

# 查看系统开机多久
uptime

# 获取上一次启动，用户的登录会话信息
last # 数据来源为 /var/tmp/wlog
last alice # 获取上次启动，指定用户的信息
last reboot # 获取上次启动，重启会话的信息
sudo lastb # 获取失败的用户登录会话信息

# 列出最常用的10条命令
cat ~/.bash_history | awk '{ list[$1]++; }
END{
 for (i in list) {
   printf("%s\t%d\n", i, list[i]);
 }
}' | sort -nrk2 | head


# watch 监视命令的输出
watch ls # 每2秒更新一次输出
watch -n 10 ls # 指定每10秒 更新一次输出
watch -d ls # 突出显示差异部分


logrotate (日志轮转替换) 日志管理，将日志的大小限制在指定的size内
日志内容超过大小，则把较旧的内容，存入logfile.1，若logfile.1也超大小，则将logFile.1的最旧内容，存入logfile.2,如此类推

logrotate配置文件所在目录 /etc/logrotate.d


用syslog记录日志
日志目录 /var/log
守护进程syslogd，负责往/var/log写入统一格式的日志

logger命令，写系统日志
logger hello kk # 日志会被写入 /var/log/syslog 中
# -t 打标签
logger -t mydebug  starting my shell
tail /var/log/syslog # 查看最近写入的日志
logger -f my.log # 把文件的内容写入日志文件syslog

收集进程信息
进程是程序的运行实例
进程的属性：
进程id , pid
进程对应的程序
所有者，拥有该进程的用户
内存占用
CPU占用
进程所属终端（TTY）

进程管理相关命令： ps top pgrep

# 不带其他参数，只显示属于当前终端的进程，用处不大
ps
# -f full-format 更多列输出
ps -f

# -e every 获取系统所有进程的信息
ps -ef
ps -axf

# -o 选择需要输出的列
ps -e -o comm,pcpu
ps -u pan

# --sort 进程输出排序 +升序 -降序
ps -eo comm,pcpu --sort -pcpu,+comm

# 显示占用CPU最多的10个进程
ps -eo comm,pcpu --sort -pcpu | head

# 用grep从ps的输出查找进程
ps -eo comm,pid,pcpu,pmem | grep nginx

# 找出命令对应进程的pid
pgrep nginx
# = 移除列头
ps -C nginx -o pid= 

# -d 指定输出定界符
pgrep bash -d :

# -u 指定进程的所有者
pgrep -u root,alice  bash

# -c count 匹配的进程总数
pgrep -c bash

# 返回指定用户的进程
ps -u alice -o user,pcpu | head

# 用tty过滤ps输出
ps -t pts/0,pts/1

# -L 显示进程相关的线程信息
ps -eLf
ps -eLf --sort -nlwp | head

# 指定输出格式
ps -ef
ps -e u
ps -e w

# 显示进程的环境变量
ps -eo pid,cmd e | tail

终结进程 kill killall
信号是进程间的一种通信机制，我们可以用特定信号来中断进程，进程收到信号，会执行对应的信号处理程序来响应

kill 发送信号
trap 设置信号处理程序

# 列出可用信号
kill -l

# 默认信号是TERM
kill `pgrep gedit`
kill pidList

# 发信号
kill -s signal pid
常用信号:
SIGHUP 1 挂起检测
SIGINT 2 中断进程, Ctrl + C 发送该信号
SIGNKILL 9 强行杀死进程
SIGTERM 15 默认值，终止进程
SIGSTP 20 后台运行 Ctrl + Z 发送该信号

# 强行杀死进程
kill -9 pid
kill -s SIGKILL pid

# 以命令名作为参数,杀死相关的一组进程
killall gedit

# -u 指定进程所有者
killall -u alice gedit

# -i 杀死进程前确认
killall -i gedit

# pkill 和 kill 类似，不过它的参数是命令名
pkill -9 gedit
kill -9 4839

pkill -s singal processName

捕捉并响应信号 trap
trap 'functionName' singalList
function handler() {
 echo hello, got singal
}
echo my process id is $$
# ctrl + c 发送信号 SIGINT
trap 'handler' SIGINT

while true;
do
  sleep 1
done


top是一个极为重要的命令，会显示占用CPU最多的进程列表

which 找出可执行命令的位置
which gedit
PATH环境变量
export PATH=$PATH:/home/alice/bin

whereis 类似which，额外返回命令手册和源码的路径
whereis gedit

file 查看文件的类型
file /bin/bash

获取系统运行时间和平均负载
uptime

linux中，终端是作为设备存在的，所有打开的终端都在/dev/pts下由对应的设备文件

wall 向当前登录的所有用户发送广播消息
先用其他电脑远程登录当前主机
ssh pan@192.168.117.1
然后执行消息广播，ssh登录的用户就能收到消息
cat hi.txt | wall

# 设置允许往当前终端写入消息
mesg y
mesg n # 禁止写入
mesg # 查看选项值

系统信息查看:
主机名
系统内核
linux发行版
cpu信息
内存信息
磁盘分区

hostname
uname --help
uname -a

# 查看cpu信息
cat /proc/cpuinfo
# 查看内存信息
cat /proc/meminfo

# 查看分区信息
cat /proc/partitions
sudo fdisk -l /dev/sda

# 查看系统硬件信息
sudo lshw

/proc是一个位于内存的伪文件系统，能够让用户读取各种系统信息
每个运行的进程都在/proc下有对应的目录，目录名为进程id

pgrep bash
ls /proc

readlink 读取符号链接的目标文件
readlink /proc/$(pgrep bash)/exe

cron 定时任务调度
crontab -l
crontab -e # 编辑文件包含 条目配置说明
以分钟为例：
* 表示每分钟都执行一次
5,10 表示第5和第10分钟执行
*/5 表示每隔5分钟执行一次

# 每天的5，6，7点，都执行一次
00 5,6,7 * * * /home/alice/hi.sh

# 每天凌晨2点 关机
00 02 * * * /sbin/shutdown -h

cron作业中指定的命令需要用完整路径，因为cron作业执行的环境和终端的环境不同。

# 查看指定用户的定时任务
crontab -u alice -l

# 设置环境变量
chmod a+x /home/pan/cron_test.sh
myname=lufy
* * * * * /home/pan/cron_test.sh

# 删除当前用户的定时任务
crontab -r
sudo crontab -u alice -r # 删除指定用户的

CVS(Comma Seperate Value)文件 以逗号分隔为格式的




# shell 重定向

## 输入和输出

每个shell命令都有自己的输入和输出

改变输入和输出的默认路径，叫做重定向

> linux中，一切皆文件

文件描述符:

- `0` 标准输入stdin 默认为 键盘
- `1` 标准输出stdout 默认为 屏幕
- `1` 标准错误输出stderr 默认为 屏幕


输入重定向

`cmd < inputFile`

```bash
cat < data.txt
sort < data.txt
```

标准输出

语法

`cmd > outFile`

```bash
echo hello world > hi.txt
echo hello world 1> hi.txt # 同上

```

标准错误

语法

`cmd 2> errLog`

```bash
ls not-exists-file 2> err.log

```

## 重定向

文件描述符 0 1 2 默认打开， 3-9可被指定使用

重定向可以使用文件描述符作为前缀

```bash
# 创建目录
mkdir docs
touch docs/a.tmp
sudo chown -R root:root docs


if [ $# -lt 1 ]
then
  echo "usage: $0 dir..."
  exit
fi

for dir in $@
do
  find $dir -type f -name "*.tmp" -exec rm -f {} \;

  # for 循环的错误输出重定向到文件
done 2> err.log

```

追加重定向

```bash

echo hello >> hi.txt
cmd 2>> err.log

```bash
if [ $# -ne 1 ]
then
  echo "usage: $0 filePath"
  exit
fi

fname=$1

# 定义一个代码块
{
  read line1
  read line2
} < $fname # 输入重定向到文件

echo "$line1"
echo "$line2"

# while 读取文件

while read linecon
do
  echo $linecon
done < $fname


# untile 读取文件
until ! read linecon
do
  echo $linecon
done < $fname

```

### 输入重定向到here doc 

语法

```bash
# MARK可以是任意字符串
command <<MARK
  line1
  line2
MARK


# 例子 <<-KK 则忽略行首的制表符
tr a-z A-Z <<KK
> one line $PWD
> long life
>KK

# 单引号或双引号包住标识符，则变量替换失效, 显示原文
cat <<"KK"
> work shell $SHELL
> still string $SHELL
>KK


```

### here strings

here-strings 是 here docs的变形

语法

`command <<<words`

```bash
tr a-z A-Z <<< hello
tr a-z A-Z <<< "hello old world"
tr a-z A-Z <<< "hello one
two line"  # 输入多行
```

### 创建空文件

- `touch newfile`
- `> newfile`

### 丢弃输出

重定向到 `/dev/null`

```bash
cmd > /dev/null

cmd 2> /dev/null

cmd &> /dev/null # 1 2 都重定向到 /dev/null
cmd >& /dev/null
cmd > /dev/null 2>&1

```

### 标准错误重定向

```bash
find . -name "core.*" -exec rm -f {} \; 2> /tmp/err.log
grep hello * 2> grep-err.log
grep world * 2>> grep-err.log
```

### 标准输出重定向

```bash
awk -F: '{pring $1}' /etc/passwd | sort > users.txt
uname -a > host.txt
d -s /home/* | sort -rn > dir-size.txt
```

### 同时重定向输入和输出

```bash
cmd &> all.log
cmd 2>&1 > all.log
cmd >& all.log

cmd < infile > outfile
< infile cmd > outfile

tr a-z A-Z < infile > outfile
```

### 文件描述符

范围 0 - 9

exec 命令操作文件描述符

`exec 2> err.log` 之后的所有错误输出到重定向到err.log

```bash
if [ $# -ne 1 ]
then
  echo "usage: $0 filename"
  exit
fi

# 给传入的文件指定文件描述符3
exec 3< $1

# 从文件描述符3 读入一行
while read -u 3 line
do
  echo $line
  read -p 'press any key ' -n 1
done

exec  3<&- # 关闭文件描述符3

```

指定用于输入的文件描述符

`exec [n]< file`

```bash
# 把文件的读取流重定向到描述符3
exec 3< /etc/passwd
grep alice <& 3

```

给文件的输出流指定文件描述符

`exec [n]> file`



```bash

exec 4> /tmp/output.txt # 文件的输出流重定向到文件ubash do述符4
date >&4 # 内容写入 /tmp/output.txt
uname -a >&4

```

关闭文件描述符

`[n]<&-`
`[n]>&-`

把文件的输入和输出流都重定向到指定文件描述符
`exec [n]<>file`
```bash
# data.txt的输入和输出都重定向到4
exec 4<>data.txt

# 从文件描述符4读取前3个字符
read -n 3 word <& 4 # 文件描述符4重定向到标准输入

echo $word

echo -n '==' >& 4

exec 4>&-
cat data.txt # one==two

```

命令“ls -l /proc/$mypid/fd”列出了所有由此脚本运行时的进程打开的文件描述符

`/proc`对应内核数据结构的伪文件系统



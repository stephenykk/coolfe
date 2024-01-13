# sed 和 awk

sed 和 awk 是处理文本文件的有力工具

面向字符流，读取一行，处理并输出

## sed 编辑器基础

`sed` stream editor 的简称

`sed`是非交互式的面向数据流的编辑器。

`sed`是简单的设计语言，类似shell, *很多操作和 vim 的末行命令模式是一样的*

sed的使用场景:

- 自动化地编辑一个或多个文件
- 简化多个文件中执行相同的编辑任务
- 编写转换程序

*sed一次只能编辑一行*

## sed的模式空间

sed维护一个模式空间，模式空间就相当于工作区/临时缓冲区，当使用编辑命令时
就在模式空间存储当前行的内容

> sed脚本包含多条命令时，下条命令是对上条命令在模式空间的操作结果，做继续编辑
> 当所有命令处理完后，返回模式空间的最新结果，读入下一行内容

## sed的编辑命令

sed指令，命令行指定或抽离到文件中

`sed [options]  'command' [file]..`  
`sed [options] -f script.sed [file]..`


sed常用选项:

- `-e`  下个参数是sed指令
- `-f` 指定sed指令的脚本
- `-i` 直接修改读取的行，而不是输出到终端
- `-n` 取消默认输出

语法:  

[addr1 [, addr2 ]][!]command


addr {
cmd1
cmd2
}

addr {cmd1;cmd2}

sed的编辑命令有24个, 常用的有:
- `a` 追加 在当前行后加文本内容
- `c` 更改 用文本内容取代模式空间的内容
- `d` 删除
- `i` 插入 把文本内容放到模式空间内容前一行
- `s` 替换
- `l` 打印
- `=` 打印行号
- `y` 转换

```bash
[line-addr]a\
  text
[line-addr]c\
  text
[line-addr]i\
  text

# script.sed
/one world/a\
new line 1\
new line 2

# 在one world下追加2行
sed -f script.sed data.txt

sed '/hello/a\
good' < data.txt

sed '/hello/i\
new-content' < data.txt

# 在文件末行追加内容
sed '$a\
the end.' data.txt  # 可以不用输入重定向

# a i 指令都只应用于单个行地址
# c 指令可以处理一个范围内的行，这些行会被删除，用新文本替代

sed '/^one/,$c\
changed content' data.txt

# 所有shell脚本加 hashbang 行
sed -i 1i\#\!/bin/bash  *.sh

```


## 删除指令

`d` 删除模式空间的内容，因为模式空间被清空，后续指令不会再执行

```bash
# 删除空行
sed '/^$/d' data.txt

# 删除多行
sed '3,$d' data.txt

```

## 替换指令

语法

[addr]s/pattern/replacement/flags

flags:

- `n`  对pattern的第几次匹配做替换
- `g` 替换所有匹配pattern的地方
- `p` 打印模式空间的内容
- `w file` 将模式空间的内容写入文件

replacement中的特殊符号, 同正则
- `&` 代表匹配内容
- `\n` 代表捕获分组匹配的内容 如 `\1`
- `\` 转移符


```bash
# 默认定界符为/, 改为! 同vim
s!/user/lib!/usr/com! 

sed 's/e/E/g' data.txt
```


## 打印指令

`p` 输出模式空间的内容

```bash
# p指令调试sed脚本
sed -n '/^hello/{
p
s/-//
s/^hello //p
}' data.txt


```
## 打印行号指令

```bash
# [line-addr]=
sed -n '/^hello/{= ; p}' data.txt
# 写成多行
sed -n '/^hello/{
=
p
}' data.txt


```

## 读取下一行指令 

`n` 指令改变正常的流程，它读取下一行取代模式空间的内容，后续指令作用在替换后的模式空间内容上

语法

[addr]n

```bash
# 删除^hello行后面的空行

sed '/^hello/{
n
/^$/d
}' data.txt

```

## 读写指令

`r file` 读入文件, `w file` 输出到文件

语法

[line-addr]r file

[addr]w file

```bash
# 所有txt文件末尾加上文本内容
sed -i '$r the--end' *.txt

# 内容分类
sed '/^window/w win.txt
/^linux/w linux.txt' data.txt

# 删除搜索关键字 再输出
sed '/^window/{
s///
w win.txt
}
/^linux/{
s///
w linux.txt
}' data.txt


sed -n -e '1w out.txt' -e '$w out.txt' data.txt

```


## 退出指令

`q` 会使sed脚本立即退出，停止处理后续的行

语法

[line-addr]q

```bash
# 只打印前10行
sed -n '10q' data.txt


```

## sed使用shell变量

```bash

sed "s/demo.jpg/$fname/g" data.txt

# 修改定界符
sed -i "s#$oldPath#$newPath#' data.txt

```


## awk基础

语法

awk [option] pattern { action } file...

awk [option] -f script.awk [--] file...

options常用选项有:
- `-F fs` 指定列分隔符fs
- `-v var=value` 程序执行之前设置变量，变量可用于BEGIN块
- `-f` 脚本文件

```bash
awk '{ print }' data.txt
awk '{ print $0 }' data.txt # $0表示本行内容 同上

# 打印第一个字段
awk '{ print $1 }' data.txt

# 指定列分隔符
awk -F: '{ print $1 }' /etc/passwd

# 同上
awk 'BEGIN {
FS=":"
}
{ print $1 }' /etc/passwd

awk -F: '/admin/{ print }' /etc/passwd
awk -F: '/admin/{ print $2 }' /etc/passwd

# 第2列匹配正则
awk '$2 ~ /cool/ { print $1 }' data.txt
# 正则不匹配
awk '$3 !~ /bad/ { print $1 }' data.txt

awk 'BEGIN {
FS=":"
}
$1 == "root" { print $0 }' /etc/passwd

# 其他比较运算符 != > <

# 条件语句

awk 'BEGIN {
FS="-"
}
{ if ( $2 ~ "etc" ) { print $1 } }' data.txt


# 支持逻辑运算符 && ||
awk 'BEGIN {
FS="-"
}
( $1 ~ "blue" || $2 ~ "red" ) { print }' data.txt

# 算术运算
awk 'BEGIN {
x=0
}
/^$/ { x=x+1 }
END { print "found" x "empty lines" }' data.txt

# 支持浮点数运算

# 第2列平方后+1
awk '{ print ( $2^2 ) + 1 }' math.txt

# 有用的变量
NF # number of fields
# 只显示列数是3的行
awk 'NF == 3 { print }' data.txt

awk '{ if ( NF > 2) { print $1 " " $2 ":" $3 } }' data.txt

# NR 当前的行号
awk '{ if ( NR > 3 ) { print NR".\t"$0 }' data.txt


```

## awk 中的循环结构

```bash
awk '{
 i = 1
 while ( i <= 3) {
  print $i
  i++
 }
}' data.txt

awk '{
 for ( i = 1; i <= 3; i++)
   print $i
}'  data.txt
```

## awk中的数组

awk里的数组索引从1开始

```bash
awk 'BEGIN {
arr[0]="one"
arr[1]="long"

for ( x in arr ) {
 print arr[x]
}
}'


```

awk支持字符串索引， 即关联数组/对象

```bash
awk 'BEGIN {
arr["name"]="zoro"
arr["skill"]="sword"

for ( x in arr ) {
  print x": "arr[x]"
}
}'

delete arr[3] # 可删除数组元素

# 判断数组是否具有某个索引
awk 'BEGIN {
arr["name"]="zoro"

if ( "cname" in arr ) {
 print "yes"
} else {
 print "no"
}
}'

```

## 在awk中使用shell变量

```bash
# 变量替换方式使用shell变量

#!/bin/bash

read -p "enter search pattern: " pattern

awk "/$pattern/"'{ count++; print } END { print "match count: " count }' data.txt


# awk -v 设置awk变量
#!/bin/bash

read -p "enter search pattern: " pattern

# awk -v 选项指定awk变量pat
awk -v pat="$pattern" '$0 ~ pat { count++; print } END { print "match count: " count }' data.txt

# awk可以访问shell的环境变量

awk 'BEGIN { print ENVIRON["PATH"] }'


```

## 使用awk命令的返回值

```bash
uid=`awk -F: '/^alice/{print $3}' /etc/passwd `
echo $uid

# awk返回多个值
cmd=`awk -F: '{ if ($1 ~ "alice") print "uid="$3 ";user="$1 }' /etc/passwd`
echo $cmd
eval $cmd
echo $uid $user

# 还可以把awk的输出重定向到临时文件, 然后source导入执行

```



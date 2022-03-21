# shell编程基础

## shellbang

`#!/usr/bin/bash` 首行shellbang指明用哪种解析器执行下面脚本

若没有首行shellbang, 则用默认shell解析

## 注释

`#` 作为注释符

here document 添加多行注释

```bash
echo "hello"
<<KK
echo line one
echo line two
KK
echo the end

```

## 执行脚本

```bash
chmod a+x hi.sh
./hi.sh

bash hi.sh
```

## shell变量进阶

### bash中的参数扩展

字符`$`会引导参数扩展

基本的参数扩展
$varname
${varname}

`$2` 位置参数/变量
`$_` `$@` 特殊参数/变量


变量名区分大小写

间接参数扩展 ::增加了灵活性，引用的变量可以是动态的

```bash
color=blue
age=23
fav=tv
read -p '查看哪个变量的值? color/age/fav' varname
echo ${!varname}
```


大小写修改 bash4.0

```bash
color=blue
echo ${color^} # Blue 
echo ${color^^} # BLUE
title="APEACE"
echo ${title,} # aPEACE
echo ${title,,} # apeace
echo ${title~} # 同 ,
echo ${title~~} # 同 ,,

# 文件重命名为小写文件名
for cfile in *.txt
do
  mv $cfile ${cfile,,}
done

```

变量名扩展

${!prefix*}
${!prefix@}
列出以prefix开头的所有变量名

```bash
echo ${!BASH*} # 查看所有BASH开头的变量名
echo ${!BASH@} # 同上

```


删除字符串

`#` 表示从头开始匹配
${param#pattern} 非贪婪模式 
${param##pattern} 贪婪匹配模式

`%` 表示从末尾开始匹配
${param%pattern}
${param%%pattern}

```bash
con="hello it is wonderful"
echo ${con#* } # 模式为 任意个字符+空格 it is wonderful
echo ${con##* } # wonderful
echo ${con#it} # 没有在开头匹配到it 所以原样输出
echo ${con% *} # 模式为 空格+任意个字符 hello it is
echo ${con%% *} # hello  

myfile=op.jpg
echo ${myfile%.*} # 删除后缀
echo ${myfile#*.} # 删除文件名

fpath=/home/jie/image/nami.jpg
echo ${fpath%/*} # 删除文件名
echo ${fpath##*/} # 删除目录路径
```


字符串替换

${param/pattern/string} # 非贪婪模式
${param//pattern/string} # 贪婪模式

${param/pattern} # 非贪婪模式 没有指定替换内容 则等同替换为空串(即删除匹配) 
${param//pattern}  # 贪婪模式

```bash
txt="is this your book"
echo ${txt/is/MM}
echo ${txt//is/MM}
echo ${txt//is}

```

获取字符串长度

${#param}


获取子字符串

${param:offset}
${param:offset:length}

```bash
con='hello world'
echo ${con:6} # world
echo ${con:1:3} # ell

```

使用默认值

${param:-defval} # 未定义或者为空时，使用默认值 `-`非赋值
${param-defval} # 未定义时，使用默认值

```bash
unset yourAge
echo $yourAge
echo ${yourAge:-20} # 20
echo $yourAge # 依然为空
yourAge=${yourAge:-20} # 赋值
echo $yourAge # 20
```

为变量指定默认值

${param:=defval} # 未定义或为空时，把默认值赋值给变量
${param=defval} # 未定义时，把默认值赋值给变量

```bash
echo ${color=blue} > /dev/null
echo $color

echo ${fav:=comic} > /dev/null
fav=${fav:-comic} # 同上
```

使用替代值

${param:+newval}  # 变量有定义并且有值时，采用替代值
${param+newval} # 变量有定义，则替换

```bash
book=home
echo ${book:+world} # world
book=
echo ${book:+world} # 空 变量有定义但是空，所以不替换
echo ${book+park} # park 有定义就替换
```

提示错误信息

${param:?warntips} # 提示并报错
${param?warntips}

### bash内部变量

- $BASH
- $HOME
- $IFS 字段分隔符

```bash
set x y z # 设置位置参数的值 $1 == x , $2 == y
IFS=":;-" # 指定字段分隔符
echo "$*" # x:y:z
```

- $SECONDS 脚本运行多少秒
- $TMOUT read等待输入的时间，超时将终止脚本


### 位置参数

位置参数适用于脚本和函数，`$0` 表示脚本自身 `$1`表示第一个参数，以此类推
set 命令可以修改位置参数的值， 位置参数不能通过赋值语句修改
shift 命令，位置参数移除队列


### 特殊参数

- `$*` 所有位置参数
- `$@` 所有位置参数
- `$#` 参数个数
- `$?` 上个命令的返回值
- `$_` 上个命令的最后参数
- `$$` 当前进程id
- `$!` 最近的后台进程id
 

### 用declare声明变量的类型

shell变量默认都是字符串类型

declare 和 typeset 完全相同，声明变量类型或显示变量

```bash
declare # 显示所有自定义变量 内置变量和函数
declare -r count=10 # 声明为只读变量
readonly count=10 # 同上
unset count # 只读变量也不允许删除

declare -i age # 声明整型变量 任务值赋值给整型变量都会进行整型转换
age=23; echo $age # 23
age=good; echo $age # 0
age=9/2; echo $age # 4

declare -x liveTimes # 后续命令可用
declare -p age # 显示变量的属性和值

```
### 数组变量
数组无大小限制，无须连续分配

```bash
# 间接声明一个数组

friends[0]=nami
friends=(nami zoro sange)
declare -p friends

# 显式声明数组

declare -a friends
declare -a colors=(green blue red)
declare -p colors

echo ${colors[1]} # 第二个元素
echo $colors # 默认访问第一个元素 同 ${colors[0]}
echo ${colors[*]} # 所有元素
echo ${colors[@]} # 所有元素 

colors[2]=yellow # 修改第三个元素

# 删除元素和数组
unset colors[2]
echo ${colors[*]}

unset colors
declare -p colors

```

## Bash的算术运算

支持各种常见的运算符, `n++` `**` `>>` `*` `%` `expr?expr1:expr2` `expr1,expr2`

```bash
let val=5**2  # 注意等号后面部分不能由空格
let nval="5 ** 2" # 等号后面用引号，则可以包含空格
let val=9%2
let val+=10

echo $(( 2 && 3 )) # 1, $() 命令扩展,  (...) 表达式求值

let val=(2+3, 10-5, 20-7) # 逗号连接多个表达式，只有最后一个表达式的值被返回

```

### 数字常量

- `012` 八进制
- `0x23` 十六进制
- `2#111` 二进制
- `n#numbers` n进制

### 算术运算

- `$((expr1))` 算术扩展
- `let expr1` let命令
- `expr expr1` expr 命令


```bash
# 算术扩展
age=9
height=$(( $age + 8 ))

# $((..)) 可以嵌套
a=3
b=1
echo $(( $(( a>b )) ? a : b )) # 3

# let 和 $((...)) 算术扩展基本一样
let i=i+5
let i="i + 5"
let "i=i + 5"

let "i = i<6 ? i : 7"

# expr命令
echo `expr 3 + 2` # 运算符两边必须包含空格
expr 7 \* 3 # 乘号需要转义
expr 4 \< 2 # < > 都需要转义

expr $a \* $b
c=$( expr $a \* $b ) # expr命令的结果赋值给c

```
### 退出脚本 exit [code] 退出脚本，并返回退出状态码

退出状态码

- `0` 无错误 成功执行
- `非0` 有错误发生

函数的退出状态码，默认是由最后一条语句决定

`$?` 获取上一条命令的退出状态码

```bash
cd /tmp/codes
if [ $? -eq 0 ]; then
  rm -rf *
else
  echo 'no this dir'
  exit 1
fi

```

### 调试脚本

bash -x demo.sh 调试模式运行脚本

bash选项设置
- `set -选项` 关闭选项
- `set +选项` 开启选项

```bash
# 临时开启调试某段脚本
set +x
echo one
echo $name
set -x

```

bash -v demo.sh 详细模式运行脚本

bash -x -v demo.sh 调试+详细模式

调试相关内部变量:
- `LINENO` 行号
- `FUNCNAME` 当前执行的函数名

export PS4='+ $LINENO:${FUNCNAME[0]}'

bash -n demo.sh 检查有无语法错误




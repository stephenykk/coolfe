# 脚本输入处理

## 参数处理

只有一个参数时，用case处理即可
当有多个参数时，位置参数就需要记住每个位置的参数含义，调用比较麻烦；选项就好比js中的option, 可以任意顺序指定选项，更容易使用

> shopt -s nocasematch  # 开启忽略大小写 case 和 '[[' 命令忽略大小写进行匹配测试
> shopt -u nocasematch # 关闭


## shift命令处理位置参数

`shift`命令类似js的 arr.shift() 方法

`shift`是bash的内部命令，用于将位置参数(1...$#)向左移动，小于1的丢弃

`shift [n]`

```bash
# walk.sh
while [ $# -ne 0 ]
do
  echo "current param: $1 remaining $#"
  shift
done
# bash walk.sh hello how are you

# for 遍历参数

for arg in $@
do
 echo "arg: $arg"
done

```

## 选项处理

用 case 语句处理命令行选项

只有1-2个选项时，比较好用

```bash

opt=$1
fname=$2

function checkfile() {
  if [ -z $fname ]
  then
    echo "file name missing"
    exit 1
  elif [ ! -f $fname ]
  then
    echo "$fname donot exist"
    exit 2
  fi

}


case $opt in
  -e|-E)
    checkfile
    echo "editing $fname file..."
    ;;
  -p|-P)
    checkfile
    echo "print $fname file.."
    ;;
  *)
    echo "bad argument"
    echo "usage: `basename $0` -e|-p filename"
esac


```


## getopts处理多个选项

getopts 是bash的内部命令, getopts定义在POSIX中

> getopts不能解析GNU风格的长选项 `--myoption`

没有参数可解析时，getopts退出状态非0

遇到第一个非选项值，停止解析； 遇到 `--` 停止解析

getops解析会用到的三个变量:

- OPTIND 下一个要处理的参数的索引，初始为1
- OPTARG 解析到哪个选项
- OPTERR bash是否显示getopts解析错误 0 或 1, 默认为1


基本语法

getopts optstring varname [args...]

- optstring 有哪些选项
- varname 用于保存解析到的选项名的变量
- args  解析指定的参数，而不是位置参数

错误报告模式

- 详细模式
- 抑制模式

```bash
# optstring 第一个字符为:, 表示错误抑制模式
while getopts ":a" opt 
do
  case $opt in
    a)
      echo "get options -a"
      echo "OPTARG: ${OPTARG}" # 空，解析失败才会赋值
      echo "OPTERR: ${OPTERR}" # 1 ??
      ;;
    \?)
      echo "invalid option -${OPTARG}"
      echo "OPTERR: ${OPTERR}"
      ;;
  esac
done


```

另一个例子

```bash
vflg=off
filename=''
output=''

function usage() {
  echo "usage: `basename $0` [-h] [-v] [-o <filename>] [-f <filename>]"
  exit -1
}

# optstring 后面的:表示代选项值
while getopts ":hvf:o:" opt
do
  case "$opt" in
    v)
      vflag=on
      ;;
    f)
      filename=$OPTARG # 带选项值时， OPTARG保存的是值，非选项名
      if [ ! -f $filename ]
      then
        echo "$filename file not exists"
        exit
      fi
      ;;
    o)
      output=$OPTARG
      if [ ! -d `dirname $output` ]
      then
        echo "output path `dirname $output` not exists"
        exit
      fi
      ;;
    h)
      usage
      exit
      ;;
    :)
      # 没有为需要值的选项指定值，则提示
      echo "the option -$OPTARG requires an argument"
      exit 1
      ;;
    \?)
      # 解析到无效选项，提示
      echo "invalid option -$OPTARG"
      usage
      exit 2
      ;;
  esac
done

function logvar() {
 for var in $*
 do
   echo "$var: ${!var}"
 done
}


logvar vflag filename output

```


## getopt命令解析选项

getopt是linux下的命令行工具，支持长选项 `--myoption` 

getopt语法

getopt [options] [--] optstring params

```bash
## betteropt.sh
# 解析命令行位置参数，并设置命令行参数
# 如 betteropt.sh -vlf image/a.jpg => betteropt.sh -v -l -f image/a.jpg
# set 命令 设置位置参数
set -- `getopt f:vl "$@"`

while [ $# -ne 0 ]
do
  echo $1
  shift
done


```

更常见的例子

```bash
vflg=off
filename=''
output=''

function usage() {
  echo "usage: `basename $0` [-h] [-v] [-o <filename>] [-f <filename>]"
  exit -1
}

# optstring 后面的:表示代选项值
set -- `getopt ":hvf:o:" "$@"`

while [ $# -gt 0 ] 
do
  case "$1" in
    -v)
      vflag=on
      ;;
    -f)
      filename=$2 
      if [ ! -f $filename ]
      then
        echo "$filename file not exists"
        exit
      else
        shift
      fi
      ;;
    -o)
      output=$2
      if [ ! -d `dirname $output` ]
      then
        echo "output path `dirname $output` not exists"
        exit
      else
        shift
      fi
      ;;
    -h)
      usage
      exit
      ;;
    --)
      shift
      break
      ;;
    -*)
      # 解析到无效选项，提示
      echo "invalid option -$OPTARG"
      usage
      exit 2
      ;;
    *)
      break
  esac

  # !! 移动参数
  shift

done

function logvar() {
 for var in $*
 do
   echo "$var: ${!var}"
 done
}


logvar vflag filename output

```

## 获取用户的输入

read命令读取输入

语法

read [-p prompt] [varName1 varName2...]

每次从标准输入读取一行内容，第一个单词赋值给varName1，第二个单词赋值给varName2

```bash
read -p "input some words: " first second
echo $first
echo $second


# inputEmail.sh
read -p "enter your name: " username
read -p "enter your email: " email
read -p "sure to continue? [y/n] " answer

function logvar() {
  for var in $@
  do
    echo "${var}: ${!var}"
  done
}

case $answer in
  [yY]*)
    logvar username email
    ;;
  [nN]*)
    exit
    ;;
  *)
    echo "wrong answer"
    exit
    ;;
esac

# -t timeout 指定超时时间, 若超时则read失败
read -t 3 -p "input your name: " user 

# -s silent 指定不显示用户输入 
read -s -p "input your password: " pass

# -n 指定读取到n个字符就返回结果
read -n 1 "input y or n?" isOK

```
## 从文件中读取

```bash
old_ifs=$IFS
IFS=$'\n'
for line in $(cat data.txt)
do
 echo $line
done
IFS=$old_ifs

```




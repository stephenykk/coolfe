# shell 函数


shell函数是语句组成的代码块，功能封装和复用

```bash
# 语法

funcName() {
 cmd
}

function funcName() {
  cmd
  return intVal
}


unset -f funcName # 取消函数定义



```


## 函数传参

函数也用位置参数 `$1` `$2` `$*` `$@` `$#`  等获取传入参数

```bash

function hi() {
  arg1=$1
  arg2=$2
}

hi kk good # 调用函数

```


## 本地变量

默认情况下，脚本中的所有变量都是全局的

函数内修改变量，将影响脚本其他地方

```bash
color=blue

echo "before: $color" # blue

function change() {
  color=red
}
change

echo "after: $color" # red

```

声明本地变量:
local 命令只能在函数内部使用

- `local varName=value`
- `local varName`

```bash
color=blue

echo "before: $color" # blue

function change() {
  local color=red
  echo "color in fn: $color" # red
}
change

echo "after: $color" # blue

```

## return 返回函数的结果

没有return语句，则函数默认返回最后一条命令的结果

`return n` 可返回 `1-255` 范围内的数值

函数也可以通过echo 返回计算结果 `result=$(getname foo)`

```bash
function getname() {
  surfix="$1"
  echo "hi!"
  echo "alice $surfix"
  return 2

}


getname xiao 

echo "result: $?" # 2

result=$(getname li) # 函数的输出赋值给变量result

echo "$result" # hi! \n alice li

```

## 函数的调用方式

- shell命令行调用
- 脚本中调用 (*确保先定义，后调用*)
- 递归调用


加载shell脚本:

- `. /path/to/demo.sh`
- `source /path/to/demo.sh`

```bash
# 递归调用例子

function factorial() {
  local i=$1
  local f
  declare -i i
  declare -i f

  [ $i -le 2 ] && echo $i || { f=$(( i - 1 )); f=$(( $(factorial f) * i )); echo $f; }
}

```

## 函数放在后台执行

`&`操作符可以将命令/函数放在后台执行

```bash
function progress() {
  echo  "$0: please wait..."

  while true
  do
    echo -n '.'
    sleep 3
  done
}

echo "start..."

progress &
progpid="$!"

echo "do my jobs"
sleep 12

kill $progpid >/dev/null 2>&1

echo "the end.."
```


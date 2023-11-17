# shell的条件执行


条件测试:
- 文件属性测试 `[ -d $dir ]`
- 字符串测试 `[ $user == 'alice' ]`
- 算术测试 `[ $age -eq 10 ]`

### test命令

test命令 测试成功返回 0； 失败返回 1

```bash
test -d "$HOME"; echo $? # 0 测试成功

[ "abc" != "hero" ]; echo $? # 0

test 7 -gt 3 && echo True || echo False # True

```

文件属性测试相关操作符:
- `-e` 存在文件/文件夹
- `-f` 是文件
- `-d` 是文件夹
- `-c` 是字符文件
- `-b` 是块文件
- `-x` 可执行文件
- `-w` 可写文件
- `-s` 文件存在且不为空
- `-nt` 左边文件比右边文件新


字符测试相关操作符：
- `-z` 为空 长度为0
- `-n` 长度不为0
- `str1 = str2`
- `str1 != str2`
- `str1 > str2`
- `str1 < str2`

```bash
test 'abc' = 'hi'
test 'abc' != 'hi'
test 'go' \< 'home'
test 'go' \> 'home'
[ -z $user ]; echo $?
[ -n $user ]; echo $?

```

算术测试相关操作符:
- `num1 -eq num2`
- `num1 -lt num2`
- `num1 -gt num2`
- `num1 -ne num2`
- `num1 -le num2`
- `num1 -ge num2`

> `[` 同 test 命令

`[[]]` 是增强版的测试命令, 它是关键字，不是一个程序

### if语法

if test-command; then  yes-job; fi

if test-command; then
  yes-job
fi

if test-command
then
  yes-job
fi

```bash
read -sp "enter your password: " pass
if test "$pass" == "good"
then
  echo -e "\nwelcome"
  exit 0
else
  echo -e "\nnot valid"
  exit 1
fi

# if...elif..else..fi
if [ $1 -gt 0 ]
then
  echo "input a positive number"
elif [ $1 -lt 0 ]
then
  echo "input a negative number"
else
  echo "input number 0"
fi


### 条件执行

`&&` 第一个语句成功，才会执行后面的语句
`||` 第一个语句执行成功，就不会执行后面的语句； 反之，就会

```bash
rm some/file.txt && echo "file deleted"
grep "^alice" /etc/passwd && echo "found account alice"

# 多个test命令的结果，做逻辑运算

if [ -n $val ] && [ -e $val ]
then
  echo "input a exist file or dir"
fi

# [[ expr ]] 内部做逻辑运算
if [[ -n $val && -e $val ]]
then
  echo "input an exists file or dir"
fi

# [ expr1 -a expr2 ] []内部也可以做逻辑运算

if [ -n $1 ] && [ -e $1 ]
then
  echo "yes 1"
fi

if [[ -n $1 && -e $1 ]]
then
  echo "yes 2"
fi

if [ -n $1 -a -e $1 ]
then
  echo "yes 3"
fi


```


### 逻辑或 ||

cmd1 || cmd2 前面的命令失败，才会执行后面的

```bash
grep "^alice" /etc/passwd || echo "not found alice"
# 三目运算效果
test $(id -u) -eq 0 && echo "you are root" || echo "you are not root"

# [] 结果 做逻辑运算
if [ "$val" -eq 12 ] || [ "$val" -eq 21 ]
then
  echo "success"
else
  echo "fail"
fi

```

### 逻辑非 !

```bash
[ ! -d /home/codes ] && mkdir /home/codes || ls /home/codes

# 同上
if [ ! -d /home/codes ]
then
  mkdir /home/codes
else
  ls /home/codes
fi

```

### case 多分支选择

case 相比 `if...elif..else..fi`结构更简单一些


```bash
# 语法
case expr in
pattern1)
  job1
  ;;
pattern2)
  job2
  ;;
*)
  job-else
esac


# 例子
if [ $# -lt 2 ]
then
  echo "usage: $0 signal pid"
  exit
fi

case "$1" in
  1)
    echo "send SIGHUP signal to PID $2"
    kill -SIGHUP $2
    ;;
  2)
    echo "send SIGINT signal to PID $2"
    kill -SIGINT $2
    ;;
  9)
    echo "send SIGKILL signal to PID $2"
    kill -SIGKILL $2
    ;;
  *)
    echo "send signal number $1 is not processed.."
    ;;
esac

```


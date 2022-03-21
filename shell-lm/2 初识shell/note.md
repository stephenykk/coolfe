# notes

## 用户登录时，如果用的是bash, bash将使用的初始化文件和启动脚本如下：
- `/etc/profile`
  定义一些环境变量，系统级的初始化文件，由登录shell调用执行
- `/etc/bash.bashrc` 或 `/etc/bashrc`
  定义一些函数和别名, 交互式shell的系统级启动脚本
- `/etc/bash.logout`
  登录shell的清理脚本，登录shell退出时执行，_部分linux发行版没有该文件_
- `$HOME/bash_profile`, `$HOME/.bash_login`,  `$HOME/.profile` 
   用户个人的初始化脚本，按顺序查找，由登录shell执行，只执行一个
- `$HOME/.bashrc`
  用户个人交互式shell的启动脚本
- `$HOME/.bash_logout` 
  用户个人的登录shell清理脚本
- `$HOME/.inputrc` 
  用户个人的readline启动脚本，定义按键映射 


## 其他
```bash
echo $SHELL
cat /etc/shells
```
## SHELL变量

### SHELL变量的类型

- 系统变量
  由系统创建和维护，如: PS1, PATH, HISTSIZE, HOME, HOSTNAME, IFS, PWD, SHELL, 可修改系统变量配置shell的样式 

  > 查看所有系统变量 env 或 printenv

- 用户自定义变量
  由用户创建的变量

### 定义变量

varname=varvalue

_等号两边不能由空格_

```bash
color=blue
color="light blue"

age=10 # 默认变量值都是字符串类型
let age=$age+1 # 使用let命令进行算术计算
let age="$age + 1" # 同上

curdir=`pwd` # 将命令执行结果赋值给变量
today=`date +%y%m%d`
now=$(date +%y%m%d) # 同上


read -p "please input your name: ' username
echo $username # 把用户输入的内容赋值给变量

```

shell 变量名区分大小写
 
打印变量值
```bash
curdir=`pwd`
echo $curdir

# echo -e 开启支持转义符
echo 'hello\nworld'
echo -e 'hello\nworld'

# printf <format> <arguments...>
printf "%s\n" $curdir


# 用 ${} 知名变量名边界，避免歧义
language=java
echo "i like ${language}script"

```
 
  
运行shell脚本时，系统会为该脚本创建子shell，脚本执行完毕，子shell终止，环境返回到执行该脚本前的shell


*导出变量 export*

用户自定义的变量只在当前shell可用，要使自定义变量能被子shell使用，需要用 export 命令将变量导出

export [-fnp] [变量名/函数名]=[值]

```bash
girl=alice
echo $girl
export girl

bash
echo $girl
```

*删除变量*

unset [-fv] varname

```bash
captin=lufy
echo $captin
unset captin
echo $captin

# 不能删除只读变量
readonly cook=sanji
unset cook
echo $?
```

*检测变量是否存在*

```bash
captin="" # var is empty
echo ${captin? var not define yet}

echo ${captin:? var not define or empty}

```

## 历史命令

历史命令保存在 `~/.bash_history` ，`$HISTSIZE`环境变量设置来历史命令缓冲区的大小

- `ctrl + r` 搜索历史命令
- `!!` 执行上一条命令
- `!序号` 执行指定序号的历史命令
- `!keyword` 搜索以keyword开头的命令 并执行
- `!?keyword` 搜索匹配keyword的命令 并执行
- `$_` 上条命令的最后参数

## shell 中的扩展

大括号扩展

```bash
echo a{b,c,d}color # 注意逗号两边不能由空格
echo a{b..h}color
echo txt{1..10}
echo text{3..-3}
echo file_{a..e}
echo {a..c}{1..3}
echo file_{a,b{1..3},c}.txt # 扩展竟然还能嵌套
mkdir ./{dir1,dir2,dir3}

```

大括号扩展新语法 bash4.0

{<start>..<end>..<inc>}

```bash
echo file{1..10..3}
echo file{a..z..3}
echo file{001..100..5} # 固定宽度
```


波浪号扩展

```bash
echo ~
cd ~
echo ~alice # 打印用户alice的主目录
echo ~+  # 当前目录 同 echo $PWD
echo ~- # 上一个目录 同 echo $OLDPWD
```
命令替换

$(cmd)  或者 `cmd`

```bash
echo $(uptime)
echo `date`
```
命令替换支持嵌套, 内层反引号需要\转义


文件名扩展

- `*` 匹配任意个字符
- `?` 匹配任意单个字符
- `[..]` 匹配方括号内的任意字符 _同正则 表示字符集_

```bash
ls /etc/*.conf
ls ./image?.jpg
ls ./[ab]*.js
touch fo{a..c}
echo aoo > foa
echo boo > fob
echo coo > foc
cat fo[a-c]
cat fo[abc]  # 同上
```

创建别名

alias name='command'

查看别名

alias
alias <name>

> `~/.bashrc`中新建自己的别名，保存后，重新打开bash才生效

```bash
alias echo='ls -a' # 别名和内置命令同名时，内置命令被屏蔽
\echo  hello # 不解析别名 执行内置命令echo
```

删除别名

```bash
unalias -a # 删除所有别名
unalias mydir # 删除具体某个别名

```

修改命令行提示符

修改PS1环境变量, echo $PS1
export PS1="[\t] \u@\h\n\$"


## 设置shell选项
用 set 和 shopt 控制bash的行为
```bash
set -o  # 查看选项列表

set -o feature-name # 开启选项
set +o feature-name # 关闭选项

shopt # 显示选项列表
shopt -s feature-name # 开启选项
shopt -u feature-name # 关闭选项

```

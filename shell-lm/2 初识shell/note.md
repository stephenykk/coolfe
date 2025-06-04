# 炼气技术栈 Shell 脚本：从基础启程

Shell 是 Linux 系统中的命令行解释器，是我们与计算机"对话"的重要工具。就像学习任何新语言一样，掌握 Shell 需要了解它的基本语法、常用命令和运行环境。

本文将介绍 Shell 的基础知识，包括：

-   Shell 启动时如何加载配置文件
-   变量的定义和使用方法
-   命令历史和快捷操作技巧
-   常见的命令行扩展功能

无论你是第一次接触命令行，还是想系统性地复习 Shell 知识，这些内容都能帮助你更高效地使用终端.

## Shell 启动时如何加载配置文件

当我们打开终端使用 Shell 时，系统会自动读取一些配置文件来设置工作环境。这就像我们进入办公室时会打开灯、调整空调一样，Shell 也需要根据配置文件来准备一个舒适的工作环境。

这些配置文件主要分为两类：

1. **登录时加载的配置**

    - 当你通过 SSH 登录或打开终端登录时，Shell 会读取：
        - `/etc/profile`（全公司统一的办公环境设置）
        - `~/.bash_profile` 或 `~/.profile`（你的个人办公桌布置）

2. **交互时加载的配置**
    - 当你打开新的终端窗口时，Shell 会读取：
        - `/etc/bashrc`
        - `~/.bashrc`

重要配置文件的用途：

-   `/etc/profile` → 全系统通用的环境设置
-   `~/.bash_profile` → 你的个人登录设置
-   `~/.bashrc` → 你的日常终端使用习惯
-   `~/.bash_logout` → 退出登录时自动执行的清理工作

小贴士：

1. 修改配置文件后，可以运行 `source ~/.bashrc` 立即生效
2. 个人配置文件通常在你的家目录下，文件名以点开头（隐藏文件）
3. 不同 Linux 发行版可能有些文件名差异，比如有的用`.profile`而不是`.bash_profile`

## Shell 类型: 登录 Shell 与交互式 Shell

Shell 可以分为两种主要类型：

1. **登录 Shell(Login Shell)**

2. **交互式 Shell(Interactive Shell)**

## 查看 Shell

Shell 有很多种类，比如 bash、sh、csh、ksh 等，不同的 shell 有不同的特点，但它们都可以作为 linux 系统的 shell。

```bash
# 查看当前用户的默认shell
echo $SHELL
# 查看系统支持的所有Shell
cat /etc/shells
```

## SHELL 变量

### SHELL 变量的类型

-   系统变量
    由系统创建和维护，如: `PS1`, `PATH`, `HISTSIZE`, `HOME`, `HOSTNAME`, `IFS`, `PWD`, `SHELL`, 可修改系统变量配置 shell 的样式

    > 查看所有系统变量 `env` 或 `printenv`

-   用户自定义变量
    由用户创建的变量

### 定义变量

语法规则：变量名=变量值，变量名和变量值之间不能有空格

```bash
color=blue
color="light blue"
```

默认变量值都是字符串类型，如果需要使用数值计算，需要使用`let`命令

```bash
age=10
let age=$age+1 # 使用let命令进行算术计算
let age="$age + 1" # 同上
```

可以将命令输出内容赋值给变量, 使用反引号或`$()`包裹命令,这非常有用！  
不同于其他高级语言，函数会返回各种类型的值，shell 函数通常只返回 0 或 1 表示成功或失败，返回值是函数的退出状态码，如果返回值是 0 表示成功，非 0 表示失败。如果要返回其他内容，就需要用 `echo` 命令输出，然后赋值给变量。

```bash
curDir=`pwd` #
today=`date +%y%m%d`
now=$(date +%y%m%d) # 同上
```

读取用户输入的内容赋值给变量

```bash
read -p "please input your name: ' username
echo $username

```

shell 变量名区分大小写

```bash
color=blue
echo $color # blue
echo $Color # print nothing
```

打印变量值

```bash
curDir=`pwd`
echo $curDir

# echo -e 开启支持转义符
echo 'hello\nworld'
echo -e 'hello\nworld'

# printf <format> <arguments...>
printf "%s\n" $curDir


# 用 ${} 指定变量名边界，避免歧义
language=java
echo "i like ${language}script"

```

运行 shell 脚本时，系统会为该脚本创建子 shell，脚本执行完毕，子 shell 终止，环境返回到执行该脚本前的 shell

_导出变量 export_

用户自定义的变量只在当前 shell 可用，要使自定义变量能被子 shell 使用，需要用 export 命令将变量导出

`export [-fnp] [变量名/函数名]=[值]`

```bash
girl=alice
echo $girl
export girl

bash
echo $girl
```

_删除变量_

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

_检测变量是否存在_

```bash
captin="" # var is empty
echo ${captin? var not define yet}

echo ${captin:? var not define or empty}

```

## 历史命令

历史命令保存在 `~/.bash_history` ，`$HISTSIZE`环境变量设置来历史命令缓冲区的大小

-   `ctrl + r` 搜索历史命令
-   `!!` 执行上一条命令
-   `!序号` 执行指定序号的历史命令
-   `!keyword` 搜索以 keyword 开头的命令 并执行
-   `!?keyword` 搜索匹配 keyword 的命令 并执行
-   `$_` 上条命令的最后参数

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

`{<start>..<end>..<inc>}`

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
echo ~/.bashrc # 波浪号扩展不能用引号包裹
echo "~/.bashrc" # 只是输出字符串 ~/.bashrc
```

命令替换

`$(cmd)` 或者 `cmd`

```
echo $(uptime)
echo `date`
```

命令替换还可以嵌套

````
function getDateFormat() {
  echo '+%Y-%m-%d %H:%M:%S'
}
echo $(date $(getDateFormat))
echo `date \`getDateFormat\``
echo `date $(getDateFormat)`

文件名扩展

-   `*` 匹配任意个字符
-   `?` 匹配任意单个字符
-   `[..]` 匹配方括号内的任意字符 _同正则 表示字符集_

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
````

创建别名

alias name='command'

查看别名

alias
alias <name>

> `~/.bashrc`中新建自己的别名，保存后，重新打开 bash 才生效

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

修改 PS1 环境变量, echo $PS1
export PS1="[\t] \u@\h\n\$"

## 设置 shell 选项

用 set 和 shopt 控制 bash 的行为

```bash
set -o  # 查看选项列表

set -o feature-name # 开启选项
set +o feature-name # 关闭选项

shopt # 显示选项列表
shopt -s feature-name # 开启选项
shopt -u feature-name # 关闭选项
```

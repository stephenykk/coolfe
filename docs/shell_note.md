# Linux Shell脚本学习指南（超详细）

[Shell脚本：Linux Shell脚本学习指南（超详细）](http://c.biancheng.net/shell/)

## 简介

Shell 既是一个连接用户和 Linux 内核的程序，又是一门管理 Linux 系统的脚本语言。Shell 脚本虽然没有 C++、Python、Java、C# 等编程语言强大，但也支持了基本的编程元素，这是本教程要重点讲解的。

## shell的概念

对于图形界面，用户点击某个图标就能启动某个程序；对于命令行，用户输入某个程序的名字（可以看做一个命令）就能启动某个程序。这两者的基本过程都是类似的，都需要查找程序在硬盘上的安装位置，然后将它们加载到内存运行。

**换句话说，图形界面和命令行要达到的目的是一样的，都是让用户控制计算机。**

然而，真正能够控制计算机硬件（CPU、内存、显示器等）的只有操作系统内核（Kernel），图形界面和命令行只是架设在用户和内核之间的一座桥梁。


**Shell 是一个应用程序，它连接了用户和 Linux 内核，让用户能够更加高效、安全、低成本地使用 Linux 内核，这就是 Shell 的本质。**

Shell 本身并不是内核的一部分，它只是站在内核的基础上编写的一个应用程序，它和 QQ、迅雷、Firefox 等其它软件没有什么区别。然而 Shell 也有着它的特殊性，就是开机立马启动，并呈现在用户面前；用户通过 Shell 来使用 Linux，不启动 Shell 的话，用户就没办法使用 Linux。


### Shell 是如何连接用户和内核的？

Shell 能够接收用户输入的命令，并对命令进行处理，处理完毕后再将结果反馈给用户，比如输出到显示器、写入到文件等，这就是大部分读者对 Shell 的认知。你看，我一直都在使用 Shell，哪有使用内核哦？我也没有看到 Shell 将我和内核连接起来呀？！

其实，Shell 程序本身的功能是很弱的，比如文件操作、输入输出、进程管理等都得依赖内核。我们运行一个命令，大部分情况下 Shell 都会去调用内核暴露出来的接口，这就是在使用内核，

接口其实就是一个一个的函数，使用内核就是调用这些函数。这就是使用内核的全部内容了吗？嗯，是的！除了函数，你没有别的途径使用内核。

比如，我们都知道在 Shell 中输入 `cat log.txt` 命令就可以查看 log.txt 文件中的内容，然而，log.txt 放在磁盘的哪个位置？分成了几个数据块？在哪里开始？在哪里终止？如何操作探头读取它？这些底层细节 Shell 统统不知道的，它只能去调用内核提供的 `open()` 和 `read()` 函数，告诉内核我要读取 log.txt 文件，请帮助我，然后内核就乖乖地按照 Shell 的吩咐去读取文件了，并将读取到的文件内容交给 Shell，最后再由 Shell 呈现给用户（其实呈现到显示器上还得依赖内核）。整个过程中 Shell 就是一个“中间商”，它在用户和内核之间“倒卖”数据，只是用户不知道罢了。

### Shell 还能连接其它程序

在 Shell 中输入的命令，有一部分是 Shell 本身自带的，这叫做内置命令 (如: `type echo`)；有一部分是其它的应用程序（一个程序就是一个命令），这叫做外部命令 (如 `type uname`)

> 内置命令用 help cmd 查看帮助  
> 外部命令用 man cmd  查看帮助

Shell 本身支持的命令并不多，功能也有限，但是 Shell 可以调用其他的程序，每个程序就是一个命令，这使得 Shell 命令的数量可以无限扩展，其结果就是 Shell 的功能非常强大，完全能够胜任 Linux 的日常管理工作，如文本或字符串检索、文件的查找或创建、大规模软件的自动部署、更改系统设置、监控服务器性能、发送报警邮件、抓取网页内容、压缩文件等。

更加惊讶的是，Shell 还可以让多个外部程序发生连接，在它们之间很方便地传递数据，也就是把一个程序的输出结果传递给另一个程序作为输入。

大家所说的 Shell 强大，并不是 Shell 本身功能丰富，而是它擅长使用和组织其他的程序。Shell 就是一个领导者，这正是 Shell 的魅力所在。


可以将 Shell 在整个 Linux 系统中的地位描述成下图所示的样子。注意“用户”和“其它应用程序”是通过虚线连接的，因为用户启动 Linux 后直接面对的是 Shell，通过 Shell 才能运行其它的应用程序。

![shell](http://c.biancheng.net/uploads/allimg/190417/1-1Z41G31T3628.gif)

### Shell 也支持编程

Shell 并不是简单的堆砌命令，我们还可以在 Shell 中编程，这和使用 C++、C#、Java、Python 等常见的编程语言并没有什么两样。

Shell 虽然没有 C++、Java、Python 等强大，但也支持了基本的编程元素，例如：

- if...else 选择结构，case...in 开关语句，for、while、until 循环；
- 变量、数组、字符串、注释、加减乘除、逻辑运算等概念；
- 函数，包括用户自定义的函数和内置函数（例如 printf、export、eval 等）。

Shell 主要用来开发一些实用的、自动化的小工具，而不是用来开发具有复杂业务逻辑的中大型软件，例如检测计算机的硬件参数、搭建 Web 运行环境、日志分析等，Shell 都非常合适。

使用 Shell 的熟练程度反映了用户对 Linux 的掌握程度，运维工程师、网络管理员、程序员都应该学习 Shell。

### Shell 是一种脚本语言

任何代码最终都要被“翻译”成二进制的形式才能在计算机中执行。

有的编程语言，如 C/C++、Pascal、Go 语言、汇编等，必须在程序运行之前将所有代码都翻译成二进制形式，也就是生成可执行文件，用户拿到的是最终生成的可执行文件，看不到源码。
这个过程叫做编译（Compile），这样的编程语言叫做编译型语言，完成编译过程的软件叫做编译器（Compiler）。


而有的编程语言，如 Shell、JavaScript、Python、PHP 等，需要一边执行一边翻译，不会生成任何可执行文件，用户必须拿到源码才能运行程序。程序运行后会即时翻译，翻译完一部分执行一部分，不用等到所有代码都翻译完。
这个过程叫做解释，这样的编程语言叫做解释型语言或者脚本语言（Script），完成解释过程的软件叫做解释器。

编译型语言的优点是执行速度快、对硬件要求低、保密性好，适合开发操作系统、大型应用程序、数据库等。    

脚本语言的优点是使用灵活、部署容易、跨平台性好，非常适合 Web 开发以及小工具的制作。

Shell 就是一种脚本语言，我们编写完源码后不用编译，直接运行源码即可。

> Linux 在服务器上的应用非常广泛，可以用来搭建 Web 服务器、数据库服务器、负载均衡服务器（CDN）、邮件服务器、DNS 服务器、反向代理服务器、VPN 服务器、路由器等。用 Linux 作为服务器系统不但非常高效和稳定，还不用担心版权问题，不用付费。


![ops](http://c.biancheng.net/uploads/allimg/180928/1-1P92Q43549491.jpg)

### Shell、Python 和 Perl

除了 Shell，能够用于 Linux 运维的脚本语言还有 Python 和 Perl。

1. Perl 语言  
   Perl 比 Shell 强大很多，在 2010 年以前很流行，它的语法灵活、复杂，在实现不同的功能时可以用多种不同的方式，缺点是不易读，团队协作困难。

   Perl 脚本已经成为历史了，现在的 Linux 运维人员几乎不需要了解 Perl 了，最多可以了解一下 Perl 的安装环境。

2. Python 语言  
   Python 是近几年非常流行的语言，它不但可以用于脚本程序开发，也可以实现 Web 程序开发（知乎、豆瓣、YouTube、Instagram 都是用 Python 开发），甚至还可以实现软件的开发（大名鼎鼎的 OpenStack、SaltStack 都是 Python 语言开发）、游戏开发、大数据开发、移动端开发。

   现在越来越多的公司要求运维人员会 Python 自动化开发，Python 也成了运维人员必备的技能，每一个运维人员在熟悉了 Shell 之后，都应该再学习 Python 语言。

3. Shell  
   Shell 脚本的优势在于处理偏操作系统底层的业务，例如，Linux 内部的很多应用（有的是应用的一部分）都是使用 Shell 脚本开发的，因为有 1000 多个 Linux 系统命令为它作支撑，特别是 Linux 正则表达式以及三剑客 grep、awk、sed 等命令。

    对于一些常见的系统脚本，使用 Shell 开发会更简单、更快速，例如，让软件一键自动化安装、优化，监控报警脚本，软件启动脚本，日志分析脚本等，虽然 Python 也能做到这些，但是考虑到掌握难度、开发效率、开发习惯等因素，它们可能就不如 Shell 脚本流行以及有优势了。对于一些常见的业务应用，使用 Shell 更符合 Linux 运维简单、易用、高效的三大原则。

## 常见的 shell

不同的组织机构开发了不同的 Shell，它们各有所长，有的占用资源少，有的支持高级编程功能，有的兼容性好，有的重视用户体验。
常见的 Shell 有 sh、bash、csh、tcsh、ash 等。

- sh  
  sh 的全称是 Bourne shell，sh 是 UNIX 上的标准 shell，很多 UNIX 版本都配有 sh。sh 是第一个流行的 Shell。

- csh  
  sh 之后另一个广为流传的 shell 是由柏克莱大学的 Bill Joy 设计的，这个 shell 的语法有点类似 C 语言，所以才得名为 C shell ，简称为 csh。  
  Bill Joy 是一个风云人物，他创立了 BSD 操作系统，开发了 vi 编辑器，还是 Sun 公司的创始人之一。

> BSD 是 UNIX 的一个重要分支，后人在此基础上发展出了很多现代的操作系统，最著名的有 FreeBSD、OpenBSD 和 NetBSD，就连 Mac OS X 在很大程度上也基于 BSD。

- tcsh  
  tcsh 是 csh 的增强版，加入了命令补全功能，提供了更加强大的语法支持。

- ash  
  一个简单的轻量级的 Shell，占用资源少，适合运行于低内存环境，但是与下面讲到的 bash shell 完全兼容。

- bash  
  bash shell 是 Linux 的默认 shell  
  bash 由 GNU 组织开发，保持了对 sh shell 的兼容性，是各种 Linux 发行版默认配置的 shell。


## 如何进入 shell

如今几乎所有的 Linux 发行版都使用某种图形桌面环境（例如 GNOME、KDE、Unity 等），这使得原生的 Shell 入口被隐藏了

- 进入 linux 控制台  
  现代 Linux 系统在启动时会自动创建几个虚拟控制台（Virtual Console），其中一个供图形桌面程序使用，其他的保留原生控制台的样子。虚拟控制台其实就是 Linux 系统内存中运行的虚拟终端（Virtual Terminal）

  `ctrl+alt+f1-f6` 进入控制台，`ctrl+alt+f7`返回图形界面

> 在图形界面模式下，输入密码时往往会显示为*，密码有几个字符就显示几个*；而在控制台模式下，输入密码什么都不会显示，好像按键无效一样，这一点请大家不要惊慌，只要输入的密码正确就能够登录。

图形界面也是一个程序，会占用 CPU 时间和内存空间，当 Linux 作为服务器系统时，安装调试完毕后，应该让 Linux 运行在控制台模式下，以节省服务器资源。

- 使用终端  
  图形桌面都带有终端(Terminal), 打开它就可以使用 Shell， `ctrl+alt+t`

## 查看 shell

Shell 是一个程序，一般都是放在/bin 或者/usr/bin 目录下，当前 Linux 系统可用的 Shell 都记录在/etc/shells 文件中。

```bash
cat /etc/shells  # 查看可用shell
echo $SHELL # 查看默认shell
```

> 在现代的 Linux 上，sh 已经被 bash 代替，/bin/sh 往往是指向/bin/bash 的符号链接。

## 进入 shell 的方式

1. 进入 Linux 控制台  
   现代 Linux 系统在启动时会自动创建几个虚拟控制台（Virtual Console），其中一个供图形桌面程序使用，其他的保留原生控制台的样子。虚拟控制台其实就是 Linux 系统内存中运行的虚拟终端（Virtual Terminal）。
   从图形界面模式进入控制台模式也很简单，往往按下 Ctrl + Alt + Fn(n=1,2,3,4,5...)快捷键就能够来回切换。

   > 在图形界面模式下，输入密码时往往会显示为 _，密码有几个字符就显示几个 _；而在控制台模式下，输入密码什么都不会显示，好像按键无效一样，这一点请大家不要惊慌，只要输入的密码正确就能够登录。

   图形界面也是一个程序，会占用 CPU 时间和内存空间，当 Linux 作为服务器系统时，安装调试完毕后，应该让 Linux 运行在控制台模式下，以节省服务器资源。正是由于这个原因，很多服务器甚至不安装图形界面程序，管理员只能使用命令来完成各项操作。

2. 使用终端  
   进入 Shell 的另外一种方法是使用 Linux 桌面环境中的终端模拟包（Terminal emulation package），也就是我们常说的终端（Terminal），这样在图形桌面中就可以使用 Shell。

   > linux 的终端模拟包有： xterm, gnome, konsole

## shell 命令提示符

不同 linux 发行版的命令提示符不同，默认格式为

```bash
# [用户名@主机名 当前目录]提示符(普通用户$, 管理员#)
# 当前目录，波浪号~是主目录的简写表示法
[mozhiyan@localhost ~]$
[pan@localhost:/home]$
# 环境变量PS1 PS2分别对应第1,2层命令的提示符  PromptSign
echo $PS1   # \u当前用户名  \h主机名 \H完整的域主机名 \w当前工作目录路径和名称  \W当前工作目录名称  \s shell的名称
echo $PS2
echo hello world
echo "hello
> world"
修改提示符
PS1="\[\h \w\]\$"
```

## shell 脚本

shell 脚本的扩展名不影响执行，见名知意就好
test.sh

```bash
"#!"是约定标记，告诉系统用哪种shell解释脚本
#!/bin/bash
echo "hello world"
```
执行脚本

```bash
# 方法1
chmod +x ./test.sh  # 使脚本有执行权限
test.sh  # 注意这样是错的，会到PATH指定的目录中查找test.sh
./test.sh  # 会用 #!指定的bash解释脚本

# 方法2
bash test.sh
/bin/bash test.sh  # 同上

```

hello.sh 读取用户输入内容，并展示

```bash
#!/bin/bash
echo "What is your name?"
read PERSON  # 读取输入内容并赋值给变量
echo "Hello, $PERSON"
# 单双引号的区别 类似php, 单引号内为字符串字面量，不会进行变量解析
echo 'hello $PERSON'
```

执行 hello.sh
```bash
chmod +x ./hello.sh
./hello.sh

# bash hello.sh
```

## shell 命令基本格式

`command [选项] [参数]`

```bash
cd demo
ls
ls -l
ls -al
ls -d
```

### 选项

可以看到，选项的作用是调整命令功能。如果没有选项，那么命令只能执行最基本的功能；而一旦有选项，则能执行更多功能，或者显示更加丰富的数据。

- 短格式选项 `ls -a`
- 长格式选项 `ls --all`

> 一般情况下，短格式选项是长格式选项的缩写，也就是一个短格式选项会有对应的长格式选项。当然也有例外，比如 ls 命令的短格式选项-l 就没有对应的长格式选项，所以具体的命令选项还需要通过帮助手册来查询。

### 参数

参数是命令的操作对象, 一般情况下，文件、目录、用户和进程等都可以作为参数。  
命令一般都需要加入参数，用于指定命令操作的对象是谁。如果可以省略参数，则一般都有默认参数。

```bash
ls -l main.c
ls  # 同 ls .
```

## shell变量

变量是任何一种编程语言都必不可少的组成部分，变量用来存放各种数据。脚本语言在定义变量时通常不需要指明类型，直接赋值就可以，Shell 变量也遵循这个规则。

在 Bash shell 中，每一个变量的值都是字符串，无论你给变量赋值时有没有使用引号，值都会以字符串的形式存储。

这意味着，Bash shell 在默认情况下不会区分变量类型，即使你将整数和小数赋值给变量，它们也会被视为字符串，这一点和大部分的编程语言不同。

> 如果有必要，你也可以使用 declare 关键字显式定义变量的类型

### 定义变量
注意=号两边不能有空格
**定义变量**

```bash
user=value   # 无空白符(*空格/tab*)时，可不用引号
user='value' # 同php 字符串字面量(*单引号里面是什么就输出什么*)
user="value" # 同php 先解析引号中的变量，命令，函数等

comic="one piece"
echo $comic
echo ${comic} # 同上 明确指定变量名边界
skill=java
echo "i am learning ${skill}script"
skill=phyton  # 修改变量

````

**将命令的结果赋值给变量**

```bash
dt=`date +%Y-%m-%d` # 把命令的结果赋值给变量
dt=$(date +%Y-%m-%d) # 同上
```

**只读变量**

```bash
#!/bin/bash
url=www.baidu.com
echo $url
readonly url
url=www.google.com
echo $url
```

**删除变量**

```bash
url=www.hello.com
echo "before unset url: $url"
unset url
echo "after unset url: $url"
```

**变量类型**

1. 局部变量  
   局部变量在脚本或命令中定义，仅在当前 shell 脚本中有效

2. 环境变量  
   所有 shell 脚本，都能访问环境变量

3. shell 变量  
   shell 变量是由 shell 程序设置的特殊变量。shell 变量中有一部分是环境变量，有一部分是局部变量

**特殊变量**
变量名只能包含数字、字母和下划线，因为某些包含其他字符的变量有特殊含义，这样的变量被称为特殊变量。

| 变量 | 含义                                                                                         |
| ---- | -------------------------------------------------------------------------------------------- |
| \$0  | 当前脚本的文件名                                                                             |
| \$n  | 传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是$1，第二个参数是$2。 |
| \$#  | 传递给脚本或函数的参数个数。                                                                 |
| \$\* | 传递给脚本或函数的所有参数。                                                                 |
| \$@  | 传递给脚本或函数的所有参数。被双引号(" ")包含时，与 \$\* 稍有不同，下面将会讲到。            |
| \$?  | 上个命令的退出状态，或函数的返回值。                                                         |
| \$\$ | 当前 Shell 进程 ID。对于 Shell 脚本，就是这些脚本所在的进程 ID。                             |

```bash
echo $$ $ 表示当前Shell进程的ID，即pid
```

**命令行参数**
bash hello.sh hi friend

```bash
#!/bin/bash
echo "$1 $2"
echo $#
echo $@
echo $*
```

**$\* 和 $@ 的区别**
$* 和 $@ 都表示传递给函数或脚本的所有参数，不被双引号(" ")包含时，都以"$1" "$2" … "\$n" 的形式输出所有参数。

当被引号包含时，`"$*"`会将所有的参数当做一个字符串，不再是数组; `"$@"`还是数组

```bash
for v in $*
do
  echo $v
done

for w in "$*"
do
  echo $w
done
```

**退出状态**

\$? 可以获取上一个命令的退出状态。所谓退出状态，就是上一个命令执行后的返回结果。

退出状态是一个数字，一般情况下，大部分命令执行成功会返回 0，失败返回 1。

## shell 替换

如果表达式中包含特殊字符，Shell 将会进行替换。例如，在双引号中使用变量就是一种替换，转义字符也是一种替换。

```bash
a=10
echo -e "value of a is $a \n"  # -e 对特殊序列转义，不然会直接输出 \n
```

| 转义字符 | 含义                             |
| -------- | -------------------------------- |
| \\       | 反斜杠                           |
| \a       | 警报，响铃                       |
| \b       | 退格（删除键）                   |
| \f       | 换页(FF)，将当前位置移到下页开头 |
| \n       | 换行                             |
| \r       | 回车                             |
| \t       | 水平制表符（tab 键）             |
| \v       | 垂直制表符                       |

可以使用 echo 命令的 -E 选项禁止转义，默认也是不转义的；使用 -n 选项可以禁止插入换行符

**命令替换**
命令替换是指 Shell 可以先执行命令，将输出结果暂时保存，在适当的地方输出

```bash
DATE=`date`
echo "date is $DATE"

USERS=`who | wc -l`
echo "logged in user are $USERS"

UP=`date ; uptime`
echo "uptime is $UP"
```

**变量替换**
变量替换可以根据变量的状态（是否为空、是否定义等）来改变它的值

可以使用的变量替换形式：
| 形式            | 说明                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| ${var}          | 变量本来的值                                                                                                       |
| ${var:-word}    | 如果变量 var 为空或已被删除(unset)，那么返回 word，但不改变 var 的值。                                             |
| ${var:=word}    | 如果变量 var 为空或已被删除(unset)，那么返回 word，并将 var 的值设置为 word。                                      |
| ${var:?message} | 如果变量 var 为空或已被删除(unset)，那么将消息 message 送到标准错误输出，可以用来检测变量 var 是否可以被正常赋值。 |
若此替换出现在 Shell 脚本中，那么脚本将停止运行。
\${var:+word} | 如果变量 var 被定义，那么返回 word，但不改变 var 的值。

## shell 运算符

Bash 支持很多运算符，包括算术运算符、关系运算符、逻辑运算符、字符串运算符和文件测试运算符。

原生 bash 不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，**expr 最常用**。

expr 是一款表达式计算工具，使用它能完成表达式的求值操作。

```bash
#!/bin/bash
val=`expr 2 + 2`  # 注意表达式中，运算符两边要有空格
echo "Total value : $val"
```

**算术运算符**

| 运算符 | 说明   | 举例                                                                        |
| ------ | ------ | --------------------------------------------------------------------------- |
| `+`    | 加法   | `expr $a + $b` 结果为 30。                                                  |
| `-`    | 减法   | `expr $a - $b` 结果为 10。                                                  |
| `*`    | 乘法   | `expr $a \* $b` 结果为 200。 乘号(`*`)前边必须加反斜杠(`\`)才能实现乘法运算 |
| `/`    | 除法   | `expr $b / $a` 结果为 2。                                                   |
| `%`    | 取余   | `expr $b % $a` 结果为 0。                                                   |
| `=`    | 赋值   | a=\$b 将把变量 b 的值赋给 a。                                               |
| `==`   | 相等   | 用于比较两个字符串，相同则返回 true。 [ $a == $b ] 返回 false。               |
| `!=`   | 不相等 | 用于比较两个字符串，不相同则返回 true。 [ $a != $b ] 返回 true。              |

**关系运算符**
关系运算符只支持数字，不支持字符串，除非字符串的值是数字。

| 运算符 | 说明                                                  | 举例                       |
| ------ | ----------------------------------------------------- | -------------------------- |
| -eq    | 检测两个数是否相等，相等返回 true。                   | [ $a -eq $b ] 返回 true。  |
| -ne    | 检测两个数是否相等，不相等返回 true。                 | [ $a -ne $b ] 返回 true。  |
| -gt    | 检测左边的数是否大于右边的，如果是，则返回 true。     | [ $a -gt $b ] 返回 false。 |
| -lt    | 检测左边的数是否小于右边的，如果是，则返回 true。     | [ $a -lt $b ] 返回 true。  |
| -ge    | 检测左边的数是否大等于右边的，如果是，则返回 true。   | [ $a -ge $b ] 返回 false。 |
| -le    | 检测左边的数是否小于等于右边的，如果是，则返回 true。 | [ $a -le $b ] 返回 true。  |

```bash
a=10
b=20
if [ $a -ne $b ]
then
   echo "a is not equal to b"
else
   echo "a is equal to b"
fi
```

**逻辑运算符**
| 运算符 | 说明                                                | 举例                                    |
| ------ | --------------------------------------------------- | --------------------------------------- |
| !      | 非运算，表达式为 true 则返回 false，否则返回 true。 | [ ! false ] 返回 true。                 |
| -o     | 或运算，有一个表达式为 true 则返回 true。           | [ $a -lt 20 -o $b -gt 100 ] 返回 true。 |
| -a     | 与运算，两个表达式都为 true 才返回 true。           | [ $a -lt 20 -a $b -gt 100 ] 返回 false  |

**字符串运算符**

| 运算符 | 说明                                       | 举例                     |
| ------ | ------------------------------------------ | ------------------------ |
| =      | 检测两个字符串是否相等，相等返回 true。    | [ $a = $b ] 返回 false。 |
| !=     | 检测两个字符串是否相等，不相等返回 true。  | [ $a != $b ] 返回 true。 |
| -z     | 检测字符串长度是否为 0，为 0 返回 true。   | [ -z $a ] 返回 false。   |
| -n     | 检测字符串长度是否为 0，不为 0 返回 true。 | [ -n $a ] 返回 true。    |
| str    | 检测字符串是否为空，不为空返回 true。      | [ $a ] 返回 true。       |

**文件测试运算符**
文件测试运算符用于检测 Unix 文件的各种属性

| 操作符  | 说明                                                                        | 举例                      |
| ------- | --------------------------------------------------------------------------- | ------------------------- |
| -b file | 检测文件是否是块设备文件，如果是，则返回 true。                             | [ -b $file ] 返回 false。 |
| -c file | 检测文件是否是字符设备文件，如果是，则返回 true。                           | [ -b $file ] 返回 false。 |
| -d file | 检测文件是否是目录，如果是，则返回 true。                                   | [ -d $file ] 返回 false。 |
| -f file | 检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true。 | [ -f $file ] 返回 true。  |
| -g file | 检测文件是否设置了 SGID 位，如果是，则返回 true。                           | [ -g $file ] 返回 false。 |
| -k file | 检测文件是否设置了粘着位(Sticky Bit)，如果是，则返回 true。                 | [ -k $file ] 返回 false。 |
| -p file | 检测文件是否是具名管道，如果是，则返回 true。                               | [ -p $file ] 返回 false。 |
| -u file | 检测文件是否设置了 SUID 位，如果是，则返回 true。                           | [ -u $file ] 返回 false。 |
| -r file | 检测文件是否可读，如果是，则返回 true。                                     | [ -r $file ] 返回 true。  |
| -w file | 检测文件是否可写，如果是，则返回 true。                                     | [ -w $file ] 返回 true。  |
| -x file | 检测文件是否可执行，如果是，则返回 true。                                   | [ -x $file ] 返回 true。  |
| -s file | 检测文件是否为空（文件大小是否大于 0），不为空返回 true。                   | [ -s $file ] 返回 true。  |
| -e file | 检测文件（包括目录）是否存在，如果是，则返回 true。                         | [ -e $file ] 返回 true    |

## shell 注释

以“#”开头的行就是注释，会被解释器忽略, sh 里没有多行注释，只能每一行加一个# 号。

## shell 字符串

字符串可以用单引号，也可以用双引号，也可以不用引号。单双引号的区别跟 PHP 类似。

```bash
# 单引号
str='this is a string'
# 双引号
your_name='qinjx'
str="Hello, I know your are \"$your_name\"! \n"
# 拼接字符串
your_name="qinjx"
greeting="hello, "$your_name" !"
greeting_1="hello, ${your_name} !"
echo $greeting $greeting_1
# 获取字符串长度
string="abcd"
echo ${#string} # 输出 4
# 提取子串
string="alibaba is a great company"
echo ${string:1:4} # 输出liba  ${string:index:length}
# 查找子串
string="alibaba is a great company"
echo `expr index "$string" is`
```

## shell 数组

Shell 在编程方面比 Windows 批处理强大很多，无论是在循环、运算。

bash 支持一维数组（不支持多维数组），并且没有限定数组的大小

**定义数组**

在 Shell 中，用括号来表示数组，数组元素用“空格”符号分割开。定义数组的一般形式为：

```bash
array_name=(value1 ... valuen)

array_name=(
value0
value1
value2
value3
)

# 单独指定数组的各个元素
arr[0]=value0
arr[1]=value1
arr[2]=value2

# 访问数组元素
echo ${arr[1]}

```

**读取数组**
读取数组元素值的一般格式是： `${array_name[index]}`

```bash
NAME[0]="Zara"
NAME[1]="Qadir"
NAME[2]="Mahnaz"
echo "First Index: ${NAME[0]}"
echo "Second Index: ${NAME[1]}"

# 使用@ 或 * 可以获取数组中的所有元素
echo "First Method: ${NAME[*]}"
echo "Second Method: ${NAME[@]}"
```

**获取数组的长度**
获取数组长度的方法与获取字符串长度的方法相同

```bash
# 取得数组元素的个数
length=${#array_name[@]}
# 或者
length=${#array_name[*]}
# 取得数组单个元素的长度
lengthn=${#array_name[n]}
```

## shell echo 命令

echo 是 Shell 的一个内部指令，用于在屏幕上打印出指定的字符串

```bash
# 显示转义字符
echo -e "\"It is a test\""
# 显示变量
name="OK"
echo "$name It is a test"
# 显示换行
echo -e "OK!\n"
echo "It is a test"
# 显示不换行
echo -n "OK!"
echo "It is a test"
# 显示结果重定向至文件
echo "It is a test" > myfile
# 显示命令执行结果
echo `date`
```

## shell printf 命令

printf 命令用于格式化输出， 是 echo 命令的增强版。它是 C 语言 printf()库函数的一个有限的变形，并且在语法上有些不同。

printf 不像 echo 那样会自动换行，必须显式添加换行符(\n)。

```bash
printf "hello, shell\n"
```

printf 命令的语法：

```bash
printf  format-string  [arguments...]
```

printf 示例

```bash
# format-string为双引号
$ printf "%d %s\n" 1 "abc"
1 abc
# 单引号与双引号效果一样
$ printf '%d %s\n' 1 "abc"
1 abc
# 没有引号也可以输出
$ printf %s abcdef
abcdef
# 格式只指定了一个参数，但多出的参数仍然会按照该格式输出，format-string 被重用
$ printf %s abc def
abcdef
$ printf "%s\n" abc def
abc
def
$ printf "%s %s %s\n" a b c d e f g h i j
a b c
d e f
g h i
j
# 如果没有 arguments，那么 %s 用NULL代替，%d 用 0 代替
$ printf "%s and %d \n"
and 0
```

## shell if else 语句

```bash
#!/bin/sh
a=10
b=20

# 方括号([ ])之间必须有空格，否则会有语法错误
echo "a = $a"
echo "b = $b"
echo -n ' $a == $b ? '
if [ $a == $b ]
then
   echo yes
else 
    echo no
fi

if [ $a == $b ]
then
   echo "a is equal to b"
elif [ $a -gt $b ]
then
   echo "a is greater than b"
elif [ $a -lt $b ]
then
   echo "a is less than b"
else
   echo "None of the condition met"
fi

# 写成1行
if test $[2*3] -eq $[1+5]; then echo 'The two numbers are equal!'; fi;

# if ... else 语句也经常与 test 命令结合使用
# test 命令用于检查某个条件是否成立，与方括号([ ])类似。
num1=$[2*3]
num2=$[1+5]  # 同 num2=`epxr 1 + 5`
echo -n 'test $[num1] -eq $[num2] : '
if test $[num1] -eq $[num2]
then
    echo yes
else
    echo no
fi
```

## shell test 命令

Shell 中的 test 命令用于检查某个条件是否成立，它可以进行数值、字符和文件三个方面的测试。

**数值测试**

| 参数 | 说明           |
| ---- | -------------- |
| -eq  | 等于则为真     |
| -ne  | 不等于则为真   |
| -gt  | 大于则为真     |
| -ge  | 大于等于则为真 |
| -lt  | 小于则为真     |
| -le  | 小于等于则为真 |

```bash
num1=100
num2=100
echo -n 'test $[num1] -eq $[num2] is: '
if test $[num1] -eq $[num2]
then
    echo yes
else
    echo no
fi
```

**字符串测试**
| 参数      | 说明                 |
| --------- | -------------------- |
| =         | 等于则为真           |
| !=        | 不相等则为真         |
| -z 字符串 | 字符串长度为0 则为真   |
| -n 字符串 | 字符串长度不为0 则为真 |

```bash
str1=100
str2=100
echo -n 'test $str1 = $str2 is: '
if test $str1 = $str2
then
    echo yes
else
    echo no
fi
```

**文件测试**
| 参数      | 说明                                 |
| --------- | ------------------------------------ |
| -e 文件名 | 如果文件存在则为真                   |
| -r 文件名 | 如果文件存在且可读则为真             |
| -w 文件名 | 如果文件存在且可写则为真             |
| -x 文件名 | 如果文件存在且可执行则为真           |
| -s 文件名 | 如果文件存在且至少有一个字符则为真   |
| -d 文件名 | 如果文件存在且为目录则为真           |
| -f 文件名 | 如果文件存在且为普通文件则为真       |
| -c 文件名 | 如果文件存在且为字符型特殊文件则为真 |
| -b 文件名 | 如果文件存在且为块特殊文件则为真     |

```bash
cd /bin
if test -e ./bash
then
    echo 'The file already exists!'
else
    echo 'The file does not exists!'
fi

# 逻辑运算 -o -a !
cd /bin
if test -e ./notFile -o -e ./bash
then
    echo 'One file exists at least!'
else
    echo 'Both dose not exists!'
fi
```

## shell case esac 语句

case ... esac 与其他语言中的 switch ... case 语句类似，是一种多分枝选择结构

```bash
# ;; 与其他语言中的 break 类似
case 值 in
模式1)
    command1
    command2
    ;;
模式2)
    command1
    command2
    ;;
*)
    command1
    command2
    ;;
esac
```

示例

```bash
#!/bin/bash
option="${1}"
case ${option} in
   -f) FILE="${2}"
      echo "File name is $FILE"
      ;;
   -d) DIR="${2}"
      echo "Dir name is $DIR"
      ;;
   *)
      echo "`basename ${0}`:usage: [-f file] | [-d directory]"
      exit 1 # Command to come out of the program with status 1
      ;;
esac
```

## shell for 语句

for 循环一般格式为：

```bash
for 变量 in 列表
do
    command1
    command2
    ...
    commandN
done
```

列表是一组值（数字、字符串等）组成的序列，每个值通过空格分隔。每循环一次，就将列表中的下一个值赋给变量。

in 列表是可选的，如果不用它，for 循环使用命令行的位置参数。

```bash
for n in 1 2 3 4 5
do
    echo "The value is: $n"
done

# 默认用 位置参数 作为列表，进行遍历
# > bash fortest.sh hello world
# fortest.sh:
for arg
do
  echo "arg is $arg"
done

for FILE in $HOME/.bash*
do
   echo $FILE
done
```

## shell while 语句

```bash
COUNTER=0
while [ $COUNTER -lt 5 ]
do
    COUNTER='expr $COUNTER + 1'
    echo $COUNTER
done
```

while 循环可用于读取键盘输入，按<Ctrl-D>结束循环

```bash
echo 'type <CTRL-D> to terminate'
echo -n 'enter your most liked film: '
while read FILM
do
    echo "Yeah! great film the $FILM"
done
```

## shell until 循环

```bash
#!/bin/bash
a=0
until [ ! $a -lt 10 ]
do
   echo $a
   a=`expr $a + 1`
done
```

## shell 跳出循环

break 命令

```bash
#!/bin/bash
while :
do
    echo -n "Input a number between 1 to 5: "
    read aNum
    case $aNum in
        1|2|3|4|5) echo "Your number is $aNum!"
        ;;
        *) echo "You do not select a number between 1 to 5, game is over!"
            break
        ;;
    esac
done
```

break 命令后面还可以跟一个整数，表示跳出几层循环

continue 命令

```bash
#!/bin/bash
while :
do
    echo -n "Input a number between 1 to 5: "
    read aNum
    case $aNum in
        1|2|3|4|5) echo "Your number is $aNum!"
        ;;
        *) echo "You do not select a number between 1 to 5!"
            continue
            echo "Game is over!"
        ;;
    esac
done
```

continue 后面也可以跟一个数字，表示跳出几层循环。

## shell 函数

Shell 也支持函数。Shell 函数必须先定义后使用
Shell 函数的定义格式如下：

```bash
function_name () {
    list of commands
    [ return value ]
}
```

如果你愿意，也可以在函数名前加上关键字 function：

```bash
function function_name () {
    list of commands
    [ return value ]
}
```

函数返回值，可以显式增加 return 语句；如果不加，会将最后一条命令运行结果作为返回值

Shell 函数返回值只能是整数，一般用来表示函数执行成功与否，0 表示成功，其他值表示失败。如果 return 其他数据，比如一个字符串，往往会得到错误提示：“numeric argument required”。

```bash
#!/bin/bash
# Define your function here
Hello () {
   echo "Url is http://see.xidian.edu.cn/cpp/shell/"
}
# Invoke your function
Hello
```

调用函数只需要给出函数名，不需要加括号。

```bash
#!/bin/bash
add(){
    echo "The function is to get the sum of two numbers..."
    echo -n "Input first number: "
    read numA
    echo -n "Input another number: "
    read numB
    echo "The two numbers are $numA and $numB !"
    
    # 等同 return $[ $numA + $numB ]
    # return `expr $numA + $numB`
    return $(($numA + $numB))  
}
add
# Capture value returnd by last command
ret=$?
echo "The sum of two numbers is $ret !"
```

函数返回值在调用该函数后通过 `\$?` 来获得

```bash
# 函数调函数
#!/bin/bash
# Calling one function from another
number_one () {
   echo "Url_1 is http://see.xidian.edu.cn/cpp/shell/"
   number_two
}
number_two () {
   echo "Url_2 is http://see.xidian.edu.cn/cpp/u/xitong/"
}
number_one
```

删除函数也可以使用 unset 命令，不过要加上 .f 选项

```bash
unset .f function_name # 实际上不需要 .f
unset function_name # 和删除变量一样
```

如果你希望直接从终端调用函数，可以将函数定义在主目录下的 .profile 文件

## shell 函数参数

在 Shell 中，调用函数时可以向其传递参数。在函数体内部，通过 `$n` 的形式来获取参数的值，例如，`$1` 表示第一个参数，`$2` 表示第二个参数...

```bash
#!/bin/bash
funWithParam(){
    echo "The value of the first parameter is $1 !"
    echo "The value of the second parameter is $2 !"
    echo "The value of the tenth parameter is $10 !"
    echo "The value of the tenth parameter is ${10} !"
    echo "The value of the eleventh parameter is ${11} !"
    echo "The amount of the parameters is $# !"  # 参数个数
    echo "The string of the parameters is $* !"  # 传递给函数的所有参数
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

## shell 输入输出重定向

Unix 命令默认从标准输入设备(stdin)获取输入，将结果输出到标准输出设备(stdout)显示。一般情况下，标准输入设备就是键盘，标准输出设备就是终端，即显示器。

**输出重定向**
命令的输出不仅可以是显示器，还可以很容易的转移向到文件，这被称为输出重定向。

```bash
echo hello > test.txt
echo new line >> test.txt
```

**输入重定向**
和输出重定向一样，Unix 命令也可以从文件获取输入

```bash
wc -l < log.txt
```

**重定向深入讲解**
一般情况下，每个 Unix/Linux 命令运行时都会打开三个文件：

- 标准输入文件(stdin)：stdin 的文件描述符为 0，Unix 程序默认从 stdin 读取数据。
- 标准输出文件(stdout)：stdout 的文件描述符为 1，Unix 程序默认向 stdout 输出数据。
- 标准错误文件(stderr)：stderr 的文件描述符为 2，Unix 程序会向 stderr 流中写入错误信息。

默认情况下，command > file 将 stdout 重定向到 file，command < file 将 stdin 重定向到 file。

如果希望 stderr 重定向到 file，可以这样写：

```bash
# 注意 文件描述符和重定向符号和文件之间不能有空格
command 2>file
command 2>>file
```

如果希望将 stdout 和 stderr 合并后重定向到 file，可以这样写：

```bash
command > file 2>&1

# test:
touch cmd
chmod a+x cmd
# cmd:
#!/bin/bash
echo hello
ls noThisDir
echo end

./cmd > outAndErr 2>&1
cat outAndErr
```

如果希望对 stdin 和 stdout 都重定向，可以这样写：

```bash
command < file1 > file2
```

**Here Document**

```bash
command << delimiter
    document
delimiter
```

```bash
$wc -l << EOF
    This is a simple lookup program
    for good (and bad) restaurants
    in Cape Town.
EOF
```

**/dev/null 文件**
如果希望执行某个命令，但又不希望在屏幕上显示输出结果，那么可以将输出重定向到 /dev/null

```bash
command > /dev/null
command > /dev/null 2>&1

```

## shell 文件包含

像其他语言一样，Shell 也可以包含外部脚本，将外部脚本的内容合并到当前脚本

```bash
. filename
source filename
```

注意：被包含脚本不需要有执行权限。


## shell 常见问题总结
```bash
# 批量创建文件夹
mkdir {foo,bar}  # 注意 逗号两边不能有空格
mkdir {0,1,2,3}{a,b,c}

即可批量创建名字为0a,0b,0c,1a,1b,1c,2a,2b,2c,3a,3b,3c的文件夹。

linux下创建文件的命令为: touch xxx (xxx为你要创建的文件夹名字)

linux下批量创建文件方法:(ubuntu为例)

touch {a,b,c}{a,b,c}

即可批量创建名字为aa,ab,ac,ba,bb,bc,ca,cb,cc等文件。

touch demo{1..10}
```
# 捕获

信号 用于进程间通信, 信号通知发生了一件事情； 还用于处理异常和中断

kill 命令发送信号

`kill -9 [pid]`

> 若进程在内核模式中接受到信号，只有进程返回用户模式时信号的执行才开始

休眠的进程分为： 可中断的和不可中断的


进程接受到信号的行为有3种:
- 忽略该信号  有的信号没有默认行为，默认被忽略
- 捕获该信号  执行指定的信号处理器
- 执行默认行为

## 信号的名称和值

通过  `kill -l` 可查看


## 进程

当我们在linux中执行一个命令时，就会创建一个进程。

pid 每个进程都有一个唯一的id

ppid 父进程id

```bash
sleep 10 &
ps -ef | grep sleep # 查看sleep命令对应的进程, 父进程就是当前shell

```

在unix中,每一个进程都是使用fork或者exec方法创建的。
子进程会指向和当前shell相同的内存页，写时拷贝技术。

## 前台进程 和 后台进程

默认都是前台进程, `cmd &` 则变为后台进程, 如: `sleep 100 &`


## 进程的状态

- D (不可中断休眠状态)
- R (运行状态)
- S (休眠状态)
- T (停止状态)
- Z (僵死状态)


查看进程状态

`ps -C cmd -o pid=,cmd,stat`

```bash
sleep 100 &
ps -C sleep -o pid=,cmd,stat

```

## 查看进程

查看进程的命令有：
- `ps`
- `pstree`
- `pgrep`

```bash
ps  # 默认显示当前用户，当前终端下的进程

# 标准语法，显示系统中的每个进程
ps -ef | head 

# BSD语法, 显示系统进程
ps aux | head

pstree # 显示进程树
pstree [pid] # 指定根进程id
pstree $$

# pstree userName 以用户的进程作为根
pstree alice

# pgrep 基于名称或属性查找进程
pgrep -u root sshd
pgrep -u root,alice

```

## 向进程发送信号

发送信号的命令有:

- `kill`
- `killall`
- `pkill`

可用键盘组合键发送的信号有:

- `ctrl+c`  中断信号，SIGINT
- `ctrl+y`  延时挂起信号
- `ctrl+z`  挂起信号，SIGSTP

```bash
sleep 100 &
jobs -l
kill %1 

# killall 会发送信号到运行任何指定命令的所有进程。
# 一个进程启动多个实例时，用 killall会比较方便
killall firefox  # 默认发送 SIGTERM 信号
killall -s SIGKILL firefox # 指定发送的信号

# pkill 通过指定进程名，用户名等属性来杀掉相应进程。
pkill firefox
pkill -KILL -u alice firefox

```


## 关在子shell

```bash
# 圆括号内部，就是一个子shell
(

  while [ 1 ]
  do
    echo "subshell running.."
  done
 )
 
# 上面死循环，不会执行到这里
 echo "this is the end."

```

通常，脚本中的外部命令会创建一个子进程，而bash的内部命令则不会。

内嵌在括号内的命令列表，当作子shell运行

`(cmd1; cmd2; cmd3)`

子shell中的变量，在子shell代码块之外是不可见的，不能被父进程访问。


`SHLVL` 表示bash的嵌套深度



## 捕获

### trap语句

trap 命令捕获特定的信号并进行处理

trap cmd signal [signal...]

```bash
trap "echo some error happend" ERR

# 移除信号的捕获
trap - INT TERM

```



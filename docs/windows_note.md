# window 常用 cmd 命令

`control.exe` 是调用 window 系统控制面板的程序(**位于 system32/control.exe**), 开始-运行 control, 不带参数则打开控制面板; control 命令后，可带上某控制项目的文件名, 打开对应控制面板项。

## 常用命令

开始运行里面，敲一遍，就知道它们是做什么的了

- appwiz.cpl # 程序和功能面板
- ncpa.cpl # 网络连接面板 同 `control netconnections`
- sysdm.cpl # 系统属性面板
- desk.cpl # 修改屏幕分辨率 设置双屏
- timedate.cpl # 系统时间，可更改时间和时区
- powercfg.cpl # 电源选项面板
- inetcpl.cpl # internet 选项
- intl.cpl # 区域语言设置
- devmgmt.msc # 查看硬件设备
- compmgmt.msc # 计算机管理
- lusrmgr.msc # 本地用户和组
- gpedit.msc # 打开组策略
- regedit # 打开注册表
- control system # 系统信息面板，*相当于【我的电脑】点击右键，选属性*
- control userpasswords2 # 高级帐户管理
- control userpasswords # 用户帐户管理 **同 nusrmgr.cpl**
- mmsys.cpl # 声音控制面板

> 注：\*.cpl 文件还可接受参数 eg: sysdm.cpl ,3 打开系统属性面板第 3 个 tab

## control 命令详解

Windows 的命令列模式下有个非常好用的命令叫做 Control。这个命令其实就是控制『控制台』的一个接口。你可以用这个命令直接叫起一些平常要找很久才会找到的窗口。最简单的一个例子，你只要在『开始』 -> 『执行』中输入”control“。就可以开启控制台窗口。

以为为一些 win7 可用的参数:

| 命令和参数             | 说明                                            |
| ---------------------- | ----------------------------------------------- |
| control admintools     | 系统管理工具                                    |
| control system         | 系统属性 _查看操作系统 cpu 和 内存_             |
| control desktop        | 桌面属性-个性化 修改桌面背景 _和 desk.cpl 不同_ |
| control folders        | 文件夹选项                                      |
| control keyboard       | 键盘属性                                        |
| control mouse          | 鼠标属性                                        |
| control netconnections | 网络连接 **同 ncpa.cpl**                        |
| control panel          | 控制面板 **其实 直接 control 即可**             |
| control printers       | 打印机面板                                      |

## 文件关联

`控制面板--默认程序` 可查看和设置文件关联.

## 查找文件

`dir /s | find "hello"`

`dir /s | findStr ".*.json"`

`dir /s | findStr /I "Serv"`  不区分大小写


## 查看所有 `*.cpl` `*.msc`文件
- 开始运行 %systemroot%\system32
- 右键选择 `git bash here`
- ls -1 *.{cpl,msc}`

## 80端口被谁占用

[win10，7 80端口被占用的检测和解决方法](https://www.cnblogs.com/sheng518/p/11989171.html)

1. netstat -ano | findstr :80  # 找到监听80端口的进程id
2. tasklist | findstr <pid> # 查看进程名称
3. taskkill /F /PID <pid>


## git-bash不支持交互式命令
[Gitbash如何支持交互式命令？如何让gitbash的命令不乱码？winpty是什么鬼？干嘛用的？ - 冒雨ing - 博客园](https://www.cnblogs.com/saysmy/p/9970247.html)


## 设置bat程序自动启动

1. 打开启动文件夹: 开始 -- 运行 shell:startup
2. 粘贴 your.bat 到启动文件夹

## 查看服务

```bash
net start  # 查看目前启动的服务
net stop {serverName}
```

## 创建系统服务

1. 管理员身份打开cmd
2. sc create ServiceName start= auto binpath= D:\service\Test.exe
3. sc delete ServiceName
4. sc start ServiceName
5. sc stop ServiceName
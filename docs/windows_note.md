# window 常用 cmd 命令

`control.exe` 是调用 window 系统控制面板的程序(**位于 system32/control.exe**), 开始-运行 control, 不带参数则打开控制面板; control 命令后，可带上某控制项目的文件名, 打开对应控制面板项。

## 常用命令

开始运行里面，敲一遍，就知道它们是做什么的了

- appwiz.cpl
- ncpa.cpl
- sysdm.cpl
- desk.cpl # 修改屏幕分辨率 设置双屏
- timedate.cpl
- powercfg.cpl
- inetcpl.cpl # internet 选项
- intl.cpl # 区域语言设置
- nusrmgr.cpl # win7 无这个面板 ont
- devmgmt.msc
- compmgmt.msc
- lusrmgr.msc
- gpedit.msc
- regedit
- control system
- control userpasswords2 #高级帐户管理
- control userpasswords #用户帐户管理 **同 nusrmgr.cpl**

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

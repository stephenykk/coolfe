# cmder note

[cmder 一个比 cmd 强 n 倍的神器](https://www.jianshu.com/p/7a706c0a3411)

## 中文乱码

1. `win + alt + p` 打开设置 
2. `StartUp -- Environment`
3. 在 set PATH 下添加设置
    ```bash
    set LANG=zh_CN.UTF-8 
    set LC_ALL=zh_CN.utf8
    ```
4. 重新启动cmder，即可看到中文显示正常

## 自定义 alias 不生效

win10 下 cmder 很多命令 history pwd 无法使用，ls 字体也没有颜色显示，其根本原因是 win10 下 cmd 控制台版本问题，切换回老版本就 OK 了

1. 开始运行 cmd , 打开命令行
2. 点击左上角标题，选择属性，勾选"使用旧版本控制台"
3. 重新打开 cmder
4. `alias` 可查看当前别名定义
5. `win + alt + p` 打开设置，`Startup -- Environment` 可自定义别名 
    ```bash
    alias kk=echo hello kk
    alias gcm=git commit -am $1
    alias gs=git status
    ```


## 快捷键

- `win + alt + p` 打开设置
- `ctrl + \` ` 切换到 cmder
- `菜单键(右边ctrl旁边) + f` 查找
- 双击 tab 栏空白处 新建 tab
- `alt + enter` 切换全屏
- `ctrl + t` 新建tab
- `ctrl + w` 关闭tab
- `shift + alt + <num>` 快速打开tab
- `ctrl + v` or 右键  粘贴

## 设置背景透明度

1. `win + alt + p` 打开设置
2. `Features -- Transparency` 设置透明度

## 设置默认打开目录

1. `win + alt + p` 打开设置 `startup` 看看 `specified named task` 是哪个
2. 修改对应task的命令
    ```bash
    # %USERPROFILE% 换成自己的目录
    *cmd /k "%ConEmuDir%..\init.bat" -ew_console:d:%USERPROFILE%
    ```

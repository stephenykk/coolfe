vscode note 
=========

快捷键
---
+ `ctrl+shift+p` or `f1` 命令行面板
+ `ctrl+p` 快速打开文件
+ `ctl+,` 打开设置   
    *容易快捷键冲突，`ctrl+k,ctrl+s` 搜索openStettings，修改为 `ctrl + ;` 比较好一点*
+ `ctrl+k,ctrl+o` 打开文件夹
+ `ctL+k, ctrl+s` 打开快捷键设置
+ `alt+shift+p` 选择项目
+ `ctrl+shift+w` 关闭整个窗口
+ `ctrl+k s` 全部保存
+ `ctrl+k m` 选择开发语言
+ `ctrl+2` 切换到第2个分栏
+ `alt+2` 切换到第2个tab

> 打开快捷键json定义文件, F1 -- 输入shortcutes
> 复制现有快捷键设置  ctrl+k, ctrl+s -- 输入save all -- 右键复制
> 然后就可以在 快捷键json文件中粘贴 并修改为自己喜欢的快捷键, 自定义和默认的快捷键同时生效的


命令行面板
---
+ 命令行面板 输入 `save project` 保存项目
+ 命令行面板 输入 `file reveal` 侧边栏显示当前文件

多列编辑
---
- `alt+shift+up`, `alt+shift+down` 添加编辑点
- `alt+shift+鼠标拖动`
- `alt+鼠标点击`

括号内容选择
---
- `ctrl+alt+left`, `ctrl+alt+up` 定位到左边括号前面
- `ctrl+alt+right`, `ctrl+alt+down` 定位到右边括号后面
- `ctrl+alt+shift+left`, `ctrl+alt+shift+up` 选中光标到左边括号前面的内容
- `ctrl+alt+shift+right`, `ctrl+alt+shift+down` 选中光标到右边括号后面的内容  
    *貌似用处不大，若要删除括号和它内部的内容，可先定位ctrl+alt+left, 再选中ctrl+alt+shift+right*

其他
---
- `alt+f3` 查找所有 鼠标所在处的高亮文本，并同时编辑
- 移动内容, 选择文本，然后按下鼠标中键，拖动到目标位置

智能提示
---
+ `ctrl+space` 语法智能提示 需在语言设置关闭快捷键(ctrl+space)的默认设置

行操作
---
- `ctrl+shift+D` 复制行
- `ctrl+shfit+up`, `ctrl+shift+down` 行上移/下移
- `ctrl+shift+K` 删除行
- `ctrl+l` 选择光标所在行

注释
---
- `ctrl+/` 单行注释
- `ctrl+shift+/` 块注释

重命名变量或函数
---
在变量名上点右键--重命名符号, 当前作用域的变量都会一起修改

代码格式化
---
- `alt+shift+F` 格式化整个文件
- `ctrl+k, ctrl+f` 格式化选中内容
- 右键菜单 -- 格式化

代码折叠
---
- `ctrl+shift+[` 折叠光标所在的代码块
- `ctrl+shift+]` 展开光标所在代码块
- `ctrl+k, ctrl+3` 折叠第三层的代码
- `ctrl+k, ctrl+j` 展开所有代码

错误和告警遍历
---
按`f8` 可遍历当前文件的错误和告警

emmet
---
[emmet语法示例](https://docs.emmet.io/cheat-sheet/)

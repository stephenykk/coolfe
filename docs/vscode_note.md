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
+ `ctrl+2` 切换到第2个分栏 *如尚未分栏 则会新建分栏; alt+shift+2会基于当前编辑器，新建分栏，通常 ctrl + 2才是我们想要的效果*
+ `alt+2` 切换到第2个tab
+ `ctrl+shift+l` or `alt+shift+i` 多列编辑选中的行

**自定义快捷键**
- 打开快捷键json定义文件, F1 -- 输入shortcutes
- 复制现有快捷键设置  ctrl+k, ctrl+s -- 输入save all -- 右键复制
- 然后就可以在 快捷键json文件中粘贴 并修改为自己喜欢的快捷键, 自定义和默认的快捷键同时生效的


常用快键键
---
1. 注释：
    - 单行注释：`ctrl+k,ctrl+c` 或 `ctrl+/`  *用 ctrl+/ 注释或取消注释比较方便*
    - 多行注释：`alt+shift+A` 或 `ctrl+shift+/`
    - 编写多行注释：`/**`

3. 显示/隐藏左侧目录栏: `ctrl + b`
4. 复制当前行：`shift + alt +up/down` *安装sublime text keymap后，该快捷键变成多列编辑* 
5. 删除当前行：`shift + ctrl + k`
6. 控制台终端显示与隐藏：`ctrl + ~`
8. 代码格式化：`shift + alt +f`
9. 新建一个窗口: `ctrl + shift + n`
10. 行增加缩进: `ctrl + [`
11. 行减少缩进: `ctrl + ]`
13. 字体放大/缩小: `ctrl + ( + 或 - )`
14. 切换窗口/拆分编辑器: `ctrl + 1/2/3`
16. 关闭编辑器窗口:  `ctrl + w`
17. 关闭所有窗口 : `ctrl + k + w`
18. 切换全屏: `F11`
19. 自动换行: `alt + z`
20. 显示git: `ctrl + shift + g`  *ctrl + shift + g, g*
21. 全局查找文件：`ctrl + p`
22. 显示命令列表(如：git log)： `ctrl + shift + p`
24. 折叠代码： `ctrl + k + 0-9` (0是完全折叠)
25. 展开代码： `ctrl + k + j` (完全展开代码)
27. 快速切换主题：`ctrl + k, ctrl + t`
30. 格式化选定代码 ：`ctrl + k, ctrl +f`
33. 全局替换：`ctrl + shift + h`
34. 当前文件替换：`ctrl + h`
35. 查看函数列表：`ctrl + r`
36. 打开新的命令行窗：`ctrl + shift + c`
37. 后退回之前的光标处： `alt + -`
38. 前进到后来的光标处:  `alt + shift + -`


命令行面板
---
+ 命令行面板 输入 `save project` 保存项目
+ 命令行面板 输入 `file reveal` 侧边栏显示当前文件

多列编辑
---
- `alt+shift+up`, `alt+shift+down`, `ctrl+alt+up`, `ctrl+alt+down` 添加编辑点
- `alt+shift+鼠标拖动`
- `alt+鼠标点击`

括号内容选择
---
- `ctrl+shift+\`, `ctrl+m` 定位到括号位置
- `ctrl+shift+m` 选中括号的内容 *ctrl+k ctrl+s 搜索bracket 自定义快捷键*

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

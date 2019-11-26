vscode note 
=========

**自定义快捷键**
1. 打开 定义快捷键json文件, F1 -> 输入shortcutes
2. `ctrl+k, ctrl+s` 打开快捷键设置界面 -> 输入 save all -> 右键复制
3. 在 定义快捷键json文件 中粘贴, 并修改为自己喜欢的快捷键, 这样自定义和默认的快捷键可同时生效

分栏/tab
---
+ `ctrl+2` 切换到第2个分栏/新建分栏 *如尚未分栏 则会新建分栏; alt+shift+2会基于当前编辑器，新建分栏，通常 ctrl + 2才是我们想要的效果*
+ `alt+2` 切换到第2个tab
+ `ctrl + \` 为当前编辑器新建分栏

设置
---
+ `ctL+k, ctrl+s` 打开快捷键设置
+ `ctl+,` 打开设置   
    *容易快捷键冲突，`ctrl+k,ctrl+s` 搜索openStettings，修改为 `ctrl + ;` 比较好一点*

命令面板
---
+ `ctrl+shift+p` or `f1` 命令行面板 显示命令列表, 查看命令对应的快捷键
  *`ctrl+shift+p`打开命名行面板后，按`backspace`键，删除 `>`, 会切换到 `ctrl+p`模式(go anywhere模式); 同样 `ctrl+p`模式输入`>`,也会进入命令模式*
+ `ctrl + k, ctrl + t` 快速切换主题
+ `ctrl + r` 查看函数列表
+ `alt+shift+p` 选择项目
+ `ctrl+k m` 选择开发语言
+ `save project` 保存项目
+ `file reveal` 侧边栏显示当前文件
+ `ctrl + g` 跳转到指定行
+ `ctrl + r` 跳转到指定函数或变量
+ `ctrl + t` 根据当前光标高亮的名称查找symbol

光标定位
---
+ `alt + -` 后退回之前的光标处
+ `alt + shift + -` 前进到后来的光标处

书签
---
+ `ctrl + F2` 创建/取消书签
+ `ctrl + shift + F2` 取消所有书签
+ `F2` 跳转到下一个书签
+ `shift + F2` 跳转到上一个书签

视图
---
+ `ctrl + ~` 控制台终端显示与隐藏：
+ `ctrl + ( + 或 - )` 界面放大/缩小
+ `F11` 切换全屏
+ `ctrl + shift + g`  *ctrl + shift + g, g* 显示git
+ `ctrl + b` 显示/隐藏左侧目录栏
+ `alt + z` 自动换行
+ `ctrl + shift + u` 显示output
+ `ctrl + shift + v` 预览markdown *很实用*

打开/关闭/保存
---
+ `ctrl + p` 快速打开文件：
+ `ctrl + w` 关闭编辑器窗口
+ `ctrl + k, w` 关闭所有窗口
+ `ctrl + shift + n` 新建一个窗口
+ `ctrl + shift + c` 打开新的命令行窗
+ `ctrl+k, ctrl+o` 打开文件夹
+ `ctrl+shift+w` 关闭整个窗口
+ `ctrl+k s` 全部保存

查找替换
---
+ `ctrl + h` 当前文件替换
+ `ctrl + shift + h` 全局替换


多列编辑
---
- `alt+shift+up`, `alt+shift+down`, `ctrl+alt+up`, `ctrl+alt+down` 添加编辑点
- `alt+shift+鼠标拖动`
- `alt+鼠标点击`
+ `ctrl+shift+l` or `alt+shift+i` 多列编辑选中的行

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
- `ctrl+shfit+up`, `ctrl+shift+down`, `alt+up`, `alt+down` 行上移/下移
- `ctrl+enter` 当前行下面新建一行
- `ctrl+shift+enter` 当前行上面新建一行
- `ctrl+shift+K` 删除行
- `ctrl+l` 选择光标所在行

注释
---
- `ctrl+/`, `ctrl+k, ctrl+c` 单行注释
- `ctrl+shift+/`, `alt+shift+a` 块注释
- `/**` 编写多行注释

变量或函数
---
+ 重命名: 在变量名上点右键--重命名符号, 当前作用域的变量都会一起修改, 或者 `f1` -> 输入 rename
+ `F12` 跳转到函数定义位置, *查看完函数定义后 `alt+-`返回调用位置*
+ `alt+shift+F12` 查看所有引用
+ `shift+F12` 看一眼所有的引用

代码格式化
---
- `alt+shift+F` 格式化整个文件
- `ctrl+k, ctrl+f` 格式化选中内容
- 右键菜单 -- 格式化

代码折叠和缩进
---
- `ctrl + [` 行增加缩进
- `ctrl + ]` 行减少缩进
- `ctrl+shift+[` 折叠光标所在的代码块
- `ctrl+shift+]` 展开光标所在代码块
- `ctrl+k, ctrl+3` 折叠第三层的代码
- `ctrl+k, ctrl+j` 展开所有代码

错误和告警遍历
---
按`f8` 可遍历当前文件的错误和告警

插件安装
---
+ `F1` -> 输入 `ext install keyword`
+ `ctrl + shift + x`

```shell
# 安装主题
ctrl + shift + x
搜索 Horizon Theme 并安装
ctrl + k, ctrl + t 选择主题
```

emmet
---
[emmet语法示例](https://docs.emmet.io/cheat-sheet/)

使用问题
---
### 配置vue文件html标签属性不换行显示
1. ctrl + shift + p 输入 open settings
2. 粘贴以下vetur的配置
  ```json
    // Options for all default formatters
	"vetur.format.defaultFormatterOptions": {
		"js-beautify-html": {
			"wrap_attributes": "auto"
		},
		"prettyhtml": {
			"printWidth": 100,
			"singleQuote": false,
			"wrapAttributes": false,
			"sortAttributes": false
		}
	},
    ```
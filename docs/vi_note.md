# vi notes

[Linux vi/vim 如门教程](https://www.runoob.com/linux/linux-vim.html)  
[linux 使用文本编辑器 vi 常用命令](https://www.cnblogs.com/yaohong/p/7498998.html)

`vimtutor` 是很好的入门教程

```bash
# 安装
apt-get install vim -y
vimtutor
```

## 替换

```bash
# 在vi/vim中 按冒号(:) 进入末行命令模式
# s 代表替换 substitute  [范围]s/from/to/[修饰符]
# g 代表查找 grep
# 修饰符 /gci  global confirm ignoreCase

:s/vivian/sky/ # 替换当前行第一个 vivian 为 sky
:s/vivian/sky/g # 替换当前行所有 vivian 为 sky
:n,$s/vivian/sky/ # 替换第 n 行开始到最后一行中每一行的第一个 vivian 为 sky
:n,$s/vivian/sky/g # 替换第 n 行开始到最后一行中每一行所有 vivian 为 sky
:%s/vivian/sky/ # 替换每一行的第一个 vivian 为 sky
:%s/vivian/sky/gc # 替换每一行中所有 vivian 为 sky
:g/vivian/s//sky/g # 范围通过g命令确定，全局查找vivian 然后找到的行把行内所有的vivian替换为sky
:%s@vivian/@sky/@g # @作为分隔符 替换所有的 vivian/ 为 sky/
```

## 删除

```bash
:3d # 删除第3行
:1,10d # 删除第1-10行
:8,$d # 删除第8-末尾行
:g/hello/d # 通过g命令查找目标行, 删除文档中含有字符 hello 的所有行
:g/^$/d # 通过g命令查找目标行, 删除空白行
:g/^\n/s///g # 删除空白行
:g/.*/d # 删除全文
x # 删除当前字符。
dw # 删除当前单词。
de # 删除当前单词。
dd # 删除当前行
3dd # 向下删除3行
d$ # 删除当前字符开始到行尾的所有字符。
d0 # 删除前一个字符开始到行首的所有字符。
dH # 删除从当前行到屏幕首行的内容。
dM # 删除从当前行到屏幕中间行的内容。
dL # 删除从当前行到屏幕末行的内容
```

## 设置

```bash
:set ic   # 忽略大小写 (ic 是 ignore case 的缩写)
:set noic  # 不忽略大小写
:set nu # 显示行号
:set nonu # 不显示行号
```

## 多个文件编辑和切换

```bash
# 打开多个文件
vim file1 file2 ... filen
:open file2

# 分栏 同时显示多个文件
:split
:vsplit

# 切换当前编辑文件
:bn # 切换到下一个文件
:bp # 切换到上一个文件
:n  # 一个窗格编辑多个文件时，切换到下一个文件
:N  # 一个窗格编辑多个文件时，切换到上一个文件

:helper buffer # 查看帮助
:sb # 分割窗口编辑当前文件
:ls # 查看所有打开的文档


# 切换窗口
ctrl + w , w
ctrl + w , j / k / h / l

# 保存所有
:wqa  # 保存所有窗口 并退出
:qa!  # 强制退出所有窗口

# 编辑完文件，提示无权限保存，怎样用sudo保存，不用再编辑一次?
:w !sudo tee %  # % 表示当前文件名，tee命令把缓冲区数据保存到文件

# 重复上一条命令
`.`
```

## 书签

1. 定义书签  
按m， 然后按字母 (*字母范围:* `a-z`)

2. 跳转到标签
按反引号 `\`` (*ESC下面的那个键*)，然后按目标书签对应的字母，跳转到书签的具体行和列位置  
按单引号 `'` (*回车键附近的按键*)，然后按目标书签对应的字母， 跳转到书签的行首

## 粘贴与系统剪贴板交互

[vim寄存器和剪贴板](https://wenku.baidu.com/view/44d905e44328915f804d2b160b4e767f5bcf805b.html)

[vim速查手册](https://www.jianshu.com/p/af14f639dadb)
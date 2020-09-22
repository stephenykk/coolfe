# vi notes
[Linux vi/vim入门教程](https://www.runoob.com/linux/linux-vim.html)  

`vimtutor` 是很好的入门教程

```bash
# 安装
apt-get install vim -y
vimtutor
```

## 替换

```bash
# 在vi/vim中 按冒号(:) 进入末行命令模式
# s 代表替换 substitute  [范围]/from/to/[所有]
# g 代表查找 grep
# 选项 /gci  global confirm ignoreCase 

:s/vivian/sky/ # 替换当前行第一个 vivian 为 sky
:s/vivian/sky/g # 替换当前行所有 vivian 为 sky
:n,$s/vivian/sky/ # 替换第 n 行开始到最后一行中每一行的第一个 vivian 为 sky
:n,$s/vivian/sky/g # 替换第 n 行开始到最后一行中每一行所有 vivian 为 sky
:%s/vivian/sky/ # 替换每一行的第一个 vivian 为 sky
:%s/vivian/sky/gc # 替换每一行中所有 vivian 为 sky
:g/vivian/s//sky/g # 同上 全局查找vivian 然后找到的行执行替换
:%s@vivian/@sky/@g # @作为分隔符 替换所有的 vivian/ 为 sky/
```

## 删除
```bash
:3d # 删除第3行
:1,10d # 删除第1-10行
:8,$d # 删除第8-末尾行
:g/hello/d # 删除文档中含有字符 hello 的所有行
:g/^$/d # 删除空白行
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

## 其他命令
```bash
:set ic   # 忽略大小写 (ic 是 ignore case 的缩写)
:set noic  # 不忽略大小写
:set nu # 显示行号
:set nonu # 不显示行号
```

<<<<<<< HEAD
## 多文件编辑
```bash
:helper buffer # 查看帮助
:ls  # 查看打开的文件列表
:bn # 切换到下一个文件
:bp # 切换到上一个文件
:sb # 分割窗口编辑当前文件  ctrl + w , j 焦点定位到下个窗口 ctrl + w, k 焦点定位上个窗口
```
=======
## 多个文件编辑和切换
```bash
# 打开多个文件
vim file1 file2 ... filen
:open file2

# 分栏 同时显示多个文件
:split
:vsplit

# 切换当前编辑文件
:bp  # buffer previous
:bn  # buffer next
:n  # 一个窗格编辑多个文件时，切换到下一个文件
:N  # 一个窗格编辑多个文件时，切换到上一个文件
:ls # 查看所有打开的文档


# 切换窗口
ctrl + w , w
ctrl + w , j / k / h / l

# 保存所有
:wqa  # 保存所有窗口 并退出
:qa!  # 强制退出所有窗口

```
>>>>>>> 7041f17aa1908edcdbad7f72e7d7616e99bafa53

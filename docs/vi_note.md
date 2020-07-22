# vi notes

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
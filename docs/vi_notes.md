vi notes
===
替换
---
- :s/vivian/sky/ 替换当前行第一个 vivian 为 sky
- :s/vivian/sky/g 替换当前行所有 vivian 为 sky
- :n,$s/vivian/sky/ 替换第 n 行开始到最后一行中每一行的第一个 vivian 为 sky
- :n,$s/vivian/sky/g 替换第 n 行开始到最后一行中每一行所有 vivian 为 sky
- :%s/vivian/sky/（等同于 :g/vivian/s//sky/） 替换每一行的第一个 vivian 为 sky
- :%s/vivian/sky/g（等同于 :g/vivian/s//sky/g） 替换每一行中所有 vivian 为 sky
- :s#vivian/#sky/# 替换当前行第一个 vivian/ 为 sky/
- :%s+/oradata/apras/+/user01/apras1+ （使用+ 来 替换 / ）： /oradata/apras/替换成/user01/apras1/


删除
---
- dd 光标所在行
- :1d 单行删除
- :1,10d 多行删除，删除1到10行
- :8,$d 从某行开始至文本末尾全部删除，删除第8行至末尾
- :g/hello/d 删除文档中含有字符hello的所有行
- :g/^$/d 删除空白行
- :g/^\n/s///g 删除空白行
- :g/.*/d 删除全文
- x 删除当前字符。
- dw 删除当前单词。
- dd 删除当前行。
- d$ 删除当前字符开始到行尾的所有字符。
- d0 删除前一个字符开始到行首的所有字符。
- ndd 删除当前行开始的连续n行。
- dH 删除从当前行到屏幕首行的内容。
- dM 删除从当前行到屏幕中间行的内容。
- dL 删除从当前行到屏幕末行的内容
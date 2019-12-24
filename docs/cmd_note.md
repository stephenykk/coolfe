windows 命令行
===

- `type hello.txt` 显示文件内容
- `dir /s  devFolder` 打印文件夹和子文件夹内容
- `dir /s musicFolder | findStr "mp3" ` 查找mp3文件夹在哪里
- `cd /d e:/dev` 直接切换到指定的分区和目录
- `path` 显示环境变量path
- `label` 修改分区卷标

- 开始运行`mstsc`， 打开远程桌面连接
- 文件关联
```shell
# 查看文件关联
assoc .txt  # .txt=txtfile 查看文件关联 
ftype txtfile # txtfile=%SystemRoot%\system32\NOTEPAD.EXE %1
# 设置文件关联
assoc .doc=wordfile
assoc .docx=wordfile
ftype wordfile=F:\软件\Office2007\MicrosoftOfficeWordPortable.exe %1
```
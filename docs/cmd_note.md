# windows 命令行

- `type hello.txt` 显示文件内容
- `dir /s devFolder` 打印文件夹和子文件夹内容
- `dir /s musicFolder | findStr "mp3"` 查找 mp3 文件夹在哪里
- `cd /d e:/dev` 直接切换到指定的分区和目录
- `path` 显示环境变量 path
- `label` 修改分区卷标 _需用管理员权限打开 cmd_ `label f:`
- `mstsc` 打开远程桌面连接

## 文件关联

```bat
    :: 查看后缀关联的文件类型
    :: .txt=txtfile
    assoc .txt

    :: 查看文件类型关联的打开程序
    :: txtfile=%SystemRoot%\system32\NOTEPAD.EXE %1
    ftype txtfile

    :: 设置.doc文件的打开程序
    assoc .doc=wordfile
    assoc .docx=wordfile
    ftype wordfile=F:\软件\Office2007\MicrosoftOfficeWordPortable.exe %1
```

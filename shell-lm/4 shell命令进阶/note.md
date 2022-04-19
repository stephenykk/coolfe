# shell 命令进阶

## 文件处理和归档

paste 合并多个文件的行，相同行号合并为1行

paste file1 file2

```bash
paste label.txt value.txt
paste -d '|' label.txt value.txt # 指定分隔符
paste -d ':,' label.txt value.txt memo.txt # 多个文件 可指定多个分隔符
paste -s label.txt value.txt # 行转换为列 得到表格格式
paste - - < label.txt # 每行内容看作字段值，两列显示，
paste -d: -  - < label.txt # 同上 指定列分隔符
```


## 备份和拷贝文件

dd 命令，可以备份分区 dvd u盘 简单的硬盘测速

dd if=<inputFile> of=<outputFile>

```bash
dd if=/dev/sda of=/dev/sdb # 复制磁盘
dd if=/dev/dvd of=dvd.iso # dvd制作iso文件
dd if=/dev/zero of=/dev/sda2 # 擦除分区数据
dd if=/dev/zero of=/tmp/outfile bs=1023 count=1 # bs块大小 count块数量
dd if=/home/abig.file of=/dev/null # 测试硬盘读写速度
```

压缩和归档文件

gzip 用于压缩/解压缩文件， 文本文件压缩率高

```bash
gzip img1.jpg img2.jpg # 压缩文件并删除源文件 生成img1.jpg.gz img2.jpg.gz
gzip -c img1.jpg # 压缩内容输出到stdout
gzip -c img1.jpg > img1.gz # 保留源文件 指定压缩文件名
gzip -d img1.gz # 解压文件,释放在当前目录
gzip -r . # 递归地压缩指定目录下的文件
gzip -3 hello.txt # 指定压缩级别 级别越大，压缩率越高

```

bzip2 也可以压缩/解压缩文件, 相比gzip压缩率更好

```bash
bzip2 hello.txt # 生成压缩文件hello.txt.bz2 并删除源文件
bzip2 -k hello.txt # 保留源文件
bzip2 -df hello.txt.bz2 # 解压文件 -f 强制覆盖已存在文件
```

gunzip bunzip2 解压文件,和 `-d`选项效果相同

```bash
gunzip hello.txt.gz # 解压 并删除压缩包
gunzip -c hello.txt.gz > hello.txt # 解压 保留压缩包
bunzip2 hi.bz2
bunzip2 -k hi.bz2

```

打包和解包文件

tar命令归档文件，将多个文件打包成为一个

```bash
tar -cvf photos.tar /home/alice/photos # 打包文件夹 -c 创建 -v 详细信息 -f 指定包文件名
tar -cvzf photos.tar.gz /home/alice/photos # 打包并压缩文件夹 -z 用gzip压缩文件内容
tar -cvjf photos.tar.bz2 /home/alice/photos # -j 用bzip2压缩文件
tar -xzvf photos.tar.gz /home/alice/photos/sing.jpg # 只解压指定文件
tar -xzvf photos.tar.gz --wildcards '*.jpg' # 解压匹配的文件出来
tar -tzvf photos.tar.gz # 查看压缩包的文件
tar -rvf photos.tar /home/alice/anew.jpg # 添加文件到tar包
tar -tWvf photos.tar # 比较tar包和文件系统文件的差异
tar -dvf photos.tar # -d 比较和源文件的差异
```

## 监测和管理磁盘

挂载和卸载存储介质

mount umount 挂载和卸载文件系统

```bash
mount # 显示已经挂载的文件系统
mount -t ext4 # 仅显示指定类型文件系统
mount -t sysfs # sysfs tmpfs等 为虚拟文件系统
mount -t iso9660 -o ro /dev/cdrom /mnt/dvd # -o ro 只读模式挂载
mount /dev/sda3 /mydata
mount -a # 挂载/etc/fstab中的所有项目
umount /opt/share # 卸载文件系统 指定挂载点或设备名
```

磁盘空间使用情况

df file

```bash
df # 显示所有文件系统的可用空间
df -a # 包括显示虚拟文件系统
df -h # 文件大小更可读格式
df -T # 显示信息增加文件系统类型字段
df -t ext4 # 显示指定类型的文件系统可用空间
df -x ext4 # 排除指定类型文件系统
```

文件空间使用情况

du 显示每个文件和目录占用的空间

```bash
du -h .
du -ah . # 递归地显示子目录下文件的大小
du -sh codes # 显示文件夹的总大小
du -h -0 # 不换行输出
du -ah --execlude="*.jpg" # 不统计jpg文件的大小
du -ah --time # 增加输出修改时间
```

## 后台执行命令

执行计划任务

cron 是执行计划任务的守护进程。自动执行 /var/spool/cron/crontabs 下定义的定时任务

还会读取 /etc/crontab 和 /etc/cront.d 下的内容

用crontab命令修改完定时任务文件后，不需要重启cront进程

定时任务文件由每行命令组成，每行命令有6个字段, 前5个表示时间 最后一个是命令

1. 分钟
2. 小时
3. 日期
4. 月份
5. 星期 0-6

- `*` 匹配所有可能值 `0 6 * * *` 表示每天6点
- `-` 表示范围 `0 2 * * 1-5` 表示周一到周五的凌晨2点
- `/` 表示每隔多少时间 `*/5 * * * *` 表示每隔5分钟
- `,` 表示或者 `0 0,6,12 * * *` 表示每天0点 6点和12点

```bash
crontab -l # 显示用户的定时任务
crontab -e # 编辑定时任务
crontab -u alice -l # 查看指定用户的定时任务
crontab -r # 移除当前用户的定时任务
crontab -i -r # 移除前确认
```

```

定时执行命令，只执行一次

at 可以从标准输入读取命令，也可以从文件读取

at [-f file] [-q queue] [option] time [date]

at 命令允许非常灵活的方式指定时间

```bash
at -f hello.sh now # 注意命令的输出不会显示到当前stdout
at now # 然后输入要执行的命令 ctrl + d 表示结束输入
at -f hi.sh now + 2 minutes
at -f hi.sh now + 1 hour 
at -f hi.sh 5am
at -l # 显示未执行的定时任务表
atq # 同上
atrm 1 2 # 删除任务1 2


```


将任务放到后台运行

在命令末尾加上 `&`,  command &

```bash
sleep 10 &
jobs # 显示后台任务
jobs -l # 明细列表 可查看任务对应的进程id
fg 1 # 任务1转到前台执行
%1 # 同上
sleep 30 # 按 ctrl + z 将当前命令转到后台 并暂停执行
bg 1 # 启动执行后台任务1
%1 & # 同上
```

关闭终端或退出登录依然执行任务

nohup command [arg] & nohup命令不会自动放到后台执行，所以要加控制符 `&`

```bash
nohup sh longtime.sh & # 退出终端后，依然执行，命令的输出会写到 nohup.out
# longtime.sh
sleep 3000
echo goodbye

# 关闭终端后，打开新终端 查看进程
ps -ef | grep longtime
```




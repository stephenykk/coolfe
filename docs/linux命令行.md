linux命令行
======

**查看系统信息**
- `uname -a` 查看系统信息
- `uname -o` 查看操作系统
- `cat /etc/issue`  查看发行版本 centos or ubuntu

**用户**

- `su - root` 切换到root用户
- 修改root密码  
- `sudo passwd` 修改root密码
- `who` 查看用户

**目录文件**

- `cd -` 返回上一次的目录
- `cd` or `cd ~` 打开用户主目录
- `pwd` 显示当前目录
- `touch foo` 创建文本文件 *其实是修改文件的访问时间，当文件不存在时则创建*
- `gedit foo` 打开文件编辑
- `mkdir test` 创建文件夹
- `makidr -p hello/world/file` 沿路径创建多层目录
- `mv test mytest` 重命名
- `mv foo.txt mytest` 移动文件
- `cp foo foo_back` 复制文件
- `cp dbData dbData_\`date +%Y-%m-%d\`` 备份文件 *常用*
- `rm -rf folder` 删除文件or文件夹 递归删除文件夹时要谨慎,无法恢复
- `tail -n 10 my.log ` 查看文件末尾10行内容
- `cat -n hello.txt` 查看文件内容

- `find / -name 关键字 -type d` 从根目录开始递归地查找匹配的文件夹
- `find / -name 关键字 -type f` 从根目录开始递归地查找匹配的文件
- `find / -name 关键字 -print` 从根目录开始递归地查找匹配的文件或文件夹
- `find / -name node* -print` 从根目录开始递归地查找node前缀的文件或文件夹
- `grep -r keyword folder`  递归地查找包含关键字的文件

**nginx**

- `sudo apt-get update` , `sudo apt-get install nginx` 安装nginx
- `sudo apt-get install curl`, `curl localhost` 验证nginx正常运行
- `sudo /etc/init.d/nginx {start|restart|stop}` nginx启动/重启/停止
- `nginx -s reload` 重启nginx
- `sudo service nginx {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}` 
- `nginx -v ` 显示nginx版本
- `nginx -t` 测试配置文件的设置，可看到配置文件路径

**快捷键**
- `ctrl + q` 关闭应用
- 打开终端 `ctrl+alt+t` or `win + a` 然后输入 terminal
- `ctrl + l` 清屏 同  `clear`

**程序**
- `whereis nginx` 查看nginx的安装路径

**环境变量**
- `echo $PATH` 查看环境变量PATH *注意区分大小写*
- `export PATH=/usr/local/mongodb/bin:$PATH` 临时配置 仅当前终端生效
- `vi /etc/profile`, 添加 `export PATH=/usr/local/mongodb/bin:$PATH` 全局配置
- `source /etc/profile` 让修改立即生效
- `vim /etc/environment` 全局配置 直接修改环境变量配置文件
- `vim ~/.bashrc`, 添加 `export PATH=/usr/local/mongodb/bin:$PATH` 当前用户配置

**磁盘**
- 查看磁盘剩余空间 `df -h` 或者 `df -k` (*容量大小k为单位*), 同理 `df -m`
- 管理磁盘 `super + A` 输入 `disks`, 打开 disks工具
- 查看硬盘参数 `sudo hdparm -I /dev/sdb`

**查看帮助**
- `info shutdown`
- `man shutdown`

**开/关机**
- 关机 `sudo init 0` 或 `sudo shutdown -h now`
- 重启 `sudo init 6`
- `shutdown`, `poweroff`, `halt` 具体用法看帮助
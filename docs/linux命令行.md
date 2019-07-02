linux命令行
======

**查看系统信息**
- `uname -a` 查看系统信息
- `uname -o` 查看操作系统
- `cat /etc/issue`  查看发行版本 centos or ubuntu

**用户**

- `su - root` 切换到root用户
- 修改root密码   
  ```
  su # 切换到root 输入root密码
  passwd #修改root密码，因为切换时已输入密码，此时直接输入两次新密码即可，root重置密码可以是简单密码
  ```
- 修改当前用户密码
  ```
  1. 当前用户修改自己的密码
  passwd #输入用户密码 然后输入两次新密码，新密码不能是简单密码
  2. root修改当前用户的密码
  su
  passwd {userName} # 然后输入新密码两次 可以是简单密码
  ```

- 修改其他用户的密码
  ```
  sudo passwd {otherUser} # 然后输入当前用户的密码，接下来等同root修改其他用户的密码, 可改为简单密码
  ```

- `who` 查看当前用户 详细
- `whoami`  查看当前用户 简短
- `cat /etc/passwd` 打开保存用户信息的文件

**目录文件**

- `cd -` 返回之前的目录
- `cd` or `cd ~` 打开用户主目录
- `pwd` 显示当前目录

- `touch foo` 创建文本文件 *其实是修改文件的访问时间，当文件不存在时则创建*
- `gedit foo` 打开并编辑文件

- `mkdir test` 创建文件夹
- `mkdir -p hello/world/folderA` 沿路径创建多层目录

- `mv myfile mytarget` mytarget不存在或者是文件，则相当于重命名； mytarget为文件夹，则是把myfile移入到文件夹
- `mv myfolder destFolder` 把 myfolder 移入 destFolder; 若destFolder不存在，则重命名myfolder为destFolder
- `mv myfolder/* destFolder` 把 myfolder 的内容移入 destFolder

- `cp myfile myfile_bk` 复制文件
- `cp dbData dbData_\`date +%Y-%m-%d\`` 备份文件 *常用*
- `cp -r myfolder myfolder_bk` 复制文件夹

- `rm myfile` 删除文件
- `rm -rf myfolder` 删除文件夹 *注意 无法恢复*

- `tail -n 10 web.log ` 查看文件末尾10行内容
- `cat -n hello.txt` 查看文件内容

- `find / -name 关键字 -type d` 从根目录开始递归地查找匹配的文件夹
- `find / -name 关键字 -type f` 从根目录开始递归地查找匹配的文件
- `find / -name 关键字 -print` 从根目录开始递归地查找匹配的文件或文件夹
- `find / -name "node*" -print` 从根目录开始递归地查找node前缀的文件或文件夹
- `grep -r keyword folder`  递归地查找包含关键字的文件

**nginx**

- `sudo apt-get update` , `sudo apt-get install nginx` 安装nginx
- `sudo apt-get install curl`, `curl localhost` 验证nginx正常运行
- `sudo /etc/init.d/nginx {start|restart|stop}` nginx启动/重启/停止
- `sudo nginx -s reload` 重启nginx, 通常修改配置后执行
- `sudo service nginx {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}` 
- `nginx -v ` 显示nginx版本
- `sudo nginx -t` 测试配置文件的设置，可看到配置文件路径

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
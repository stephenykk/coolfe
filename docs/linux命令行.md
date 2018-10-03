linux命令行
======

- `uname -a` 查看系统信息
- `cat /etc/issue`  查看发行版本 centos or ubuntu
- `cd -` 返回上一次的目录
- `pwd` 显示当前目录
- `tail my.log -n 100` 查看文件末尾n行内容
- `find / -name 关键字 -type d` 从根目录开始递归地查找匹配的文件夹
- `find / -name 关键字 -print` 从根目录开始递归地查找匹配的文件
- `su - root` 切换到root用户
- `sudo /etc/init.d/nginx {start|restart|stop}` nginx启动/重启/停止
- `nginx -s reload` 重启nginx
- `sudo service nginx {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}` 

以服务的形式管理nginx
- `nginx -v ` 显示nginx版本
- `nginx -t` 测试配置文件的设置，可看到配置文件路径


查找包含关键字的文件
`grep -r hello`  从当前目录递归地查找包含指定关键字的文件

- 打开终端 `ctrl+alt+t`

- 修改root密码  
打开终端，输入 `sudo passwd`, 然后输入 当前登录用户的密码，接着输入2次新密码；`su - root` 验证root密码设置

- 查看磁盘剩余空间 `df -h` 或者 `df -k`

- 管理磁盘 `super + A` 输入 `disks`, 打开 disks工具
- 关机 `sudo init 0` 或 `sudo shutdown -h now`
- 重启 `sudo init 6`
- 查看新挂的硬盘 `sudo hdparm -I /dev/sdb`

- 创建目录路径 `makidr -p hello/world/file`
- 查看PATH：`echo $PATH`
- 临时修改PATH且只对当前用户生效: `export PATH=/usr/local/mongodb/bin:$PATH`
- 永久修改PATH且只对当前用户生效:

    ```
        # 通过修改.bashrc文件:
        vim ~/.bashrc 
        # 在最后一行添上：
        export PATH=/usr/local/mongodb/bin:$PATH
        source ~/.bashrc # 立即生效
    ```


修改方法三:
通过修改profile文件:
vim /etc/profile
/export PATH //找到设置PATH的行，添加
export PATH=/usr/local/mongodb/bin:$PATH
生效方法：系统重启
有效期限：永久有效
用户局限：对所有用户

 

修改方法四:
通过修改environment文件:
vim /etc/environment
在PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"中加入“:/usr/local/mongodb/bin”
生效方法：系统重启
有效期限：永久有效
用户局限：对所有用户


- 备份文件，带当前日期,  ` echo hello > hi\`date +%Y-%m-%d\` `
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
- `sudo service nginx {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}` 

以服务的形式管理nginx
- `nginx -v ` 显示nginx版本
- `nginx -t` 测试配置文件的设置，可看到配置文件路径


查找包含关键字的文件
`grep -r hello`  从当前目录递归地查找包含指定关键字的文件

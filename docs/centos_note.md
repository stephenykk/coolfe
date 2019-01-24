centOS7 notes
====

更新yum源
---
1. 打开[163源页面](http://mirrors.163.com/.help/centos.html)，按参考操作
2. 备份默认源 `mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup`
3. firefox 下载163源页面对应centOS7的源文件 (或者用 wget下载)
4. 移动到源目录 `mv CentOS-Base-163.repo /etc/yum.repos.d/CentOS-Base.repo`
5. `yum clean all`
6. `yum makecache`
7. 测试yum安装 `yum install php -y`
8. `yum list | grep php` 有输出相关内容，则表示源可以正常访问



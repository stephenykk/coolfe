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


### 安装桌面
如果最小安装centos，那么还需自己安装桌面
1. 安装桌面 `yum groupinstall "GNOME Desktop"`
2. ~~设置启动目标为桌面 `ln -sf /lib/systemd/system/runlevel5.target /etc/systemd/system/default.target`~~ 不生效
2. `cat /etc/inittab` 根据提示查看和设置当前默认启动界面 `systemctl get-default`, `systemctl set-default graphical-target` (*graphical-target位于 /etc/systemd/system *)
3. 重启 `sudo init 6`

### 安装增强工具
如果最小安装centos，那么安装增强工具前，还需要手动安装一下依赖，[参考](https://www.jianshu.com/p/7c556c783bb2)

1. `yum install -y gcc`
2. `sudo yum install -y "kernel-devel-uname-r == $(uname -r)"` 安装和系统内核一致的 kernel-devel
3. 从菜单选择 设备-安装增强工具， 也可从 命令行安装  
    - `$ cd /run/media/{user}/VBOXADDITIONS_5.1.22_115126` 
    - `sudo sh ./VBoxLinuxAdditions.run`


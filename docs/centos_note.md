centOS7 notes
====

### 添加用户到sudoer列表中
```
su - root  #切换到root
vi /etc/sudoers 
# 1. 搜索 
# root    ALL=(ALL)    ALL
# 2. 在下面输入
# pan    ALL=(ALL)       ALL
# 3. 保存



window7下安装centos
----
0. 腾出一个新分区D盘(2-3G即可)，和将安装centOS的分区并删除分区(其实就是让磁盘有剩余未分配的空间)
1. 到centos官网下载centos_minimal.iso镜像 (fat32分区不支持4G以上的大文件，所以用minimal版本), 用解压工具/utraliso提取isolinux文件夹到D盘
2. 下载 grub4dos， grub.exe复制到D盘,
3. 用光盘或U盘或maxdos之类的工具，引导到纯dos下
4. 切换到D盘执行 grub
5. 进入grub后执行  
	```shell
	root (hd0,1)
	kernel (hd0,1)/isolinux/vmlinuz linux repo=hd:/dev/sda2:/
	initrd (hd0,1)/isolinux/initrd.img
	boot
	```

centos7最小化安装开启网络
---
centos7最小化安装默认没有net-tools, 所以ifconfig不可用，也不能上网，
编辑网卡配置文件，`ONBOOT=yes`
```bash
vi + /etc/sysconfig/network-scripts/ifcfg-ens33
// /ONBOOT 搜索ONBOOT
// 修改 ONBOOT=yes 保存退出

// 重启网络服务
sudo service network restart
ping 114.114.114.114 // 检测网络连通性
// 安装net-tools
yum install -y net-tools
// ifconfig 可用，查看ip
ifconfig

// 开启ssh
service sshd start

// 然后可以用putty远程登录了

```



更新yum源
---
1. 打开[163源页面](http://mirrors.163.com/.help/centos.html)，按参考操作
2. 备份默认源 `mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup`
3. firefox 下载163源页面对应centOS7的源文件 (或者用 wget下载 `wget http://mirrors.163.com/.help/CentOS7-Base-163.repo`)
4. 移动到源目录 `mv CentOS-Base-163.repo /etc/yum.repos.d/CentOS-Base.repo`
5. `yum clean all`
6. `yum makecache`
7. 测试yum安装 `yum install php -y`
8. `yum list | grep php` 有输出相关内容，则表示源可以正常访问


### 安装桌面
如果最小安装centos，那么还需自己安装桌面
1. 安装桌面 `yum groupinstall "GNOME Desktop"`
1.2 `sudo init 5`可临时手动切换到桌面
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


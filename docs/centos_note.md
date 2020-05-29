# centOS7 notes

## 添加用户到 `sudoer` 列表中

```bash
su - root  # 切换到root
vim /etc/sudoers

# 仿照 root 添加1行
# root    ALL=(ALL)    ALL
pan    ALL=(ALL)       ALL
```

## window7 下安装 centos

1. 腾出一个新分区 D 盘(_2-3G 即可_)和将安装 centOS 的分区，并删除分区(_其实就是让磁盘有剩余未分配的空间_)
1. 到 centos 官网下载 `centos_minimal.iso` 镜像 (_fat32 分区不支持 4G 以上的大文件，所以用 minimal 版本_), 用解压工具 `utraliso` 提取 `isolinux` 文件夹到 D 盘
1. 下载 `grub4dos` `grub.exe` 复制到 D 盘,
1. 用光盘(_U 盘 或 maxdos 之类的工具_)，引导到纯 dos 下
1. 切换到 D 盘执行 grub
1. 进入 grub 后执行
   ```shell
   root (hd0,1)
   kernel (hd0,1)/isolinux/vmlinuz linux repo=hd:/dev/sda2:/
   initrd (hd0,1)/isolinux/initrd.img
   boot
   ```

## centos7 最小化安装后开启网络

centos7 最小化安装默认没有 `net-tools`, 所以 `ifconfig` 不可用，也不能上网  
编辑网卡配置文件，`ONBOOT=yes`

```bash
vi + /etc/sysconfig/network-scripts/ifcfg-ens33
# 输入 /ONBOOT 搜索ONBOOT
# 修改 ONBOOT=yes

# 重启网络服务
sudo service network restart
# 检测网络连通性
ping 114.114.114.114
# 安装net-tools
yum install -y net-tools
# ifconfig 可用，查看ip
ifconfig

# 开启ssh
service sshd start

# 然后可以用putty远程登录了

```

## 更新 yum 源

1. 打开[163 源页面](http://mirrors.163.com/.help/centos.html)，按参考操作
2. 备份默认源 `mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup`
3. firefox 下载 163 源页面对应 centOS7 的源文件 (或者用 wget 下载 `wget http://mirrors.163.com/.help/CentOS7-Base-163.repo`)
4. 移动到源目录 `mv CentOS-Base-163.repo /etc/yum.repos.d/CentOS-Base.repo`
5. `yum clean all`
6. `yum makecache`
7. 测试 yum 安装 `yum install php -y`
8. `yum list | grep php`

### 安装桌面

如果最小安装 centos，那么还需自己安装桌面

1. 安装桌面 `yum groupinstall "GNOME Desktop"`  
   `sudo init 5` 可切换到桌面
2. ~~设置启动目标为桌面 `ln -sf /lib/systemd/system/runlevel5.target /etc/systemd/system/default.target`~~ 不生效
3. `cat /etc/inittab` 根据提示查看和设置当前默认启动界面
   ```bash
   systemctl get-default
   # graphical-target 位于 /etc/systemd/system
   systemctl set-default graphical-target
   ```
4. 重启 `sudo init 6`

## 安装增强工具

如果最小安装 centos，那么安装增强工具前，还需要手动安装一下依赖，[参考](https://www.jianshu.com/p/7c556c783bb2)

1. `yum install -y gcc`
2. `sudo yum install -y "kernel-devel-uname-r == $(uname -r)"` 安装和系统内核一致的 kernel-devel
3. 从菜单选择 设备--安装增强工具， 也可从命令行安装
   ```bash
   cd /run/media/{user}/VBOXADDITIONS_5.1.22_115126
   sudo sh ./VBoxLinuxAdditions.run
   ```

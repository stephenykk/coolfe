# wsl document

## 升级到 wsl 2 需要安装的内核文件

[wsl 2 patch](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

## wsl 常用命令

```shell
## 在 powershell 下执行 wsl
wsl -l -v # 查看运行中的linux有哪些
wsl -l -o # 查看可以安装的linux发行版有哪些
wsl --status # 查看 wsl 的状态
wsl --set-default-version 2 # 设置 新分发系统的默认安装版本
wsl --install -d <发行版名称> # wsl -l -o 查看可安装的linux发行版
wsl --unregister <发行版名称> # 删除已安装的发行版
```

## 安装软件

```bash
# nginx
sudo apt-get install nginx -y
# 设置 ngxin 开机自启
[doc 1](https://www.cnblogs.com/hoaprox/p/12416624.html)
[doc 2](https://blog.csdn.net/willingtolove/article/details/107494719)

```

mongodb notes
===

安装
---

连接
---

使用
---

```
# 显示所有db
show dbs
# 显示当前db
db
# 切换当前db
use <db>
# 显示所有集合
show collections

# 获取当前mongodb的配置信息
use admin
db.runCommand({getParameter: '*'})
```




一、下载完安装包，并解压 tgz（以下演示的是 64 位 Linux上的安装） 。

　　curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.6.tgz    # 下载
　　tar -zxvf mongodb-linux-x86_64-3.0.6.tgz                                   # 解压

　　mv  mongodb-linux-x86_64-3.0.6/ /usr/local/mongodb                         # 将解压包拷贝到指定目录
 

二、MongoDB 的可执行文件位于 bin 目录下，所以可以将其添加到 PATH 路径中：

　　export PATH=<mongodb-install-directory>/bin:$PATH
　　 <mongodb-install-directory> 为 MongoDB 的安装路径。如本文的 /usr/local/mongodb 。

 

三、创建数据库目录

　　　　MongoDB的数据存储在data目录的db目录下，但是这个目录在安装过程不会自动创建，所以你需要手动创建data目录，并在data目录中创建db目录。以下实例中我们将data目录创建于根目录下(/)。

　　　　注意：/data/db 是 MongoDB 默认的启动的数据库路径(--dbpath)。

　　　　mkdir -p /data/db

四、命令行中运行 MongoDB 服务

　　　①可以在 /usr/local/mongodb/bin/ 目录下使用命令：　　

　　　　./mongod
　　　②在 /usr/local/mongodb/ 下添加conf目录，并添加mongodb.conf配置文件。

　　　　./mongod -f /usr/local/mongodb/conf/mongodb.conf 　　或者
　　　　./mongod --config /usr/local/mongodb/conf/mongodb.conf

　　　　mongodb.conf配置文件内容如下：
　　　　　　dbpath=/data/db
　　　　　　bind_ip=127.0.0.1
　　　　　　port=27017
　　　　　　fork=true
　　　　　　logappend=true
　　　　　　shardsvr=true
　　　　　　pidfilepath=/usr/local/mongodb/mongo.pid
　　　　　　logpath=/usr/local/mongodb/log/mongodb.log

五、设置开机启动mongo

　　　方法一、①在/etc/init.d/目录下添加mongod脚本，

　　　　　　　②添加脚本执行权限　　chmod +x /etc/init.d/mongod 

　　　　　　　③设置开机启动　　chkconfig mongod on 

　　　　　　mongo脚本内容如下：

　　　　　　#!/bin/bash

　　　　　　　#chkconfig: 2345 80 90

　　　　　　　#description: mongodb
　　　　　　　start() {
　　　　　　　/usr/local/mongodb/bin/mongod -f /usr/local/mongodb/conf/mongodb.conf
　　　　　　　}

　　　　　　　stop() {
　　　　　　　/usr/local/mongodb/bin/mongod -f /usr/local/mongodb/conf/mongodb.conf --shutdown
　　　　　　　}

　　　　　　　case "$1" in
　　　　　　　start)
　　　　　　　start
　　　　　　　;;
　　　　　　　stop)
　　　　　　　stop
　　　　　　　;;
　　　　　　　restart)
　　　　　　　stop
　　　　　　　start
　　　　　　　;;
　　　　　　　*)
　　　　　　　echo $"Usage: $0 {start|stop|restart}"
　　　　　　　exit 1
　　　　　　　esac

　　　方法二、将　/usr/local/mongodb/bin/mongod

　　　　　　　　　--dbpath /data/db

　　　　　　　　　--fork

　　　　　　　　　--port 27017

　　　　　　　　　--logpath=/usr/local/mongodb/log/mongodb.log

　　　　　　　　　--logappend  

　　　　　　 　添加到 /etc/rc.local 中。
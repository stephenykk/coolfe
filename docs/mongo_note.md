mongodb notes
==============

备份
--------
用 `mongodump` 工具完成备份，可以先把 mongodb的安装目录加入path环境变量, 这样方便直接在命令行调用相关工具(`mongodump`, `mongorestore`)


`mongodump -h 127.0.0.1 -d mydb -o mongo_bk`

参数详解:
+ `-h/--host`  

    mongodb服务器所在地址(本地的或远程的)，如 127.0.0.1, 也可以同时指定端口号 127.0.0.1:27017 (*端口号默认为 27017*)

+ `-d/--db`

    需要备份的数据库名, 如: mydb , 不指定 `--db` 参数时，将备份所有数据库

+ `-o`

    备份数据的存放目录(*需提前建好*) 如:  `mongodump -h 172.1.2.3:27017 -d mydb -o data/dump`

示例:

语法 | 描述 | 示例
-----|------|------
mongodump --host <host> 



MongoDB数据恢复
mongodb使用 mongorerstore 命令来恢复备份的数据。

语法
mongorestore命令脚本语法如下：

`mongorestore -h dbhost -d dbname --directoryperdb dbdirectory`

**-h：**
MongoDB所在服务器地址

**-d：**
需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2

**--directoryperdb：**
备份数据所在位置，例如：c:\data\dump\test，这里为什么要多加一个test，而不是备份时候的dump，读者自己查看提示吧！

**--drop：**
恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用哦！


mongorestore -h 127.0.0.1 -d tms --dir  ./tms_back20180910/tms
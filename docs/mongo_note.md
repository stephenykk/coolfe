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
# sqlite note

## 简介
SQLite 是一个软件库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎。  
SQLite 很轻量，使用广泛。

## 安装
[sqlite下载地址](http://www.sqlite.org/download.html)  
1. 下载 [sqlite-dll-win64-x86](https://www.sqlite.org/2020/sqlite-dll-win64-x64-3320100.zip) , 解压放到 `system32` 目录下
2. 下载 [sqlite-tools-win32-x86](https://www.sqlite.org/2020/sqlite-tools-win32-x86-3320100.zip) ， 解压到任意目录
3. 把 sqlite-tools 的解压目录，加入 `path` 环境变量
4. 命令行下，输入 `sqlite3` ， 验证安装成功
5. `.open test.db` 创建数据库
6. `create table books (id int primary key not null, name text not null, price int not null)；` 创建book表
7. `.table`  查看有哪些表
8. `insert into books values (1, 'war and peace', 10)` 插入1条数据
9. `select * from books;` 查数据



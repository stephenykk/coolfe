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



数据操作
---
### 查询文档
`db.collection.find(query,projection)` 

> 查看db对象 collection对象有哪些可用的方法 
> Object.keys(db.constructor.prototype)
> Object.keys(db.books.constructor.prototype)
> 


```
// 假设有名为 books 的集合
db.books.find()
db.books.find().pretty()
db.books.find({name: 'learn nodejs'})  // 查询 name == ‘learn nodejs'的文档
db.books.find({name: {$regex: /java/}}) // 模糊搜索 name 包含 'java' 的文档
db.books.find({name: {$in: [/java/, /h5/]}}) // $in操作符中 可用正则对象或字符串，相反含义的操作符 $nin 
db.book.find({name: {$in: ['two cities', 'war and peace']}}, {name: 1, price: 1, \_id: 0})
db.books.find({name: /java/i}) // 可直接用正则
db.books.find({price: {$lt: 100}}) // 价格小于100的  其他比较运算符 $gt $gte $ne   $lt $lte

// and 条件 用对象表达
db.books.find({key1: val1, key2: val2}).pretty()
db.books.find({name: 'learn nodejs', year: '2019'}) // 同时满足两个条件

// or 条件 用数组表达
db.books.find({$or: [{key1: val1}, {key2: val2}]}).pretty()
db.books.find({$or: [{name: 'learn nodejs'}, {name: 'begin js'}]}) // 满足其中一个条件的

and or 联合使用
db.books.find({"likes": {$gt:50}, $or: [{"by": "Mongodb中文网"},{"title": "MongoDB 教程"}]}).pretty()

指定返回字段
db.books.find({price: {$lt: 100}}, {_id: 0, name: 1, price: 1}) // 包含模式 指定只返回 name price 两个字段
db.books.find({price: {$lt: 100}}, {book_id: 0}) // 排除模式 不返回 book_id字段，其他都返回

指定数组返回的元素个数
db.books.find({name:"java beginer"},{status:0,authors:{$slice:1}})

排序
db.books.find({name: /java/i}).sort({price: -1}) // 按价格倒序

指定返回结果数
db.books.findOne({name: /java/}) // 返回1条记录
db.books.find({name: /java/}).limit(1) // 同 findOne

skip and limit 等同 数组slice的效果
db.books.find({name: /java/}).sort({price: -1}).skip(10).limit(3)
```
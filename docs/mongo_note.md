mongodb notes
==============
简介
---
　　它是介于关系型数据库和非关系型数据库之间的一种NoSQL数据库，用C++编写，是一款集敏捷性、可伸缩性、扩展性于一身的高性能的面向文档的通用数据库。

特征：

+ 灵活的文档数据模型  
    可以非常容易的存储不同结构的的数据，并且还能动态的修改这些数据的源结构模式

+ 可伸缩可扩展性  
    从单个服务器到数千个节点，MongoDB可以很轻松的进行水平扩展，部署多个数据中心

+ 二级索引  
    包括在完全一致的任何字段上的索引、地理空间、文本搜索以及TTL索引，都能进行快速、细粒度的访问到数据

+ 丰富的查询语言  
    MongoDB的查询语言提供了多样化的字段级别的操作符、数据类型以及即时更新。几乎提供了所有编程语言的驱动来更直观的使用它

+ 健壮的操作工具  
    MongoDB的管理服务和运维管理工具可以使你很轻松的部署，监控、备份和规划它

使用场合：

+ 需要写入大量的数据，但是这些这些数据的价值并不是太高，比如：日志

+ 数据增长量较大，而且数据结构有时候还不一致

+ 未来数据会很大

安装
---
1. 下载安装包，并安装
1. 把安装目录加到 PATH 环境变量中
1. mongod --dbpath d:\MongoDB\data  # 开启数据库服务
1. 新开命令行，输入 mongo # 连接数据库
2. 每次都手动开启数据库服务比较麻烦，所以用管理员身份打开命令行，注册window服务  
    `mongod.exe --logpath D:\mongodb\logs\mongodb.log --logappend --dbpath D:\mongodb\data --directoryperdb --serviceName MongoDB --install` 
3. 运行`services.msc` 找到前面注册的MongoDB服务, 手动开启  
    mongodb服务启动失败，删除文件 mongod.lock storage.bson, 删除服务，重新安装即可 [详见](https://blog.csdn.net/u010452388/article/details/83025770)


备份
--------
用 `mongodump` 工具完成备份，可以先把 mongodb的安装目录加入path环境变量, 这样方便直接在命令行调用相关工具(`mongodump`, `mongorestore`)


`mongodump -h 127.0.0.1 -d book -o dbback`

参数详解:
+ `-h/--host`  
    mongodb服务器所在地址(本地的或远程的)，如 127.0.0.1, 也可以同时指定端口号 127.0.0.1:27017 (*端口号默认为 27017*)

+ `-d/--db`
    需要备份的数据库名, 如: mydb , 不指定 `--db` 参数时，将备份所有数据库

+ `-o`
    备份数据的存放目录(*需提前建好*) 如:  `mongodump -h 172.1.2.3:27017 -d mydb -o dataBack`

```bash
mongo #连接本地mongodb
show dbs
use book
db.books.insert({name: 'two cities', price: 12}) # 创建collection, 添加1条数据
# db.createCollection('books') # 显式地创建collection
db.stats()
```

恢复
---
用 mongorerstore 命令来恢复备份的数据


参数详解:

+ -h：  
    MongoDB服务器地址

+ -d：  
    需要恢复的数据库名称(*可以和备份时候的不一样*)

+ --directoryperdb：  
    备份数据所在位置(*c:\data\dump\test*)

+ --drop：  
    先删除再恢复(*备份后的数据修改会丢失*)


```bash
# 删除 book 数据库
mongo # 连接本地monog数据库
show dbs
use book
db.dropDatabase()  # db.help() 查看db的方法
show dbs

# 根据备份恢复
mongorestore -h 127.0.0.1 -d book --directoryperdb dbBack/book
mongorestore -h 127.0.0.1 -d tms --dir  ./tms_back20180910/tms

# 查看
mongo
show dbs
use book
db.stats() # 查看统计信息 占用空间大小 集合 对象数量等..


```

连接mongodb
---
[eggjs连接mongoose](https://www.jianshu.com/p/44afea9b4607)


MongoDB客户端-shell简介
---
它被称为javascript shell，通过它可以使用命令与MongoDB实例进行交互，它是一个非常重要的工具； 

同时也是个功能完备的JavaScript解释器，可以运行任意的JavaScript程序 如: `print('hello mongo')` 没有 console.log

通过shell可以进行对数据的四个基本操作：创建，读取，更新和删除（即CRUD）操作； 

文档和集合
---
- 文档：因为MongoDB是面向文档的数据库，那么可想而知文档是它的基本单元，相当于关系型数据库中的行

- 集合：多个文档组织在一起就是一个集合，这些文档可以是不同的结构，相当于关系型数据库中的表


数据类型
---
文档与JavaScript中的对象很相似，所以可以类比JSON；

字段的数据类型：

- null：null
- 布尔：true和false
- 数值：shell中默认为64位的浮点型数值
- 字符串
- 日期：new Date()；
- 正则表达式
- 数组
- 内嵌文档：指文档中可以嵌套其他文档
- 对象id：文档的唯一标识，是一个12byte的ID

数据操作
---

### 查看数据库和表
```bash
show dbs # 显示所有数据库
use <dbname>  # 切换数据库
db # 显示当前数据库

show collections # 显示数据库有哪些表
# db.<collectionName>.find().count()
db.books.find().count() # 查看记录总数

help  # 查看帮助 上面的命令都有

```

### 查询文档
```bash
# db.collection.find(query, projection)

# 查看db对象 collection对象有哪些可用的方法 
db.help()  # Object.keys(db.constructor.prototype)
db.mycoll.help() # Object.keys(db.books.constructor.prototype)

# 添加数据
db.books.insert({name:'two city', price: 20})
db.books.insert({name:'learn nodejs', price: 22})

# 假设有名为 books 的集合
db.books.find()
db.books.find().pretty()
db.books.find({name: 'learn nodejs'})  # 查询 name == ‘learn nodejs'的文档
db.books.find({name: {$regex: /java/}}) # 模糊搜索 name 包含 'java' 的文档
db.books.find({name: {$in: [/java/, /h5/]}}) # $in操作符中 可用正则对象或字符串，相反含义的操作符 $nin 
db.book.find({name: {$in: ['two cities', 'war and peace']}}, {name: 1, price: 1, \_id: 0})
db.books.find({name: /java/i}) # 可直接用正则
db.books.find({price: {$lt: 100}}) # 价格小于100的  其他比较运算符 $gt $gte $ne   $lt $lte

# and 条件 用对象表达
db.books.find({key1: val1, key2: val2}).pretty()
db.books.find({name: 'learn nodejs', year: '2019'}) # 同时满足两个条件

# or 条件 用数组表达
db.books.find({$or: [{key1: val1}, {key2: val2}]}).pretty()
db.books.find({$or: [{name: 'learn nodejs'}, {name: 'begin js'}]}) # 满足其中一个条件的

# and or 联合使用
db.books.find({"likes": {$gt:50}, $or: [{"by": "Mongodb中文网"},{"title": "MongoDB 教程"}]}).pretty()

# 指定返回字段
db.books.find({price: {$lt: 100}}, {_id: 0, name: 1, price: 1}) # 包含模式 指定只返回 name price 两个字段
db.books.find({price: {$lt: 100}}, {book_id: 0}) # 排除模式 不返回 book_id字段，其他都返回

# 指定数组返回的元素个数
db.books.find({name:"java beginer"},{status:0,authors:{$slice:1}})

# 排序
db.books.find({name: /java/i}).sort({price: -1}) # 按价格倒序

# 指定返回结果数
db.books.findOne({name: /java/}) # 返回1条记录
db.books.find({name: /java/}).limit(1) # 同 findOne

# skip and limit 等同 数组slice的效果
db.books.find({name: /java/}).sort({price: -1}).skip(10).limit(3)

# 删除文档
db.books.remove({})

```
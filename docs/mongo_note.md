# mongodb notes

## 简介

它是介于关系型数据库和非关系型数据库之间的一种 NoSQL 数据库，用 C++编写，是一款集敏捷性、可伸缩性、扩展性于一身的高性能的面向文档的通用数据库。

特征：

- 灵活的文档数据模型  
   可以非常容易的存储不同结构的的数据，并且还能动态的修改这些数据的源结构模式

- 可伸缩可扩展性  
   从单个服务器到数千个节点，MongoDB 可以很轻松的进行水平扩展，部署多个数据中心

- 二级索引  
   包括在完全一致的任何字段上的索引、地理空间、文本搜索以及 TTL 索引，都能进行快速、细粒度的访问到数据

- 丰富的查询语言  
   MongoDB 的查询语言提供了多样化的字段级别的操作符、数据类型以及即时更新。几乎提供了所有编程语言的驱动来更直观的使用它

- 健壮的操作工具  
   MongoDB 的管理服务和运维管理工具可以使你很轻松的部署，监控、备份和规划它

使用场合：

- 需要写入大量的数据，但是这些这些数据的价值并不是太高，比如：日志

- 数据增长量较大，而且数据结构有时候还不一致

- 未来数据会很大

## 安装

1. 下载安装包，并安装
1. 把安装目录加到 PATH 环境变量中
1. mongod --dbpath d:\MongoDB\data # 开启数据库服务
1. 新开命令行，输入 mongo # 连接数据库
1. 每次都手动开启数据库服务比较麻烦，所以用管理员身份打开命令行，注册 window 服务  
   `mongod.exe --logpath D:\mongodb\logs\mongodb.log --logappend --dbpath D:\mongodb\data --directoryperdb --serviceName MongoDB --install`
1. 运行`services.msc` 找到前面注册的 MongoDB 服务, 手动开启  
   mongodb 服务启动失败，删除文件 mongod.lock storage.bson, 删除服务，重新安装即可 [详见](https://blog.csdn.net/u010452388/article/details/83025770)

## 备份

用 `mongodump` 工具完成备份，可以先把 mongodb 的安装目录加入 path 环境变量, 这样方便直接在命令行调用相关工具(`mongodump`, `mongorestore`)

`mongodump -h 127.0.0.1 -d book -o dbback`

参数详解:

- `-h/--host`  
   mongodb 服务器所在地址(本地的或远程的)，如 127.0.0.1, 也可以同时指定端口号 127.0.0.1:27017 (_端口号默认为 27017_)

- `-d/--db`
  需要备份的数据库名, 如: mydb , 不指定 `--db` 参数时，将备份所有数据库

- `-o`
  备份数据的存放目录(_需提前建好_) 如: `mongodump -h 172.1.2.3:27017 -d mydb -o dataBack`

```bash
mongo #连接本地mongodb
show dbs
use book
db.books.insert({name: 'two cities', price: 12}) # 创建collection, 添加1条数据
db.users.insert([{"_id":1,"name":"tom","age":21},{"_id":2,"name":"joe","age":22},{"_id":3,"name":"bob","age":22}]) # 可批量添加
# db.createCollection('books') # 显式地创建collection
db.stats()

# 查询
db.users.find({age: 12}) # 返回列表 同 db.users.find({age: {$eq: 12}})
db.users.find({name: {$ne: 'tom'}})
db.users.findOne({age: 12}) # 只返回一个

db.blogs.find({"author":"张三","title":"MongoDB简介"})
db.blogs.find({"readCount":{"$gte":200,"$lt":1000}})
db.blogs.find({"$or":[{"author":"张三"},{"author":"李四"}]})
db.blogs.find({"tags":{"$in":["NoSQL","数学"]}})
# 注：not in操作
db.blogs.find({"tags":{"$nin":["NoSQL","数学"]}})
db.blogs.find({"content": /hello/})
db.blogs.find({"tags":{"$all":["story","rule"]}}) # tags同时包含story 和 rule
db.blogs.find({"tags.0":"MongoDB"}) # tags[0] == MongoDB 的
db.blogs.find({"tags":{"$size":3}}) # tags有3个元素的

db.blogs.find({"comment.name":"Jack"}) #查询内嵌文档
# 注：skip()、limit()、sort()，分别表示略过文档的数量，匹配的数量和排序（1表示正序，-1表示倒序）
db.blogs.find({}).skip(2).limit(2).sort({"readCount":-1})

# 单文档更新
db.users.update({"name":"bob"},{$set:{"age":23}}) # 更新匹配第一个文档的 age字段
db.users.update({"name":"bob"},{"age":23}) # 替换匹配第一个文档为新文档 {age: 23} objectId不变

# 多文档更新
# 集合的所有文档 加新字段
db.users.update({},{$set:{"hobby":"write"}},false,true)  # 第三个参数为是否启用特殊更新，第四个为是否更新所有匹配的文档；


# 把 userA hobby属性改成string数组类型
db.users.update({"_id":0},{"$set":{"hobby":["write","read","paly ping-pong"]}})

# 删除 userB 的 hobby字段
db.users.update({"_id":1},{"$unset":{"hobby":1}}) # 1表示彻底删除这个键值对

# 全部用户年龄+1
db.users.update({},{"$inc":{"age":1}},false,true) # 别忘了将第四个参数置为true

# 给 userA 加新的爱好
db.users.update({"_id":0},{"$push":{"hobby":"swim"}}) # hobby必须是一个数组，所以你在其他文档上使用是不会成功的

# 给 userA 去掉 read爱好
db.users.update({"_id":0},{"$pull":{"hobby":"read"}}) #它会移除数组中所有匹配到的“read”元素
# 移除 首/尾 元素
db.users.update({"_id":0},{"$pop":{"hobby":1}}) # 表示移除hobby中的最后一个元素，为-1表示移除第一个元素


db.users.stats() # 查看collection信息


db.users.remove({"_id":{"$lte":1}}) # 删除“_id”的值小于等于1的所有文档
db.users.remove() # 清空集合 db.users.drop()  更快


# 索引
db.users.createIndex({ "username" : 1 }) # 添加索引能大幅的提高查询速度 索引方向：1表示升序，-1表示降序
db.users.createIndex({ "username" : 1, "age" : -1, "userid" : 1 })  # 在“username”、“age”和“userid”上建立复合索引

db.users.createIndex({"username" : "text"}) # 文本索引
db.users.createIndex({"username" : "hashed"}) # 哈希索引

db.users.createIndex({"username" : 1}, {"unique" : true}) # 唯一索引
# 在“createdate”字段上建立一个TTL索引，当这个字段存在并且是日期类型，当服务器时间比“createdate”字段的时间晚60*60*24秒，即24小时，文档就会被删除
db.users.createIndex({ "createdate" : 1 },{ "expireAfterSecs" : 60*60*24 }) # TTL（Time-To-Live）索引
db.users.createIndex({"age" : 1},{"sparse" : true}) # 稀疏索引

# 查看索引
db.users.getIndexes()
# 移除索引
db.users.dropIndex({"createdate1" : 1 })
# 移除所有索引
db.users.dropIndexes()
# 重建索引
db.users.reIndex()

```

## 恢复

用 mongorerstore 命令来恢复备份的数据

参数详解:

- -h：  
   MongoDB 服务器地址

- -d：  
   需要恢复的数据库名称(_可以和备份时候的不一样_)

- --directoryperdb：  
   备份数据所在位置(_c:\data\dump\test_)

- --drop：  
   先删除再恢复(_备份后的数据修改会丢失_)

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

## 连接 mongodb

[eggjs 连接 mongoose](https://www.jianshu.com/p/44afea9b4607)

## MongoDB 客户端-shell 简介

它被称为 javascript shell，通过它可以使用命令与 MongoDB 实例进行交互，它是一个非常重要的工具；

同时也是个功能完备的 JavaScript 解释器，可以运行任意的 JavaScript 程序 如: `print('hello mongo')` 没有 console.log

通过 shell 可以进行对数据的四个基本操作：创建，读取，更新和删除（即 CRUD）操作；

## 文档和集合

- 文档：因为 MongoDB 是面向文档的数据库，那么可想而知文档是它的基本单元，相当于关系型数据库中的行

- 集合：多个文档组织在一起就是一个集合，这些文档可以是不同的结构，相当于关系型数据库中的表

## 数据类型

文档与 JavaScript 中的对象很相似，所以可以类比 JSON；

字段的数据类型：

- null：null
- 布尔：true 和 false
- 数值：shell 中默认为 64 位的浮点型数值
- 字符串
- 日期：new Date()；
- 正则表达式
- 数组
- 内嵌文档：指文档中可以嵌套其他文档
- 对象 id：文档的唯一标识，是一个 12byte 的 ID

## 数据操作

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

## 配置账号密码

添加管理员账号

```bash
> use admin
switched to db admin
> db.createUser({user:"admin",pwd:"hi",roles:["root"]})
Successfully added user: { "user" : "admin", "roles" : [ "root" ] }

```

添加数据库账号(_同上 仅仅数据库不同_)

```bash
> use test
> db.createUser({user: 'pan', pwd: '123', roles: [{role: 'dbOwner', db: 'test'}]}) # 设置角色为 dbOwner
> db.auth('pan' , '123')

```

登录测试

```bash
> use admin
> db.auth("admin", "hi")  # 1
> use test
> db.auth('admin', 'hi') # error
# 用户有角色权限，刚创建的admin用户 只对 admin数据库有权限
```

查看所有用户

```bash
> use admin
> db.system.users.find()
{ "_id" : "admin.admin", "user" : "admin", "db" : "admin", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "ZZ65o/Xynxut0zp2F5ALiQ==", "storedKey" : "YJzQW7g/7hv17aEiR9fzXShpA/Q=", "serverKey" : "x3zNT9RY4HoyPQ0RNZDOo6qVVkM=" } }, "roles" : [ { "role" : "root", "db" : "admin" } ] }
{ "_id" : "test.pan", "user" : "pan", "db" : "test", "credentials" : { "SCRAM-SHA-1" : { "iterationCount" : 10000, "salt" : "O8ofiEd7FUgY2dJqRv9MMQ==", "storedKey" : "XpdW288aGLELuu4d3WxjXuU0U8A=", "serverKey" : "BH0px2JrTjfOCYp11Ci3yz8wOsQ=" } }, "roles" : [ { "role" : "dbOwner", "db" : "test" } ] }
```

删除用户

```bash
# 删除用户的时候需要切换到用户管理的数据库才可以删除
> use test
> db.dropUser('pan')
# 验证
> db.auth('pan', '123')
# 查看用户
> use admin
> db.system.users.find()

```

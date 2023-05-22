# mongoose 教程

[mongoose 使用教程](https://www.cnblogs.com/chris-oil/p/9145364.html) _比较清晰_

## 连接 mongodb

两种方式
```js
mongoose.createConnection()
mongoose.connect()
```

```js
const mongoose = require("mongoose");

// 1. mongoose.connect(uri, options)
// uri: mongodb://user:pwd@host:port/db
mongoose.connect("mongodb://localhost:27017/test");
const conn = mongoose.connection;

// 2. conn = mongoose.createConnection(uri, options)
// const conn = mongoose.createConnection('mongodb://pan:hi@127.0.0.1:27017/test', {useNewUrlParser: true})

conn.on("error", () => {
  console.error("数据库连接失败");
});
// 连接成功 会触发 open 事件
conn.on("open", () => {
  console.log("数据库连接成功");
});

var schema = new mongoose.Schema({ name: String });

// Model = conn.model(ModelName, schema, collectionName)
var Book = conn.model("Book", schema, "books");
var abook = new Book({ name: "war and peace" });

// callback style
abook.save(function (err) {
  if (err) throw err;
  console.log("save ok");
});

// async-await style
let res = await abook.save();
```

> app 只用到一个数据库，你应该使用 mongoose.connect。如果你还需要连接其他数据库，使用 mongoose.createConnection。mongoose.connect(), mongoose.connection 就是 Connection 对象 ，而使用 mongoose.createConnection 返回值就是 Connection 对象.

> Mongoose 会缓存所有命令直到连接上数据库，这意味着你不必等待它连接 MongoDB 再定义 models，执行 queries 等。

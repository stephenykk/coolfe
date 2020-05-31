# h5 indexedDB

[客户端持久化解决方案：indexedDB](https://www.cnblogs.com/stephenykk/p/6080720.html)

indexedDB 是全局对象，相关 api 如下:

```js
indexedDB.open(dbName, version);
function openDB(name, version) {
  version = version || 1;
  //打开或创建数据库
  var idbRequest = window.indexedDB.open(name, version);
  idbRequest.onerror = function (e) {
    console.warn("error: %s", e.currentTarget.error.message);
  };

  idbRequest.onsuccess = function (e) {
    db = e.target.result; //这里才是 indexedDB对象
    console.log("idbRequest === e.target: %o", idbRequest === e.target);
    console.log("db: %o, idbRequest: %o", db, idbRequest);
  };

  // 注意: 只能请求>=当前数据库版本号的版本
  //  大于当前版本号, 则触发 onupgradeneeded,
  //  小于当前版本号，则触发 onerror
  idbRequest.onupgradeneeded = function (e) {
    console.log("DB version change to " + version);
    var db = e.target.result;
    console.log("onupgradeneeded: db->", db);
  };

  // 初始化objectStore
  idbRequest.onupgradeneeded = function (e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains("students")) {
      //db.createObjectStore('students',{autoIncrement: true});//keyGenerator
      db.createObjectStore("students", { keyPath: "id" });
    }
    console.log("DB version changed to " + version);

    // db.deleteObjectStore(storeName); //注意：需在onupgradeneeded钩子中执行
  };
}

window.indexedDB.deleteDatabase(dbName);

db.onclose = function () {
  //do sth..
};
db.close();

//打开一个事务，使用students 和teacher objectStore
var transaction = db.transaction([students, "teacher"]);
//获取students objectStore
var objectStore = transaction.objectStore("students");

//创建objectStore
db.createObjectStore(storeName, keyPath);

function saveData(dbName, version, storeName, data) {
  var idbRequest = indexedDB.open(dbName, version);

  idbRequest.onsuccess = function (e) {
    var db = idbRequest.result;
    var transaction = db.transaction(storeName, "readwrite"); //需先创建事务
    var store = transaction.objectStore(storeName); //访问事务中的objectStore
    data.forEach(function (item) {
      store.add(item); //保存数据
    });
    console.log("save data done..");
  };
}

// 查找数据
function getDataByKey(db, storeName, key) {
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  var dataRequest = store.get(key);
  dataRequest.onsuccess = function (e) {
    //异步的
    var student = e.target.result;
    console.log(student.name);
  };
}
// 更新数据
// 可以调用objectStore的put方法更新数据，会自动替换键值相同的记录，达到更新目的，没有相同的则添加。

function updateDataByKey(db, storeName, student) {
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  store.put(student);
}
// 删除数据
function deleteDataByKey(db, storeName, key) {
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  store.delete(key);
}
// 清空数据
function clearObjectStore(db, storeName) {
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  store.clear();
}
```

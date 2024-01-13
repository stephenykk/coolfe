# SQL 基础查询语句

> 原文地址[SQL 基础查询语句 - 掘金](https://juejin.cn/post/7028069649933664286)

这是我参与 11 月更文挑战的第 8 天，活动详情查看：[2021 最后一次更文挑战](https://juejin.cn/post/7023643374569816095/ "https://juejin.cn/post/7023643374569816095/")。

SQL 语句中，查询是使用最多的操作，SQL 不仅能够查询表中的数据，还可以返回算术运算、表达式的结果等，接下来就一起了解一下基本的查询语句。

## 基础 SELECT 语句

### 查询指定字段

**语法格式：**

```sql
SELECT <字段名>,... FROM <表名>;
```

在语句中可以指定多个字段，结果会根据指定的字段进行显示。

例如，在 users 用户表中查询用户 id、用户名、昵称、性别信息：

```sql
SELECT user_id,user_name,nick_name,sex FROM users;
```

### 查询全部字段

查看表中的全部字段可以使用星号"\*"表示，例如，以下语句查询 users 用户表中的所有数据：

```sql
SELECT * FROM users;
```

"\*"代表所有字段，数据库在解析该语句时，会使用表中的字段名进行扩展，根据实际情况将"\*"换成 user_id、user_name、nick_name、sex、mobile、email 等表的字段。

---

### 设定别名

使用**AS**关键字可以为列设定别名。

```sql
SELECT user_id AS id,user_name AS 用户名称,nick_name AS 昵称,sex AS 性别 FROM users;
```

---

### 常数的查询

SELECT 语句中不仅可以书写列名，而且还可以书写常数，如下：

```sql
SELECT 100;
SELECT '用户';
```

### 表达式的查询

```sql
SELECT 98%100;
```

### 去重

SELECT 语句中可以使用**DISTINCT**关键字去除查询结果中的重复记录，例如，去除`user_name`重复的数据：

```sql
SELECT DISTINCT user_name FROM users;
```

**注意：** `DISTINCT`对`NULL`是不进行过滤的，即返回的结果中是包含`NULL`值的；

当`DISTINCT`应用到多列的时候，应用范围是其**后面跟的所有字段**，而且`DISTINCT`只能放到所有字段的前面，也就是第一个列名之前。

```sql
SELECT DISTINCT user_name,nick_name FROM users;
```

### 条件查询

SELECT 语句通过**WHERE**子句来查询符合指定条件的记录，`WHERE`子句要紧跟在`FROM`子句之后。

```sql
SELECT <字段名>,... FROM <表名> WHERE <条件表达式>;
```

#### 单条件查询

-   查询性别为男性的用户：

```sql
SELECT * FROM users WHERE sex='男';
```

-   查询年龄小于等于 24 的用户：

```sql
SELECT * FROM users WHERE age<=24;
```

-   查询用户 id 不是 3 的用户：

```sql
SELECT * FROM users WHERE NOT user_id=3;
```

在第 3 个例子中使用了`NOT`运算符，在条件前加`NOT`就代表否定这个条件，查找这个条件以外的记录。

#### 多条件查询

-   查询年龄小于等于 24**或者**性别为男性的用户：

```sql
SELECT * FROM users WHERE age<=24 OR sex='男';
```

-   查询年龄小于等于 24**并且**性别为男性的用户：

```sql
SELECT * FROM users WHERE age<=24 AND sex='男';
```

上面使用了多条件查询，条件能同时成立`AND`运算符，条件只能成立一个用`OR`运算符。

#### 指定范围查询

-   查询用户 id 在(2,3,7,8)范围内的用户：

```sql
SELECT * FROM users WHERE user_id IN (2,3,7,8);
```

`IN`在 WHERE 子句中规定多个值，`IN`后跟圆括号，括弧内可以有一个或多个值，值之间由逗点分开，值可以是数字或者字符。

-   查询用户 id 在 10-15 之间的用户：

```sql
SELECT * FROM users WHERE user_id BETWEEN 10 AND 15;
```

`BETWEEN ... AND`指定介于两个值之间的数据范围，这些值可以是数值、文本或者日期。

#### 模糊查询

`LIKE`关键字用于 SQL 的模糊查询，用于对搜索字符串进行模式匹配。

**语法格式：**

```sql
字段名 LIKE pattern
```

匹配模式：

-   `%`：百分号匹配零个、一个或多个字符
-   `-`：下划线符号匹配单个字符

| 模式       | 含义                                             |
| ---------- | ------------------------------------------------ |
| LIKE 'a%'  | 匹配以`A`开始的字符串，如 abc、ab                |
| LIKE '%y'  | 匹配以`y`结尾的字符串，如 aay、xy                |
| LIKE '%mn% | 匹配包含`mn`的字符串，如 amnb、lmn               |
| LIKE 'a\_' | 匹配以`a`开始，后面只有一个字符的数据，如 ay、ab |
| LIKE '\_y' | 匹配以`y`结尾，前面只有一个字符的数据，如 ay，xy |

例如：

查找用户昵称包含`tigeriaf`的数据:

```sql
SELECT * FROM users WHERE nick_name LIKE '%tigeriaf%';
```

**原创不易，如果小伙伴们觉得有帮助，麻烦点个赞再走呗~**

**最后，感谢女朋友在工作和生活中的包容、理解与支持 ！** ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84505e3c967e43bfb7900f08e9ff110d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

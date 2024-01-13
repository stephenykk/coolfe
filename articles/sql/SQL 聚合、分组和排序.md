# SQL 聚合、分组和排序

> 原文地址[SQL 聚合、分组和排序 - 掘金](https://juejin.cn/post/7028381751374249991)

这是我参与 11 月更文挑战的第 9 天，活动详情查看：[2021 最后一次更文挑战](https://juejin.cn/post/7023643374569816095/ "https://juejin.cn/post/7023643374569816095/")。

## 聚合查询

在访问数据库时，经常要对表中的某列数据进行统计汇总，如求和、最大值、最小值、平均值等，这时就需要使用聚合函数，所谓聚合函数，就是用于汇总的函数，聚合就是将多行汇总为一行，常见的聚合函数如下：

### COUNT 函数

`count`函数用于统计表中记录行数。

例如，计算全部数据的行数：

```sql
SELECT COUNT(*) FROM users;
```

**注意：** COUNT(\*)会得到包含空值`NULL`的数据行数，若想排除包含`NULL`的数据行，可以使用`count(字段名)`，会得到`NULL`之外的数据行数。

```sql
SELECT COUNT(user_name) FROM users;
```

### SUM 函数

用于计算任意列中数据的和。 例如，计算所有用户的年龄之和。

```sql
SELECT sum(age) FROM users;
```

### AVG 函数

用于计算任意列中数据的平均值。

例如，计算所有用户的年龄平均值。

```sql
SELECT AVG(age) FROM users;
```

---

### MAX 函数和 MIN 函数

`MAX`函数用于计算任意列中数据的最大值，`MIN`函数用于计算任意列中数据的最小值。

例如，计算所有用户中的年龄的最大值和最小值。

```sql
SELECT MAX(age),MIN(age) FROM users;
```

**注意：** `MAX`函数和`MIN`函数几乎适用于所有数据类型的列，`SUM`函数和`AVG`函数只适用于数值类型的列。

## 分组查询

聚合函数是对表中所有数据进行统计汇总，还可以使用`GROUP BY`子句先把数据分成若干组，再进行统计汇总。  
**语法格式：**

```sql
SELECT <字段名>,... FROM <表名> GROUP BY <字段名>,...;
```

例如，按照用户所在城市进行分组统计每个城市用户的和：

```sql
SELECT city,count(*) FROM users GROUP BY city;
+-------+----------+
| city  | count(*) |
+-------+----------+
| 北京  |       60 |
| 上海  |       45 |
| NULL  |       80 |
| 济南  |       12 |
+-------+----------+
```

通过结果可以看出，字段为 NULL 的也会被列为一个分组。如果想要排除在外，可以使用`WHERE`子句。

```sql
SELECT city,count(*) FROM users WHERE city IS NOT NULL GROUP BY city;
```

## 对聚合结果进行过滤

当我们使用`GROUP BY`子句分组的时候，有时候就需要对分组的聚合结果进行过滤，我们可能首先会想到使用`WHERE`子句，其实并不是，而是用`HAVING`子句，`HAVING`的作用和`WHERE`一样，都是起到过滤的作用，只不过`WHERE`是用于数据行的过滤，而`HAVING`则用于分组聚合结果的过滤。

例如，按照用户的所在城市进行分组，并且筛选分组中用户数量大于 40 的组。

```sql
SELECT city,COUNT(*) AS num FROM users GROUP BY city HAVING num>40;
```

再比如，按照用户的所在城市进行分组，并且筛选分组中用户平均年龄小于 25 的组。

```sql
SELECT city,AVG(age) AS avg_age FROM users GROUP BY city HAVING avg_age<25;
```

### HAVING 子句的构成要素

`HAVING`子句中能够使用的 3 种要素：

-   常数
-   聚合函数
-   `GROUP BY`子句中指定的列名（即聚合键）

## 对查询结果进行排序

SQL 查询中可以用到排序，对数据进行升序(`ASC`)或降序排列(`DESC`)，默认是升序。

**语法格式：**

```sql
SELECT <字段名>,... FROM <表名> ORDER BY <字段名> ASC/DESC,...;
```

例如，对 users 表中的记录按照年龄升序排列：

```sql
SELECT * FROM users ORDER BY age ASC;
```

**注意：** 升序`ASC`可以省去不写，但是降序`DESC`必须要写。

例如，对 users 表中的记录按照年龄降序排列：

```sql
SELECT * FROM users ORDER BY age DESC;
```

### 指定多个排序键

`ORDER BY`子句中可以指定多个排序键，例如，对 users 表中的记录按照年龄降序、注册时间升序排列：

```sql
SELECT * FROM student ORDER BY age DESC,register_time ASC;
```

多个字段排序时中间用“,”隔开。

### 使用聚合函数排序

`ORDER BY`子句中还可以使用聚合函数的结果进行排序。

例如，按照用户的所在城市进行分组，并且按照分组的用户数量进行排序：

```sql
SELECT city,COUNT(*) AS num FROM users GROUP BY city ORDER BY num;
```

**原创不易，如果小伙伴们觉得有帮助，麻烦点个赞再走呗~**

**最后，感谢女朋友在工作和生活中的包容、理解与支持 ！** ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84505e3c967e43bfb7900f08e9ff110d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

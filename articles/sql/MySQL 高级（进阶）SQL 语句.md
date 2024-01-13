# MySQL 高级（进阶）SQL 语句

> 原文地址[MySQL 高级（进阶）SQL 语句 - 掘金](https://juejin.cn/post/7291952951047929868?searchId=2024011310571618AD0BAFA6AADC97E3A3)

# 1\. MySQL SQL 语句

## 1.1 常用查询

常用查询简单来说就是 增、删、改、查

对 MySQL 数据库的查询，除了基本的查询外，有时候需要对查询的结果集进行处理。 例如只取 10 条数据、对查询结果进行排序或分组等等

1、按关键字排序 PS:类比于 windows 任务管理器 使用 SELECT 语句可以将需要的数据从 MySQL 数据库中查询出来，如果对查询的结果进行排序，可以使用 ORDER BY 语句来对语句实现排序，并最终将排序后的结果返回给用户。这个语句的排序不光可以针对某一个字段，也可以针对多个字段

（1）语法 `SELECT column1, column2, … FROM table_name ORDER BY column1, column2, …`

`ASC`|`DESC` ASC 是按照升序进行排序的，是默认的排序方式，即 ASC 可以省略。SELECT 语句中如果没有指定具体的排序方式，则默认按 ASC 方式进行排序。

DESC 是按降序方式进 行排列。当然 ORDER BY 前面也可以使用 WHERE 子句对查询结果进一步过滤。

准备工作：

```mysql
create database k1;
use k1;
create table location (Region char(20),Store_Name char(20));
insert into location values('East','Boston');
insert into location values('East','New York');
insert into location values('West','Los Angeles');
insert into location values('West','Houston');
```

```mysql
create table store_info (Store_Name char(20),Sales int(10),Date char(10));
insert into store_info values('Los Angeles','1500','2020-12-05');
insert into store_info values('Houston','250','2020-12-07');
insert into store_info values('Los Angeles','300','2020-12-08');
insert into store_info values('Boston','700','2020-12-08');
```

## 1.2 SELECT

**显示表格中一个或数个字段的所有数据记录** **语法：SELECT "字段" FROM "表名";**

```mysql
SELECT Store_Name FROM location;
```

![d1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2db0d1dd3e4644bd8033bc459900a9bd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1025&h=541&s=93961&e=png&b=000000)

```mysql
SELECT Store_Name FROM Store_Info;
```

![d2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/331065f810b040e7b934353208ecf06b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=922&h=492&s=106545&e=png&b=000000)

## 1.3 DISTINCT

**不显示重复的数据记录**

**语法：`SELECT DISTINCT "字段" FROM "表名";`**

```mysql
SELECT DISTINCT Store_Name FROM Store_Info;
```

![d3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d730025f63346deafd5b99bbc677636~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=752&h=525&s=88077&e=png&b=000000)

## 1.4 AND OR

**且 或**

**语法：`SELECT "字段" FROM "表名" WHERE "条件1" {[AND|OR] "条件2"}+ ;`**

![d4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/926e6da8b40c4ec2a6d0adce56e00e47~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1044&h=249&s=33625&e=png&b=000000)

## 1.5 in

**显示已知的值的数据记录**

**语法：`SELECT "字段" FROM "表名" WHERE "字段" IN ('值1', '值2', ...);`**

```mysql
SELECT * FROM store_info WHERE Store_Name IN ('Los Angeles', 'Houston');
```

![b5.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6cc15794953455ca7597e867e34b66c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=818&h=287&s=67084&e=png&b=000000)

## 1.6 BETWEEN

**显示两个值范围内的数据记录**

**语法：`SELECT "字段" FROM "表名" WHERE "字段" BETWEEN '值1' AND '值2';`**

![d6.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b355d611be140258f665d53231da6b9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=890&h=242&s=46981&e=png&b=000000)

## 2\. 通配符 —— 通常与 LIKE 搭配 一起使用

> % ：百分号表示零个、一个或多个字符
>
> \_ ：下划线表示单个字符
>
> 'A_Z'：所有以 'A' 起头，另一个任何值的字符，且以 'Z' 为结尾的字符串。例如，'ABZ' 和 'A2Z' 都符合这一个模式，而 'AKKZ' 并不符合 (因为在 A 和 Z 之间有两个字符，而不是一个字符)。
>
> 'ABC%': 所有以 'ABC' 起头的字符串。例如，'ABCD' 和 'ABCABC' 都符合这个模式。 '%XYZ': 所有以 'XYZ' 结尾的字符串。例如，'WXYZ' 和 'ZZXYZ' 都符合这个模式。
>
> '%AN%': 所有含有 'AN'这个模式的字符串。例如，'LOS ANGELES' 和 'SAN FRANCISCO' 都符合这个模式。
>
> '\_AN%'：所有第二个字母为 'A' 和第三个字母为 'N' 的字符串。例如，'SAN FRANCISCO' 符合这个模式，而 'LOS ANGELES' 则不符合这个模式。

### 2.1 LIKE

**匹配一个模式来找出我们要的数据记录**

**语法：`SELECT "字段" FROM "表名" WHERE "字段" LIKE {模式};`**

```mysql
SELECT * FROM store_info WHERE Store_Name like '%os%';
```

![d7.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d259a07794bc41138429bd5041d356bd~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=778&h=267&s=42788&e=png&b=000000)

### 2.2 ORDER BY

**按关键字排序**

**语法：`SELECT "字段" FROM "表名" [WHERE "条件"] ORDER BY "字段" [ASC, DESC];`**

**注意**：`ASC` 是按照**升序**进行排序的，是**默认的**排序方式。 `DESC` 是按**降序**方式进行排序

```mysql
SELECT Store_Name,Sales,Date FROM store_info ORDER BY Sales DESC;
```

![d8.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d86c0dd32e084e6eb1f56c4dcdebb331~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=871&h=287&s=60299&e=png&b=000000)

## 3\. 函数

### 3.1 数学函数

| abs(x)             | 返回 x 的绝对值                                  |
| ------------------ | ------------------------------------------------ |
| rand()             | 返回 0 到 1 的随机数                             |
| mod(x,y)           | 返回 x 除以 y 以后的余数                         |
| power(x,y)         | 返回 x 的 y 次方                                 |
| round(x)           | 返回离 x 最近的整数                              |
| round(x,y)         | 保留 x 的 y 位小数四舍五入后的值                 |
| sqrt(x)            | 返回 x 的平方根                                  |
| truncate(x,y)      | 返回数字 x 截断为 y 位小数的值                   |
| ceil(x)            | 返回大于或等于 x 的最小整数                      |
| floor(x)           | 返回小于或等于 x 的最大整数                      |
| greatest(x1,x2...) | 返回集合中最大的值，也可以返回多个字段的最大的值 |
| least(x1,x2...)    | 返回集合中最小的值，也可以返回多个字段的最小的值 |

```mysql
SELECT abs(-1), rand(), mod(5,3), power(2,3), round(1.89);
SELECT round(1.8937,3), truncate(1.235,2), ceil(5.2), floor(2.1), least(1.89,3,6.1,2.1);
```

![d9.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcbd468974a0423f87deff943be7406a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1128&h=389&s=100049&e=png&b=000000)

### 3.2 聚合函数

| avg()   | 返回指定列的平均值           |
| ------- | ---------------------------- |
| count() | 返回指定列中非 NULL 值的个数 |
| min()   | 返回指定列的最小值           |
| max()   | 返回指定列的最大值           |
| sum(x)  | 返回指定列的所有值之和       |

```mysql
SELECT avg(Sales) FROM store_info;

SELECT count(Store_Name) FROM store_info;
SELECT count(DISTINCT Store_Name) FROM store_info;

SELECT max(Sales) FROM store_info;
SELECT min(Sales) FROM store_info;

SELECT sum(Sales) FROM store_info;
```

![d10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5e89aa1ef0c491cb032ddc9f994671f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=586&h=545&s=58664&e=png&b=000000)

![d11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/002c21f1bd134f6ebf3be19cfd66aa1f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=517&h=640&s=72428&e=png&b=000000)

### 3.3 字符串函数

| trim()         | 返回去除指定格式的值                                                   |
| -------------- | ---------------------------------------------------------------------- |
| concat(x,y)    | 将提供的参数 x 和 y 拼接成一个字符串                                   |
| substr(x,y)    | 获取从字符串 x 中的第 y 个位置开始的字符串，跟 substring()函数作用相同 |
| substr(x,y,z)  | 获取从字符串 x 中的第 y 个位置开始长度为 z 的字符串                    |
| length(x)      | 返回字符串 x 的长度                                                    |
| replace(x,y,z) | 将字符串 z 替代字符串 x 中的字符串 y                                   |
| upper(x)       | 将字符串 x 的所有字母变成大写字母                                      |
| lower(x)       | 将字符串 x 的所有字母变成小写字母                                      |
| left(x,y)      | 返回字符串 x 的前 y 个字符                                             |
| right(x,y)     | 返回字符串 x 的后 y 个字符                                             |
| repeat(x,y)    | 将字符串 x 重复 y 次                                                   |
| space(x)       | 返回 x 个空格                                                          |
| strcmp(x,y)    | 比较 x 和 y，返回的值可以为-1,0,1                                      |
| reverse(x)     | 将字符串 x 反转                                                        |

![d12.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1257abbd5fb8480ab816969ff54e7087~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1050&h=245&s=42961&e=png&b=000000)

**如 sql_mode 开启了 PIPES_AS_CONCAT，"||" 视为字符串的连接操作符而非或运算符，和字符串的拼接函数 Concat 相类似，这和 Oracle 数据库使用方法一样的**

```mysql
SELECT Region || ' ' || Store_Name FROM location WHERE Store_Name = 'Boston';
SELECT substr(Store_Name,3) FROM location WHERE Store_Name = 'Los Angeles';
SELECT substr(Store_Name,2,4) FROM location WHERE Store_Name = 'New York'
```

![d13.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d79649470b47d0a83f8a2027639eac~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1012&h=524&s=82749&e=png&b=000000)

**`SELECT TRIM ([ [位置] [要移除的字符串] FROM ] 字符串);`**

\*\*\[位置\]：的值可以为 LEADING (起头), TRAILING (结尾), BOTH (起头及结尾)。 \*\*

**\[要移除的字符串\]：从字串的起头、结尾，或起头及结尾移除的字符串。缺省时为空格。**

```mysql
SELECT TRIM(LEADING 'Ne' FROM 'New York');

SELECT Region,length(Store_Name) FROM location;

SELECT REPLACE(Region,'ast','astern')FROM location;
```

![d14.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ced6769d5bc44db87f1a28e0f7eae45~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=919&h=513&s=58558&e=png&b=000000)

## 4\. GROUP BY

**对 GROUP BY 后面的字段的查询结果进行汇总分组，通常是结合聚合函数一起使用的**

**GROUP BY 有一个原则**

-   **凡是在 GROUP BY 后面出现的字段，必须在 SELECT 后面出现；**
-   **凡是在 SELECT 后面出现的、且未在聚合函数中出现的字段，必须出现在 GROUP BY 后面**

**语法：`SELECT "字段1", SUM("字段2") FROM "表名" GROUP BY "字段1";`**

```mysql
SELECT Store_Name, SUM(Sales) FROM store_info GROUP BY Store_Name ORDER BY sales desc;
```

![d15.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15a81cc3337f4ec9b4b5abc5c3f829f3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1085&h=263&s=48257&e=png&b=000000)

## 5\. 别名

**字段別名 表格別名**

**语法：`SELECT "表格別名"."字段1" [AS] "字段別名" FROM "表格名" [AS] "表格別名";`**

```mysql
SELECT A.Store_Name Store, SUM(A.Sales) "Total Sales" FROM store_info A GROUP BY A.Store_Name;
```

![d16.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fb04c74429f43d4ab3e81fdfff6b6c1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1123&h=250&s=45032&e=png&b=000000)

## 6\. 子查询

子查询也被称作内查询或者嵌套查询，是指在一个查询语句里面还嵌套着另一个查询语 句。子查询语句是先于主查询语句被执行的，其结果作为外层的条件返回给主查询进行下一 步的查询过滤

**连接表格，在 WHERE 子句或 HAVING 子句中插入另一个 SQL 语句**

**语法：`SELECT "字段1" FROM "表格1" WHERE "字段2" [比较运算符] #外查询 (SELECT "字段1" FROM "表格2" WHERE "条件"); #内查询`**

`[比较运算符]`

可以是符号的运算符，例如 =、>、<、>=、<= ；也可以是文字的运算符，例如 LIKE、IN、BETWEEN

```mysql
SELECT SUM(Sales) FROM store_info WHERE Store_Name IN
(SELECT Store_Name FROM location WHERE Region = 'West');

SELECT SUM(A.Sales) FROM store_info A WHERE A.Store_Name IN
(SELECT Store_Name FROM location B WHERE B.Store_Name = A.Store_Name);
```

![d17.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bb39f394239489588ea8a92348e5df3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=722&h=371&s=52501&e=png&b=000000)

## 7\. EXISTS

**用来测试内查询有没有产生任何结果，类似布尔值是否为真** **#如果有的话，系统就会执行外查询中的 SQL 语句。若是没有的话，那整个 SQL 语句就不会产生任何结果。**

**语法：`SELECT "字段1" FROM "表格1" WHERE EXISTS (SELECT \* FROM "表格2" WHERE "条件");`**

```mysql
SELECT SUM(Sales) FROM store_info WHERE EXISTS (SELECT * FROM location WHERE Region = 'West');
```

![d18.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67ab5732e1da42b48986f6c272f2488d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1046&h=226&s=32242&e=png&b=000000)

## 8\. 连接查询

准备工作

```mysql
create database k1;
use k1;
create table location (Region char(20),Store_Name char(20));
insert into location values('East','Boston');
insert into location values('East','New York');
insert into location values('West','Los Angeles');
insert into location values('West','Houston');
```

```mysql
create table store_info (Store_Name char(20),Sales int(10),Date char(10));
insert into store_info values('Los Angeles','1500','2020-12-05');
insert into store_info values('Houston','250','2020-12-07');
insert into store_info values('Los Angeles','300','2020-12-08');
insert into store_info values('Boston','700','2020-12-08');
```

![f1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e5609253fe3416786ed5325105ac649~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=997&h=755&s=143363&e=png&b=000000)

```mysql
UPDATE store_info SET store_name='Washington' WHERE sales=300;
```

![f2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3727c944b7684b2f871c851846c19e44~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=762&h=375&s=70433&e=png&b=000000)

**inner join(内连接)：只返回两个表中联结字段相等的行**

**left join(左连接)：返回包括左表中的所有记录和右表中联结字段相等的记录**

**right join(右连接)：返回包括右表中的所有记录和左表中联结字段相等的记录**

![f3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9906d97ee6d49ffa900f8b130eb3ec5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1253&h=889&s=637487&e=png&b=fdfdfd)

### 8.1 内连接

MySQL 中的内连接就是两张或多张表中同时符合某种条件的数据记录的组合。通常在 FROM 子句中使用[关键字](https://so.csdn.net/so/search?q=%E5%85%B3%E9%94%AE%E5%AD%97&spm=1001.2101.3001.7020 "https://so.csdn.net/so/search?q=%E5%85%B3%E9%94%AE%E5%AD%97&spm=1001.2101.3001.7020") INNER JOIN 来连接多张表，并使用 ON 子句设置连接条件，内连接是系统默认的表连接，所以在 FROM 子句后可以省略 INNER 关键字，只使用 关键字 JOIN。同时有多个表时，也可以连续使用 INNER JOIN 来实现多表的内连接，不过为了更好的性能，建议最好不要超过三个表

(1) 语法 求交集

```mysql
SELECT column_name(s)FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;
```

```mysql
SELECT * FROM location A INNER JOIN store_info B on A.Store_Name = B.Store_Name ;
```

![f4.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b7edcd7336b43c1a1a1fc733c89f8c7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=995&h=238&s=62152&e=png&b=000000)

**内连查询：通过 inner join 的方式将两张表指定的相同字段的记录行输出出来**

### 8.2 左连接

左连接也可以被称为左外连接，在 FROM 子句中使用 LEFT JOIN 或者 LEFT OUTER JOIN 关键字来表示。左连接以左侧表为基础表，接收左表的所有行，并用这些行与右侧参 考表中的记录进行匹配，也就是说匹配左表中的所有行以及右表中符合条件的行。

```mysql
SELECT * FROM location A LEFT JOIN store_info B on A.Store_Name = B.Store_Name ;
```

![f5.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18287834da5d4e55878285af7ded9e43~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=962&h=275&s=64337&e=png&b=000000)

**左连接中左表的记录将会全部表示出来，而右表只会显示符合搜索条件的记录，右表记录不足的地方均为 NULL**

### 8.3 右连接

右连接也被称为右外连接，在 FROM 子句中使用 RIGHT JOIN 或者 RIGHT OUTER JOIN 关键字来表示。右连接跟左连接正好相反，它是以右表为基础表，用于接收右表中的所有行，并用这些记录与左表中的行进行匹配

```mysql
SELECT * FROM location A RIGHT JOIN store_info B on A.Store_Name = B.Store_Name ;
```

![f6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f27393508d2c4b7dbc758d1efc2818a1~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1040&h=238&s=59853&e=png&b=000000)

## 9\. UNION ----联集

**将两个 SQL 语句的结果合并起来，两个 SQL 语句所产生的字段需要是同样的数据记录种类**

**UNION ：生成结果的数据记录值将没有重复，且按照字段的顺序进行排序**

**语法：\[SELECT 语句 1\] UNION \[SELECT 语句 2\];**

```mysql
SELECT Store_Name FROM location UNION SELECT Store_Name FROM store_info;
```

![f7.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e01814bb9d0e48c19fd96bbb871a3bce~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=938&h=263&s=37382&e=png&b=000000)

**UNION ALL ：将生成结果的数据记录值都列出来，无论有无重复**

**语法：`[SELECT 语句 1] UNION ALL [SELECT 语句 2];`**

```mysql
SELECT Store_Name FROM location UNION ALL SELECT Store_Name FROM store_info;
```

![f8.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2a0f0f542ae46cf83b8fcc0f61ec7c2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=889&h=494&s=54684&e=png&b=000000)

### 9.1 交集值

**取两个 SQL 语句结果的交集**

```mysql
SELECT A.Store_Name FROM location A INNER JOIN store_info B ON A.Store_Name = B.Store_Name;

SELECT A.Store_Name FROM location A INNER JOIN store_info B USING(Store_Name);
```

![f9.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e92484387fbe42d2b1d233e2aac8789d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=916&h=393&s=49904&e=png&b=000000)

**取两个 SQL 语句结果的交集，且没有重复**

```mysql
SELECT DISTINCT A.Store_Name FROM location A INNER JOIN store_info B USING(Store_Name);

SELECT DISTINCT Store_Name FROM location WHERE (Store_Name) IN (SELECT Store_Name FROM store_info);

SELECT DISTINCT A.Store_Name FROM location A LEFT JOIN store_info B USING(Store_Name) WHERE B.Store_Name IS NOT NULL;

SELECT A.Store_Name FROM (SELECT B.Store_Name FROM location B INNER JOIN store_info C ON B.Store_Name = C.Store_Name) A
GROUP BY A.Store_Name;

SELECT A.Store_Name FROM
(SELECT DISTINCT Store_Name FROM location UNION ALL SELECT DISTINCT Store_Name FROM store_info) A
GROUP BY A.Store_Name HAVING COUNT(*) > 1;
```

![f10.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e33284077b941e596ca61ae0e66870d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1074&h=542&s=79067&e=png&b=000000)

![f11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0616d02dc334794ae1aebfbb12c48d0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1101&h=446&s=65908&e=png&b=000000)

### 9.2 无交集值

**显示第一个 SQL 语句的结果，且与第二个 SQL 语句没有交集的结果，且没有重复**

```mysql
SELECT DISTINCT Store_Name FROM location WHERE (Store_Name) NOT IN (SELECT Store_Name FROM store_info);

SELECT DISTINCT A.Store_Name FROM location A LEFT JOIN store_info B USING(Store_Name) WHERE B.Store_Name IS NULL;

SELECT A.Store_Name FROM
(SELECT DISTINCT Store_Name FROM location UNION ALL SELECT DISTINCT Store_Name FROM store_info) A
GROUP BY A.Store_Name HAVING COUNT(*) = 1;
```

![f12.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ee0f590f7434fd6948dd8eae1250b1e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1071&h=521&s=81845&e=png&b=000000)

## 10\. case

是 SQL 用来做为 IF-THEN-ELSE 之类逻辑的关键字

语法：

```mysql
SELECT CASE ("字段名")
  WHEN "条件1" THEN "结果1"
  WHEN "条件2" THEN "结果2"
  ...
  [ELSE "结果N"]
  END
FROM "表名";
```

"条件" 可以是一个数值或是公式。 ELSE 子句则并不是必须的。

```mysql
SELECT Store_Name, CASE Store_Name
  WHEN 'Los Angeles' THEN Sales * 2
  WHEN 'Boston' THEN 2000
  ELSE Sales
  END
"New Sales",Date
FROM store_info;

#"New Sales" 是用于 CASE 那个字段的字段名。
```

![f13.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30689bb8636e4db497fdc1a6c799d078~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=858&h=481&s=94659&e=png&b=000000)

## 11\. 正则表达式

| 匹配模式 | 描述                                 | 实例                                           |
| -------- | ------------------------------------ | ---------------------------------------------- | --- | ------------------- |
| ^        | 匹配文本的结束字符                   | ‘^bd’ 匹配以 bd 开头的字符串                   |
| $        | 匹配文本的结束字符                   | ‘qn$’ 匹配以 qn 结尾的字符串                   |
| .        | 匹配任何单个字符                     | ‘s.t’ 匹配任何 s 和 t 之间有一个字符的字符串   |
| \*       | 匹配零个或多个在它前面的字符         | ‘fo\*t’ 匹配 t 前面有任意个 o                  |
| +        | 匹配前面的字符 1 次或多次            | ‘hom+’ 匹配以 ho 开头，后面至少一个 m 的字符串 |
| 字符串   | 匹配包含指定的字符串                 | ‘clo’ 匹配含有 clo 的字符串                    |
| p1       | p2                                   | 匹配 p1 或 p2                                  | ‘bg | fg’ 匹配 bg 或者 fg |
| \[...\]  | 匹配字符集合中的任意一个字符         | ‘\[abc\]’ 匹配 a 或者 b 或者 c                 |
| \[^...\] | 匹配不在括号中的任何字符             | ‘\[^ab\]’ 匹配不包含 a 或者 b 的字符串         |
| {n}      | 匹配前面的字符串 n 次                | ‘g{2}’ 匹配含有 2 个 g 的字符串                |
| {n,m}    | 匹配前面的字符串至少 n 次，至多 m 次 | ‘f{1,3}’ 匹配 f 最少 1 次，最多 3 次           |

**语法：SELECT "字段" FROM "表名" WHERE "字段" REGEXP {模式};**

```mysql
SELECT * FROM store_info WHERE Store_Name REGEXP 'os';
SELECT * FROM store_info WHERE Store_Name REGEXP '^[A-G]';
SELECT * FROM store_info WHERE Store_Name REGEXP 'Ho|Bo';
```

![f14.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6daed6d73204a1ba92121e28f29416d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=834&h=536&s=81712&e=png&b=000000)

## 12\. 存储过程

存储过程是一组为了完成特定功能的 SQL 语句集合。

存储过程在使用过程中是将常用或者复杂的工作预先使用 SQL 语句写好并用一个指定的名称存储起来，这个过程经编译和优化后存储在数据库服务器中。当需要使用该存储过程时，只需要调用它即可。存储过程在执行上比传统 SQL 速度更快、执行效率更高。

**存储过程的优点**：

1、执行一次后，会将生成的二进制代码驻留缓冲区，提高执行效率

2、SQL 语句加上控制语句的集合，灵活性高

3、在服务器端存储，客户端调用时，降低网络负载

4、可多次重复被调用，可随时修改，不影响客户端调用

5、可完成所有的数据库操作，也可控制数据库的信息访问权限

### 12.1 创建存储过程

```mysql
DELIMITER $$							#将语句的结束符号从分号;临时改为两个$$(可以是自定义)
CREATE PROCEDURE Proc()					#创建存储过程，过程名为Proc，不带参数
-> BEGIN								#过程体以关键字 BEGIN 开始
-> select * from Store_Info;			#过程体语句
-> END $$								#过程体以关键字 END 结束
DELIMITER ;								#将语句的结束符号恢复为分号
```

**实例**

```mysql
DELIMITER $$							#将语句的结束符号从分号;临时改为两个$$(可以自定义)
CREATE PROCEDURE Proc5()				#创建存储过程，过程名为Proc5，不带参数
-> BEGIN								#过程体以关键字 BEGIN 开始
-> create table user (id int (10), name char(10),score int (10));
-> insert into user values (1, 'cyw',70);
-> select * from cyw;			        #过程体语句
-> END $$								#过程体以关键字 END 结束
DELIMITER ;								#将语句的结束符号恢复为分号
```

![f15.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e747500364334921b29532af7be9531d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=898&h=273&s=47327&e=png&b=000000)

### 12.2 调用存储过程

```mysql
CALL Proc;
```

![f16.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c51f2c8610b7484893cb84f8a001338e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=884&h=343&s=44218&e=png&b=000000)

### 12.3 查看存储过程

**SHOW CREATE PROCEDURE \[数据库.\]存储过程名; #查看某个存储过程的具体信息**

```mysql
SHOW CREATE PROCEDURE Proc;

SHOW PROCEDURE STATUS [LIKE '%Proc%'] \G
```

![f17.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57e14cd8b7a44a5da9983e729ed9ee4a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1130&h=491&s=99736&e=png&b=000000)

### 12.4 存储过程的参数

\*\*IN 输入参数：\*\*表示调用者向过程传入值（传入值可以是字面量或变量）

\*\*OUT 输出参数：\*\*表示过程向调用者传出值(可以返回多个值)（传出值只能是变量）

\*\*INOUT 输入输出参数：\*\*既表示调用者向过程传入值，又表示过程向调用者传出值（值只能是变量）

```mysql
DELIMITER $$
CREATE PROCEDURE Proc6(IN inname CHAR(16))
-> BEGIN
-> SELECT * FROM store_info WHERE Store_Name = inname;
-> END $$
DELIMITER ;

CALL Proc6('Boston');
```

![f18.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c7323382e545b68d36dd6caca7a6d9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=915&h=437&s=54914&e=png&b=000000)

### 12.5 修改存储过程

```mysql
ALTER PROCEDURE <过程名>[<特征>... ]
ALTER PROCEDURE GetRole MODIFIES SQL DATA SQL SECURITY INVOKER;
MODIFIES sQLDATA:表明子程序包含写数据的语句
SECURITY:安全等级
invoker:当定义为INVOKER时，只要执行者有执行权限，就可以成功执行。
```

### 12.6 删除存储过程

存储过程内容的修改方法是通过删除原有存储过程，之后再以相同的名称创建新的存储过程。如果要修改存储过程的名称，可以先删除原存储过程，再以不同的命名创建新的存储过程。

```mysql
DROP PROCEDURE IF EXISTS Proc;
#仅当存在时删除，不添加 IF EXISTS 时，如果指定的过程不存在，则产生一个错误
```

![f19.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4d244861a72482aaedb437583764bce~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=235&s=43807&e=png&b=000000)

## 13\. 条件语句

**if-then-else ···· end if**

```mysql
mysql> delimiter $$
mysql>
mysql> CREATE PROCEDURE proc8(IN pro int)
    ->
    -> begin
    ->
    -> declare var int;
    -> set var=pro*2;
    -> if var>=10 then
    -> update t set id=id+1;
    -> else
    -> update t set id=id-1;
    -> end if;
    -> end $$

mysql> delimiter ;
```

![f20.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fead3cca2bf240d9ab40b3edc6f50969~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=934&h=423&s=71688&e=png&b=000000)

![f21.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5643f34b44e94d3796895589e873291c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=930&h=636&s=71120&e=png&b=000000)

## 14\. 循环语句

**while ···· end while**

```mysql
mysql> delimiter $$
mysql>
mysql> create procedure proc9()
    -> begin
    -> declare var int(10);
    -> set var=0;
    -> while var<6 do
    -> insert into t values(var);
    -> set var=var+1;
    -> end while;
    -> end $$

mysql> delimiter ;
```

![f22.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09bf835570d0495b91e2e90e7cfc49b8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=996&h=532&s=50757&e=png&b=000000)

## 15\. 视图表 create view

### 15.1 视图表概述

视图，可以被当作是虚拟表或存储查询。

视图跟表格的不同是，表格中有实际储存数据记录，而视图是建立在表格之上的一个架构，它本身并不实际储存数据记录。

临时表在用户退出或同数据库的连接断开后就自动消失了，而视图不会消失。 视图不含有数据，只存储它的定义，它的用途一般可以简化复杂的查询。

比如你要对几个表进行连接查询，而且还要进行统计排序等操作，写 sql 语句会很麻烦的，用视图将几个表联结起来，然后对这个视图进行查询操作，就和对一个表查询一样，很方便。

### 15.2 视图表能否修改？

首先我们需要知道，视图表保存的是 select 语句的定义，所以视图表可不可以修改需要视情况而定。

-   如果 select 语句查询的字段是没有被处理过的源表字段，则**可以**通过视图表修改源表数据；
-   如果 select 语句查询的字段是被 group by 语句或 函数 处理过的字段，则**不可以**直接修改视图表的数据。

```mysql
create view v_store_info as select store_name,sales from store_info;

update v_store_info set sales=1000 where store_name='Houston';
```

![f23.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/037f42f6a7a8467a839d6d88d1483856~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=707&s=194873&e=png&b=1c1c1c)

```mysql
create view v_sales as select store_name,sum(sales) from store_info group by store_name having sum(sales)>1000;

update v_sales set store_name='xxxx' where store_name='Los Angeles';
```

![f24.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2107e2a9a7745c6910e3ab6f471ad92~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=957&h=265&s=61994&e=png&b=1c1c1c)

![f25.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bb4949d0c424409bf07255cb8b4d687~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=963&h=127&s=55151&e=png&b=1c1c1c)

### 15.3 基本语法

#### 15.3.1 创建视图表

```mysql
语法
create view "视图表名" as "select 语句";
```

```mysql
create view v_region_sales as select a.region region,sum(b.sales) sales from location a
inner join store_info b on a.store_name = b.store_name group by region;
```

![f26.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2444a7711334a06b56f2ddaff16b34b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1051&h=471&s=86108&e=png&b=1c1c1c)

#### 15.4 查看视图表

```mysql
语法
select * from 视图表名;
```

```mysql
select * from v_region_sales;
```

![f27.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac655c2a283a426a80e9de66a5695426~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=824&h=324&s=59787&e=png&b=1c1c1c)

#### 15.5 删除视图表

```mysql
语法
drop view 视图表名;
```

```mysql
drop view v_region_sales;
```

![f28.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0f68b89f254717891fd56212579512~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=950&h=696&s=99100&e=png&b=1c1c1c)

#### 15.6 通过视图表求无交集值

将两个表中某个字段的不重复值进行合并

只出现一次（count =1 ） ，即无交集

通过

```mysql
create view 视图表名 as select distinct 字段 from 左表 union all select distinct 字段 from 右表;

select 字段 from 视图表名 group by 字段 having count(字段)=1;
```

```mysql
#先建立视图表
create viem v_union as select distinct store_name from location union all select distinct store_name from store_info;
```

![f29.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62ab552897194856aaad5c66716e41f4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1040&h=340&s=58202&e=png&b=1c1c1c)

```mysql
#再通过视图表求无交集
select store_name from v_union group by store_name having count(*)=1;
```

![f30.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45501292a60f4ec2b1dccf4d0151e223~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1017&h=235&s=63354&e=png&b=1c1c1c)

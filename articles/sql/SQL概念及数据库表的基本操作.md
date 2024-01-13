# SQL 概念及数据库表的基本操作

> 原文地址[SQL 概念及数据库表的基本操作 - 掘金](https://juejin.cn/post/7025782136103927839?searchId=20240113213147D815B2FA122EBCE4D555)

这是我参与 11 月更文挑战的第 2 天，活动详情查看：[2021 最后一次更文挑战](https://juejin.cn/post/7023643374569816095/ "https://juejin.cn/post/7023643374569816095/")。

介绍`SQL`之前，先来了解一下关于数据库的一些概念。

## 什么是数据库

-   数据库（Database，DB）：是一个有组织的、统一管理的数据集合。简单来说，就是用来存储数据的地方。
-   数据库管理系统（Database Management System，DBMS）：用来操纵和管理数据库的计算机软件，例如 MySQL、Oracle、SqlServer 等，都是数据库管理系统。

一个数据库系统中可以包含很多数据库，每个数据库中又包含很多表，表的一列称为一个字段，一行称为一条记录。 例如，下面是一个名为`persons`的表：

| id  | name  | age | gender | address  |
| :-: | :---: | :-: | :----: | :------: |
|  1  | Alice | 24  | female | Beijing  |
|  2  |  Bob  | 25  |  male  | Shanghai |
|  3  | Candy | 26  | female | Beijing  |

表包含三条记录（每一条对应一个人）和五个列（id、姓名、年龄、性别和地址）。

掌握这些基础概念后，再来看下`SQL`。

## SQL 概要

### 什么是 SQL

`SQL`全称 Structured Query Language，表示结构化查询语言，是一种专门与数据库交互的语言，规定了各种关键字、语法等。

### SQL 语句及其种类

使用关键字、表名和列名等以一定语法规则组合而成的语句称之为`SQL`语句，`SQL`语句可以对数据库赋予不同指令，根据指令的种类，SQL 语句可以分为以下三类：

-   DDL（Data Definition Language，数据定义语言）：用来创建、删除或修改数据库以及数据库中的表等对象。

    -   create：创建数据库和表等对象
    -   drop：删除数据库和表等对象
    -   alter：修改数据库和表等对象的结构

-   DML（Data Manipulation Language，数据操纵语言）：用来查询或修改表中的记录。

    -   select：查询表中的数据
    -   insert：向表中插入数据
    -   update：更新表中的数据
    -   delete：删除表中的数据

-   DCL（Data Control Language，数据控制语言）：用来确认或取消对数据库中的数据变更的执行操作，以及对用户操作数据库中的对象的权限进行设定。

    -   commit：提交，即确认对数据库中的数据进行的变更
    -   rollback：回滚，即取消对数据库中的数据进行的变更
    -   grant：赋予用户的操作权限
    -   revoke：取消用户的操作权限

### SQL 的基本书写规则

-   SQL 语句要以分号`;`结尾
-   SQL 的关键字不区分大小写，但是表名、字段名、数据等是区分大小写的
-   字符串或者日期等类型需用单引号括起来，如'xyz'、'2021-10-29'
-   单词需要使用空格或者换行符进行分隔
-   数据库、表、字段的名称可以使用英文、数字以及下划线，一般情况下数据库名、表名和列名等小写

### 数据类型

只列常用：

| 类型                    | 描述                                            |
| ----------------------- | ----------------------------------------------- |
| int、bigint、tinyint 等 | 整数数字类型                                    |
| char                    | 定长字符串类型                                  |
| varchar                 | 可变长度字符串类型                              |
| text                    | 文本类型                                        |
| datetime                | 日期和时间的组合类型，格式：YYYY-MM-DD HH:MM:SS |
| ···                     | ···                                             |

## 数据库的基本操作

### 数据库相关

-   创建数据库

```sql
CREATE DATABASE <数据库名>;
```

-   删除数据库

```sql
DROP DATABASE <数据库名>;
```

-   列出数据库

```sql
SHOW DATABASES;
```

-   切换数据库

```sql
USE <数据库名>;
```

### 数据表相关

-   创建表

```sql
CREATE TABLE <表名> (
    <列名1> <类型> <约束>,
    <列名2> <类型> <约束>,
        ...
        ...
        ...
    <表的约束1>,
    <表的约束2>,
    ....
);
```

-   删除表

```sql
DROP TABLE <表名>;
```

-   更新表

    -   新增列

        ```sql
        ALTER TABLE <表名> ADD COLUMN <列名> <类型> <约束>;
        ```

    -   删除列

        ```sql
        ALTER TABLE <表名> DROP COLUMN <列名>;
        ```

    -   修改列

        ```sql
        ALTER TABLE <表名> MODIFY COLUMN <列名> <类型> <约束>;
        ```

-   插入数据

```sql
INSERT INTO <表名> VALUES (值1, 值2,....);
```

指定所要插入数据的列:

```sql
INSERT INTO <表名>(列1, 列2,...) VALUES (值1, 值2,....);
```

### 示例

-   创建数据库

```sql
CREATE DATABASE test;
```

-   显示数据库

```sql
SHOW DATABASES;
```

-   切换数据库

```sql
use test;
```

-   创建数据表

```sql
CREATE TABLE `persons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` int(11) COMMENT '年龄',
  `gender` varchar(11) NOT NULL DEFAULT 'male' COMMENT '性别',
  `address` varchar(64) COMMENT '地址',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人员信息表';
```

-   新增列

```sql
ALTER TABLE persons ADD COLUMN mobile varchar(64) COMMENT '手机号';
```

-   删除列

```sql
ALTER TABLE persons DROP COLUMN mobile;
```

-   修改列

```sql
ALTER TABLE persons MODIFY COLUMN age varchar(11) COMMENT '年龄';
```

-   插入数据

```sql
INSERT INTO persons VALUES (1,'Alice',24,'female','Beijing','2021-10-29 12:00:00');
```

```sql
INSERT INTO persons(name,age,gender,address) VALUES ('Bob',25,'male','Shanghai');
```

**原创不易，如果小伙伴们觉得有帮助，麻烦点个赞再走呗~**

**最后，感谢女朋友在工作和生活中的包容、理解与支持 ！** ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84505e3c967e43bfb7900f08e9ff110d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

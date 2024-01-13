# mysql learning

## 安装 mysql

[Windows 安装 mysql 详细步骤（通俗易懂，简单上手）](https://blog.csdn.net/weixin_43423484/article/details/124408565)

## 教程

[菜鸟教程 mysql](https://www.runoob.com/mysql/mysql-tutorial.html)

MySQL 变量的使用
在 mysql 文档中，mysql 变量可分为两大类，即系统变量和用户变量。

但根据实际应用又被细化为四种类型，即局部变量、用户变量、会话变量和全局变量。

一、局部变量

mysql 局部变量，只能用在 begin/end 语句块中，比如存储过程中的 begin/end 语句块。

其作用域仅限于该语句块。

```sql
-- declare 语句专门用于定义局部变量，可以使用 default 来说明默认值
declare age int default 0;

-- 局部变量的赋值方式一
set age=18;

-- 局部变量的赋值方式二
select StuAge
into age
from demo.student
where StuNo='A001';
```

二、用户变量

mysql 用户变量，mysql 中用户变量不用提前申明，在用的时候直接用“@变量名”使用就可以了。

其作用域为当前连接。

```sql
-- 第一种用法，使用 set 时可以用“=”或“:=”两种赋值符号赋值
set @age=19;

set @age:=20;

-- 第二种用法，使用 select 时必须用“:=”赋值符号赋值
select @age:=22;

select @age:=StuAge
from demo.student
where StuNo='A001';

```

三、会话变量

mysql 会话变量，服务器为每个连接的客户端维护一系列会话变量。

其作用域仅限于当前连接，即每个连接中的会话变量是独立的。

```sql
-- 显示所有的会话变量
show session variables;

-- 设置会话变量的值的三种方式
set session auto_increment_increment=1;
set @@session.auto_increment_increment=2;
set auto_increment_increment=3; -- 当省略 session 关键字时，默认缺省为 session，即设置会话变量的值

-- 查询会话变量的值的三种方式
select @@auto_increment_increment;
select @@session.auto_increment_increment;
show session variables like '%auto_increment_increment%'; -- session 关键字可省略

-- 关键字 session 也可用关键字 local 替代
set @@local.auto_increment_increment=1;
select @@local.auto_increment_increment;
```

四、全局变量

mysql 全局变量，全局变量影响服务器整体操作，当服务启动时，它将所有全局变量初始化为默认值。要想更改全局变量，必须具有 super 权限。

其作用域为 server 的整个生命周期。

```sql
-- 显示所有的全局变量
show global variables;

-- 设置全局变量的值的两种方式
set global sql_warnings=ON; -- global 不能省略
set @@global.sql_warnings=OFF;

-- 查询全局变量的值的两种方式
select @@global.sql_warnings;
show global variables like '%sql_warnings%';

```

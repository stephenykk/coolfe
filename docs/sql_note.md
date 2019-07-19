mysql learning
===
MySQL变量的使用
在mysql文档中，mysql变量可分为两大类，即系统变量和用户变量。

但根据实际应用又被细化为四种类型，即局部变量、用户变量、会话变量和全局变量。

 

一、局部变量

mysql局部变量，只能用在begin/end语句块中，比如存储过程中的begin/end语句块。

其作用域仅限于该语句块。

复制代码
-- declare语句专门用于定义局部变量，可以使用default来说明默认值
declare age int default 0;

-- 局部变量的赋值方式一
set age=18;

-- 局部变量的赋值方式二
select StuAge 
into age
from demo.student 
where StuNo='A001';
复制代码
 

二、用户变量

mysql用户变量，mysql中用户变量不用提前申明，在用的时候直接用“@变量名”使用就可以了。

其作用域为当前连接。

复制代码
-- 第一种用法，使用set时可以用“=”或“:=”两种赋值符号赋值
set @age=19;

set @age:=20;

-- 第二种用法，使用select时必须用“:=”赋值符号赋值
select @age:=22;

select @age:=StuAge 
from demo.student 
where StuNo='A001';
复制代码
 

三、会话变量

mysql会话变量，服务器为每个连接的客户端维护一系列会话变量。

其作用域仅限于当前连接，即每个连接中的会话变量是独立的。

复制代码
-- 显示所有的会话变量
show session variables;

-- 设置会话变量的值的三种方式
set session auto_increment_increment=1;
set @@session.auto_increment_increment=2;
set auto_increment_increment=3;        -- 当省略session关键字时，默认缺省为session，即设置会话变量的值

-- 查询会话变量的值的三种方式
select @@auto_increment_increment;
select @@session.auto_increment_increment;
show session variables like '%auto_increment_increment%';        -- session关键字可省略

-- 关键字session也可用关键字local替代
set @@local.auto_increment_increment=1;
select @@local.auto_increment_increment;
复制代码
 

四、全局变量

mysql全局变量，全局变量影响服务器整体操作，当服务启动时，它将所有全局变量初始化为默认值。要想更改全局变量，必须具有super权限。

其作用域为server的整个生命周期。

复制代码
-- 显示所有的全局变量
show global variables;

-- 设置全局变量的值的两种方式
set global sql_warnings=ON;        -- global不能省略
set @@global.sql_warnings=OFF;

-- 查询全局变量的值的两种方式
select @@global.sql_warnings;
show global variables like '%sql_warnings%';
复制代码
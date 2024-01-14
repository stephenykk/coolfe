# sql 表关系

> 原文地址[sql 表关系（一对一，多对一（一对多），多对多）创建 - 掘金](https://juejin.cn/post/6959734754413379597?searchId=20240114101651C47210219CEA111DCDC8)

### 多对一

```auto
由外键实现
```

班级表（calss)

| cid | caption  |
| --- | -------- |
| 1   | 三年二班 |
| 2   | 一年三班 |
| 3   | 三年一班 |

学生表 (student)

| sid | sname | gender | class_id |
| --- | ----- | ------ | -------- |
| 1   | 钢蛋  | 女     | 1        |
| 2   | 铁锤  | 男     | 1        |
| 1   | 山炮  | 男     | 2        |

对于上述两个表格，班级与学生就构成了一对多的关系，一个班级可以有多名学生，SQL 实现只需为学生表添加 class_id 外键即可实现

```sql
create table class(
    cid int not null auto_increment primary key,
    caption varchar(10)
)

create table student(
    sid int not null auto_increment primary key,
    sname varchar(10),
    gender  enum('男','女') not null default '男',
    class_id int,
    constraint fk_s_c foreign key student(class_id) references class(cid)
)
```

### 一对一

```auto
由外键+唯一索引实现,一对一其实就是在多对一的基础上添加一个唯一索引
```

| sid | sname | gender | class_id |
| --- | ----- | ------ | -------- |
| 1   | 钢蛋  | 女     | 1        |
| 2   | 铁锤  | 男     | 1        |
| 1   | 山炮  | 男     | 2        |

如上面表格，钢蛋与铁锤 class_id 相同（属于同一班级）,若我们把 class_id 设置为唯一索引，这时钢蛋和铁锤的 class_id 就不能相同，也就是说所有同学的 class_id 都不能相同，即每个同学只能属于不同的班级，这样就实现了一对一了，SQL 如下

```sql
create table student(
    sid int not null auto_increment primary key,
    sname varchar(10),
    gender  enum('男','女') not null default '男',
    class_id int,
    constraint fk_s_c foreign key student(class_id) references class(cid),
    constraint uq_name unique (class_id)
)
```

### 多对多

```auto
由关联表实现
```

订单表

| id  | price  |
| --- | ------ |
| 1   | 100.99 |
| 2   | 100.00 |

商品表

| id  | name   |
| --- | ------ |
| 1   | 衬衫   |
| 2   | 牛仔裤 |

```auto
同一个订单，同一商品可以有多个，如订单1,存在2个衬衫，1条裤子，通过两个外键实现多对多
```

订单详情标

| id  | oid | pid |
| --- | --- | --- |
| 1   | 1   | 1   |
| 2   | 1   | 1   |
| 3   | 1   | 2   |
| 4   | 2   | 1   |
| 5   | 2   | 2   |

实现 SQL 如下

```sql
-- 表面不可以时关键字，第一次使用了order报错，找了很久都不知道什么错误
create table order_info(
    id int not null auto_increment primary key,
    price decimal(5,2) not null
)
create table product(
    id int not null auto_increment primary key,
    name varchar(50) not null
)

create table order_product(
    id int not null auto_increment primary key,
    oid int,
    pid int,
    constraint fk_o_p_o foreign key (oid) references order_info(id),
    constraint fk_o_p_p foreign key (pid) references product(id)
)
```

如果我们想实现同一个订单，商品不可以多个，则加上一个 unique(oid,pid)即可，具体是否需要添加，看实际业务需求

```sql
create table order_product(
    id int not null auto_increment primary key,
    oid int,
    pid int,
    constraint fk_o_p_o foreign key (oid) references order_info(id),
    constraint fk_o_p_p foreign key (pid) references product(id),
    unique (oid,pid)
)
```

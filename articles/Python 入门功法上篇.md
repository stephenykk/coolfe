# Python 入门功法上篇

## 简介

Python 是一门简单又强大的编程语言，所以它现在非常流行，尤其是在 AI 和机器学习越来越备受关注的当下。学点 Python，对于需要了解编程概念的新手或需要拓展自身技能的其他语言的程序员都是不错的选择。

**简单**  
毕竟 Python 的作者龟叔是研究 ABC 语言出身的，其设计的 Python 语言在易读和简洁方面十分出色。Python 语言的关键字基本都采用简写，在能表达其含义的前提下，能简则简， 比如 `str` ， `dict`， `del`， `sys`; 语法也十分好懂，有点接近自然语言了，如下代码片段可以感受一二

```python
age = int(input('what is your age? '))

# 容易理解的逻辑运算
if not age > 18:
    print('你好 少年')

# 更抽象且通用的for语句
for student in students:
    student.showInfo()


# 简洁强大的列表推导
numbers = [n for n in range(10)]

```

**强大**  
强大的 Linux 很多都默认安装了 Python2.x，Python 也有“胶水语言"之称，这说明 Python 的应用广泛而且能够和其他语言对接(互相调用)；Python 的生态十分强大，包含很多第三方库，常见的需求都能在第三方库找到包来解决；网上流传着”人生苦短，我用 Python“这样的美谈，我认为这不是一种嘲讽，Python 确实有着强大的表达能力，举个通俗点的例子： 其他语言要 100 行才能实现的功能，Python 可能只需要 10 行就搞定了。

以上是笔者基于自身浅薄实践，对 Python 语言的一些直观体会。接下来会介绍 Python 的基础知识，如果以下的知识你都理解掌握，那么你可以自信地跟別人说自己是一名 Python 程序员啦! :)

> BTW: 笔者时常会有很多小白会有的疑惑，到底学到什么程度，自己才算学会了呀? :)
> 如果你想知道自己的 python 基础是否过关，那么不妨继续往下看  
>  当然，学会和精通之间是有鸿沟的，笔者认为理解底层原理和最佳实践，才能算得上精通，这需要时间的积累。

## 语法

### 缩进

Python 用缩进表示代码块, 如 `if`分支语句 和 `while` 循环体

```python
# 严格缩进表示代码块
if not age > 18:
    print("hello, teenager")
else:
    print('hello, adult')

n = 10
while n > 0:
    print(n)
    n -= 1
```

### 大小写敏感

标识符是大小写敏感的; 变量、函数和类都是需要我们去命名的，注意不能和 Python 的关键字同名。

```python
# 大小写敏感
color = 'blue'
Color = 'pink'

print(color, 'is not same as', Color)

# 查看有哪些关键字
import keyword
print(keyword.kwlist)

```

### 变量无需声明

Python 没有变量声明语句，在给变量赋值时，创建变量。

> JS 变量声明语句: `var isFav = true`

```python
laptop = 'Mac'
print("My computer is %s" % laptop)

```

### 弱类型

Python 是**弱类型**语言，变量连声明都不需要，更别说声明变量的类型了；**弱类型**还有一层意思就是，可以在运行时赋值不同类型的数据。

**弱类型不代表无类型，Python 中一切都是对象，对象都属于某种类型**

> 这就好比世间万物都可以统称为物体，每种物体有对应的称呼（类别），即人为分类，并为分类命名。

```python
value = 12
if value > 10:
    value = 'good'
else:
    value = []

```

### 无需分号结尾

语句不需要 `;` 结尾，直接回车换行就表示语句结束。不过 `;` 号也不是没用的，可以用来分隔多条语句，把多条语句写在一行

> BTW: 语句后面加了 `;` 其实也不会报错，可理解为用`;`号连接了条空语句

```python
print('hello hero')

print('hello dear'); # 也不会报错，不过不推荐哈

print('one') print('two') # 报错
print('one'); print('two') # 一行书写多条语句用分号

```

嗯。。既然多条语句可以一行书写，那么一条语句可以写成多行吗? 其实，也是可以的 :)

> 配对的语法元素没有在当前行形成配对，就会到下行查找

```python
print('Hi, Alice \
How are you today?')

print(['Can',
'you', 'sing', '?'])

```

### 注释

Python 的注释符是 `#`, 支持整行注释和行尾注释

```python
# user retry times
times = 0

if times  > 3: # greater then max times
    print('Retry too many times!')

# 多行注释
# ha ha
# xi xi

```

## 输入输出

输入是指获取用户通过键盘向 Python 程序输入内容  
输出是指 Python 程序向用户输出信息

```python
user = input('user name:')
print('welcome back', user, '!');

# 指定参数之间的分隔符
print('apple', 'pear', 'orange', sep=',') # apple,pear,orange

# 输出信息后不换行
print('Long time no see', end='')

```

## 数据类型

Python 的数据类型包括：整型、浮点型、字符串、字节型、布尔型、None、列表、元组、字典、集合。可以把它们分为：原始数据类型和复合数据类型两种。

原始数据类型有：整型、浮点型、字符串、布尔型和 None  
复合数据类型有: 列表、元组、字典、集合和字节型

> 字节类型的数据其实是一个字节的序列，所以可认为是复合数据类型; 不过，单独修改某个字节是不允许的。

想查看变量保存的数据是什么类型的， 用 `type` 和 `isinstance` 判断

```python
age = 10
type(age) # int
# 返回的是类型，不是类型的名称
type(age) == int  # True


val = eval(input('your age? '))
if not isinstance(age, int):
    age = int(age)


# 判断是否多种类型中任一类型的实例
isinstance(age, (int, float))


```

下面分别介绍每种数据类型，看看它们是怎么创建、访问、修改、删除和遍历的？

### 整型

Python 中数值类型有两种： 整型和浮点型（_即：整数型和小数型_），我们生活中常见的数字都是 10 进制的，10 进制是对人简单易懂的表示方式；然而对计算机来说却不是，计算机最喜欢的是 2 进制。整数在计算机中有多种不同进制下的表示方式。

`int` 是整数类，可用来创建整数实例，也可用来做类型转换(_把其他类型转换为整型_)

```python
##---- 创建 ----
# 字面量
n = 10
n = 0xa # 十六进制表示10
n = 0o12 # 八进制表示10
n = 0b1010 # 二进制表示10

# 进制转换，注意转换结果是字符串
v = bin(10) # '0b1010'
v = oct(10) # '0o12'
v = hex(10) # '0xa'
# 转换为数值
n = eval('0xa') # 10

# 实例化
n = int(10)
n = int('100')
n = int('0xa') # 报错，int不能把其他进制的字符串形式转换为数值

##---- 访问 ----
# 用变量名访问

##---- 修改 ----
# 不可修改，直接赋值新整数对象
n = 12
n += 10

##---- 删除 ----
del n
print(n) # 报错，n已经不存在了

```

### 浮点型

Python 的浮点数没有精度限制，取决于内存大小。其他语言的浮点数据类型一般都用固定个数的二进位保存，故此有精度限制

> 精度：就是精确程度，比如：以前的秤砣，最小单位就是两，称量 2.33 两的东西，显示的结果只有 2 两。小于最小单位的部分无法表示，这就是精度限制。

`float`可创建浮点型对象，也可做类型转换

```python
##---- 创建 ----
# 字面量
weight = 1.3
# 科学计数法 e = exponent 指数的意思，即10的多少次方
distance = 1.23456e2 # 123.456
percent = 1.23e-2 # 0.0123 指数可以为负数，表示小数点左移几位

# 实例化
price = float(199.5)
price = float('299.2323') # 类型转换
price = float('12.3456e2') # 科学计数形式字符串转换为小数

##---- 访问 ----
# 用变量名访问

##---- 修改 ---
# 不可修改,直接赋值新浮点对象
price = 10.2
price = 10 / 3
price += 1

##---- 删除 ---
del price


```

### 字符串

字符串是十分常用的数据类型，常见的操作有: 拼接、查找、替换、切片、大小写转换等。

`str`是字符串类，可以实例化一个字符串对象，或者类型转换得到一个字符串对象

**不可修改**

字符串是原始数据类型，所有原始数据类型都是不可修改的。

字符串变量赋值新的字符串，实际上是丢弃了旧字符串，保存新的字符串，并不是旧字符串改为了新字符串。变量保存的字符串对象已经换了一个啦 :)

**转义符**

转义符是 `\`

何谓转义符，顾名思义就是转换字符的含义，特殊含义转换为普通含义，或普通含义转为特殊含义。

如: 双引号 `"` 默认是特殊含义，表示字符串的首尾边界，把配对的双引号内部识别为字符串对象；如用转义符转义 `\"` , 则从默认的特殊含义转为普通含义，普通含义就是双引号`"`这个字符

又比如: 字符 `n` 默认是普通含义，即就是字符 `n`, 如果用 `\n` 转义，则转为特殊含义，表示换行。

```python

##---- 创建 ----
# 字面量
# 单引号包括内容
msg = 'Hi, how are you?'
# 也可用双引号
msg = "Hi, Sunday"
# 单引号可包含双引号
msg = 'It is really "Good"'
# 双引号可包含单引号
msg = "Lucy's cat is here"
# 那如果内容中既有单引号，又有双引号呢？ :(
# 用转义符 \
msg = "Lucy's cat is really \"Cute\""

# 实例化
msg = str('hello')
# 类型转换, 实际是调用 19 这个整数对象的 __str__() 方法
age = str(19)

##---- 访问 ----
# 用变量名访问

##---- 修改 ----
# id(obj) 返回对象的内存地址，地址不同说明是不同的对象
name = 'Lufy'
id(name) # 1861099331184
name = 'Nami'
id(name) # 1861099329840

##---- 删除 ----
del name

##---- 遍历 ----
for c in msg:
    print(c)

```

**三引号**  
三引号是为了更容易且直观地换行，当要输出一大段包含多行内容的文本时，一般的做法就是在换行位置加换行符 `\n`, 换行比较多的情况下，这略显麻烦。

```python
dairy = 'it is raining today. \nI stay home and listen it'

dairy = """
It is raining today
I stay home and listen it
"""

dairy = '''
It is raining today
I stay home and listen it
'''

print(dairy)

```

**Raw-String**  
如要输出的内容包含很多需要转义的部分，就要很多的转义符去做适当的处理，原始字符串(raw-string, 如: `r'new line is \n'`)就是把一切字符都当做普通字符。由此可见，Python 还是很贴心的 :)

```python
con = '各种语言都支持转义符，而且基本是一样的，用 \\n 表示换行, 用 \\t 表示一个制表位，\\v 表示垂直制表位'

con = r'各种语言都支持转义符，而且基本是一样的，用 \n 表示换行, 用 \t 表示一个制表位，\v 表示垂直制表位'

print(con)

```

若要输出大段的文本采用三引号和 Raw-String 结合，是最好的实践，所见即所得。

```python

con = r'''
各种语言都支持转义符，而且基本是一样的，
用 \n 表示换行,
用 \t 表示一个制表位，
\v 表示垂直制表位
'''

print(con)

```

**拼接**  
字符串拼接有多种方法： 加号(`+`)、占位符(`%s`)、format 方法和 `f-string`

```python
name = 'Lufy'
# 加号
greet = 'hello ' + name

# 乘号
line = '=' * 30

# 占位符
msg = 'hello, %s' % name
print(msg)

# format方法
age = 12
msg = 'hi, age is: {1}, my name is: {0}'.format(name, age)

# f-string
msg = f'hi, {name}'

```

## 字节型

计算机中各种类型的文件（文本、图片、音视频、可执行文件）在硬盘或内存中都是以二进制形式存储的，它们通过解码后变成我们可以识别的内容(文字、图像等)。

在保存或传输文件时，编解码是很常见的操作，文本和图片等文件有各自的编解码方式。

这里简单讲讲文本的编解码(_主要是我没有很深入的理解 汗！_)。 Python 支持多国语言，使用 unicode 字符集，unicode 字符集是一张表，世界各国的字符都有唯一的数字与之对应，这个数字称为码位。一段文字通过字符集表可以映射到一系列的数字，这些数字怎么编码呢，于是又有 utf-8 、utf-16 和 utf-32 等编码方式。

**解码**  
如要输出`路`这个字给用户，需把文件中的二进制数据用它当初的编码方式进行解码，得到`路`这个字在 unicode 字符集表中对应的数字(码位), 然后程序根据码位找到对应的字符`路`, 再把它绘制到屏幕上。

**编码**  
程序要把`雨`字保存到`word.txt`文件时，需先查 unicode 字符集表，得到`雨`对应的码位, 然后用指定编码方式（如: utf-8)进行编码，得到二进制序列，最终保存到`word.txt`文件中。

> 所有国家的人都使用 Unicode 编码之后，扩展、乱码问题都不复存在：所有人类语言字符都有了一个统一的编码码位，码位都有唯一的字符与之对应。Python 中 `chr` 函数返回 Unicode 码位对应的字符。

嗯。。码位转换为二进制，得到一个的二进制序列（如: `bin(ord('路'))` 得到 `0b1000110111101111`），为什么不能把该二进制序列直接保存到文件中，而是要编码呢？

主观猜想：应该是因为码位的二进制序列没有固定的长度，没法区分每个字符

```python
##---- 创建 ----
# 字面量
word = b'hello'

# 实例化
word = bytes([97, 98, 99]) # b'abc'

##---- 访问 ----
# 通过变量访问
len(word)
# 通过索引访问指定字节
print(word[0])

##---- 修改 ----
# 不可修改，直接赋值新字节型对象
word = b'happy'
word[1] = 99 # 报错

##--- 删除 ---
del word
del word[0] # 报错

##--- 遍历 ---
for b in word:
    print(b)


```

字符串和字节型可以相互转换。 字符串编码后变成字节型，字节型对象解码后得到字符串

```python
motion = 'happy'
motionBytes = motion.encode('utf-8')
type(motionBytes) # bytes

motionStr = motionBytes.decode('utf-8')
print(motionStr) # happy

```

码点和字符可以相互转换。

```python
code = ord('路') # 36335
road = chr(code) # 路


```

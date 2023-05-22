# python 基础教程

[python 基础教程](http://www.runoob.com/python/python-tutorial.html)
[python 教程 廖雪峰](https://www.liaoxuefeng.com/wiki/1016959663602400)

## 简介

python 是一种简单优雅的脚本语言，包含非常完善的基础代码库, 覆盖网络、文件、GUI、 数据库、文本等, 除了内置库以外还有大量第三方库。

python 的适用范围: 网络应用、脚本任务和其它自动化工具

## 安装

python 是跨平台的，解释型的脚本语言(**似乎脚本语言都是解释型和跨平台的**)
python 有 2.x 和 3.x 两个版本，较多的应用都是基于 2.x 开发的; 安装 python 就是安装 python 的解释器, 得到一个命令行交互环境.

- mac `brew install python3`
- ubuntu `sodu apt-get install python3`
- window 直接到官网下载对应安装包

安装后将 python 安装目录，添加到环境变量, 然后打开命令行，输入 python ， 进去交互环境

> 注意 windows 用户在 git bash 下，输入 python，不能进入到 python 交互环境, 执行 winpty python 进入交互环境

在命令行中输入 python 进入交互模式

```shell
    > python
    >>> print('hello world')
    >>> exit()
```

执行 python 脚本文件, 命令行下`python hello.py`

> 开始菜单可以找到 python 专用 CLI

### python 解释器

python 代码文件以`.py`为后缀，由 python 解释器解释执行。

python 有多种解释器:

- CPython 官方解释器，C 语言开发的，所以叫 CPython, 命令行下输入 python 就是进入 CPython 解释器环境
- IPython 增强版的 CPython
- PyPy 执行速度较快
- Jython 把 python 编译成 java 字节码执行
- IronPython 运行在.NET 平台的 pyton 解释器

## Hello World

可在命令行交互环境执行，或保存为 hello.py 文件

```shell
    > python
    >>>print('hello world')
    >>>exit()

    > python hello.py

    #mac 或 linux上还可直接运行 python文件，如：
    // hello.py
    #!/usr/bin/env python3
    print('hello world')

    > chmod a+x hello.py
    > ./hello.py
```

### 输出

```python
    print('hello python')
    print('nice', 'to', 'meet', 'you') # 可打印多个字符串 同 console.log
    print('100+200=', 100+200) # 逗号分隔的每个表达式间加空格
```

### 输入

```python
    name = input('input your name:') # 然后输入 'sindy' python3
    # name = raw_input('input your name:') # python2
    print(name)
```

### 语法

python 的语法比较简单:

- 用缩进表示代码块; 不用括号,花括号划分代码块
- 不用分号表示语句结束
- 标识符大小写敏感
- 声明变量不需要 var 等关键字

```python
    # print absolute value
    a = -120
    if a >= 0:
        print(a)
    else:
        print(-a)

```

### 数据类型和变量

python 的数据类型包括: 整数、浮点数、字符串、字节型、布尔值、空值、列表、字典和自定义类型

```python
    1, 100, -80, 0xfa # 整数
    1.23 1.23e9, 1.2e-5 # 浮点数

    # 字符串 单双引号互相包含
    "what's your name"
    'I\'m "OK"'

    # raw string 内部的特殊字符都做普通字符对待
    r'\the-school\n'

    # 三引号 可输出换回字符串
    '''line1,
    line2'''

    r'''line one \n \t
    will not escape
    '''

    # 字节型
    b'ABC'
    len('abc') # 3
    b'hello'.decode('ascii')
    len(b'good') #4

    # 布尔值
    True False
    # 逻辑运算符
    # and or not

    # 空值
    None

    # 条件判断
    if age >= 18:
      print('adult')
    else:
      print('teenager')
```

python 是弱类型(动态类型)语言

```python
    a = 100 # 整数
    print(a)
    a = 'hello' # 字符串
    print(a)
```

python 中常量习惯用全大些字母表示, 如 `PI=3.1415`, 并非真正意义的常量(**同 JS**)

python 的两种除法：

```python
    print(10 / 3) #3.33.. 普通除法 结果为浮点数
    print(10 // 3) #3 地板除 结果为整数 整除(有小数 则向下取整) 结果为整数
    print(20 / 3)
    print(20 // 3) #6
    print(9 / 3) #3.0 /除法计算结果是浮点数，即使是两个整数恰好整除，结果也是浮点数：

    print(10 % 3) #1 模运算，取余数
```

python 的整数和浮点数没有大小限制

### 字符串和编码

#### 字符编码

因为计算机只能处理数字，如果要处理文本，就必须先把文本转换为数字才能处理。最早的计算机在设计时采用 8 个比特（bit）作为一个字节（byte）

- ASCII 1 个字节，最大 255
  > 由于计算机是美国人发明的，因此，最早只有 127 个字符被编码到计算机里，也就是大小写英文字母、数字和一些符号，这个编码表被称为 ASCII 编码，比如大写字母 A 的编码是 65，小写字母 z 的编码是 122
- GB2312
  > 处理中文显然一个字节是不够的，至少需要两个字节，而且还不能和 ASCII 编码冲突，所以，中国制定了 GB2312 编码，用来把中文编进去
- Unicode 最常用的是用两个字节表示一个字符（如果要用到非常偏僻的字符，就需要 4 个字节）

  > 全世界有上百种语言，日本把日文编到 Shift_JIS 里，韩国把韩文编到 Euc-kr 里，各国有各国的标准，就会不可避免地出现冲突，结果就是，在多语言混合的文本中，显示出来会有乱码 因此，Unicode 应运而生。Unicode 把所有语言都统一到一套编码里，这样就不会再有乱码问题了

- UTF-8 用于存储和传输 英文 1 个字节 中文 3 个字节
  > 统一成 Unicode 编码，解决了乱码问题；但是，如果你写的文本基本上全部是英文的话，用 Unicode 编码比 ASCII 编码需要多一倍的存储空间，在存储和传输上就十分不划算。所以，本着节约的精神，又出现了把 Unicode 编码转化为“可变长编码”的 UTF-8 编码。UTF-8 编码把一个 Unicode 字符根据不同的数字大小编码成 1-6 个字节，常用的英文字母被编码成 1 个字节，汉字通常是 3 个字节，只有很生僻的字符才会被编码成 4-6 个字节。如果你要传输的文本包含大量英文字符，用 UTF-8 编码就能节省空间：

在计算机内存中，统一使用 Unicode 编码，当需要保存到硬盘或者需要传输的时候，就转换为 UTF-8 编码。

用记事本编辑的时候，从文件读取的 UTF-8 字符被转换为 Unicode 字符到内存里，编辑完成后，保存的时候再把 Unicode 转换为 UTF-8 保存到文件

![字符编码工作方式](https://www.liaoxuefeng.com/files/attachments/923923787018816/0)

浏览网页的时候，服务器会把动态生成的 Unicode 内容转换为 UTF-8 再传输到浏览器, 所以你看到很多网页的源码上会有类似`<meta charset="UTF-8" />`的信息，表示该网页正是用的 UTF-8 编码。

![字符编码工作方式2](https://static.liaoxuefeng.com/files/attachments/923923759189600/0)

#### Python 的字符串

在最新的 Python 3 版本中，字符串是以 Unicode 编码的，也就是说，Python 的字符串支持多语言

```python
    print('包含中文的str')
    print(ord('A')) # 字符对应的编码
    print(chr(66)) # 编码对应的字符
    # 知道字符的编码，可用十六进制 输出字符
    print('\u4e2d\u6587')
```

由于 Python 的字符串，在内存中以 Unicode 表示，一个字符对应若干个字节。如果要在网络上传输，或者保存到磁盘上，就需要把 str 变为以字节为单位的 bytes

> 用带 b 前缀的单引号或双引号表示`bytes`类型

```python
strVal = 'Hello'
byteVal = b'Hello' # bytes的每个字符都只占用一个字节。
```

以 Unicode 表示的 str 通过 encode()方法可以编码为指定的 bytes

```python
    print('ABC'.encode('ascii')) # b'ABC'
    print('中文'.encode('utf-8')) # b'\xe4\xb8\xad\xe6\x96\x87'
    '中文'.encode('ascii') # 报错 中文不能编码为ascii的bytes
```

反过来，如果我们从网络或磁盘上读取了字节流，那么读到的数据就是 bytes。要把 bytes 变为 str，就需要用 decode()方法：

```python
>>> b'ABC'.decode('ascii')
'ABC'
>>> b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8')
'中文'
>>> b'\xe4\xb8\xad\xff'.decode('utf-8', errors='ignore') # 忽略错误的字节

```

len()函数计算的是 str 的字符数，不是字符串占用的字节数，如果换成 bytes，len()函数就计算字节数

```python
>>> len('ABC')
3
>>> len('中文')
2
>>> len(b'ABC')
3
>>> len(b'\xe4\xb8\xad\xe6\x96\x87')
6
>>> len('中文'.encode('utf-8'))
6
```

> 可见，1 个中文字符经过 UTF-8 编码后通常会占用 3 个字节，而 1 个英文字符只占用 1 个字节

由于 Python 源代码也是一个文本文件，所以，当你的源代码中包含中文的时候，在保存源代码时，就需要务必指定保存为 UTF-8 编码。当 Python 解释器读取源代码时，为了让它按 UTF-8 编码读取，我们通常在文件开头写上这两行：

```python
    #!/usr/bin/env python3  ## 告诉Linux/OS X系统，这是一个Python可执行程序，Windows系统会忽略这个注释；

    # -*- coding: utf-8 -*-  ## 告诉Python解释器，按照UTF-8编码读取源代码
```

格式化字符串
`%s`表示用字符串替换，`%d`表示用整数替换，有几个`%?`占位符，后面就跟几个变量或者值，顺序要对应好。如果只有一个`%?`，括号可以省略。

> 在 Python 中，采用的格式化方式和 C 语言是一致的，用%实现

常见的占位符有：

| 占位符 | 替换内容     |
| ------ | ------------ |
| %d     | 整数         |
| %f     | 浮点数       |
| %s     | 字符串       |
| %x     | 十六进制整数 |

```python
    # %d 整数 %f浮点数 %g 整数或科学计数法显示
    print('Hello, %s' % 'world')
    # 多个变量占位 值用列表
    print('Hi %s, you have spent $%d' % （'sindy', 1000))

    print('normal number: %g' % 123)
    print('big number: %g' % 1234567)

    print('float number: %f' % 12.2235)
    print('float number: %.2f' % 12.2225)
    print('float number: %+.2f' % -12.6135)
    print('float number: % .2f' % 12.5685)

    print('%2d-%02d' % (3, 1))
    print('%.2f' % 3.1415926)

    # 不太确定应该用什么占位符，%s永远起作用，它会把任何数据类型转换为字符串
    print('Age: %s. Gender: %s' % (25, True))

    # 转义，用%%来表示一个%
    print('growth rate: %d %%' % 7)
```

**format()**  
它会用传入的参数依次替换字符串内的占位符{0}、{1}……

```python
>>> 'Hello, {0}, 成绩提升了 {1:.1f}%'.format('小明', 17.125)
```

### 列表(list)和元组(tuple)

列表是元素的有序集合，可增删元素 _等同 js 的数组_, 且元素不要求数据类型相同

```python
roles = ['nami', 'zoro', 'lufy']
print(roles)
len(roles) # 3

roles[10] # 索引越界会报错 IndexError
roles[-1] # 最后一个元素

roles.append('robin') # 在末尾追加元素
print(roles)
roles.insert(1, 'sandge') # 在指定位置插入元素
print(roles)
print(roles.pop()) # 删除末尾元素
print(roles)
print(roles.pop(1)) # 删除指定位置元素
print(roles)
roles[1] = 'jobar' # 修改元素
print(roles)

langs = ['python', 'java', ['asp', 'php'], 'scheme'] # 二维数组

```

tuple 和 list 很相似，不过元组的元素是不可修改的, 所以元组没有`append()`, `insert()`之类的方法

```python
colors = ('yellow', 'green', 'red')
colors2 = () # 空元组
nums = (1,) # 只有1个数字的元组，nums = (1) 括号会被认为是数字求值， 所以要加个,
friends = ('idle', 'sandy', ['lucy', 8])
friends[2][1] = 18
print(friends) # 复合数据类型可修改
```

### 条件判断

```python
age = 3
if age >= 18:
    print('your age is', age)
    print('adult')
elif age >= 6:
    print('teenager')
else:
    print('your age is', age)
    print('kid')


s = input('birth: ')
birth = int(s) # 转换为数值型
if birth < 2000:
    print('00前')
else:
    print('00后')
```

### 循环

```python
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)

for i in range(10):
    print(i)

sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)


n = 1
while n <= 100:
    if n > 10: # 当n = 11时，条件满足，执行break语句
        break # break语句会结束当前循环
    print(n)
    n = n + 1
print('END')



n = 0
while n < 10:
    n = n + 1
    if n % 2 == 0: # 如果n是偶数，执行continue语句
        continue # continue语句会直接继续下一轮循环，后续的print()语句不会执行
    print(n)
```

### 字典 dict

dict 全称 dictionary，在其他语言中也称为 map，使用键-值（key-value）存储，具有极快的查找速度。 _同 js 的对象_

```python
role = {'name': 'rufy', 'age': 18, 'skill': 'stretch'} # 属性名的引号不能省略
role['age'] = 19
# role.age = 20 这样修改属性值报错 :(
print(role)

if('age' in role):
    print('yes')

role.get('age')  # 若没有age字段 返回None
role.get('age', 10) # 没有age字段 返回默认值

```

> 在 Python 代码中几乎无处不在，正确使用 dict 非常重要，需要牢记的第一条就是 dict 的 key 必须是不可变对象。

> 这是因为 dict 根据 key 来计算 value 的存储位置，如果每次计算相同的 key 得出的结果不同，那 dict 内部就完全混乱了。这个通过 key 计算位置的算法称为哈希算法（Hash）。

> 要保证 hash 的正确性，作为 key 的对象就不能变。在 Python 中，字符串、整数等都是不可变的，因此，可以放心地作为 key。而 list 是可变的，就不能作为 key

### 集合 set

set 是无序不重复的元素集合

```python
s = set([1,2,3])
print(s) # {1, 2, 3}

s.add(4) # 添加元素
s2 = set([3,4,5])
print(s & s2) # 交集
print(s | s2) # 并集
```

> set 和 dict 的唯一区别仅在于没有存储对应的 value，但是，set 的原理和 dict 一样，所以，同样不可以放入可变对象，因为无法判断两个可变对象是否相等，也就无法保证 set 内部“不会有重复元素”。试试把 list 放入 set，看看是否会报错。

### 函数

Python 内置了很多有用的函数，我们可以直接调用

```python
>>>help(abs) # 查看函数帮助
abs(-120)
abs(-1, 2) # 入参数量不对 会报错
abs('ABC') # 入参类型不对 会报错
min(1,2)
max(2,3) # min max不限定参数个数

# 数据类型转换
int('12')
float('12.33')
str(100)
bool(1)
bool('')
hex(100)

# 函数定义
def myabs(x):
    if x >= 0:
        return x
    else:
        return -x

def my_abs2(x):
    # 参数类型检查
    if not isinstance(x, (int, float)):
        raise TypeError('bad operand type')
    if x >= 0:
        return x
    else:
        return -x


myabs(-9) # 函数调用

# 空函数
def noop():
    pass # pass可以用来作为占位符，比如现在还没想好怎么写函数的代码，就可以先放一个pass，让代码能运行起来


# 返回多个值
import math

def move(x, y, step, angle=0):
    nx = x + step * math.cos(angle)
    ny = y - step * math.sin(angle)
    return nx, ny # 实际返回的是一个tuple

x, y = move(100, 100, 60, math.pi / 6) # 解构赋值
print(x, y)
r = move(100, 100, 60, math.pi / 6)
print(r)

# 位置参数 x n , 参数默认值
def power(x, n = 2):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s


def enroll(name, gender, age=6, city='Beijing'):
    print('name:', name)
    print('gender:', gender)
    print('age:', age)
    print('city:', city)

# 多个默认参数 用参数名只指定某个参数值
enroll('Adam', 'M', city='Tianjin')

# 默认参数必须是不可变对象，不然容易掉坑
def add_end(L=[]):
    L.append('END')
    return L
add_end()
add_end() # ['END', 'END'] 每次调用时，默认参数指向的地址不变

# 可变参数 参数个数可变
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
calc(1,2) # 参数会被自动组装为tuple
calc()

# tuple 或 list 展开作为可变参数传入
nums = [1,2,3]
calc(*nums)

# 关键字参数 类似js函数的options
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

person('Adam', 45, gender='M', job='Engineer') # 关键字参数会被组装为dict对象kw

# dict展开作为关键字参数传入
extra = {'city': 'Beijing', 'job': 'Engineer'}
person('Jack', 24, **extra)

# 命名关键字参数，约束关键字参数只能包含指定字段
# 组装成dict, 函数内部再解构为字段同名的变量
def person(name, age, *, city, job):
    print(name, age, city, job)

person('jack', 23, job='worker', city='beijing')

# 如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符*了
def person2(name, age, *args, city, job):
    print(name, age, args, city, job)

person2('jack', 12, 'hello', 'world', city='beijing', job='accounting')


# 命名关键字参数可以有缺省值
def person(name, age, *, city='Beijing', job):
    print(name, age, city, job)

person('Jack', 24, job='Engineer')
```

参数组合
在 Python 中定义函数，可以用必选参数、默认参数、可变参数、关键字参数和命名关键字参数，这 5 种参数都可以组合使用。但是请注意，参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。

```python
def f1(a, b, c=0, *args, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c=0, *, d, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)

>>> f1(1, 2)
a = 1 b = 2 c = 0 args = () kw = {}
>>> f1(1, 2, c=3)
a = 1 b = 2 c = 3 args = () kw = {}
>>> f1(1, 2, 3, 'a', 'b')
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {}
>>> f1(1, 2, 3, 'a', 'b', x=99)
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {'x': 99}
>>> f2(1, 2, d=99, ext=None)
a = 1 b = 2 c = 0 d = 99 kw = {'ext': None}


>>> args = (1, 2, 3, 4)
>>> kw = {'d': 99, 'x': '#'}
>>> f1(*args, **kw)
a = 1 b = 2 c = 3 args = (4,) kw = {'d': 99, 'x': '#'}
>>> args = (1, 2, 3)
>>> kw = {'d': 88, 'x': '#'}
>>> f2(*args, **kw)
a = 1 b = 2 c = 3 d = 88 kw = {'x': '#'}
# 对于任意函数，都可以通过类似func(*args, **kw)的形式调用它，无论它的参数是如何定义的
```

Python 的函数具有非常灵活的参数形态，既可以实现简单的调用，又可以传入非常复杂的参数。

默认参数一定要用不可变对象，如果是可变对象，程序运行时会有逻辑错误！

要注意定义可变参数和关键字参数的语法：

\*args 是可变参数，args 接收的是一个 tuple；

\*\*kw 是关键字参数，kw 接收的是一个 dict。

以及调用函数时如何传入可变参数和关键字参数的语法：

可变参数既可以直接传入：func(1, 2, 3)，又可以先组装 list 或 tuple，再通过*args 传入：func(*(1, 2, 3))；

关键字参数既可以直接传入：func(a=1, b=2)，又可以先组装 dict，再通过**kw 传入：func(**{'a': 1, 'b': 2})。

使用\*args 和\*\*kw 是 Python 的习惯写法，当然也可以用其他参数名，但最好使用习惯用法。

命名的关键字参数是为了限制调用者可以传入的参数名，同时可以提供默认值。

定义命名的关键字参数在没有可变参数的情况下不要忘了写分隔符\*，否则定义的将是位置参数。

#### 递归函数

在函数内部，可以调用其他函数。如果一个函数在内部调用自身本身，这个函数就是递归函数。

> 使用递归函数需要注意防止栈溢出。在计算机中，函数调用是通过栈（stack）这种数据结构实现的，每当进入一个函数调用，栈就会加一层栈帧，每当函数返回，栈就会减一层栈帧。由于栈的大小不是无限的，所以，递归调用的次数过多，会导致栈溢出

```python
def fact(n):
    if n==1:
        return 1
    return n * fact(n - 1)

print(fact(10))
```

解决递归调用栈溢出的方法是通过尾递归优化，事实上尾递归和循环的效果是一样的，所以，把循环看成是一种特殊的尾递归函数也是可以的。

尾递归是指，在函数返回的时候，调用自身本身，并且，return 语句不能包含表达式。这样，编译器或者解释器就可以把尾递归做优化，使递归本身无论调用多少次，都只占用一个栈帧，不会出现栈溢出的情况。

上面的 fact(n)函数由于 return n \* fact(n - 1)引入了乘法表达式，所以就不是尾递归了。要改成尾递归方式，需要多一点代码，主要是要把每一步的乘积传入到递归函数中：

```python
def fact(n):
    return fact_iter(n, 1)

def fact_iter(num, product):
    if num == 1:
        return product
    return fact_iter(num - 1, num * product)

fact(100)
```

遗憾的是，大多数编程语言没有针对尾递归做优化，Python 解释器也没有做优化，所以，即使把上面的 fact(n)函数改成尾递归方式，也会导致栈溢出。

> 尾递归事实上和循环是等价的，没有循环语句的编程语言只能通过尾递归实现循环。

```python
#
# 利用递归函数移动汉诺塔:
def move(n, a, b, c):
    if n == 1:
        print('move', a, '-->', c)
    else:
        move(n-1, a, c, b)
        move(1, a, b, c)
        move(n-1, b, a, c)

move(4, 'A', 'B', 'C')
```

### 高级特性

#### 切片

```python
L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']
# list[start:end:step]
L[0:3] # 前3个元素同  L[:3]
L[-3:] # 后3个元素
L[-2:-1] # 倒数切片
L[-1] # 末尾元素
L[:10:2] # 前10个数，每两个取一个
L[::5] # 所有数，每5个取一个
L[:] # 取所有，即复制一个list

#tuple和字符串也是一种list，同样可用切片操作
(0, 1, 2, 3, 4, 5)[:3]
'ABCDEFG'[:3]
```

#### 迭代

如果给定一个 list 或 tuple，我们可以通过 for 循环来遍历这个 list 或 tuple，这种遍历我们称为迭代（Iteration）。

> Python 的 for 循环抽象程度要高于 C 的 for 循环，因为 Python 的 for 循环不仅可以用在 list 或 tuple 上，还可以作用在其他可迭代对象上。

```python
d = {'a': 1, 'b': 2, 'c': 3}
for key in d:
    print('key:', key)
for val in d.values():
    print('val:', val)
for key,val in d.items():
    print('key:', key, ' val:', val)

for c in 'ABCD':
    print('c:', c)

```

当我们使用 for 循环时，只要作用于一个可迭代对象，for 循环就可以正常运行，而我们不太关心该对象究竟是 list 还是其他数据类型

```python
# 判断对象是否可迭代
>>> from collections import Iterable
>>> isinstance('abc', Iterable) # str是否可迭代
True
>>> isinstance([1,2,3], Iterable) # list是否可迭代
True
>>> isinstance(123, Iterable) # 整数是否可迭代
False


for i, value in enumerate(['A', 'B', 'C']):
    print(i, value)

# for循环里，同时引用了两个变量，在Python里是很常见的
for x,y in[(1,2), (3,4)]:
    print(x, y)

```

#### 列表生成式

列表生成式即 List Comprehensions，是 Python 内置的非常简单却强大的可以用来创建 list 的生成式

```python
list(range(1, 11)) # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[x * x for x in range(1, 11)] # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]  类似js map
[x * x for x in range(1, 11) if x % 2 == 0] # [4, 16, 36, 64, 100] js arr filter and map

[m + n for m in 'ABC' for n in 'XYZ'] # ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']  笛卡尔积

import os # 导入os模块，模块的概念后面讲到
[d for d in os.listdir('.')] # os.listdir可以列出文件和目录

d = {'hi': 'hello', 'age': '12', 'name': 'lufy'}
[k + '=' + v for k, v in d.items()] #['y=B', 'x=A', 'z=C']


L = ['Hello', 'World', 'IBM', 'Apple']
print([s.lower() for s in L])
```

#### 生成器

要创建一个 generator，有很多种方法。第一种方法很简单，只要把一个列表生成式的[]改成()，就创建了一个 generator： _同 es6 的 generator_
通过 next()函数获得 generator 的下一个返回值

```python
L = [x * x for x in range(10)]
print(L)

g = (x * x for x in range(10))
print(g)
print(next(g))
# generator也是可迭代的
for n in g:
    print(n)

# 著名的斐波拉契数列（Fibonacci），除第一个和第二个数外，任意一个数都可由前两个数相加得到
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'

# 函数定义中包含yield关键字，那么这个函数就不再是一个普通函数，而是一个generator
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

def odd():
    print('step 1')
    yield 1
    print('step 2')
    yield(3)
    print('step 3')
    yield(5)

og = odd()
for n in og:
    print(n)

g = fib(6)
while True:
    try:
        x = next(g)
        print('g:', x)
    except StopIteration as e:
        print('Generator return value:', e.value)
        break
```

generator 是非常强大的工具，在 Python 中，可以简单地把列表生成式改成 generator，也可以通过函数实现复杂逻辑的 generator。

### 迭代器

用于 for 循环的数据类型有以下几种：

- 一类是集合数据类型，如 list、tuple、dict、set、str 等；
- 一类是 generator，包括生成器和带 yield 的 generator function。

```python
from collections import Iterable
print(isinstance([], Iterable)) // True
print(isinstance({}, Iterable)) // True
print(isinstance('abc', Iterable))

```

生成器都是 Iterator 对象，但 list、dict、str 虽然是 Iterable，却不是 Iterator。

把 list、dict、str 等 Iterable 变成 Iterator 可以使用 iter()函数：

```python
isinstance(iter([]), Iterator) // True
isinstance(iter('abc'), Iterator) // True
# 注意区分可迭代 和 迭代对象  iter()
```

> 你可能会问，为什么 list、dict、str 等数据类型不是 Iterator？

> 这是因为 Python 的 Iterator 对象表示的是一个数据流，Iterator 对象可以被 next()函数调用并不断返回下一个数据，直到没有数据时抛出 StopIteration 错误。可以把这个数据流看做是一个有序序列，但我们却不能提前知道序列的长度，只能不断通过 next()函数实现按需计算下一个数据，所以 Iterator 的计算是惰性的，只有在需要返回下一个数据时它才会计算。

- 凡是可作用于 for 循环的对象都是 Iterable 类型；

- 凡是可作用于 next()函数的对象都是 Iterator 类型，它们表示一个惰性计算的序列；

- 集合数据类型如 list、dict、str 等是 Iterable 但不是 Iterator，不过可以通过 iter()函数获得一个 Iterator 对象。

- Python 的 for 循环本质上就是通过不断调用 next()函数实现的

```python
for x in [1, 2, 3, 4, 5]:
    pass

# 等价于

# 首先获得Iterator对象:
it = iter([1, 2, 3, 4, 5])
# 循环:
while True:
    try:
        # 获得下一个值:
        x = next(it)
    except StopIteration:
        # 遇到StopIteration就退出循环
        break
```

## 函数式编程

我们通过把大段代码拆成函数，通过一层一层的函数调用，就可以把复杂任务分解成简单的任务，这种分解可以称之为面向过程的程序设计。函数就是面向过程的程序设计的基本单元

而函数式编程（请注意多了一个“式”字）——Functional Programming，虽然也可以归结到面向过程的程序设计，但其思想更接近数学计算

> 对应到编程语言，就是越低级的语言，越贴近计算机，抽象程度低，执行效率高，比如 C 语言；越高级的语言，越贴近计算，抽象程度高，执行效率低，比如 Lisp 语言。

函数式编程就是一种抽象程度很高的编程范式, 函数式编程的一个特点就是，允许把函数本身作为参数传入另一个函数，还允许返回一个函数！

Python 对函数式编程提供部分支持。由于 Python 允许使用变量，因此，Python 不是纯函数式编程语言。

> 纯函数: 相同的输入，就会得到相同的输出，对外部没有副作用的函数

#### 高级函数

**变量可以指向函数**  
`abs(-10)`是函数调用，而`abs`是函数本身; 函数本身也可以赋值给变量，即：变量可以指向函数。

```python
f = abs
print(f(-200))
```

**函数名也是变量**  
函数名其实就是指向函数的变量

```python
>>> abs = 10
>>> abs(-10)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'int' object is not callable
```

> 注：由于 abs 函数实际上是定义在 import builtins 模块中的，所以要让修改 abs 变量的指向在其它模块也生效，要用 import builtins; builtins.abs = 10。

**传入函数**  
可以接受函数作为参数的函数，称为高阶函数

```python
def add(x, y, f):
    return f(x) + f(y)

# map map(f, list)
def f2(x):
    return x * x

r = map(f2, [1,2,3]) # 返回map对象  同js arr.map
print(list(r), type(r))

print(list(map(str, [1,2,3])))

# reduce reduce(f, list)
from functools import reduce
def add(x, y):
    return x + y

print(reduce(add, [1,3,5,7]))

# lamda  同js匿名函数
from functools import reduce

DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}

def char2num(s):
    return DIGITS[s]

def str2int(s):
    return reduce(lambda x, y: x * 10 + y, map(char2num, s))

# filter filter(f, list)
def is_odd(n):
    return n % 2 == 1
# filter()函数返回的是一个Iterator，也就是一个惰性序列，所以要强迫filter()完成计算结果，需要用list()函数获得所有结果并返回list
list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))

# sorted sorted(list, keyFn)
sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower) # 升序
sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower, reverse=True) # 降序

```

**函数作为返回值**  
高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回。

```python
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum
```

当 lazy_sum 返回函数 sum 时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力

**闭包**  
当一个函数返回了一个函数后，其内部的局部变量还被新函数引用

```python
def count():
    fs = []
    for i in range(1, 4):
        def f():
             return i*i
        fs.append(f)
    return fs

f1, f2, f3 = count()
f1() #9
f2() #9
f3() #9
```

**匿名函数**  
在 Python 中，对匿名函数提供了有限支持, 匿名函数有个限制，就是只能有一个表达式，不用写 return，返回值就是该表达式的结果 _比 js 的匿名函数弱_

```python
list(map(lambda x: x * x, [1, 2, 3, 4, 5, 6, 7, 8, 9]))

def build(x, y):
    return lambda: x * x + y * y

f = lambda x: x * x
```

**装饰器**  
由于函数也是一个对象，而且函数对象可以被赋值给变量，所以，通过变量也能调用该函数; 函数对象有一个**name**属性，可以拿到函数的名字

```python
def now():
    print('2019-09-02')

f = now
f()

print(now.__name__, f.__name__) # now now
```

不修改 now()函数的定义，又可以代码运行期间动态增加功能，称之为“装饰器”（Decorator）。

本质上，decorator 就是一个返回函数的高阶函数

```python
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper # 返回装饰了目标函数的函数

# 借助Python的@语法，把decorator置于函数的定义处
@log
def now2():
    print('2019-01-09')

now2() # 调用now()函数，不仅会运行now()函数本身，还会在运行now()函数前打印一行日志
```

把`@log`放到`now()`函数的定义处，相当于执行了语句 `now=log(now)`

```python
# 可接受参数的装饰器
def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator

# now = log('execute')(now)
@log('execute') # 返回的结果作为装饰器
def now():
    print('2019-11-12')


# 修正__name__的值
import functools

def log(func):
    # wrapper.__name__ = func.__name__
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

在面向对象（OOP）的设计模式中，decorator 被称为装饰模式。OOP 的装饰模式需要通过继承和组合来实现，而 Python 除了能支持 OOP 的 decorator 外，直接从语法层次支持 decorator。Python 的 decorator 可以用函数实现，也可以用类实现。

decorator 可以增强函数的功能，定义起来虽然有点复杂，但使用起来非常灵活和方便。

**偏函数**  
在介绍函数参数的时候，我们讲到，通过设定参数的默认值，可以降低函数调用的难度。而偏函数也可以做到这一点

```python
# int(num, base)
def int2(x, base=2):
    return int(x, base)

# functools.partial就是帮助我们创建一个偏函数的，不需要我们自己定义int2()

import functools
int2 = functools.partial(int, base=2) # 预绑定末尾参数的函数
# 固定了int()函数的关键字参数base
# 相当于
kw = {'base': 2}
init('1001', **kw)

max2 = functools.partial(max, 10)
# 实际上会把10作为*args的一部分自动加到左边
max2(5,6)
# args = (10, 5, 6)

```

当函数的参数个数太多，需要简化时，使用`functools.partial`可以创建一个新的函数，这个新函数可以固定住原函数的部分参数，从而在调用时更简单。

## 模块

为了编写可维护的代码，我们把很多函数分组，分别放到不同的文件里，这样，每个文件包含的代码就相对较少，很多编程语言都采用这种组织代码的方式。在 Python 中，一个.py 文件就称之为一个模块（Module）。

模块化有什么好处？

- 最大的好处是大大提高了代码的可维护性。
- 其次，编写代码不必从零开始。当一个模块编写完毕，就可以被其他地方引用。我们在编写程序的时候，也经常引用其他模块，包括 Python 内置的模块和来自第三方的模块。
- 使用模块还可以避免函数名和变量名冲突。

> 你也许还想到，如果不同的人编写的模块名相同怎么办？为了避免模块名冲突，Python 又引入了按目录来组织模块的方法，称为包（Package）

> 包作为模块的命名空间，避免模块名冲突

请注意，每一个包目录下面都会有一个``**init**.py`的文件，这个文件是必须存在的，否则，Python 就把这个目录当成普通目录，而不是一个包。`**init**.py`可以是空文件，也可以有 Python 代码，因为`**init**.py`本身就是一个模块

包也可以有多级结构，如`mycompanry.web.util`

### 使用模块

Python 本身就内置了很多非常有用的模块

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

' a test module '

__author__ = 'Michael Liao'

import sys

def test():
    args = sys.argv
    if len(args)==1:
        print('Hello, world!')
    elif len(args)==2:
        print('Hello, %s!' % args[1])
    else:
        print('Too many arguments!')

if __name__=='__main__':
    test()
```

**作用域**  
在一个模块中，我们可能会定义很多函数和变量，但有的函数和变量我们希望给别人使用，有的函数和变量我们希望仅仅在模块内部使用(_约定用`_`前缀标识\_)。

正常的函数和变量名是公开的（public），可以被直接引用，比如：abc，x123，PI 等；

`__author__`，`__name__`等是特殊变量，如: `__doc__`可访问文档注释，自定义的变量一般不要用`__xx__`格式；

实际上模块内的所有东西都是可访问的，`_`私有前缀也只是习惯约定

```python
def _private_1(name):
    return 'Hello, %s' % name

def _private_2(name):
    return 'Hi, %s' % name

def greeting(name):
    if len(name) > 3:
        return _private_1(name)
    else:
        return _private_2(name)
```

**安装第三方模块**  
在 Python 中，安装第三方模块，是通过包管理工具 pip 完成的。

`pip install Pillow`

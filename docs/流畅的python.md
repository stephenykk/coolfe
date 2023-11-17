流畅的python
===

受其他语言的影响，总会去寻找自己熟悉的东西
- 正则
- 元组拆包
- 描述符

强调python语言的独有特性

- 特殊方法/魔术方法
- 元编程

不成熟的抽象和过早的优化都不是一件好事情

交互式控制台REPL是一个很好地学习工具


第1章 数据模型
---
python语言的一致性，让语言的使用者和核心开发者拥有一样的工具和能力

元对象协议 MetaObjectProtocol MOP

数据模型其实是对python框架的描述，规范了这门语言自身构建模块的接口，如: 序列、迭代器、上下文管理、函数和类

**魔术方法**
```python
# 背后其实调用的是 obj.__getitem__('color')
obj['color']
# 调用的是 ls.__len__()
len(ls)


# 特殊方法/魔术方法的调用是隐式的
# 如 for i in x: pass 
# 背后其实用的是 iter(x), 调用的是 x.__iter__()

# 被直接调用的特殊方法 只有 __init__, 其他的特殊方法都是被python解释器隐式调用

# 更多的特殊方法
# __repr__ __str__ __add__ __mul__ __abs__
# 从这样看来，很多内置的全局方法调用，其实都是在底层调用对象的特殊方法

```


Vector类
```python
from math import hypot

class Vector:

    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
    
    def __repr__(self):
        return 'Vector(%r, %r)' % (self.x, self.y)
    
    def __abs__(self):
        return hypot(self.x, self.y)
    
    def __bool__(self):
        return bool(abs(self))
    
    def __add__(self, other):
        x = self.x + other.x
        y = self.y + other.y
        return Vector(x, y)
    
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

```

实用胜于纯粹

len() 不是普通的方法

通过实现特殊方法，自定义数据类型表现得跟内置类型一样，更具有表达力

python通过运算符重载，提供了丰富的数值类型


> 《python 技术手册》 《python 参考手册》 《python cookbook》

python 和 ruby 提供丰富的元对象协议 MOP (metaobject protocol)

元对象是指那些对构建语言本身很重要的对象。(*构建核心语言的api*)


第2章 序列构成的数组
---
python中不同的序列类型：字符串、字节序列、列表、数组、元组

序列类型常用操作: 迭代 切片 排序 拼接

容器序列（可以存放不同类型, 保存的是对象的引用）：
- list
- tuple
- collection.deque

扁平序列 (只能存放一种类型，保存的是值，一段连续的内存空间):
- str
- bytes
- bytearray
- memoryview
- array.array


Sequence 和 MutableSequence 抽象基类

% 和 str.format 两种字符串格式化方式
```python
print('%s is good' % 'apple')
'%s is good'.format('apple')

# python对象都要求有一个合理的字符串表示形式
# __repr__ 和 __str__ 的区别
# __repr__ 表示如何用代码构建出被打印的对象

# 乘法和乘法交换律 对应的特殊方法
# __mul__ __rmul__

# 任何对象都可以用于需要布尔值的上下文 调用 bool(obj) 来判断真假
# 自定义对象是通过 __bool__  __len__ 两个特殊方法来决定是True还是False的
```



列表 和 列表推导

> 列表推导是构建列表的强大方法

```python
content='hello world'
codes = [ord(c) for c in content]


# python3中列表推导有自己的作用域，不会污染外部变量
x = 'hello'
ls = [ x for x in 'ABC'] 
x # hello

# 还有 字典推导 和 集合推导

# 列表推导计算笛卡尔积
colors = ['black', 'white']
sizes = ['S', 'M', 'L']
tshirts = [ (color, size) for color in colors for size in sizes ]
```
生成器表达式，惰性求值
```python
symbols = 'abcd'
for val in (s for s in symbols):
    print(val)

# 函数唯一参数，可以省略生成器表达式的括号
tuple(ord(symbol) for symbol in symbols)

import array
array.array('I', (ord(s) for s in symbols))

```
生成器表达式节约内存开销

> python 会忽略 [] {} () 里面的换行，即可以不用续行符 \ , 直接换行即可


元组不仅仅是不可变的列表，还可以用作数据记录

元组拆包(*即解构赋值*)

可迭代对象都可以进行拆包

```python
roles = (('lufy', 12), ('zoro', 11), ('nami', 10))
name, age = roles[0]
# *表示其余的元素
*first, mid, last = range(10)
vars()
first, *mid, last = range(10)
vars()
first, mid, *last = range(10)
vars()

import os
dirpath, filename = os.path.split('/home/alice/code/hi.py')
```

具名元组

```python
import collections
Card = collections.namedtuple('Card', ['Rank', 'Color'])
# 同上
# Card = collections.namedtuple('Card', 'Rank Color')
acard = Card('8', 'diamon')
print(acard.Color)

print(acard._fields)
print(acard._asdict())
bcard = Card._make((9, 'black'))
print(bcard._asdict())

```

切片

序列类型都支持切片操作
```python
nums = range(1, 11)
firstPart = nums[:3]
lastPart = nums[3:]
odds = nums[1::2]
# 支持负索引 负步长
revNums = nums[::-1]
nums2 = nums[1:-1]

# 切片对象
aslice = slice(start, stop, step)
seq[aslice]

# nums[5:1:-1]
# 实际上调用的是 nums.__getitem__(slice(5,1,-1)) 

#  切片赋值
ls = list(range(10))
ls[2:5] = ['N']
del ls[3:5]

ls = list(range(10))
ls[7:9:2] = ['a', 'b'] # 需要元素个数相同

# 序列拼接
ls = ['a', 'b', 'c']
ls = ls + [1, 2]
ls = ls * 2


# 排序
ls.sort() # 就地排序返回None
sorted(ls) # 返回排序后的新列表

# bisect 二分查找排序算法
# bisect.bisect(orderedLs, newVal)  bisect.insort()
newIdx = bisect.bisect(orderLs, newVal)
orderedLs.insert(newIdx, newVal)

# 效果同上
bisect.insort(orderLs, newVal)
```

数组 array.array

数组里面只能存放相同类型的数据项

```python
# 类型码
from array import array
from random import randint
arr = array('b', (randint(1, 100) for i in range(100)))
# arr.pop() arr.insert() arr.extend()
# arr.frombytes() arr.tofile()
arr.typecode

```

内存视图 memoryview

memoryview.cast会把同一块内存中的内容打包成一个memoryview对象

```python
from array import array

numbers = array('h', [1, 2, 3])
memview = memoryview(numbers)
len(memview)

```

numPy 和 sicPy

多维数组和矩阵
```python
import numpy
a = numpy.arange(12)
a.shape
a.shape = 3,4
a[1]
a[:, 1]
a[1, 2]
a.transpose() # 矩阵转置
```

双向队列 collections.deque

列表可以模拟队列，append() 和 pop(0) 但是在列表开头增删元素是很耗时的，需要移动元素

双向队列是线程安全的数据结构，可以在两端快速增删元素, 删除中间的元素会稍微慢一些

```python
from collections import deque
dq = deque(range(10), maxlen=10)
dq.append(val)
dq.appendleft(val)
dq.rotate(n)
dq.extend(ls)
dq.extendleft(ls)
```

其他队列类型: Queue LifoQueue PriorityQueue
都是线程安全的，队列满，则会被锁住


multiprocessing.queue  multiprocessing.JoinableQueue

asyncio 提供了 Queue LifoQueue PriorityQueue JoinableQueue

heapq.heappush() heapq.heappop()

字典和集合

dict是python语言的基石 *模块命名空间* ,*实例属性* , *关键字参数*

REPL 查看内置函数 `__builtins__.__dict__`

字典和集合都依赖散列表算法

```python
from collections.abc import Mapping, MutableMapping
# 抽象基类
dir(Mapping)
dir(MutableMapping)
d = {}
isinstance(d, Mapping)

```

什么是可散列对象  
实现 `__hash__`和`__eq__`方法，并且两对象相等，散列值一定也要相等

原子数据类型都是可散列的(*hashable*): int float str bool bytes

frozenset也是可散列的, 元组不一定是可散列的

```python
# 能被 hash 方法调用而不报错，就认为是可散列的
hash(1)
hash('hi')
tt = (1, 2, ('a', 'b'))
hash(tt)
tl = (1, 2, ['a', 'b'])
hash(tl) # error
d = {}
hash(d) # error
l = []
hash(l) # error

type(l) == list # 获取对象的类型/构造函数
```

创建字典的不同方式
```python
# 字面量
lufy = {'name': 'lufy', 'age': 11}
# 构造函数
lufy2 = dict(name='lufy', age=11)
lufy3 = dict(zip(['name', 'age'], ['lufy', 11]))
lufy4 = dict([('name', 'lufy'), ('age', 11)])
lufy5 = dict(lufy)

lufy == lufy2 == lufy3 == lufy4 == lufy5 # True
id(lufy), id(lufy2) # 内存地址不同，但是却判断相等，所以是按值进行比较的, 字典具有相同的键值则认为相等

```

列表推导和生成器表达式的概念移植到字典，则有了字典推导

```python
lufy = {'name': 'lufy', age: 13}
# 遍历dict, 默认迭代器是keyIterator
# 等同 for v in lufy.keys():
for v in lufy:
  print(v) # name  age

students = [(12, 'alice'), (31, 'lucy')]
stuCodes = {student: code for code, student in students}

Upstuds = {code: stud.upper() for code, stud in students if code > 20}
```

其他的映射类型

```python
from collections import defaultdict, OrderedDict
role = {'name': 'lufy', age: 12}
home = role.get('home', 'little village')

```

字典处理键可能不存在的情况

```python
role = {'name': 'lufy', age: 12}
role.get('skill', 'strench')
role.setdefault('skill', 'strench')

# 映射的弹性键查询 defaultdict 或自定义dict子类实现__missing__
from collections import defaultdict
dd = defaultdict(list)
dd['good'] // []
dd['food'].append('apple')
dd['food'] // ['apple']

# collections.OrderedDisct
# collections.ChainMap
import builtins
pylookup = ChainMap(locals(), globals(), vars(builtins))


# collections.Counter
counter = collections.Counter('abcacdwdwos')
counter.most_common(2)

# collections.UserDict 让用户定义自己的dict类型的
# UserDict不是dict的子类，但是 UserDict的data属性的值是dict的子类

# 不可变映射类型 types.MappingProxyType
from types import MappingProxyType
d = {'name': 'lucy', 'age': 11}
dp = MappingProxyType(d) # dp 是视图，能观察到d的最新数据
dp['name'] # lucy
dp['name'] = 'lii' # error
d['skill'] = 'sing'
dp['skill'] # sing

```

集合  set frozenset

集合的作用是去重，很多对象的聚合，对象必须是可散列的(*hashable*)

set本身不可散列
fronzenset本身可散列

```python
s = set(['foo', 'bar', 'foo'])
hash(s) # error not hashable
fs = frozenset(['hi', 'wo'])
hash(fs) # id

s.add('hi')
s & fs # { 'hi' }
# 集合字面量
s2 = {'hi', 'some', 'cool'}
s3 = { 1 }
type(s2) # set
# 空集合
s4 = set()
d = {} # 创建的是空字典
# 方法
s2.add('go')
s2.pop()
s2.remove('cool')

# 反汇编
from dis import dis
dis('{1}')
dis('set([1])')

# 集合推导
myset = { c for c in 'hello' }

from collections import Set, MutableSet
dir(MutableSet)

```
散列表算法
- 散列表是一个稀疏数组(小于1/3空闲 则扩容)
- 表元(键值对对应一个表元，大小相同 可通过偏移访问)
- 对键求hash值，用hash值的最低几位作为散列表索引, 查找表元
- 没找到表元，抛出KeyError; 找到表元，则看表元的键是否等于查找的键，相等则返回表元的键值；若不相等，则发生散列冲突；对键的hash值，取更多的低位数重新查找
- 根据散列表的拥挤程度进行扩容，散列表增大，hash值所占位数和用作索引的位数也随之增大，以减少散列冲突的发生
- 所有用户自定义对象默认可散列，hash(yourObj) === id(yourObj)
- 散列表是稀疏数组，比较占空间，元组和具名元组会比较节约空间
- 键查询非常快，dict是典型的空间换时间，无视数据量大小的快速访问
- 通常地，键的顺序和添加的顺序一致
- 两个字典包含的键和键值相同，则认为它们相等 `{'a': 1, 'b': 2} == {'b': 2, 'a': 1}`
- 不要在遍历字典的同时修改字典

字典和集合的查找是高效的
字典和集合的键是无序的且不稳定的

```python
# keys() values() items() 方法返回的是字典视图, 视图具有动态性
d = {'name': 'Lili', 'age': 11}
keys = d.keys()
list(keys)
d['fav'] = 'smile'
list(keys)

```


文本和字节序列

> 人类使用文本，计算机使用字节序列

字符 码位和字节序列

python3中，str对象中获取到的元素是unicode字符
python2中，str对象中获取到的元素是字节序列

码位: 字符在编码表中对应的数值  (*编码表 = 字符编码*)

字符编码和解码

```python
s = 'hello'
b = s.encode('utf8') # 得到字节序列
len(b)
ns = b.decode('utf8') # 返回字符串
# python3的str类型 相当于python2的unicode类型
```

- bytes类型不可变
- bytearray类型可变

> bytes和bytearray对象的每个元素都是介于0-255之间的整数

```python
hibytes = bytes('hi', encoding='utf8')
hibytes[0] # 整数
hibytes[:1] # 切片还是bytes
hibarr = bytearray(hibytes)
hibarr[0] # 整数
hibarr[:1] # 切片还是bytearray

```

str对象的方法，能自动处理unicode的有:
- casefold
- isdecimal
- isidentifier
- isnumeric
- isprintable
- encode
  
str对象的方法，支持bytes和bytearray类型的有:
- upper
- endswith
- replace
- strip
  
memoryview  和 array.array

memoryview允许在二进制数据结构之间共享内存

struct模块，从二进制序列中提取结构化数据

```python
# 用 memoryview 和 struct 提取gif的宽高
import struct
fmt = '<3s3sHH'
with open('filter.gif', 'rb') as fp:
    img = memoryview(fp.read())
header = img[:10]
struct.unpack(fmt, header)
del header
del img

```

文本和字符编码

unicodedata.normalize函数可以将unicode规范化

str.casefold() 大小写折叠，把所有文本变成小写

> 一般地 str.lower() 和 str.casefold() 等价 但有的特殊字符例外

```python
from unicodedata import normalize

def nfc_equal(str1, str2):
    return normalize('NFC', str1) === normalize('NFC', str2)

def fold_equal(str1, str2):
    return normalize('NFC', str1).casefold() === normalize('NFC', str2).casefold()

```

unicode数据库，保存了码位和字符名称的映射关系，还有字符的元数据，如：isidentifier, isprintable,  isdecimal, isnumeric等方法都是依赖unicode数据实现的

unicodedata模块中用于获取元数据的方法:

- unicodedata.name()
- unicodedata.numeric()

双模式API,即函数可接受字符串或字节序列作为参数

把函数视作对象

函数视为一等对象

一等对象的定义:
- 运行时创建
- 能赋值给变量或数据结构的元素
- 能作为参数传给函数
- 能作为函数的返回值

int, float, str, dict等都是一等对象

```python
def factorial(n):
    '''return n!'''
    return 1 if n < 2 else factorial(n-1) * n

fact = factorial
fact(10)
mapObj = map(factorial, range(10))
list(mapObj)

```

高阶函数

接受函数作为参数，能返回函数的函数，如: map filter sorted

```python
roles = ['lufy', 'nami', 'robin', 'sange']
sorted(roles, key=len)
filter(lambda v: len(v) > 4, roles)
map(lambda v: len(v), roles)

def reverse(word):
    return word[::-1]

sorted(roles, key=reverse)

# 函数式编程最常见的高阶函数
# filter map reduce apply
# 不定量参数调用函数
# fn(*args, **kwargs)
# apply(fn, args, kwargs) # 不再使用
```

map 和 filter是内置函数，同样的效果用 列表推导或生成器表达式更方便

```python
def factorial(n)
    return 1 if n < 2 else factorial(n-1) * n

fact = factorial
list(map(fact, range(10)))
# 同上
[fact(n) for n in range(10)]
list(map(fact, filter(lambda n: n % 2, range(10))))
# 同上
[fact(n) for n in range(10) if n % 2]

```

> python3中map和filter返回生成器, python2中map和filter返回列表

> python3 reduce在functools模块中; python2 reduce是内置函数

```python
from functools import reduce
from operator import add
reduce(add, range(100))
sum(range(100))

all(iterable) # 所有元素都为真 则返回True
any(iterable) # 存在任何一个元素为真，则返回True

```

匿名函数： lambda函数
lambda函数的函数体只能是表达式

```python
roles = ['lufy', 'lili', 'alice']
sorted(roles, key=lambda w: w[::-1])

```

可调用对象

- 自定义函数  (使用def语句或lambda表达式创建)
- 内置函数 (len, print, list)
- 内置方法 (str.split)
- 自定义方法 (自定义类中的方法)
- 类 (调用类时执行 __new__ 和 __init__)
- 类的实例  (若类定义了 __call__ 方法，则实例也是可调用的)
- 生成器函数 (使用yield关键字)
  
判断对象是否可调用 `callable(obj)` 

```python
import random

class BingoCage:
    def __init__(self, items):
        self._items = list(items)
        random.shuffle(self._items)
    
    def pick(self):
        try:
            return self._items.pop()
        except IndexError:
            raise LookupError('pick from empty list!')

    def __call__(self):
        return self.pick()

cage = BingoCage(['one', 'two'])
print(callable(cage))
cage()
cage()

```
用实现 `__call__`方法的自定义类，创建函数对象，维护多次调用之间可访问的内部状态


闭包是创建持有内部状态的函数的另一种方式

函数运行时内省

dir(func)

```python
# 函数对象的属性
# __doc__
def hello(name):
    ''' a say hello fn '''
    print('hello', name)

hello.__doc__

hello.callCount = 1
hello.enable = True
hello.__dict__

dir(hello.__code__)
hello.__code__.co_name
hello.__code__.co_filename

# 函数特有的属性
class c: pass
obj = c()
def func(): pass
sorted(set(dir(func)) - set(dir(obj)))
# __annotations__ 
# __call__
# __closure__
# __code__
# __defaults__
# __get__
# __globals__
# __kwdefaults__
# __name__

```

函数十分灵活的入参

```python
def tag(name, *content, cls=None, **attrs):
    '''create html tag'''
    if cls is not None:
        attrs['class'] = cls
    if attrs:
        attr_str = ''.join(' %s=%s' % (attr, value) for attr, value in attrs.items())
    else:
        attr_str = ''
    
    if content:
        return '\n'.join('<%s%s>%s</%s>' % (name, attr_str, c, name) for c in content)
    else:
        return '<%s%s/>' % (name, attr_str)

print(tag('br'))
print(tag('p', 'hello'))
print(tag('p', 'hello', 'world'))
pront(tag('p', 'good', id='post', cls='good-post'))
```
仅限关键字参数

```python
def func(a, *, b):
    print(a, b)

func('lufy', b = 'good')

```

函数内省

```python
def foo(msg, size=10):
    pass

foo.__defaults__
foo.__kwdefaults__
foo.__name__
foo.__code__.co_varnames
foo.__code__.co_argcount
foo.__code__.co_name
foo.__code__.co_filename


# inspect 模块
from inspect import signature
sig = signature(clip) 
for name, param in sig.parameters.items():
    print(param.kind, ':', name, param.default)

# inspect.Paramter 包含属性: kind, name, default, annotation
# inspect.Signature.bind 方法 绑定实参
# inspect.BoundArguments 对象，有属性: arguments
```

python3 的函数注解

```python
def clip(text: str, max_len: 'int > 0' = 80) -> str:
    pass

# 注解表达式  str   'int > 0'
# 注解最常用的类型是 类(str, int) 和 字符串
```

支持函数式编程常用的包

operator 和 functools

```python
from functools import reduce
from operator import mul
def fact(n):
    return reduce(mul, range(1, n+1))


# operator itemgetter attrgetter
# itemgetter(1) 等价 lambda fields: fields[1]
from operator import itemgetter
data = [
    ('red', 'long'),
    ('green', 'short'),
    ('yellow', 'middle')
]
for color, hlen in sorted(data, key=itemgetter(1)):
    print(color, hlen)

# functools.partial 偏函数
# functools.partialmethod
# 偏函数，固定部分参数，返回需要更少参数的新函数

```

python中常用的高阶函数: map filter functools.reduce all any functools.partial mix max sorted


> lambda map filter reduce 最早出现在Lisp中，最早的一门函数式编程语言
> Haskell 同样是一门函数式编程语言，python从中借鉴了列表推导
> python 不支持尾递归优化
> python 不能算是一门函数式编程语言

用函数实现设计模式

用函数简化策略模式

> 策略模式，定义一系列算法并封装起来，且它们可以互相替代，(*电商场景，不同的促销策略 或者说 折扣优惠策略*)

命令模式

命令模式可以通过把函数作为参数传递而简化

> 命令模式的目的是解耦调用者和实现者

函数装饰器和闭包

装饰器是在源码中标记函数，以某种方式增强函数功能

装饰器是基于闭包实现的

nolocal关键字

> 闭包还是回调式异步编程和函数式编程的基础

简单装饰器和带参装饰器

装饰器基础知识
装饰器是可调用对象，它的参数是另一个函数(被装饰的函数)
装饰器可能做一些前后处理，直接返回被装饰函数；也可能返回一个全新的功能增强函数

```python
import time

def clock(func):
    def clocked(*args):
        t1 = time.perf_counter()
        result = func(*args)
        t2 = time.perf_counter()
        elapsed = t2 - t1
        name = func.__name__
        args_str = ', '.join(repr(arg) for arg in args)
        print('%0.8fs %s(%s) -> %s' % (elapsed, name, args_str, result))
        return result

    return clocked

@clock
def factorial(n):
    '''ji suan jiecheng'''
    return 1 if n < 2 else n * factorial(n - 1)

if __name__ == '__main__':
    factorial(11)


```

functools模块的装饰器有: lru_cache 和 singledispatch functools.wraps 

python内置的装饰器: property classmethod staticmethod

> python 也支持类装饰器

```python
@demoDecorate
def hello():
    pass
```
> 严格来说，装饰器是一个语法糖，把被装饰的函数传入，返回新的函数
> 装饰器在加载模块时，立即执行


@singledispatch 装饰的普通函数会变成泛函数（generic function） ：
根据第一个参数的类型， 以不同方式执行相同操作的一组函数

singledispatch 创建一个自定义的
htmlize.register 装饰器， 把多个函数绑在一起组成一个泛函数

@singledispatch 不是为了把 Java 的那种方法重载带入
Python。 在一个类中为同一个方法定义多个重载变体， 比在一个函
数中使用一长串 if/elif/elif/elif 块要更好。 但是这两种方案
都有缺陷， 因为它们让代码单元（类或函数） 承担的职责太
多。

```python
import numbers
from functools import singledispatch
import html
from collections import abc


@singledispatch
def htmlize(obj):
    content = html.escape(repr(obj))
    return '<pre>{}</pre>'.format(content)

@htmlize.register(str)
def _(text):
    content = html.escape(text).replace('\n', '<br/>\n')
    return '<p>{}</p>'.format(content)

@htmlize.register(numbers.Integral)
def _(n):
    return '<pre>{0}(0x{0:x})</pre>'.format(n)

@htmlize.register(tuple)
@htmlize.register(abc.MutableSequence)
def _(seq):
    inner = '</li>\n</li>'.join(htmlize(item) for item in seq)
    return '<ul><li>%s</li></ul>' % inner

if __name__ == '__main__':
    print(htmlize('hello'))
    print(htmlize(100))
    print(htmlize({'name': 'lufy'}))
    print(htmlize([{'name': 'lufy'}, 100, 'good']))


```

用装饰器工厂函数，参数化装饰器

```python
registry = set()

def register(active = True):
    def decorator(func):
        print('running register(%s) -> decorator(%s)' % (active, func))
        if active:
            registry.add(func)
        else:
            registry.discard(func)

        return func

    return decorator

@register(False)
def f1():
    print('running f1')

@register()
def f2():
    print('running f2')

@register(True)
def f3():
    print('running f3')

if __name__ == '__main__':
    print(registry)


```

若想真正理解装饰器， 需要区分导入时和运行时， 还要知道变量作用
域、 闭包和新增的 nonlocal 声明。 掌握闭包和 nonlocal 不仅对构建
装饰器有帮助， 还能协助你在构建 GUI 程序时面向事件编程， 或者使用
回调处理异步 I/O。

```python
def mkavg():
    count = 0
    total = 0

    def avg(val):
        # count += 1 # 等价于 count = count + 1 count会变为局部变量，count + 1 报错
        # total += val # 同上

        nonlocal count, total
        count += 1
        total += val

        return total / count

    return avg

# nonlocal 声明变量为自由变量, 应该根据作用域链去查找

if __name__ == '__main__':
    avg = mkavg()
    print(avg(10))
    print(avg(20))
    print(avg(30))


```

任何把函数当作一等对象的语言， 它的设计者都要面对一个问题：
作为一等对象的函数在某个作用域中定义， 但是可能会在其他作用
域中调用。 问题是， 如何计算自由变量？ 首先出现的最简单的处理
方式是使用“动态作用域”。 也就是说， 根据函数调用所在的环境计
算自由变量。

> 函数应该是黑盒， 把实现隐藏起来， 不让用户知道。 但是对动态作
用域来说， 如果函数使用自由变量， 程序员必须知道函数的内部细
节， 这样才能搭建正确运行所需的环境

如今， 词法作用域已成常态： 根据定义函数的环境计算自由变量。
词法作用域让人更难实现支持一等函数的语言， 因为需要支持闭
包。 不过， 词法作用域让代码更易于阅读。 Algol 之后出现的语言
大都使用词法作用域。


> 装饰器与它所装饰的组件接口一致， 因此它对使用该组件的客
户透明。 它将客户请求转发给该组件， 并且可能在转发前后执
行一些额外的操作（例如绘制一个边框） 。 透明性使得你可以
递归嵌套多个装饰器， 从而可以添加任意多的功能。

变量的作用域规则

```python
b = 10
def hi():
    a = 1
    print(a)
    print(b) # b是局部变量 因为下面有定义，这里报错了, 类似暂时性死区
    b = 2

def hi2():
    global b
    a = 1
    print(a)
    print(b) # ok
    b = 2

```

闭包是延申了作用域的函数，能访问函数外部定义的非全变量(*自由变量*)
```python
def mkavg():
    vals = []
    def avg(val):
        vals.append(val)
        total = sum(vals)
        return total/len(vals)

    return avg

if __name__ == '__main__':
    avg = mkavg()
    print(avg.__code__.co_vars)
    print(avg.__closure__)
    print(avg(10))
    print(avg(21))
    print(avg(33))

```

> 自由变量: 未在本地作用域中绑定的变量


## 对象引用、可变性和垃圾回收

引用和函数参数： 可变的参数默认值导致的问题， 以及如何安全地处理函数的调用者传入的可变参数


首先， 我们要抛弃变量是存储数据的盒子这一错误观念。
最好把它们理解为附加在对象上的标注。

因为变量只不过是标注， 所以无法阻止为对象贴上多个标注。 贴的多个
标注， 就是别名。

两个字典对象，键值对相同，则认为它们相等

每个变量都有标识、 类型和值。 对象一旦创建， 它的标识绝不会
变； 你可以把标识理解为对象在内存中的地址。 is 运算符比较两个
对象的标识； id() 函数返回对象标识的整数表示。

对象 ID 的真正意义在不同的实现中有所不同。 在 CPython 中， id() 返
回对象的内存地址， 但是在其他 Python 解释器中可能是别的值。 关键
是， ID 一定是唯一的数值标注， 而且在对象的生命周期中绝不会变

is 和 == 的异同

== 运算符比较两个对象的值（对象中保存的数据） ， 而 is 比较对象的
标识

通常， 我们关注的是值， 而不是标识， 因此 Python 代码中 == 出现的频
率比 is 高。

目前， 最常使用 is 检查变量绑定的值是不是 None

is 运算符比 == 速度快， 因为它不能重载， 所以 Python 不用寻找并调用
特殊方法， 而是直接比较两个整数 ID。 而 a == b 是语法糖， 等同于
a.__eq__(b)。 继承自 object 的 __eq__ 方法比较两个对象的 ID， 结
果与 is 一样。 但是多数内置类型使用更有意义的方式覆盖了 __eq__
方法， 会考虑对象属性的值。


元组的相对不可变性
元组与多数 Python 集合（列表、 字典、 集， 等等） 一样， 保存的是对象
的引用。 如果引用的元素是可变的， 即便元组本身不可变， 元素依然
可变。 也就是说， 元组的不可变性其实是指 tuple 数据结构的物理内容
（即保存的引用） 不可变， 与引用的对象无关

str、 bytes 和 array.array 等单一类型序列是扁平的， 它们保存的不是引用， 而是在连
续的内存中保存数据本身（字符、 字节和数字）

元组的值会随着引用的可变对象的变化而变。 元组中不可变的是元素的标识

默认做浅复制
复制列表（或多数内置的可变集合） 最简单的方式是使用内置的类型构造方法。

> python tutor 网站，可以动态显示执行过程

为任意对象做深复制和浅复制
浅复制没什么问题， 但有时我们需要的是深复制（即副本不共享内部对
象的引用） 。 copy 模块提供的 deepcopy 和 copy 函数能为任意对象做
深复制和浅复制。


函数的参数作为引用时
Python 唯一支持的参数传递模式是共享传参（call by sharing） 。 多数面
向对象语言都采用这一模式， 包括 Ruby、 Smalltalk 和 Java（Java 的引
用类型是这样， 基本类型按值传参）

共享传参指函数的各个形式参数获得实参中各个引用的副本。 也就是
说， 函数内部的形参是实参的别名。

```python
# myname = 'K' 
# myname = 1
myname = ['one','two']
print(id(myname))

# python 函数 形参 是 实参的别名，它们的id一样, 是同一个对象
def hello(user):
    print('hello', user, id(user))

hello(myname)

```


不要使用可变类型作为参数的默认值

```python
class Bus():
    # 可变数据类型作为参数默认值，会有问题
    def __init__(self, passengers=[]):
        self.passengers = passengers

    def pick(self, name):
        self.passengers.append(name)

    def drop(self, name):
        self.passengers.remove(name)


busA = Bus()
busB = Bus()
busA.pick('Lili')
busB.pick('Lucy')

print(busA.passengers, busB.passengers)

print(Bus.__init__.__defaults__)
print(Bus.__init__.__defaults__[0] is busB.passengers)

```

出现这个问题的根源是， 默认值在定义函数时计算（通
常在加载模块时） ， 因此默认值变成了函数对象的属性。 因此， 如果默
认值是可变对象， 而且修改了它的值， 那么后续的函数调用都会受到影
响

del和垃圾回收
对象绝不会自行销毁； 然而， 无法得到对象时， 可能会被当作垃圾
回收。

del 语句删除名称， 而不是对象。 del 命令可能会导致对象被当作垃圾
回收， 但是仅当删除的变量保存的是对象的最后一个引用， 或者无法得
到对象时。 重新绑定也可能会导致对象的引用数量归零， 导致对象被
销毁

有个 __del__ 特殊方法， 但是它不会销毁实例， 不应该在
代码中调用。 即将销毁实例时， Python 解释器会调用 __del__ 方
法， 给实例最后的机会， 释放外部资源。 自己编写的代码很少需要
实现 __del__ 代码， 有些 Python 新手会花时间实现， 但却吃力不
讨好， 因为 __del__ 很难用对。


在 CPython 中， 垃圾回收使用的主要算法是引用计数。 实际上， 每个对
象都会统计有多少引用指向自己。 当引用计数归零时， 对象立即就被销
毁： CPython 会在对象上调用 __del__ 方法（如果定义了） ， 然后释放
分配给对象的内存。 

CPython 2.0 增加了分代垃圾回收算法， 用于检测
引用循环中涉及的对象组——如果一组对象之间全是相互引用， 即使再
出色的引用方式也会导致组中的对象不可获取。

弱引用
正是因为有引用， 对象才会在内存中存在。 当对象的引用数量归零后，
垃圾回收程序会把对象销毁。 但是， 有时需要引用对象， 而不让对象存
在的时间超过所需时间。 这经常用在缓存中

弱引用不会增加对象的引用数量。

弱引用在缓存应用中很有用， 因为我们不想仅因为被缓存引用着而始终
保存缓存对象。

weakref.ref 实例获取所指对象。 如果对象
存在， 调用弱引用可以获取对象； 否则返回 None。

弱引用是可调用的对象， 返回的是被引用的对象； 如果
所指对象不存在了， 返回 None

```python
import weakref
s = {1, 2}
wref = weakref.ref(s)
print(wref())
s = 1
print(wref)
pint(wref())
```

weakref.ref 类其实是低层接口， 供高级用途使用， 多数程序最
好使用 weakref 集合和 finalize。 也就是说， 应该使用
WeakKeyDictionary、 WeakValueDictionary、 WeakSet 和
finalize（在内部使用弱引用） ， 不要自己动手创建并处理
weakref.ref 实例

```python
class Cheese():
    def __init__(self, kind):
        self.kind = kind

    def __repr__(self):
        return 'Cheese(%r)' % self.kind

import weakref
stock = weakref.WeakValueDictionary()
catalog = [Cheese('Cot'), Cheese('Dot'), Cheese('Eot')]

for cheese in catalog:
    stock[cheese.kind] = cheese

print('1------->', sorted(stock.keys()))
del catalog
print('2------->', sorted(stock.keys()))

del cheese
print('3------->', sorted(stock.keys()))


```

与 WeakValueDictionary 对应的是 WeakKeyDictionary， 后者的键
是弱引用。 

weakref 模块还提供了 WeakSet 类，
保存元素弱引用的集合类。 元素没有强引用时， 集合会把它
删除。 ”如果一个类需要知道所有实例， 一种好的方案是创建一个
WeakSet 类型的类属性， 保存实例的引用。 如果使用常规的 set， 实例
永远不会被垃圾回收， 因为类中有实例的强引用， 而类存在的时间与
Python 进程一样长， 除非显式删除类。


弱引用的局限
不是每个 Python 对象都可以作为弱引用的目标（或称所指对象） 。 基本
的 list 和 dict 实例不能作为所指对象， 但是它们的子类可以轻松地
解决这个问题：

```python
import weakref

colors = ['red', 'blue']
# wls = weakref.ref(colors) # error

class MyList(list):
    '''list sub class'''
    pass

myls = MyList(range(11))
wls = weakref.ref(myls)
print(wls)
```

int 和 tuple 实例不能作为弱引用的目标， 甚至它
们的子类也不行。
这些局限基本上是 CPython 的实现细节， 在其他 Python 解释器中情况可
能不一

对元组 t 来说， t[:] 不创建副本， 而是返回同一个对
象的引用。 此外， tuple(t) 获得的也是同一个元组的引用


如果两个变量指代的不可变对象具有相同的值（a == b 为 True） ， 实
际上它们指代的是副本还是同一个对象的别名基本没什么关系， 因为不
可变对象的值不会变， 但有一个例外。 这里说的例外是不可变的集合，
如元组和 frozenset： 如果不可变集合保存的是可变元素的引用， 那么
可变元素的值发生变化后， 不可变集合也会随之改变。 实际上， 这种情
况不是很常见。 不可变集合不变的是所含对象的标识。


变量保存的是引用， 这一点对 Python 编程有很多实际的影响。
简单的赋值不创建副本。
对 += 或 *= 所做的增量赋值来说， 如果左边的变量绑定的是不可变
对象， 会创建新对象； 如果是可变对象， 会就地修改。
为现有的变量赋予新值， 不会修改之前绑定的变量。 这叫重新绑
定： 现在变量绑定了其他对象。 如果变量是之前那个对象的最后一
个引用， 对象会被当作垃圾回

函数的参数以别名的形式传递， 这意味着， 函数可能会修改通过参
数传入的可变对象。 这一行为无法避免， 除非在本地创建副本， 或
者使用不可变对象（例如， 传入元组， 而不传入列表） 。


使用可变类型作为函数参数的默认值有危险， 因为如果就地修改了
参数， 默认值也就变了， 这会影响以后使用默认值的调用。


在“纯”函数式编程中， 所有数据都是不可变的， 如果为集合追加元
素， 那么其实会创建新的集合。 然而， Python 不是函数式语言， 更
别提纯不纯了


可变对象还是导致多线程编程难以处理的主要原因， 因为某个线程
改动对象后， 如果不正确地同步， 那就会损坏数据。 但是过度同步
又会导致死锁。

CPython 中的垃圾回收主要依靠引用计数， 这容易实现， 但是遇到
引用循环容易泄露内存， 因此 CPython 2.0（2000 年 10 月发布） 实
现了分代垃圾回收程序， 它能把引用循环中不可获取的对象销毁。
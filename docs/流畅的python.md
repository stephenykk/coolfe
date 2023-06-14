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

列表是线程安全的数据结构，可以在两端快速增删元素, 删除中间的元素会稍微慢一些

```python
from collection import deque
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


```
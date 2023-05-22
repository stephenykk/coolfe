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

列表 和 列表推导

> 列表推导是构建列表的强大方法

生成器表达式，惰性求值

```python
content='hello world'
codes = [ord(c) for c in content]

```


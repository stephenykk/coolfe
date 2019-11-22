python基础教程
===

[python教程 廖雪峰](https://www.liaoxuefeng.com/wiki/1016959663602400)

简介
---
python是一种简单优雅的脚本语言，包含非常完善的基础代码库, 覆盖网络、文件、GUI、 数据库、文本等, 除了内置库以外还有大量第三方库。

python的适用范围: 网络应用、脚本任务和其它自动化工具

安装
---
python是跨平台的，解释型的脚本语言(**似乎脚本语言都是解释型和跨平台的**)
python有2.x和3.x两个版本，较多的应用都是基于2.x开发的; 安装python就是安装python的解释器, 得到一个命令行交互环境.

- mac `brew install python3`
- ubuntu `sodu apt-get install python3`
- window 直接到官网下载对应安装包

安装后将python安装目录，添加到环境变量, 然后打开命令行，输入 python ， 进去交互环境

> 注意 windows用户在git bash下，输入python，不能进入到python交互环境

在命令行中输入 python 进入交互模式
```shell
    > python
    >>> print('hello world')
    >>> exit()
```

执行python脚本文件, 命令行下`python hello.py`

> 开始菜单可以找到python专用CLI

### python解释器
python代码文件以`.py`为后缀，由python解释器解释执行。

python有多种解释器:
- CPython 官方解释器，C语言开发的，所以叫CPython, 命令行下输入 python就是进入CPython解释器环境
- IPython  增强版的CPython
- PyPy 执行速度较快
- Jython 把python编译成java字节码执行
- IronPython  运行在.NET平台的pyton解释器

Hello World
---
可在命令行交互环境执行，或保存为hello.py文件

```shell    
    >python
    >>>print('hello world')
    >>>exit()

    >python hello.py

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
    print('nice', 'to', 'meet', 'you') #可打印多个字符串 同 console.log
    print('100+200=', 100+200) #逗号分隔的每个表达式间加空格
```

### 输入
```python
    name = input('input your name:') # 然后输入 'sindy' python3
    # name = raw_input('input your name:') # python2
    print(name) 
    

语法
---
python的语法比较简单:

- 用缩进表示代码块; 不用括号,花括号划分代码块
- 不用分号表示语句结束
- 标识符大小写敏感
- 声明变量不需要var等关键字

```python
    # print absolute value
    a = -120
    if a >= 0:
        print(a)
    else:
        print(-a)
    
```

### 数据类型和变量
python的数据类型包括: 整数、浮点数、字符串、字节型、布尔值、空值、列表、字典和自定义类型

```python
    1, 100, -80, 0xfa #整数    
    1.23 1.23e9, 1.2e-5 #浮点数
    
    #字符串 单双引号互相包含
    "what's your name"
    'I\'m "OK"'  
    
    # raw string 都做普通字符对待
    r'\the-school\n'  
    
    # 三引号 可输出换回字符串
    '''line1,
    line2''' 

    r'''line one \n \t
    will not escape
    '''
    
    #字节型
    b'ABC'  
    len('abc') # 3
    b'hello'.decode('ascii') 
    len(b'good') #4
    
    #布尔值
    True False
    # 逻辑运算符
    # and or not

    #空值
    None 
    
    # 条件判断
    if age >= 18:
      print('adult')
    else:
      print('teenager')
```

python是弱类型(动态类型)语言

```python
    a = 100 #整数
    print(a)
    a = 'hello' #字符串
    print(a)
```
python中常量习惯用全大些字母表示, 如 `PI=3.1415`, 并非真正意义的常量(**同JS**)

python的两种除法：
```python
    print(10 / 3) #3.33.. 普通除法 结果为浮点数
    print(10 // 3) #3 整除(有小数 则向下取整) 结果为整数
    print(20 / 3)
    print(20 // 3) #6
    print(9 / 3) #3.0 /除法计算结果是浮点数，即使是两个整数恰好整除，结果也是浮点数：

    print(10 % 3) #1 模运算，取余数
```

python的整数和浮点数没有大小限制

### 字符串和编码

#### 字符编码
因为计算机只能处理数字，如果要处理文本，就必须先把文本转换为数字才能处理。最早的计算机在设计时采用8个比特（bit）作为一个字节（byte）

- ASCII 1个字节，最大255
> 由于计算机是美国人发明的，因此，最早只有127个字符被编码到计算机里，也就是大小写英文字母、数字和一些符号，这个编码表被称为ASCII编码，比如大写字母A的编码是65，小写字母z的编码是122
- GB2312
> 处理中文显然一个字节是不够的，至少需要两个字节，而且还不能和ASCII编码冲突，所以，中国制定了GB2312编码，用来把中文编进去
- Unicode 最常用的是用两个字节表示一个字符（如果要用到非常偏僻的字符，就需要4个字节）
> 全世界有上百种语言，日本把日文编到Shift_JIS里，韩国把韩文编到Euc-kr里，各国有各国的标准，就会不可避免地出现冲突，结果就是，在多语言混合的文本中，显示出来会有乱码  因此，Unicode应运而生。Unicode把所有语言都统一到一套编码里，这样就不会再有乱码问题了

- UTF-8 用于存储和传输 英文1个字节 中文3个字节
> 统一成Unicode编码，解决了乱码问题；但是，如果你写的文本基本上全部是英文的话，用Unicode编码比ASCII编码需要多一倍的存储空间，在存储和传输上就十分不划算。所以，本着节约的精神，又出现了把Unicode编码转化为“可变长编码”的UTF-8编码。UTF-8编码把一个Unicode字符根据不同的数字大小编码成1-6个字节，常用的英文字母被编码成1个字节，汉字通常是3个字节，只有很生僻的字符才会被编码成4-6个字节。如果你要传输的文本包含大量英文字符，用UTF-8编码就能节省空间：

在计算机内存中，统一使用Unicode编码，当需要保存到硬盘或者需要传输的时候，就转换为UTF-8编码。

用记事本编辑的时候，从文件读取的UTF-8字符被转换为Unicode字符到内存里，编辑完成后，保存的时候再把Unicode转换为UTF-8保存到文件

![字符编码工作方式](https://www.liaoxuefeng.com/files/attachments/923923787018816/0)

浏览网页的时候，服务器会把动态生成的Unicode内容转换为UTF-8再传输到浏览器, 所以你看到很多网页的源码上会有类似`<meta charset="UTF-8" />`的信息，表示该网页正是用的UTF-8编码。  

![字符编码工作方式2](https://static.liaoxuefeng.com/files/attachments/923923759189600/0)


#### Python的字符串
在最新的Python 3版本中，字符串是以Unicode编码的，也就是说，Python的字符串支持多语言

```python
    print('包含中文的str')
    print(ord('A')) #字符对应的编码
    print(chr(66)) #编码对应的字符
    # 知道字符的编码，可用十六进制 输出字符
    print('\u4e2d\u6587')
```

由于Python的字符串，在内存中以Unicode表示，一个字符对应若干个字节。如果要在网络上传输，或者保存到磁盘上，就需要把str变为以字节为单位的bytes

> 用带b前缀的单引号或双引号表示`bytes`类型

```python
strVal = 'Hello'
byteVal = b'Hello' # bytes的每个字符都只占用一个字节。
```

以Unicode表示的str通过encode()方法可以编码为指定的bytes
```python
    print('ABC'.encode('ascii')) # b'ABC'
    print('中文'.encode('utf-8')) # b'\xe4\xb8\xad\xe6\x96\x87'
    '中文'.encode('ascii') # 报错 中文不能编码为ascii的bytes
```

反过来，如果我们从网络或磁盘上读取了字节流，那么读到的数据就是bytes。要把bytes变为str，就需要用decode()方法：

```python
>>> b'ABC'.decode('ascii')
'ABC'
>>> b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8')
'中文'
>>> b'\xe4\xb8\xad\xff'.decode('utf-8', errors='ignore') # 忽略错误的字节

```

len()函数计算的是str的字符数，不是字符串占用的字节数，如果换成bytes，len()函数就计算字节数

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

> 可见，1个中文字符经过UTF-8编码后通常会占用3个字节，而1个英文字符只占用1个字节

由于Python源代码也是一个文本文件，所以，当你的源代码中包含中文的时候，在保存源代码时，就需要务必指定保存为UTF-8编码。当Python解释器读取源代码时，为了让它按UTF-8编码读取，我们通常在文件开头写上这两行：

```python
    #!/usr/bin/env python3  ## 告诉Linux/OS X系统，这是一个Python可执行程序，Windows系统会忽略这个注释；

    # -*- coding: utf-8 -*-  ## 告诉Python解释器，按照UTF-8编码读取源代码
```


格式化字符串
`%s`表示用字符串替换，`%d`表示用整数替换，有几个`%?`占位符，后面就跟几个变量或者值，顺序要对应好。如果只有一个`%?`，括号可以省略。

> 在Python中，采用的格式化方式和C语言是一致的，用%实现

常见的占位符有：

占位符 | 替换内容
----- | -------
%d | 整数
%f | 浮点数
%s | 字符串
%x | 十六进制整数

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



    
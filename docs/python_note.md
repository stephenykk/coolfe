python基础教程 (from 廖雪峰)
=============

简介
---
python是一种简单优雅的脚本语言，包含非常完善的基础代码库, 覆盖网络，文件，GUI, 数据库，文本等, 除了内置库以外还有大量第三方库。

python的适用范围: 网络应用、脚本任务和其它自动化工具

安装
---
python是跨平台的，解释型的脚本语言(**貌似脚本语言都是解释型的，都是跨平台的**)
python有2.x和3.x两个版本，较多的应用都是基于2.x开发的; 安装python就是安装python的解释器, 得到一个命令行交互环境.

- mac `brew install python3`
- ubuntu `sodu apt-get install python3`
- window 直接到官网下载对应安装包

安装后将python安装目录，添加到环境变量, 然后打开命令行，输入 python ， 进去交互环境

    > python
    >>> print('hello world')
    >>> exit()


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
可以执行在命令行交互环境执行，或解释hello.py文件
    
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


### 输出

    print('hello python')
    print('nice', 'to', 'meet', 'you') #可打印多个字符串 同 console.log
    print('100+200=', 100+200) #计算逗号分开的每个表达式

### 输入

    >>>name = input('input your name please:') # 然后输入 'sindy'
    >>>name # 'sindy'
    >>>name2 = raw_input("what's your name:") # 然后输入 sindy
    >>>name2 # 'sindy'

语法
---
python的语法比较简单，采用缩进表示代码块(**不用括号,花括号划分代码块,也不用分号表示语句结束**)

    # print absolute value
    a = -120
    if a>= 0:
        print(a)
    else:
        <print>
            <-a></-a>
        </print>

> 注意： python是大小写敏感的

### 数据类型和变量
python的数据类型包括: 整数、浮点数、字符串、字节型、布尔值、空值、列表、字典和自定义类型

    1, 100, -80, 0xfa #整数    
    1.23 1.23e9, 1.2e-5 #浮点数
    "what's your name" 'I\'m \"OK\"'  r'\the-school\n' '''line1, line2''' #字符串
    b'ABC'  b'hello'.decode('ascii') #字节型
    len('abc') len(b'good') #3

    True False 3>2  True or False  not True #布尔值
    None #空值
    # 条件判断
    if age >= 18:
      print('adult')
    else:
      print('teenager')

python是弱类型(动态类型)语言

    a = 100 #整数
    print(a)
    a = 'hello' #字符串
    print(a)

python中常量习惯用全大些字母表示, 如 `PI=3.1415`, 并非真正意义的常量(**同JS**)

python的两种除法：

    >>>10 / 3 #普通除法 结果为浮点数
    >>>10 // 3 #地板除 结果为整数

python的整数和浮点数没有大小限制

### 字符串和编码
- ASCII 1个字节，最大255
- GB2312
- Unicode 常用2个字节表示1个字符
- UTF-8 用于存储和传输 英文1个字节 中文3个字节

> 计算机内存中，统一使用unicode, 当需要存储或传输时，转换为utf-8

    >>> ord('A') #字符对应的编码
    >>> chr(66) #编码对应的字符
  
声明py源文件的编码类型

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-

格式化输出
    
    # %d 整数 %f浮点数 %
    'Hello, %s' % 'world'
    'Hi %s, you have $%d' % （'sindy', 1000)

    >>>(growth rate: %d %%)
    
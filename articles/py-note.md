# python 学习

## 基础

-   数据类型

    -   内置数据类型

        -   `str`
        -   `int`
        -   `bool` 只有 `True` `False` 两个值
        -   `None` _不是方法_ 与 `True` , `False` 一样
        -   `list`
        -   `tuple`
        -   `dict`

    -   强制类型转换
        -   `int(input('...'))`
        -   `str(100)`
        -   `bool(val)`
        -   `list('hello'); list(range(10))`
        -   `tuple('hello'); tuple(range(10))`
        -   `...`

-   注释

    -   单行注释
        -   `# 独立一行注释`
        -   `print('hello') # 行尾注释`
    -   多行注释 三引号

-   输入输出

    -   输出 `print(msg) # 支持占位符 %s %d`
    -   输入 `val = input(msg)`

-   运算符

    -   `%` 取余
    -   `**` 乘方
    -   `**` 1/n 开方 eg: `9 ** 0.5` (注意：结果为 `float`)
    -   复合运算符 `a = 10; a += 1`
    -   算术运算符 `+ - * / // %`
    -   关系运算符 `> >= < <= == !=`
    -   逻辑运算符 `and or not`
    -   赋值运算符 `= += ...`

-   流程控制

    -   顺序  
        从上到下执行每条语句
    -   分支
        -   假值  
            `'',[],(),{},0,None`  
            空字符串/空列表/空字典/空元组 都为假值
        -   三元运算: `maxvalue = a if a > b else b`
        -   单分支 `if tiaoJian: ...`
        -   双分支 `if tiaoJian: ... else: ...`
        -   多分支 `if tiaojian: ... elif tiaoJian2: ... else: ...`
        -   多条件 `if name.startswith('pan') and age < 14: ...`
        -   嵌套 `if`
    -   循环

        -   `while` 条件循环
            -   普通条件循环: `while tiaoJian: ...`
            -   无限循环, 循环体内特定条件跳出 `while True: ... break`
        -   `for` 固定次数循环 / 列表遍历
            -   `for item in ls: ...`
        -   循环中断
            -   `break` 结束循环
            -   `continue` 结束本次循环，立即进入下次循环
        -   循环嵌套 / 多重循环
        -   列表推导:

            -   列表推导可以映射和过滤
            -   映射得到新列表 `[表达式 for v in 序列]`
            -   如: `[ n * 2 for n in range(1, 10) ]`
            -   过滤并映射得到新列表: `[ 表达式 for v in 序列 if 表达式 ]`
            -   如: `[n * 2 for n in range(1, 10) if n % 2 == 1]`

-   常用数据类型和方法:  
    创建 / 增加 / 删除 / 读取 / 修改

    -   全局方法

        -   `eval(strVal) ` 去掉引号把里面的值当做程序跑, 如: `eval('print("hello")')`
        -   `len(ls)`
        -   `max(ls)`
        -   `min(ls)`
        -   `isinstance(val,kind)` instance = 实例

    -   **list**  
        创建列表:

        -   字面量语法:  
            `ls = ['hello', 'yang']`
        -   构造函数语法:  
            `ls = list('happy')`  
            `ls = list(range(10))`
        -   `ls[index] ` 访问元素
        -   `ls[start:end:step] ` 提取片段
        -   `ls[index] = newVal ` 修改元素
        -   `ls.append(val) ` 追加元素
        -   `ls.insert(i, val) ` 在指定位置插入元素
        -   `ls.remove(value) ` 根据值删除元素
        -   `ls.pop(index = -1) ` 根据索引删除元素, 默认删除末尾元素
        -   `ls.copy() a[:] ` 复制列表
        -   `ls.reverse() ` 反序
        -   `ls.sort([key]) ` 排序
        -   `ls.index(value) ` 获取元素在列表中的索引值
        -   列表元素可以修改，元组不可以

    -   **tuple**  
        创建元组:

        -   字面量语法:  
            `tup = (1, 'good')`  
            `tup = ('one', )  ` 创建单元素元组 末尾加`,`  
            `tup = () ` 创建空元组
        -   构造函数语法:  
            `tup = tuple('hello')`  
            `tup = tuple(range(10))`
        -   `tup[index] ` 读取元素
        -   `tup[start:end:step] ` 提取片段
        -   元组的元素不可修改，元素是复合数据类型(`list`, `dict` 等)除外

    -   **dict**  
        创建字典:
        -   字面量语法:  
             `lufy = {'name': 'lufy', 'age': 11}`
        -   构造函数语法:  
             `lufy = dict(name='lufy', age=11)`  
             `alice = dict([('name', 'alice'), ('age', 10)])`
        *   `obj = {} ` 创建空对象
        *   `obj[key] ` 读取指定字段的值
        *   `obj.get(key, defaultValue) ` 读取指定字段的值,无该字段则返回默认值
        *   `obj['ban'] = 702 ` 修改字段的值
        *   `obj.pop(key) ` 删除字典指定字段
        *   `del obj[key] ` 删除字典指定字段
        *   `obj.keys() ` 获得所有字段
        *   `obj.values() ` 获得所有值
        *   `obj.items() ` 获得所有键值对 keys,values

-   包

    -   常用包
        -   `sys`
        -   `random`
    -   `import random` 导入整个模块
    -   `from random import randint ` 导入模块的指定成员(函数 / 变量 / 类)
    -   `sys.exit()` 提前退出程序

-   查看帮助

    -   `dir(obj)` 查看有什么方法
    -   `help(obj.fn)` 查看某个方法怎么用

-   函数

    -   常用 `python` 内置函数
        -   `isinstance(val,type) -> return bool ` 判断类型，返回布尔值
        -   `type(value) ` 返回类型
    -   定义
        ```
        def fn_name(argument1, argument2, ...):
            pass
        ```
    -   调用
        ```
        fn_name(v1, v2)
        ```
    -   局部变量
        -   函数内部为局部作用域，函数内部声明的变量都在局部作用域中，所以它们又称为局部变量
        -   函数内部声明的变量: `a = v`
    -   全局变量
        -   一个 python 文件即为一个模块
        -   模块最顶层为全局作用域, 模块顶层声明的变量都在模块的全局作用域中, 所以它们称为全局变量
        -   模块最顶层定义的变量为全局变量
        -   函数内若要修改全局变量 需要先声明它是全局的 `global color`
        -   读取全局变量, 如在函数内执行: `print(a)` 若函数内没有局部变量 `a`, 则到全局作用域去找全局变量 `a`
    -   返回值
        -   `return value`
        -   函数内部无 `return` 语句; 则自动隐式 `return None`
    -   异常捕获 `try...catch`
        ```
        try:
            pass
        catch Exception:
            pass
        ```
    -   主动抛出异常 `raise`

        ```
        function main():
           value = input('what is your age')
           if not isinstance(value, int):
               raise Exception('your input is not integer')

        ```

-   时间日期

    -   获取当前时间戳
        -   `time.time()`
    -   获取时间元组对象
        -   `timeTup = time.localtime(shijianchuo = time.time() )`
        -   `timeTup.tm_year` (得到年)
        -   `time.strftime(format,[tuple])` f=format 时间元组格式化指定格式的字符串（元组默认为当前时间）
        -   `time.strptime(string,format)` p=parse 字符串解析时间元组

-   文件操作

    -   读文件/文件夹

        -   打开文件
        -   `f = open(filePath, mode, encoding='utf8') # mode=r | w | a | rb | wb | ab | r+ | w+ | a+`
        -   读取文件 `f.read([size])` / `f.readline()` / `f.readlines()`
        -   关闭文件 `f.close()`

    -   写文件和创建文件夹
        -   `f = open(filePath, 'w', encoding='utf8')`
        -   `f.write(strVal)` / `f.writelines(ls)`
        -   `f.close()`

-   递归

    -   自己调自己
    -   特殊条件退出, 肯定要有退出条件;不然就是无限调用自己(死循环)

-   编程范式
    -   面向过程 ( `if`, `for` )
    -   面向对象 ( `class`, `object` )
    -   面向函数 ( `func` )

---

实践:

-   [使用 while 循环模拟用户登录](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.videopod.episodes&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=35)
-   [嵌套循环打印长方形和三角形](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.videopod.episodes&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=36)
-   [嵌套循环打印菱形和空心菱形](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.videopod.episodes&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=37)

总结:

-   [第四章总结](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.videopod.episodes&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=40)

知识测试:

-   [第四章习题讲解](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.player.switch&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=41)

---

第五章: 复合数据类型

[教程](https://www.bilibili.com/video/BV1wD4y1o7AS?spm_id_from=333.788.videopod.episodes&vd_source=c0d24f82cee0462f6dcd3d66abcfaa96&p=42)

## 序列

序列就是一组有序的值/元素

序列常用的操作:

-   遍历 `for`
-   读写元素 `seq[index]`
-   获取长度 `len(seq)`
-   排序 `sorted(seq)`
-   获取最大/小值 `max(seq) min(seq)`
-   提取片段 `seq[start:end:step]`

## 列表

## 元组

## 字典

## 集合

---

第六章: 字符串

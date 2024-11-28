# Python 入门功法之语言基础

## 简介

Python 是一门简单又强大的编程语言，所以它现在非常流行，尤其是在 AI 和机器学习越来越备受关注的当下。学点 Python，对于需要了解编程概念的新手或需要拓展自身技能的其他语言的程序员都是不错的选择。

**简单**  
毕竟 Python 的作者龟叔是研究 ABC 语言出身的，其设计的 Python 语言在易读和简洁方面，确实是其他语言所罕见的。Python 语言的关键字基本都采用简写，在能表达其含义的前提下，能简则简， 比如 `str` ， `dict`， `del`， `sys`; 语法也十分好懂，有点接近自然语言了，如下代码片段可以感受一二

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

以上是笔者基于自身浅薄实践，对 Python 语言的一些直观体会。接下来会介绍 Python 的基础知识，如果以下的知识你都掌握，那么可以说你已经会用 Python 了。

> BTW: 笔者有时候会有和很多新手朋友一样的疑问，到底掌握到什么程度，自己才算学会一门语言呢? :)
> 我觉得学会基本语法，常用方法和常用模块，能够完成简单程序，这样就是学会了。  
>  当然，学会和精通之间还有很大一段差距，理解底层原理和最佳实践，才能算得上精通，这需要时间的积累。

## 语法

-   用缩进表示代码块
-   标识符大小写敏感
-   变量不用提前声明

```python
# 严格缩进表示代码块
if not age > 18:
    print("hello, teenager")
else:
    print('hello, adult')


# 大小写敏感
color = 'blue'
Color = 'pink'

print(color, 'is not same as', Color)


```

# 教你看懂Git的Graph图_git graph怎么看-CSDN博客

> 原文地址[教你看懂Git的Graph图_git graph怎么看-CSDN博客](https://blog.csdn.net/hao_yan_bing/article/details/121982541)

### 前言

在我们常见的Git客户端（[Sourcetree](https://so.csdn.net/so/search?q=Sourcetree&spm=1001.2101.3001.7020)、TortoiseGit等）都会展示Git的Graph图，类似于下图。不知道大家是不是跟我一样，虽然使用Git多年了，但是看不太懂Git的Graph图。最近阅读了下《Pro Git》这本书，对Git的理解又深入了一步。其实只要理解了Git的原理，看懂Graph图就很简单了。下面我会分别向大家介绍Git中重要的两个概念：Git提交对象和Git分支。

![image-20211215151040993](https://i-blog.csdnimg.cn/blog_migrate/96cdb1702c5020c5a5bf26c6b2abeaf2.png)

### Git提交对象

> Git 保存的不是文件的变化或者差异，而是一系列不同时刻的 **快照** 。
> 
> 在进行提交操作时，Git 会保存一个提交对象（commit object）。 知道了 Git 保存数据的方式，我们可以很自然的想到——该提交对象会包含一个指向暂存内容快照的指针。 但不仅仅是这样，该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。 首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象， 而由多个分支合并产生的提交对象有多个父对象。

上面一段话摘自《Pro Git》。

对于每一次提交都会保存一个提交对象（commit object），该提交对象指向了一个内容快照的指针。简单的理解就是，每次提交Git都把当前文件的内容保存了下来类似一个“备份”（但Git做了很多优化，并不是简单的备份），然后生成一个提交对象指向该“备份”。

### Git分支

理解了Git的提交对象，我们再来看下Git分支。有人把 Git 的分支模型称为它的“必杀技特性”，也正因为这一特性，使得 Git 从众多版本控制系统中脱颖而出。

Git分支其实就是一个指针，指向了一个提交对象，所以在Git中创建指针非常轻量级，可以在瞬间完成。

![image-20211215155131682](https://i-blog.csdnimg.cn/blog_migrate/9c75829ff0c2a53d711c20161323d64c.png)

上图是一个简单的提交历史示意图，一共有三个提交对象。还有两个分支testing和master，两个分支都指向了最新的一次提交记录。HEAD是一个特殊的指针，指向当前所在的本地分支。

当我们执行`git checkout testing`切换到testing分支时，HEAD就会指向testing。

![image-20211215155243342](https://i-blog.csdnimg.cn/blog_migrate/b96cbb601d281dd6834d56b2290711a8.png)

当我们在testing分支上做了一些修改并提交时。

![image-20211215155358678](https://i-blog.csdnimg.cn/blog_migrate/df915d25c72c911c99c8b2b5d5784135.png)

这个时候testing分支与master分支指向不同的提交对象，testing分支往前移动了，master分支却没有。

同样，我们也可以切换到master分支上做一些修改并提交，这样两个分支就出现了分叉。

![image-20211215155600314](https://i-blog.csdnimg.cn/blog_migrate/e20174c8bf49753b8421da2f5a6428e1.png)

其实，把上面的这些示意图，按照从下往上的方向画，并把提交对象按时间的先后排序，就是我们我们看到的Graph图。图中的点就是一个提交对象或者叫一次提交记录。但是不能简单的理解不同的线就代表不同的分支，对Git分支本质的定义应该是：一个指向某一系列提交之首的指针或引用。

### 总结

本文对Git的提交对象和Git分支做了简单的介绍，理解了Git的这两个核心概念，就能很容易的看懂Graph图了。但是本文对于某些概念没有做深入讲解，比如快照、提交对象，有兴趣的同学可以看看《Pro Git》中“Git内部原理”的那一章节。

### 参考文档

-   [《Pro Git》](https://git-scm.com/book/zh/v2)
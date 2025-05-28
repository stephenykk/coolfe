# vimdiff notes

[vimdiff 入门教程](https://www.jianshu.com/p/5e359ac7d609)  
[使用vimdiff作为git mergetool](https://juejin.cn/post/7351300787648921619)


```bash
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false

```

完成这些设置后，当运行 git mergetool 命令来解决合并冲突时，Git 将自动使用 vimdiff 来打开有冲突的文件。
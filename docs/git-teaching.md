git教程
================

git clone
-------------

  //支持协议 http(s)://, ssh://, git://, file:///, ftp(s)://, rsync://
  git clone remote_repo <local_dir>?
  
  //git clone [user@]example.com:path/to/repo.git
  git clone git@github.com:stephenykk/test.git

  git clone -o jq https://github.com/jquery/jquery.git

git remote
------------

  git remote //=> jq
  git remote -v
  git remote add origin repo_url
  git remote rm origin
  git remote rename origin newOrigin

git fetch
-------------

  git fetch  //默认会取回所有分支的更新 所取回的更新，在本地主机上要用"远程主机名/分支名"的形式读取。比如origin主机的master，就要用origin/master读取

  git fetch <remote_repo> <branch_name> //只取回指定分支的更新
  git fetch origin master

  git checkout -b newBranch origin/master //在取回的远程分支(origin/master)的基础上， 创建分支

git merge
----------
  git merge origin/master
  git rebase origin/master //合并 orgin/master到当前分支

git branch
-----------
  git branch -r //查看远程分支
  git branch -a //查看所有分支(包括远程和本地)

git pull
----------
  
  git pull <远程主机名> <远程分支>:<本地分支>
  git pull origin next:master //比如，取回origin主机的next分支，与本地的master分支合并

  git pull origin next //取回origin/next分支，再与当前分支合并。
  //等价于
  git fetch origin next
  git merge origin/next


在某些场合，Git会自动在本地分支与远程分支之间，建立一种追踪关系（tracking）。比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动"追踪"origin/master分支。

Git也允许手动建立追踪关系。

  git branch --set-upstream master origin/next  //指定master分支追踪origin/next分支。

如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。

  git pull origin  //会pull所有有追踪关系的分支吧？

如果当前分支只有一个追踪分支，连远程主机名都可以省略。

  git pull

如果合并需要采用rebase模式，可以使用--rebase选项。

  git pull --rebase <远程主机名> <远程分支>:<本地分支>

  加上参数 -p 就会在本地删除远程已经删除的分支。
  git pull -p
  #等价于
  git fetch --prune origin
  git fetch -p

  git push <远程主机名> <本地分支>:<远程分支>

  如果省略远程分支名，则表示将本地分支推送与之存在"追踪关系"的远程分支（通常两者同名），如果该远程分支不存在，则会被新建。
  git push origin master

  如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。
  git push origin :master
  #等同于
  git push origin --delete master

  如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。
  git push origin

  如果当前分支只有一个追踪分支，那么主机名都可以省略。
  git push

  git push -u origin master //令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了


  不带任何参数的git push，默认只推送当前分支，这叫做simple方式。此外，还有一种matching方式，会推送所有有对应的远程分支的本地分支。


  $ git config --global push.default matching
  # 或者
  $ git config --global push.default simple


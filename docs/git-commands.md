git 常用命令
===================

git checkout
---------

  #基于远程分支在本地新建分支，并切换到新分支  当不成功时，说明本地repo还不能感知到该远程分支, git remote update  ,  git update 更新一下跟踪信息
  git checkout -b local_name origin/remote_name 

  #作用是checkout远程的dev分支，在本地起名为dev分支，并切换到本地的dev分支
  git checkout -b dev origin/dev，

  #切换到mater分支
  git checkout master 

  #但是，需要注意的是，如果该文件已经 add 到暂存队列中，上面的命令就不灵光喽 需要先让这个文件取消暂存
  #index -> working directory
  git checkout -- + 需要恢复的文件名

  git checkout -- <file> # 抛弃工作区修改
  git checkout . # 抛弃工作区修改

git reset
------------
恢复文件示例:   
repo->index->working directory

  #repo -> index 取消文件暂存
  git reset HEAD -- + 需要取消暂存的文件名

  然后再使用第一条命令。
  如果感觉命令多了记不住，那就做一两个别名呗，比如：

  git config --global alias.unstage 'reset HEAD --'
  git config --global alias.restore 'checkout --'

  我们拿 README.md 这个文件举例，比如修改了一段文字描述，想恢复回原来的样子：

  git restore README.md

  即可，如果修改已经被 git add README.md 放入暂存队列，那就要

  git unstage README.md
  git restore README.md

reset的其他用法
  
  #撤销working tree的修改
  #HEAD, index和working tree都重置为最后一次commit的状态
  git reset --hard HEAD 

  #撤销staged状态
  #index tree回退到最后一次commit的状态
  git reset HEAD 

  #从本地仓库恢复到暂存区
  git reset <file> 
  git reset -- .


git branch
-----

+ git branch #列出本地分支
+ git branch -r #查看所有远程分支
+ git branch -a #查看所有分支 包括远端仓库的分支
+ git branch -a -v #查看本地和远端仓库的所有分支，并显示最后一次提交
+ git branch new_branch
+ git branch -d merged_branch
+ git branch -D unmerged_branch

git clone 
----------

  #clone 远端仓库的某个分支
  git clone -b <branch> <remote_repo> 

  #clone远端仓库的dev分支到本地 
  git clone -b dev git@github.com:stephenykk/test.git 


git diff
----------
  #分支比较
  git diff <branch1>..<branch2> 

  #比较两次提交的差异 仅列出文件名
  git diff HEAD HEAD^ --name-only 

  #比较两个分支，某文件夹下的差异
  git diff <branch1>..<branch2> --name-only -- folderA 

  git diff <file> # 比较当前文件和暂存区文件差异 git diff

  git diff <id1> <id2> # 比较两次提交之间的差异

  git diff <branch1>..<branch2> # 在两个分支之间比较

  git diff --staged # 比较暂存区和版本库差异

  git diff --cached # 比较暂存区和版本库差异

  git diff --stat # 仅仅比较统计信息

git remote 
----------
  
  #显示远端仓库的详细信息(fetchUrl pushUrl, branches, "local branches configured for 'git pull'" , "local refs configured for 'git push' ")
  git remote show origin 

  git remote -v #查看远端仓库的配置信息
  git remote update

git fetch
-----------
  
  #把远程分支取回本地分支中
  git fetch origin remote_branch_name:local_branch_name 

git push
-----------

  git push #推送所有分支到远端

  #只推送 当前分支 到 远端对应分支
  git push origin localBranchName:remoteBranchName

config and help
------------
  git help <command> # 显示command的help
  cat -n .git/config

git log
----------

  git log --since="1 day ago" #查看1天前到现在的提交日志
  git log -- somefile.html #查看某文件的更新历史
  git log -p -- somefile.html #某文件明细更新历史
  git log -1 -p -- somefile.html #查看某文件上次的修改内容
  git log -- f1.html f2.html
  git log -- folder/ 
  git log -3 dev #查看dev分支最近3次的提交日志
  git log v1.0.. #查看v1.0后的提交日志

  git log <file> # 查看该文件每次提交记录

  git log -p <file> # 查看每次详细修改内容的diff

  git log -p -2 # 查看最近两次详细修改内容的diff

  git log --stat #查看提交统计信息


git commit
-----------
  
  #一些文件在本地修改后，不希望commit到远端仓库，可以这样
  git commit -m "commit part of changes" -- folderName_or_fileName

  git commit --amend # 修改最后一次提交记录

git show
------------

  git show # 显示某次提交的内容 git show $id


git add
----------

  git add <file> # 将工作文件修改提交到本地暂存区

  git add . # 将所有修改过的工作文件提交暂存区


git rm
----------

  git rm <file> # 从版本库中删除文件

  git rm <file> --cached # 从版本库中删除文件，但不删除文件


git revert
-----------

  git revert <commitid> # 恢复某次提交的状态，恢复动作本身也创建次提交对象

  git revert HEAD # 恢复最后一次提交的状态



Git 本地分支管理
=====================

查看、切换、创建和删除分支
------------------------

  git branch -r # 查看远程分支

  git branch <new_branch> # 创建新的分支

  git branch -v # 查看各个分支最后提交信息

  git branch --merged # 查看已经被合并到当前分支的分支

  git branch --no-merged # 查看尚未被合并到当前分支的分支

  git checkout <branch> # 切换到某个分支

  git checkout -b <new_branch> # 创建新的分支，并且切换过去

  git checkout -b <new_branch> <branch> # 基于branch创建新的new_branch

  git checkout $id # 把某次历史提交记录checkout出来，但无分支信息，切换到其他分支会自动删除

  git checkout $id -b <new_branch> # 把某次历史提交记录checkout出来，创建成一个分支

  git branch -d <branch> # 删除某个分支

  git branch -D <branch> # 强制删除某个分支 (未被合并的分支被删除的时候需要强制)

分支合并和rebase
-----------------

  git merge <branch> # 将branch分支合并到当前分支

  git merge origin/master --no-ff # 不要Fast-Foward合并，这样可以生成merge提交

  git rebase master <branch> # 将master rebase到branch，相当于： git checkout <branch> && git rebase master && git checkout master && git merge <branch>

Git暂存管理
------------

  git stash # 暂存

  git stash list # 列所有stash

  git stash apply # 恢复暂存的内容

  git stash drop # 删除暂存区

Git远程分支管理
-----------------

git pull # 抓取远程仓库所有分支更新并合并到本地

git pull --no-ff # 抓取远程仓库所有分支更新并合并到本地，不要快进合并

git fetch origin # 抓取远程仓库更新

git merge origin/master # 将远程主分支合并到本地当前分支

git checkout --track origin/branch # 跟踪某个远程分支创建相应的本地分支

git checkout -b <local_branch> origin/<remote_branch> # 基于远程分支创建本地分支，功能同上

git push # push所有分支

git push origin master # 将本地主分支推到远程主分支

git push -u origin master # 将本地主分支推到远程(如无远程主分支则创建，用于初始化远程仓库)

git push origin <local_branch> # 创建远程分支， origin是远程仓库名

git push origin <local_branch>:<remote_branch> # 创建远程分支

git push origin :<remote_branch> #先删除本地分支(git branch -d <branch>)，然后再push删除远程分支

Git远程仓库管理
-----------------------

git remote -v # 查看远程服务器地址和仓库名称

git remote show origin # 查看远程服务器仓库状态

git remote add origin git@ github:robbin/robbin_site.git # 添加远程仓库地址

git remote set-url origin git@ github.com:robbin/robbin_site.git # 设置远程仓库地址(用于修改远程仓库地址) 

git remote rm <repository> # 删除远程仓库

创建远程仓库
--------------
  git clone --bare robbin_site robbin_site.git # 用带版本的项目创建纯版本仓库

  mkdir robbin_site.git && cd robbin_site.git && git --bare init # 在服务器创建纯仓库

  git remote add origin git@ github.com:robbin/robbin_site.git # 设置远程仓库地址

  git push -u origin master # 客户端首次提交

  git push -u origin develop # 首次将本地develop分支提交到远程develop分支，并且track

  git remote set-head origin master # 设置远程仓库的HEAD指向master分支

  也可以命令设置跟踪远程库和本地库

  git branch --set-upstream master origin/master

  git branch --set-upstream develop origin/develop
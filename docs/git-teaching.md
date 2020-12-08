# git 教程

[常用 Git 命令清单 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

## git init

```bash
    git init # 在当前目录初始化git仓库
    git init <project_name> # 新建文件夹，并初始化git仓库
```

## git config

git 有三级配置文件，分别为:

- local 项目文件夹/.git/config
- system /etc/gitconfig
- global ~/.gitconfig

> local 配置的内容优先级最高, 显示配置列表或编辑配置时，可指定配置文件级别(如: git config -l --global)

```bash
# 显示当前的Git配置
git config --list

# 编辑Git配置文件
git config -e (--global|--system|--local)

# 设置提交代码时的用户信息
git config user.name "your name" # 同 git config --add user.name  "your name"
git config user.email "your email"

git config --add user.name "jie"
git config --get user.name
git config --get-all user.name
git config --unset user.name


# 推送设置
# 不带任何参数的git push，默认只推送当前分支，这叫做simple方式。
# 此外，还有一种matching方式，会推送所有有对应的远程分支的本地分支。
git config --global push.default matching
git config --global push.default simple


#git 如何实现vimdiff
git config --global diff.tool vimdiff
git config --global difftool.prompt false
# git 命令别名
git config --global alias.d difftool

# 然后使用 git d 打开对比代码，然后用 :wq 继续比较下一个文件。
git d hashid


```

## git clone

```bash
    # 支持协议 http(s)://, ssh://, git://, file:///, ftp(s)://, rsync://
    git clone remote_repo <local_dir>?

    # git clone [user@]example.com:path/to/repo.git
    git clone git@github.com:stephenykk/test.git

    # -o 远程仓库命名为jq 默认 origin
    git clone -o jq https://github.com/jquery/jquery.git
```

## ssh key

```bash
    # 生成秘钥对
    ssh-keygen -t rsa -C "yourname@example.com"

    # 添加公钥到github后台后，验证秘钥可用
    ssh -T git@github.com
```

## git remote

```bash
    git remote # 查看远程仓库名称列表
    git remote -v # 查看远程仓库名称和url
    git remote add origin repo_url # 添加远程仓库
    git remote rm origin # 删除远程仓库
    git remote rename origin newOrigin # 重命名
    git remote show origin # 显示origin仓库的详细信息 本地分支和远程分支的追踪关系

    # 删除一个远程链接
    git remote rm origin [url]
    git remote remove origin [url]

    # 修改远程仓库地址
    git remote set-url origin [url]
```

## git fetch

```bash
    # 默认会取回所有分支的更新 所取回的更新，
    # 在本地主机上要用"远程主机名/分支名"的形式读取。
    # 比如origin主机的master，就要用origin/master读取
    git fetch

    # 只取回指定分支的更新
    # git fetch <remote_repo> <branch_name>
    git fetch origin master

    # 删除远程分支已删除的分支
    git fetch --prune origin
    git fetch -p
```

## git checkout

```bash
    # 基于当前分支创建新分支
    git checkout -b newBranch

    # 基于远程分支(origin/master)创建新分支
    # 基于远程分支创建的分支都会自动追踪远程分支
    # git remote show origin 查看追踪关系
    git checkout -b newBranch origin/master

    # 切换到上一个分支
    git checkout -

    # 切换分支
    git checkout <branch_name>

    # 恢复暂存区的所有文件到工作区
    git checkout .

    # 恢复暂存区的指定文件到工作区
    git checkout [file]

    # 恢复某个commit的指定文件到暂存区和工作区
    git checkout [commit] [file]

    # 新建一个与远程分支同名的分支，并切换到该分支
    git checkout --track [branch-name]
    git checkout --track origin/dev
```

## git add

```bash
    # 添加指定文件到暂存区
    git add [file1] [file2] ...

    # 添加指定目录到暂存区，包括子目录
    git add [dir]

    # 添加当前目录的所有文件到暂存区
    git add .

    # 添加每个变化前，都会要求确认
    # 对于同一个文件的多处变化，可以实现分次提交
    git add -p

```

## git commit

```bash
    # 提交暂存区到仓库区
    git commit -m [message]

    # 提交暂存区的指定文件到仓库区
    git commit [file1] [file2] ... -m [message]

    # 提交工作区自上次commit之后的变化，直接到仓库区
    git commit -a

    # 提交时显示所有diff信息
    git commit -v

    # 使用一次新的commit，替代上一次提交
    # 如果代码没有任何新变化，则用来改写上一次commit的提交信息
    git commit --amend -m [message]

    # 重做上一次commit，并包括指定文件的新变化
    git commit --amend [file1] [file2] ...

    # 修改author
    git commit --amend --author pan <stephenykk@163.com>

```

## git mv

```bash
    # 改名文件，并且将这个改名放入暂存区
    git mv [file-original] [file-renamed]

```

## git rm

```bash

    # 删除工作区文件，并且将这次删除放入暂存区
    git rm [file1] [file2] ...

    # 停止追踪指定文件，但该文件会保留在工作区
    git rm --cached [file]

```

## git log

```bash
    git log -2 # 显示最近2次的提交
    git log -p # 显示提交和修改的内容
    git log --stat # 显示提交的统计信息
    git log --graph # 图形化显示提交日志
    git log --oneline # 一行显示简化的提交信息

    git log --since "1 day ago" # 最近1天的提交

    git log -3 --name-only # 最近3次提交改了哪些文件

    # 显示所有提交过的用户，按提交次数排序
    git shortlog -sn

    # 搜索历史提交的内容
    # 返回提交的文件内容包含关键词的提交记录
    git log -S [keyword]
    # 查询某段代码，是什么时候提交上来的 很实用呀~
    git log -S "console.log('kkmm')"

    # 搜索历史提交的注释
    git  log  --grep  [keyword]
    git  log  --grep  [keyword] --author yangxyi@kuaiji.com

    # 显示指定文件的每行内容是什么人在什么时间修改过
    git blame [file]

    # 显示在分支2而不在分支1中的提交
    git log [分支1]..[分支2]
    git log ^[分支1] [分支2]
    git log [分支2] --not [分支1]
```

## git diff

```bash
    # 显示暂存区和工作区的差异
    git diff

    # 显示暂存区和上一个commit的差异
    git diff --cached [file]

    # 显示工作区与当前分支最新commit之间的差异
    git diff HEAD

    # 显示两次提交之间的差异
    git diff [first-branch]...[second-branch]

    # 显示今天你写了多少行代码
    git diff --shortstat "@{0 day ago}"

    # 显示某次提交的元数据和内容变化
    git show [commit]

    # 显示某次提交发生变化的文件
    git show --name-only [commit]

    # 显示某次提交后，某个文件的内容
    git show [commit]:[filename]

    # 显示操作历史
    git reflog
```

## git merge

```bash
    git merge origin/master
    git rebase origin/master # 合并 orgin/master到当前分支
    git merge dev # 合并dev分支到当前分支
    git mergetool # 若有冲突，用mergetool(如 vimdiff)解决
    # :diffget 2  # 当前差异点 采用buffer2的版本
```

## git branch

```bash
    git branch # 查看本地分支(仅分支名)
    git branch -v # 查看本地分支(分支名 + 最新提交)
    git branch -vv # 查看本地分支(分支名 + 最新提交 + 上游分支)
    git branch -r # 查看远程分支
    git branch -a # 查看所有分支(包括远程和本地)

    git branch <new_branch> # 基于当前分支创建新分支
    git branch [branch] [commit] # 新建一个分支，指向指定commit
    git branch -d <branch_name> # 删除已合并分支
    git branch -D <branch_name> # 强制删除分支 即使是未合并的
    git branch (-m | -M) [<oldbranch>] <newbranch> # 重命名分支

    # 列出所有已经合并到当前分支的分支
    git branch --merged

    # 列出所有还没有合并到当前分支的分支
    git branch --no-merged

    # 删除远程分支
    # 仅在本地仓库删除 git pull还是会拉回来
    git branch -dr origin/test

    # 新建一个分支，与指定的远程分支建立追踪关系
    git branch --track [branch] [remote-branch]

    # 建立追踪关系
    git branch (--set-upstream-to=<upstream> | -u <upstream>) [<branchname>]

    # 手动建立追踪关系
    # 不指定分支的话，则默认为当前分支建立追踪关系
    # git branch --set-upstream-to=origin/{branch} <local_branch>?
    # git remote show origin 可查看效果
    # 本地master分支追踪origin/next远程分支
    git branch --set-upstream-to=origin/next master
    git branch -u origin/next master # 同上 简短选项名

    # 找出包含指定 tag/commit 的分支
    git branch --contains tags/<tag>
    git branch --contains< commit> 
```

## git pull

```bash
    # git pull <远程主机名> <远程分支>:<本地分支>
    # 取回origin主机的next分支，与本地的master分支合并
    git pull origin next:master

    # 取回origin/next分支，再与当前分支合并
    # 注意是和当前分支合并，不是和本地的next分支
    git pull origin next

    # 上面等价于
    git fetch origin next
    git merge origin/next

    # 在某些场合，git会自动在本地分支与远程分支之间，建立一种追踪关系（tracking）。
    # 比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系

    # git也允许手动建立追踪关系。见 git push, git branch


    # 如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。
    git pull origin


    # 如果当前分支只有一个追踪分支，连远程主机名都可以省略。
    git pull

    # 如果合并需要采用rebase模式，可以使用--rebase选项。
    git pull --rebase <远程主机名> <远程分支>:<本地分支>

    # 加上参数 -p 就会在本地删除远程已经删除的分支。 同 git fetch -p
    git pull -p

```

## git submodule

```bash
    git submodule add https://github.com/chaconinc/DbConnector

```

## git push

```bash
    # 推送的同时，建立追踪关系
    git push -u origin master:next
    # 本地master分支推送到远程仓库master分支，并建立追踪关系
    git push -u origin master

    # 推送分支
    git push <远程主机名> <本地分支>:<远程分支>

    # 如果省略远程分支名，则表示将本地分支推送与之存在"追踪关系"的远程分支（通常两者同名），如果该远程分支不存在，则会被新建。
    git push origin master

    # 删除远程分支
    # 如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。
    git push origin :master
    git push --delete origin  master

    # 如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略。
    git push origin

    # 如果当前分支只有一个追踪分支，那么主机名都可以省略。
    git push

    # 强行推送当前分支到远程仓库，即使有冲突
    git push [remote] --force

    # 推送所有分支到远程仓库
    git push [remote] --all

```

## git tag

```bash
    # 列出所有tag
    git tag
    git tag (-l | --list)

    # 列出tag,并显示3行commit msg
    git tag -n3

    # 新建一个tag在当前commit
    git tag [tag]

    # 新建一个tag在指定commit
    git tag [tag] [commit]

    # 删除本地tag
    git tag -d [tag]

    # 删除远程tag
    git push origin :refs/tags/[tagName]

    # 查看tag信息
    git show [tag]

    # 提交指定tag
    git push [remote] [tag]

    # 提交所有tag
    git push [remote] --tags

    # 新建一个分支，指向某个tag
    git checkout -b [branch] [tag]

```

## git reset

```bash

    # 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
    git reset [file]

    # 重置暂存区与工作区，与上一次commit保持一致
    git reset --hard

    # 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
    git reset [commit]

    # 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
    git reset --hard [commit]

    # 重置当前HEAD为指定commit，但保持暂存区和工作区不变
    git reset --keep [commit]


```

## git revert

```bash
    # 新建一个commit，用来撤销指定commit
    # 后者的所有变化都将被前者抵消，并且应用到当前分支
    git revert [commit]
```

## git stash

```bash
    # 暂时将未提交的变化移除，稍后再移入
    git stash
    git stash pop

    # 查看stash列表
    git stash list
    # 同 git stash pop
    git stash apply stash@{0}

    # 删除stash@{2}的存储
    git stash drop stash@{2}

```

## git clean

```bash
    # 移除工作目录中所有未跟踪的文件及目录，
    # 默认不会移除.gitiignore忽略的文件

    # 仅查看将被清理的内容
    git clean -dn

    # 执行清理
    git clean -df
```

## git grep

```bash
# 搜索你工作目录的文件，输出包含关键字的文件名和关键字所在行号
$ git grep -n [关键字]

# 搜索你工作目录的文件，输出包含关键字的文件名和关键字匹配次数
$ git grep --count [关键字]

```

### 如何加速国内 Github 访问

[如何加速国内 Github 访问](https://www.jianshu.com/p/66facbd8926a) _好像有点作用_

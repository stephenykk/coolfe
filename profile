
# ssh port
myserver="124.223.215.179"


# git
alias gp="git pull origin"
alias gpp="git pull origin && git push origin"
alias gco="git checkout"
alias gcp="git cherry-pick"
alias gs="git status"
alias gb="git branch"
alias gcm="git commit -m"
alias gcma="git add . && git commit -am"
alias ga="git add"
alias gl="git log"
alias gm='git merge'
alias glol='git log --oneline'
alias glmol='git log --author=pan --oneline'

# cmp build
alias autoall='autolib dev && autolib uat'


function upsrm() {
	if [ "${#@}" -lt 1 ]; then
		echo usage: upsrm dev / uat 
		return 1
	fi

	tag="$1"
	wkgys
	pnpm install $srmpkg@$tag -w
}

function nuptobuild() {
	nwksrm
	mgfrombuild
	mgtobuild
	gco feat-panzj
}



function uplib() {
	if [ ${#@} -lt 1 ]; then
		echo "usage: uplib {tag:dev,uat}"
		return 1
	fi

	wkgys
        tag="$1"
	pnpm install ${srmpkg}@${tag} -w
}

function cplib() {
	usage 1 ${#@} "cplib <dev | uat | master>" || return 1

        libBranch="$1"

	env="${libBranch}"
	if [ "${libBranch}" = "dev" ]; then
		env="sit"
	elif [ "$libBranch" = "master" ]; then
		env="prod"
	fi

	wk
	targetDir='../gys-external-srm/lib/'
	mkdir -p $targetDir
	rm -rf ${targetDir}*	
	ls -a ${targetDir}	
	echo '::: clear done'


	cd  $targetDir
	cd ..

	
	gco $libBranch
	echo "::: checkout to branch $libBranch done"

  	wk 
	prefix="./projects/yth-srm/lib/${env}/"

	echo "::: copying files from ${prefix}"


	isAll="yes"
	if [ "$isAll" ]; then
		cp -r ${prefix}/*  ${targetDir}	
	else

             ls $prefix | grep -vE "/$" | grep -vE  "[0-9]+\.js$" | grep -v "html" | xargs -i   -exec cp -r ${prefix}/{} ${targetDir}	
        fi

	echo '::: copy done' 
	# ls -a ${targetDir}

	pksrm

	gcma "更新lib文件"
	newVersion=`bash ./upversion.sh`
	npm version $newVersion

	echo "::: update version to $newVersion done!"

	gpp

	echo "::: push changes done!"
}


function mytest() {
	wksrm
	dt=`date +%Y-%m-%dT%H:%M:%S`
	newVersion="$1"
	sed -i "/SRM_VERSION/s/'[^\']*'/'${newVersion}@RTIME:${dt}'/" ./src/index.js 
	grep SRM_VERSION ./src/index.js
}

function mgtest() {
	mydev
	cd git-lm
	gco dev
	gm --no-edit master
	if [ "$?" -gt 0 ]; then
		echo 合并分支遇到冲突, 已撤销合并
		gm --abort
		return 1
	fi

	echo merge done!
}


function mymblib() {

	wksrm
        gcomain && gp
	gcoall && gp
	gcoboth

	gm --no-edit $brmain

	gm --no-edit $brall

	gcomy && gp

	gm --no-edit $brboth

	gpp


	gl -12 --oneline

}

function usage() {
	local expectArgs="$1"
	local actualArgs="$2"
	local msg="$3"
	if [ $actualArgs -lt $expectArgs ]; then
		echo "args: ${@}"
		echoln "usage: $msg"
		return 1
	fi
}


function checkoutBranch() {
	local branch="$1"
	git branch | grep $branch > /dev/null
	if [ $? -gt 0 ]; then
		echoln "检出分支 $branch ..."
		git remote update
		git checkout --track origin/$branch
		if [ $? -gt 0 ]; then
			echoln "检出失败，分支 $branch 不存在，请检查拼写"
			return 1
		else
			echoln "成功检出分支 $branch"
		fi
	else	

	        git checkout $branch
	        
	        git pull --no-edit
	        if [ $? -gt 0 ]; then
	        	echoln "拉取 $branch 分支代码发生冲突!!, 取消操作, 请手动同步"
	        	return 1
	        else
			echoln "成功切换到分支 $branch , 并拉取最新代码"
		fi
	fi

}


function pullAndPushBranch() {
	local branch="$1"
	git checkout $branch
	git pull --no-edit
	if [ $? -gt 0 ]; then
		echoln "$branch 分支拉取最新代码冲突, 回退操作"
		return 1
	fi
	git push
}


function showlog() {
	echo "<br/></br>"
	
	git log -30 --oneline | grep -v "保存构建版本" | grep -v "Merge branch"

	echo "<br/></br>"
}


function echoln() {
	echo -e "\n $1 \n"
}

function mergeBranch() {
	usage 2 ${#@} "mergeBranch <fromBranch> <toBranch>" || return 1

	local fromBranch="$1"
	local toBranch="$2"
	
	git checkout $toBranch
	git merge $fromBranch --no-edit

	if [ $? -gt 0 ]; then
		echoln "$fromBranch 合并到 $toBranch 发生冲突，撤销合并"
		git merge --abort
		return 1
	fi

	echoln "成功合并分支 $fromBranch -->  $toBranch !"
}



function mblib() {
	usage 2 ${#@} "mblib <fromBranch> <toBranch>" || return 1

	wksrm
	gco .

	# gcomy
	
	local fromBranch="$1"
	local toBranch="$2"
	
	checkoutBranch $fromBranch || return 1
	checkoutBranch $toBranch || return 1


	mergeBranch $fromBranch $toBranch || return 1


	pullAndPushBranch $toBranch || return 1

	showlog
}


function mblibdev() {
       usage 1 ${#@} "mblibdev <branch>" || return 1

       local branch="$1"
       mblib "$branch" $brmy 
}

function mblibprod() {
	usage 1 ${#@} "mblibprod <branch>" || return 1

	local branch="$1"
	mblib $branch $brrelease 
}


function cfix() {
	usage 1 ${#@} "cfix <sit | uat>" || return 1
	gwk

	local branch="$1"
	local fixBranch="${1}-conflict-panzj"

	checkoutBranch $branch || return 1
	checkoutBranch $fixBranch || return 1

	mergeBranch $branch $fixBranch || return 1

	pullAndPushBranch $fixBranch || return 1

	echo "同步成功! $branch --> $fixBranch "
}

function mupsit() {
	mwksrm

	gco sit
	gp
	gb -D msit

	git fetch upstream sit
	gco -b msit upstream/sit

	rm -rf projects/yth-co projects/yth-integration
	gcma "chord: 同步源仓库sit修改, 去掉其他子应用"
	gpp
        
	gco sit
	gm msit --no-edit

        git pull --no-edit
	git push

}



function mgtosit() {
	if [ ${#@} -lt 1 ]; then
		echo usage: mgtosit {branch}
		return 1
	fi

	branch="$1"
	git pull --no-edit
	gco sit
	git pull --no-edit
	git merge $branch --no-edit
	git push
}


function fixok() {
	usage 1 ${#@} "fixok <sit | uat>" || return 1

	local branch="$1"
	local fixBranch="${1}-conflict-panzj"

	checkoutBranch $fixBranch || return 1
	checkoutBranch $branch || return 1

	mergeBranch $fixBranch $branch || return 1


	pullAndPushBranch $branch || return 1


	echo "同步分支成功! 修复冲突,  $fixBranch --> $branch"

}

function pullib() {
	usage 1 ${#@} "pullib <dev | prod>"

	local env="$1"
	local branch=""
	if [ "$env" = "dev" ]; then
		branch="$brmy"
	else
		branch="$brrelease"
	fi

	wksrm

	git checkout .
	git checkout $branch 
	git pull --no-edit

	if [ $? -gt 0 ]; then
		echoln "拉取分支 $branch 发生冲突，回退pull操作"
		git merge --abort
		return 1
	fi

	echoln "同步分支 ${branch} 最新提交成功!"

	showlog
}


function autolib() {
	usage 2 ${#@} "autolib <fromBranch> <dev | uat | master>" || return 1

	local fromBranch="$1"
        local libBranch="$2"
	if [ "$fromBranch" != "noneed" ]; then
	    if [ $libBranch = 'dev' -o $libBranch = 'uat' ]; then
	    	mblibdev $fromBranch || return 1
	    else
	    	mblibprod $fromBranch || return 1	
	    fi
        else
	    if [ $libBranch = 'dev' -o $libBranch = 'uat' ]; then
	    	pullib dev || return 1
	    else
	    	pullib prod || return 1	
	    fi

	    echoln "没有输入分支，默认已手动完成合并，不需要合并操作!"
	fi


	mklib $libBranch && cplib $libBranch && pblib $libBranch && taglib

}


function mklib() {
	usage 1 ${#@} "mklib <dev | uat | master>" || return 1 

	local libBranch="$1"
	local tag="$libBranch"

	if [ "$libBranch" = "master" ]; then
		tag="latest"
        fi	

        echo "::: 当前分支是: $libBranch"	
	echo "::: gys-external-cost 已设置为externals依赖"

	pksrm

	
	git checkout $libBranch
	echo "::: checkout to branch $libBranch done"


	local newVersion=`bash upversion.sh`	
	echo "::: new version is $newVersion"

	wksrm

	local dt=`date +%Y-%m-%dT%H:%M:%S`
	sed -i "/SRM_VERSION/s/'[^\']*'/'${newVersion}@RTIME${dt}'/" ./src/index.js
	grep "SRM_VERSION" ./src/index.js

	echo "::: version inject done"
        
	local env="${libBranch}"
	if [ "${libBranch}" = "dev" ]; then
		env="sit"
	elif [ "${libBranch}" = "master" ]; then
		env="prod"
	fi

	prefix="./lib/${env}/"
	rm -rf "${prefix}/*"
	echo "::: clear old files done!"


	if [ "$env" = "dev" -o "$env" = "sit" ]; then
		cmd="lib:sit"
		echo "打包前，切换到分支 $brmy"
		git checkout $brmy
	elif [ "$env" = "uat" ]; then
		cmd="lib:uat"
		echo "打包前，切换到分支 $brmy"
		git checkout $brmy
	else
		cmd="lib:prod"
		echo "打包前，切换到分支 $brrelease"
		git checkout $brrelease
	fi

	echo "::: run cmd $cmd"
	
        
	yarn $cmd	

}

function dotp() {
	. ~/.profile
}

function vimp() {
	vim ~/.profile
}


function pblib() {
	usage 1 ${#@} "pblib <dev | uat | master>" || return 1


	echo registry:  `npm get registry`
	echo user: `npm whoami`

	# read -p '确认继续发布吗？[y/n]: '  answer
	answer='y'

	if [ "$answer" != "y" ]; then
		echo 88
		return 2
	fi

	local branch="$1"
	local tag="$branch"
	
	if [ "$branch" = "master" ]; then
		tag='latest'
	fi

	pksrm
	echo "::: 切换分支到 ${branch}"
	gco $branch

	echo "::: 开始发布 ${tag} 版本"
	local cmd="npm publish --tag ${tag}"

	echo "::: cmd is: ${cmd}"
	npm publish --tag $tag
        if [ $? -ne 0 ]; then
		echo "::: 发布失败"
	else
		echo "::: 发布完成"
		npm info $srmpkg
	fi


}


function taglib() {


	echo "::: 准备给构建分支打tag"

	wksrm
	
	gtag=`grep "const SRM_VERSION" src/index.js | sed "1s/^[a-z A-Z_=\']*//" | sed "1s/'//g" | sed "1s/@.*//"`
	echo $gtag 

	gcma "release: 保存构建版本"
	git tag $gtag
	
	echo "::: 完成打tag"

	# git tag  | head -5

	echo "::: 推送tag到远端"

	git push origin --tags

}


function downpkg() {

	if [ ${#@} -lt 2 ]; then
		echo "usage: downpkg name version"
		return 1
	fi

	pkhome

	local name="$1"
	local version="$2"
	local fname="${name}-${version}.tgz"
	local dname=`echo $fname | sed "1s/\.tgz//"`
	echo $dname
	ls $dname >& /dev/null

	if [ $? -gt 0 ]; then
		mkdir $dname
	fi


	local baseUrl="https://npm.countrygarden.com.cn/${name}/-/"
	local url="${baseUrl}${fname}"
	
	echo "::: downloading: $url"

	curl -o $fname $url 
	tar -xvzf $fname -C $dname
	code $dname
}

function testtime() {
	t1=`date +%s`
	sleep ${1:-10}
	t2=`date +%s`
	echo "执行时间为: $(expr $t2 - $t1)秒"
}

function mylog() {
        # gwksrm	
	git log --author pan --since "`date +%Y-%m-%d` 0:0:0" --oneline | grep -vi "merge\|release" | sed "s/^[0-9a-zA-Z :]\{1,\}//g"
}

function gpnew() {
	if [ -n $1 ]; then
		local branch="$1"
	else
		local branch=$(git rev-parse --abbrev-ref HEAD)
	fi

	git push -u origin $branch:$branch

}


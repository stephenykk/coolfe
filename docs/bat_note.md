批处理基础教程
===

注释
---
`rem`, `::` 只支持单行注释

    :: this is comment
    echo hello :: some comment  不支持这种行尾注释

    :: 如果没有 echo off, 下面的注释会直接在终端打印出来，如果 echo off 则效果同 :: 
    rem this is comment too
    REM 这是注释，为了让地球人看懂

@
---
抑制本行的输出

    :: 不显示 echo 语句，只显示 echo 语句的执行结果
    @ECHO OFF       


逻辑和比较运算符
---
`EXIST`, `NOT`, `==`

    REM 判断文件是否存在
    IF EXIST example.txt ECHO found it
    IF NOT EXIST example.exe ECHO not found it
    IF 2 == 2 ECHO TRUE

命令组合
---
`&&` 和 `||` , 类似js的短路径操作(**a&&b**  **a||b**)
`&` 类似js的 `,` 运算符 (**2,1**   **1,2**)

    REM 组合命令和js的短路径操作类似
    DIR example.txt && ECHO found it too

    REM 最简单的组合命令, 类似js的逗号运算符, 组合多条语句
    ECHO hello & ECHO world!

    DIR foo.ttt & DIR foo.txt || ECHO can see me
    DIR foo.txt & DIR foo.ttt || ECHO can not see me


重定向
---
输出重定向：`>`, `>>` , `|`   
输入重定向: `<`

    ECHO hello > hi.txt
    REM 追加方式到处内容到文件
    ECHO not bad day >> exmple.txt
    
    REM |(前一个命令的输出 作为后一个命令的输入) more 一屏一屏的显示后面的内容 Enter 1行， 空格 1屏
    help | more

    more doc.txt
    more < doc.txt


打印文件内容
---
`type`

    type longArticle.txt

调用其他批处理
---
`call test.bat` 可以将功能模块化, 然后互相调用，通过 `%1`, `%2`, `...` 等形式接受入参

    REM call命令 从1个批处理调用另1个批处理 且接受入参
    call hi.bat sindy

    :: hi.bat
    echo hello, %1

提供选择项
---

REM choice命令 提示用户输入1个字母进行选择 它的返回码为 1234

CHOICE /C abc /M apple,banana,coffee

:: 用户选择的值，存在变量 %errorlevel%中

if %errorlevel% == 3 goto coffee
if %errorlevel% == 2 goto banana
if %errorlevel% == 1 goto apple

:apple
echo you like apple
goto end

:banana
echo you like banana
goto end

:apple
echo you like coffee
goto end

:end
echo goodbye

REM find命令 find string 注意这个string需要双引号

netstat -an > a.txt
type a.txt | find "5355" && echo yes,you found the string


REM if命令 判断入参

if "%1"=="" goto usage

if "%1"=="/?" goto usage

if "%1"=="help" goto usage

:: if not "%1"="" goto somejob


:usage
ECHO this is something about how to use bat


REM 判断文件是否存在

IF EXIST *.jpg DEL *.jpg

:: IF NOT EXIST *.jpg MKDIR pic

:: DOS程序在运行完后都有返回码），如果和定义的错误码符合（这里定义的错误码为1），则执行相应的操作（这里相应的操作为pause & edit %1.asm部分）

::masm %1.asm

::if not errorlevel 1 link %1.obj

::pause & edit %1.asm

:: ------------------------

::masm %1.asm

::if exist %1.obj link %1.obj

::else pause & edit %1.asm


REM IF [NOT] ERRORLEVEL number do command

REM IF [NOT] string1==string2 do command

REM IF [NOT] EXIST filename do command

 


:: 在批处理程序中使用 FOR 命令时，指定变量请使用 %%variable 而不要用 %variable。变量名称是区分大小写的，所以 %i 不同于 %I.

FOR /F "usebackq delims==" %%i IN (`set`) DO @echo %%i

:: 根据用户输入设置环境变量

SET /p yourname=input your name:

:: 直接设置环境变量
SET yourname=alice
ECHO %yourname%

:: 读取文件内容设置环境变量 输入重定向
SET /p yourname= < me.txt

FOR /F %%i in (me.txt) DO @SET yourname=%%i

:: 延迟环境变量读取

1. 命令行中执行如下：

cmd /v:on  ::延迟

cmd /v:off ::不延迟

2. 批处理中执行如下：

setlocal EnableDelayedExpansion

setlocal disableDelayedExpansion

 

~~设置命令行窗口的字符编码

1. chcp 65001  // utf-8编码

2. 命令行窗口属性-->字体-->Lucida console

恢复默认的GBK编码

chcp 936  //gbk的codepage==936

 

~~ if  .. else .. 并且可以使用括号包括多条命令

@echo off
echo.
:: can we use if condition () else () syntax?
if exist foo.ttt (
echo yes,found it
) else ( 
echo no, missing
)

echo the end..

pause

 

~~~set读取文件内容 并数学运算+1

@echo off
@echo number + 1 for each time call this bat
set /p num= < number.txt
@echo.
@echo.
@echo current number is: %num%
@echo.

set /a sum=%num%+1
@echo %sum% > number.txt

:: set /a sum+=1

pause

 

~~变量延迟

@echo off

setlocal enabledelayedexpansion

::great , can use brackets like this, so if can follow multiplte cmd
set VAR=before
if "%VAR%" == "before" (
::set pro
echo cmd one
echo cmd two
set VAR=after
if "%VAR%" == "after" @echo you won't see this, when var not delayed
echo %VAR%
)

pause

set VAR2=before2
if "%VAR2%" == "before2" (
echo command one
echo command two
set VAR2=after2
echo command three
if "!VAR2!" == "after2" @echo var has been delayed
echo !VAR2!
)

endlocal


pause

----------------------------------------

set 命令
----------------------------------------

SET [variable=[string]] 
SET /P variable=[promptString] 
SET /A expression

 

示例1:
@echo off 
set
pause 
显示所有的变量的值

示例2: 
@echo off 
set var=我是值 
echo %var% 
pause 
请看 set var=我是值 ,这就是BAT直接在批处理中设置变量的方法! 
set 是命令 var是变量名 =号右边的"我是值"是变量的值 
在批处理中我们要引用这个变量就把var变量名用两个%(百分号)扩起来,如%var%

 

@echo off 
set /p var=请输入你的名字: 
echo 您的名字是:%var%
pause 
set /p 是命令语法 var是变量名 =号右边的"请输入变量的值: ",这个是提示语,不是变 
量的值了! 
运行后,我们在提示语后面直接输入robin,就会显示一行您” 您的名字是:robin”

 

set的/A参数就是让SET可以支持数学符号进行加减等一些数学运算!

set /a var=1 + 1 
set /a var=2 - 1 结果是多少呢?如果你看不到结果就echo %var%..... 
set /a var=2 * 2 乘法运算 
set /a var=2 / 2 除法运算 
set /a var=(1+1) + (1+1) 结果等于4 看得懂吧!

@echo off
set /a a=1+1,b=2+1,c=3+1 
echo %a% %b% %c%

set /a var+=1
set /a var*=2

 ---------------

获取日期和时间

rem CODE BY t0nsha 
rem 关于提取date,time输出结果的一个批处理 
rem “:”（冒号）和“~”波浪号必不可少！ 
rem “~”后的数字：为正数表示舍弃输出结果的前几位；直接跟负数表示取到输出结果的后第几位。 
rem “,”后的数字：为正数表示取到输出结果的前第几位；为负数表示舍弃输出结果的后几位。 
echo %date% 
echo %date:~4% 
::下行表示舍弃前0位，取到第10位（即取输出结果的前10位） 
echo %date:~0,10% 
echo %date:~4,-5% 
pause 
echo %time% 
echo %time:~-3% 
echo %time:~2,-3% 
pause 
echo %date:~4% %time:~0,-3% 
pause

-----------------------------------------------
环境变量 替换或删除匹配字符

@echo off
echo.
REM 设置环境变量为空格
SET "space= "
ECHO Your%space%role%space%is%space%coder
ECHO\

REM 环境变量的值进行字符串替换
SET "VAR=he doesn't care about the exam result"
::find=rep 查找等号左边的字符，替换为右边指定的字符
ECHO %VAR: =_% 
ECHO.

::当等号右边无指定字符，则删除匹配的字符
ECHO %VAR: =% 
ECHO.

::可以用通配符*, %var:*'=R% *'匹配第一个'和它之前的内容
ECHO %VAR:*'=removed,%
ECHO.

PAUSE

-------------------------------------------------------


BTW

使用批处理产生日期（时间）文件、文件夹 帮别人整Sql     server自动备份
发现无法使用网络映射驱动器作为备份文件存放路径
而本机磁盘空间实在是不够
于是决定在本机只备份最新2天数据
再写个批处理，做成系统调度
每周将备份数据复制到网络驱动器上存档

从网上搜到批处理产生日期文件的办法
下面是实现的比较好的

批处理文件：
@echo off
set aFile=bak-%DATE:~4,4%%DATE:~9,2%%DATE:~12,2%
set bFile=bak-%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set cFile=bak-%DATE%
echo Afile=%aFile%
echo Bfile=%bFile%
echo Cfile=%cFile%

输出:
Afile=bak-20061219
Bfile=bak-113202
Cfile=bak-星期二 2006-12-19

于是备份bat就好写了
@echo off
echo 正在备份数据到网络驱动器。。。
set folder=%DATE%
md "y:/%folder%"
copy d:/DataBak/*.BAK "y:/%folder%"
echo 备份完毕。

------------------------------------------------------------------------------------------------------
@echo off
set AFile=bak-%DATE:~4,4%%DATE:~9,2%%DATE:~12,2%
set BFile=bak-%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
echo AFile=%AFile%.rar
echo BFile=%BFile%.rar


运行此批处理的结果：
AFile=bak-20060109.rar ------- 年月日 -- 8位
BFile=bak-140650.rar ---------- 时分秒 -- 6位

另：如果小时数只有一位数字，造成中间有空格而出错的问题，请使用如下方法补0
set hh=%time:~0,2%
if /i %hh% LSS 10 (set hh=0%time:~1,1%)
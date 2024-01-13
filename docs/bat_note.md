# 批处理基础教程

## rem 注释

`rem`, `::` 只支持单行注释

```bat
    :: this is comment
    echo hello :: some comment  不支持这种行尾注释

    :: 如果没有 echo off, 下面的注释会直接在终端打印出来，如果 echo off 则效果同 ::
    rem this is comment too
    REM 这是注释，为了让地球人看懂
```

## @ 抑制本行的输出
```bat
    :: 不显示 echo 语句，只显示 echo 语句的执行结果
    @ECHO OFF
```
## 逻辑和比较运算符

> 比较郁闷的是 bat 没有 `and` `or` 之类的逻辑运算符，只能用 嵌套if 代替

`EXIST`, `NOT`, `==`
```bat
    REM 判断文件是否存在
    IF EXIST example.txt ECHO found it
    IF NOT EXIST example.exe ECHO not found it
    IF 2 == 2 ECHO TRUE

    :: 实际是嵌套的if
    IF %1 == soft IF %2 == dev explorer d:/soft/dev
```
## 命令组合

`&&` 和 `||`

> 类似 js 的短路径操作 `a&&b`, `a||b`

`&`

> 类似 js 的 `,` 运算符 合并多条语句

```bat
    REM 组合命令和js的短路径操作类似
    DIR example.txt && ECHO found it too

    REM 最简单的组合命令, 类似js的逗号运算符, 组合多条语句
    ECHO hello & ECHO world!

    REM cmder touch foo.txt
    DIR foo.ttt & DIR foo.txt || ECHO can not see me
    DIR foo.txt & DIR foo.ttt || ECHO can see me
```

## 重定向

输出重定向：`>`, `>>` , `|`  
输入重定向: `<`

```bat
    ECHO hello > hi.txt
    REM 追加内容到文件
    ECHO not bad day >> exmple.txt

    REM |(前一个命令的输出 作为后一个命令的输入)
    REM more 一屏一屏的显示后面的内容 Enter 1行， 空格 1屏
    help | more

    more doc.txt
    more < doc.txt
```

## 打印文件内容

`type`

```bat
    type longArticle.txt
```

## 调用其他批处理

`call test.bat` 可以将功能模块化, 然后互相调用，通过 `%1`, `%2`, `...` 等形式接受入参

```bat
    REM call命令 从1个批处理调用另1个批处理 且接受入参
    call hi.bat sindy

    :: hi.bat
    echo hello, %1
```

## 提供选择项

```bat
REM choice 命令 提示用户输入 1 个字母进行选择 它的返回码为 1234
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

:coffee
echo you like coffee
goto end

:end
echo goodbye
```

## 查找字符串

```bat
REM find string 注意这个 string 需要双引号

netstat -an > a.txt
type a.txt | find "5355" && echo yes,you found the string
```

## if 命令 判断入参

```bat
REM if 命令 判断入参

if "%1"=="" goto usage

if "%1"=="/?" goto usage

if "%1"=="help" goto usage

:: if not "%1"="" goto somejob

:usage
ECHO this is something about how to use bat
```

判断文件是否存在

```bat
REM 判断文件是否存在

IF EXIST _.jpg DEL _.jpg
```

FOR 循环遍历

```bat
:: 在批处理程序中使用 FOR 命令时，指定变量请使用 %%variable 而不要用 %variable。变量名称是区分大小写的，所以 %i 不同于 %I.

FOR /F "usebackq delims==" %%i IN (`set`) DO @echo %%i
```

设置环境变量

```bat
:: 根据用户输入设置环境变量
SET /p yourname=input your name:

:: 从文件读取值代替输入
set /p num=what number? < number.txt
echo the num is: %num%

:: 直接设置环境变量 等号两边不能有空格
SET yourname=alice
ECHO %yourname%

:: 以换行为分隔符
FOR /F %%i in (me.txt) DO @SET yourname=%%i
```

设置命令行窗口的字符编码

```bat
:: utf-8 编码
chcp 65001

:: 命令行窗口属性-->字体-->Lucida console

:: 恢复默认的 GBK 编码

REM gbk 的 codepage==936
chcp 936
```

`if .. else` 流程控制

```bat
@echo off

:: 输出空白行
echo.

if exist foo.ttt (
    echo yes
    echo welll done
) else (
    echo no
    echo check your input
)

echo the end!

:: 暂停执行
pause

```

读取文件数值 做数学运算

```bat
@echo off

set /p num= < number.txt
echo.
echo.
echo current num is : %num%
echo.

set /a sum=%num%+1
echo %sum% > number.txt


REM 自增运算 +=
set count=%sum%
set /a count+=10
echo count is %count%

pause

```

延迟环境变量读取

```bat
:: 命令行中 打开/关闭
:: cmd /v:on
:: cmd /v:off

:: 批处理中 打开/关闭
:: setlocal EnableDelayedExpansion
:: setlocal disableDelayedExpansion


@echo off
setlocal enabledelayedexpansion

set val=before
if %val% == before (
    echo before one
    echo before two

    set val=after
    if %val% == after echo you won't see this, when var not delayed
    if !val! == after echo you will see this, var has been delayed
)

pause

endlocal
```


`set` 命令详解

```bat
SET [variable=[string]]
SET /P variable=[promptString]
SET /A expression

:: 显示所有的变量的值
@echo off
set

:: 设置环境变量
@echo off
set var=我是值
echo %var%

:: 用户输入环境变量值
@echo off
set /p var=请输入你的名字:
echo 您的名字是:%var%

:: 数学运算
set /a var=1 + 1
set /a var=2 - 1
set /a var=2 * 2
set /a var=2 / 2
:: 支持括号
set /a var=(1+1) + (1+1)
:: 多条赋值语句
set /a a=1+1,b=2+1,c=3+1
:: 复合赋值
set /a var+=1
set /a var\*=2
```

选取字符串片段

```bat
rem 关于提取 date,time 输出结果的一个批处理

:: 选取字符片段
:: 语法 %var:~start,end% 参考 js str.slice(start, end)

:: date time 是内置环境变量
echo %date%
echo %date:~4%

echo %date:~0,10%
echo %date:~4,-5%

echo %time%
echo %time:~-3%
echo %date:~4% %time:~0,-3%
```

字符串查找替换

```bat
:: 字符串查找替换
:: 语法 %var:targetStr=repStr%
:: 查找等号左边的字符，替换为右边指定的字符

@echo off
echo.
REM 设置环境变量为空格
SET "s= "
ECHO Your%s%role%s%is%s%coder

REM 环境变量的值进行字符串替换
set "var=he don't care about"
echo %var: =_%


:: 等号右边无指定字符，即删除匹配的字符
ECHO %var: =%
ECHO.

::可用通配符*, %var:*'=R%
ECHO %var:*'=KK%
ECHO.

```

备份数据
```bat
:: set aFile=bak-%DATE:~4,4%%DATE:~9,2%%DATE:~12,2%

@echo off
echo 正在备份数据到网络驱动器。。。
set folder=%DATE%
md "y:/%folder%"
copy d:/DataBak/\*.BAK "y:/%folder%"
echo 备份完毕。
```

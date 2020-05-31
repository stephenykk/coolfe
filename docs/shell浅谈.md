# shell 浅谈

## 变量和引用

shell 脚本是无类型的，变量的本质是计算机内存地址的别名。  
shell 变量分为

- 本地变量 当前 shell 生命周期可用，类似局部变量
- 环境变量 适用于登录进程产生的子进程
- 位置参数 调用 shell 脚本时传递的参数
- 定义变量时不加$,使用时要加$，用以区别字符串，变量名用{}括来是个好习惯

### 变量赋值

- 等号两边不能有空格，
- value 包含空格必须用双引号，
- 变量名只能包含字母数字和下划线，且不能数字开头
- unset 清除变量的值 `unset msg`

```
msg = hello # error => msg=hello
msg=hello world # error => msg="hello world"
2msg=hello # error msg=hello

a=5
b=$a+5  # shell脚本无类型
echo "now b=$b"  # now b=5+5
b=8
echo "after:b=$b"


a=5
let b=$a+5
echo "now b=$b"  # now b=10
let b=8*5
echo "after:b=$b"

# 从终端获取值
echo "who are you?"
read name
echo "hello, $name"

# 用命令执行结果赋值
a=$(ls)
echo "$a"
```

**变量赋值模式**

- var=value value 赋值给变量
- var+value 对已赋值的 var,重新赋值

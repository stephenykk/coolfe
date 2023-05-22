# coffeeScript 入门教程

[入门教程](https://www.w3cschool.cn/coffeescript/)   
[coffee-script语法](http://coffee-script.org/#try)

CoffeeScript 是一门编译到 JavaScript 的小巧语言。   
CoffeeScript 尝试用简洁的方式展示 JavaScript 优秀的部分。

## 安装
```bash
    cnpm i -g coffee-script
    coffee -v
    # 现在coffeescript已经到2.x版本了
    # coffee-script装的是1.x的旧版，新版这样安装
    cnpm i -g coffeescript@next
    coffee -v

    #  查看官方文档
    npm home coffeescript
```
## 示例

demo.coffee
```coffee
    # 函数调用 不用括号
    console.log 'hello world'
    # 小箭头函数 and 变量声明不用var
    hello = -> console.log('so simple')
    # 没有参数函数调用 要有括号
    hello()
    # 带参函数 声明 参数列表用括号 调用 参数间用逗号
    sum = (a, b) -> a + b
    sum 19, 20
```

编译执行
```bash
    # 直接编译并执行
    coffee demo.coffee

    # 打印编译后的js
    coffee -p demo.coffee
    
    # 编译输出 demo.js
    coffee -c demo.coffee 
    # 执行
    node demo 
    
    # 进入REPL
    # .exit 退出
    coffee -i
    # 查看编译结果
    f = -> exports? and exports or {}
    f.toString()
    # exports? 表示 exports不为 null 或 undefined
    # 类似三元运算符  cond ? trueExpr : falseExpr
```

命令行参数

- `-c, --compile`  
    编译一个 .coffee 脚本到一个同名的 .js 文件.  
- `-m, --map`  
    随 JavaScript 文件一起生成 source maps. 并且在 JavaScript 里加上sourceMappingURL 指令. 
- `-i, --interactive`  
    启动一个交互式的 CoffeeScript 会话用来尝试一些代码片段. 等同于执行  coffee 而不加参数.  
- `-o, --output [DIR]`  
    将所有编译后的 JavaScript 文件写到指定文件夹. 与 --compile 或 --watch 搭配使用.  
- `-j, --join [FILE]`  
    编译之前, 按参数传入顺序连接所有脚本到一起, 编译后写到指定的文件. 对于编译大型项目有用.   
- `-w, --watch`  
    监视文件改变, 任何文件更新时重新执行命令.  
- `-p, --print`  
    JavaScript 直接打印到 stdout 而不是写到一个文件.  
- `-s, --stdio`  
    将 CoffeeScript 传递到 STDIN 后从 STDOUT 获取 JavaScript. 对其他语言写的进程有好处. 比如: `cat src/cake.coffee | coffee -sc`
- `-e, --eval`  
    直接从命令行编译和打印一小段 CoffeeScript. 比如: `coffee -e "console.log num for num in [10..1]"`
- `-b, --bare`  
    编译到 JavaScript 时去掉顶层函数的包裹.
- `-n, --nodes`  
    不对 CoffeeScript 进行编译, 仅仅 lex 和解析, 打印 parse tree
- `--nodejs`  
    node 命令有一些实用的参数, 比如 --debug, --debug-brk, --max-stack-size, 和 --expose-gc. 用这个参数直接把参数转发到 Node.js. 重复使用 --nodejs 来传递多个参数.

```bash
# 编译一个 .coffee 文件的树形目录 src 到一个同级  .js 文件树形目录 lib:
coffee --compile --output lib/ src/
# 监视一个文件的改变, 每次文件被保证时重新编译:
coffee --watch --compile experimental.coffee
# 合并一组文件到单个脚本:
coffee --join project.js --compile src/*.coffee
# 从一个 one-liner 打印编译后的 JS:
coffee -bpe "alert i for i in [0..10]"
# 现在全部一起, 在你工作时监视和重复编译整个项目:
coffee -o lib/ -cw src/
# 运行 CoffeeScript REPL (Ctrl-D 来终止, Ctrl-V 激活多行):
coffee
```
## 语法

### 注释

```coffee
    # 单行注释

    ###
    多行注释
    最后编译为 js的 /* 多行注释语法 */
    ###
```
### 赋值
```coffee
    # 变量声明 不用var
    number = 42 
    # 编译为 var show = false
    show = false 
    
    # 条件赋值
    level = 'good' if score > 90
    # 存在赋值 不存在才赋值
    helper.repeat ?= (str, n) -> str.repeat(n)
    # 三元运算符效果
    val = if count > 10 then 'yes' else 'no'
```

### 函数
```coffee
    # 小箭头函数
    # 有参数要用括号
    square = (x) -> x * x  
    # 带参数调用 不用括号
    square 10
    sum = (a , b) -> a + b
    sum 10, 20

    # 不带参函数 
    hello = -> console.log 'hello'
    # 不带参函数调用 要括号
    hello()
    
    # 参数默认值和字符串插值
    # 双引号中才能插值
    fill = (container, liquid = 'coffee') -> "fill the #{container} with #{liquid}";

    # 剩余参数 和 参数展开 参考es6
    greet = (me, others...) -> [me, others...].join(' ') + ' are friends'

    # 箭头函数 => 绑定上下文 同es6
    # 对象字面量
    lufy = 
        name: 'lufy'
        hello: ->
            setTimeout =>
                console.log 'hi! I am', @name

    lufy.hello()

    # 字符串插值
    name = 'alice'
    console.log "hello, #{name} !"

```
### 流程控制

```coffee
calamus=16;
if calamus>5
    console.log "Calamus is greater than 5"
    if calamus>15
         console.log "Calamus is greater than 5"
     console.log "Over" 

# if ... else ...
if score > 80
    console.log 'good'
else
    console.log 'bad'

# 单行
print 'great' if score > 95


# 编译为js会添加break
switch things
    when "ice"
        console.log "white"
    when "grass"  then  console.log "green"  # 也可以实用then缩短语句到一行
    else 
        console.log "gray"

```

### 比较运算符

CoffeeScript和JavaScript比较运算符转换

CoffeeScript | JavaScript
------------ | -----------
is,==  |  ===
isnt  |  !==
not  |  !
and  |  &&
or  |  `||`
true,yes,on  |  true
false,no,off  |  false
@,this  |  this
of  |  in

### try/catch
```coffee
try
  allHellBreaksLoose()
  catsAndDogsLivingTogether()
catch error
  print error
finally
  cleanUp()

```

### 区间
```coffee
    # var list = [1,2,3,4,5] 
    # python风格，简单便捷
    list = [1..5]
    # var list = [1,2,3, 4] 
    list = [1...5]
```

### 切片选取
```coffee
    str = 'hello world'
    str[0..2] # hel
    str[0...2] # he
```
### 对象
```coffee
    # 小括号 花括号 逗号，能省的都省了.. 是不是太简洁了?
    # yaml风格
    math =
      root: Math.sqrt
      square: square
      cube: (x) -> x * square x
```
### 剩余参数(类似 `es6 rest arguments`)
```coffee
    race = (winner, runners...) ->
        print winner, runners
```
### 存在判断
```coffee
    # 其实是满足条件才执行表达式吧
    # 条件执行 if() {} 的简写
    alert "I knew it!" if smart 

    # ? 存在运算符
    window.MY_NAMESPACE ?= {} 
    
```
### 数组遍历
```coffee
    # python style
    x for x in [1..10]
    x for x in [1..10] by 2 # step 2
    x * x for x in [1..10] by 2 # for前 为表达式即可

    arr = ['foo', 'bar', 'go']
    [i, x] for i, x in arr

    # cubes = list.map(math.cube)
    cubes = (math.cube num for num in list) 

    # 数组声明
    foods = ['apple', 'pear', 'chocolate'] 
    # 类似python  列表推导
    # 遍历满足条件的元素 很接近自然语言wow
    eat food for food in foods when food isnt 'chocolate' 

    ops = {captin: 'lufy', cook: 'sandy', sword: 'zoro'}
    # 遍历对象  用 of 对象的迭代器是 Object.keys()
    key for key of ops
    [key, val] for key, val of ops
```
数组过滤
```coffee
    nums = [1..10]
    n for n in nums when n % 2 == 0
```
### 连续比较
```coffee
    moreHeigh = 180
    lessHeigh = 150
    h = 165
    normalHeigh = lessHeigh < h < moreHeigh # 借鉴python 更直观
```
### 嵌入 Js
```coffee
    `function hi(name) {
        console.log('hihi, ', name);
    }`
    hi 'sandy' # 调用
```
### 类和对象

对象的链式调用, 类似 jquery
```coffee
    class Animal
        constructor: (@name, skill)->
            # @代表this
            # 实例变量
            @skill= skill
            @canfly= false

        # 静态变量
        @version = '1.0'
        # 静态方法
        @printVersion: -> console.log @version

        # 实例方法
        setName: (name) ->
            @name = name
            this # 返回实例对象
        setSkill: (skill) ->
            @skill = skill
            this
        setFly: (can) ->
            @canfly = can
            this

    bird = new Animal('mini', 'run')

    Animal.printVersion()
    # Animal:: == Animal.prototype
    Animal::setFly == Animal.prototype.setFly

    bird.setName('coco')
        .setSkill('singing')
        .setFly(true);

    console.log bird;


    Array::filter ?= (callback) ->
        el for el in this when callback el
```

### Ajax
```coffee
    $.ajax '/',
        type: 'GET'
        dataType: 'html'
        error: (jqXHR, textStatus, errorThrown) ->
            $('body').append "AJAX Error: #{textStatus}"
        success: (data, textStatus, jqXHR) ->
            $('body').append "Successful AJAX call: #{data}"
```

### HTTP客户端
```coffee
    http = require 'http'
    http.get {host: 'www.baidu.com'}, (res) ->
        console.log res.statusCode
        # methods = m for m of res.constructor.prototype
        # console.log methods 
        data = ''
        res.on 'data', (chunk) ->
            data += chunk.toString()
        
        res.on 'end', ->
            console.log data
```

### HTTP服务器
```coffee
    http = require 'http'
    server = http.createServer (req, res) -> res.end 'Hello World'
    server.listen(3000)
    console.log 'running at 3000'
```
### TCP客户端
```coffee
    net = require 'net'
    domain = 'localhost'
    port = '9080'

    conn = net.createConnection port , domain
    
    conn.on 'connection', ->
        console.log "Open connection to #{domain}:#{port}"
    
    conn.on 'data', (data) ->
        console.log "Recieve data: #{data}"
        conn.end()
    conn.on 'end', ->
        console.log "Connection close"
```

### TCP服务器
```coffee
    net = require 'net'
    domain = 'localhost'
    port = '9080'

    server = net.createServer (socket) ->
        console.log "Recieve Connection from #{socket.remoteAddress}"
        socket.write "hello world!\n"
        socket.end()
    
    console.log "listening to #{domain}:#{port}"
    server.listen port, domain
```

## 设计模式

### 适配器模式
开发框架的ORM模型，适配对象到数据库表记录; Axios 的适配器选项，让Axios可以用在小程序

### 桥接模式
通信的桥梁，如JSBridge,APP伪协议

### 生成器模式
封装生成对象的过程，减少重复和出错，如：Redux ActionCreator

### 命令模式
接受callback作为参数的函数都可以看做命令。如: 将callback list的调用，封装成新的函数run
```coffee
    class RunAll
        constructor(@commands...) ->
        run: -> command() for command in @commands

    runner = new RunAll(sum, double)
    runner.run()
```

### 装饰器模式
装饰原有函数附加逻辑或功能，返回新的函数。如：ES6 装饰器语法，promisify

### 工厂模式
像工厂一样生产对象。 如：React.createElement('h1')

### 解释器模式
如: Chai Expect的语言链, expect(expression).to.be.string()

### 备忘录模式
存储和跟踪对象的每一次变化

### 观察者模式
事件发生时发出通知，Vue响应式数据，数据改变时通知依赖列表执行

### 单例模式
不管实例化多少次，都返回同一个对象. Vuex Store

### 策略模式
在策略对象中封装算法

### 模板模式
如: 接口定义模板，类实现接口








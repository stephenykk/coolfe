# coffeeScript 入门教程

[入门教程](https://www.w3cschool.cn/coffeescript/)  

CoffeeScript 是一门编译到 JavaScript 的小巧语言。   
CoffeeScript 尝试用简洁的方式展示 JavaScript 优秀的部分。

## 安装
```bash
    cnpm i -g coffee-script
    coffee -v
```
## 示例

demo.coffee
```coffee
    # 函数调用 不用括号
    console.log 'hello world'
```

编译执行
```bash
    # 直接编译并执行
    coffee demo.coffee
    
    # 编译输出 demo.js
    coffee -c demo.coffee 
    # 执行
    node demo 
    
    # 进入REPL
    # .exit 退出
    coffee -i
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
    
    # 按条件赋值
    level = 'good' if score > 90
```

### 函数
```coffee
    # 和箭头函数很类似
    square = (x) -> x * x  
    
    # 参数默认值和字符串插值
    fill = (container, liquid = 'coffee') -> "fill the #{container} with #{liquid}";
```
### 区间
```coffee
    # var list = [1,2,3,4,5] 
    # python风格，简单便捷
    list = [1..5] 
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
    alert "I knew it!" if smart 
```
### 数组遍历
```coffee
    # python style
    x for x in [1..10]
    x for x in [1..10] by 2 # step 2
    x * x for x in [1..10] by 2 # for前 为表达式即可

    cubes = (math.cube num for num in list) # cubes = list.map(math.cube)
    foods = ['apple', 'pear', 'chocolate'] # 数组声明
    eat food for food in foods when food isnt 'chocolate' # 遍历满足条件的元素 很接近自然语言wow
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
        constructor: ->
            @name= 'momo'
            @skill= ''
            @canfly= false

        setName: (name) ->
            @name = name
            this # 返回实例对象
        setSkill: (skill) ->
            @skill = skill
            this
        setFly: (can) ->
            @canfly = can
            this

    bird = new Animal
    bird.setName('coco').setSkill('singing').setFly(true);
    console.log(bird);
```
类的方法和实例的方法


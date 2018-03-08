coffeeScript入门教程
===
CoffeeScript 是一门编译到 JavaScript 的小巧语言。 [详细文档](https://www.w3cschool.cn/coffeescript/)
CoffeeScript 尝试用简洁的方式展示 JavaScript 优秀的部分。

安装
---
    cnpm i -g coffee-script
    coffee -v

示例
---
    
    //> demo.coffee
    console.log 'hello world'
    
    # 直接编译并执行
    > coffee demo.coffee 
    # 先编译,然后执行
    > coffee -c demo.coffee # 编译输出 demo.js
    > node demo # 执行
    # 进入REPL
    > coffee -i.

语法
---

### 注释

    # 单行注释
    ### 
    多行注释
    最后编译为 js的 /* 多行注释语法 */
    ###

### 赋值

    number = 42 # 不用var
    show = false # 编译为 var show = false
    # 按条件赋值
    level = 'good' if score > 90

### 函数

    square = (x) -> x * x  # 和箭头函数很类似
    # 参数默认值和字符串插值
    fill = (container, liquid = 'coffee') -> "fill the #{container} with #{liquid}";

### 区间

    list = [1..5] # var list = [1,2,3,4,5] python风格，简单便捷

### 对象

    # 小括号 花括号 逗号，能省的都省了.. 是不是太简洁了?
    math = 
      root: Math.sqrt
      square: square
      cube: (x) -> x* square x

### 剩余参数(类似es6 rest arguments)

    race = (winner, runners...) ->
        print winner, runners

### 存在判断

    alert "I knew it!" if smart # 其实是满足条件才执行表达式吧

### 数组遍历

    x for x in [1..10]
    x for x in [1..10] by 2 # step 2
    x * x for x in [1..10] by 2 # for前 为表达式即可

    cubes = (math.cube num for num in list) # cubes = list.map(math.cube)
    foods = ['apple', 'pear', 'chocolate'] # 数组声明
    eat food for food in foods when food isnt 'chocolate' # 遍历满足条件的元素 很接近自然语言wow

### 连续比较

    moreHeigh = 180
    lessHeigh = 150
    h = 165
    normalHeigh = lessHeigh < h < moreHeigh # 借鉴python 更直观

### 嵌入Js

    `function hi(name) {
        console.log('hihi, ', name);
    }`
    hi 'sandy' # 调用

### 类和对象
对象的链式调用, 类似jquery

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

类的方法和实例的方法

    class Animal
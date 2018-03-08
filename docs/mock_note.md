mock.js 
=============
### 数据模板

    #查看模板生成的数据
    var data = Mock.mock({
        //list|1-10 数组元素个数随机范围， id|+2 属性值递增, age|20-30数值随机范围
        // test|3.2-5 3.xx-3.xxxxx 整数位3，小数位位数范围为2-5
        //'yourname|2-4': 'alice-' 重复字符串的次数范围2-4
        //常规真实数据格式，@name @color @url @first @last

        'list|1-10': [{'id|+2': 1 , 'age|20-30': 100}],
        'name': '@name',
        'color': '@color',
        'url': '@url',
        'email': '@email',
        'friends|3': [{name: '@name'}],
        'price|10-20.2-5': 11,
        'cost|10-20.3': 11,
        'test|3.2-5': 52,
        'yourname|2-4': 'alice-'
        });

        JSON.stringify(data, null, 2);

    var data = Mock.mock({
         name: {
         first: '@FIRST',
         middle: '@FIRST',
         last: '@LAST',
         full: '@first @middle @last'
            }
        });
    JSON.stringify(data, null, 2);

    #拦截请求，返回模拟数据
    var Mock.mock('http://g.cn', {
        'list|3-8': [{'id|+3': 1}]
        });

1. 数据模板定义
    `'name|rule': value`  *name* 为属性名, *rule* 为规则, *value* 为值，属性名和生成规则之间用`|`分隔，生成规则的格式有7种：

    +  'name|min-max': value
    +  'name|count': value
    +  'name|min-max.dmin-dmax': value   //.dmin-dmax 小数点后保留的位数范围
    +  'name|min-max.dcount': value //小数点后保留dcount位
    +  'name|count.dmin-dmax': value //貌似用处不大
    +  'name|+step': value //从value递增/减
    
    **属性值可以包含占位符(如@name)，属性值指定了最终值的初始值和数据类型. **

    1. 属性值是字符串 String
        - 'name|min-max': 'value' 通过重复 'value' 生成一个字符串，重复次数大于等于 min，小于等于 max。 
        
        - 'name|count': 'value' 通过重复 'value' 生成一个字符串，重复次数等于 count。
        
    2. 属性值是数字 Number
        - 'name|+1': 100 属性值自动加 1，初始值为 100
        - 'name|1-100': 100 生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型。
        - 'name|1-100.1-10': 100 生成一个浮点数，整数部分大于等于 1、小于等于 100，小数部分保留 1 到 10 位。
        
    3. 属性值是布尔型 Boolean
        - 'name|1': value 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率是 1/2。
        - 'name|min-max': value 随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。
    
    4. 属性值是对象 Object 
        - 'name|min-max': {} 从属性值 {} 中随机选取 min 到 max 个属性。
        - 'name|count': {} 从属性值 {} 中随机选取 count 个属性。
    5.  属性值是数组 Array
        - 'name|1': [{}, {} ...] 从属性值 [{}, {} ...] 中随机选取 1 个元素，作为最终值。
        - 'name|min-max': [{}, {} ...] 通过重复属性值 [{}, {} ...] 生成一个新数组，重复次数大于等于 min，小于等于 max。
        - 'name|count': [{}, {} ...] 通过重复属性值 [{}, {} ...] 生成一个新数组，重复次数为 count。
    6. 属性值是数组 Function
        - 'name': function(){} 执行函数 function(){}，取其返回值作为最终的属性值，上下文为 'name' 所在的对象。
2. 数据占位符定义
    占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。占位符 的格式为：

        @占位符
        @占位符(参数 [, 参数])

    - 用 @ 来标识其后的字符串是 占位符。
    - 占位符 引用的是 Mock.Random 中的方法。
    - 通过 Mock.Random.extend() 来扩展自定义占位符。
    - 占位符 也可以引用 数据模板 中的属性。
    - 占位符 会优先引用 数据模板 中的属性
        
            {
             name: {
             first: '@FIRST',
             middle: '@FIRST',
             last: '@LAST',
             full: '@first @middle @last'
                }
            }
            // =>
            {
             "name": {
             "first": "Charles",
             "middle": "Brenda",
             "last": "Lopez",
             "full": "Charles Brenda Lopez"
                }
            }



### 常用方法

**Mock.mock( rurl?, rtype?, template|function(options) )**  

根据数据模板生成模拟数据。

参数的含义和默认值如下所示：

参数 rurl：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 /\/domain\/list.json/、'/domian/list.json'。
参数 rtype：可选。表示需要拦截的 Ajax 请求类型。例如 GET、POST、PUT、DELETE 等。
参数 template：可选。表示数据模板，可以是对象或字符串。例如 { 'data|1-10':[{}] }、'@EMAIL'。
参数 function(options)：可选。表示用于生成响应数据的函数。
参数 options：指向本次请求的 Ajax 选项集。


**Mock.mockjax(library)**  

覆盖（拦截） Ajax 请求，目前内置支持 jQuery、Zepto、KISSY。

**Mock.Random**  

Mock.Random 是一个工具类，用于生成各种随机数据。Mock.Random 的方法在数据模板中称为“占位符”，引用格式为 @占位符(参数 [, 参数]) 。

**Mock.tpl(input, options, helpers, partials)**  

基于 Handlebars、Mustache 的 HTML 模板生成模拟数据。
    
    

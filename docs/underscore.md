underscore
=======================

集合函数(数组或对象)
--------------------
+ _.each(list, iteratee, [context]);
+ _.map(list, iteratee, [context]);
+ _.reduce(list, iteratee, [memo], [context]); //foldl
+ _.reduceRight(list, iteratee, [memo], [context]); //foldr
+ _.find(list, predicate, [context]); //detect
+ _.filter(list, predicate, [context]); //select
+ _.where(list, properties);
+ _.findWhere(list, properties);
+ _.reject(list, predicate, [context]); //与filter相反
+ _.every(list, [predicate], [context]); //all
+ _.some(list, [predicate], [context]); //any 
+ _.contains(list, value); //include
+ _.invoke(list, methodName, *arguments);
+ _.pluck(list, propertyName);
+ _.max(list, iteratee, [context]);
+ _.min(list, iteratee, [context]);
+ _.sortBy(list, iteratee, [context]);
+ _.groupBy(list, iteratee, [context]); //=> return obj
+ _.indexBy(list, iteratee, [context]); //=> return obj
+ _.countBy(list, iteratee, [context]); //=> return obj
+ _.shuffle(list);
+ _.sample(list,[n]);
+ _.toArray(list); // like $.makeArray
+ _.size(list); 
+ _.partition(list, predicate);//数组分成2个子数组 为true, 为false

数组函数
---------------------------
+ _.first(array, [n]); //默认 n=1
+ _.initial(array, [n]); //从末尾删除n个元素后的子数组 默认n=1
+ _.last(array, [n]); //保留最后n个元素，形成的新数组
+ _.rest(array, [n]);//去掉前面n个元素，形成新的数组 _.tail(), _.drop();
+ _.compact(array); //删除所有false值后的数组副本
+ _.flatten(array, [shallow]);//扁平化数组 shallow=true则只扁平1层
+ _.without(array, *values); //返回删除values值后的数组副本_
+ _.union(*arrays);//数组合并 会去掉重复项
+ _.intersection(*arrays); //数组的交集
+ _.difference(array, *others); //在源数组中有，其他数组没有的元素组成新数组
+ _.uniq(array); //_.unique(array); 数组去重
+ _.zip(*arrays); //每个数组相应位置的值合并在一起，返回二维数组
+ _.object(list, [values]); //两个数组转换为对象，或二维数组转换为对象[['name1','val1'],['name2', 'val2']]
+ _.indexOf(array, value, [isSorted]);
+ _.lastIndexOf(array, value, [fromIndex]);
+ _.sortedIndex(list, value, [iteratee], [context]); //返回value在list中的位置序号
+ _.range([start], stop, [step]); //返回整数数组

函数相关的函数
-----------------------------
+ _.bind(function, object, *arguments); //绑定上下文 和 部分参数 返回偏函数

```js 
    var func = function(greeting){ return greeting + ': ' + this.name; };
    func = _.bind(func, {name:'sindy'}, 'hi');
    func();
```
+ _.bindAll(object, *methodNames);

```js 
    var buttonView = {
        label: 'underscore',
        onClick: function(){ alert('clicked ' + this.label); },
        onHover: function(){ console.log('hovering ' + this.label); }
    };
    _.bindAll(buttonView, 'onClick', 'onHover');
    $('#underscoreBtn').bind('click', buttonView.onClick);
```

+ _.partial(function, *arguments); //类似bind，只是不绑定上下文对象, 返回偏函数

```js 
    var add = function(a, b){ return a+b; };
    var add5 = _.partial(add, 5);
    add5(10); //15
```

+ _.memoize(function, [hashFunction]); //缓存某函数的计算结果

```js 
    var fibonacci = _.memoize(function(n){
        return n<2?n:fibonacci(n-1) + fibonacci(n-2);
    });
```
+ _.delay(function, wait, *arguments); //类似setTimeout, 但是可以传递参数给回调函数

```js 
    var log = _.bind(console.log, console);
    _.delay(log, 1000, 'logged later');
```

+ _.defer(function, *arguments);//延迟调用函数直到调用栈为空, 类似setTimeout(function, 0); 只是可传入参数

```js 
    _.defer(alert, 'some deferred tips');
```
+ _.throttle(function, wait, [options]); //限制执行频率

```js 
    var throttled = _.throttle(updatePosition, 100);
    $(window).scroll(throttled);
```

+ _.debounce(function, wait, [immediate]);//将函数的执行真正延迟到最后一次调用的wait秒之后

```js 
    var lazyLayout = _.debounce(calculateLayout, 300);
    $(window).resize(lazyLayout);
```

+ _.once(function); //创建一个只能调用一次的函数，重复调用，只会返回第一次调用的结果

```js 
    var init = _.once(createApplication);
    init();
    init();
```

+ _.after(count, function); 只有在执行了count次之后，才真正执行function

```js 
    var renderNotes = _.after(notes.length, render);
    _.each(notes, function(){
        note.asyncSave({success: renderNotes});
    });// renderNotes is run once, after all notes have saved
```

+ _.before(count, function); //count次之前正常执行函数，count次以及其后的调用返回最后一次调用的结果

```js 
    var monthlyMeeting = _.before(3, raise);
    monthlyMeeting();
    monthlyMeeting();
```

+ _.wrap(function, wrapper); //装饰者模式..

```js 
    var hello = function(name){ return 'hello ' + name; };
    hello = _.wrap(hello, function(func){
        return 'before ' + func('moe') + ' after';
    };
    hello();
```

+ _.negate(predicate); //返回predicate函数的否定版本
```js 
    var isFalsy = _.negate(Boolean);
    _.find([1,2,0,33,11], isFalsy); //0
```
+ _.compose(*functions); //返回函数集组合后的复合函数

```js 
    // _.compose(f,g,h); => h(g(f()))
    var greet = function(name){ return 'hello ' + name; };
    var exclaim = function(statement){ return statement.toUpperCase() + '!';};
    var welcome = _.compose(greet, exclaim);
    welcome('sindy');
```

对象相关函数
-----------------------------
+ _.keys(object); //返回key组成的数组
+ _.values(object); //返回value组成的数组
+ _.pairs(object); //对象转换为[[key1,val1],[key2, val2]]这样的二维数组
+ _.invert(object); //返回key-value对调后的对象

```js 
    var obj =  {'one':1, 'two': 2 , 'three':3};
    _.invert(obj);
```

+ _.functions(object); //返回对象里所有的方法名组成的数组 _.methods()
+ _.extend(dest, *objects);
+ _.pick(object, *keys); //_.pick(object, predicate);

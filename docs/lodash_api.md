array
----------

    #分段/分割
    _.chunk()

    #比较
    _.difference() _.differenceBy()  _.differenceWith()
    _.intersection()  _.intersectionBy() _.intersectionWith()
    _.xor(), _.xorBy(), _.xorWith()

    #删除
    _.drop() _.dropWhile() _.dropRight() _.dropRightWhile()
    _.pull()
    _.pullAt()
    _.pullAll() _.pullAllBy() _.pullAllWith()
    _.remove()
    _.compact()
    _.without()

    #填充
    _.fill()

    #转对象
    _.fromPaires()

    #取索引
    _.findIndex() _.findLastIndex()
    _.indexOf() _.lastIndexOf()

    #取元素/片段
    _.head() _.last() _.nth()
    _.initial() _.tail()
    _.take() _.takeWhile() _.takeRight() _.takeRightWhile()

    #排序
    _.sortedIndex() _.sortedIndexBy() _.sortedLastIndex() _.sortedLastIndexBy()
    _.sortedIndexOf() _.sortedLastIndexOf()
    _.sortedUniq(), _.sortedUniqBy()


    #合并
    _.union() _.unionBy() _.unionWith()

    #扁平化
    _.flatten() _.flattenDeep() _.flattenDepth()

    #压缩 kk:矩阵取列
    _.unzip() _.unzipBy() _.unzipWith()
    _.zip() _.zipWith()
    _.zipObject() _.zipObjectDeep()

collection
---------------

    #统计 组合 分组
    _.countBy()
    _.groupBy()
    _.partition()

    #遍历 查找 判断
    _.forEach() _.forEachRight()
    _.filter() _.reject()
    _.every()  _.some()
    _.find() _.findLast()
    _.includes()
    _.map()  _.invokeMap()
    _.reduce() _.reduceRight()

    #扁平化
    _.flatMap() _.flatMapDeep()  _.flatMapDepth()

    #重建索引
    _.keyBy()

    #排序
    _.orderBy()
    _.sortBy()
    _.shuffle()
    
    #取样
    _.sample()  _.sampleSize()

    #元素个数
    _.size()

object 
-------------

    #合并
    _.assign() _.assignWith() _.assignIn()  _.assignInWith()
    _.defaults() _.defaultsDeep()
    _.merge()  _.mergeWith()

    #取值 赋值 删除值 更新值
    _.at()
    _.get() _.result()
    _.set() _.setWith()
    _.unset()
    —.update()  _.updateWith()
    _.values() _.valuesIn()

    #创建对象
    _.create()

    #转数组
    _.toPairs() _.toPairsIn() 

    #取索引 
    _.findKey() _.findLastKey()
    _.keys()  _.keysIn()

    #遍历 映射
    _.forIn() _.forInRight()
    _.forOwn() _.forOwnRight()
    _.mapKeys()  _.mapValues()
    _.transform()

    #取方法名
    _.functions() _.functionsIn()

    #判断包含属性
    _.has() _.hasIn()

    #键值互换
    _.invert() _.invertBy()

    #调用对象上的方法
    _.invoke()

    #剔除 提取
    _.omit()  _.omitBy()
    _.pick() _.pickBy()


function
-----------------

    #调用次数
    _.after()
    _.before()

    _.ary()

    #绑定上下文 和 部分参数
    _.bind()  _.bindKey()

    #柯里化
    _.curry()  _.curryRight()



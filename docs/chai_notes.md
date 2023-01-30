# chai notes

[Chai.js 断言库 API 中文文档](https://www.jianshu.com/p/f200a75a15d2)

## 查看帮助

```jsbash
npm home chai
```

## 断言库

`expect` 和 `should` 是 BDD 风格的， 二者使用相同的链式语言来组织断言，但不同在于他们初始化断言的方式：

- `expect` 使用构造函数来创建断言对象实例，
- `should` 通过为 Object.prototype 新增方法来实现断言（所以 should 不支持 IE）；

`expect` 直接指向 `chai.expect`，而 `should` 则是 `chai.should()`。


```jsjs
var chai = require("chai");
expect = chai.expect;
should = chai.should();
```

## 语言链

语言链用于提高断言的可读性, 一般不提供测试功能。

- to
- be
- been
- is
- that
- which
- and
- has
- have
- with
- at
- of
- same

## .not

对之后的断言取反

```js
    expect(foo).to.not.equal('bar');
    expect(goodFn).to.not.throw(Error);
    expect({foo: 'baz'}).to.have.property('foo').and.not.equal('bar')
```

## .deep

设置 deep 标记，然后使用 equal 和 property 断言。该标记可以让其后的断言不是比较对象本身，而是递归比较对象的键值对

```js
    expect(foo).to.deep.equal({bar: 'baz'});
    expect({foo: {bar: {baz: 'fine'}}}).to.have.deep.property('foo.bar.baz', 'fine');
```

deep.property 中的特殊符号可以使用双反斜杠进行转义(_第一个反斜杠是在字符串参数中对第二个反斜杠进行转义，第二个反斜杠用于在 property 中进行转义_)

```js
    var deepCss = { '.link': { '[target]': 42 } }
    expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42)
```

## .any

在 keys 断言之前使用 any 标记（与 all 相反）

```js
    expect(foo).to.have.any.keys('bar', 'baz');
```

## .all

在 keys 断言之前使用 all 标记（与 any 相反）

```js
    expect(foo).to.have.all.keys('bar', 'baz');
```

## .a(type) / .an(type)

a 和 an 断言即可作为语言链又可作为断言使用

```js
    expect('test').to.be.a('string');
    expect({foo: 'bar'}).to.be.an('object');
    expect(null).to.be.a('null');
    expect(undefined).to.be.an('undefined');
    expect(new Error).to.be.an('error');
    expect(new Promise).to.be.a('promise');
    expect(foo).to.be.an.instanceof(Foo);
```

## .include(value) / contains(value)

include()和 contains()即可作为属性类断言前缀语言链又可作为作为判断数组、字符串是否包含某值的断言使用。当作为语言链使用时，常用于 keys()断言之前

```js
    expect([1,2,3]).to.include(2);
    expect('foobar').to.include('bar');
    expect({foo: 'bar', hello:'world'}).to.include.keys('foo');
```

## .ok

断言目标为真值。

```js
    expect(true).to.be.ok
    expect(1).to.be.ok
    expect(false).to.not.be.ok
    expect(null).to.not.be.ok
```

## .true

断言目标为 true，注意，这里与 ok 的区别是不进行类型转换，只能为 true 才能通过断言

```js
    expect(true).to.be.true
    expect(1).to.not.be.true
```

## .false

断言目标为 false

```js
    expect(false).to.be.false
    expect(0).to.not.be.false
```

## .null, .undefined, .NaN

同 `.true` , 判断是否为对应的值 不进行类型转换

## .exist

断言目标存在，即非 null 也非 undefined

```js
    var foo = 'hi';
    var bar = null
    var baz;

    expect(foo).to.be.exist
    expect(bar).to.not.exist
    expect(baz).to.not.exist
```

## .empty

断言目标的长度为 0。对于数组和字符串，它检查 length 属性，对于对象，它检查可枚举属性的数量 `可参考lodash _.isEmpty(val)`

```js
    expect([]).to.be.empty
    expect({}).to.be.empty
    expect('').to.be.empty
```

## .arguments

断言目标是一个参数对象 arguments

```js
    function test() {
        expect(arguments).to.be.arguments
    }
```

## .equal(value)

断言目标严格等于(===)value。另外，如果设置了 deep 标记，则断言目标深度等于 value

```js
    expect('hello').to.equal('hello')
    expect(42).to.equal(42)
    expect(1).to.not.equal(true)
    expect({ foo: 'bar'}).to.not.equal({ foo: 'bar'})
    expect({ foo: 'bar'}).to.deep.equal({foo: 'bar'})
```

## .eql(value)

断言目标深度等于 value，相当于 deep.equal(value)的简写

```js
    expect({foo: 'bar'}).to.eql({foo: 'bar'});
    expect([1,2,3]).to.eql([1,2,3]);
```

## .above(value) / .below(value)

断言目标大于（超过）value

```js
    expect(10).to.be.above(5)

    expect(5).to.be.below(10)
    expect('foo').to.have.length.below(4)
    expect([1, 2, 3]).to.have.length.below(4)
```

也可接在 length 后来断言一个最小的长度。相比直接提供长度的好处是提供了更详细的错误消息

```js
    expect('foo').to.have.length.above(2)
    expect([1, 2, 3]).to.have.length.above(2)
```

## .least(value) / .most(value)

断言目标不小于（大于或等于）value, 参考 `.above(value)`

```js
    expect(10).to.be.at.least(10)
    expect('foo').to.have.length.of.at.least(3)
    expect([1, 2, 3]).to.have.length.of.at.least(3)

    expect(5).to.be.at.most(5)
    expect('foo').to.have.length.of.at.most(4)
    expect([1, 2, 3]).to.have.length.of.at.most(3)
```

## .within(start, finish)

断言目标在某个区间内

```js
    expect(7).to.be.within(5, 10)
    expect('foo').to.have.length.within(2, 4)
    expect([1, 2, 3]).to.have.length.within(2, 4)
```

## .instanceof(constructor)

断言目标是构造函数 constructor 的一个实例

```js
    var Tea = function (name) { this.name = name },
      Chai = new Tea('chai')

    expect(Chai).to.be.an.instanceof(Tea)
    expect([1, 2, 3]).to.be.an.instanceof(Array)
```

## .property(name, [value])

断言目标是否拥有某个名为 name 的属性，可选地如果提供了 value 则该属性值还需要严格等于（===）value。如果设置了 deep 标记，则可以使用点.和中括号[]来指向对象和数组中的深层属性

```js
    var obj = {foo: 'bar'}
    expect(obj).to.have.property('foo')
    expect(obj).to.have.property('foo', 'bar')

    var deepObj = {
        green: {tar: 'hello'},
        teas: ['Chai', 'world', {tao: 'kongfu'}]
    }
    expect(deepObj).to.have.deep.property('green.tar', 'hello'); // error 可能api改了
    expect(deepObj).to.have.deep.property('teas[2].tao', 'kongfu'); // 同上
    expect(deepObj).to.have.deep.property('green', {tar: 'hello'}); // good,   deep.equal
```

此外，property 把断言的主语（subject）从原来的对象变为当前属性的值，使得可以在其后进一步衔接其它链式断言（来针对这个属性值进行测试）

```js
    expect(obj).to.have.property('foo')
      .that.is.a('string')
    expect(deepObj).to.have.property('green')
      .that.is.an('object')
      .that.deep.equals({ tea: 'matcha' })
    expect(deepObj).to.have.property('teas')
      .that.is.an('array')
      .with.deep.property('[2]')
        .that.deep.equals({ tea: 'konacha' })
```

## .ownProperty(name)

断言目标拥有名为 name 的自有属性

```js
    expect('test').to.have.ownProperty('length')
```

## .ownPropertyDescription(name[, descriptor])

断言目标的某个自有属性存在描述符对象，如果给定了 descroptor 描述符对象，则该属性的描述符对象必须与其相匹配

```js
    expect('test').to.have.ownPropertyDescriptor('length')
    expect('test').to.have.ownPropertyDescriptor('length', {
      enumerable: false,
      configrable: false,
      writeable: false,
      value: 4
    })
    expect('test').not.to.have.ownPropertyDescriptor('length', {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: 3
    })
    // 将断言的主语改为了属性描述符对象
    expect('test').to.have.ownPropertyDescriptor('length')
      .to.have.property('enumerable', false)
    expect('test').to.have.ownPropertyDescriptor('length')
      .to.have.keys('value')
```

## .length

设置.have.length 标记作为比较 length 属性值的前缀

```js
    expect('foo').to.have.length.above(2)
    expect([1, 2, 3]).to.have.length.within(2, 4)
```

## .lengthOf(value)

断言目标的 length 属性为期望的值

```js
    expect([1, 2, 3]).to.have.lengthOf(3)
    expect('foobar').to.have.lengthOf(6)
```

## .match(regexp)

断言目标匹配到一个正则表达式

```js
    expect('foobar').to.match(/^foo/)
```

## .string(string)

断言目标字符串包含另一个字符串

```js
    expect('foobar').to.have.string('bar')
```

## .keys(key1, [key2], [...])

断言目标包含传入的属性名。与 any，all，contains 或者 have 前缀结合使用会影响测试结果：

```js
    // 结合any使用
    expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo', 'bar')
    expect({ foo: 1, bar: 2, baz: 3 }).to.contains.any.keys('foo', 'bar')

    // 结合all使用
    expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys('foo', 'bar', 'baz')
    expect({ foo: 1, bar: 2, baz: 3 }).to.contains.all.keys('foo', 'bar')

    // 传入string
    expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo')
    // 传入Array
    expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys(['foo', 'bar', 'baz'])
    // 传入Object
    expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys({ bar: 2, foo: 1 })
```

## .throw(constructor)

断言目标函数会抛出一个指定错误或错误类型（使用 instanceOf 计算），也可使用正则表达式或者字符串来检测错误消息

```js
    var err = new RefernceError('this is a bad function')
    var fn = function () { throw err }

    expect(fn).to.throw(ReferenceError)
    expect(fn).to.throw(Error)
    expect(fn).to.throw(/bad function/)
    expect(fn).to.not.throw('good function')
    expect(fn).to.throw(ReferrenceError, /bad function/)
    expect(fn).to.throw(err)
    expect(fn).to.throw(ReferenceError)
      .and.not.throw(/good function/)
```

## .respondTo(method)

断言目标类或对象会响应一个方法（存在这个方法）

```js
    Klass.prototype.bar = function () {}
    expect(Klass).to.respondTo('bar')
    expect(obj).to.respondTo('bar')

    Klass.baz = function () {}
    expect(Klass).itself.to.respondTo('baz') // 响应静态方法用 itself 标记
```

## .itself

设置 itself 标记，然后使用 respondTo 断言

```js
    function Foo () {}
    Foo.bar = function () {}
    Foo.prototype.baz = function () {}

    expect(Foo).itself.to.respondTo('bar')
    expect(Foo).itself.not.to.respondTo('baz')
```

## .satisfy(method)

断言目标值能够让给定的测试器返回真值

```js
    expect(1).to.satisfy(function (num) { return num > 0 })
```

## .closeTo(expected, delta)

断言目标数字等于 expected，或在期望值的+/-delta 范围内

```js
    expect(1.5).to.be.closeTo(1, 0.5)
```

## .members(set)

断言目标是 set 的超集，或前者有后者所有严格相等（===）的成员。

```js
    expect([1, 2, 3]).to.include.members([3, 2])
    expect([1, 2, 3]).to.not.include.members([3, 2, 8])

    expect([4, 2]).to.have.members([2, 4])
    expect([5, 2]).to.not.have.members([5, 2, 1])

    expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }])
```

## .oneOf(list)

断言目标值出现在 list 数组的某个顶层位置（直接子元素，严格相等）

```js
    expect('a').to.be.oneOf(['a', 'b', 'c'])
    expect(9).to.not.be.oneOf(['z'])

    // 严格相等，所以对象类的值必须为同一个引用才能被判定为相等
    var three = [3]
    expect([3]).to.not.be.oneOf([1, 2, [3]])
    expect(three).to.not.be.oneOf([1, 2, [3]])
    expect(three).to.be.oneOf([1, 2, three])
```

## change(object, property)

断言目标方法会改变指定对象的指定属性

```js
    var obj = { val: 10 }
    var fn = function () { obj.val += 3 }
    var noChangeFn = function () { return 'bar' + 'baz' }

    expect(fn).to.change(obj, 'val')
```

## .increase(object, property) / .decrease(object, property)

断言目标方法会增加指定对象的属性

```js
    var obj = { val: 10 }
    var fn = function () { obj.val = 15 }
    expect(fn).to.increase(obj, val)

    var obj = { val: 10 }
    var fn = function () { obj.val = 5 }
    expect(fn).to.decrease(obj, val)
```

## .extensible / .sealed / .frozen

- extensible 断言目标对象是可扩展的（可添加属性）,
- sealed 断言目标对象是封闭的（不能增删属性但可以被修改）
- frozen 断言目标对象是冻结的（不能增删属性也不能修改）

```js
    var nonExtensibleObject = Object.preventExtensions({})
    var sealedObject = Object.seal({})
    var frozenObject = Object.freeze({})

    expect({}).to.be.extensible
    expect(nonExtensibleObject).to.not.be.extensible
    expect(sealObject).to.not.be.extensible
    expect(frozenObject).to.not.be.extensible
```

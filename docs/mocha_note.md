# mocha 入门指南

JavaScript 的单元测试框架很多，Mocha（发音”摩卡”）诞生于 2011 年，是现在最流行的 JavaScript 测试框架之一，在浏览器和 Node 环境都可以使用。

[中文文档](https://segmentfault.com/a/1190000011362879)

## 安装

`npm install mocha -g`, `npm install chai`
`mocha -h` 查看使用帮助和文档
要在小程序中用 mocha 进行单元测试，还应安装 `mocha-webpack` , 具体看 github 介绍(`npm home mocha-webpack`)

## 例子

测试文件通常与源文件在同目录并且同名，用后缀(**.test.js , spec.js**)区分。
测试代码通常包含多个 describe 块(**称为测试套件**), 每个 describe 块有包含多个 it 块(**称为测试用例**)

```js
    # hello.test.js
    var expect = require('chai').expect; // 使用断言库 chai

    describe('expect', function() { // 测试套件
        it('4 + 5 应该等于9', function() {// 测试用例
            expect(4+5).to.be.equal(9); // 断言
        });
    });
```

> mocha 本身是测试框架，没有包含断言库, nodejs 自身也带断言模块 assert, 其他断言库有: expect.js, should.js, better-assert, ...

执行测试  
`mocha hello.test.js`

### 断言语句

```js
    // 相等或不等
    expect(4 + 5).to.be.equal(9);
    expect(4 + 5).to.be.not.equal(10); # 同 expect(4 + 5).to.not.be.equal(10)
    expect(foo).to.be.deep.equal({baz: 'bazv'}); // deep equal, 指对象内部的key相同，value相等
    expect(obj1).to.be.equal(obj2); // 判断 obj1 和 obj2 是否引用相等

    // 布尔值为true
    expect('everything').to.be.ok
    expect(false).to.not.be.ok

    // typeof
    expect('test').to.be.a('string');
    expect({foo: 'bar'}).to.be.an('object');
    expect(foo).to.be.an.instanceof(Foo);

    // include
    expect([1,2,3]).to.include(2);
    expect('foobar').to.contain('foo');
    expect({foo: 'bar', hi: 'hello'}).to.include.keys('foo');

    // empty
    expect([]).to.be.empty;
    expect('').to.be.empty;
    expect({}).to.be.empty;

    // match
    expect('foobar').to.match(/^foo/);

```

## 真实点的例子

目录结构

```bash
├─app
│      cal.js
│
└─test
       cal.test.js
```

cal.js

```js
var calculate = {
  add(a, b) {
    return a + b;
  },
  divide(a, b) {
    return a / b;
  },
};

module.exports = calculate;
```

cal.test.js

```js
var calculate = require("../app/cal");
var expect = require("chai").expect;

describe("calculate", function () {
  describe("#calculate", function () {
    it("return add result", function () {
      expect(calculate.add(1, 2)).to.be.equal(3);
    });

    it("return divide result", function () {
      expect(calculate.divide(2, 2)).equal(1);
    });
  });
});
```

执行测试

```js
    cd test
    mocha cal.test.js

    # 或者 项目根目录直接执行 mocha, 会在当前目录找test文件夹，并执行里面的测试文件
    mocha
```

## 测试异步任务

### done 回调

给测试用例提供回调，在回调执行时，完成测试

```js
describe("async test", function () {
  it("should finish test  1.8 secondes later", function (done) {
    setTimeout(() => {
      console.log("before done..");
      done();
    }, 1800); // mohca 默认超时值为2秒
  });
});
```

### promise

测试用例也可以返回 promise, resolved 测试通过，rejected 测试不通过

```js
it("should finish as promise complete", function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve('cool');
      reject("bad");
    }, 1800);
  });
});
```

### async/await

```js
it("async fun use as it handler", async function () {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, 1000);
  });
  console.log("good");
});
```

## HOOKS

鉴于默认使用 BDD 风格的接口，Mocha 提供了一些钩子函数:`before()`,`after()`,`beforeEach()`和`afterEach()`。这些钩子函数可以用于设置测试的先决条件或者对测试进行清理。

```js
describe("hooks", function () {
  before(function () {
    // 在这个区块内的所有测试之前运行
  });
  after(function () {
    // 在这个区块内的所有测试之后运行
  });
  beforeEach(function () {
    // 在这个区块内的每个测试用例运行之前运行
  });
  afterEach(function () {
    // 在这个区块内的每个测试用例之后运行
  });
});
```

> 一般的执行顺序 before()(只运行一次)->beforeEach()->afterEach()->after()(只运行一次)

## DESCRIBING HOOKS

任何钩子函数在执行的时候都可以传递一个可选的描述信息，可以更容易地准确指出测试中的错误。如果钩子函数使用了命名的回调函数，则其名字会被作为默认的描述信息。

```js
beforeEach(function () {
  // beforeEach钩子函数(没有任何的描述信息)
});
beforeEach(function namedFn() {
  // beforeEach:namedFn会被当作描述信息
});
beforeEach("some description", function () {
  // beforeEach:some description(提供了描述信息)
});
```

## ASYNCHRONOUS HOOKS

所有的钩子(`before()`,`after()`,`beforeEach()`,`afterEach()`)可以是同步的也可以是异步的，其行为就像是普通的测试用例。例如，你希望在每个测试之前，向数据库中填充一些内容。

```js
describe("Connection", function () {
  var db = new Connection(),
    tobi = new User("tobi"),
    loki = new User("loki"),
    jane = new User("jane");

  beforeEach(function (done) {
    db.clear(function (err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe("#find()", function () {
    it("respond with matching records", function (done) {
      db.find({ type: "User" }, function (err, res) {
        if (err) return done(err);
        res.should.have.length(3);
        done();
      });
    });
  });
});
```

## ROOT-LEVEL HOOKS

例如，添加 beforeEach()在所有 describe()块外, 这会造成在每个测试用例之前调用这个钩子函数

> 因为 Mocha 有一个暗藏的 describe()，叫做"root-suite")。

```js
beforeEach(function () {
  console.log("before every test in every file");
});
```

## DELAYED ROOT SUITE

如果想在 mocha 命令运行之后，先做一些别的工作，再启动测试，可以使用 mocha --delay 命令，此命令会在全局环境中生成一个 run 函数，延迟工作完成后调用 run 函数即可启动测试。

`mocha world.test.js --delay`

```js
    # world.test.js
    var expect = require('chai').expect;


    setTimeout(function () {
        console.log('firstly, do something else..');
        describe('my suite', function () {
            it('my test', function () {
                console.log('do my test..');
                expect(true).to.be.ok
            })
        });
        run();
    }, 3000);
```

## PENDING TESTS

不给测试用例传递一个回调函数，就是被等待实现的测试用例，但同样会在报告中体现出来。

```js
describe("array", function () {
  describe("#indexOf()", function () {
    it("should return -1 when no args"); // 待实现的测试
  });
});
```

## EXCLUSIVE TESTS

在用例测试集或者用例单元后面加上.only()方法，可以让 mocha 只测试此用例集合或者用例单元。下面是一个仅执行一个特殊的测试单元的例子：

```js
describe("Array", function () {
  describe("#indexOf", function () {
    it.only("should return -1 unless present", function () {
      // this test will be run
    });
    it.only("should return index when present", function () {
      // this test will also be run
    });
    it("should return -1 if called with a non-Array context", function () {
      // this test will not be run
    });
  });
});
```

## INCLUSIVE TESTS

和 only()方法相反，.skip()方法可以用于跳过某些测试测试集合和测试用例。所有被跳过的用例都会被标记为 pending 用例，在报告中也会以 pending 用例显示。下面是一个跳过整个测试集的例子。

```js
describe("Array", function () {
  describe("#indexOf()", function () {
    it.skip("should return -1 unless present", function () {
      // this test will not be run
    });

    it("should return the index when present", function () {
      // this test will be run
    });
  });
});
```

> 最佳实践：使用.skip()方法来跳过某些不需要的测试用例而不是从代码中注释掉。

根据条件在运行的时候跳过某些测试用例, 可以用 this.skip()［译者注：这个时候就不能使用箭头函数了］。

```js
it("should only test in the correct environment", function () {
  if (Math.random() * 6 > 5) {
    expect(1).to.be.ok;
  } else {
    this.skip();
  }
});
```

> 最佳实践：测试用例里，千万不要什么事情都不做，一个测试应该做个断言判断或者使用 skip()

## RETRY TESTS

Mocha 允许你为失败的测试用例指定需要重复的次数。这个功能是为端对端测试所设计的，因为这些测试的数据不好模拟。Mocha 不推荐在单元测试中使用这个功能。

这个功能会重新运行 beforeEach/afterEach 钩子，但不会重新运行 before/after 钩子。

下面是一个使用 Selenium webdriver 写的一个重复执行的测试用例。

```js
describe("retries", function () {
  // 尝试全部的失败的测试4次，
  this.retries(4);

  beforeEach(function () {
    browser.get("http://www.yahoo.com");
  });

  it("should succeed on the 3rd try", function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($(".foo").isDisplayed()).to.eventually.be.true;
  });
});
```

## DYNAMICALLY GENERATING TESTS

Mocha 可以使用 Function.prototype.call 和函数表达式来动态定义测试用例

```js
var assert = require("chai").assert;

function add() {
  return Array.prototype.slice.call(arguments).reduce(function (prev, curr) {
    return prev + curr;
  }, 0);
}

describe("add()", function () {
  var tests = [
    { args: [1, 2], expected: 3 },
    { args: [1, 2, 3], expected: 6 },
    { args: [1, 2, 3, 4], expected: 10 },
  ];

  tests.forEach(function (test) {
    it("correctly adds " + test.args.length + " args", function () {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});
```

## TEST DURATION

很多的测试报告都会显示测试所花费的时间，同样也会对一些耗时的测试作出特殊的标记。

```js
describe("something slow", function () {
  this.slow(10000);

  it("should take long enough for me to go make a sandwich", function () {
    // ...
  });
});
```

## TIMEOUTS

测试集合超时:

在测试集合上定义超时时间，会对这个测试集合中所有的测试用例和测试集合起作用。我们可以通过 this.timeout(0)来关闭超时判断的功能。而且在测试用例和测试集合上定义的超时时间会覆盖外围的测试集合的设置。

```js
describe("a suite of tests", function () {
  this.timeout(500);

  it("should take less than 500ms", function (done) {
    setTimeout(done, 300);
  });

  it("should take less than 500ms as well", function (done) {
    setTimeout(done, 250);
  });
});
```

## INTERFACES

Mocha 提供了 BDD,TDD,Exports,QUnit 和 Require-style 几种风格的接口。

### BDD

BDD 测试提供了 describe()，context()，it()，specify()，before()，after()，beforeEach()和 afterEach()这几种函数。

> context()是 describe()的别名，二者的用法是一样的。最大的作用就是让测试的可读性更好，组织的更好。相似地，specify()是 it()的别名。

###TDD

TDD 风格的测试提供了 suite(), test(), suiteSetup(), suiteTeardown(), setup(), 和 teardown()这几个函数:

```js
suite("Array", function () {
  setup(function () {
    // ...
  });

  suite("#indexOf()", function () {
    test("should return -1 when not present", function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
```

### Exports

Exports 的写法有的类似于 Mocha 的前身 expresso，键 before, after, beforeEach, 和 afterEach 都具有特殊的含义。对象值对应的是测试集合，函数值对应的是测试用例。

```js
module.exports = {
  before: function () {
    // ...
  },

  Array: {
    "#indexOf()": {
      "should return -1 when not present": function () {
        [1, 2, 3].indexOf(4).should.equal(-1);
      },
    },
  },
};
```

### QUNIT

QUNIT 风格的测试像 TDD 接口一样支持 suite 和 test 函数，同时又像 BDD 一样支持 before(), after(), beforeEach(), 和 afterEach()等钩子函数。

```js
function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite("Array");

test("#length", function () {
  var arr = [1, 2, 3];
  ok(arr.length == 3);
});

test("#indexOf()", function () {
  var arr = [1, 2, 3];
  ok(arr.indexOf(1) == 0);
  ok(arr.indexOf(2) == 1);
  ok(arr.indexOf(3) == 2);
});

suite("String");

test("#length", function () {
  ok("foo".length == 3);
});
```

### REQUIRE

require 可以使用 require 方法引入 describe 函数，同时，你可以为其设置一个别名。如果你不想再测试中出现全局变量，这个方法也是十分实用的。

注意：这种风格的测试不能通过 node 命令来直接运行，因为，这里的 require()方法 node 是不能够解析的，我们必须通过 mocha 来运行测试。

```js
var testCase = require("mocha").describe;
var pre = require("mocha").before;
var assertions = require("mocha").it;
var assert = require("chai").assert;

testCase("Array", function () {
  pre(function () {
    // ...
  });

  testCase("#indexOf()", function () {
    assertions("should return -1 when not present", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

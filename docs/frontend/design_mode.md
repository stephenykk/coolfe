# 设计模式

 设计模式（Design pattern），代表了最佳的实践，通常被有经验的面向对象的软件开发人员所采用。设计模式是软件开发人员在软件开发过程中面临的一般问题的解决方案。


 [前端常用设计模式](https://www.jianshu.com/p/4f3014fb8b8b)
 

## 观察者模式和发布订阅模式的区别

[观察者模式和发布订阅模式的区别](https://www.jianshu.com/p/594f018b68e7)

观察者模式中观察者和目标直接进行交互，而发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰。这样一方面实现了解耦，还有就是可以实现更细粒度的一些控制。

观察者模式

```js
class Observer {
  update(val) {
    // do sth
  }
}

class Subject {
  constructor() {
    this.obs = [];
  }

  addObserver(observer) {
    !this.obs.includes(observer) && this.obs.add(observer);
  }

  removeObserver(observer) {
    this.obs = this.obs.filter((ob) => ob !== observer);
  }

  notify(...args) {
    for (let observer of this.obs) {
      observer.update(...args);
    }
  }
}
```

发布订阅模式

```js
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(type, fn) {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }
    let subs = this.subscribers[type];
    !subs.includes(fn) && subs.push(fn);
    return this;
  }

  unsubscribe(type, fn) {
    let subs = this.subscribers[type] || [];
    if (!fn) {
      subs.length = 0;
    } else {
      subs = subs.filter((sub) => sub !== fn);
    }

    this.subscribers[type] = subs;
    return this;
  }

  publish(type, ...args) {
    let subs = this.subscribers[type] || [];
    for (let sub of subs) {
      sub(...args);
    }
  }
}
```

观察者模式由具体目标调度，每个被订阅的目标里面都需要有对观察者的处理，会造成代码的冗余。而发布订阅模式则统一由调度中心处理，消除了发布者和订阅者之间的依赖。

观察者模式跟我们平时用的事件也有一定的关系，比如：

```js
ele.addEventListener("click", () => {});
```

addEventListener 就相当于注册了一个观察者，当观察到‘click’事件的时候，作出一些处理。


## 设计原则

> 我们常说的SOLID原则，是包括单一职责原则、开闭原则、里式替换原则、接口隔离原则和依赖反转原则这五个，与五个英文字母一一对应。 今天，就先来看一下单一职责原则。

### 单一职责原则

对于类或模块或者函数等，不要设计的大而全，尽量粒度小、功能单一，只包含一个职责。

> 容易测试和复用

如何看类或方法是否满足单一职责原则呢？

下面通过一个例子让我们一起来学习一下。就拿疫情期间学生上网课来说吧，StudentInfo类大致会包含以下字段：
```java
class StudentInfo {
  private name: string; // 姓名
  private age: number; // 年龄
  private class: string; // 班级
  private date: string; // 上课日期
  private onlineStartTime: string; // 网课开始时间
  private onlineEndTime: string; // 网课结束时间
  private province; // 省
  private city; // 市
  private region; // 地区
  private detailedAddress;  // 详细地址
}
```

不满足单一职责原则的情况：

- 类中的代码行数、函数或属性过多，会影响代码的可读性和可维护性
- 类依赖的其他类过多，或依赖类的其他类过多，不符合高内聚、低耦合的思想
- 私有方法过多，就要考虑能否将私有方法独立到新的类中，设置为public，供更多的类使用，提高代码复用性。
- 比较难给类起一个合适的名字，很难用一个业务名词概括，或只能用笼统的词语来命名，就说明类的职责可能不够清晰
- 类中大量的方法都是集中操作类的某几个属性，就可以考虑将这几个属性和对应的方法拆分出来。

### 开闭原则

在经典的设计模式中，大部分设计模式都是为了解决代码的扩展性而存在的，主要遵从的原则就是开闭原则，所以理解开闭原则并能灵活应用很重要。

> 英文全称：Open Closed Principle（OCP）。开闭原则是对什么开放又是对什么关闭呢？是对扩展开放，对修改关闭。详细描述一下就是：添加一个新的功能时，应该在已有代码的基础上扩展代码（新增模块、类、方法等），而非修改已有代码（修改模块、类、方法等）。

这条原则的意义是什么呢？对扩展开放是为了应对需求变化，对修改关闭是为了保证原有代码的稳定性。在识别出代码可变部分和不可变部分之后，要将可变部分封装起来，隔离变化，提供抽象化的不可变接口，给上层使用。

```ts
class Verification {
    private handlers: VerifyHandler[] = [];

    public addHandler(handler: VerifyHandler) {
        this.handlers.push(handler)
    }

    public checkAll() {
        return this.handlers.every(handler => handler.check() === true)
    }

    public init(...handlers) {
        handlers.forEach(this.addHandler.bind(this))
        return this
    }
}

interface VerifyHandler {
    check(): boolean
}

class UserHandler implements VerifyHandler {
    public check() {
        return state.username !== ''
    }
}
class PwdHandler implements VerifyHandler {
    public check() {
        return state.pw !== ''
    }
}

function checkLogin() {
    let verification = new Verification().init(new UserHandler(), new PwdHandler())
    if(!verification.checkAll()) {
        return false
    }
}
```

> 有时候，代码的可扩展性跟可读性不能两者兼顾，要做一些权衡和取舍。

**如何做到“对扩展开放、对修改关闭”**

最常用来提高代码扩展性的方法有：多态、基于接口而非实现编程、依赖注入，以及大部分设计模式（比如：装饰、策略、模板、职责链、状态等）。


### 里式替换原则（LSP）

大概意思就是在程序中子类可以替换父类，而且不会产生任何错误。但是父类不能替换子类。

**LSP的意义是什么**

```js
class Retry {
    public async getData(request) {
        for(let times = 1; ; times++) {
            try {
                const res = await request()
                if(res.code < 500) {
                    return res
                }
            }catch(e) {
                throw e
            }
        }
    }
}

// MyRetry 可 替代 父类 Retry; 反过来就不行
// 因为子类完全复现了父类的行为
class MyRetry extends Retry {
    public async getData(request) {
        for(let times = 1; ; times++) {
            try {
                const res = await request()
                if(res.code < 500) {
                    res.times = times
                    return res
                }
            }catch(e) {
                throw e
            }
        }
    }
}

```

里式替换原则可以降低继承带来的复杂度。
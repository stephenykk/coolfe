vue-router
===============
安装
--------

    //安装
    npm install vue-router 
    bower install vue-router

    //调用
    var Vue = require('Vue');
    var VueRouter = require('Vue-router');
    Vue.use(VueRouter);

    //在浏览器环境引入vue-router.js会自动调用 Vue.use(VueRouter);

基本使用
------------

    <div id="app">
        <h1>Hello App</h1>
        <p>
            <!-- 使用指令v-link进行导航 -->
            <a v-link="{path: '/foo'}">Go to Foo</a>
            <a v-link="{path: '/bar'}">Go to Bar</a>
        </p>
        <!--路由切换的视图-->
        <router-view></router-view>
    </div>
    <script type="text/javascript">
    //定义组件
    var Foo = Vue.extend({
            template: '<p>this is foo!</p>'
        });
    var Bar = Vue.extend({
            template: '<p>this is bar！</p>'
        })；

    //创建根组件
    var App = Vue.extend({});

    //创建路由器实例
    var router = new VueRouter({});
    //配置路由规则 路由规则映射到组件，组件会被渲染在router-view元素中
    router.map({
        '/foo': {
            component: Foo
        },
        '/bar': {
            component: Bar
        }
    });

    //在App组件上启动路由 ，会自动创建App的实例，并挂载到#app元素上
    router.start(App, '#app');
    </script>


嵌套路由
--------------

    <div id="app">
        <!--顶级外链-->
        <router-view></router-view> 
    </div>

    <script>
        var App = Vue.extend({}); //根组件
        var Foo = Vue.extend({
                template: '<div class="foo">' +
                            '<h2>this is foo!</h2>' +
                            '<router-view></router-view>' +
                          '</div>';
            });
        var Bar = Vue.extend({
                tempalte: '<p>this is bar</p>'
            });

        var router = new VueRouter({}); //路由器实例
        //定义路由规则
        router.map({
            '/foo': {
                component: Foo, //当路由匹配到/foo时，渲染一个Foo组件
                subRoutes: {//子路由规则
                    '/bar': {
                        component: Bar, //当路由匹配/foo/bar时，渲染一个Bar组件在Foo's <router-view>
                        auth: true //自定义属性
                    },
                    '/': {
                        component: {
                            template: '<p>default subview for Foo</p>'; //Foo's<router-view>默认内容
                        }
                    }
                }
            }
        });
        //启动路由
        router.start(App, '#app');

路由规则和路由匹配
--------------------
**路由对象**: 在使用`vue-router`的应用中, 路由对象会被注入到每个组件中, 通过 `vm.$route` 访问. 当路由切换时，路由对象会被更新。

> 通过 element.__vue__访问 vm对象, 然后就可以访问到路由对象 vm.$route, vm._watchers 数据观察

### 路由对象的属性:

+ **$route.path**  路由路径(解析后的绝对路径 如: /foo/bar)
+ **$route.params** 捕获的路径参数
+ **$route.query** url的查询参数queryString (如: /foo?user=1, $route.query.user==1)
+ **$route.router** 路由对象所属的路由器
+ **$route.matched** 数组，包含当前匹配路径中包含的片段及其对应的配置参数
+ **$route.name** 当前路径的名称
+ **自定义字段** 设置路由表时的其他自定义字段

### 在模板中使用路由对象$route

    <div>
        <p>当前路径: {{$route.path}}< /p>
        <p>当前路由参数： {{$route.params}} < /p>
    < /div>

### 动态片段

    router.map({
        '/user/:username': {//动态片段 :username, 匹配 /user/windy
            component: {
                template: '<p>用户名是{{$route.params.username}}< /p>'
            }
        },
        '/user/:username/post/:postid': {//1条路径可包含多个动态片段
            component: {
                template: '<p>用户名是{{$route.params.username}}，当前文章:{{$route.params.postid}}< /p>'
            }
        }
    });


### 全匹配片段
动态片段只能匹配路径的一部分(segment) 如:(/user/:username 规则，在访问/user/windy/post/2时, username只匹配了url的/windy/段)

全匹配片段即贪婪版的动态片段

    /user/*any   #访问路径 /user/a/b/c -> $route.params={any: 'a/b/c'};
    /user/*any/bar #访问路径 /user/a/b/bar -> $route.params={any: 'a/b'};


具名路径
--------------
在有些情况下，给一条路径加上一个名字能够让我们更方便地进行路径的跳转。你可以按照下面的示例给一条路径加上名字：

    <a v-link="{name: 'user', params:{userId:123} }">user< /a>
    <script>
        router.map({
            name: 'user', //给路径命名
            '/user/:userId': {
                component: Foo
            }
        });

        //路由切换 除了 v-link指令，还可以JS切换
        router.go({name:'user', params:{userId: 123}}); //效果同上
    < /script>

路由配置项
---------------

    //创建路由器实例
    var router = new VueRouter(config);

**路由器配置项包括：**

+ **hashbang**  , 默认true, 所有路径被格式化为 `#!`开始, 如 `router.go('/foo/bar')` 浏览器url会变为 example.com/#!/foo/bar
+ **history** , 默认false, 是否使用HTML5 history API(`history.pushState()`, `history.replaceState()` ), 需要服务器做响应配置，不然容易404
+ **abstract** , 默认false, 不依赖于浏览器的浏览历史的虚拟管理后端
+ **root** , 默认null, 根路径作用类似 <base />标签, 路由规则的所有路径都以此为根， 根路径功能需 `history` 设置为true 才可用
+ **linkActiveClass**  , 默认 v-link-active v-link指令指定的路由和当前url匹配 则v-link所在元素添加 v-link-active
+ **saveScrollPosition** 默认 false, HTML5 history模式下可用
+ **transitionOnLoad** 默认 false, 切换时的过度效果
+ **suppressTransitionError** 默认false, 场景切换钩子函数中发生的异常会被吞掉

router-view
--------------
<router-view> 用于渲染匹配的组件，它基于 Vue 的动态组件系统，所以它继承了一个正常动态组件的很多特性。

+ 可以传递 `props`
+ `<router-view></router-view>` 中的内容可以插入到组件中(content属性指定插入点)
+ `v-transition` `transtion-mode`的完整支持, 注意要有组件需有根元素
+ `v-ref`也支持

v-link
--------------
`v-link`是用来在不同路径间跳转的指令，接受一个表达式 `v-link="expr"` , 点击元素时，会自动调用 `router.go(expr) `

    <!--字面量路径 字符串or对象 -->
    <a v-link="'home'">home</a>
    <a v-link="{path: 'home'}">home</a>

    <!--跳转到 具名路径-->
    <a v-link="{name: 'user',  params:{userId: 123} }">user</a>

`v-link`指令表达式可用的属性:

+ name
+ path
+ params
+ activeClass
+ exact   //添加activeClass时，用完全匹配去检测是否满足
+ replace  //跳转时 调用 `router.replace(expr)` 而不是 `router.go(expr)`
+ append  //path为相对路径时，目标路径是path追加到现有路径 ， 如: /foo  v-link="{path:'bar', append: true}"  则跳转到 /foo/bar

> 注意: `v-link` 指令会自动设置 `a` 标签的 `href`属性， 所以 `<a v-link="'home'" href="javascript:;" >home</a>`  ，指定 `href` 属性是多余的
> 

动态载入组件
--------------

    //异步加载跟路由规则相对应的组件
    router.map({
        '/user': {
            component: function(resolve){
                require(['./user.vue'],resolve);//异步加载user.vue AMD方式require的包,webpack会自动分割为独立的trunk
            }
        }
    });


切换钩子函数 
--------------
`<router-view>` 通过一些钩子函数来控制视图切换的过程， 钩子函数包括:

+ data //activate后执行data函数, 用于获取视图所需的数据
+ activate //执行激活或停用阶段
+ deactivate 
+ canActivate //检测是否可激活或停用阶段
+ canDeactivate
+ canReuse  //检测是否可重用阶段

我们可以在组件`route`选项实现这些函数

    Vue.component('hooks-example', {
        template: ..,
        data: function(){ .. },
        route: {
            activate: function(transition){
                console.log('hooks-example activate!');
                transition.next(); //继续切换过程
            },
            deactivate: function(transition){
                console.log('hooks-example deactivate!~');
                transition.next();
            }
        }    
    });

###切换对象
每个切换钩子函数都会传入 **切换对象(transition)** 参数, 切换对象的属性包括:

+ `transition.to`  将切换到路径所对应的路由对象(vm.$route)
+ `transition.from` 当前路径所对应的路由对象
+ `transition.next()` 继续切换过程 resolve
+ `transition.abort([reason])` 停止切换过程 reject
+ `transition.redirect(path)` 取消切换并重定向到另一个路由

###异步钩子函数的resolve规则
我们经常需要在钩子函数中进行异步操作。在一个异步的钩子被 resolve 之前，切换会处于暂停状态。钩子的 resolve 遵循以下规则：

+ 若钩子函数返回一个promise, 则钩子函数随promise的resolve，一起resolve(自动调用 transition.next() )
+ 若钩子函数不返回promise,也没任何参数，则钩子函数被同步resolve. 例如:
        
        Vue.extend({
            template: ..
            route: {
                activate: function(){
                    //无参数，且不返回promise, 同步resolve该钩子函数
                }
            }
        });
+ 钩子函数被transition的方法resolve

        Vue.extend({
            template: ..,
            route: {
                activate: function(transition){
                    setTimeout( transition.next, 1000);
                    //setTimeout( transition.abort, 1000);
                    //setTimeout( function(){transition.redirect('/')}, 1000);
                }
            }
        });

+ 验证类的钩子函数(canActivate, canDeactivate) 和 全局类钩子(beforeEach) ,如返回值是一个布尔值，则同步resolve

###在钩子中返回 Promise
+ 如果 Promise 在验证阶段被 reject，系统会调用 transition.abort。
+ 如果 Promise 在激活阶段被 reject，系统会调用 transition.next 。
+ 对于验证类钩子（ canActivate 和 canDeactivate ），如果 Promise resolve 之后的值是假值（ falsy value ），系统会中断此次切换。
+ 如果一个被 reject 的 Promise 抛出了未捕获的异常，这个异常会继续向上抛出，除非在创建路由器的时候启用了参数 suppressTransitionError 。

    // 在组件定义内部
    route: {
      canActivate: function () {
        // 假设此 service 返回一个 Promise ，这个 Promise 被resolve后
        // 的值是 `true` 或者 `false`
        return authenticationService.isLoggedIn()
      },
      activate: function (transition) {
        return messageService
          .fetch(transition.to.params.messageId)
          .then((message) => {
            // 获取数据后更新 data
            // 组件直到此函数执行过后才会被展示出来
            this.message = message
          })
      }
    }
    //activate 钩子中异步的获取数据，因为这里仅仅是做个示例；注意通常我们可以使用 data 钩子来做这些，它会更加适合

###钩子合并
路由生命周期钩子:

+ data
+ activate 
+ deactivate 

和组件的生命周期钩子一样，这些钩子函数若有重复则和合并为函数数组，都被执行。如： 
  
    var mixin={
        route:{activate: function(){..}}
    }; 
    Vue.extend({
        mixin: mixin, 
        route: { activate: function(){..} }
    }));

> 需要注意的是，验证类钩子，比如 canActivate, canDeactivate 和 canReuse 在合并选项时会直接被新值覆盖。


###data钩子函数
`data: callback(transition)` 在激活阶段，activate被resolve后,界面切换前，调用 data钩子，用于加载组件数据

    data: function(transition){
        transition.next({a:1, b:2}); //为组件的data属性赋值, 相当于vm.$set(a,1); vm.$set(b, 2);
    }

> 切换进来的组件会得到一个名为 $loadingRouteData 的元属性，其初始值为 true ，在 data 钩子函数被断定后会被赋值为 false 。这个属性可用来会切换进来的组件展示加载效果。

**data 钩子和 activate 钩子的不同之处在于：**

+ data在每次路由变动时都会被调用，即使是当前组件可以被重用的时候，但是 activate 仅在组件是新创建时才会被调用。

        > 假设我们有一个组件对应于路由 /message/:id ，当前用户所处的路径是 /message/1 。当用户浏览 /message/2 时，当前组件可以被重用，所以 activate 不会被调用。但是我们需要根据新的 id 参数去获取和更新数据，所以大部分情况下，在 data 中获取数据比在 activate 中更加合理。

+ activate 的作用是控制切换到新组件的时机。data 切换钩子会在 activate 被断定（ resolved ）以及界面切换之前被调用，所以数据获取和新组件的切入动画是并行进行的，而且在 data 被断定（ resolved ）之前，组件会处在“加载”状态。

>如果你想等到数据获取之后再切换视图，可以在组件定义路由选项时，添加 waitForData: true 参数。

    //transition.next();
    Vue.component('Foo', {
        template: ..,
        route: {
            data: function(transition){
                setTimeout(function(){
                    transition.next({msg: 'data fetched'});
                }, 1000);
            }
        }    
    });

    //返回promise 
    Vue.extend({
        template: ..,
        route: {
            data: function(transition){
                return messageService.fetch(transition.to.params.messageId)
                        .then(function(msg){
                            return {msg: msg};
                        });
            }
        }
    });

    //并发ajax请求
    Vue.extend({
        template: ..,
        route: {
            data({to: {params:{userId}}}){
                return Promise.all([
                    userService.get(userId),
                    postService.getForUser(userId)
                ]).then( ([user, post])=>({user, post}) )
            }
        }
    });


在模板中使用 $loadingRouteData ：

    <div class="view">
      <div v-if="$loadingRouteData">Loading ...</div>
      <div v-if="!$loadingRouteData">
        <user-profile user="{{user}}"></user-profile>
        <user-post v-repeat="post in posts"></user-post>
      </div>
    </div>

###Promise 语法糖

    route: {
        data( {to: { params: {userId} }} )=>({
            user: userService.get(userId),
            posts: postService.getForUser(userId)
        })
    }

### activate 
`activate: function(transition)`  在激活阶段，当组件被创建而且将要切换进入的时候被调用。 

调用 transition.next() 可以断定（ resolve ）这个钩子函数。注意，这里调用 transition.abort() 并不会把应用回退到前一个路由状态因为此时切换已经被确认合法了。

### deactivate
`deactivate: function(transition) ` 在激活阶段，当一个组件将要被禁用和移除之时被调用。 其他同 activate钩子

新组件的 activate 钩子函数会在所有组件的 deactivate 钩子函数被断定（ resolved ）之后被调用

###canActivate 
`canActivate:function(transition) -> Promise | Boolean` 在验证阶段，当一个组件将要被切入的时候被调用。

调用 transition.next() 可以断定（ resolve ）此钩子函数。调用 transition.abort() 可以无效化并取消此次切换。

> 在验证阶段可以取消这次视图切换

###canDeactivate 
`canDeactivate:function(transition) -> Promise | Boolean` 在验证阶段，当一个组件将要被切出的时候被调用。

###canResuse
`canReuse: Boolean | canReuse(transition) -> Boolean`

决定组件是否可以被重用。如果一个组件不可以重用，当前实例会被一个新的实例替换，这个新实例会经历正常的验证和激活阶段。

此路由配置参数可以是一个 Boolean 值或者一个同步返回 Boolean 值的函数。默认值为 true

>在 canReuse 钩子中只能访问 transition.to 和 transition.from

如果组件可以重用，它的 data 钩子在激活阶段仍然会被调用。

API
=========================
路由实例属性和方法 router
------------------
+ `router.app`  返回此路由器管理的根实例, router.start(App, '#app'); App组件类的实例
+ `router.mode` 路由模式 **hash, html5 或 abstract**
+ `router.start(App, el)` 创建App组件的实例并在上面启用路由，然后挂载到el上
    **App** 可以是 Vue 组件构造函数或者一个组件选项对象。  
    **el** 挂载应用的元素。可以是 CSS 选择符或者一个实际的元素。
+ `router.stop()` 停止监听 `popstate` 和 `hashchange` 事件
    注意，当路由处于停止状态，router.app 并没有销毁，你依然可以使用 router.go(path) 进行跳转。你也可以不使用参数调用 router.start() 来重新启动路由。

+ `router.map(routeMap)` 定义路由映射
    
        router.map({
          // 组件构造函数
          '/a': {
            component: Vue.extend({ /* ... */ })
          },
          // 组件选项对象
          '/b': {
            component: {
              template: '<p>Hello from /b</p>'
            }
          },
          // 嵌套的路由
          '/c': {
            component: {
              // 渲染子视图
              template: '<router-view></router-view>'
            },
            subRoutes: {
              // 当路径是 /c/d 时进行渲染
              '/d': { component: { template: 'D' }},
              // 当路径是 /c/e 时进行渲染
              '/e': { component: { template: 'E' }}
            }
          }
        })

+ `router.on(path, config)` 动态添加路由配置 在内部实现时，router.map() 对于接收到的路由映射对象中每个键值对都调用 router.on() 。

        router.on('/user/:userId', {
          component: {
            template: '<div>{{$route.params.userId}}</div>'
          }
        })

+ `router.go(path)` 路由跳转 *path*可以是一个字符串，或是包含跳转信息的对象。 **路径若不是以 / 开头的绝对路径，会以相对于当前路径的方式进行解析。** 

        //path参数
        {
          name: '...',
          // params 和 query 可选
          params: { ... },
          query: { ... }
        }
+ `router.replace(path)` 路由跳转 但不产生新的历史记录 
    path参数为String。路径不能以 / 开头，会以相对于当前路径的方式进行解析。

+ `router.redirect(redirectMap)` 为路由器定义全局重定向规则. 全局的重定向会在匹配当前路径之前执行。如果发现需要进行重定向，原本访问的路径会被直接忽略而且不会在浏览器历史中留下记录。

    router.redirect({

      // 重定向 /a 到 /b
      '/a': '/b',

      // 重定向可以包含动态片段
      // 而且重定向片段必须匹配
      '/user/:userId': '/profile/:userId',

      // 重定向任意未匹配路径到 /home
      '*': '/home'
    })

+ `router.alias(aliasMap)` 为路由器设置全局的别名规则. 为路由器配置全局的别名规则。别名和重定向的区别在于，相对于重定向把 fromPath 替换为 toPath ，别名会保留 fromPath ，但是匹配时使用的是 toPath 。

    router.alias({

      // 匹配 /a 时就像是匹配 /a/b/c, ::地址栏还是/a , 但匹配时用 /a/b/c 进行匹配
      '/a': '/a/b/c',

      // 别名可以包含动态片段
      // 而且重定向片段必须匹配
      '/user/:userId': '/user/profile/:userId'
    })
+ `router.beforeEach(hook)` 全局的前置钩子函数，这个函数会在路由切换开始时调用。调用发生在整个切换流水线之前。如果此钩子函数拒绝了切换，整个切换流水线根本就不会启动。

你可以注册多个全局的前置钩子函数。这些函数会按照注册的顺序被调用。调用是异步的，后一个函数会等待前一个函数完成后才会被调用。

    router.beforeEach(function (transition) {
      if (transition.to.path === '/forbidden') {
        transition.abort()
      } else {
        transition.next()
      }
    })

    router.beforeEach(function ({ to, next }) {
      if (to.path === '/auth-required') {
        // 返回一个断定会 true 或者 false 的 Promise
        return AuthService.isLoggedIn()
      } else {
        next()
      }
    })

+ `router.afterEach(hook)` 全局的后置钩子函数，该函数会在每次路由切换成功进入激活阶段时被调用。 

    注意，该函数调用时仅仅意味着切换已经被验证过了，也就是所有 canDeactivate 和 canActivate 钩子函数都成功的被断定( resolved )了，而且浏览器地址栏中的地址也已经更新。并不能保证所有的 activate 钩子函数都被resolve了。 **注意: 后置钩子函数里不能调用任何切换函数。**

    你可以注册多个全局的后置钩子函数，这些函数将会按照注册的顺序被同步调用。

        router.afterEach(function (transition) {
          console.log('成功浏览到: ' + transition.to.path)
        })
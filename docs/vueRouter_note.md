vue-router2.x
===============
安装
--------
    // cdn
    https://unpkg.com/vue-router/dist/vue-router.js
    
    //安装
    npm install vue-router 
    bower install vue-router

    //调用
    var Vue = require('Vue');
    var VueRouter = require('vue-router');
    Vue.use(VueRouter);

    //在浏览器环境引入vue-router.js会自动调用 Vue.use(VueRouter);

基本使用
------------

    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

    <div id="app">
      <h1>Hello App!</h1>
      <p>
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/foo">Go to Foo</router-link>
        <router-link to="/bar">Go to Bar</router-link>
      </p>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </div>

    // 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)

    // 1. 定义（路由）组件。
    // 可以从其他文件 import 进来
    const Foo = { template: '<div>foo</div>' }
    const Bar = { template: '<div>bar</div>' }

    // 2. 定义路由
    // 每个路由应该映射一个组件。 其中"component" 可以是
    // 通过 Vue.extend() 创建的组件构造器，
    // 或者，只是一个组件配置对象。
    // 我们晚点再讨论嵌套路由。
    const routes = [
      { path: '/foo', component: Foo },
      { path: '/bar', component: Bar }
    ]

    // 3. 创建 router 实例，然后传 `routes` 配置
    // 你还可以传别的配置参数, 不过先这么简单着吧。
    const router = new VueRouter({
      routes // （缩写）相当于 routes: routes
    })

    // 4. 创建和挂载根实例。
    // 记得要通过 router 配置参数注入路由，
    // 从而让整个应用都有路由功能
    const app = new Vue({
      router
    }).$mount('#app')

    // 现在，应用已经启动了！


要注意，当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active

动态路由匹配
------------
我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。
    
    const User = {
      template: '<div>User {{ $route.params.id }}</div>'
    }

    const router = new VueRouter({
      routes: [
        // 动态路径参数 以冒号开头 
        // 匹配 /user/foo (this.$route.params.id === 'foo'), /user/bar
        { path: '/user/:id', component: User },

        //1条路径可包含多个动态片段
        {path: '/user/:username/post/:postid', component: User}
      ]
    })

响应路由参数的变化
---
从 /user/foo 导航到 user/bar，原来的User组件实例会被复用, 想对路由参数的变化作出响应的话，你可以简单地 watch（监测变化） $route 对象

    const User = {
      template: '...',
      watch: {
        '$route' (to, from) {
          // 对路由变化作出响应...
        }
      }
    }

或者使用 2.2 中引入的 beforeRouteUpdate

    const User = {
      template: '...',
      beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
      }
    }

高级匹配模式
---
vue-router 使用 path-to-regexp 作为路径匹配引擎，查看它的 [文档](https://github.com/pillarjs/path-to-regexp#parameters) 学习高阶的路径匹配.

匹配优先级
---
有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

嵌套路由
--------------

    <div id="app">
      <router-view></router-view>
    </div>

    const User = {
      template: `
        <div class="user">
          <h2>User {{ $route.params.id }}</h2>
          <router-view></router-view>
        </div>
      `
    }

    const router = new VueRouter({
      routes: [
        { path: '/user/:id', component: User,
          children: [
            // 当 /user/:id 匹配成功，
            // UserHome 会被渲染在 User 的 <router-view> 中
            { path: '', component: UserHome },

            {
              // 当 /user/:id/profile 匹配成功，
              // UserProfile 会被渲染在 User 的 <router-view> 中
              path: 'profile',
              component: UserProfile
            },
            {
              // 当 /user/:id/posts 匹配成功
              // UserPosts 会被渲染在 User 的 <router-view> 中
              path: 'posts',
              component: UserPosts
            }
          ]
        }
      ]
    })

编程式的导航
---
除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
    
### `router.push(location, onComplete?, onAbort?); // this.$router === router`

    // 字符串
    router.push('home')

    // 对象
    router.push({ path: 'home' })

    // 命名的路由 /user/123
    router.push({ name: 'user', params: { userId: 123 }}) 

    // 带查询参数，变成 /register?plan=private
    router.push({ path: 'register', query: { plan: 'private' }})

    const userId = 123
    router.push({ name: 'user', params: { userId }}) // -> /user/123
    router.push({ path: `/user/${userId}` }) // -> /user/123
    // 这里的 params 不生效
    router.push({ path: '/user', params: { userId }}) // -> /user

### `router.replace(location, onComplete?, onAbort?)`
跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。


### `router.go(n)`
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。

    // 在浏览器记录中前进一步，等同于 history.forward()
    router.go(1)

    // 后退一步记录，等同于 history.back()
    router.go(-1)

    // 前进 3 步记录
    router.go(3)

    // 如果 history 记录不够用，那就默默地失败呗
    router.go(-100)
    router.go(100)


你也许注意到 router.push、 router.replace 和 router.go 跟 window.history.pushState、 window.history.replaceState 和 window.history.go好像， 实际上它们确实是效仿 window.history API 的。

因此，如果你已经熟悉 Browser History APIs，那么在 vue-router 中操作 history 就是超级简单的。

命名路由
---
有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。

    const router = new VueRouter({
      routes: [
        {
          path: '/user/:userId',
          name: 'user',
          component: User
        }
      ]
    })

    <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>


命名视图
---
有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了
如果 router-view 没有设置名字，那么默认为 default。

    <router-view class="view one"></router-view>
    <router-view class="view two" name="a"></router-view>
    <router-view class="view three" name="b"></router-view>

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）：

    const router = new VueRouter({
      routes: [
        {
          path: '/',
          components: {
            default: Foo,
            a: Bar,
            b: Baz
          }
        }
      ]
    })    

重定向
---

    // 下面例子是从 /a 重定向到 /b
    const router = new VueRouter({
      routes: [
        { path: '/a', redirect: '/b' }
      ]
    })
    
    // 重定向的目标也可以是一个命名的路由：
    const router = new VueRouter({
      routes: [
        { path: '/a', redirect: { name: 'foo' }}
      ]
    })
    
    // 甚至是一个方法，动态返回重定向目标
    const router = new VueRouter({
      routes: [
        { path: '/a', redirect: to => {
          // 方法接收 目标路由 作为参数
          // return 重定向的 字符串路径/路径对象
        }}
      ]
    })

别名
---
『重定向』的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么『别名』又是什么呢？

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

上面对应的路由配置为：

    const router = new VueRouter({
      routes: [
        { path: '/a', component: A, alias: '/b' }
      ]
    })

『别名』的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。

路由组件传参
---
在组件中使用$route会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的url上使用，限制了其灵活性。

使用props将组件和路由解耦：

### 与$route耦合
    const User = {
      template: '<div>User {{ $route.params.id }}</div>'
    }
    const router = new VueRouter({
      routes: [
        { path: '/user/:id', component: User }
      ]
    })

### 使用props解耦

    const User = {
      props: ['id'],
      template: '<div>User {{ id }}</div>'
    }
    const router = new VueRouter({
      routes: [
        { path: '/user/:id', component: User, props: true }

        // 对于包含命名视图的路由，你必须分别为每个命名视图添加props选项：
        {
          path: '/user/:id',
          components: { default: User, sidebar: Sidebar },
          props: { default: true, sidebar: false }
        }
      ]
    })


HTML5 History 模式
---
 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

    const router = new VueRouter({
      mode: 'history',
      routes: [...]
    })

history需要后端配置

后端配置例子
---
### apache
    
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>

### nginx

    location / {
      try_files $uri $uri/ /index.html;
    }

### node.js

    const http = require('http')
    const fs = require('fs')
    const httpPort = 80

    http.createServer((req, res) => {
      fs.readFile('index.htm', 'utf-8', (err, content) => {
        if (err) {
          console.log('We cannot open 'index.htm' file.')
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        })

        res.end(content)
      })
    }).listen(httpPort, () => {
      console.log('Server listening on: http://localhost:%s', httpPort)
    })

导航钩子
---
全局的, 单个路由独享的, 或者组件级的。

    const router = new VueRouter({ ... })

    router.beforeEach((to, from, next) => {

      // ...
    })
    router.afterEach((to, from) => {
      // ...
    })

    const router = new VueRouter({
      routes: [
        {
          path: '/foo',
          component: Foo,
          beforeEnter: (to, from, next) => {
            // ...
          }
        }
      ]
    })

    const Foo = {
      template: `...`,
      beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
        // 可以回调方式访问vm
        next(vm => {
            // ..
        });
      },
      beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
      },
      beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // 这个离开钩子通常用来禁止用户在还未保存修改前突然离开。可以通过 next(false) 来取消导航
      }
    }

- to: Route: 即将要进入的目标 路由对象

- from: Route: 当前导航正要离开的路由

- next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

        - next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。

        - next(false): 中断当前的导航。

        - next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。

        - next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。


确保要调用 next 方法，否则钩子就不会被 resolved。

完整的导航解析流程
---

1. 导航被触发。
1. 在失活的组件里调用离开钩子。
1. 调用全局的 beforeEach 钩子。
1. 在重用的组件里调用 beforeRouteUpdate 钩子 (2.2+)。
1. 在路由配置里调用 beforeEnter。
1. 解析异步路由组件。
1. 在被激活的组件里调用 beforeRouteEnter。
1. 调用全局的 beforeResolve 钩子 (2.5+)。
1. 导航被确认。
1. 调用全局的 afterEach 钩子。
1. 触发 DOM 更新。
1. 用创建好的实例调用 beforeRouteEnter 钩子中传给 next 的回调函数。

路由元信息
---
定义路由的时候可以配置 meta 字段：

    const router = new VueRouter({
      routes: [
        {
          path: '/foo',
          component: Foo,
          children: [
            {
              path: 'bar',
              component: Bar,
              // a meta field
              meta: { requiresAuth: true }
            }
          ]
        }
      ]
    })


    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!auth.loggedIn()) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      } else {
        next() // 确保一定要调用 next()
      }
    })

过渡动效
---
`<router-view>` 是基本的动态组件，所以我们可以用 `<transition> `组件给它添加一些过渡效果：

    <transition>
      <router-view></router-view>
    </transition>

`<transition>` 的所有功能 在这里同样适用。

    <!-- 使用动态的 transition name -->
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
    // 接着在父组件内
    // watch $route 决定使用哪种过渡
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }

路由懒加载
---
结合 Vue 的异步组件和 Webpack 的代码分割功能，轻松实现路由组件的懒加载。

首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：

    const Foo = () => Promise.resolve({ /* 组件定义对象 */ })

第二，在 Webpack 2 中，我们可以使用动态 import语法来定义代码分块点 (split point)：

    import('./Foo.vue') // 返回 Promise

> 注意：如果您使用的是 Babel，你将需要添加 syntax-dynamic-import 插件，才能使 Babel 可以正确地解析语法。

    const Foo = () => import('./Foo.vue')
    const router = new VueRouter({
      routes: [
        { path: '/foo', component: Foo }
      ]
    })

有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，

    const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
    const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
    const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')



Router 构造配置
---
`new VueRouter({routes: [routeConfig, ..]})`

    new VueRouter({
        routes,
        base,
        mode,
        linkActiveClass,
        linkExactActiveClass,
        scrollBehavior,
        parseQuery,
        fallback    
    })

### routeConfig

    declare type RouteConfig = {
      path: string;
      component?: Component;
      name?: string; // 命名路由
      components?: { [name: string]: Component }; // 命名视图组件
      redirect?: string | Location | Function;
      props?: boolean | string | Function;
      alias?: string | Array<string>;
      children?: Array<RouteConfig>; // 嵌套路由
      beforeEnter?: (to: Route, from: Route, next: Function) => void;
      meta?: any;

      // 2.6.0+
      caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
      pathToRegexpOptions?: Object; // 编译正则的选项
    }
    


Router 实例
---

    router = {
        app,
        mode,
        currentRoute

        beforeEach,
        beforeResolve,
        afterEach,

        push,
        replace,
        go,
        back,
        forward,

        resolve,
        getMatchedComponents,

        addRoutes,
        onReady,
        onError,

    }

路由信息对象
---
route object 是 immutable（不可变） 的，每次成功的导航后都会产生一个新的对象。

    this.$route = {
        path,
        fullPath,
        params,
        query,
        hash,
        matched,
        name
    }


`<router-link>`
---
`<router-link to replace append tag active-class exact exact-active-class event></router-link>`

`<router-link> `组件支持用户在具有路由功能的应用中（点击）导航。 通过 to 属性指定目标地址，默认渲染成带有正确链接的 `<a>` 标签，可以通过配置 tag 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。

    <!-- 字符串 -->
      <router-link to="home">Home</router-link>
      <!-- 渲染结果 -->
      <a href="home">Home</a>

      <router-link :to="'home'">Home</router-link>

      <!-- 同上 -->
      <router-link :to="{ path: 'home' }">Home</router-link>

      <!-- 命名的路由 -->
      <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

      <!-- 带查询参数，下面的结果为 /register?plan=private -->
      <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>


将激活 class 应用在外层元素

    <router-link tag="li" to="/foo">
      <a>/foo</a>
    </router-link>

`<router-view>`
---
`<router-view name> </router-view>` 组件是一个 functional 组件，渲染路径匹配到的视图组件

其他属性（非 router-view 使用的属性）都直接传给渲染的组件， 很多时候，每个路由的数据都是包含在路由参数中。

因为它也是个组件，所以可以配合 `<transition>` 和 `<keep-alive> `使用。如果两个结合一起用，要确保在内层使用 

    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
vuex2.x
============

安装
----

+ cdn引用

        <script src="path/to/vue.js"></script>
        <script src="path/to/vuex.js"></script>

+ npm安装

        npm i vuex --save
        yarn add vuex

        Vue.use(Vuex);


简介
----
为**vuejs**专门设计的集中式状态管理架构，借鉴了 **flux** 和 **redux** 的设计思想

通常整个应用的状态散落在各个组件的内部, 当需要把一部分状态"发送"给其他组件时，通常用自定义事件的方式(*vm.$dispatch, pvm.$broadcast*)，大应用中比较难跟踪和调试。

大应用中，把状态分为 **组件本地状态** 和 **应用级的状态**, 集中式的状态管理，更容易的记录和观察状态变化(*mutation*).

Vuex应用的核心是**store**, store是状态的容器，和全局对象有以下不同:

1. store存储的状态是响应式的 (*store中状态改变，依赖该状态的组件会得到更新*)
2. 不能直接修改store中的状态 (**只能**通过派发action的方式 `dispatch action` , `action commit mutation` ，修改store的状态)

示例：

    import Vuex from 'vuex';

    const state = { count: 0 };
    const mutations = {
        INCREMENT(state){
            state.count++;
        }
    };

    export default new Vuex.Store({
            state,
            mutations
        });

    //使用store
    import store from './store';
    store.commit('INCREMENT'); // or  store.commit({type: 'INCREMENT'});
    console.log(store.state.count); //-> 1


State
---

`vuex`使用单一状态树，整个应用只有一个store实例。

组件是如何使用store实例的状态的？

    import Vue from 'vue';
    import Vuex from 'vuex';
    import store from './store';
    import MyComponent from './MyComponent';

    Vue.use(Vuex); // 使用插件Vuex
    var app = new Vue({
        el: '#app',
        // 通过store选项 把store实例注入到每个子组件中,
        // 子组件通过 this.$store获取
        store, 
        components: {
            MyComponent
        }    
    });

    //> MyComponent.js
    // 通过 计算属性，获取store实例的状态数据

    export default {
        computed: {
            count() {
                return this.$store.state.count
            }
        }
    }

### 辅助函数 mapState

    import {mapState} from 'vuex';
    export default {
        data() {...},
        computed: mapState({
            count: state => state.count,
            aliasCount: 'count',
            lcount: state => {
                return this.localCount + state.count;
            }
        })
    }
    // 仅取state数据，可直接传字符串数组
    export default {
        computed: mapState(['count'])
    }

getter
----

Vuex 允许我们在 `store` 中定义 `getters` (可以认为是 store 的计算属性)

    const store = new Vuex.Store({
      state: {
        todos: [
          { id: 1, text: '...', done: true },
          { id: 2, text: '...', done: false }
        ]
      },
      getters: {
        doneTodos: state => {
          return state.todos.filter(todo => todo.done)
        },
        doneTodosCount: (state, getters) => { // 可使用其他getters
            return getters.doneTodos.length;
        },
        getTodoById: state => (id) => { // getter返回函数，从而可以接受入参
            return state.todos.find(todo => todo.id === id);
        }
      }
    });

    // 组件中，访问getters
    export default {
        computed: {
            doneTodosCount() {
                return this.$store.getters.doneTodosCount;
            }
        }
    }


### 辅助函数 mapGetters 类似 mapState

    import {mapGetters} from 'vuex';
    export default {
        computed: {
            ...mapGetters(['doneTodosCount', 'anotherGetter']),
            // 也可用对象语法
            ...mapGetters({
                doneCount: 'doneTodosCount'
            })
        }
    }

mutations
----
更改 Vuex 的 store 中的状态的唯一方法是提交 `mutation` 。 Vuex 中的 `mutation` 非常类似于事件：每个 `mutation` 都有一个字符串的 *事件类型* (type) 和 一个 *回调函数* (handler)

    const store = new Vuex.Store({
      state: {
        count: 1
      },
      mutations: {
        increment (state, payload) {
          // 变更状态
          state.count += payload.amount;
        }
      }
    })
    // 触发mutation
    this.$store.commit('increment', 10);
    this.$store.commit({type: 'increment', amount: 10}); // 对象语法

### Mutation 必须是同步函数
因为任何在回调函数中进行的的状态的改变都是不可追踪的。

### 辅助函数 mapMutations 
通常我们在组件的方法中，提交变更 (`this.$store.commit('some_mutation')`), `mapMutations`让我们更方便地创建相关方法.

    import { mapMutations } from 'vuex'

    export default {
      // ...
      methods: {
        ...mapMutations([
          'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

          // `mapMutations` 也支持载荷：
          'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
        ]),
        ...mapMutations({
          add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
        })
      }
    }

actions
----
`action` 主要是用来 commit mutations 的， action 可以包含异步操作.

    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      },
      actions: {
        increment (context) { // context 与 store实例具有相同的属性和方法
          // context.state context.getters
          context.commit('increment')
        }
      }
    })
    // 分发 Action
    this.$store.dispatch('increment');
    this.$store.dispatch({type: 'increment', amount: 10}); // 对象语法

    // 例子: action 中调用异步 API 和分发多重 mutation
    actions: {
      checkout ({ commit, state }, products) {
        // 把当前购物车的物品备份起来
        const savedCartItems = [...state.cart.added]
        // 发出结账请求，然后乐观地清空购物车
        commit(types.CHECKOUT_REQUEST)
        // 购物 API 接受一个成功回调和一个失败回调
        shop.buyProducts(
          products,
          // 成功操作
          () => commit(types.CHECKOUT_SUCCESS),
          // 失败操作
          () => commit(types.CHECKOUT_FAILURE, savedCartItems)
        )
      }
    }

### 辅助函数 mapActions

    import { mapActions } from 'vuex'

    export default {
      // ...
      methods: {
        ...mapActions([
          'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

          // `mapActions` 也支持载荷：
          'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
        ]),
        ...mapActions({
          add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
        })
      }
    }

### 组合 Action
`this.$store.dispatch('some-action')` 返回的是一个promise

    actions: {
      actionA ({ commit }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit('someMutation')
            resolve()
          }, 1000)
        })
      },
      actionB ({ dispatch, commit }) {
          return dispatch('actionA').then(() => {
            commit('someOtherMutation')
          })
        }
    }

    // 用 async / await，组合 action：
    // 假设 getData() 和 getOtherData() 返回的是 Promise
    actions: {
      async actionA ({ commit }) {
        commit('gotData', await getData())
      },
      async actionB ({ dispatch, commit }) {
        await dispatch('actionA') // 等待 actionA 完成
        commit('gotOtherData', await getOtherData())
      }
    }

modules
----
使用单一状态树，应用的所有状态会集中到一个比较大的对象, Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割

    const moduleA = {
      state: { ... },
      mutations: { ... },
      actions: { ... },
      getters: { ... }
    }

    const moduleB = {
      state: { ... },
      mutations: { ... },
      actions: { ... }
    }

    const store = new Vuex.Store({
      modules: {
        a: moduleA,
        b: moduleB
      }
    })

    store.state.a // -> moduleA 的状态
    store.state.b // -> moduleB 的状态

### 模块的局部状态
对于模块内部的 mutation 和 getter，接收的第一个参数是 *模块的局部状态对象*。

    const moduleA = {
      state: { count: 0 },
      mutations: {
        increment (state) {
          // 这里的 `state` 对象是模块的局部状态
          state.count++
        }
      },

      getters: {
        doubleCount (state) {
          return state.count * 2
        }
      }
    }

同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState：

    const moduleA = {
      // ...
      actions: {
        incrementIfOddOnRootSum ({ state, commit, rootState }) {
          if ((state.count + rootState.count) % 2 === 1) {
            commit('increment')
          }
        }
      }
    }

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

    const moduleA = {
      // ...
      getters: {
        sumWithRootCount (state, getters, rootState) {
          return state.count + rootState.count
        }
      }
    }

### 命名空间
默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为命名空间模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

    const store = new Vuex.Store({
      modules: {
        account: {
          namespaced: true,

          // 模块内容（module assets）
          state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
          getters: {
            isAdmin () { ... } // -> getters['account/isAdmin']
          },
          actions: {
            login () { ... } // -> dispatch('account/login')
          },
          mutations: {
            login () { ... } // -> commit('account/login')
          },

          // 嵌套模块
          modules: {
            // 继承父模块的命名空间
            myPage: {
              state: { ... },
              getters: {
                profile () { ... } // -> getters['account/profile']
              }
            },

            // 进一步嵌套命名空间
            posts: {
              namespaced: true,

              state: { ... },
              getters: {
                popular () { ... } // -> getters['account/posts/popular']
              }
            }
          }
        }
      }
    })

### 在命名空间模块内访问全局内容（Global Assets）

    modules: {
      foo: {
        namespaced: true,

        getters: {
          // 在这个模块的 getter 中，`getters` 被局部化了
          // 你可以使用 getter 的第四个参数来调用 `rootGetters`
          someGetter (state, getters, rootState, rootGetters) {
            getters.someOtherGetter // -> 'foo/someOtherGetter'
            rootGetters.someOtherGetter // -> 'someOtherGetter'
          },
          someOtherGetter: state => { ... }
        },

        actions: {
          // 在这个模块中， dispatch 和 commit 也被局部化了
          // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
          someAction ({ dispatch, commit, getters, rootGetters }) {
            getters.someGetter // -> 'foo/someGetter'
            rootGetters.someGetter // -> 'someGetter'

            dispatch('someOtherAction') // -> 'foo/someOtherAction'
            dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

            commit('someMutation') // -> 'foo/someMutation'
            commit('someMutation', null, { root: true }) // -> 'someMutation'
          },
          someOtherAction (ctx, payload) { ... }
        }
      }
    }

### 带命名空间的绑定函数

    computed: {
      ...mapState('some/nested/module', {
        a: state => state.a,
        b: state => state.b
      })
    },
    methods: {
      ...mapActions('some/nested/module', [
        'foo',
        'bar'
      ])
    }

通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数

    import { createNamespacedHelpers } from 'vuex'

    const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

    export default {
      computed: {
        // 在 `some/nested/module` 中查找
        ...mapState({
          a: state => state.a,
          b: state => state.b
        })
      },
      methods: {
        // 在 `some/nested/module` 中查找
        ...mapActions([
          'foo',
          'bar'
        ])
      }
    }

### 模块动态注册

    // 注册模块 `myModule`
    store.registerModule('myModule', {
      // ...
    })
    // 注册嵌套模块 `nested/myModule`
    store.registerModule(['nested', 'myModule'], {
      // ...
    })
    
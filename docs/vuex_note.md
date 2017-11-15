vuex
============

简介
----------
为**vuejs**专门设计的集中式状态管理架构，借鉴了 **flux** 和 **redux** 的设计思想

通常整个应用的状态散落在各个组件的内部, 当需要把一部分状态"发送"给其他组件时，通常用自定义事件的方式(*vm.$dispatch, pvm.$broadcast*)，大应用中比较难跟踪和调试。

大应用中，把状态分为 **组件本地状态** 和 **应用级的状态**, 集中式的状态管理，更容易的记录和观察状态变化(*mutation*).

Vuex应用的核心是**store**, store是状态的容器，和全局对象有以下不同:

1. store存储的状态时响应式的 (*store中状态改变，依赖该状态的组件会得到更新*)
2. 不能直接修改store中的状态 (**只能**通过派发变更事件的方式 `dispatching mutations` ，修改store的状态)

示例：

    //>store.js
    //创建vuex的store
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

    //>app.js
    //使用store
    import store from './store';
    store.dispatch('INCREMENT'); // or  store.dispatch({type: 'INCREMENT'});
    console.log(store.state.count); //-> 1


State 和 getters
------------------
`vuex`使用单一状态树，整个应用只有一个store实例。

组件是如何使用store实例的状态的？

    import Vue from 'vue';
    import Vuex from 'vuex';
    import store from './store';
    import MyComponent from './MyComponent';

    Vue.use(Vuex); //使用插件Vuex
    var app = new Vue({
        el: '#app',
        store, //通过store选项 把store实例注入到每个子组件中,子组件通过 this.$store获取
        components: {
            MyComponent
        }    
    });

    //>MyComponent.js
    //通过 vuex.getters 选项定义的getter方法，获取store实例的状态数据,并存入vm中

    export default {
        template: '..',
        data(){..},
        vuex: {
            getters: {
                //store.state.count 绑定为组件的 vm.count
                count: function(state){
                    return state.count;
                }
            },
            actions: {
                increment: function(store){//会转存为 vm.increment
                    store.disaptch('INCREMENT', 1);
                }
            }
        }
    }


### getter函数必须是纯函数
意味着：在 getter 里你不能依赖 this 关键字, 只能依赖传入的state

###getter 函数可以返回派生状态
Vuex 状态的 getters 内部其实就是计算属性,因为 Vue.js 计算属性是自动缓存的，且仅在对应的依赖发生改变时才会重新计算，所以你不必担心 getter 函数会在每次状态变更事件触发时都被频繁的调用。

    export default {
        template: ..,
        data(){..},
        vuex: {
            getters: {
                filteredMessages: state => {
                    return state.messages.filter( message => {
                        return message.threadId == state.currentThreadId;    
                    });
                }
            }
        }
    };


###在多组件中共享 getter 函数

    //>getters.js
    export function filteredMessages(state){
        return state.messages.filter(message=>{
            return message.threadId === state.currentThreadId;    
        });
    }
    //>MyComponent.js
    import { filteredMessage } from './getters';
    export default {
        template: ..,
        data() {..},
        vuex: {
            getters:{
                filteredMessages
            }
        }
    };

###组件不允许直接修改 store 实例的状态
组件永远都不应该直接改变 Vuex store 的状态。因为我们想要让状态的每次改变都很明确且可追踪，Vuex 状态的所有改变都必须在 store 的 mutation handler (变更句柄)中管理。

为了强化该规则，在开启(严格模式(Strict Mode))时，若有 store 的状态在 mutation 句柄外被修改，Vuex 就会报错。

组件通过只读的 **getter** 和 **Vuex store** 的状态绑定, 组件改变全局状态的唯一途径是触发mutation(通过action中 store.dispatch)


mutations
--------------
**mutations** 本质上是一个事件系统，每个mutation都有一个 **name**  和 回调函数 **handler( function(state) )** .

mutation的命名一般采用大写，以区分actions

    //> store.js
    import Vuex from 'vuex';

    const store = new Vuex.Store({
        state: {
            count: 1,
        },
        mutations: {
            INCREMENT(state){
                state.count++;
            }
        }
    });

    //组件的 vuex.actions中，触发mutation
    exports default {
        template: ..,
        data(){..},
        vuex:{
            actions: {
                increment: function(store){
                    store.dispatch('INCREMENT',1); // or store.dispatch({type: 'INCREMENT', payload: 1});
                }
            }
        }
    };


###Object 风格的 Dispatch
> 需要版本 >=0.6.2

    //MyComponent.js
    store.dispatch({
      type: 'INCREMENT',
      payload: 10
    });

    //store.js
    mutations: {
      INCREMENT (state, mutation) {
        state.count += mutation.payload
      }
    }


###Mutations 应当遵守 Vue 的响应系统规则

1. 尽可能在创建 store 时就初始化 state 所需要的所有属性
2. 拷贝并替换原本的对象。


###mutation 必须是同步函数

    mutations: {
      SOME_MUTATION (state) {
        api.callAsyncMethod(() => {
          state.count++
        })
      }
    }
    //实质上任何在回调函数中进行的的状态的改变都是不可追踪的

###下一步：Actions
在 mutation 中混合异步调用会导致你的程序很难调试。

在 Vuex 中，我们将全部的改变都用同步方式实现。我们将全部的异步操作都放在Actions中。

actions
---------------
Actions 是用于分发 mutations 的函数。按照惯例，Vuex actions 的第一个参数是 store 实例，附加上可选的自定义参数。

    //最简单的action
    function increment(store){
        store.dispatch('INCREMENT');
    }

    //附带参数的action  用到ES6参数析构
    function incrementBy({dispatch}, amount){
        dispatch('INCREMENT', amount);
    }

还记得 mutations 必须同步执行这个限制么？Actions 就不受约束！我们可以在 action 内部执行异步操作：

    function incrementAsync({dispatch}, amount){
        setTimeout(()=>{
            dispatch('INCREMENT', amount);
        }, 1000);
    }

**请谨记一点，必须通过分发 mutations 来处理调用异步 API 的结果; Actions 除了分发 mutations 应当尽量避免其他副作用**

###在组件中调用 Actions

    //MyComponent.js
    import { incrementBy } from './actions';

    cosnt vm = new Vue({
        template: ..,
        data(){..},
        vuex:{
            getters: {...} //state getters
            actions: {
                incrementBy  //ES6 同名对象字面量缩写 vm.incrementBy 预绑定参数0 vm.$store
            }
        }
    });

    vm.incrementBy(1); //等价如下
    incrementBy(vm.$store, 1); 

###内联 Actions
如果一个 action 只跟一个组件相关，可以采用简写语法把它定义成一行：

    var vm = new Vue({
            vuex: {
                getters: {..},
                actions: {
                    plus: ({dispatch}) => dispatch('INCREMENT');
                }
            }
        });

###绑定所有 Actions
如果你想简单地把所有引入的 actions 都绑定到组件中：

    import * as actions from './actions';
    var vm = new Vue({
            vuex:{
                getters: {..},
                actions: actions
            }
        });

###模块化actions
你还可以在 action 模块中引入其他 action 模块来实现复用。

    // errorActions.js
    export const setError = ({dispatch}, error) => {
      dispatch('SET_ERROR', error)
    }
    export const showError = ({dispatch}) => {
      dispatch('SET_ERROR_VISIBLE', true)
    }
    export const hideError = ({dispatch}) => {
      dispatch('SET_ERROR_VISIBLE', false)
    }

    // userActions.js
    import {setError, showError} from './errorActions'

    export const login = ({dispatch}, username, password) => {
      if (username && password) {
        doLogin(username, password).done(res => {
          dispatch('SET_USERNAME', res.username)
          dispatch('SET_LOGGED_IN', true)
          dispatch('SET_USER_INFO', res)
        }).fail(error => {
          dispatch('SET_INVALID_LOGIN')
          setError({dispatch}, error)
          showError({dispatch})
        })
      }
    }


中间件
------------------
Vuex store 可以接受 middlewares 选项来加载中间件。中间件在每一个 mutation 被触发后会调用响应的勾子函数（注意这和 Redux 的中间件概念完全没有关系）。一个 Vuex 中间件即是一个包含一些勾子函数的简单对象：

    const myMiddleware = {
      onInit (state) {
        // 记录初始 state
      },
      onMutation (mutation, state) {
        // 每个 mutation 后会被调用
        // mutation 参数的格式为 { type, payload }
      }
    }


    const store = new Vuex.Store({
      // ...
      middlewares: [myMiddleware]
    })

一个中间件默认会接受到原本的 state 对象，但中间件通常用于 debugging 或是数据持久化, 它们是 不允许改变 state 的。

有时候我们可能会想要在中间件中获得 state 的快照（snapshots），用来比较 mutation 前后的 state。这样的中间件必须定义 snapshot: true 选项：

    const myMiddlewareWithSnapshot = {
      snapshot: true,
      onMutation (mutation, nextState, prevState) {
        // nextState 和 prevState 分别为 mutation 触发前
        // 和触发后对原 state 对象的深拷贝
      }
    }

严格模式
----------------
要开启严格模式，只需要在创建 Vuex store 实例时传入 strict: true:

    const store = new Vuex.Store({
      // ...
      strict: true
    })

在严格模式中，每当 Vuex state 在 mutation handlers 外部被改变时都会抛出错误。这样我们可以确保所有对状态的改变都可以清晰地被 debugging 工具所记录。

###开发环境 vs. 生产环境
不要在生产环境中开启严格模式！ 为了检测在不合适的地方发生的状态修改, 严格模式会对 state 树进行一个深观察 (deep watch)。

    //配置构建工具来将严格模式的设置自动化
    const store = new Vuex.Store({
      // ...
      strict: process.env.NODE_ENV !== 'production'
    })


API
===============

Vue.Store
--------------

    import Vuex from 'vuex';
    const store = new Vuex.Store({...options});

**options**的参数包括:
1. `state` 状态数据
2. `mutations`  mutation事件系统
3. `modules`
    
        modules: {
            key: {
                state,
                mutation,
            }
        },
        ...

4. `middlewares` 中间件对象数组
      
        {
            snapshot: Boolean,
            onInit: Function,
            onMutation: Function
        }

5. `strict`  是否严格模式

Store实例API
--------------

1. `store.state` 只读 根state
2. `store.dispatch(mutationName, ...args)`  通常在组件的actions中调用 store.dispatch(..) 改变应用的状态
3. `store.watch(pathOrGetter, callback, [options])` 监听 path or getter 的值，执行回调; options 同 vm.$watch(..);
4. `store.hotUpdate(newOptions)` 热更新actions和mutations


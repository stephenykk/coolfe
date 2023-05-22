# vue3 note

新特性

- 基于 proxy 的响应式系统
  节约内存开销，无需 Vue.set() Vue.delete() 能响应属性的增删
- composition api setup
  解决：component options 组织业务逻辑，会把相关逻辑打散，难以理解和维护 hookEvent 部分解决问题
- 重写虚拟 DOM
  添加 flag, 更细颗粒地执行更新; 无数据绑定的静态节点提升到 render 外，进行复用
- Typescript 和 JSX 更完善的支持 *defineComponent({}) 更好的类型提示*
- 动态元素属性
- createApp 支持多个根组件 区分 app组件 和 普通组件
- 取消组件都必须有一个根元素的限制
- destroy -> unmount



**setup 选项**

```html
<template>
  <!-- View -->
  <div>{{name}}</div>
</template>
<script>
  import { reactive, computed, toRefs, watch,onMounted, onUpdated, onUnmounted } from '@vue/composition-api'
  export default {
    // 执行时间点 相当于 beforeCreate ， ( setup -> beforeCreate -> created )
    // 当props解析完 立即执行setup, 此时组件实例尚未创建，所以setup无法访问this
    setup(props, ctx) {
      // setup中无法访问this  ctx上访问不到 computed methods, 因为还未实例化
      // ctx = {root, refs, attrs, listeners, emit, expose...}

      // state is a proxy object
      const state = reactive({ name: 'Eno Yao' });

      return {
        ...state
      }
    }
  }


  // toRefs
  import { reactive, toRefs } from "@vue/composition-api";
  export default {
    setup() {
      const state = reactive({ name: 'Eno Yao' })
    }
    return {
      // 直接返回 state 那么数据会是非响应式的， MV 单向绑定
      // ...state,
      // toRefs 包装后返回 state 那么数据会是响应式的， MVVM 双向绑定
      ...toRefs(state),
    };
  }


  // computed
  import { computed } from '@vue/composition-api';

  // 计算属性分两种，只读计算属性和可读可写计算属性：
  // 只读计算属性
  let newsComputed = computed(() => news.value + 1)
  // 可读可写
  let newsComputed = computed({
    // 取值函数
    get: () => news.value + 2,
    // 赋值函数
    set: val => {
      news.value = news.value - 3
    }
  })



  // watch
  import { reactive, watch } from "@vue/composition-api";
  import store from "../stores";
  export default {
    setup() {
      const state = reactive({
        searchValue: "",
      });
      // 监听搜索框的值
      watch(
        () => {
          return state.searchValue;
        },
        () => {
          // 存储输入框到状态 store 中心，用于组件通信
          store.setSearchValue(state.searchValue);
        }
      );
      return {
        ...toRefs(state)
      };
    }
  };

  // lifecycle hooks
  import { onMounted, onUpdated, onUnmounted } from "@vue/composition-api";
  export default {
    setup() {
      const loadMore = () => {};
      onMounted(() => {
        loadMore();
      });
      onUpdated(() => {
        console.log('updated!')
      })
      onUnmounted(() => {
        console.log('unmounted!')
      })
      return {
        loadMore
      };
    }
  };

  // 新旧版本生命周期的对比

  // beforeCreate -> use setup()
  // created -> use setup()
  // beforeMount -> onBeforeMount
  // mounted -> onMounted
  // beforeUpdate -> onBeforeUpdate
  // updated -> onUpdated
  // beforeDestroy -> onBeforeUnmount
  // destroyed -> onUnmounted
  // errorCaptured -> onErrorCaptured

  // 同时新版本还提供了两个全新的生命周期帮助我们去调试代码：

  // onRenderTracked
  // onRenderTriggered
</script>
```

## 官方文档

**ref**

可以把任何数据包装成响应式的数据

```js
import { ref } from "vue";

// ref(data) => {value: data}
// 用对象包装原始值，是为了保持按引用传递，不用担心传递过程中丢掉响应式
const counter = ref(0);

console.log(counter); // { value: 0 }
console.log(counter.value); // 0

counter.value++;
console.log(counter.value); // 1
```

> In other words, ref creates a Reactive Reference to our value.

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// in our component
setup (props) {
  const repositories = ref([]) // 响应式引用
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories
  }
}
```

**Lifecycle Hook Registration Inside setup**

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // on `mounted` call `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

**Reacting to Changes with watch**

`watch`accepts 3 arguments:

- A Reactive Reference or getter function that we want to watch
- A callback
- Optional configuration options

```js
// example
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})


// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of props
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

**Standalone computed properties**

```js
// exmple
import { ref, computed } from 'vue'

const counter = ref(0)
// computed 返回的是一个响应式引用 .value访问具体值
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2


// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of props
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    repositories,
    getUserRepositories,
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

> 为避免 setup 函数过于臃肿，采用 useHook 之类的方式分离不同逻辑

```js

// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}


// ------------

// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}

// ======================

// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the filtered results under the `repositories` name
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}

```

setup demo

```js
// src/components/UserRepositories.vue
import { toRefs } from "vue";
import useUserRepositories from "@/composables/useUserRepositories";
import useRepositoryNameSearch from "@/composables/useRepositoryNameSearch";
import useRepositoryFilters from "@/composables/useRepositoryFilters";

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String },
  },
  setup(props) {
    const { user } = toRefs(props);

    const { repositories, getUserRepositories } = useUserRepositories(user);

    const {
      searchQuery,
      repositoriesMatchingSearchQuery,
    } = useRepositoryNameSearch(repositories);

    const {
      filters,
      updateFilters,
      filteredRepositories,
    } = useRepositoryFilters(repositoriesMatchingSearchQuery);

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the end results under the `repositories` name
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters,
    };
  },
};
```

详解 setup 参数

```js
// MyBook.vue

// 1. props
import { toRefs } from "vue";

export default {
  props: {
    title: String,
  },
  setup(props) {
    // props的属性已是响应式的
    console.log(props.title);

    // :: 注意不能用解构赋值使用属性
    // !!wrong
    let { title } = props;

    // 可以用toRefs进行包装后，解构赋值
    let { title } = toRefs(props);
    console.log(title.value);
  },
};

// 2.ctx = {attrs, slots, emit}

// ctx只是普通的js对象，可以放心地用解构赋值
// let { attrs, slots, emit } = ctx
// attrs.x slots.x 这样使用，最好不要赋值给变量使用，应为attrs slots会随父组件更新
export default {
  setup(props, context) {
    // Attributes (Non-reactive object)
    console.log(context.attrs);

    // Slots (Non-reactive object)
    console.log(context.slots);

    // Emit Events (Method)
    console.log(context.emit);
  },
};
```

模板中会自动解析响应式 ref 的 value

```html
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from "vue";

  export default {
    props: {
      collectionName: String,
    },
    setup(props) {
      // 模板中不需要 readersNumber.value 这样使用，会自动unwrap
      const readersNumber = ref(0);
      const book = reactive({ title: "Vue 3 Guide" });

      // expose to template
      return {
        readersNumber,
        book,
      };
    },
  };
</script>
```

Usage with Render Functions

```js
// MyBook.vue

import { h, ref, reactive } from "vue";

export default {
  setup() {
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide" });
    // Please note that we need to explicitly expose ref value here
    return () => h("div", [readersNumber.value, book.title]);
  },
};
```

use provide and inject in setup

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref, readonly } from "vue";
import MyMarker from "./MyMarker.vue";

export default {
  components: {
    MyMarker,
  },
  setup() {
    // provide(name, value)

    // provide value is not reactive now
    /* provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    }) */

    // provide reactive value
    let location = ref("North Pole");
    let geoLocation = reactive({
      longitude: 90,
      latitude: 135,
    });
    // readonly 禁止 injected components 修改注入值
    provide("location", readonloy(location));
    provide("geolocation", readonly(geoLocation));

    // 最好让provide,同时提供修改reactive value的方法
    const updateLocation = () => {
      location.value = "South Pole";
    };
    provide("updateLocation", updateLocation);
  },
};
</script>

<!-- src/components/MyMarker.vue -->
<script>
import { inject } from "vue";

export default {
  setup() {
    // inject(name, defaultValue)
    const userLocation = inject("location", "The Universe");
    const userGeolocation = inject("geolocation");

    return {
      userLocation,
      userGeolocation,
    };
  },
};
</script>
```

获取元素或组件实例

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const root = ref(null);

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      console.log(root.value); // <div>This is a root element</div>
    });

    return {
      root,
    };
  },
};

// using with render function and jsx
export default {
  setup() {
    const root = ref(null);

    return () =>
      h("div", {
        ref: root,
      });

    // with JSX
    return () => <div ref={root} />;
  },
};

</script>
```

> In the Virtual DOM patching algorithm, if a VNode's ref key corresponds to a ref on the render context, the VNode's corresponding element or component instance will be assigned to the value of that ref


use function ref

```html
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // make sure to reset the refs before each update
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```

**For Objects** Vue cannot detect property addition or deletion.

```js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` is now reactive

vm.b = 2
// `vm.b` is NOT reactive

// vue不能在data顶层，添加响应式属性
// 但是可以在嵌套对象中，添加响应式属性

// this.$set(vm.someObject, 'b', 2)
Vue.set(vm.someObject, 'b', 2)

// 或者整个对象替换
this.someObject = Object.assign({}, this.someObject, {foo: 1, bar: 2})
```

**For Array** 数组的响应式

```js

var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // is NOT reactive
vm.items.length = 2 // is NOT reactive

// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)

vm.items.splice(newLength)

```

Since Vue doesn't allow dynamically adding root-level reactive properties, you have to initialize component instances by declaring all root-level reactive data properties upfront, even with an empty value:

```js
var vm = new Vue({
  data: {
    // declare message with an empty value
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// set `message` later
vm.message = 'Hello!'
```

Async Update Queue

> Internally Vue tries native Promise.then, MutationObserver, and setImmediate for the asynchronous queuing and falls back to setTimeout(fn, 0)

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // change data
vm.$el.textContent === 'new message' // false

// Vue.nextTick === vm.$nextTick
Vue.nextTick(function() {
  vm.$el.textContent === 'new message' // true
})


// other example
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function() {
    return {
      message: 'not updated'
    }
  },
  methods: {
    updateMessage: function() {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      this.$nextTick(function() {
        // this is vm
        console.log(this.$el.textContent) // => 'updated'
      })
    }
  }
})

// use async/await
methods: {
    updateMessage: async function () {
      this.message = 'updated'
      console.log(this.$el.textContent) // => 'not updated'
      await this.$nextTick()
      console.log(this.$el.textContent) // => 'updated'
    }
  }
```

------------------

setup api 解决 option api 把相关逻辑打散的问题，实现*关注点分离*

setup在beforeCrate前执行，不能访问到 data  computed methods 等属性

```js
setup(props, context) {
  // ...
  return {}
}
```

ref创建响应式引用

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

setup 内注册生命周期钩子 onMounted onUpdated...

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// 在我们的组件中
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // 在 `mounted` 时调用 `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}

```

watch 数据变化

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})

```

例子

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, toRef } from 'vue'

// 在我们组件中
setup (props) {
  // 使用 `toRefs` 创建对 `props` 中的 `user` property 的响应式引用
  const { user } = toRefs(props) // 把对象的每个属性值都改为响应式引用  如：user.value 
  const title = toRef(props, 'title') // props上没有title，也会创建响应式引用

  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新 `prop.user` 到 `user.value` 访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在 user prop 的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

computed 方法得到响应式引用

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2

```


hook style

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}

// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}

// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}


```

setup 返回渲染函数

```js
// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // 请注意这里我们需要显式使用 ref 的 value
    return () => h('div', [readersNumber.value, book.title])
  }
}

```

expose 暴露属性给组件


```js
import { h, ref } from 'vue'
export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment // 这个 increment 方法现在将可以通过父组件的模板 ref 访问。
    })

    return () => h('div', count.value) // 返回渲染函数，就不需要render选项了??
  }
}
```

setup 支持provide

```js
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
</script>
```

setup 支持inject

```js
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

为了增加 provide 值和 inject 值之间的响应性，我们可以在 provide 值时使用 ref 或 reactive。


```js
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```

需要在注入数据的组件内部更新 inject 的数据。在这种情况下，我们建议 provide 一个方法来负责改变响应式 property。


```js
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', location)
    provide('geolocation', geolocation)
    provide('updateLocation', updateLocation)
  }
}
</script>


<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>

```

如果要确保通过 provide 传递的数据不会被 inject 的组件更改，我们建议对提供者的 property 使用 readonly。


```js
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  }
}
</script>
```

获取元素或组件实例的引用

```js
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
```

teleport 传送门

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```
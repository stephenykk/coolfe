# vue3 note

新特性

- 基于proxy的响应式系统
    节约内存开销，无需Vue.set() Vue.delete() 能响应属性的增删
- composition api  setup
    解决：component options 组织业务逻辑，会把相关逻辑打散，难以理解和维护  hookEvent 部分解决问题
- 重写虚拟DOM
    添加flag, 更细颗粒地执行更新; 无数据绑定的静态节点提升到render外，进行复用
- Typescript 和 JSX 更完善的支持
- 动态元素属性    


**setup 选项**
```html
<template>
  <!-- View -->
  <div>{{name}}</div>
</template>
<script>
import { reactive, computed, toRefs, watch,onMounted, onUpdated, onUnmounted } from '@vue/composition-api'
export default {
  // 执行时间点 相当于 beforeCreate
  // 当props解析完 立即执行setup, 此时组件实例尚未创建，所以setup无法访问this
  setup(props, ctx) {
    // setup中无法访问this  ctx上访问不到 computed methods, 因为还未实例化
    // ctx = {root, refs, attrs, listeners, emit, ...}

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
import { ref } from 'vue'

// ref(data) => {value: data}
// 用对象包装原始值，是为了保持按引用传递，不用担心传递过程中丢掉响应式
const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
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

> 为避免setup函数过于臃肿，采用useHook之类的方式分离不同逻辑

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
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the end results under the `repositories` name
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```
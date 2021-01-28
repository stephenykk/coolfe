# vue2.x notes

我们不仅可以把数据绑定到 DOM 文本`{{msg}}` 或 attribute `v-bind:show="true"`，还可以绑定到 DOM 结构 `v-if`

Vue 也提供一个强大的过渡效果系统，可以在 Vue 插入/更新/移除元素时自动应用过渡效果。

指令:

- `v-if`
- `v-for`
- `v-on`
- `v-bind`
- `v-model`
- `v-once`
- `v-html`

通过使用 v-once 指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。

Object.freeze(data)

实例的属性和方法 `$`前缀
- `vm.$set()`
- `vm.$delete()`
- `vm.$nextTick()`
- `vm.$watch()`
- `vm.$mount()`
- `vm.$destroy()`
- `vm.$forceUpdate()`
- `vm.$data`
- `vm.$props`
- `vm.$attrs`
- `vm.$slots`
- `vm.$el`


生命周期:

- beforeCreate created
- beforeMount mounted
- beforeUpdate updated
- beforeDestroy destroyed

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

如果你熟悉虚拟 DOM 并且偏爱 JavaScript 的原始力量，你也可以不用模板，直接写渲染 (render) 函数，使用可选的 JSX 语法。

```html
<div v-bind:id="'list-' + id"></div>
```

模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不应该在模板表达式中试图访问用户定义的全局变量。


指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM

一些指令能够接收一个“参数”，在指令名称之后以冒号表示。

```html
<a v-bind:href="url">...</a>
<a v-on:click="doSomething">...</a>
```

**动态指令参数**
从 2.6.0 开始，可以用方括号括起来的 JavaScript 表达式作为一个指令的参数

```html
<!--
注意，参数表达式的写法存在一些约束，如之后的“对动态参数表达式的约束”章节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>
<!-- 动态参数 实现动态事件名 -->
<a v-on:[eventName]="doSomething"> ... </a>
```

**对动态参数的值的约束**
动态参数预期会求出一个字符串，异常情况下值为 null。这个特殊的 null 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。


**对动态参数表达式的约束**
动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：

```html
<!-- 这会触发一个编译警告   用计算属性替代这种复杂表达式 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```


**修饰符**
修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。
```html
<form v-on:submit.prevent="onSubmit">...</form>
```

**缩写**

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>

<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

> : 与 @ 对于 attribute 名来说都是合法字符，在所有支持 Vue 的浏览器都能被正确地解析


**计算属性缓存 vs 方法**

计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值; 相比之下，每当触发重新渲染时，调用方法将总会再次执行函数。
```html
<p>Reversed message: "{{ reversedMessage() }}"</p>
<script>
module.exports = {
    // 在组件中
    methods: {
      reversedMessage: function () {
        return this.message.split('').reverse().join('')
      }
    }
}
</script>

<!-- computed -->
<p>{{reversedMessage}}</p>
<script>
module.exports = {
    computed: {
        reversedMessage() {
            return this.message.split('').reverse().join('')
        }
    }
}
</script>
```

**计算属性 vs 侦听属性**

```js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

**计算属性的 setter**

```js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

**`vm.$watch()`响应数据变化

```js
module.exports = {
    data() {
        return {user: ''}
    },
    watch: {
        user: async function(newVal, oldVal) {
            this.userInfo = await this.getUserInfo()
        }
    }
}
```

> computed 和 watch 的应用场景不同:  computed 基于现有数据衍生新的数据; watch 响应数据的变化，进行相应操作

**Class 与 Style 绑定**

v-bind 用于 class 和 style 时，Vue.js 做了专门的增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>


<div v-bind:class="classObject"></div>
<script>
module.exports = {
    data: {
    classObject: {
        active: true,
        'text-danger': false
    }
    }
}
</script>


<div v-bind:class="[activeClass, errorClass]"></div>
<script>
module.exports = {
    data: {
      activeClass: 'active',
      errorClass: 'text-danger'
    }
}
</script>

<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
<!-- better -->
<div v-bind:class="[{ active: isActive }, errorClass]"></div> 
```


当在一个自定义组件上使用 class property 时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。

```html
<my-component class="baz boo"></my-component>
<my-component v-bind:class="{ active: isActive }"></my-component>

Vue.component('my-component', {
  template: '<p class="foo bar">Hi</p>'
})

<p class="foo bar baz boo">Hi</p>
```

style绑定

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<div v-bind:style="styleObject"></div>

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}

<div v-bind:style="[baseStyles, overridingStyles]"></div>

<!-- 当 v-bind:style 使用需要添加浏览器引擎前缀的 CSS property 时，如 transform，Vue.js 会自动侦测并添加相应的前缀。 -->
```

**条件渲染**

```html
<h1 v-if="start > 1000">Vue is awesome!</h1>
<h1 v-else-if="start > 100">not bad</h1>
<h1 v-else>Oh no 😢</h1>

<!-- 因为 v-if 是一个指令，所以必须将它添加到一个元素上。但是如果想切换多个元素呢？此时可以把一个 <template> 元素当做不可见的包裹元素，并在上面使用 v-if -->

<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>


<!-- 切换时 label input会被复用，除非用key指定 -->
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>

<!-- 用key -->
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```


> 注意，v-show 不支持 `<template>` 元素，也不支持 `v-else`。

**v-if vs v-show**

v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

> 不推荐同时使用 v-if 和 v-for 会有性能影响，先在方法里用filter过滤 再用到模板


**列表渲染** 

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>

<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>

<!-- 你也可以用 of 替代 in 作为分隔符，因为它更接近 JavaScript 迭代器的语法 -->
<div v-for="item of items"></div>

<!-- v-for 遍历对象 -->
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
</script>


<div v-for="(value, name) in object">
  {{ name }}: {{ value }}
</div>

<!-- v-for 数值范围 -->
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>


<!-- <template v-for > -->
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>

<my-component v-for="item in items" :key="item.id"></my-component>
```

**数组更新检测**
- 自修改方法 arr.push()  arr.pop()
- 替换数组 this.arr = newArr

**事件处理**

```html
<div id="example-2">
  <!-- `greet` 是在下面定义的方法名 -->
  <button v-on:click="greet">Greet</button>
</div>

<div id="example-3">
  <!-- 内联回调函数 -->
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>

<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 事件修饰符 -->

<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 vue2.14+ -->
<!-- .once 修饰符还能被用到自定义的组件事件 -->
<a v-on:click.once="doThis"></a>


<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<!-- 这个 .passive 修饰符尤其能够提升移动端的性能。 -->
<!-- .passive 会告诉浏览器你不想阻止事件的默认行为。 vue2.3+ -->
<div v-on:scroll.passive="onScroll">...</div>


<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
<input v-on:keyup.page-down="onPageDown">

<!-- 自定义按键修饰符别名： -->
<!-- // 可以使用 `v-on:keyup.f1` -->
Vue.config.keyCodes.f1 = 112


<!-- 系统修饰键 -->
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>

<!-- .exact v2.5+ -->
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

你可能注意到这种事件监听的方式违背了关注点分离 (separation of concern) 这个长期以来的优良传统。但不必担心，因为所有的 Vue.js 事件处理方法和表达式都严格绑定在当前视图的 ViewModel 上，它不会导致任何维护上的困难


**表单** 

你可以用 v-model 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 value property 和 input 事件；
- checkbox 和 radio 使用 checked property 和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg">

<!-- 自动将用户的输入值转为数值类型 -->
<input v-model.number="age" type="number">

<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg">
```

> 在组件上使用 v-model

**组件**

- 同一个组件的实例之间互相独立
- 一个组件的 data 选项必须是一个函数
- 两种组件的注册类型：全局注册和局部注册
- 通过 Prop 向子组件传递数据
- 单个根元素
- 监听子组件事件
- 自定义事件系统
- 通过插槽分发内容

> 父级组件可以像处理 native DOM 事件一样通过 v-on 监听子组件实例的任意事件：

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>

<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

组件上使用 `v-model`

```html
<input v-model="searchText">
<!-- 等价 -->
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>

<custom-input v-model="searchText"></custom-input>

```

slot

```js
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

动态组件

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>

<table>
  <tr is="blog-post-row"></tr>
</table>
```

组件名大小写 和 组件注册

```html
<!-- 用 kebab-case 注册组件, 模板只能用 kebab-case 使用组件 -->
Vue.component('my-component-name', { /* ... */ })
<my-component-name />

<!-- 用PascalCase注册组件，以下两种使用方式都可以 -->
Vue.component('MyComponentName', { /* ... */ })
<my-component-name />
<MyComponentName />

<!-- 全局注册 -->
Vue.component('my-component-name', {
  // ... 选项 ...
})

<!-- 局部注册 -->
new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

在根实例创建前，全局注册基础组件

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```


**Prop 的大小写 (camelCase vs kebab-case)**

```html
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})

<!-- 在 HTML 中是 kebab-case 的 -->
<!-- DOM 模板才有这个限制，字符串模板 单文件组件模式 应该没有这个限制 -->
<blog-post post-title="hello!"></blog-post>
```

props类型

```js
// 字符串数组
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
// 对象
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

传递静态或动态 Prop

```html
<blog-post title="My journey with Vue"></blog-post>
<!-- 动态赋予一个变量的值 -->
<blog-post v-bind:title="post.title"></blog-post>

<!-- 动态赋予一个复杂表达式的值 -->
<blog-post
  v-bind:title="post.title + ' by ' + post.author.name"
></blog-post>

<!-- 即便数组是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>

<!-- 即便对象是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:author="post.author"></blog-post>


```

**传入一个对象的所有 property**  

如果你想要将一个对象的所有 property 都作为 prop 传入，你可以使用不带参数的 v-bind (取代 v-bind:prop-name)

```html
post: {
  id: 1,
  title: 'My Journey with Vue'
}

<blog-post v-bind="post"></blog-post>

等价于：

<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

**单向数据流** 

父级 prop 的更新会向下流动到子组件中，但是反过来则不行

> props 应当做只读看待


**Prop 验证**

**非 Prop 的 Attribute**

一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 prop 定义的 attribute。 `this.$attrs`

禁用 Attribute 继承

```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})


Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})

// 注意 inheritAttrs: false 选项不会影响 style 和 class 的绑定。

// 这个模式允许你在使用基础组件的时候更像是使用原始的 HTML 元素，而不会担心哪个元素是真正的根元素：
<base-input
  v-model="username"
  required
  placeholder="Enter your username"
></base-input>
```

**事件名** 

不同于组件名和 prop名，事件名不存在任何自动化的大小写转换。而是触发的事件名需要完全匹配监听这个事件所用的名称

v-on 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，所以 v-on:myEvent 将会变成 v-on:myevent——导致 myEvent 不可能被监听到。

> 单文件组件模式 没有上述的问题

因此，我们推荐你始终使用 kebab-case 的事件名。


**自定义组件的 v-model vue2.2+**

一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但是像单选框、复选框等类型的输入控件可能会将 value attribute 用于不同的目的。model 选项可以用来避免这样的冲突：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

<base-checkbox v-model="lovingVue"></base-checkbox>
```

将原生事件绑定到组件

```html
<!-- .native 表示 focus是原生事件 -->
<base-input v-on:focus.native="onFocus"></base-input>

<!-- Vue 提供了一个 $listeners property，它是一个对象，里面包含了作用在这个组件上的所有监听器。 -->

<!-- 类似prop透传 -->
<hello v-bind="$attrs" />

<!-- 事件绑定透传给子元素 -->
<hello v-on="$listeners" />


Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

`.sync` 修饰符 v2.3+

```html
<!-- :prop.sync="变量名"   不能是运算表达式 --> 
<text-document v-bind:title.sync="doc.title"></text-document>
<!-- 等价于 -->
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>

<!-- 同步对象的所有属性 -->
<text-document v-bind.sync="doc"></text-document>
<!-- doc = {title, value} 则等价于 -->
<text-document v-bind:title.sync="doc.title"  v-bind:name.sync="doc.name"/>
```

**插槽**

v2.6+  `v-slot` 替代 `<slot>` and `<slot-scope>`

具名插槽 `<slot name="left">`

> 一个不带 name 的 `<slot>` 出口会带有隐含的名字“default”。

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>


<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
> 注意 v-slot 只能添加在 `<template>` 上 (只有一种例外情况)，这一点和已经废弃的 slot attribute 不同。


作用域插槽

```html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>



<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>

<!-- 独占默认插槽的缩写语法 -->
<!-- 独占 指的是自定义组件内部都是默认插槽的内容， 此时 v-slot直接用在自定义组件上 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

<!-- 解构赋值一下 -->
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>

<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>

<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>

```

动态插槽名vue2.6+

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

具名插槽的缩写  

跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

在动态组件上使用 keep-alive

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```


**异步组件**  
Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})

// 一个推荐的做法是将异步组件和 webpack 的 code-splitting 功能一起配合使用：

Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})

// 在工厂函数中返回一个 Promise，所以把 webpack 2 和 ES2015 语法加在一起，我们可以这样使用动态导入：

Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

// 当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：

new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})


// 处理加载状态
// 这里的异步组件工厂函数也可以返回一个如下格式的对象：

const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

访问根实例  
根实例可以作为一个全局 store 来访问或使用

```js
// 获取根组件的数据
this.$root.foo

// 写入根组件的数据
this.$root.foo = 2

// 访问根组件的计算属性
this.$root.bar

// 调用根组件的方法
this.$root.baz()
```

访问子组件或子元素

当 ref 和 v-for 一起使用的时候，你得到的 ref 将会是一个包含了对应数据源的这些子组件的数组。

```html
<input ref="input">
methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}
```

**依赖注入**

provide 选项允许我们指定我们想要提供给后代组件的数据/方法;  在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的 property：


实际上，你可以把依赖注入看作一部分“大范围有效的 prop”，除了：

- 祖先组件不需要知道哪些后代组件使用它提供的 property
- 后代组件不需要知道被注入的 property 来自哪里

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}


```

**事件监听**  

- `this.$on()`
- `this.once()`
- `this.$emit()`
- `this.$off()`

```js
// hookEvents
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

循环引用  

小心组件的递归调用

```js
// 用异步组件 解决循环引用问题
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```


强制更新 `this.$forceUpdate()`

> 如果你发现你自己需要在 Vue 中做一次强制更新，99.9% 的情况，是你在某个地方做错了事。


过渡系统 

Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。包括以下工具：

- 在 CSS 过渡和动画中自动应用 class
- 在过渡钩子函数中使用 JavaScript 直接操作 DOM
- 可以配合使用第三方 CSS 动画库，如 Animate.css
- 可以配合使用第三方 JavaScript 动画库，如 Velocity.js

单元素/组件的过渡  

Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

- 条件渲染 (使用 v-if)
- 条件展示 (使用 v-show)
- 动态组件
- 组件根节点

```html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>

<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

```

![过渡class切换](https://cn.vuejs.org/images/transition.png)

**自定义指令**

在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 局部注册
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}

// 使用自定义指令
<input v-focus>

```

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `bind` 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

- `inserted` 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

- `update` 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。

- `componentUpdated` 指令所在组件的 VNode 及其子 VNode 全部更新后调用。

- `unbind` 只调用一次，指令与元素解绑时调用。


**动态指令参数**

```html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>

<script>
Vue.directive('pin', {
  bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    var s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})

new Vue({
  el: '#dynamicexample',
  data: function () {
    return {
      direction: 'left'
    }
  }
})
</script>
```

指令的函数简写

在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子。比如这样写：

```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

对象字面量

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>

Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})

```

**渲染函数 & JSX**

渲染函数更底层，更灵活

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

“虚拟 DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼

createElement 参数

```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

**深入数据对象**

```js
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```

> 组件树中的所有 VNode 必须是唯一的


渲染函数中没有与 v-model 的直接对应——你必须自己实现相应的逻辑：

```js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

修饰符

```js
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止 事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

作用域插槽

```js
render: function (createElement) {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return createElement('div', [
    createElement('child', {
      // 在数据对象中传递 `scopedSlots`
      // 格式为 { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}

```

**JSX**

```js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) { // h 参数必须！！ 就好比 React组件 , 必须导入 React
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

> 将 h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的。从 Vue 的 Babel 插件的 3.4.0 版本开始，我们会在以 ES2015 语法声明的含有 JSX 的任何方法和 getter 中 (不是函数或箭头函数中) 自动注入 const h = this.$createElement，这样你就可以去掉 (h) 参数了。对于更早版本的插件，如果 h 在当前作用域中不可用，应用会抛错。

函数式组件  

比较轻量，纯展示组件或包装组件，无状态 无实例 无生命周期

```js
Vue.component('my-component', {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```

在 2.5.0 及以上版本中，如果你使用了单文件组件，那么基于模板的函数式组件可以这样声明：

```html
<template functional>
</template>
```

透传attrs

```js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // 完全透传任何 attribute、事件监听器、子节点等。
    return createElement('button', context.data, context.children)
  }
})

// 基于模板的函数式组件
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
```

使用插件

```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin, options)

new Vue({
  // ...组件选项
})
```

开发插件

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

过滤器

过滤器可以用在两个地方：双花括号插值和 v-bind 表达式 (后者从 2.1.0+ 开始支持)。

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}
{{ message | filterA | filterB }}
<!-- filterA(message, arg1, arg2) -->
{{ message | filterA('arg1', arg2) }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>

filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

```

模板预编译

当使用 DOM 内模板或 JavaScript 内的字符串模板时，模板会在运行时被编译为渲染函数。通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。

预编译模板最简单的方式就是使用单文件组件——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。

如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数。


> 思想的区别：vuex 用mutation去改变state; redux在reducer中返回新的state, reducer是纯函数

组件不允许直接变更属于 store 实例的 state，而应执行 action 来分发 (dispatch) 事件通知 store 去改变，我们最终达成了 Flux 架构。这样约定的好处是，我们能够记录所有 store 中发生的 state 变更，同时实现能做到*记录变更*、*保存状态快照*、*历史回滚/时光旅行*的先进的调试工具。


**服务端渲染**

Nuxt.js

Nuxt 是一个基于 Vue 生态的更高层的框架，为开发服务端渲染的 Vue 应用提供了极其便利的开发体验。更酷的是，你甚至可以用它来做为静态站生成器。推荐尝试。


**安全**

第一原则：永远不要将不可信任的内容作为模板内容使用

这样做等价于允许在应用程序中执行任意的 JavaScript——甚至更糟的是如果在服务端渲染的话可能导致服务器被攻破

```js
new Vue({
  el: '#app',
  template: `<div>` + userProvidedString + `</div>` // 永远不要这样做
})
```

防止XSS攻击

```html
<!-- 转义通过诸如 textContent 的浏览器原生的 API 完成 -->
<h1>{{ userProvidedString }}</h1>

<!-- 转义通过诸如 setAttribute 的浏览器原生的 API 完成 -->
<h1 v-bind:title="userProvidedString">
  hello
</h1>

```


响应式原理 

每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

![响应式原理图解](https://cn.vuejs.org/images/data.png)


Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的


异步更新队列

可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。


$nextTick() 返回一个 Promise 对象，所以你可以使用新的 ES2017 async/await 语法

```js
methods: {
  updateMessage: async function () {
    this.message = '已更新'
    console.log(this.$el.textContent) // => '未更新'
    await this.$nextTick()
    console.log(this.$el.textContent) // => '已更新'
  }
}
```
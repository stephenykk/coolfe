# vue notes

DOM 和数据绑定 保持同步

0. 改写属性为响应式属性
1. 解析 DOM 模板(_非字符串模板_), 用属性的 getter 进行依赖收集，每个属性都工作在观察者模式下
2. 用户点击操作的回调函数中，修改属性，setter 函数进行更新通知，执行各个依赖的回调，更新 DOM

指令 数据变化需要 dom 做相应变化时使用

内置指令:

- v-if
- v-for
- v-text
- v-html
- v-on
- v-bind #对元素特性做插值

动态组件，组件间的数据流， 事件系统，组件系统

根实例
```js
    vm = new Vue(options)
    Component  = Vue.extend(options);
    cmp = new Component(options);
```
### options:

- data
- methods
- el
- template
- init (*组件实例化?*)
- created (*改造属性为响应式?*)
- beforeCompile (*编译DOM模板*)
- compiled
- ready (*挂载完成可交互*)
- beforeDestroy
- destroyed (*组件销毁*)

> 生命周期 init -> create -> compile -> ready -> destroy

响应的数据属性

组件实例的属性和方法
```js
vm.$data
vm.$el
vm.$watch('prop', function(newVal, oldVal){..})
vm.$mount(el) //没有 template 选项 则会把 el.innerHTML 作为 template
vm.$destroy()
```
Dom 模板

插值: {{msg}} {{{html}}} {{* once }} XSS 攻击
标签 属性插值: `<div id="item-{{id}}">..</div>`

{{..}} 内部的为**绑定表达式**，有**表达式**和**过滤器**构成。 单个表达式 (_使用声明语句和流程控制语句都是不行的_)

过滤器 {{msg | capitalize}} {{msg|filterA|filterB}} {{msg|filterA 'arg1' arg2}}

指令的值限定为**绑定表达式**: 参考插值 {{msg|filter}}

指令的职责是：表达式的值改变时，把特殊的行为应用到 dom 上.
```html
	<!-- href是指令v-bind的参数 url是绑定表达式 -->
	<a v-bind:href="url>..</a>
	<a v-on:click="dosomething">..</a>
	<!-- literal为修饰符 表明/a/b/c是字面量，不是表达式. -->
	<a v-bind:href.literal="/a/b/c">..</a>  
```
缩写
```html
	<!-- v-bind:href="url" -->
	<a :href="url"></a> 
	<!-- v-on:click="dosth" -->
	<a @click="dosth"></a> 
```
模板中的绑定表达式(或者说插值)都应该简单，需要复杂逻辑时，可用计算属性
```js
  var vm = new Vue({
    el: '#app',
    data: {
      a: 1
    },
    computed: {
      b: function() {
        return this.a + 1;
      }
    }
  });
```
计算属性可以包含: getter, setter
```js
  computed: {
    fullName: {
      get: function(){
        return this.firstName + ' ' + this.lastName;
      },
      set: function(fname){
        var names = fname.split(' ');
        this.firstName = names[0];
        this.lastName = names[1];
      }
    }
  }
```
## class and style binding
```html
  <div class="static" :class="{'class-a': isA, 'class-b': isB}">..</div>
  <div :class="classObj">...</div>
  <!-- 数组元素用三元表达式 -->
  <div :class="[classA, classB, isC?classC:'']">..</div>
  <!-- 数组元素用对象 -->
  <div :class="[classA, {classB: isB, classC: isC}]">..</div>

  <!-- 样式名用驼峰 -->
  <div :style="{color: activeColor, fontSize: fontSize + 'px'}">..</div>
  <!-- 用计算属性styleObj -->
  <div :style="styleObj">..</div> 
  <!-- 样式属性若需要前缀会自动处理 -->
  <div :style="[styleObjA, styleObjB]">..</div> 
```
## condition render
```html
  <h1 v-if="yes">yes</h1>
  <h1 v-else>no</h1>

  <template v-if="ok">
    ...
  </template>

  <div v-if="score > 90">excellent</div>
  <div v-else-if="score > 80">good</div>
  <div v-else>soso</div>
  

  <!-- 注意 v-show不支持 template 语法. -->
  <div v-show="ok">...</div>  
```
## list render
```html
  <ul>
    <li v-for="item in items">
      {{parentMsg}} --- {{$index}} : {{item.message}}
    </li>
  </ul>

  <!-- 显式声明索引变量index 默认有$index $key -->
  <div v-for="(index, item) in items"> 
    {{index}}  {{item.message}}
  </div>

  <!-- of分隔符 同 in?? -->
  <div v-for="(index, item) of items">
      {{index}}  {{item.message}}
  </div>

  <template v-for="item in items">
    ...
  </template>
```
## array changing check

数组的变异方法: 
```js
  arr.push()
  arr.pop()
  arr.shift()
  arr.unshift()
  arr.splice()
  arr.sort()
  arr.reverse()
```
被观察数组的变异方法被 vue 装饰，故它们能触发视图更新, 如：

```js
  var vm = new Vue({
    el:'#app',
    data:{
      friends: ['zoro', 'nami', 'robin']
    }
  });
  // friends.push被装饰了
  console.log(vm.friends.push === Array.prototype.push) // false
```
数组非变异方法: 
```js
  arr.filter()
  arr.concat()
  arr.slice()
  vm.friends = vm.friends.slice(0,2);
```
返回新数组，直接用新数组替换旧数组(*vue 会最大可能地复用 dom, 所以这并非低效的*).

track-by 特性:   
提示 vue,只要 track-by 指定的属性没变，就可以复用 dom，而不用重新渲染

```html
    <div v-for="item in items" track-by="_uid">
    	{{item.name}}
    </div>

    items: [ {_uid:1, name:'foo'},{_uid:3, name:'bar'},{_uid:2, name:'baz'} ]
    =>
    items: [ {_uid:1, name:'foo'},{_uid:2, name:'baz'} ]
```
不能检测的数组变化:
```js
    vm.items[0]	 = {}; 
    // 应该 
    // vm.$set(vm.items, 0, {name: 'changed'});
    // Vue.set(vm.items, 0, {name: 'changed'})

    vm.items.length = 0; 
    // 应该 
    // vm.items = [];
```
扩展的便捷方法: 
```js
  vm.items.$set(key, value)
  vm.items.$remove(item);
```
遍历对象 v-for $key
```html
    <ul>
    	<li v-for="value in obj">
    		{{$key}}: {{value}}
    	</li>
    </ul>

    <ul>
      <!-- 显式声明key -->
    	<li v-for="(key, val) in obj"> 
    		{{key}}: {{val}}
    	</li>
    </ul>
```
值域 v-for
```html
    <div>
      <!-- 输出数字0-9 -->
      <span v-for="n in 10">{{n}}</span> 
    </div>
```
显式过滤/排序后的数组，有 2 种方式:

- 用计算属性返回过滤/排序后的数组
- 用内置的过滤器 orderBy , filterBy

## 方法和事件处理器
```html
    <!-- 绑定到方法: 默认会有event对象传入 greet 回调 -->
    <button v-on:click="greet">greet</button> 
```
内联语句处理器
```html
    <!-- 绑定到语句：可以显式的传入$event -->
    <button v-on:click="say('hi', $event)">say hi</button> 
```

事件修饰符 `.stop`, `.prevent`, `.capture`, `.self`
```html
    <a v-on:click.stop="doThis">阻止了事件冒泡</a>
    <a v-on:click.stop.prevent="doThat">阻止了事件冒泡和元素默认行为</a>
    <form v-on:submit.prevent></form>

    <a v-on:click.capture="doThis">监听捕获阶段的click事件</a>
    <a v-on:click.self="doThat">click的目标是a自身，而非子元素时触发回调</a>
```
按键修饰符 .enter, .tab, .esc, .space, .delete...
```html
    <input v-on:keyup.enter="doThis">按enter时，执行回调
```
自定义按键修饰符
```js
    Vue.directive('on').keyCode.f1 = 112; //访问全局的指令 on
```

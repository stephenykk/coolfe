vue notes
===

dom和数据绑定 保持同步

domListener 监听用户操作，修改model； 把model的改变同步给dom

指令 数据变化需要dom做相应变化时使用

内置指令:

- v-if
- v-for
- v-text
- v-html
- v-on
- v-bind #对元素特性做插值


动态组件，组件间的数据流， 事件系统，组件系统

根实例

	vm = new Vue(options)
	Component  = Vue.extend(options);
	cmp = new Component(options);

### options:

- data
- methods
- el
- template
- init
- created
- beforeCompile
- compiled
- ready
- beforeDestroy
- destroyed

响应的数据属性

组件实例的属性和方法

- vm.$data
- vm.$el 
- vm.$watch('prop', function(newVal, oldVal){..})
- vm.$mount(el) //没有template选项 则会把el.innerHTML作为template
- vm.$destroy()


Dom模板

插值: {{msg}} {{{html}}} {{* once }}  XSS攻击
标签 特性插值: `<div id="item-{{id}}">..</div>`

{{..}} 内部的为**绑定表达式**，有**表达式**和**过滤器**构成。 单个表达式 (*使用声明语句和流程控制语句都是不行的*)

过滤器 {{msg | capitalize}} {{msg|filterA|filterB}}  {{msg|filterA 'arg1' arg2}}

指令的值限定为**绑定表达式**:  参考插值 {{msg|filter}}

指令的职责是：表达式的值改变时，把特殊的行为应用到dom上.

	<a v-bind:href="url>..</a>  //href是指令v-bind的参数 url是绑定表达式
	<a v-on:click="dosomething">..</a> 
	<a v-bind:href.literal="/a/b/c">..</a>  //literal为修饰符 表明/a/b/c是字面量，不是表达式.

缩写

	<a :href="url"></a> //v-bind:href="url"
	<a @click="dosth"></a> //v-on:click="dosth"

模板中的绑定表达式(或者说插值)都应该简单，需要复杂逻辑时，可用计算属性

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

计算属性可以包含: getter, setter

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


class and style binding
-----------------------------

	<div class="static" :class="{'class-a': isA, 'class-b': isB}">..</div>

	<div :class="classObj">...</div>

	<div :class="[classA, classB, isC?classC:'']">..</div>

	
	//可以在数组语法中使用对象语法 避免使用多个条件表达式的繁琐
	<div :class="[classA, {classB: isB, classC: isC}]">..</div>

	<div :style="{color: activeColor, fontSize: fontSize + 'px'}">..</div>
	<div :style="styleObj">..</div> //用计算属性styleObj
	<div :style="[styleObjA, styleObjB]">..</div> //样式属性若需要前缀会自动处理

condition render
------------------

	<h1 v-if="yes">yes</h1>
	<h1 v-else>no</h1>

	<template v-if="ok">
		...
	</template>

	<div v-show="ok">...</div>  //注意 v-show不支持 template 语法.


list render
-------------

	<ul>
		<li v-for="item in items">
			{{parentMsg}} --- {{$index}} : {{item.message}}
		</li>
	</ul>

	<div v-for="(index, item) in items"> //显式声明索引变量index 默认有$index $key
		{{index}}  {{item.message}}
	</div>

	//of分隔符
	<div v-for="(index, item) of items">
			{{index}}  {{item.message}}
	</div>

	<template v-for="item in items">
		...
	</template>

array changing check
--------------------

数组的变异方法: push(), pop(), shift(), unshift(), splice(), sort(), reverse()
被观察数组的变异方法被vue包装，故它们能触发视图更新, 如：

	var vm = new Vue({
		el:'#app',
		data:{
			friends: ['zoro', 'nami', 'robin']
		}
	}); //vm.friends.push 方法不是原始的 Array.prototype.push, 经过了修改装饰


数组非变异方法: filter(), concat(), slice(), 返回新数组，直接用新数组替换旧数组即可(vue会最大可能地复用dom, 所以这并非低效的).

	vm.friends = vm.friends.slice(0,2);


track-by特性: 提示vue,只要track-by指定的属性没变，就可以复用dom，而不用重新渲染

	<div v-for="item in items" track-by="_uid">
		{{item.name}}
	</div>

	items: [ {_uid:1, name:'foo'},{_uid:2, name:'bar'},{_uid:2, name:'baz'} ]
	=>
	items: [ {_uid:1, name:'foo'},{_uid:2, name:'baz'} ]



不能检测的数组变化: 

	vm.items[0]	 = {}; //应该 vm.items.$set(0, {name: 'changed'});
	vm.items.length = 0; //应该 vm.items = [];

> 扩展的便捷方法: vm.items.$set(key, value),  vm.items.$remove(item);


遍历对象 v-for $key

	<ul>
		<li v-for="value in obj">
			{{$key}}: {{value}}
		</li>
	</ul>

	<ul>
		<li v-for="(key, val) in obj"> //显式声明key
			{{key}}: {{val}}
		</li>
	</ul>


值域 v-for

	<div>
		<span v-for="n in 10">{{n}}</span> //输出数字0-9
	</div>


显式过滤/排序后的数组，有2种方式:

- 用计算属性返回过滤/排序后的数组
- 用内置的过滤器 orderBy , filterBy

方法和事件处理器
--------------

	<button v-on:click="greet">greet</button> //绑定到方法: 默认会有event对象传入 greet 回调

内联语句处理器

	<button v-on:click="say('hi', $event)">say hi</button> //绑定到语句：可以显式的传入$event


事件修饰符 .stop,  .prevent, .capture, .self 

	<a v-on:click.stop="doThis">阻止了事件冒泡</a>
	<a v-on:click.stop.prevent="doThat">阻止了事件冒泡和元素默认行为</a>
	<form v-on:click.prevent></form>

	<a v-on:click.capture="doThis">监听捕获阶段的click事件</a>
	<a v-on:click.self="doThat">click的目标是a自身，而非子元素时触发回调</a>

按键修饰符 .enter, .tab, .esc, .space, .delete...

	<input v-on:keyup.enter="doThis">按enter时，执行回调

自定义按键修饰符

	Vue.directive('on').keyCode.f1 = 112; //访问全局的指令 on


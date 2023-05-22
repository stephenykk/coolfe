vue useful
===


- [vue3 新特性介绍](https://blog.csdn.net/weixin_44420276/article/details/101621169)
- [【前端知识点总结】Vue3 (一) Vue3的新特性](https://blog.csdn.net/jiang_ziY/article/details/123930027)
- [对比Vue2总结Vue3新特性(2022年最全，2.5w字！)](https://blog.csdn.net/weixin_38664300/article/details/124877908)
- [2022年Vue最常见的面试题以及答案](https://blog.csdn.net/m0_53264079/article/details/125060282)
- [Vue源码系列-Vue中文社区](https://vue-js.com/learn-vue/)
- [Vue性能优化总结](http://www.javashuo.com/article/p-vptbywhb-cr.html)

[双十一，打包半价理解Vue的nextTick与watcher以及Dep的蓝色生死恋？ - 掘金](https://juejin.cn/post/6844903711249022984)

---

vue性能优化

加载优化-减少包体积
- 路由懒加载 `component:  import(/* webpackChunkName: "about.js" */  './views/About.vue)`
- bundle分包，全家桶等第三方包，设置为externals, 走CDN加载
- 按需import tree-shaking友好 `import { debounce } from 'lodash'`

加载优化-充分利用缓存
- 静态资源名称用contenthash 走CDN 设置强缓存

渲染优化-提前渲染
- 预渲染 `prerender-spa-plugin` 适用于简单的，静态内容较多的页面
- ssr `vue-server-render` `vue-ssr-webpack-plugin`，提高首屏速度，增加服务器负载

渲染优化-按需渲染
- 组件/图片懒加载 `vue-lazyload`
  
渲染优化-框架
- 列表组件加key
- 精简接口字段 / 纯展示字段 Object.freeze()


---

vdom

在Vue中是通过VNode类来实例化出不同类型的虚拟DOM节点，并且学习了不同类型节点生成的属性的不同，所谓不同类型的节点其本质还是一样的，都是VNode类的实例，只是在实例化时传入的属性参数不同罢了。最后探究了VNode的作用，有了数据变化前后的VNode，我们才能进行后续的DOM-Diff找出差异，最终做到只更新有差异的视图，从而达到尽可能少的操作真实DOM的目的，以提高性能。


对比新旧两份VNode并找出差异的过程就是所谓的DOM-Diff过程。DOM-Diff算法是整个虚拟DOM的核心所在

> 在Vue中，把 DOM-Diff过程叫做patch过程。patch,意为“补丁”，即指对旧的VNode修补，打补丁从而得到新的VNode，非常形象哈。

- 如果新的VNode上有的节点而旧的oldVNode上没有，那么就在旧的oldVNode上加上去；
- 如果新的VNode上没有的节点而旧的oldVNode上有，那么就在旧的oldVNode上去掉；
- 如果某些节点在新的VNode和旧的oldVNode上都有，那么就以新的VNode为准，更新旧的oldVNode，从而让新旧VNode相同。

**总之一句话：以新的VNode为基准，改造旧的oldVNode使之成为跟新的VNode一样，这就是patch过程要干的事。**

说了这么多，听起来感觉好像很复杂的样子，其实不然，我们仔细想想，整个patch无非就是干三件事：

- 创建节点：新的VNode中有而旧的oldVNode中没有，就在旧的oldVNode中创建。
- 删除节点：新的VNode中没有而旧的oldVNode中有，就从旧的oldVNode中删除。
- 更新节点：新的VNode和旧的oldVNode中都有，就以新的VNode为准，更新旧的oldVNode。

节点类型：
- 注释节点
- 文本节点
- 元素节点
- 组件节点
- 函数组件节点
- 克隆节点


实际上只有3种类型的节点能够被创建并插入到DOM中，它们分别是：元素节点、文本节点、注释节点。



静态节点

```html
<p>我是不会变化的文字</p>
```
上面这个节点里面只包含了纯文字，没有任何可变的变量, 称之为 静态节点

- 如果VNode和oldVNode均为静态节点

  我们说了，静态节点无论数据发生任何变化都与它无关，所以都为静态节点的话则直接跳过，无需处理。

- 如果VNode是文本节点

  如果VNode是文本节点即表示这个节点内只包含纯文本，那么只需看oldVNode是否也是文本节点，如果是，那就比较两个文本是否不同，如果不同则把oldVNode里的文本改成跟VNode的文本一样。如果oldVNode不是文本节点，那么不论它是什么，直接调用setTextNode方法把它改成文本节点，并且文本内容跟VNode相同。

- 如果VNode是元素节点

  如果VNode是元素节点，则又细分以下两种情况：

  + 该节点包含子节点

    如果新的节点内包含了子节点，那么此时要看旧的节点是否包含子节点，如果旧的节点里也包含了子节点，那就需要递归对比更新子节点；如果旧的节点里不包含子节点，那么这个旧节点有可能是空节点或者是文本节点，如果旧的节点是空节点就把新的节点里的子节点创建一份然后插入到旧的节点里面，如果旧的节点是文本节点，则把文本清空，然后把新的节点里的子节点创建一份然后插入到旧的节点里面。

  + 该节点不包含子节点

    如果该节点不包含子节点，同时它又不是文本节点，那就说明该节点是个空节点，那就好办了，不管旧节点之前里面都有啥，直接清空即可。

```js
// 更新节点
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // vnode与oldVnode是否完全一样？若是，退出程序
  if (oldVnode === vnode) {
    return
  }
  const elm = vnode.elm = oldVnode.elm

  // vnode与oldVnode是否都是静态节点？若是，退出程序
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    return
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  // vnode有text属性？若没有：
  if (isUndef(vnode.text)) {
    // vnode的子节点与oldVnode的子节点是否都存在？
    if (isDef(oldCh) && isDef(ch)) {
      // 若都存在，判断子节点是否相同，不同则更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    }
    // 若只有vnode的子节点存在
    else if (isDef(ch)) {
      /**
       * 判断oldVnode是否有文本？
       * 若没有，则把vnode的子节点添加到真实DOM中
       * 若有，则清空Dom中的文本，再把vnode的子节点添加到真实DOM中
       */
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 若只有oldnode的子节点存在
    else if (isDef(oldCh)) {
      // 清空DOM中的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 若vnode和oldnode都没有子节点，但是oldnode中有文本
    else if (isDef(oldVnode.text)) {
      // 清空oldnode文本
      nodeOps.setTextContent(elm, '')
    }
    // 上面两个判断一句话概括就是，如果vnode中既没有text，也没有子节点，那么对应的oldnode中有什么就清空什么
  }
  // 若有，vnode的text属性与oldVnode的text属性是否相同？
  else if (oldVnode.text !== vnode.text) {
    // 若不相同：则用vnode的text替换真实DOM的文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
```


更新子节点

我们把新的VNode上的子节点数组记为newChildren，把旧的oldVNode上的子节点数组记为oldChildren，我们把newChildren里面的元素与oldChildren里的元素一一进行对比，

- 创建子节点

  如果newChildren里面的某个子节点在oldChildren里找不到与之相同的子节点，那么说明newChildren里面的这个子节点是之前没有的，是需要此次新增的节点，那么就创建子节点。

- 删除子节点

  如果把newChildren里面的每一个子节点都循环完毕后，发现在oldChildren还有未处理的子节点，那就说明这些未处理的子节点是需要被废弃的，那么就将这些节点删除。

- 移动子节点

  如果newChildren里面的某个子节点在oldChildren里找到了与之相同的子节点，但是所处的位置不同，这说明此次变化需要调整该子节点的位置，那就以newChildren里子节点的位置为基准，调整oldChildren里该节点的位置，使之与在newChildren里的位置相同。

- 更新节点

  如果newChildren里面的某个子节点在oldChildren里找到了与之相同的子节点，并且所处的位置也相同，那么就更新oldChildren里该节点，使之与newChildren里的该节点相同。



dom diff的前提是有vnode, vnode从哪里来呢?

把用户写的模板进行编译，就会产生VNode

把用户在`<template></template>`标签中写的类似于原生HTML的内容进行编译，把原生HTML的内容找出来，再把非原生HTML找出来，经过一系列的逻辑处理生成渲染函数，也就是render函数的这一段过程称之为模板编译过程。

![模板编译流程](https://vue-js.com/learn-vue/assets/img/1.f0570125.png)

将一堆字符串模板解析成抽象语法树AST后，我们就可以对其进行各种操作处理了，处理完后用处理后的AST来生成render函数。其具体流程可大致分为三个阶段：

- 模板解析阶段：将一堆模板字符串用正则等方式解析成抽象语法树AST；
- 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
- 代码生成阶段：将AST转换成渲染函数；

```js

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
    optimize(ast, options)
  }
  // 代码生成阶段：将AST转换成渲染函数；
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})

```

![模板编译步骤](https://vue-js.com/learn-vue/assets/img/3.15d9566b.png)

```js
// 代码位置：/src/complier/parser/index.js

/**
 * Convert HTML string to AST.
 */
export function parse(template, options) {
   // ...
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary) {

    },
    end () {

    },
    chars (text: string) {

    },
    comment (text: string) {

    }
  })
  return root
}
```
根据解析内容的不同分为HTML解析器，文本解析器和过滤器解析器。
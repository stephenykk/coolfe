JavaScript常见算法
===

## 简单排序
原生方法  没什么好说的 

```js
let arr=[4,3,5,2,1,8,7,9,6];
// 返回大于0 则 a 排到 b 后面
arr.sort((a, b) => a - b)
```

## 冒泡排序
小的数交换到当前遍历位置(_较轻则浮到当前遍历位置, 很像冒泡_)

```js
let arr=[4,3,5,2,1,8,7,9,6,10];

function bubbleSort(arr) {
    arr.forEach((a, i) => {
        arr.forEach((b, j) => {
            if(j > i && b < a) {
                arr[i] = b
                arr[j] = a
                a = arr[i] // 注意 i位置的值已改变，要更新a
            }
        })
    })
    return arr
}

console.log(bubbleSort(arr))
```

## 快速排序
比我小的放左边，比我大的放右边，其实就是快速确定了我的正确位置，不断去选定一个我，并确定我的准确位置

```js
let arr=[4,3,5,2,1,8,7,9,6,10];
function fastSort(arr) {
    if(arr.length <= 1) {
        return arr
    }

    let i = Math.floor(arr.length / 2)
    var val = arr[i]

    let left = []
    let right = []
    arr.forEach((el, j) => {
        if(j !== i) {
            let list = el >= val ? right : left
            list.push(el)
        }
    })

    return [...fastSort(left), val, ...fastSort(right)]
}

console.log(fastSort(arr))
```

## 插入排序
像打扑克牌，边摸排，边插入整理牌

```js
let arr=[4,3,5,2,1,8,7,9,6,10];

function insertSort(arr) {
    let sorted = []
    arr.forEach((el, i) => {
        if(!sorted.length) {
            sorted.push(el)
            return
        }

        let bigIndex = sorted.findIndex(val => val > el)
        if(bigIndex === -1) {
            sorted.push(el)
        } else {
            sorted.splice(bigIndex, 0, el)
        }
    })
    return sorted
}

console.log(insertSort(arr))
```


## LRU 最近使用缓存算法

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this._cache = []
  }

  item(key, value) {
    return {key, value}
  }

  has(key) {
    return this._cache.map(item => item.key).includes(key)
  }

  get(key) {
    if (!this.has(key)) {
      return
    }
    const index = this._cache.findIndex(item => item.key === key)
    const cachedItem = this._cache.splice(index, 1)[0]
    this._cache.unshift(cachedItem)

    this.show()
    return cachedItem.value
  }

  set(key, val) {
    const newItem = this.item(key, val)
    if (this.has(key)) {
      const oldIdx = this._cache.findIndex(item => item.key === key)
      this._cache[oldIdx] = newItem
      this.get(key)
      return true
    }


    if (this._cache.length >= this.capacity) {
      this._cache.pop()
    }

    this._cache.push(newItem)
    this.get(key)

    return true
  }

  show() {    
    console.log('🚀 ~ file: lru.js ~ line 47 ~ LRUCache ~ show ~ this._cache', this._cache);
  }
}


const lruCache = new LRUCache(3)

const val = lruCache.get('foo')
console.log('🚀 ~ file: lru.js ~ line 52 ~ val', val);

lruCache.set('name', 'lufy')
lruCache.set('age', 12)
lruCache.get('name')
lruCache.set('skill', 'fight')
lruCache.set('age', 18)
lruCache.set('role', 'captin')


// -----------------------------



class BetterLRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this._cache = new Map()
  }

  has(key) {
    return this._cache.has(key)
  }

  get(key) {
    if (!this.has(key)) return
    const val = this._cache.get(key)
    this._cache.delete(key)
    this._cache.set(key, val)
    console.log('🚀 ~ file: lru.js ~ line 81 ~ BetterLRUCache ~ get ~ this._cache', this._cache);
    return val
  }

  set(key, val) {
    if (this.has(key)) {
      this._cache.set(key, val)
      this.get(key)
      return
    }

    if (this._cache.size >= this.capacity) {
      // first is the oldest
      const keysIt = this._cache.keys()
      const firstKey = keysIt.next().value
      this._cache.delete(firstKey)
    }

    this._cache.set(key, val)
    console.log('🚀 ~ file: lru.js ~ line 99 ~ BetterLRUCache ~ set ~ this._cache', this._cache);

  }


}



const lruCache2 = new BetterLRUCache(3)

const val2 = lruCache2.get('foo')
console.log('🚀 ~ file: lru.js ~ line 109 ~ val2', val2);

lruCache2.set('name', 'lufy')
lruCache2.set('age', 12)
lruCache2.get('name')
lruCache2.set('skill', 'fight')
lruCache2.set('age', 18)
lruCache2.set('role', 'captin')

```


二叉树

```js
// 创建二叉树
function createBTree(size) {
  const arr = Array.from({length: size}).map((_, i) => i+1)
  const nodes = arr.map(val => ({val, l: null, r: null}))
  console.log('🚀 ~ file: btree.js ~ line 5 ~ createBTree ~ nodes', nodes);
  let tree = null
  function doCreateTree(roots) {
    if(!nodes.length) return;

    if (!roots) {
      roots = [nodes.shift()]
      tree = roots[0]
      return doCreateTree(roots)
    }
    const nextRoots = []
    roots.forEach(root => {
      if (nodes.length) {
        root.l = nodes.shift()
        nextRoots.push(root.l)
      }

      if (nodes.length) {
        root.r = nodes.shift()
        nextRoots.push(root.r)
      }

    })
    return doCreateTree(nextRoots)
  }
  
  doCreateTree()
  console.log(JSON.toString(tree, null, 2));
  return tree
}


const ORDERS = {first: 1, middle: 2, last: 3}

// 遍历二叉树
function walkTree(tree, order = ORDERS.middle, cb = console.log) {
  if (!tree) return
  if (order === ORDERS.middle) {
    tree.l && walkTree(tree.l, order)
    cb(tree.val)
    tree.r && walkTree(tree.r, order)
  }

  if (order === ORDERS.first) {
    cb(tree.val)
    tree.l && walkTree(tree.l, order)
    tree.r && walkTree(tree.r, order)
  }

  if (order === ORDERS.last) {
    tree.l && walkTree(tree.l, order)
    tree.r && walkTree(tree.r, order)
    cb(tree.val)
  }
}


function walkTreeByLevel(tree, cb = console.log) {
  let layer = [tree]
  while(layer.length) {
    const nextLayer = layer.reduce((newLayer, node) => {
      cb(node)
      node.l && newLayer.push(node.l)
      node.r && newLayer.push(node.r)
      return newLayer
    }, [])
    // console.log('🚀 ~ file: btree.js ~ line 71 ~ walkTreeByLevel ~ nextLayer', nextLayer);
    layer = nextLayer
  }
}

function walkTreeByLoop(tree, order = ORDERS.middle, cb = console.log) {
  if (!tree) return
  let stack = [tree]
  let curTree = tree
  if (order === ORDERS.middle) {
    while(stack.length) {
      let leftTree = curTree.l
      while(leftTree) {
        stack.push(leftTree)
        leftTree = leftTree.l
      }
      const leaf = stack.pop()
      cb(leaf.val)
      
      if(!stack.length) {
        return
      }

      let parent = stack.pop()
      cb(parent.val)
      
      let rightTree = parent.r
      while(!rightTree && stack.length) {
        parent = stack.pop()
        cb(parent.val)
        rightTree = parent.r
      }

      if(rightTree) {
        stack.push(rightTree)
        curTree = rightTree
      }

    }
  }
}

function addParentPointer(node) {
  if(node.l){
    node.l.p = node
  }
  if(node.r) {
    node.r.p = node
  }
}

function getTreeDepth(tree) {
  if(!tree) return 0
  if(!tree.l) return 1
  const ldepth = getTreeDepth(tree.l)
  const rdepth = getTreeDepth(tree.r)
  const depth = Math.max(ldepth, rdepth)
  return depth + 1
}



const tree = createBTree(12)

// walkTree(tree, ORDERS.last)

// walkTreeByLevel(tree, addParentPointer)

// console.log(tree);

// walkTreeByLoop(tree)

console.log('depth is:', getTreeDepth(tree))


// ===============================================================================

// 生成二叉树
function btree(n = 10) {
  var arr = Array.from({ length: n }).map((val, i) => i + 1);
  function node(val) {
    return { val, left: null, right: null };
  }

  function branch(pnode, side, nodeList) {
    if (!arr.length) return;
    pnode[side] = node(arr.shift());
    nodeList.push(pnode[side]);
  }

  // 创建分支, 为每层级的父节点分配2个子节点
  function makeBranches(pnodes) {
    if (!pnodes.length) return;
    const nextPnodes = [];
    pnodes.forEach((pnode) => {
      branch(pnode, "left", nextPnodes);
      branch(pnode, "right", nextPnodes);
    });
    makeBranches(nextPnodes);
  }

  const root = node(arr.shift());
  makeBranches([root]);
  return root;
}

// 递归方式 中序遍历二叉树
function walkBtree(n) {
  const tree = btree(n);
  console.log(tree);
  function walk(tree) {
    if (!tree) return true;
    walk(tree.left);
    console.log(tree.val);
    walk(tree.right);
  }
  walk(tree);
}

// --------------------------------

// 非递归方式生成二叉树
function btree2(n = 10) {
  function node(val) {
    return { val, left: null, right: null };
  }

  let arr = Array.from({ length: n }).map((_, i) => i + 1);
  arr = arr.map(node); // 数组映射为节点数组

  // 创建元素个数倍增的层级列表 1,2,4,8,..
  function getLayers(arr) {
    const layers = [];
    let level = 0;
    while (arr.length) {
      layers.push(arr.splice(0, Math.pow(2, level)));
      level++;
    }

    return layers;
  }

  // 设置上下层级父子关系
  // pnode.left pnode.right 分别指向下层的对应节点
  function setPointers(layers) {
    layers.forEach((layer, i) => {
      const nextLayer = layers[i + 1];
      if (!nextLayer) return;

      layer.forEach((pnode, j) => {
        const rightIdx = (j + 1) * 2 - 1;
        const leftIdx = rightIdx - 1;
        const lnode = nextLayer[leftIdx];
        const rnode = nextLayer[rightIdx];
        if (lnode) {
          pnode.left = lnode;
        }
        if (rnode) {
          pnode.right = rnode;
        }
      });
    });
    const root = layers[0][0];
    return root;
  }

  return setPointers(getLayers(arr));
}

// 非递归遍历二叉树
function walkBtree2(n) {
  const tree = btree2(n);
  console.log(tree);
  const stack = [];
  let ctree = tree;
  while (ctree.left) {
    stack.push(ctree);
    ctree = ctree.left;
  }
  console.log(ctree.val); // 最左端 叶子
  while (stack.length) {
    const ntree = stack.pop();
    console.log(ntree.val);

    if (ntree.right) {
      let subtree = ntree.right;
      while (subtree.left) {
        stack.push(subtree);
        subtree = subtree.left;
      }
      console.log(subtree.val); // 右子树的 最左端叶子
    }
  }
}

// -----------------

// walkBtree(10);
// console.log("------------------");
// walkBtree2(10);

```
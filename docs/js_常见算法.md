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
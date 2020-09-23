/* 
 * helper for web
 */

/**
 * 查找页面元素
 * @param {string} s 选择器
 */
function $(s) {
    return document.querySelector(s)
}

/**
 * 添加页面快捷键
 * @param {string} keys 快捷键
 * @param {function} callback 回调函数
 */
function addShortCute(keys, callback) {
    keys = keys.split('+').map(v => v.trim())
    let key = keys.pop()
    let keyCond = {
        key
    }
    if (keys.length) {
        keys = keys.map(ctrlKey => `${ctrlKey}Key`)
        keys.forEach(key => keyCond[key] = true)
    }

    document.addEventListener('keyup', function (event) {
        let data = pick(event, Object.keys(keyCond))
        data.key = data.key.toLowerCase()
        if(looseEqual(data, keyCond)) {
            callback()
        }
    })
}

function pick(data, keys) {
    let obj = {}
    keys.forEach(key => obj[key] = data[key])
    return obj
}

function isPlainObject(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
}

function looseEqual(a, b) {
    
    function isArray(arr) {
        return Array.isArray(arr)
    }

    
    function isPrimitive(val) {
        return !isArray(val) && !isPlainObject(val)
    }

    let akeys = Object.keys(a)
    let bkeys = Object.keys(b)
    // check keys length
    if (akeys.length !== bkeys.length) return false

    akeys.sort()
    bkeys.sort()
    // check keys value
    for (let [i, akey] of Object.entries(akeys)) {
        let bkey = bkeys[i]
        if (akey !== bkey) return false
    }

    // check arr eqal arr or obj equal obj
    return akeys.every(key => {
        let av = a[key]
        let bv = b[key]

        if (isPrimitive(av) && isPrimitive(bv)) {
            return av.toString() === bv.toString()
        }

        let bothArray = isArray(av) && isArray(bv)
        let bothObject = isPlainObject(av) && isPlainObject(bv)
        if (bothArray || bothObject) {
            return looseEqual(av, bv)
        }

        return false

    })
}
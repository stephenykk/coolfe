function pick(obj = {}, keys = []) {
  const result = {}
  keys.forEach(key => result[key] = obj[key])
  return result;
}

function isPlainObject(val) {
  return Object.prototype.toString.call(val).slice(8, -1) === 'Object'
}

function isArray(val) {
  return Array.isArray(val)
}

function isPrimative(val) {
  const type = Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
  return ['string', 'number', 'null', 'undefined', 'boolean'].includes(type)
}

function toPrimative(val) {
  return val.toString()
}

function log(...args) {
  console.log(...args)
}

function looseEqual(a, b) {
  const bothArray = isArray(a) && isArray(b)
  const bothPlainObject = isPlainObject(a) && isPlainObject(b)
  if(!bothArray && !bothPlainObject) {
    return a === b
  }

  const checkSameKeys = function(a, b) {
    const akeys = Object.keys(a)
    const bkeys = Object.keys(b)
    if (akeys.length !== bkeys.length) return false

    akeys.sort()
    bkeys.sort()
    return akeys.every((ak, i) => {
      const bk = bkeys[i]
      return ak === bk
    })
  }

  const sameKeys = checkSameKeys(a, b)
  if (!sameKeys) return false

  const checkSameVals = function(a, b) {
    const keys = Object.keys(a)
    return keys.every(key => {
      const av = a[key]
      const bv = b[key]
      const bothPrm = isPrimative(av) && isPrimative(bv)
      if (bothPrm) {
        return av === bv
      }

      const bothArr = isArray(av) && isArray(bv)
      const bothObj = isPlainObject(av) && isPlainObject(bv)
      if (bothArr || bothObj) {
        return looseEqual(av, bv)
      }

      return toPrimative(av) === toPrimative(bv)
    })
  }

  const sameVals = checkSameVals(a, b)

  return sameVals

}



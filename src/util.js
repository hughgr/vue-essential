export function def (obj, key, val, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true
  })
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

const kCustomPromisifiedSymbol = Symbol('keepPromise.custom');

function keepPromise(orig) {
  if (typeof orig !== 'function')
    throw new TypeError('please pass in function')

  if (orig[kCustomPromisifiedSymbol]) {
    const fn = orig[kCustomPromisifiedSymbol]
    if (typeof fn !== 'function') {
      throw new TypeError('The [util.promisify.custom] property must be ' +
        'a function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }


  function fn(...args) {
    try {
      if (args.length > 0 && typeof args[args.length - 1] === 'function') {
        const cb = args.pop()
        orig.call(this, ...args).then(_ => cb(null, _)).catch(_ => cb(_))
        return null
      } else {
        return orig.call(this, ...args)
      }
    } catch (error) {
      return Promise.reject(new Error('fail'))
    }
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(orig));

  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(orig));
}
module.exports = keepPromise
var keepPromise = function (promiseBasedFunction) {
  if (typeof promiseBasedFunction !== 'function') {
    throw 'please pass in function'
  }

  return function () {
    if (arguments.length - promiseBasedFunction.length === 1) {
      var cb = arguments[arguments.length - 1]
      if (typeof cb === 'function') {
        var args = Array.from(arguments)
        args.pop()
        promiseBasedFunction(args).then(function (r) {
          cb(null, r)
        }).catch(function (e) {
          cb(e)
        })
        return null
      }
    }
    return promiseBasedFunction(arguments)
  }
}
module.exports = keepPromise



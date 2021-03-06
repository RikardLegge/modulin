// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function value(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    'use strict';

    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
})(window, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = r('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && typeof require === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
   `Promise.resolve` returns a promise that will become resolved with the
   passed `value`. It is shorthand for the following:
    ```javascript
   let promise = new Promise(function(resolve, reject){
    resolve(1);
  });
    promise.then(function(value){
    // value === 1
  });
   ```
    Instead of writing the above, your code now simply becomes the following:
    ```javascript
   let promise = Promise.resolve(1);
    promise.then(function(value){
    // value === 1
  });
   ```
    @method resolve
   @static
   @param {Any} value value that the returned promise will be resolved with
   Useful for tooling.
   @return {Promise} a promise that will become fulfilled with the given
   `value`
   */
  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    _resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
   `Promise.all` accepts an array of promises, and returns a new promise which
   is fulfilled with an array of fulfillment values for the passed promises, or
   rejected with the reason of the first passed promise to be rejected. It casts all
   elements of the passed iterable to promises as it runs this algorithm.
    Example:
    ```javascript
   let promise1 = resolve(1);
   let promise2 = resolve(2);
   let promise3 = resolve(3);
   let promises = [ promise1, promise2, promise3 ];
    Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
   ```
    If any of the `promises` given to `all` are rejected, the first promise
   that is rejected will be given as an argument to the returned promises's
   rejection handler. For example:
    Example:
    ```javascript
   let promise1 = resolve(1);
   let promise2 = reject(new Error("2"));
   let promise3 = reject(new Error("3"));
   let promises = [ promise1, promise2, promise3 ];
    Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
   ```
    @method all
   @static
   @param {Array} entries array of promises
   @param {String} label optional string for labeling the promise.
   Useful for tooling.
   @return {Promise} promise that is fulfilled when all `promises` have been
   fulfilled, or rejected if any of them become rejected.
   @static
   */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
   `Promise.race` returns a new promise which is settled in the same way as the
   first passed promise to settle.
    Example:
    ```javascript
   let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });
    let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });
    Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
   ```
    `Promise.race` is deterministic in that only the state of the first
   settled promise matters. For example, even if other promises given to the
   `promises` array argument are resolved, but the first settled promise has
   become rejected before the other promises became fulfilled, the returned
   promise will become rejected:
    ```javascript
   let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });
    let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });
    Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
   ```
    An example real-world use case is implementing timeouts:
    ```javascript
   Promise.race([ajax('foo.json'), timeout(5000)])
   ```
    @method race
   @static
   @param {Array} promises array of promises to observe
   Useful for tooling.
   @return {Promise} a promise which settles in the same way as the first passed
   promise to settle.
   */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
   `Promise.reject` returns a promise rejected with the passed `reason`.
   It is shorthand for the following:
    ```javascript
   let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });
    promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
   ```
    Instead of writing the above, your code now simply becomes the following:
    ```javascript
   let promise = Promise.reject(new Error('WHOOPS'));
    promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
   ```
    @method reject
   @static
   @param {Any} reason value that the returned promise will be rejected with.
   Useful for tooling.
   @return {Promise} a promise rejected with the given `reason`.
   */
  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    _reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
   Promise objects represent the eventual result of an asynchronous operation. The
   primary way of interacting with a promise is through its `then` method, which
   registers callbacks to receive either a promise's eventual value or the reason
   why the promise cannot be fulfilled.
    Terminology
   -----------
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
   - `thenable` is an object or function that defines a `then` method.
   - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
   - `exception` is a value that is thrown using the throw statement.
   - `reason` is a value that indicates why a promise was rejected.
   - `settled` the final resting state of a promise, fulfilled or rejected.
    A promise can be in one of three states: pending, fulfilled, or rejected.
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
   state.  Promises that are rejected have a rejection reason and are in the
   rejected state.  A fulfillment value is never a thenable.
    Promises can also be said to *resolve* a value.  If this value is also a
   promise, then the original promise's settled state will match the value's
   settled state.  So a promise that *resolves* a promise that rejects will
   itself reject, and a promise that *resolves* a promise that fulfills will
   itself fulfill.
     Basic Usage:
   ------------
    ```js
   let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);
     // on failure
    reject(reason);
  });
    promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
   ```
    Advanced Usage:
   ---------------
    Promises shine when abstracting away asynchronous interactions such as
   `XMLHttpRequest`s.
    ```js
   function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();
       xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();
       function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }
    getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
   ```
    Unlike callbacks, promises are great composable primitives.
    ```js
   Promise.all([
   getJSON('/posts'),
   getJSON('/comments')
   ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON
     return values;
  });
   ```
    @class Promise
   @param {function} resolver
   Useful for tooling.
   @constructor
   */
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;

  Promise.prototype = {
    constructor: Promise,

    /**
     The primary way of interacting with a promise is through its `then` method,
     which registers callbacks to receive either a promise's eventual value or the
     reason why the promise cannot be fulfilled.
      ```js
     findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
     ```
      Chaining
     --------
      The return value of `then` is itself a promise.  This second, 'downstream'
     promise is resolved with the return value of the first promise's fulfillment
     or rejection handler, or rejected if the handler throws an exception.
      ```js
     findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
      findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
     ```
     If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
      ```js
     findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
     ```
      Assimilation
     ------------
      Sometimes the value you want to propagate to a downstream promise can only be
     retrieved asynchronously. This can be achieved by returning a promise in the
     fulfillment or rejection handler. The downstream promise will then be pending
     until the returned promise is settled. This is called *assimilation*.
      ```js
     findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
     ```
      If the assimliated promise rejects, then the downstream promise will also reject.
      ```js
     findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
     ```
      Simple Example
     --------------
      Synchronous Example
      ```javascript
     let result;
      try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
     ```
      Errback Example
      ```js
     findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
     ```
      Promise Example;
      ```javascript
     findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
     ```
      Advanced Example
     --------------
      Synchronous Example
      ```javascript
     let author, books;
      try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
     ```
      Errback Example
      ```js
      function foundBooks(books) {
     }
      function failure(reason) {
     }
      findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
     ```
      Promise Example;
      ```javascript
     findAuthor().
     then(findBooksByAuthor).
     then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
     ```
      @method then
     @param {Function} onFulfilled
     @param {Function} onRejected
     Useful for tooling.
     @return {Promise}
     */
    then: then,

    /**
     `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
     as the catch block of a try/catch statement.
      ```js
     function findAuthor(){
      throw new Error('couldn't find that author');
    }
      // synchronous
     try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
      // async with promises
     findAuthor().catch(function(reason){
      // something went wrong
    });
     ```
      @method catch
     @param {Function} onRejection
     Useful for tooling.
     @return {Promise}
     */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  // Strange compat..
  Promise.polyfill = polyfill;
  Promise.Promise = Promise;

  return Promise;
});

ES6Promise.polyfill();

var ModulinFactory = function () {
  function ModulinFactory(_ref) {
    var dependencyRepositoryFactory = _ref.dependencyRepositoryFactory,
        loaderFactory = _ref.loaderFactory,
        temporaryLoaderFactory = _ref.temporaryLoaderFactory;
    classCallCheck(this, ModulinFactory);

    this.dependencyRepositoryFactory = dependencyRepositoryFactory;
    this.loaderFactory = loaderFactory;
    this.temporaryLoaderFactory = temporaryLoaderFactory;
  }

  createClass(ModulinFactory, [{
    key: "createLoader",
    value: function createLoader(basePath) {

      var dependencyRepository = this.dependencyRepositoryFactory({
        basePath: basePath
      });

      var define = this.loaderFactory.createLoader(dependencyRepository);
      this.temporaryLoaderFactory.setInstance(define);
      return define;
    }
  }, {
    key: "load",
    value: function load(basePath, module) {
      var define = this.createLoader(basePath);
      define([module], {});
    }
  }]);
  return ModulinFactory;
}();

var Request = function Request() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$method = _ref.method,
      method = _ref$method === undefined ? "GET" : _ref$method,
      url = _ref.url;

  classCallCheck(this, Request);

  return new Promise(function (resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          resolve(xmlhttp.responseText);
        } else {
          reject(xmlhttp.responseText);
        }
      }
    };
    xmlhttp.send();
  });
};

var Script = function () {
  function Script(source, url, id) {
    classCallCheck(this, Script);

    this.id = id;
    this.path = id.replace(/[^/]*$/, '');
    this.url = url;
    this.source = source;
  }

  createClass(Script, [{
    key: 'execute',
    value: function execute() {
      eval(this.source);
    }
  }]);
  return Script;
}();

var ScriptLoader = function () {
  function ScriptLoader(_ref) {
    var basePath = _ref.basePath,
        scriptInterceptors = _ref.scriptInterceptors,
        fetch = _ref.fetch;
    classCallCheck(this, ScriptLoader);

    this.basePath = basePath;
    this.scriptInterceptors = scriptInterceptors;
    this.fetch = fetch;
  }

  createClass(ScriptLoader, [{
    key: 'getFileType',
    value: function getFileType(path) {
      var match = path.match(/\.([^./]+)$/);
      return match && this.scriptInterceptors[match[1]] ? match[1] : 'default';
    }
  }, {
    key: 'getUrl',
    value: function getUrl(path) {
      var baseUrl = '' + this.basePath + path;
      var fileType = this.getFileType(path);
      return fileType === 'default' ? baseUrl + '.js' : '' + baseUrl;
    }
  }, {
    key: 'getInterceptor',
    value: function getInterceptor(path) {
      var fileType = this.getFileType(path);
      var defaultInterceptor = this.scriptInterceptors['default'];
      var typeInterceptor = fileType !== 'default' && this.scriptInterceptors[fileType];

      return { intercept: function intercept(script) {
          typeInterceptor && (script = typeInterceptor.intercept(script));
          script = defaultInterceptor.intercept(script);
          return script;
        } };
    }
  }, {
    key: 'load',
    value: function load(path) {
      var fileType = this.getFileType(path);
      var interceptor = this.getInterceptor(path);
      var url = this.getUrl(path);

      if (!interceptor) throw new Error('Interceptor not found for ' + fileType);

      return this.fetch(url).then(function (source) {
        return interceptor.intercept(new Script(source, url, path));
      });
    }
  }]);
  return ScriptLoader;
}();

var ImportParser = function () {
  function ImportParser(tokenizer) {
    classCallCheck(this, ImportParser);

    this.tokenizer = tokenizer;
  }

  createClass(ImportParser, [{
    key: "rewrite",
    value: function rewrite(_ref) {
      var script = _ref.script,
          imports = _ref.imports;

      imports.push.apply(imports, toConsumableArray(this.tokenizer.extractImports(script)));
    }
  }]);
  return ImportParser;
}();

var TokenizerUtils = function () {
  function TokenizerUtils() {
    classCallCheck(this, TokenizerUtils);
  }

  createClass(TokenizerUtils, null, [{
    key: 'splitMemberAndAlias',
    value: function splitMemberAndAlias(string) {
      var splitRe = /\s+as\s+/g;
      var type = 'mapped';

      var _string$split$map = string.split(splitRe).map(trim),
          _string$split$map2 = slicedToArray(_string$split$map, 2),
          name = _string$split$map2[0],
          alias = _string$split$map2[1];

      return { name: name, alias: alias, type: type };

      function trim(str) {
        return str.trim();
      }
    }
  }, {
    key: 'resolveRelativePath',
    value: function resolveRelativePath(cwd, path) {
      var excessiveDotsRe = /(^|\/)([\\.]){3,}/g;
      var noOpsRe = /(^|\/)[.](?=[^.])/g;
      var slashPrefix = /^\//g;
      var resolveRe = /(\.?[^.\n/]+)+(^|\/)[.]{2}/;

      var startChar = path[0];
      if (startChar === '/' || startChar === '.') {
        var fullPath = startChar === '/' ? path : cwd + path;

        fullPath = fullPath.replace(excessiveDotsRe, '');
        fullPath = fullPath.replace(noOpsRe, '');

        var resolvedFullPath = fullPath.replace(resolveRe, '');
        while (fullPath !== resolvedFullPath) {
          fullPath = resolvedFullPath;
          resolvedFullPath = fullPath.replace(resolveRe, '');
        }

        fullPath = fullPath.replace(slashPrefix, '');

        return fullPath;
      } else {
        return path;
      }
    }
  }, {
    key: 'splitVariableAndValue',
    value: function splitVariableAndValue(string) {
      var splitRe = /=/;
      var type = 'mapped';

      var _string$split$map3 = string.split(splitRe).map(trim),
          _string$split$map4 = slicedToArray(_string$split$map3, 2),
          name = _string$split$map4[0],
          value = _string$split$map4[1];

      return { name: name, value: value, type: type };

      function trim(str) {
        return str.trim().replace(/;$/, '');
      }
    }
  }, {
    key: 'filterEmpty',
    value: function filterEmpty(str) {
      return !!str.trim();
    }
  }]);
  return TokenizerUtils;
}();

var ImportStatement = function ImportStatement(_ref) {
  var id = _ref.id,
      moduleName = _ref.moduleName,
      members = _ref.members;
  classCallCheck(this, ImportStatement);

  this.moduleName = moduleName;
  this.members = members;
  this.id = id;
};

var ImportMember = function ImportMember(_ref) {
  var name = _ref.name,
      alias = _ref.alias,
      type = _ref.type;
  classCallCheck(this, ImportMember);

  this.name = name;
  this.alias = alias;
  this.type = type;
};

var ImportTokenizer = function () {
  function ImportTokenizer(importGenerator) {
    classCallCheck(this, ImportTokenizer);

    this.importGenerator = importGenerator;
  }

  createClass(ImportTokenizer, [{
    key: "extractImports",
    value: function extractImports(script) {
      var _this = this;

      var importRe = /^[\t ]*(import [\t \w"'-{}._]*?)[\t ]*;?[\t ]*$/gm;
      var imports = [];

      script.source = script.source.replace(importRe, function (line, normalizedLine) {
        var importStatement = _this.replaceImport(normalizedLine, { path: script.path });
        imports.push(importStatement);
        return _this.importGenerator.formatImportMembers(importStatement);
      });

      return imports;
    }
  }, {
    key: "replaceImport",
    value: function replaceImport(line, script) {
      var _this2 = this;

      var id = this.importGenerator.generateId();

      var defaultMember = this.defaultMember(line);
      var moduleName = this.module(line, script);
      var globMember = this.globMember(line);
      var mappedMembers = this.mappedMembers(line);
      var members = [defaultMember, globMember].concat(toConsumableArray(mappedMembers)).filter(function (it) {
        return _this2.filterEmpty(it);
      }).map(function (member) {
        return new ImportMember(member);
      });

      return new ImportStatement({ id: id, moduleName: moduleName, members: members });
    }
  }, {
    key: "defaultMember",
    value: function defaultMember(line) {
      var type = 'default';
      var defaultMemberRe = /^import\s+(\w+)/;
      var matchResult = line.match(defaultMemberRe);
      var name = matchResult ? matchResult[1] : null;

      return { name: name, type: type };
    }
  }, {
    key: "module",
    value: function module(line, script) {
      var moduleRe = /(?:from\s+)?(["'])([\w/\-._]+)\1$/;
      var matchResult = line.match(moduleRe);
      var moduleName = matchResult ? TokenizerUtils.resolveRelativePath(script.path, matchResult[2]) : null;

      return moduleName;
    }
  }, {
    key: "globMember",
    value: function globMember(line) {
      var type = 'all';
      var globMemberRe = /^import\s+\*\s+as\s+(\w+)/;
      var matchResult = line.match(globMemberRe);
      var name = matchResult ? matchResult[1] : null;

      return { name: name, type: type };
    }
  }, {
    key: "mappedMembers",
    value: function mappedMembers(line) {
      var moduleRe = /^import\s+\{([\w\s,]*)}/;
      var matchResult = line.match(moduleRe);
      var mappedMemberMatch = matchResult ? matchResult[1] : '';

      return mappedMemberMatch.split(',').filter(function (it) {
        return TokenizerUtils.filterEmpty(it);
      }).map(function (match) {
        return TokenizerUtils.splitMemberAndAlias(match);
      });
    }
  }, {
    key: "filterEmpty",
    value: function filterEmpty(obj) {
      return !!obj.name;
    }
  }]);
  return ImportTokenizer;
}();

var ExportParser = function () {
  function ExportParser(tokenizer) {
    classCallCheck(this, ExportParser);

    this.tokenizer = tokenizer;
  }

  createClass(ExportParser, [{
    key: "rewrite",
    value: function rewrite(_ref) {
      var script = _ref.script,
          exports = _ref.exports,
          imports = _ref.imports;

      var extracted = this.tokenizer.extractExports(script);
      exports.push.apply(exports, toConsumableArray(extracted.exports));
      imports.push.apply(imports, toConsumableArray(extracted.imports));
    }
  }]);
  return ExportParser;
}();

var ExportStatement = function ExportStatement(_ref) {
  var members = _ref.members,
      module = _ref.module,
      expression = _ref.expression;
  classCallCheck(this, ExportStatement);

  this.members = members;
  this.module = module;
  this.expression = expression;
};

var ExportMember = function ExportMember(_ref) {
  var name = _ref.name,
      alias = _ref.alias,
      type = _ref.type;
  classCallCheck(this, ExportMember);

  this.name = name;
  this.alias = alias;
  this.type = type;
};

var ExportTokenizer = function () {
  function ExportTokenizer(exportGenerator, importGenerator) {
    classCallCheck(this, ExportTokenizer);

    this.exportGenerator = exportGenerator;
    this.importGenerator = importGenerator;
  }

  createClass(ExportTokenizer, [{
    key: "extractExports",
    value: function extractExports(script) {
      var _this = this;

      var exportRe = /^[\t ]*(export[\t ]+[{*\w\d_$][^\n]*);?[\t ]*$/gm;
      var exports = [];
      var imports = [];

      script.source = script.source.replace(exportRe, function (line, normalizedLine) {
        var _replaceExport = _this.replaceExport(normalizedLine, exports),
            exportStatement = _replaceExport.exportStatement,
            importStatement = _replaceExport.importStatement;

        exportStatement && exports.push(exportStatement);
        importStatement && imports.push(importStatement);
        return exportStatement.expression || '';
      });

      return { exports: exports, imports: imports };
    }
  }, {
    key: "replaceExport",
    value: function replaceExport(line) {
      return this.extractVariableDeclaration(line) || this.extractPreDeclaredVariables(line) || this.extractExpression(line) || this.triggerExtractionError(line);
    }
  }, {
    key: "extractVariableDeclaration",
    value: function extractVariableDeclaration(scriptSource) {
      var variableDeclarationRe = /^export\s+((?:let|var|const)\s+(.+))/;
      var matchResult = scriptSource.match(variableDeclarationRe);

      var _ref = matchResult ? matchResult : [],
          _ref2 = slicedToArray(_ref, 3),
          matched = _ref2[0],
          expression = _ref2[1],
          variableString = _ref2[2];

      if (matched) {
        var memberDeclarations = this.splitVariableDeclarations(variableString);
        var members = memberDeclarations.map(function (member) {
          return new ExportMember(member);
        });
        return { exportStatement: new ExportStatement({ members: members, expression: expression }) };
      }
    }
  }, {
    key: "extractPreDeclaredVariables",
    value: function extractPreDeclaredVariables(scriptSource) {
      var predeclaredVariableRe = /^export\s+(?:\{([\s\w\d_$,]*)}|(\*))(?:\s+from\s+(["'])?([\w\d\-._$/]+)\3)?/;
      var matchResult = scriptSource.match(predeclaredVariableRe);

      var _ref3 = matchResult ? matchResult : [],
          _ref4 = slicedToArray(_ref3, 5),
          matched = _ref4[0],
          variableString = _ref4[1],
          allMembers = _ref4[2],
          _ = _ref4[3],
          moduleName = _ref4[4];

      if (matched) {
        if (moduleName) {
          var id = this.importGenerator.generateId();

          var expression = void 0;
          if (allMembers) {
            expression = this.importGenerator.formatImportMember(id, { type: 'passThroughAll' });
          } else {
            var members = this.splitVariableAliases(variableString);
            members.forEach(function (module) {
              return module.type = 'passThrough';
            });
            expression = this.importGenerator.formatImportMembers({ id: id, members: members });
          }

          return {
            importStatement: new ImportStatement({ members: [], moduleName: moduleName, id: id }),
            exportStatement: new ExportStatement({ members: [], moduleName: moduleName, expression: expression })
          };
        } else {
          var memberDeclarations = this.splitVariableAliases(variableString);
          var _members = memberDeclarations.map(function (member) {
            return new ExportMember(member);
          });
          return { exportStatement: new ExportStatement({ members: _members }) };
        }
      }
    }
  }, {
    key: "extractExpression",
    value: function extractExpression(scriptSource) {
      var expressionRe = /^export\s+(default\s+)?((function|class)?[\w{(]+(?:\s+([\d_$\w]+))?.*)$/;
      var matchResult = scriptSource.match(expressionRe);

      var _ref5 = matchResult ? matchResult : [],
          _ref6 = slicedToArray(_ref5, 5),
          matched = _ref6[0],
          isDefault = _ref6[1],
          fullExpression = _ref6[2],
          isDeclaration = _ref6[3],
          name = _ref6[4];

      if (matched) {
        var missingName = !name;
        var immediateDeclaration = isDefault && !isDeclaration;

        var members = [];
        var expression = void 0;

        if (immediateDeclaration || missingName) {
          expression = "exports['default'] = " + fullExpression;
        } else {
          var type = 'mapped';
          var alias = isDefault ? 'default' : null;

          expression = "" + fullExpression;
          members.push(new ExportMember({ type: type, name: name, alias: alias }));
        }

        return { exportStatement: new ExportStatement({ members: members, expression: expression }) };
      }
    }
  }, {
    key: "triggerExtractionError",
    value: function triggerExtractionError(line) {
      throw "Export rewrite failed for line: " + line;
    }
  }, {
    key: "splitVariableAliases",
    value: function splitVariableAliases(variableString) {
      var members = variableString.split(',').filter(function (it) {
        return TokenizerUtils.filterEmpty(it);
      }).map(function (match) {
        return TokenizerUtils.splitMemberAndAlias(match);
      });

      return members;
    }
  }, {
    key: "splitVariableDeclarations",
    value: function splitVariableDeclarations(variableString) {
      var members = variableString.split(',').filter(function (it) {
        return TokenizerUtils.filterEmpty(it);
      }).map(function (match) {
        return TokenizerUtils.splitVariableAndValue(match);
      });

      return members;
    }
  }]);
  return ExportTokenizer;
}();

var AmdModule = function AmdModule(_ref) {
  var id = _ref.id,
      dependencies = _ref.dependencies,
      factory = _ref.factory;
  classCallCheck(this, AmdModule);

  this.id = id;
  this.dependencies = dependencies;

  if (typeof factory === 'function') {
    this.exports = {};
    this.factory = factory;
  } else {
    this.exports = factory;
    this.factory = function () {};
  }
};

var AmdFactory = function () {
  function AmdFactory() {
    classCallCheck(this, AmdFactory);
  }

  createClass(AmdFactory, [{
    key: 'createLoader',
    value: function createLoader(dependencyRepository) {
      define.amd = {};
      return define;

      function define(id, dependencies, factory) {
        var normalizedInput = normalizeInput(id, dependencies, factory);
        var module = new AmdModule(normalizedInput);
        dependencyRepository.register(module);
      }

      function normalizeInput(id, dependencies, factory) {
        if (typeof id === 'function' || id.constructor === Object) {
          return {
            id: "UNKNOWN",
            dependencies: [],
            factory: id
          };
        } else if (id.constructor === Array) {
          return {
            id: "UNKNOWN",
            dependencies: id,
            factory: dependencies
          };
        } else {
          return {
            id: id,
            dependencies: dependencies,
            factory: factory
          };
        }
      }
    }
  }]);
  return AmdFactory;
}();

var AmdWrapperGenerator$1 = function () {
  function AmdWrapperGenerator() {
    classCallCheck(this, AmdWrapperGenerator);

    this.counter = 0;
    this.defaultImports = [new ImportStatement({ moduleName: 'exports', id: 'exports', members: [] })];
  }

  createClass(AmdWrapperGenerator, [{
    key: 'generateId',
    value: function generateId() {
      return '__DEP' + ++this.counter;
    }
  }, {
    key: 'generate',
    value: function generate(importStatements) {
      var extendedImportStatements = [].concat(toConsumableArray(this.defaultImports), toConsumableArray(importStatements));
      return {
        dependencyList: this.generateDependencyList(extendedImportStatements),
        dependencyArguments: this.generateDependencyArguments(extendedImportStatements)
      };
    }
  }, {
    key: 'generateDependencyArguments',
    value: function generateDependencyArguments(importStatements) {
      var dependencyNames = importStatements.map(function (statement) {
        return statement.id;
      }).join(',');

      return dependencyNames;
    }
  }, {
    key: 'generateDependencyList',
    value: function generateDependencyList(importStatements) {
      var dependencies = importStatements.map(function (statement) {
        return statement.moduleName;
      }).map(function (moduleName) {
        return '"' + moduleName + '"';
      }).join(',');

      return '[' + dependencies + ']';
    }
  }, {
    key: 'formatImportMembers',
    value: function formatImportMembers(_ref) {
      var _this = this;

      var id = _ref.id,
          members = _ref.members;

      return members.map(function (member) {
        return _this.formatImportMember(id, member);
      }).join('');
    }
  }, {
    key: 'formatImportMember',
    value: function formatImportMember(id, member) {
      var alias = member.alias || member.name;

      switch (member.type) {
        case "default":
        case "all":
        case "mapped":
          return 'var ' + alias + ' = ' + this.formatImportValue(id, member) + ';';
        case "passThroughAll":
          return 'Object.assign(exports, ' + this.formatImportValue(id, { type: 'all' }) + ');';
        case "passThrough":
          return 'exports["' + alias + '"] = ' + this.formatImportValue(id, { type: 'mapped', name: member.name }) + ';';
        default:
          return '';
      }
    }
  }, {
    key: 'formatImportValue',
    value: function formatImportValue(id, _ref2) {
      var name = _ref2.name,
          type = _ref2.type;

      switch (type) {
        case "default":
          return id + '.exports["default"]';
        case "all":
          return id + '.exports';
        case "mapped":
          return id + '.exports["' + name + '"]';
        default:
          return '';
      }
    }
  }]);
  return AmdWrapperGenerator;
}();

var AmdExportGenerator$1 = function () {
  function AmdExportGenerator() {
    classCallCheck(this, AmdExportGenerator);
  }

  createClass(AmdExportGenerator, [{
    key: 'generate',
    value: function generate(exportStatements) {
      return {
        exportMappings: this.generateExportMappings(exportStatements)
      };
    }
  }, {
    key: 'generateExportMappings',
    value: function generateExportMappings(exportStatements) {
      var _this = this;

      var exportMappings = exportStatements.map(function (statement) {
        return _this.formatExportMembers(statement.members);
      }).filter(function (line) {
        return !!line;
      }).join('');

      return exportMappings;
    }
  }, {
    key: 'formatExportMembers',
    value: function formatExportMembers(members) {
      var _this2 = this;

      return members.map(function (member) {
        return _this2.formatExportMember(member);
      }).join('');
    }
  }, {
    key: 'formatExportMember',
    value: function formatExportMember(member) {
      var name = member.name;
      var alias = member.alias || name;

      switch (member.type) {
        case "mapped":
          return 'exports[\'' + alias + '\'] = ' + name + ';';
        case "resolved":
          return '';
        default:
          throw "Unknown member type";
      }
    }
  }]);
  return AmdExportGenerator;
}();

var WrapperGeneratorAmd = function () {
  function WrapperGeneratorAmd(_ref) {
    var importGenerator = _ref.importGenerator,
        exportGenerator = _ref.exportGenerator,
        getDefinePropertyName = _ref.getDefinePropertyName;
    classCallCheck(this, WrapperGeneratorAmd);

    this.importGenerator = importGenerator;
    this.exportGenerator = exportGenerator;
    this.getDefinePropertyName = getDefinePropertyName;
  }

  createClass(WrapperGeneratorAmd, [{
    key: "wrap",
    value: function wrap(_ref2) {
      var script = _ref2.script,
          imports = _ref2.imports,
          exports = _ref2.exports;

      var _importGenerator$gene = this.importGenerator.generate(imports),
          dependencyList = _importGenerator$gene.dependencyList,
          dependencyArguments = _importGenerator$gene.dependencyArguments;

      var _exportGenerator$gene = this.exportGenerator.generate(exports),
          exportMappings = _exportGenerator$gene.exportMappings;

      var origin = document.location.origin;
      var absoluteUrl = origin + "/" + script.url;

      var defineFunctionName = this.getDefinePropertyName();
      var scriptSource = script.source;
      var defineWrappedSource = defineFunctionName + "(\"" + script.id + "\", " + dependencyList + ", function(" + dependencyArguments + "){ \"use strict\"; " + scriptSource + "\n" + exportMappings + "\n});";
      var sourceMappedSource = defineWrappedSource + "\n//# sourceURL=" + absoluteUrl;

      script.source = sourceMappedSource;
    }
  }]);
  return WrapperGeneratorAmd;
}();

var AmdDependencyResolver = function () {
  function AmdDependencyResolver() {
    classCallCheck(this, AmdDependencyResolver);
  }

  createClass(AmdDependencyResolver, [{
    key: 'resolve',
    value: function resolve(_ref) {
      var failedModules = _ref.failedModules,
          pendingModules = _ref.pendingModules,
          modules = _ref.modules;


      for (var i = 0; i < pendingModules.length; i++) {
        var module = pendingModules[i];

        if (this.hasMetDependencies(module, modules)) {
          pendingModules.splice(i, 1);

          try {
            var exports = module.factory.apply(module, toConsumableArray(this.getDependencies(module, modules)));
            if (exports) module.exports = exports;

            Object.freeze(module.exports);
            modules.push(module);
          } catch (exception) {
            failedModules.push(module);
            console.error('Failed to load module ' + module.id, exception);
          }

          i = -1;
        }
      }
    }
  }, {
    key: 'getDefaultDependency',
    value: function getDefaultDependency(dependency, module) {
      switch (dependency) {
        case 'exports':
          return module.exports;
      }
    }
  }, {
    key: 'dependencyToModule',
    value: function dependencyToModule(module, modules) {
      var _this = this;

      return function (dep) {
        return _this.getDefaultDependency(dep, module) || modules.find(function (module) {
          return dep === module.id;
        });
      };
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies(module, modules) {
      return module.dependencies.map(this.dependencyToModule(module, modules));
    }
  }, {
    key: 'hasMetDependencies',
    value: function hasMetDependencies(module, modules) {
      return module.dependencies.every(this.dependencyToModule(module, modules));
    }
  }]);
  return AmdDependencyResolver;
}();

var AmdDependencyRepository = function () {
  function AmdDependencyRepository(_ref) {
    var loadScript = _ref.loadScript,
        dependencyResolver = _ref.dependencyResolver;
    classCallCheck(this, AmdDependencyRepository);

    this.loadScript = loadScript;
    this.dependencyResolver = dependencyResolver;

    this.loadingModuleIds = [];
    this.pendingModules = [];
    this.failedModules = [];
    this.resolvedModules = [{ id: 'exports' }];
  }

  createClass(AmdDependencyRepository, [{
    key: 'register',
    value: function register(module) {
      var _this = this;

      var unresolvedDependencies = this.getUnresolvedDependencies(module.dependencies);
      if (unresolvedDependencies.length === 0) {
        this.pendingModules.push(module);

        this.dependencyResolver.resolve({
          failedModules: this.failedModules,
          pendingModules: this.pendingModules,
          modules: this.resolvedModules
        });

        this.detectCircularReferences();
        return;
      }

      var unloadedDependencies = this.getUnloadedDependencies(unresolvedDependencies);
      if (unloadedDependencies.length === 0) {
        this.pendingModules.push(module);
        this.detectCircularReferences();
        return;
      }

      unloadedDependencies.forEach(function (path) {
        if (_this.loadingModuleIds.indexOf(path) === -1) {
          _this.loadingModuleIds.push(path);

          _this.loadScript(path).then(function (script) {
            var index = _this.loadingModuleIds.indexOf(path);
            index !== -1 && _this.loadingModuleIds.splice(index, 1);
            script.execute();
          });
        }
      });
      this.pendingModules.push(module);
      this.detectCircularReferences();
    }
  }, {
    key: 'detectCircularReferences',
    value: function detectCircularReferences() {
      if (this.failedModules.length === 0 && this.loadingModuleIds.length === 0 && this.pendingModules.length > 0) {
        console.log('Possible circular dependencies', this.pendingModules);
      }
    }
  }, {
    key: 'getUnloadedDependencies',
    value: function getUnloadedDependencies(dependencies) {
      var _this2 = this;

      return dependencies.filter(function (dependency) {
        return !_this2.pendingModules.find(function (pendingModule) {
          return dependency === pendingModule.id;
        }) && !_this2.loadingModuleIds.find(function (loadingModuleId) {
          return dependency === loadingModuleId;
        });
      });
    }
  }, {
    key: 'getUnresolvedDependencies',
    value: function getUnresolvedDependencies(dependencies) {
      var _this3 = this;

      return dependencies.filter(function (dependency) {
        return !_this3.resolvedModules.find(function (resolvedModule) {
          return dependency === resolvedModule.id;
        });
      });
    }
  }]);
  return AmdDependencyRepository;
}();

var SingleRunDefineFactor = function () {
  function SingleRunDefineFactor(define) {
    classCallCheck(this, SingleRunDefineFactor);

    this.define = define;
    this.uidCounter = 0;
    this.prefix = (Math.random() + '_').replace(/\./g, '');
  }

  createClass(SingleRunDefineFactor, [{
    key: 'registerGlobal',
    value: function registerGlobal() {
      var key = this.getNamespace();
      if (!window[key]) window[key] = {};
    }
  }, {
    key: 'setInstance',
    value: function setInstance(define) {
      this.define = define;
    }
  }, {
    key: 'getNamespace',
    value: function getNamespace() {
      return '__singleRunDefine';
    }
  }, {
    key: 'getUID',
    value: function getUID() {
      return '' + this.prefix + ++this.uidCounter;
    }
  }, {
    key: 'create',
    value: function create() {

      var define = this.define;

      if (!define) throw new Error('A define method has not been registered on the define factory');

      var namespace = this.getNamespace();
      var uid = this.getUID();
      window[namespace][uid] = singleUseDefine;

      var name = 'window["' + namespace + '"]["' + uid + '"]';
      return name;

      function singleUseDefine() {
        delete window[namespace][uid];
        define.apply(define, arguments);
      }
    }
  }]);
  return SingleRunDefineFactor;
}();

var JavascriptInterceptor = function () {
  function JavascriptInterceptor(_ref) {
    var importParser = _ref.importParser,
        exportParser = _ref.exportParser,
        wrapperGenerator = _ref.wrapperGenerator;
    classCallCheck(this, JavascriptInterceptor);

    this.importParser = importParser;
    this.exportParser = exportParser;
    this.wrapperGenerator = wrapperGenerator;
  }

  createClass(JavascriptInterceptor, [{
    key: "intercept",
    value: function intercept(script) {
      var module = {
        script: script,
        imports: [],
        exports: []
      };

      this.importParser.rewrite(module);
      this.exportParser.rewrite(module);
      this.wrapperGenerator.wrap(module);

      return script;
    }
  }]);
  return JavascriptInterceptor;
}();

var HTMLInterceptor = function () {
  function HTMLInterceptor() {
    classCallCheck(this, HTMLInterceptor);
  }

  createClass(HTMLInterceptor, [{
    key: 'intercept',
    value: function intercept(script) {
      var html = script.source.replace(/"/g, '\\"').replace(/\n/g, '<!-- LINE BREAK --!>');

      script.source = 'var template = "' + html + '";\nexport {template as default}';

      return script;
    }
  }]);
  return HTMLInterceptor;
}();

/**
 * When using arrays with more than ~70 000 entries, some implementations of V8 are unable to properly optimize array.shift
 * This custom implementation uses internal cursors to handle shifts, pushes and pops
 *
 * @param array target array to wrap
 * @constructor
 */
function FastArray$1(array) {
  this.array = array;
  this.startCursor = 0;
  this.endCursor = array.length;
}

FastArray$1.prototype.shift = function shift() {
  if (this.isAtEnd()) {
    debugger;
    throw "End of match not found";
  }

  var previous = this.first();
  this.startCursor++;
  return previous;
};

FastArray$1.prototype.push = function push(item) {
  this.array[this.endCursor] = item;
  this.endCursor++;
};

FastArray$1.prototype.pop = function pop() {
  var item = this.last();
  this.endCursor--;
  return item;
};

FastArray$1.prototype.first = function current() {
  return this.array[this.startCursor];
};

FastArray$1.prototype.last = function current() {
  return this.array[this.endCursor - 1];
};

FastArray$1.prototype.isAtEnd = function isAtEnd() {
  return this.length() <= 0;
};

FastArray$1.prototype.length = function length() {
  return this.endCursor - this.startCursor;
};

FastArray$1.prototype.reverse = function reverse() {
  var length = this.length() / 2;
  var end = this.endCursor - 1;
  var array = this.array;
  for (var i = this.startCursor; i < length; i++) {
    var _ref = [array[end - i], array[i]];
    array[i] = _ref[0];
    array[end - i] = _ref[1];
  }
  return this;
};

FastArray$1.prototype.getArray = function getArray() {
  return this.array.slice(this.startCursor, this.endCursor);
};

FastArray$1.prototype.get = function getArray(index) {
  return this.array[this.startCursor + index];
};

/**
 * https://github.com/darkskyapp/string-hash
 */

var stringHash = function (str) {
  var hash = 5381,
      i = str.length;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  } /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
};

var SELECTOR = /[a-z0-9_-]/i;

/**
 *
 * Creates an execution context for the parser and parses the source
 *
 * @param source string[]
 * @param options {{namespace: string, useHash: boolean}}
 * @returns {{string: Token[]}}
 */
function parseCss(source, options) {
  source = new FastArray$1(source);
  var namespace = options.namespace || '';
  var useHash = options.useHash || false;
  var tokenMap = {};

  function cssSelector() {
    var start = source.startCursor + 1;
    var className = match(SELECTOR);
    var end = source.startCursor - 1;
    var hash = parseSelector();

    tokenMap[className] = tokenMap[className] || [];
    tokenMap[className].push({ className: className, hash: hash, namespace: namespace, start: start, end: end });

    return hash;
  }

  function cssComment() {
    source.shift();
    if (source.first() !== '*') {
      return;
    }
    source.shift();

    var i1 = 0;
    var i2 = 0;

    while (i1 !== i2 - 1 && !source.isAtEnd()) {
      parseToCharacter('*');
      i1 = source.startCursor;
      parseToCharacter('/');
      i2 = source.startCursor;
    }
  }

  function cssAtSymbol() {
    source.shift();
    parseToCharacter("}");
  }

  function singleQuoteString() {
    source.shift();
    parseToCharacter("'");
  }

  function doubleQuoteString() {
    source.shift();
    parseToCharacter('"');
  }

  function match(regex) {
    var buffer = '';
    var char = '';

    do {
      buffer += char;
      source.shift();
      char = source.first();
    } while (char.match(regex) && !source.isAtEnd());

    return buffer;
  }

  function parseToCharacter(character) {
    while (source.shift() !== character && !source.isAtEnd()) {}
  }

  /**
   * .class { PARSING_CONTEXT }
   *
   * @returns string
   */
  function hashSelectorContent() {
    var content = '';
    outer: while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '}':
          source.shift();
          break outer;

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          content += source.shift();
      }
    }

    var bareContent = content.replace(/\s|;/g, '');
    return stringHash(bareContent);
  }

  /**
   * .class { PARSING_CONTEXT }
   */
  function parseSelectorContent() {
    outer: while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '}':
          source.shift();
          break outer;

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
  }

  /**
   * {.#}PARSING_CONTEXT {  }
   */
  function parseSelector() {
    while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '.':
          return cssSelector();
        case '#':
          return cssSelector();
        case '{':
          source.shift();
          if (useHash) {
            return hashSelectorContent();
          } else {
            return parseSelectorContent();
          }

        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
  }

  /**
   * PARSING_CONTEXT {.# ...} { ... }
   */
  function rootParser() {
    while (!source.isAtEnd()) {
      var token = source.first();

      switch (token) {
        case '@':
          cssAtSymbol();
          break;
        case '.':
          cssSelector();
          break;
        case '#':
          cssSelector();
          break;
        case '/':
          cssComment();
          break;
        case "'":
          singleQuoteString();
          break;
        case '"':
          doubleQuoteString();
          break;
        default:
          source.shift();
      }
    }
    return tokenMap;
  }

  return rootParser();
}

var uniqueCounter = 0;

/**
 *
 * @param css
 * @param options {{timers?: {}, namespace: string, substitutionPattern: string}}
 * @returns {{encodedCss, substitutions: {string:string}}}
 */
function modulizeCss(css) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var timers = options.timers || {};
  var namespace = options.namespace || '';
  var substitutionPattern = options.substitutionPattern || '{name}';
  var useHash = substitutionPattern.indexOf('{hash}') !== -1;

  timers.start = Date.now();

  var source = css.split('');
  timers.stringToArray = Date.now();

  var sourceCopy = source.slice();
  timers.arrayCopy = Date.now();

  var classes = parseCss(sourceCopy, { namespace: namespace, useHash: useHash });
  timers.parse = Date.now();

  var substitutions = {};
  !useHash && generateClassNameSubstitutions(Object.keys(classes).map(function (key) {
    return classes[key];
  }), substitutionPattern, substitutions);
  timers.generateClassSubstitutions = Date.now();

  var tokenList = Object.keys(classes).reduce(function (classList, className) {
    return classList.concat(classes[className]);
  }, []);
  timers.generateClassList = Date.now();

  tokenList.sort(function (a, b) {
    return b.start - a.start;
  });
  timers.sortClassesByPosition = Date.now();

  var cheapSource = replaceSelectors(source, tokenList, function (node) {
    return substitutions[node.className] || generateSubstitution(node, substitutionPattern, substitutions);
  });
  timers.replaceClassWithToken = Date.now();

  var target = cheapSource.getArray();
  timers.getArrayFromCheapArray = Date.now();

  target.reverse();
  timers.reverseArray = Date.now();

  var encodedCss = arrayToString(target);
  timers.arrayToString = Date.now();

  return { encodedCss: encodedCss, substitutions: substitutions };
}

/**
 * A custom implementation of array.join('')
 *
 * @param array
 * @returns {string}
 */
function arrayToString(array) {
  var str = '';

  for (var i = 0; i < array.length; i++) {
    str += array[i];
  }

  return str;
}

/**
 * Substitute the previous selectors with the ones generated by #generateSubstitution
 *
 * @param source string[]
 * @param bareTokenList Token[]
 * @param getSubstitution (Token)->string
 * @returns {FastArray}
 */
function replaceSelectors(source, bareTokenList, getSubstitution) {
  var target = new FastArray$1(new Array(source.length));
  var tokenList = new FastArray$1(bareTokenList);
  target.endCursor = 0;

  for (var i = source.length - 1; i >= 0; i--) {
    var token = tokenList.first();
    if (token && i === token.end) {
      var length = token.end - token.start;

      var substitution = getSubstitution(token);
      i -= length;

      for (var j = substitution.length - 1; j >= 0; j--) {
        target.push(substitution[j]);
      }
      tokenList.shift();
    } else {
      target.push(source[i]);
    }
  }

  return target;
}

/**
 * Generate an array of substitutions keyed by class name
 *
 * @param tokens Token[]
 * @param substitutionPattern string
 * @param substitutions {{string: string[]}}
 * @returns {{string: string}}
 */
function generateClassNameSubstitutions(tokens, substitutionPattern, substitutions) {
  tokens.forEach(function (tokenList) {
    var token = tokenList[0];
    generateSubstitution(token, substitutionPattern, substitutions);
  });
}

/**
 * Generate a substitution for the class or id selector
 *
 * @param token Token
 * @param substitutionPattern string
 * @param substitutions {{string: string[]}}
 * @returns {string}
 */
function generateSubstitution(token, substitutionPattern, substitutions) {
  var substitution = substitutionPattern.replace(/{([^}]+)}/ig, function (all, group) {
    switch (group) {
      case 'namespace':
        return token.namespace;
      case 'name':
        return token.className;
      case 'random':
        return 'r' + Math.random().toString(36).substring(7);
      case 'hash':
        return 'h' + (token.hash + 0.0).toString(36);
      case 'unique':
        return 'u' + ++uniqueCounter;
    }
  });

  substitutions[token.className] = [];
  substitutions[token.className].push(substitution);
  return substitution;
}

var CssInterceptor = function () {
  function CssInterceptor() {
    classCallCheck(this, CssInterceptor);
  }

  createClass(CssInterceptor, [{
    key: 'intercept',
    value: function intercept(script) {
      var namespace = script.id.replace(/[/]/g, 'O').replace(/\.[^/.]*$/, '');
      var substitutionPattern = '{namespace}__{name}';
      var source = script.source;

      var localized = modulizeCss(source, { namespace: namespace, substitutionPattern: substitutionPattern });
      var selectors = this.keyValueArrayToObject(localized.substitutions);

      this.generateJs(selectors, script);
      this.addCSSToDOM(localized.encodedCss, script);

      return script;
    }
  }, {
    key: 'addCSSToDOM',
    value: function addCSSToDOM(css, script) {
      var element = document.createElement('style');
      element.setAttribute('data-src', script.id);
      element.innerHTML = css;
      document.head.appendChild(element);
    }
  }, {
    key: 'keyValueArrayToObject',
    value: function keyValueArrayToObject(map) {
      return Object.keys(map).filter(function (it) {
        return it;
      }).reduce(function (subs, key) {
        var selector = map[key].join(' ');
        subs[key] = '' + selector;
        return subs;
      }, {});
    }
  }, {
    key: 'generateJs',
    value: function generateJs(selectors, script) {
      var encodedSelectors = JSON.stringify(selectors);
      script.source = 'var selectors = JSON.parse(\'' + encodedSelectors + '\');\nexport {selectors as default}';
    }
  }]);
  return CssInterceptor;
}();

var importGenerator = new AmdWrapperGenerator$1();
var exportGenerator = new AmdExportGenerator$1();

var temporaryLoaderFactory = new SingleRunDefineFactor();
temporaryLoaderFactory.registerGlobal();

var scriptInterceptors = {
  default: new JavascriptInterceptor({
    importParser: new ImportParser(new ImportTokenizer(importGenerator)),
    exportParser: new ExportParser(new ExportTokenizer(exportGenerator, importGenerator)),
    wrapperGenerator: new WrapperGeneratorAmd({
      importGenerator: importGenerator, exportGenerator: exportGenerator,
      getDefinePropertyName: function getDefinePropertyName() {
        return temporaryLoaderFactory.create();
      }
    })
  }),
  css: new CssInterceptor(),
  html: new HTMLInterceptor()
};

function dependencyRepositoryFactory(_ref) {
  var basePath = _ref.basePath;

  var scriptLoader = new ScriptLoader({
    fetch: function fetch(url) {
      return new Request({ url: url });
    },
    scriptInterceptors: scriptInterceptors,
    basePath: basePath
  });
  return new AmdDependencyRepository({
    loadScript: function loadScript(path) {
      return scriptLoader.load(path);
    },
    dependencyResolver: new AmdDependencyResolver()
  });
}

var mainAmd = new ModulinFactory({
  temporaryLoaderFactory: temporaryLoaderFactory,
  loaderFactory: new AmdFactory(),
  dependencyRepositoryFactory: dependencyRepositoryFactory
});

export default mainAmd;

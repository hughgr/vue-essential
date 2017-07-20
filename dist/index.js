(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = def;
/* harmony export (immutable) */ __webpack_exports__["b"] = parsePath;
function def (obj, key, val, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true
  })
}


/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
function parsePath (path) {
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = pushTarget;
/* harmony export (immutable) */ __webpack_exports__["b"] = popTarget;
let uid = 0;
class Dep {
	constructor () {
		this.id = uid++;
		this.subs = [];	
	}
	addSub (subWatcher) {
		this.subs.push(subWatcher);
	}	
	notify () {
		this.subs.forEach(sub => {
			sub.update();	
		})
	}
	depend () {
		if (Dep.target)	{
			Dep.target.addDep(this);	
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Dep;


Dep.target = null;

function pushTarget (_targetWatcher) {
	Dep.target = _targetWatcher;
}

function popTarget () {
	Dep.target = null;	
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Watcher__ = __webpack_require__(4);



window.a = new __WEBPACK_IMPORTED_MODULE_0__observer__["a" /* Observer */]({person:{name:'cc'}});
new __WEBPACK_IMPORTED_MODULE_1__Watcher__["a" /* Watcher */](a, 'person.name', function (newVal, oldVal) {
	console.info(`newValue is ${newVal} ---- oldValue is ${oldVal}`);
})


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defineReactive */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dep__ = __webpack_require__(1);



//仅仅实现对POJO的oberser，数组暂时先放到后面
class Observer {
	constructor (value) {
		this.value = value;
		//先把observer的实例塞进对象再说
		Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* def */])(value, '__ob__', this);
		if (false) {
			//如果传进来的value是array，在这里处理，先省略
		} else {
			this.walk(value)
		}
	}

	//
	walk (obj) {
		Object.keys(obj).forEach(key => {
			defineReactive(obj, key, obj[key])	
		})
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Observer;


function defineReactive (
	obj,
	key,
	val
) {

	const dep = new __WEBPACK_IMPORTED_MODULE_1__dep__["a" /* Dep */]();
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter () {
			dep.depend();
			return val
		},
		set: function reactiveSetter (newVal) {
			var value = val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      console.log(`${key}被写入新值---newVal`)
      val = newVal;
      dep.notify();
		}
	})
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);


class Watcher {
	constructor (vm, expOrFn, cb) {
		this.vm = vm;
		vm._watchers = vm._watchers ? vm._watchers : [];
		vm._watchers.push(this);
		this.cb = cb;
		this.depIds = {};
		if (typeof expOrFn === 'function') {
			this.getter = expOrFn;
		} else {
			this.getter = Object(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* parsePath */])(expOrFn);
			if (!this.getter) {
				this.getter = function () {};
				console.info(`${expOrFn}--不存在`);
			}
		}
		this.value = this.get();		
	}
	get () {
		Object(__WEBPACK_IMPORTED_MODULE_0__dep__["c" /* pushTarget */])(this);
		let value;
		value = this.getter.call(this.vm, this.vm.value);
		Object(__WEBPACK_IMPORTED_MODULE_0__dep__["b" /* popTarget */])();
		return value;
	}
	/**
	 * [addDep ]
	 * @param {[Dep]} dep [description]
	 */
	addDep (dep) {
		if (!this.depIds.hasOwnProperty(dep.id)) {
			dep.addSub(this);	
			this.depIds[dep.id] = dep;
		}
	}

	update () {
		this.run();	
	}

	run () {
		const value = this.get();
		if (value !== this.value) {
			const oldValue = this.value;
			this.value = value;
			this.cb.call(this.vm, value, oldValue);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Watcher;


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map
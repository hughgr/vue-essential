import {observe} from './observer';
import {Watcher} from './watcher';
import {isPlainObject} from './util';
let uid = 0;
function Vue (options) {
	this._init(options);
}

initMixin(Vue);
stateMixin(Vue);


function initMixin (Vue) {
	Vue.prototype._init = function (options) {
		const vm = this;	
		vm._uid = uid++;
		vm.$options = options || {};
		initState(vm);
	}
}
function stateMixin (Vue) {
	const dataDef = {};
	dataDef.get = function () {
		return this._data;	
	}
	dataDef.set = function () {
		console.warn('请不要直接向实例的root $data直接写入值，使用嵌套的')	
	}
	Object.defineProperty(Vue.prototype, '$data', dataDef);

	Vue.prototype.$watch = function (expOrFn, cb, options) {
		const vm = this;
		options = options || {};
		const watcher = new Watcher(vm ,expOrFn, cb);
		return function unwatchFn () {
			watcher.teardown();	
		}
	}

}

function initState (vm) {
	vm._watchers = [];
	const opts = vm.$options;
	if (opts.data) {
		initData(vm);	
	}
	if (opts.watch) initWatch(vm, opts.watch)
}

function initData (vm) {
	let data = vm.$options.data;	
	function getData (data, vm) {
		return data.call(vm);	
	}
	data = vm._data = typeof data === 'function' 
		? getData(data , vm) : {};

	const keys = Object.keys(data);
	let i = keys.length;
	while (i--) {
		const key = keys[i];
		proxy(vm, '_data', key);
	}

	observe(data);
}
function noop () {

}
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
function proxy (target , sourceKey, key) {
	sharedPropertyDefinition.get = function proxyGetter () {
		return this[sourceKey][key];
	}
	sharedPropertyDefinition.set = function proxySetter (val) {
		this[sourceKey][key] = val;
	}
	Object.defineProperty(target, key, sharedPropertyDefinition);

}

function initWatch (vm, watch) {
	for (const key in watch) {
		const handler = watch[key];	
		createWatcher(vm, key, handler);
	}

}

function createWatcher (vm, keyOrFn, handler, options) {
	return vm.$watch(keyOrFn, handler, options);
}

export default Vue;

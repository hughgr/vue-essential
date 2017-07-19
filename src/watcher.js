import {Dep, pushTarget, popTarget} from './dep';
import {parsePath} from './util';
export class Watcher {
	constructor (vm, expOrFn, cb) {
		this.vm = vm;
		vm._watchers = vm._watchers ? vm._watchers : [];
		vm._watchers.push(this);
		this.cb = cb;
		this.depIds = {};
		if (typeof expOrFn === 'function') {
			this.getter = expOrFn;
		} else {
			this.getter = parsePath(expOrFn);
			if (!this.getter) {
				this.getter = function () {};
				console.info(`${expOrFn}--不存在`);
			}
		}
		this.value = this.get();		
	}
	get () {
		pushTarget(this);
		let value;
		value = this.getter.call(this.vm, this.vm.value);
		popTarget();
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
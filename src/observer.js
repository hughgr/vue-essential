import {def, isObject} from './util';
import {Dep} from './dep';

//仅仅实现对POJO的oberser，数组暂时先放到后面
export class Observer {
	constructor (value) {
		this.value = value;
		this.dep = new Dep();
		//先把observer的实例塞进对象再说
		def(value, '__ob__', this, false);
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

export function observe (value) {
 if (!isObject(value)) return;
 let ob;
 if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
 	ob = value.__ob__;	
 } else {
 	ob = new Observer(value);
 }
 return ob;
}

export function defineReactive (
	obj,
	key,
	val
) {

	const dep = new Dep();
	let childOb = observe(val)
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter () {
			dep.depend();
			//如果childOb存在，还要继续执行的dep.depend的原因非常简单
			// 试想这样一个reactiveObject a = {person:{name:'cc'}}
			//当a.person.name = 'dd'的时候，name的setter需要通知对应的watcher,
			//当a.person = {name: 'dd'}的时候，也需要响应person的setter也需要通知对应的watcher
			if (childOb) {
				childOb.dep.depend();	
			}	
			return val
		},
		set: function reactiveSetter (newVal) {
			var value = val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      console.log(`${key}被写入新值---newVal`)
      val = newVal;
      //如果newval是一个新的object，继续observe
      childOb = observe(newVal)
      dep.notify();
		}
	})
}

import {def} from './util';
import {Dep} from './dep';

//仅仅实现对POJO的oberser，数组暂时先放到后面
export class Observer {
	constructor (value) {
		this.value = value;
		//先把observer的实例塞进对象再说
		def(value, '__ob__', this);
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

export function defineReactive (
	obj,
	key,
	val
) {

	const dep = new Dep();
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

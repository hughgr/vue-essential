import {Observer} from '@/observer';
import {Watcher} from '@/watcher';

describe('ObserverTest', () => {
	var observer, plainObj;
	beforeEach(function () {
	  plainObj = {name: 'cc'};
		observer = new Observer(plainObj);
	});
	it('can be constructed', () => {
		expect(observer.value['__ob__']).toBe(observer);
	})

	it('defineReactive should be working', () => {
		var setter = Object.getOwnPropertyDescriptor(plainObj, 'name').set;
		var getter = Object.getOwnPropertyDescriptor(plainObj, 'name').get;
		expect(setter).toBeDefined();
		expect(getter).toBeDefined();
	})

	it('setter should be called when set the different value', () => {
		var spy =  spyOnProperty(plainObj, 'name', 'set');
		var setter = Object.getOwnPropertyDescriptor(plainObj, 'name').set;
		plainObj.name = 'dd';
		expect(spy).toHaveBeenCalled()
	})
	it('watcher should be called if value change', () => {
		var callback = {
			fn () {
				console.log('callbackFn executed');	
			}
		}
		spyOn(callback, 'fn');
		new Watcher(observer, 'name', callback.fn);	
		plainObj.name = 'dd';
		expect(callback.fn).toHaveBeenCalled();
	});
	it('anotherObserver should react to the connected observer change', () => {
		var anotherObj = {name:''};
		var anotherObserver = new Observer(anotherObj)	
		var callback = {
			fn () {
				anotherObj.name = plainObj.name + '_changed';
			}
		}
		var spyAnotherObj = jasmine.createSpy('spy');
		spyOn(callback, 'fn').and.callThrough();
		new Watcher(observer, 'name', callback.fn)
		new Watcher(anotherObserver, 'name', spyAnotherObj)

		plainObj.name = 'dd';
		expect(spyAnotherObj).toHaveBeenCalled();		
		expect(anotherObj.name).toBe('dd_changed');
	})

	it('nested object should also working', () => {
		var nestedObj = {
			person: {
				name: 'cc'
			}
		}	
		var nestedObserver = new Observer(nestedObj);
		var spy = jasmine.createSpy('spy');
		new Watcher(nestedObserver, 'person.name', spy);
		expect(spy).not.toHaveBeenCalled();
		nestedObj.person.name = 'dd';
		expect(spy).toHaveBeenCalled();
	})

	it('set an object to a exits reactive model', () => {
		var nestedObj = {
			person: {
				name: 'cc'
			}
		}	
		var nestedObserver = new Observer(nestedObj);
		var spy = jasmine.createSpy('spy');
		new Watcher(nestedObserver, 'person.name', spy);
		nestedObj.person.name = 'dd';
		expect(spy).toHaveBeenCalledTimes(1);
		nestedObj.person = {name: 'dd'};
		expect(spy).toHaveBeenCalledTimes(1);
		nestedObj.person = {name: 'ee'};
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('difference between setting an object and setting a primitive value', () => {
		var nestedObj = {
			person: {
				name: 'cc'
			}
		}	
		var nestedObserver = new Observer(nestedObj);
		var spy = jasmine.createSpy('spy');
		new Watcher(nestedObserver, 'person.name', spy);
		nestedObj.person.name = 'dd';
		expect(spy).toHaveBeenCalledTimes(1);
		nestedObj.person = {name: 'ee'};
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('replace an none exits object to reactive object should also trigger change', () => {
		var nestedObj = {
			person: {
				name: 'cc'
			}
		}	
		var nestedObserver = new Observer(nestedObj);
		var spy = jasmine.createSpy('spy');
		new Watcher(nestedObserver, 'person.name', spy);
		nestedObj.person = {age: 11};
		expect(spy).toHaveBeenCalled();
	});	
});
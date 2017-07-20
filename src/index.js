import {Observer} from './observer';
import {Watcher} from './Watcher';

window.a = new Observer({person:{name:'cc'}});
new Watcher(a, 'person.name', function (newVal, oldVal) {
	console.info(`newValue is ${newVal} ---- oldValue is ${oldVal}`);
})

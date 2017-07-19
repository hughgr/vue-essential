import {Observer} from './observer';
import {Watcher} from './Watcher';

window.a = new Observer({name:'cc'});
new Watcher(a, 'name', function (newVal, oldVal) {
	console.info(`newValue is ${newVal} ---- oldValue is ${oldVal}`);
})

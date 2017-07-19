let uid = 0;
export class Dep {
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

Dep.target = null;

export function pushTarget (_targetWatcher) {
	Dep.target = _targetWatcher;
}

export function popTarget () {
	Dep.target = null;	
}
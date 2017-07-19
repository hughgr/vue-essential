import {Observer} from 'src/observer';
describe('Observer', () => {
	it('can be constructed ', () => {
		var ob1 = new Observer({name:"cc"})
		expect(ob1).toBe(Object);	
	});
});
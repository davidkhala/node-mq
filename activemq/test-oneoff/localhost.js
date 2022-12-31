import {STOMP} from '../stomp.js';

describe('localhost', function (){
	this.timeout(0)
	const brokerURL = 'ws://localhost:61614';
	const conn = new STOMP(brokerURL);
	it('listen', async ()=>{
		const topic = 'a';
		await conn.connect();
		const listener = conn.subscribe(topic, ({body, headers}) => {
			console.log({body, headers});
			listener.unsubscribe();
			conn.close();
		});
	})
	it('send', async ()=>{
		const topic = 'a';
		await conn.connect();
		conn.send(topic, 'b');
		await conn.close();
	})
})


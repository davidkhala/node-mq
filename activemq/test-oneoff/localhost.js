import {WebsocketClient} from '../websocketClient.js';

describe('websocket', function (){
	this.timeout(0)
	const host = 'localhost';
	const conn = new WebsocketClient(host);
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


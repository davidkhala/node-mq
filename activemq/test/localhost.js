import {STOMP} from '../index.js';
import assert from 'assert';

const username = 'artemis';
const password = 'artemis';
const domain = 'localhost';
describe('STOMP', function () {
	this.timeout(0);
	const client = new STOMP({domain, username, password});
	it('connect', async () => {
		await client.connect();

		client.send('a', 'b');
		await client.disconnect();
	});
	it('listen', async () => {
		const topic = 'a';
		await client.connect();
		const message = 'b';
		const received = await new Promise(resolve => {
			const listener = client.subscribe(topic, (frame) => {
				listener.unsubscribe();
				resolve(frame.body);
			});
			client.send(topic, message);
		});
		assert.equal(received, message);
		await client.disconnect();

	});
});


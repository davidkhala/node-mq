import {AMPQ} from '../index.js';
import assert from 'assert';

const topic = 'tasks';
describe('rabbit MQ', () => {
	// const userInstance = new AMPQ({username: 'user', password: 'bitnami'});
	const bitnamiContainer = new AMPQ({username: 'user', password: 'bitnami'});
	before(async () => {
		await bitnamiContainer.connect();
	});

	it('subscribe and send', async () => {
		const message = 'b';
		const listener = async (received) => {
			assert.strictEqual(received, message);
			bitnamiContainer.ack(received);
		};
		await bitnamiContainer.subscribe(topic, listener);
		await bitnamiContainer.send(topic, message);
	});
	after(async () => {
		await bitnamiContainer.close();
	});
});

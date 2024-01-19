import Pulsar from '../index.js';
import assert from 'assert'
describe('pulsar', function () {
	this.timeout(0);
	const pulsar = new Pulsar({domain: 'localhost'});
	const topic = 'topic';
	const message = 'message';
	it('pub', async () => {
		const msgId = await pulsar.send(topic, message);
		console.info({msgId});
	});
	if (!process.env.CI) {
		it('sub', async () => {
			const [msg,receipt] = await pulsar.subscribe(topic);
			assert.strictEqual(msg,message)
			await pulsar.acknowledge(receipt);
		});
	}


});
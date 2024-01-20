import Pulsar from '../index.js';
import assert from 'assert';

describe('', function () {
	this.timeout(0);
	const pulsar = new Pulsar({domain: 'localhost'});
	const topic = 'topic';
	const message = 'message';
	it('pub', async () => {
		const producer = await pulsar.getProducer(topic);
		const msgId = await producer.send(message);
		console.info({msgId});
	});
	if (!process.env.CI) {
		it('sub', async () => {
			const consumer = await pulsar.getConsumer(topic);
			const {data, id} = await consumer.subscribe();
			assert.strictEqual(data, message);
			await consumer.acknowledge(id);
		});
	}


});
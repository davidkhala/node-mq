import Pulsar from '../index.js';

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
			const msg = await pulsar.subscribe(topic);
			await pulsar.acknowledge(msg);
		});
	}


});
import assert from 'assert';
import PlainSASL from '../plain.js';

const kafka_brokers_sasl = [
	'broker-0-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093',
	'broker-5-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093',
	'broker-1-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093',
	'broker-4-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093',
	'broker-3-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093',
	'broker-2-ln9xw23yp788ngy9.kafka.svc02.us-south.eventstreams.cloud.ibm.com:9093'
];
const username = 'token';
const topic = 'davidkhala-node-mq';
describe('IBM Event Stream', function () {
	this.timeout(0);
	const {api_key} = process.env;
	assert.ok(api_key, 'Missing api_key');

	it('connect', async () => {
		const client = new PlainSASL(kafka_brokers_sasl, {username, password: api_key});
		const {admin} = client;
		await admin.connect();
		const result = await admin.listTopics();

		assert.ok(result.includes(topic));
		await admin.disconnect();
	});
});

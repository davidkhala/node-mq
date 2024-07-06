import CloudAMQP from '../cloudAMQP.js';

const domain = 'fuji.lmq.cloudamqp.com';
const username = 'qdpxyneo';
const password = process.env.CLOUDAMQP_PASSWORD;
describe('lavinMQ:Loyal Lemming:AP-NorthEast-1', function () {
	this.timeout(0);


	const plain = new CloudAMQP({domain, username, password});
	before(async () => {
		await plain.connect();
	});

	it('tls', async () => {
		const tlsClient = new CloudAMQP({domain, username, password, tls: true});
		await tlsClient.connect();
		await tlsClient.disconnect();
		await tlsClient.connect();
		await tlsClient.disconnect();
	});
	after(async () => {
		await plain.disconnect();
	});
});
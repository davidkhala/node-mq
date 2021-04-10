const AMPQlib = require('amqplib');

class AMPQ {
	/**
	 *
	 * @param {{domain:string, username:string, password:string}} opts
	 */
	constructor(opts) {
		if (opts) {
			const {domain = 'localhost', username, password} = opts;
			this.url = `amqp://${username}:${password}@${domain}:5672`;
		} else {
			// If the URI is omitted entirely, it will default to 'amqp://localhost'
			this.url = 'amqp://localhost';
		}

	}

	async send(topic, message) {
		const status = await this.channel.assertQueue(topic);
		return await this.channel.sendToQueue(topic, Buffer.from(message));
	}

	async subscribe(topic, listener) {
		const status = await this.channel.assertQueue(topic);
		return this.channel.consume(topic, listener);
	}

	ack(message) {
		this.channel.ack(message);
	}

	async connect() {
		this.client = await AMPQlib.connect(this.url);
		this.channel = await this.client.createChannel();
	}
	async close(){
		await this.client.close()
	}
}

exports.AMPQ = AMPQ;

import AMPQLibrary from 'amqplib';
import MQ from '@davidkhala/pubsub';

export class AMPQ extends MQ {
	constructor({domain = 'localhost', port = 5672, password, username} = {}, logger) {
		super({domain, username, password, port, dialect: 'amqp'}, undefined, logger);
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

	async _connect() {
		this.connection = await AMPQLibrary.connect(this.connectionString);
		this.channel = await this.connection.createChannel();
		return true;
	}

	async close() {
		await this.connection.close();
	}
}


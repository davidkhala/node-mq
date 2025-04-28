import AMPQLibrary from 'amqplib';
import DB from '@davidkhala/db';

export class AMQP extends DB {
	constructor({domain = 'localhost', port = 5672, password, username, dialect = 'amqp', name = username}, connectionString, logger) {
		super({domain, username, password, port, dialect, name}, connectionString, logger);
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
		this.connection = await AMPQLibrary.connect(this.connectionString);
		this.channel = await this.connection.createChannel();
	}

	async disconnect() {
		await this.connection.close();
	}
}


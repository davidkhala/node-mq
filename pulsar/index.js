import PulsarClient from 'pulsar-client';
import PubSub, {Pub, Sub} from '@davidkhala/pubsub';
import {hostname} from '@davidkhala/light/devOps.js';

const {Client, MessageId, Producer, Consumer} = PulsarClient;

export default class Pulsar extends PubSub {
	constructor({domain, port = 6650}, connectionString, logger) {

		super({domain, port, dialect: 'pulsar'}, connectionString, logger);
		this.connection = new Client({
			serviceUrl: this.connectionString
		});

	}

	set mTLS(bool) {
		if (bool) {
			this.driver = 'ssl';
			this.connection = new Client({
				serviceUrl: this.connectionString
			});
		} else {
			delete this.driver;
		}
	}


	async disconnect() {
		await this.connection.close();
	}


	async getProducer(topic) {
		if (!this._producer) {
			const producer = await this.connection.createProducer({
				topic,
			});
			this._producer = new PulsarProducer(producer);
		}

		return this._producer;
	}

	async getConsumer(topic, subscription) {
		if (!this._consumer) {
			if (!subscription) {
				subscription = `${hostname}:${process.pid}`;
			}
			const consumer = await this.connection.subscribe({
				topic,
				subscription
			});
			this._consumer = new PulsarConsumer(consumer);

		}

		return this._consumer;

	}
}

export class PulsarProducer extends Pub {
	/**
	 *
	 * @param {Producer} pub
	 */
	constructor(pub) {
		super();
		this.pub = pub;
	}

	async send(message) {
		const msgId = await this.pub.send({data: Buffer.from(message)});
		return msgId.serialize();
	}

	async disconnect() {
		await this.pub.close();
	}
}

export class PulsarConsumer extends Sub {
	/**
	 *
	 * @param {Consumer} sub
	 */
	constructor(sub) {
		super();
		this.sub = sub;
	}

	async subscribe() {
		const msg = await this.sub.receive();
		return {
			data: msg.getData().toString(),
			id: msg.getMessageId().serialize()
		};
	}

	async acknowledge(message) {
		return await this.sub.acknowledgeId(MessageId.deserialize(Buffer.from(message)));
	}

	async disconnect() {
		return await this.sub.close();
	}
}
import PulsarClient from 'pulsar-client';
import PubSub from '@davidkhala/pubsub';
import {hostname} from '@davidkhala/light/devOps.js';

const {Client,MessageId} = PulsarClient;

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
		} else {
			delete this.driver;
		}
	}


	async disconnect() {

		this.producer && await this.producer.close();
		this.consumer && await this.consumer.close();
		await this.connection.close();
	}


	async acknowledge(messageId) {

		return this.consumer.acknowledgeId(MessageId.deserialize(Buffer.from(messageId)));
	}

	async preSend(topic) {
		this.producer = await this.connection.createProducer({
			topic,
		});
		return this.producer;
	}

	async send(topic, message) {
		if (!this.producer) {
			await this.preSend(topic);
		}

		const msgId = await this.producer.send({data: Buffer.from(message)});
		return msgId.toString();
	}

	async subscribe(topic, subscription) {
		if (!subscription) {
			subscription = `${hostname}:${process.pid}`;
		}
		const consumer = await this.connection.subscribe({
			topic,
			subscription
		});
		this.consumer = consumer;
		const msg = await consumer.receive();
		return [msg.getData().toString(), msg.getMessageId().serialize()];
	}
}
import {Client} from '@stomp/stompjs';
import DB from '@davidkhala/db/index.js';
import assert from 'assert';
import {TCPWrapper} from '@stomp/tcp-wrapper';

export const container = {
	config: '/opt/activemq/conf',
	data: '/opt/activemq/data'
};
export const ActivationState = {
	ACTIVE: 0,
	DEACTIVATING: 1,
	INACTIVE: 2,
};

export class STOMP extends DB {
	constructor({domain, username, password}, logger = console) {
		super({domain, username, password}, undefined, logger);

		this.connection = new Client({
			debug: logger.debug,
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			connectHeaders: {
				login: username,
				passcode: password
			},
		});
		this.connection.webSocketFactory = () => new TCPWrapper(domain, 61613);
	}

	async connect() {

		if (this.connection.state === ActivationState.DEACTIVATING) {
			throw new Error('Still DEACTIVATING, can not activate now');
		}

		if (this.connection.active) {
			this.connection.debug('Already ACTIVE, ignoring request to activate');
			return;
		}


		this.connection._changeState(ActivationState.ACTIVE);

		await this.connection._connect();
		return new Promise((resolve, reject) => {
			this.onConnect = (frame) => {
				const {command} = frame;
				command === 'CONNECTED' ? resolve() : reject(frame);
			};
		});

	}

	async disconnect() {
		await this.connection.deactivate();
	}

	set onConnect(listener) {
		this.connection.onConnect = listener;
	}

	send(topic, message) {
		assert.ok(typeof topic === 'string', `Invalid destination type:${typeof topic}`);
		assert.ok(typeof message === 'string', `Invalid body type:${typeof message}`);

		this.connection.publish({
			destination: topic,
			body: message,
		});
	}

	/**
     *
     * @param topic
     * @param {function(message:IMessage)} listener
     * @return {StompSubscription}
     */
	subscribe(topic, listener) {
		return this.connection.subscribe(topic, listener);
	}

	unsubscribe(subscriptionID) {
		this.connection.unsubscribe(subscriptionID);
	}
}
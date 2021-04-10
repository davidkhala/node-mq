exports.container = {
	config: '/opt/activemq/conf',
	data: '/opt/activemq/data'
};


class STOMP {
	static globalSetup() {
		const polyfill = {};
		if (typeof WebSocket !== 'function') {
			polyfill.WebSocket = require('ws');
		}
		if (typeof TextEncoder !== 'function') {
			const {TextEncoder, TextDecoder} = require('text-encoding');
			polyfill.TextEncoder = TextEncoder;
			polyfill.TextDecoder = TextDecoder;
		}
		Object.assign(global, polyfill);
	}

	constructor({brokerURL}) {
		STOMP.globalSetup();

		const StompJs = require('@stomp/stompjs');
		const client = new StompJs.Client({
			brokerURL,
			debug: console.debug,
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			// connectHeaders: {
			// 	login: "user",
			// 	passcode: "password"
			// },
		});

		this.client = client;
	}

	/**
	 *
	 * @param {closeEventCallbackType} listener
	 */
	setOnClose(listener) {
		this.client.onWebSocketClose = listener;
	}

	/**
	 *
	 * @param {frameCallbackType} listener
	 */
	setOnError(listener) {
		this.client.onStompError = listener;
	}

	async connect() {
		return new Promise(resolve => {
			this.client.onConnect = (frame) => {
				delete this.client.onConnect;
				resolve();
			};
			this.client.activate();
		});

	}

	send(topic, message) {
		if (typeof topic !== 'string') {
			throw Error(`Invalid destination type:${typeof topic}`);
		}
		if (typeof message !== 'string') {
			throw Error(`Invalid body type:${typeof message}`);
		}
		this.client.publish({
			destination: topic,
			body: message,
			// skipContentLengthHeader: true, // TODO ??
			// headers: {'priority': '9'} // TODO ??
		});
	}

	/**
	 *
	 * @return {ITransaction}
	 */
	createTransaction() {
		return this.client.begin();
	}

	/**
	 *
	 * @param {ITransaction} tx
	 */
	commit(tx) {
		tx.commit();
	}

	/**
	 *
	 * @param {ITransaction} tx
	 */
	cancel(tx) {
		tx.abort();
	}

	/**
	 *
	 * @param topic
	 * @param {function(message:IMessage)} listener
	 * @return {StompSubscription}
	 */
	subscribe(topic, listener) {
		return this.client.subscribe(topic, listener);
	}

	close() {
		this.client.deactivate();
		this.client.onWebSocketClose = () => {
			delete this.client.onConnect;
			delete this.client.onStompError;
			delete this.client.onWebSocketClose;
		};
	}
}

exports.STOMP = STOMP;


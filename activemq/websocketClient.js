import {BaseClient} from './index.js';
import WebSocket from 'ws';

export class WebsocketClient extends BaseClient {

	constructor(host, username, password, logger) {
		super(host, {username, password}, logger);

		const brokerURL = `ws://${host}:61614`;
		this.client.webSocketFactory = () => {
			return new WebSocket(brokerURL, this.client.stompVersions.protocolVersions());
		};
	}

	/**
     *
     * @param {closeEventCallbackType} listener
     */
	set onClose(listener) {
		this.client.onWebSocketClose = listener;
	}

	/**
     *
     * @param {frameCallbackType} listener
     */
	set onError(listener) {
		this.client.onStompError = listener;
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

	unsubscribe(subscriptionID) {
		this.client.unsubscribe(subscriptionID);
	}

	async disconnect() {
		await super.disconnect();
		this.client.onWebSocketClose = () => {
			delete this.client.onConnect;
			delete this.client.onStompError;
			delete this.client.onWebSocketClose;
		};
	}
}



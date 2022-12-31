import stompJs from '@stomp/stompjs';
import {ActivationState} from "./index.js";
import WebSocket from 'ws'
import assert from 'assert'

const {Client, Message} = stompJs

export class Websocket {

    constructor(brokerURL, logger = console) {
        assert.ok(typeof brokerURL === 'string', `typeof brokerURL !== 'string'`)

        this.client = new Client({
            brokerURL,
            debug: logger.debug,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                login: "user",
                passcode: "password"
            },
        });

        this.client.webSocketFactory = () => {
            return new WebSocket(brokerURL, this.client.stompVersions.protocolVersions())
        }
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

    set onConnect(listener) {
        this.client.onConnect = listener
    }

    async connect() {

        if (this.client.state === ActivationState.DEACTIVATING) {
            throw new Error('Still DEACTIVATING, can not activate now');
        }

        if (this.client.active) {
            this.client.debug('Already ACTIVE, ignoring request to activate');
            return;
        }

        this.client._changeState(ActivationState.ACTIVE);

        await this.client._connect();
        return new Promise((resolve, reject) => {
            this.onConnect = (frame) => {
                const {command} = frame
                command === 'CONNECTED' ? resolve() : reject(frame)
            }
        })

    }

    send(topic, message) {
        assert.ok(typeof topic === 'string', `Invalid destination type:${typeof topic}`)
        assert.ok(typeof message === 'string', `Invalid body type:${typeof message}`)

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

    unsubscribe(subscriptionID) {
        this.client.unsubscribe(subscriptionID)
    }

    async disconnect() {
        await this.client.deactivate();
        this.client.onWebSocketClose = () => {
            delete this.client.onConnect;
            delete this.client.onStompError;
            delete this.client.onWebSocketClose;
        };
    }
}



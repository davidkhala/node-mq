import {Client} from '@stomp/stompjs';
import assert from 'assert'

export const container = {
    config: '/opt/activemq/conf',
    data: '/opt/activemq/data'
}
export const ActivationState = {
    ACTIVE: 0,
    DEACTIVATING: 1,
    INACTIVE: 2,
}

export class BaseClient {
    constructor(host, logger = console) {
        assert.ok(typeof host === 'string', `typeof host !== 'string'`)

        this.client = new Client({
            debug: logger.debug,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                login: "user",
                passcode: "password"
            },
        });
        this.host = host

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
    async disconnect() {
        await this.client.deactivate();
    }
    set onConnect(listener) {
        this.client.onConnect = listener
    }
    send(topic, message) {
        assert.ok(typeof topic === 'string', `Invalid destination type:${typeof topic}`)
        assert.ok(typeof message === 'string', `Invalid body type:${typeof message}`)

        this.client.publish({
            destination: topic,
            body: message,
        });
    }
}
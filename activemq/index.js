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
}
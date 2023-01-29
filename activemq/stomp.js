import {TCPWrapper} from '@stomp/tcp-wrapper';
import {BaseClient} from './index.js'

export class STOMPClient extends BaseClient {
    constructor(host, username, password, logger) {
        super(host,{username, password}, logger);
        this.client.webSocketFactory = () => new TCPWrapper(host, 61613);
    }
}

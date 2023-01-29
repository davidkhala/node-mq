import {TCPWrapper} from '@stomp/tcp-wrapper';
import {BaseClient} from './index.js'

export class STOMPClient extends BaseClient {
    constructor(host, logger) {
        super(host, logger);
        this.client.webSocketFactory = () => new TCPWrapper(host, 61613);
    }
}

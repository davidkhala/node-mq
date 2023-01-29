import {TCPWrapper} from '@stomp/stompjs';
// import CJS from '@stomp/stompjs/bundles/tcp-wrapper.cjs'
import {BaseClient} from './index.js'

// const {TCPWrapper} = CJS;

export class STOMPClient extends BaseClient {
    constructor(host, logger) {
        super(host, logger);
        this.client.webSocketFactory = () => new TCPWrapper(host, 61613);
    }
}

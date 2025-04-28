import {AMQP} from './index.js';

export default class CloudAMQP extends AMQP {
    constructor({domain, tls, password, username}) {
        const port = tls ? 5671 : 5672;
        const dialect = tls ? 'amqps' : 'amqp';
        super({domain, port, password, username, dialect}, undefined, undefined);
    }
}
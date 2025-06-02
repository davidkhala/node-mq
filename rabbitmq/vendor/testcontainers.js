import {RabbitMQContainer} from '@testcontainers/rabbitmq'
import {Controller as C} from '@davidkhala/db/vendor/testcontainers.js'
import {AMQP} from '../index.js'

export class Controller extends C {
    constructor(username, password, tls) {
        super();
        this.container = new RabbitMQContainer('rabbitmq:latest')
        if (username) {
            this.container.withEnvironment({
                RABBITMQ_DEFAULT_USER: username,
                RABBITMQ_DEFAULT_PASS: password,
            })
            this.username = username
            this.password = password
        }
        this.tls = tls
        if (tls) {
            // RABBITMQ_SSL_CERT_FILE=
            // RABBITMQ_SSL_KEY_FILE
            // RABBITMQ_SSL_CA_FILE
        }

    }

    get port() {
        return this.handler.getMappedPort(5672)
    }

    get connectionString() {
        if (this.tls) {
            // FIXME No test coverage in https://github.com/testcontainers/testcontainers-node/blob/main/packages/modules/rabbitmq/src/rabbitmq-container.test.ts
            return this.handler.getAmqpsUrl()
        }
        return this.handler.getAmqpUrl()
    }

    /**
     *
     * @returns {Promise<AMQP>}
     */
    async getConnection() {
        const {port, username, password, tls} = this;
        const options = {
            domain: 'localhost',
            dialect: tls ? 'amqps' : 'amqp',
            port
        }
        if (username) {
            Object.assign(options, { username, password})
        }
        const amqp = new AMQP(options)
        await amqp.connect()
        return amqp
    }
}
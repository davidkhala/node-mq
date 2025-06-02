import {RabbitMQContainer} from '@testcontainers/rabbitmq'
import {Controller as C} from '@davidkhala/db/vendor/testcontainers.js'
import {AMQP} from '../index.js'

export class Controller extends C {
    constructor(username, password) {
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

    }

    get port() {
        return this.handler.getMappedPort(5672)
    }

    get connectionString() {
        return this.handler.getAmqpUrl()
    }

    /**
     *
     * @returns {Promise<AMQP>}
     */
    async getConnection() {
        const {port, username, password} = this;
        const options = {
            domain: 'localhost',
            dialect: 'amqp',
            port
        }
        if (username) {
            Object.assign(options, {username, password})
        }
        const amqp = new AMQP(options)
        await amqp.connect()
        return amqp
    }
}
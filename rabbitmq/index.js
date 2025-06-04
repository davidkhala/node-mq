import AMPQLibrary from 'amqplib';
import DB from '@davidkhala/db';
import * as fs from "fs";

export class AMQP extends DB {
    constructor({
                    domain = 'localhost',
                    port,
                    password,
                    username,
                    dialect,
                    name,
                    tls
                }, connectionString, logger) {
        if (!port) {
            port = tls ? 5671 : 5672
        }
        if (!dialect) {
            dialect = tls ? 'amqps' : 'amqp'
        }
        super({domain, username, password, port, dialect, name}, connectionString, logger);
        this.tls = tls
    }

    async send(topic, message) {
        const status = await this.channel.assertQueue(topic);
        return await this.channel.sendToQueue(topic, Buffer.from(message));
    }

    async subscribe(topic, listener) {
        const status = await this.channel.assertQueue(topic);
        return this.channel.consume(topic, listener);
    }

    ack(message) {
        this.channel.ack(message);
    }

    async connect(options = {}) {
        if (this.tls && this.domain === 'localhost') {
            options.rejectUnauthorized = false
        }
        this.connection = await AMPQLibrary.connect(this.connectionString, options);
        this.channel = await this.connection.createChannel();
    }

    async disconnect() {
        await this.connection.close();
    }
}


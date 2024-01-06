import {Client} from 'pulsar-client';
import DB from '@davidkhala/db'

export default class Pulsar extends DB {
    constructor({domain, port = 6650, name, username, password}, connectionString, logger) {

        super({domain, port, name, username, password, dialect: 'pulsar'}, connectionString, logger);
        this.connection = new Client({
            serviceUrl: this.connectionString
        })

    }

    set mTLS(bool) {
        if (bool) {
            this.driver = 'ssl'
        } else {
            delete this.driver
        }
    }

    async _connect() {
        return Promise.resolve(undefined);
    }

    _throwConnectError(e) {
        return true;
    }


    async disconnect() {
        return this.connection.close();
    }

    async query(template, values, requestOptions) {
        // https://pulsar.apache.org/docs/next/sql-overview/
        return Promise.resolve(undefined);
    }

    async producer(topic) {
        return await this.connection.createProducer({
            topic,
        })
    }
    async consumer(subscription, topic ){
        return await this.connection.subscribe({topic, subscription})
    }


}
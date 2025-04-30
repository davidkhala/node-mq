import {Pub as AbstractPub} from "@davidkhala/pubsub";

export class Pub extends AbstractPub {
    constructor(kafka, options) {
        super(kafka, options);
        this.pub = kafka.producer(options);
    }

    async connect() {
        await this.pub.connect();
    }

    send(...messages) {
        return this.pub.send({
            topic: this.topic, messages
        })
    }


    /**
     * call flush to send all messages in the internal buffer without waiting for the linger.ms to expire.
     * @param timeout
     * @returns {Promise<void>}
     */
    async flush(timeout) {
        await this.pub.flush({timeout});
    }

    async disconnect() {
        await this.pub.disconnect();
    }
}

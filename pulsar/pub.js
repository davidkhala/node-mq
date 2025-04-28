import {Pub as AbstractPub} from "@davidkhala/pubsub";

export class Producer extends AbstractPub {
    constructor(pulsar, options) {
        const {topic} = options
        super(pulsar, {topic});
        this.pulsar = pulsar
    }

    async connect() {
        const {topic, pulsar} = this
        this.pub = await pulsar.createProducer({topic})
    }

    async send(message) {
        return await this.pub.send({data: Buffer.from(message)});
    }

    async flush() {
        await this.pub.flush()
    }

    async disconnect() {
        await this.pub.close();
    }
}
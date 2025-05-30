import {Sub as AbstractSub} from "@davidkhala/pubsub";
import Pulsar from 'pulsar-client';
// import {MessageId, Client, Consumer as NativeConsumer, Message, Reader as NativeReader} from 'pulsar-client'
const {MessageId} = Pulsar

/**
 * @callback Listener
 * @param {Message} msg
 * @param {NativeConsumer} msgConsumer
 */

/**
 *
 * @type Listener
 */
export const ConsoleListener = async (msg, msgConsumer) => {
    console.info(msg.getData().toString());
    await msgConsumer.acknowledge(msg);
}

/**
 *
 * @param {Message} msg
 * @returns {{data: string, id: MessageId, id_bytes: Buffer}}
 */
const pretty = (msg) => {
    /**
     * @type MessageId
     */
    const id = msg.getMessageId()
    return {
        data: msg.getData().toString(),
        id,
        id_bytes: id.serialize()
    };
}

/**
 * Used for message queue mode
 */
export class Consumer extends AbstractSub {

    constructor(pulsar, options) {
        const {topic, group} = options
        super(pulsar, {topic, group});
        /**
         * @type Client
         */
        this.pulsar = pulsar;
        this.options = Object.assign({
            topic,
            subscription: group,
            subscriptionType: 'Exclusive',
        }, options);
    }


    /**
     *
     * @param {Listener} [listener]
     */
    async subscribe(listener){
        if (listener) {
            this.options.listener = listener;
        }
        /**
         * @type Consumer
         */
        this.sub = await this.pulsar.subscribe(this.options);
    }


    /**
     * It begins with the most recently unacked message
     * To fetch history messages, you need to reset offset first by {@link reset}
     */
    async next() {
        const msg = await this.sub.receive();
        return pretty(msg)
    }

    /**
     *
     * @param {MessageId|Buffer} message_id
     */
    async acknowledge(message_id) {
        if (Buffer.isBuffer(message_id)) {
            message_id = MessageId.deserialize(Buffer.from(message_id))
        }
        return await this.sub.acknowledgeId(message_id);
    }

    async reset(messageId = MessageId.earliest()) {
        await this.sub.seek(messageId)
    }

    async disconnect() {
        return await this.sub.close();
    }
}

export class Reader extends AbstractSub {
    constructor(pulsar, options) {
        const {topic, startMessageId} = options
        super(pulsar, {topic});
        /**
         * @type Client
         */
        this.pulsar = pulsar;

        this.options = Object.assign({
            topic,
            startMessageId: startMessageId || MessageId.earliest()
        }, options)
    }

    async subscribe(listener) {

        if (listener) {
            this.options.listener = listener;
        }
        /**
         *
         * @type NativeReader
         */
        this.sub = await this.pulsar.createReader(this.options)
    }

    async disconnect() {
        return await this.sub.close();
    }


    async next() {
        const msg = await this.sub.readNext()
        return pretty(msg)
    }

    async reset(messageId = MessageId.earliest()) {
        await this.sub.seek(messageId)
    }
}
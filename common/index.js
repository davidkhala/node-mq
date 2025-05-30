import {Connectable} from '@davidkhala/db';

export default class MQ {

    /**
     * @abstract
     */
    getProducer(options) {
        return new Pub(this, options)
    }

    /**
     * @abstract
     */
    getConsumer(options) {
        return new Sub(this, options)
    }

    /**
     * @abstract
     */
    getAdmin(options) {
        return new Admin(this, options)
    }
}

/**
 * @abstract
 */
export class Pub {
    constructor(mq, options) {
        this.topic = options.topic;
    }

    /**
     *
     * @abstract
     */
    async send(...message) {
    }

}

/**
 * @abstract
 */
export class Sub {
    constructor(mq, options) {
        this.topic = options.topic;
        this.group = options.group; // e.g. subscription in gcp pubsub, group.id for kafka
    }

    /**
     *
     * @abstract
     */
    async subscribe() {

    }

    /**
     * @abstract
     * seek to an offset, timestamp or messageId
     */
    async reset(offset) {

    }

    /**
     *
     * Not required for reader
     */
    async acknowledge(message) {

    }

}

/**
 * @abstract
 */
export class Admin extends Connectable {
    /**
     * @abstract
     */
    async listTopics() {

    }

    /**
     * @abstract
     */
    async deleteTopics(options) {

    }

    /**
     * @abstract
     */
    async createTopics(options) {

    }

    /**
     * Truncate topics
     * @abstract
     */
    async clear() {

    }
}
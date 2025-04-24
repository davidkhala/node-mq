import {Connectable} from '@davidkhala/db';

export default class MQ {

    /**
     * @abstract
     * @return {Pub}
     */
    getProducer(options) {
        return new Pub(this, options)
    }

    /**
     * @abstract
     * @return {Sub}
     */
    getConsumer(options) {
        return new Sub(this, options)
    }

    /**
     * @abstract
     * @return {Admin}
     */
    get dba() {
    }
}

/**
 * @abstract
 */
export class Pub extends Connectable {
    constructor(mq, options) {
        super();
        this.topic = options.topic;
    }

    /**
     *
     * @abstract
     * @param {string} message
     */
    async send(...message) {

    }

}

/**
 * @abstract
 */
export class Sub extends Connectable {
    constructor(mq, options) {
        super();
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
     *
     * @abstract
     * @param {string} message
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
     * Truncate data
     * @abstract
     */
    async clear() {

    }
}
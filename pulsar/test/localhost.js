import Pulsar from '../index.js';
import {ContainerManager} from "@davidkhala/docker/docker.js";
import {docker} from "../test-utils/recipe.js";
import * as assert from "node:assert";

describe('', function () {
    this.timeout(0);
    const pulsar = new Pulsar({domain: 'localhost'});
    const topic = 'topic';
    const message = 'message';
    let stop
    before(async () => {
        const manager = new ContainerManager();
        stop = await docker(manager, {});
    })
    const test_pub = async () => {
        const producer = pulsar.getProducer(topic);
        await producer.connect()
        await producer.send(message);
        await producer.disconnect();
    }
    it('pub', test_pub);
    it('sub', async () => {
        const consumer = pulsar.getConsumer(topic);
        await consumer.connect()

        await Promise.all([
            test_pub(),
            (async () => {
                const {data, id} = await consumer.get_next();
                assert.strictEqual(data, message);
                console.info('id', id.toString())
                await consumer.acknowledge(id);
            })(),
        ])

        await consumer.disconnect();
    })

    after(async () => {
        await stop()
    })

});
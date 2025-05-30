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
    it('fifo', async () => {
        const producer = pulsar.getProducer(topic);
        await producer.connect()
        for (let i = 1; i <= 10; i++) {
            await producer.send(i.toString());
        }
        await producer.flush()
        await producer.disconnect();

        //
        const consumer = pulsar.getConsumer(topic);
        await consumer.subscribe()
        await consumer.reset()

        for (let i = 1; i <= 10; i++) {
            const {data, id} = await consumer.next();
            assert.equal(data, i.toString())
            await consumer.acknowledge(id)
        }

        await consumer.disconnect();
    })
    it('sub', async () => {

        const consumer = pulsar.getConsumer(topic);
        await Promise.all([
            test_pub(),
            (async () => {

                await consumer.subscribe()
                const {data, id} = await consumer.next();
                assert.strictEqual(data, message);
                console.info('id', id.toString())
                await consumer.acknowledge(id);
                await consumer.disconnect();
            })(),
        ])


    })

    after(async () => {
        await stop()
    })

});
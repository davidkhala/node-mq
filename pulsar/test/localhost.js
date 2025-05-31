import Pulsar from '../index.js';
import {ContainerManager} from "@davidkhala/docker/docker.js";
import {docker} from "../vendor/recipe.js";
import * as assert from "node:assert";

describe('', function () {
    this.timeout(0);
    const topic = 'topic';
    const pulsar = new Pulsar({domain: 'localhost', topic});
    const message = 'message';
    let stop
    before(async () => {
        const manager = new ContainerManager();
        stop = await docker(manager, {});
    })
    const test_pub = async () => {
        const producer = pulsar.getProducer();
        await producer.connect()
        await producer.send(message);
        await producer.disconnect();
    }
    it('metadata', async ()=> {
        const [partition] = await pulsar.partitions()
        assert.equal(partition, 'persistent://public/default/topic')
    })
    it('fifo', async () => {
        const producer = pulsar.getProducer();
        await producer.connect()
        for (let i = 1; i <= 10; i++) {
            await producer.send(i.toString());
        }
        await producer.flush()
        await producer.disconnect();

        //
        const consumer = pulsar.getConsumer();
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

        const consumer = pulsar.getConsumer();
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
    it('read', async ()=> {
        const reader = pulsar.getReader()
        await test_pub()
        await reader.subscribe()
        console.debug(await reader.next())

        const p1 = await reader.next(1000)
        //FIXME Process finished with exit code -1073741819 (0xC0000005) when timeout
        console.debug({p1})

        await reader.disconnect()



    })

    after(async () => {
        await pulsar.disconnect()
        await stop()
    })

});
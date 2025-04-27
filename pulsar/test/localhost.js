import Pulsar from '../index.js';
import assert from 'assert';

describe('', function () {
    this.timeout(0);
    const pulsar = new Pulsar({domain: 'localhost'});
    const topic = 'topic';
    const message = 'message';
    it('pubsub', async () => {
        const producer = pulsar.getProducer(topic);
        await producer.connect()
        const msgId = await producer.send(message);
        console.info({msgId}, msgId.serialize().toString());


        const consumer = pulsar.getConsumer(topic);
        await consumer.connect()
        // TODO WIP
        // const {data, id} = await consumer.subscribe();
        // assert.strictEqual(data, message);
        // await consumer.acknowledge(id);

        await consumer.disconnect();
        await producer.disconnect();
    });


});
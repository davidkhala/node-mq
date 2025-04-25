import assert from 'assert';
import Insecure from '../insecure.js';
import {KafkaContainer} from "@testcontainers/kafka";

describe('docker', function () {
    this.timeout(0);
    it('connect', async () => {
        const kafka_brokers_sasl = ['localhost:9092'];//  ['kafka1:9092',            'kafka2:9092','kafka3:9092']
        const client = new Insecure(kafka_brokers_sasl);
        const {admin} = client;
        await admin.connect();
        const topics = await admin.listTopics();

        assert.ok(topics.length === 0);
        await admin.disconnect();
    });
});
describe('testcontainers', function () {
    this.timeout(0);
    let controller
    before(async () => {
        const container = new KafkaContainer().withKraft().withExposedPorts(9093)
        controller = await container.start();
    })
    it('connect', async () => {

    })
    after(async () => {
        await controller.stop()
    })

});
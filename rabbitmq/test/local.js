import {AMQP} from '../index.js';
import assert from 'assert';
import {docker} from '../vendor/recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';

const topic = 'tasks';
import {bitnami, default_user, default_pass} from '../const.js'

const username = bitnami.username;
const password = bitnami.password;
describe('docker:bitnami, Auth', function () {
    this.timeout(0);
    const bitnamiContainer = new AMQP({username, password});
    const manager = new ContainerManager();
    let stop;
    before(async () => {
        stop = await docker(manager, {username, password});
        await bitnamiContainer.connect();
    });

    it('subscribe and send', async () => {
        const message = 'b';
        const listener = async (received) => {
            assert.strictEqual(received, message);
            bitnamiContainer.ack(received);
        };
        await bitnamiContainer.subscribe(topic, listener);
        await bitnamiContainer.send(topic, message);
    });
    after(async () => {
        await bitnamiContainer.disconnect();
        await stop();
    });
});
describe('docker:davidkhala/rabbitmq (tls)', function () {
    this.timeout(0);
    const tls = true
    const username = default_user
    const password = default_pass
    const amqps = new AMQP({
        username, password, tls
    });
    const manager = new ContainerManager();
    it('connect', async () => {
        const stop = await docker(manager, {username, password, tls});
        await amqps.connect()
        await amqps.disconnect()
        await stop()
    })

})
import {Controller} from '../vendor/testcontainers.js'

describe('testcontainers:admin', function () {
    this.timeout(0);
    it('insecure', async () => {
        const c = new Controller()
        await c.start()
        assert.ok(c.connectionString.startsWith('amqp://localhost:'));
        console.debug(c.connectionString)
        const connect = await c.getConnection()
        await connect.disconnect()
        await c.stop()
    })
    it('Auth username password', async () => {
        const c = new Controller(username, password)
        await c.start()
        const connect = await c.getConnection()
        await connect.disconnect()
        await c.stop()
    })
})

import {AMQP} from '../index.js';
import assert from 'assert';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';

const topic = 'tasks';
describe('docker:bitnami', function () {
	this.timeout(0);
	const bitnamiContainer = new AMQP({username: 'user', password: 'bitnami', name: ''});
	const manager = new ContainerManager();
	let stop;
	before(async () => {
		stop = await docker(manager);
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


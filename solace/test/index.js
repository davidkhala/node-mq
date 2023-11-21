import {SolaceConnect} from '../index.js';
import {Pub} from '../pub.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';
import {Sub} from '../sub.js';

describe('', function () {
	this.timeout(0);
	const username = 'admin';
	const password = 'admin';
	const vpn = 'default';
	const connect = new SolaceConnect({username, password, vpn}, console);
	let stop = () => {
	};
	it('run', async () => {
		const manager = new ContainerManager();
		stop = await docker(manager, {
			username,
			password,
		});
	});
	it('reconnect', async () => {
		await connect.disconnect();
		await connect.connect();
		await connect.disconnect();
	});
	const pub = new Pub({username, password, vpn}, console);
	const topicName = 'tutorial/topic';
	it('pub', async () => {

		await pub.connect();
		pub.publish(topicName, 'funk');
		await pub.disconnect();
	});
	const sub = new Sub({username, password, vpn}, console);
	it('sub', async () => {

		await sub.connect();
		sub.subscribe(topicName)

	});
	it('stop', async () => {
		await stop();
	});

});
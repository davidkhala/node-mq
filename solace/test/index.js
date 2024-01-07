import {SolaceConnect} from '../index.js';
import {Pub} from '../pub.js';
import {docker} from './recipe.js';
import {ContainerManager} from '@davidkhala/docker/docker.js';
import {Sub} from '../sub.js';
import {sleep} from '@davidkhala/light/index.js';

describe('', function () {
	this.timeout(0);
	const username = 'admin';
	const password = 'admin';
	const vpn = 'default';
	const connect = new SolaceConnect({username, password, vpn}, console);
	let stop = () => {
	};
	before(async () => {
		const manager = new ContainerManager();
		stop = await docker(manager, {
			username,
			password,
		});
		await sleep(30000);
	});
	after(async () => {
		await stop();
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
	it.skip('sub', async () => {// oneoff subscribe
		const sub = new Sub({username, password, vpn}, console);
		await sub.connect();
		await sub.subscribe(topicName, true);


		await sub.disconnect();

	});

});
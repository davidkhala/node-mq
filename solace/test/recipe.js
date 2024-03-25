import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Size} from '@davidkhala/light/constants.js';


export async function docker(manager, {websocket = 8008, portal = 8080, username = 'admin', password}) {
	const Image = 'solace/solace-pubsub-standard';

	const env = [
		`username_admin_globalaccesslevel=${username}`,
		`username_admin_password=${password}`
	];
	const opts = new OCIContainerOptsBuilder(Image);

	opts.setPortBind(`${websocket}:8008`);
	opts.setPortBind(`${portal}:8080`);
	opts.name = 'solace';
	opts.env = env;
	opts.opts.HostConfig.ShmSize = Size['2GB'];

	await manager.containerStart(opts.opts, true);
	return async () => manager.containerDelete(Image);
}
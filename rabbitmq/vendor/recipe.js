import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

export async function docker(manager, {port = 5672, username, password} = {}) {
    const Image = 'bitnami/rabbitmq';
    const name = 'rabbitmq';

    const opts = new OCIContainerOptsBuilder(Image);

    opts.setPortBind(`${port}:5672`);
    opts.name = name;
    opts.env = [
        'RABBITMQ_MANAGEMENT_ALLOW_WEB_ACCESS=true'
    ];

    if (username) {
        opts.addEnv('RABBITMQ_DEFAULT_USER', username)
        opts.addEnv('RABBITMQ_DEFAULT_PASS', password)
    }

    opts.setHealthCheck({
        useShell: true, commands: [Test]
    });

    await manager.containerStart(opts.opts, true);
    await manager.containerWaitForHealthy(name);
    return async () => manager.containerDelete(name);
}
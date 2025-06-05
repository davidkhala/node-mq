import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

export async function docker(manager, {username, password, tls} = {}) {
    const Image = tls ? 'davidkhala/rabbitmq' : 'bitnami/rabbitmq';
    const name = 'rabbitmq';

    const opts = new OCIContainerOptsBuilder(Image);

    if (tls) {
        opts.setPortBind(`5671:5671`);
    } else {
        opts.setPortBind(`5672:5672`);
    }

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
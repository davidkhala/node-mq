import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js';
import {Test} from '../healthcheck.js';

export async function docker(manager, {username, password, tls} = {}) {
    const Image = tls ? 'davidkhala/rabbitmq' : 'bitnami/rabbitmq';
    const name = 'rabbitmq';

    const opts = new OCIContainerOptsBuilder(Image);

    opts.setPortBind(`5672:5672`);
    if (tls) {
        opts.setPortBind(`5671:5671`);
    }

    opts.name = name;
    opts.env = [
        'RABBITMQ_MANAGEMENT_ALLOW_WEB_ACCESS=true'
    ];

    if (username) {
        opts.addEnv('RABBITMQ_DEFAULT_USER', username)
        opts.addEnv('RABBITMQ_DEFAULT_PASS', password)
    }
    if (tls) {
        // FIXME
        opts.addEnv('RABBITMQ_SSL_CERTFILE', '/tls/server_certificate.pem')
        opts.addEnv('RABBITMQ_SSL_KEYFILE', '/tls/server_key.pem')
        opts.addEnv('RABBITMQ_SSL_CACERTFILE', '/tls/ca_certificate.pem')
    }
    opts.setHealthCheck({
        useShell: true, commands: [Test]
    });

    await manager.containerStart(opts.opts, true);
    await manager.containerWaitForHealthy(name);
    return async () => manager.containerDelete(name);
}
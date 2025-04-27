import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js'
import {healthcheck, run} from "../const.js";

export async function docker(manager, {pulsaPort = 6650, httpPort = 8080}) {
    const Image = 'apachepulsar/pulsar';
    const name = 'pulsar';

    const opts = new OCIContainerOptsBuilder(Image, run.Standalone);
    opts.name = name
    opts.setPortBind(`${pulsaPort}:6650`);
    opts.setPortBind(`${httpPort}:8080`);
    opts.setHealthCheck({
        useShell: false, commands: healthcheck.Standalone
    });
    opts.setVolume('pulsarconf', '/pulsar/conf')
    opts.setVolume('pulsardata', '/pulsar/data')

    await manager.containerStart(opts.opts, true);
    await manager.containerWaitForHealthy(name);
    return async () => manager.containerDelete(name);
}
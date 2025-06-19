import {OCIContainerOptsBuilder} from '@davidkhala/container/options.js'
import {OCI} from '@davidkhala/container/oci.js'
import {Writable} from 'stream'
// TODO
export async function standalone(manager, {kafkaPort = 9092, httpPort = 8082}) {
    const Image = 'confluentinc/confluent-local';
    const name = 'cp-local';

    const opts = new OCIContainerOptsBuilder(Image);
    opts.name = name
    opts.setPortBind(`${kafkaPort}:9092`);
    opts.setPortBind(`${httpPort}:8082`);

    opts.setHealthCheck({
        useShell: false, commands: ["/bin/kafka-topics", "--bootstrap-server", "localhost:9092", "--list"]
    });

    await manager.containerStart(opts.opts, true);
    await manager.containerWaitForHealthy(name);
    return async () => manager.containerDelete(name);
}

/**
 *
 * @param {OCI} manager
 */
export async function cluster_id(manager, redirect) {
    // docker run -q confluentinc/cp-kafka /bin/kafka-storage random-uuid
    const Image = 'confluentinc/cp-kafka'
    const Cmd = ['/bin/kafka-storage', 'random-uuid']

    if(redirect) {
        // TODO backport to @davidkhala/container
        const container = await manager.client.createContainer({
            Image,
            Cmd,
            AttachStdout: true,
            AttachStderr: true,
        });
        await container.start();
        const stream = await container.attach({ stream: true, stdout: true, stderr: true });
        manager.client.modem.demuxStream(stream, process.stdout, process.stderr);
        await container.wait();
        await container.remove()
        return
    }
    let stdoutData = '', stderrData = ''
    const stdoutStream = new Writable({
        write(chunk, encoding, callback) {
            stdoutData += chunk.toString();
            callback();
        }
    });

    const stderrStream = new Writable({
        write(chunk, encoding, callback) {
            stderrData += chunk.toString();
            callback();
        }
    });
    await manager.client.run(Image, Cmd, [
        stdoutStream, stderrStream,
    ], {Tty: false});
    return [stdoutData.trim(), stderrData.trim()]



}
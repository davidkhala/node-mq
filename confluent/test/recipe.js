import {ContainerManager} from '@davidkhala/docker/docker.js'
import {cluster_id} from '../vendor/recipe.js'
describe('', function () {
    this.timeout(0)
    const manager = new ContainerManager()
    it('random-uuid', async () => {
        const [out, err] = await cluster_id(manager)
        console.info(out)
        console.warn({err})
    })
    it('random-uuid:redirect', async () => {
        await cluster_id(manager, true)

    })
})
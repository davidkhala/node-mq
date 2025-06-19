import {Cluster} from "../rest/cluster.js";

describe('Cluster', function () {
    this.timeout(0)
    const domain = 'localhost'
    const port = 8082
    const standalone = true
    const clusterCtl = new Cluster({domain, port, standalone})
    before(async () => {
        await clusterCtl.ping()
    })
    it('list', async () => {
        const r = await clusterCtl.list()
        console.debug(r)

    })

})

import {KafkaContainer} from "@testcontainers/kafka";
import {Controller} from "@davidkhala/db/vendor/testcontainers.js"

export default class KafkaController extends Controller {
    constructor() {
        super();
        this.container = new KafkaContainer().withKraft();
    }

    get port() {
        return this.handler.getFirstMappedPort()
    }

    get broker() {
        return `${this.handler.getHost()}:${this.port}`;
    }

}

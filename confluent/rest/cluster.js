import {API} from "./index.js";

export class Cluster extends API {

    async list() {
        const {data, kind, metadata} = await this.get('/')
        return data
    }
}
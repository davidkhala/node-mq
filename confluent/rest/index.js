import {axiosPromise} from "@davidkhala/axios/index.js";

export class API {
    /**
     *
     * @param domain
     * @param [port]
     * @param {boolean} [tls]
     * @param {boolean} [standalone] if true, adopt endpoint from github.com/confluentinc/kafka-rest
     */
    constructor({domain, port = 8082, tls, standalone} = {}) {
        const protocol = tls ? "https" : "http"
        this.root = `${protocol}://${domain}:${port}`
        this.baseURL = `${this.root}${standalone ? '' : '/kafka'}/v3/clusters`;
        this.options = {}
    }

    async ping() {
        await axiosPromise({url: this.root, method: "GET"}, this.options)
        // return empty js object
    }

    async get(path, params = {}) {
        const url = `${this.baseURL}${path}`
        return axiosPromise({url, method: 'GET', params}, this.options)
    }

    async delete(path, body = {}) {
        const url = `${this.baseURL}${path}`
        return axiosPromise({url, method: 'DELETE', body}, this.options)
    }
}
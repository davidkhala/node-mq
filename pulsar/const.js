export const healthcheck = {
    Standalone: ["bin/pulsar-admin", "brokers", "healthcheck"],
    Zookeeper: ["bin/pulsar-zookeeper-ruok.sh"]
}
export const run = {
    Standalone: ["bin/pulsar", "standalone"]
}
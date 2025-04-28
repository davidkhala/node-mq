export const healthcheck = {
    Standalone: ["bin/pulsar-admin", "brokers", "healthcheck"],
    StandaloneTopic: ["bin/pulsar-admin", "topics", "list", "public/default"],
    Zookeeper: ["bin/pulsar-zookeeper-ruok.sh"]
}
export const run = {
    Standalone: ["bin/pulsar", "standalone"]
}
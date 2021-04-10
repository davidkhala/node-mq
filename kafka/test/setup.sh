#!/usr/bin/env bash
binary(){
    wget http://apache.01link.hk/kafka/2.3.0/kafka_2.12-2.3.0.tgz
    tar -xzf kafka_2.12-2.3.0.tgz
    rm kafka_2.12-2.3.0.tgz
}
binaryRun(){
    kafka_2.12-2.3.0/bin/zookeeper-server-start.sh config/zookeeper.properties
    kafka_2.12-2.3.0/bin/kafka-server-start.sh config/server.properties
}
$1

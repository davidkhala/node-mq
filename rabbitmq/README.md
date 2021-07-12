# khala-rabbitmq

## Persistent
- RabbitMQ uses a custom DB to store the messages, the db is usually located here:
    `/var/lib/rabbitmq/mnesia`
    
  for docker image `bitnami/rabbitmq`, it locates at `/bitnami/rabbitmq/mnesia`
- About [Mnesia](http://erlang.org/doc/apps/mnesia/Mnesia_overview.html)
    - [a GraphQL implementation in Erlang](https://github.com/shopgun/graphql-erlang)      
 
## Cloud Native
- [IBM: Messages for RabbitMQ](https://cloud.ibm.com/catalog/services/messages-for-rabbitmq)
- GCP
    - [docker-containerized RabbitMQ](https://console.cloud.google.com/marketplace/product/google/rabbitmq3)
    - [VM: RabbitMQ Certified by Bitnami](https://console.cloud.google.com/marketplace/product/bitnami-launchpad/rabbitmq)
    - [GKE: RabbitMQ Cluster](https://console.cloud.google.com/marketplace/product/google/rabbitmq)
- AWS
    - [Bitnami packaged](https://aws.amazon.com/marketplace/pp/prodview-o7lo2xvhbhnde)
    - [Amazon MQ 是 Apache ActiveMQ 和 RabbitMQ 的托管消息代理服务](https://aws.amazon.com/amazon-mq/)

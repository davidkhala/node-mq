# khala-activemq

- ActiveMQ bootstrap based on existing configuration files
- default credential: admin:admin
- default data storage: [KahaDB](https://activemq.apache.org/kahadb)
## Notes
- persistent configured in `conf/activemq.xml`
    - [performance degrade]mysql: 
        1. data source configured in `<bean id="mysql-ds">`
        2. persistenceAdapter configured to  `#mysql-ds`
            ```
           <persistenceAdapter>
                           <jdbcPersistenceAdapter dataDirectory="${activemq.data}/mysql" dataSource="#mysql-ds"/>
           </persistenceAdapter>
            ```
    - [default] KahaDB 
    - [deprecated] leveldb 
- queue auto-cleanup: https://www.cnblogs.com/joylee/p/9583127.html

## Cloud Native
- GCP
    - [Container](https://console.cloud.google.com/marketplace/product/google/activemq5)
    - [GKE](https://console.cloud.google.com/marketplace/product/google/activemq)
    - [ActiveMQ Certified by Bitnami](https://console.cloud.google.com/marketplace/product/google/activemq)
- AWS
    - Amazon MQ

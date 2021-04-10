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

## TODO
- nodejs client for KahaDB? 
    - alternative java sample: https://www.programcreek.com/java-api-examples/?api=org.apache.activemq.store.kahadb.KahaDBStore
- mysql persistent not working: hanging in  INFO | Using Persistence Adapter: JDBCPersistenceAdapter(org.apache.commons.dbcp2.BasicDataSource@3e08ff24)
    - is docker network problem? mq problem? or jdbc connection to mysql problem      
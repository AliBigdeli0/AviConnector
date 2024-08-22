# Steps To Complete This Project

- [x] Connect To ActiveMQ
  - [x] Reinitialize after disconnection
- [x] Deploy Fat Jar File
- [x] Message Serialization
  - [x] Deserialize Message
  - [x] Serialize Message to Mongodb
- [x] Live Message Handler (ActiveMQ Topics)
  - [x] Send Live Message
  - [x] Calculate Last Message's Time
- [x] Logger Into File
  - [x] File Rolling
- [x] Mongodb Database
  - [x] Reinitialize After Disconnection
  - [x] Write Time Based Data
- [x] Adding an embedded job scheduler to program
  - [x] install and run it
  - [x] check for api call to kill the process
  - [x] add java process manager to handle and run connector.jar file
- [ ] Process Manager In AVIData
  - [x] Add the Connector Process
  - [x] Manage to Read the Latest Status From Ignite
  - [x] Add Depth Base / Comment Writer To Program
  - [x] Add Recreate Jobs To The Web Configuration
  - [ ] Check Live Data by Send Health Check
- [x] Separate Project in Different Path
- [x] Change Memory Catch to Redis
  - [x] Change In Connectors (JAVA)
  - [x] Change In AVIData (C#)
  - [x] Test Connections In Windows
- [x] Deploy
  - [x] Deploy Jar Files With Batch File
  - [x] Separate Lib Files From Con_Data
  -  ~~Add Installer With ENV~~
  - [x] Test On Windows Server
  - [x] Test On Real Environment
  - ~~Distribute ActiveMQ On Server~~
  - [x] Check for Distributed RAM

# General Notes

## Compile Projects

to compile and run jar file :

```shell
./gradlew  :con_data:build :con_data:jar
```

the files will be in the path `${project folder}/build/libs`.

# Build and Compile

## Test Well ID

to run system, the variable `MED_WELL_ID` should be initialized. The test value for that is equal to `2345415781` , `MED_QUEUE_NAME` is equal to `A_MF_DATA_VALUE`, and `MED_QUEUE_ADDRESS` is `tcp://localhost:61616`.

some environment variables for idea:

```shell
MED_QUEUE_NAME=A_MF_DATA_VALUE ;
MED_QUEUE_ADDRESS=tcp://127.0.0.1:61616 ;
MED_WELL_ID=2345415781 ;
MED_LOG_NAME=test

# common variables
MED_AMQ_PUB_SUB_ADDRESS=tcp://localhost:61616
MED_AMQ_PUB_SUB_NAME=msg.bus
MED_MONGO_CONN_STR=mongodb://localhost:27017
MED_MONGO_DB_NAME=AVIDb
MED_VERBOSE=true
```

## JobRunr Storage Providers:

There are two types of providers:

1. Mongo

```java
@Bean
public StorageProvider storageProvider() {
    var connectionString = new ConnectionString(CommonEnvironmentVariables.getMongoDbConnectionString());

    MongoClientSettings settings = MongoClientSettings.builder()
            .uuidRepresentation(UuidRepresentation.JAVA_LEGACY)
            .applyConnectionString(connectionString)
            .build();

    var mongoClient = MongoClients.create(settings);

    return new MongoDBStorageProvider(mongoClient);
}
```

2. InMemory

```java
@Bean
public StorageProvider storageProvider() {
    return new InMemoryStorageProvider();
}
```

## Build Project

to build the project `con_data` run the following commands:

```bash
# in build directory
java -cp "./lib_data/*:con_data-1.0.0-plain.jar" com.med.con_data.ConData
```

to build the project `con_manager` run the following commands:

```bash
# in build directory
java -cp "./lib_manager/*:con_manager-1.0.0-plain.jar" com.med.con_manager.ConManager
```

to deploy simply write the following command:

```bash
# to build the connector manager
make dm # or make deploy_manager

# to build the connector data
make dd # or make deploy_data
```

## Redis Connection Problem
By default, you can not connect to its port from another host, to connect from another host on **Windows** the port should be forwarded to port `6369`(the redis default port). To do that run the following command on Powershell or CMD: 

```shell
netsh interface portproxy add v4tov4 listenport=6380 listenaddress=0.0.0.0 connectport=6379 onnectaddress=127.0.0.1
```

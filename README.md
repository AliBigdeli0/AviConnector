# Steps To Complete This Project

- [x] Connect To ActiveMQ
  - [x] Reinitialize after disconnection
- [x] Deploy Fat Jar File
- [ ] Message Serialization
  - [ ] Deserialize Message
  - [ ] Serialize Message to Mongodb
- [ ] Live Message Handler (ActiveMQ Topics)
  - [x] Send Live Message
  - [ ] Calculate Last Message's Time
- [x] Logger Into File
  - [x] File Rolling
- [x] Mongodb Database
  - [x] Reinitialize After Disconnection
- [x] Adding an embedded job scheduler to program
  - [x] install and run it
  - [x] check for api call to kill the process
  - [x] add java process manager to handle and run connector.jar file
- [ ]  Process Manager In AVIData
   - [ ] Add the Connector Process
   - [ ] Manage to Read the Latest Status From Ignite
   - [ ] Add Handler To The Web Configuration
   - [ ] Check Live Data by Send Health Check
- [x] Separate Project in Different Path


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

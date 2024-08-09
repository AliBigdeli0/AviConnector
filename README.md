# Steps To Complete This Project

- [x] Connect To ActiveMQ
  - [x] Reinitialize after disconnection
- [x] Deploy Fat Jar File
- [ ] Message Serialization
  - [ ] Deserialize Message
  - [ ] Serialize Message to Mongodb
- [ ] Live Message Handler (Ignite)
  - [ ] Send Live Message
  - [ ] Calculate Last Message's Time
- [x] Logger Into File
  - [x] File Rolling
- [ ] Mongodb Database
  - [ ] Reinitialize After Disconnection
- [ ] Write a Process Manager In AVIData
  - [ ] Add the Connector Process
  - [ ] Manage to Read the Latest Status From Ignite
  - [ ] Add Handler To The Web Configuration
- [x] Separate Project in Different Path
-  [ ] Kubernetes Manager
  - [ ] Install Kubernetes 
  - [ ] Deploy Con Manager to send commands to kubernetes via API Calls

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
```

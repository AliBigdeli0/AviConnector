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
- [ ] Zookeeper Handler
  - [ ] Is it useful?
    - [ ] Handle Process Using Zookeeper
  - [ ] Test Zookeeper On Server
    - [ ] Test Balance Process after One Server Is Unavailable
  - [ ] Can I Handle the Process (close/open/manipulate) From Zookeeper
- [ ] Write a Process Manager In AVIData
  - [ ] Add the Connector Process
  - [ ] Manage to Read the Latest Status From Ignite
  - [ ] Add Handler To The Web Configuration

# General Notes

## Compile Project

go generate jar file run this code :

```shell
./gradlew clean build jar
```

the files will be in the path `${project folder}/build/libs`.

# Build and Compile

## Test Well ID

to run system, the variable `MED_WELL_ID` should be initialized. The test value for that is equal to `2345415781` , `MED_QUEUE_NAME` is equal to `A_MF_DATA_VALUE`, and `MED_QUEUE_ADDRESS` is `tcp://localhost:61616`

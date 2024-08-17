@echo off

set MED_IGNITE_ADDRESS=ignite.local:10800
set MED_AMQ_PUB_SUB_ADDRESS=tcp://localhost:61616
set MED_MONGO_CONN_STR=mongodb://localhost:27017

java -jar con_manager.1.0.0.jar
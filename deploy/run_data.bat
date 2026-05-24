@echo off 

set MED_LOG_NAME=AZ-20 
set MED_WELL_ID=3237357571
set MED_QUEUE_NAME=az_20_41
set MED_QUEUE_ADDRESS=tcp://192.168.8.100:61616

java -server -cp "./lib_data/*;con_data-1.0.0-plain.jar" com.med.con_data.ConData
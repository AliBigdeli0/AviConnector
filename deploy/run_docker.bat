@echo off 

set IMAGE_NAME=ubuntu_avi_connector

docker run -it --rm --privileged -v ".:/app" -e MED_LOG_NAME=test  ^
	-e MED_WELL_ID=2345415781  ^
	-e MED_QUEUE_NAME=A_MF_DATA_VALUE  ^
	-e MED_QUEUE_ADDRESS=tcp://192.168.8.100:61616  ^
	--name %IMAGE_NAME%_run %IMAGE_NAME% 
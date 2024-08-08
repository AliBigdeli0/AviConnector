
CONTAINER_NAME=ubuntu_avi_connector

##########################
## build container
docker_build::
	@docker build . -f Dockerfile -t $(CONTAINER_NAME)

docker_rm::
	@docker rmi $(CONTAINER_NAME) -f 

docker_run::
	@docker run -it --rm --privileged -v "$(PWD)/../build/libs/:/app" \
	-e MED_LOG_NAME=test  \
	-e MED_WELL_ID=2345415781  \
	-e MED_QUEUE_NAME=A_MF_DATA_VALUE  \
	-e MED_QUEUE_ADDRESS=tcp://10.10.10.101:61616  \
	--name $(CONTAINER_NAME)_run $(CONTAINER_NAME)
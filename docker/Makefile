
CONTAINER_NAME=ubuntu_avi_connector

##########################
## build container
docker_build::
	@docker build . -f Dockerfile -t $(CONTAINER_NAME)

docker_rm::
	@docker rmi $(CONTAINER_NAME) -f 

docker_run::
	@docker run -it --rm --privileged -v $(PWD)/../build/libs/:/app --name $(CONTAINER_NAME)_run $(CONTAINER_NAME)
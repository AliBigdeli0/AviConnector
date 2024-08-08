
CONTAINER_NAME=ubuntu_avi_connector
JAR_NAME=connector-1.0.0.jar
DEPLOY_PATH=~/Desktop/share/update_med/updates
BUILD_PATH=$(PWD)/../build
TASK_RUN_FILE_PATH=$(BUILD_PATH)/../docker/task_run.sh
RUN_DOCKER_FILE_PATH=$(BUILD_PATH)/../docker/run_docker.bat
RUN_FILE_PATH=$(BUILD_PATH)/../docker/run.bat
##########################
## deploy package

deploy_container:: deploy_jar
	@docker save -o $(BUILD_PATH)/$(CONTAINER_NAME).tar $(CONTAINER_NAME):latest
	@cd $(BUILD_PATH); 7z a -t7z -mx=9 all_$(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar $(BUILD_PATH)/libs/$(JAR_NAME) $(TASK_RUN_FILE_PATH) $(RUN_DOCKER_FILE_PATH) $(RUN_FILE_PATH); \
		7z a -t7z -mx=9 $(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar; \
		rm -rf $(DEPLOY_PATH)/all_$(CONTAINER_NAME).7z  $(DEPLOY_PATH)/$(CONTAINER_NAME).tar $(CONTAINER_NAME).tar  ; \
		mv all_$(CONTAINER_NAME).7z $(CONTAINER_NAME).7z  $(DEPLOY_PATH) \
		

deploy_jar:: 
	@cd $(BUILD_PATH)/..; sudo rm -rf build; ./gradlew build jar; rm -rf $(DEPLOY_PATH)/$(JAR_NAME) ; \
	cp ./build/libs/$(JAR_NAME)  $(DEPLOY_PATH)

copy_task_run::
	@cp $(TASK_RUN_FILE_PATH) $(BUILD_PATH)/libs

##########################
## build container
docker_build::
	@docker build . -f Dockerfile -t $(CONTAINER_NAME)

docker_rm::
	@docker rmi $(CONTAINER_NAME) -f 

docker_run:: copy_task_run
	@docker run -it --rm --privileged -v "$(BUILD_PATH)/libs/:/app" \
	-e MED_LOG_NAME=test  \
	-e MED_WELL_ID=2345415781  \
	-e MED_QUEUE_NAME=A_MF_DATA_VALUE  \
	-e MED_QUEUE_ADDRESS=tcp://10.10.10.101:61616  \
	--name $(CONTAINER_NAME)_run $(CONTAINER_NAME)
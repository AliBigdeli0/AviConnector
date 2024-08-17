# nemes
CONTAINER_NAME=ubuntu_avi_connector
JAR_DATA_NAME=con_data-1.0.0-plain.jar
JAR_MANAGER_NAME=con_manager-1.0.0-plain.jar

# paths
DEPLOY_PATH=~/Desktop/share/update_med/updates


BUILD_DATA_PATH=$(PWD)/../con_data/build
LIB_DATA_PATH=$(BUILD_DATA_PATH)/lib_data
RUN_DATA_FILE_PATH=$(PWD)/run_data.bat

BUILD_MANAGER_PATH=$(PWD)/../con_manager/build
LIB_MANAGER_PATH=$(BUILD_MANAGER_PATH)/lib_manager
RUN_MANAGER_FILE_PATH=$(PWD)/run_manager.bat

TASK_DATA_FILE_PATH=$(PWD)/task_run.sh
RUN_DOCKER_FILE_PATH=$(PWD)/run_docker.bat

# commands
ZIP=7z a -t7z -mx=9
REMOVE=rm -rf
MOVE=mv 
COPY=cp
##########################
## deploy package

# con_manager
deploy_con_manager_jar::
	@cd $(BUILD_MANAGER_PATH)/../..; 																												\
	./build_all.sh ; ./build_copy_con_data.sh ;																										\
	cd $(BUILD_MANAGER_PATH);																														\
	$(REMOVE) $(JAR_MANAGER_NAME).7z $(DEPLOY_PATH)/$(JAR_MANAGER_NAME).7z;																			\
	$(ZIP) $(JAR_MANAGER_NAME).7z ./libs/$(JAR_MANAGER_NAME) $(LIB_MANAGER_PATH) $(RUN_MANAGER_FILE_PATH)  $(JAR_DATA_NAME) $(LIB_DATA_PATH);		\
	$(MOVE) $(JAR_MANAGER_NAME).7z $(DEPLOY_PATH)		


# con_data
deploy_con_data_container:: deploy_con_data_jar
	@docker save -o $(BUILD_DATA_PATH)/$(CONTAINER_NAME).tar $(CONTAINER_NAME):latest
	@cd $(BUILD_DATA_PATH);  																																					\ 
	 $(ZIP) all_$(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar $(BUILD_DATA_PATH)/libs/$(JAR_DATA_NAME) $(TASK_DATA_FILE_PATH) $(RUN_DOCKER_FILE_PATH) $(RUN_DATA_FILE_PATH); 		\
	 $(ZIP) $(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar; 																														\
	 $(REMOVE) $(DEPLOY_PATH)/all_$(CONTAINER_NAME).7z  $(DEPLOY_PATH)/$(CONTAINER_NAME).tar $(CONTAINER_NAME).tar  ; 															\
	 $(MOVE) all_$(CONTAINER_NAME).7z $(CONTAINER_NAME).7z  $(DEPLOY_PATH);
		
deploy_con_data_jar::
	@cd $(BUILD_DATA_PATH)/../.. ;																							\
	./gradlew clean build jar;																								\
	cd $(BUILD_DATA_PATH)																									\
	$(REMOVE) $(DEPLOY_PATH)/$(JAR_DATA_NAME).7z ; 																			\
	$(ZIP) $(JAR_DATA_NAME).7z 	$(BUILD_DATA_PATH)/libs/$(JAR_DATA_NAME) $(LIB_DATA_PATH) $(RUN_DATA_FILE_PATH);			\
	$(COPY) $(JAR_DATA_NAME).7z $(DEPLOY_PATH)

copy_con_data_task_run::
	@$(COPY) $(TASK_DATA_FILE_PATH) $(BUILD_DATA_PATH)/libs
	@chmod +x $(BUILD_DATA_PATH)/libs/task_run.sh

##########################
## build container
docker_con_data_build::
	@docker build . -f Dockerfile -t $(CONTAINER_NAME)

docker_con_data_rm::
	@docker rmi $(CONTAINER_NAME) -f 

docker_con_data_run:: copy_con_data_task_run
	docker run -it --rm --privileged -v "$(BUILD_DATA_PATH)/libs/:/app" 	\
	-e MED_LOG_NAME=test  													\
	-e MED_WELL_ID=2345415781  												\
	-e MED_QUEUE_NAME=A_MF_DATA_VALUE  										\
	-e MED_QUEUE_ADDRESS=tcp://10.10.10.101:61616  							\
	-e MED_AMQ_PUB_SUB_ADDRESS=tcp://10.10.10.101:61616 					\
	--name $(CONTAINER_NAME)_run $(CONTAINER_NAME)
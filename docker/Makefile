
CONTAINER_NAME=ubuntu_avi_connector
JAR_NAME=connector-1.0.0.jar
DEPLOY_PATH=~/Desktop/share/update_med/updates
##########################
## deploy package

deploy_container:: deploy_jar
	@docker save -o $(PWD)/../build/$(CONTAINER_NAME).tar $(CONTAINER_NAME):latest
	@cd $(PWD)/../build; 7z a -t7z -mx=9 all_$(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar ./libs/$(JAR_NAME); \
		7z a -t7z -mx=9 $(CONTAINER_NAME).7z  $(CONTAINER_NAME).tar ; \
		rm -rf $(DEPLOY_PATH)/all_$(CONTAINER_NAME).7z  $(DEPLOY_PATH)/$(CONTAINER_NAME).tar $(CONTAINER_NAME).tar  ; \
		mv all_$(CONTAINER_NAME).7z $(CONTAINER_NAME).7z  $(DEPLOY_PATH) \
		

deploy_jar:: 
	cd $(PWD)/../; sudo rm -rf build; ./gradlew build jar; rm -rf $(DEPLOY_PATH)/$(JAR_NAME) ; \
	cp ./build/libs/$(JAR_NAME)  $(DEPLOY_PATH)

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
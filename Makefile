DEPLOY_PATH="deploy"

# deploys


dm:: deploy_manager
deploy_manager::
	@cd $(DEPLOY_PATH); make deploy_con_manager_jar;

dd:: deploy_data
deploy_data::
	@cd $(DEPLOY_PATH); make deploy_con_data_jar;
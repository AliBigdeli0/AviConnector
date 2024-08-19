
BUILD_PATH=$(PWD)/../../../build/resources
STATIC_PATH=$(BUILD_PATH)/main/static
# jobs 

compile_webpack::
	@npx webpack --config webpack.config.js
	@rm -rf $(STATIC_PATH)/**/*
	@mkdir -p $(STATIC_PATH)/
	@cp -r $(PWD)/../resources/static/* $(STATIC_PATH)/


run_browser::
	@echo nothing

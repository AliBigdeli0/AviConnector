
BUILD_PATH=$(PWD)/../../../build/resources
STATIC_PATH=$(BUILD_PATH)/main/static
# jobs 
.PHONY: cw os open_selenimum compile_webpack

open_selenimum:: compile_webpack
	@npx node ./test/home_test.mjs

cw:: compile_webpack
os:: open_selenimum

compile_webpack::
	@npx webpack --config webpack.config.js
	@rm -rf $(STATIC_PATH)/**/*
	@mkdir -p $(STATIC_PATH)/
	@cp -r $(PWD)/../resources/static/* $(STATIC_PATH)/

run_browser::
	@echo nothing

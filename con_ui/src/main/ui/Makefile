
BUILD_PATH=$(PWD)/../../../build/resources
STATIC_PATH=$(BUILD_PATH)/main/static
# jobs 
.PHONY: cw os open_selenimum compile_webpack

cw:: compile_webpack
os:: open_selenimum


open_selenimum:: compile
	@npx node ./test/home_test.mjs

compile:: proto_compile compile_webpack

compile_webpack::
	@npx webpack --config webpack.config.js
	@rm -rf $(STATIC_PATH)/**/*
	@mkdir -p $(STATIC_PATH)/
	@cp -r $(PWD)/../resources/static/* $(STATIC_PATH)/

run_browser::
	@echo nothing

proto_compile::	
	@docker run --rm -v ./:/work znly/protoc \
		--js_out=import_style=commonjs,binary:/work/src/proto_out \
		--proto_path=/work/proto/ /work/proto/version.proto
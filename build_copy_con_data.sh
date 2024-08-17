#!/bin/bash

rm -rf $PWD/con_manager/build/con_data-1.0.0.jar

$PWD/gradlew build jar

cp $PWD/con_data/build/libs/con_data-1.0.0.jar $PWD/con_manager/build

echo CON_DATA BUILD DONE!
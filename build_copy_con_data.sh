#!/bin/bash

rm -rf $PWD/con_manager/build/con_data-1.0.0-plain.jar
rm -rf $PWD/con_manager/build/data/lib_data/
mkdir -p $PWD/con_manager/build/data/lib_data
$PWD/gradlew build jar

cp $PWD/con_data/build/libs/con_data-1.0.0-plain.jar $PWD/con_manager/build/data
cp $PWD/con_data/build/lib_data/* $PWD/con_manager/build/data/lib_data/

echo CON_DATA BUILD DONE!
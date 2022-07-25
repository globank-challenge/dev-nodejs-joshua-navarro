#!/bin/bash

option="--attach $2"

if [ "$1" != "exercise-1" ]; then
  option="$option --attach cockroachdb";
fi

docker-compose -f ./docker-compose.$1.test.yaml up --build $option && docker-compose -f ./docker-compose.$1.test.yaml down



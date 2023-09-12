#!/bin/bash

if [ "$1" == "run" ]; then
    npm run exec
elif [ "$1" == "test" ]; then
    npm run test
else
    echo "Usage: spi.sh [run|test]"
fi

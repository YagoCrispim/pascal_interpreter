#!/bin/bash

if [ "$1" == "run" ]; then
    npm run exec
elif [ "$1" == "test" ]; then
    echo "WIP"
else
    echo "Usage: spi.sh [run|test]"
fi

#!/bin/bash

CHECK=$(which circom)

if [ -z $CHECK ]; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "circom is not installed, installing v2.1.3 on Linux"
        sudo mv ./releases/2.1.3/circom-linux-amd64 /usr/local/bin/circom
        circom --help
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "circom is not installed, installing v2.1.3 on MacOS"
        sudo mv ./releases/2.1.3/circom-macos-amd64 /usr/local/bin/circom
        circom --help
    fi
else
    echo "circom is already installed, exiting"
    circom --help
fi


#!/bin/bash

VERSION="2.1.6"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "installing circom v2.1.6 on Linux"
        mkdir ~/bin
        cd ~/bin
        if [ -d "circom" ]; then
            rm -rf circom
        fi
        wget https://github.com/iden3/circom/releases/download/v${VERSION}/circom-linux-amd64
        mv circom-linux-amd64 circom
        chmod +x circom
        circom --help
        echo "installed circom, please make sure /home/${USER}/bin is in your PATH"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "installing circom v2.1.6 on MacOS"
        sudo mv ./releases/2.1.3/circom-macos-amd64 /usr/local/bin/circom
        circom --help
fi

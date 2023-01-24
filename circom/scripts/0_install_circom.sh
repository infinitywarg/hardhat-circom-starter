#!/bin/bash

CHECK=$(which circom)

if [ -z $CHECK ]
then
    echo "circom is not installed, installing v2.1.2"
    mv ../releases/2.1.2/circom /usr/local/bin
else
    echo "circom is already installed, exiting"
fi

circom --help
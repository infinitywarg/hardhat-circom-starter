#!/bin/bash

CIRCUIT_PATH="./circuits/"
BUILD_PATH="./build/"
PTAU_FINAL_PATH="./setup/PowersOfTau12_local_final.ptau"
VERIFIER_PATH="./contracts/verifiers/"


if [ -d "$BUILD_PATH" ]; then
    rm -r ${BUILD_PATH}
fi
mkdir -p ${BUILD_PATH}

if [ -d "$VERIFIER_PATH" ]; then
    rm -r ${VERIFIER_PATH}
fi
mkdir -p ${VERIFIER_PATH}

for f in $(find ${CIRCUIT_PATH}* -name '*.circom'); do
    FILE_FULLNAME=$(basename $f)
    FILE_BASENAME=$(basename $f .circom)

    echo -e "***************************************"
    echo -e compiling and building circuit ${FILE_FULLNAME}
    echo -e "***************************************"
    mkdir -p ${BUILD_PATH}${FILE_FULLNAME}/
    circom $f --wasm --r1cs --prime bn128 --output ${BUILD_PATH}${FILE_FULLNAME}
    mv ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}_js/${FILE_BASENAME}.wasm ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.wasm
    rm -r ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}_js/
    npx snarkjs plonk setup ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.r1cs ${PTAU_FINAL_PATH} ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.zkey
    npx snarkjs zkey export verificationkey ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.zkey ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.vkey.json


    echo -e "***************************************"
    echo -e exporting solidity verifier contract ${FILE_BASENAME}Verifier.sol
    echo -e "***************************************"
    npx snarkjs zkey export solidityverifier ${BUILD_PATH}${FILE_FULLNAME}/${FILE_BASENAME}.zkey ${VERIFIER_PATH}${FILE_BASENAME}Verifier.sol
    sed -i -e "s/PlonkVerifier/${FILE_BASENAME}Verifier/g" ${VERIFIER_PATH}${FILE_BASENAME}Verifier.sol
    echo -e exported to ${VERIFIER_PATH}${FILE_BASENAME}Verifier.sol
done
#!/bin/bash

CIRCUIT_PATH="./circuits/"
BUILD_PATH="./build/circuits/"
PTAU_FINAL_PATH="./setup/PowersOfTau16_local_final.ptau"
VERIFIER_PATH="./contracts/verifiers/"

if [ -d "$BUILD_PATH" ]; then
    rm -r ${BUILD_PATH}
fi
mkdir -p ${BUILD_PATH}

for f in $(find ${CIRCUIT_PATH}* -name '*.circom'); do
    FILE_FULLNAME=$(basename $f)
    FILE_BASENAME=$(basename $f .circom)
    BUILD_DIR=${BUILD_PATH}${FILE_BASENAME}

    echo ------------------------------------------------------------
    echo Building circuit: ${FILE_FULLNAME}
    echo ------------------------------------------------------------
    mkdir -p ${BUILD_DIR}/
    circom $f --wasm --r1cs --prime bn128 --output ${BUILD_DIR}/
    mv ${BUILD_DIR}/${FILE_BASENAME}_js/${FILE_BASENAME}.wasm ${BUILD_DIR}/${FILE_BASENAME}.wasm
    rm -r ${BUILD_DIR}/${FILE_BASENAME}_js/
    npx snarkjs plonk setup ${BUILD_DIR}/${FILE_BASENAME}.r1cs ${PTAU_FINAL_PATH} ${BUILD_DIR}/${FILE_BASENAME}.zkey
    npx snarkjs zkey export verificationkey ${BUILD_DIR}/${FILE_BASENAME}.zkey ${BUILD_DIR}/${FILE_BASENAME}.vkey.json
    npx snarkjs zkey export solidityverifier ${BUILD_DIR}/${FILE_BASENAME}.zkey ${BUILD_DIR}/${FILE_BASENAME}Verifier.sol
    sed -i -e "s/PlonkVerifier/${FILE_BASENAME}Verifier/g" ${BUILD_DIR}/${FILE_BASENAME}Verifier.sol
    cp ${BUILD_DIR}/${FILE_BASENAME}Verifier.sol ${VERIFIER_PATH}/${FILE_BASENAME}Verifier.sol
done
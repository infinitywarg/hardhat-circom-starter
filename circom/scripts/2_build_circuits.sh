#!/bin/bash

#check if circom2 is installed
#TBA

CIRCUIT_PATH="./circuits/"
BUILD_PATH="./build/"
PTAU_FINAL_PATH="./setup/PowersOfTau12_local_final.ptau"
#VERIFIER_PATH="./contracts/verifiers/"

rm -r ${BUILD_PATH}
mkdir -p ${BUILD_PATH}
#rm -r ${VERIFIER_PATH}
#mkdir -p ${VERIFIER_PATH}

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
    npx snarkjs plonk setup ${BUILD_PATH}$(basename $f)/$(basename $f .circom).r1cs ${PTAU_FINAL_PATH} ${BUILD_PATH}$(basename $f)/$(basename $f .circom).zkey
    npx snarkjs zkey export verificationkey ${BUILD_PATH}$(basename $f)/$(basename $f .circom).zkey ${BUILD_PATH}$(basename $f)/$(basename $f .circom).vkey.json
    #npx snarkjs zkey export solidityverifier ${BUILD_PATH}$(basename $f)/$(basename $f .circom).zkey ${VERIFIER_PATH}$(basename $f .circom)Verifier.sol
    #sed -i -e "s/PlonkVerifier/${FILE_BASENAME}Verifier/g" ${VERIFIER_PATH}$(basename $f .circom)Verifier.sol
done
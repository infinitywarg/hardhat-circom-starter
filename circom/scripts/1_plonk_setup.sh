#!/bin/bash

CONTRIBUTIONS=5
RANDOM_BEACON=0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
CURVE=bn128
CONSTRAINTS=12
PTAU_PATH="./setup/"
PTAU_PREFIX="PowersOfTau${CONSTRAINTS}_local_"

if [ -d "$PTAU_PATH" ]; then
   rm -rf ${PTAU_PATH}*
fi

echo "initiating local powersOfTau ceremony on curve ${CURVE} with max 2^${CONSTRAINTS}"
echo "WARNING: this trusted-setup ceremony is only for development and does not provide production grade security"
npx snarkjs powersoftau new ${CURVE} ${CONSTRAINTS} "${PTAU_PATH}${PTAU_PREFIX}0.ptau" -v

for ((i=1; i<=$CONTRIBUTIONS; i++)); do
   echo "Applying random contribution $i"
   echo "Old ptau file: ${PTAU_PATH}${PTAU_PREFIX}$(($i-1)).ptau ---> New ptau file: ${PTAU_PATH}${PTAU_PREFIX}${i}.ptau"
   npx snarkjs powersoftau contribute "${PTAU_PATH}${PTAU_PREFIX}$(($i-1)).ptau" "${PTAU_PATH}${PTAU_PREFIX}${i}.ptau" -n="contribution_0${i}" -v -e=$(openssl rand -base64 32)
done

echo "applying random beacon to local powersOfTau ceremony"
npx snarkjs powersoftau beacon "${PTAU_PATH}${PTAU_PREFIX}${CONTRIBUTIONS}.ptau" "${PTAU_PATH}${PTAU_PREFIX}beacon.ptau" ${RANDOM_BEACON} 10 -n="final_beacon"

echo "finalizing local powersOfTau ceremony"
npx snarkjs powersoftau prepare phase2 "${PTAU_PATH}${PTAU_PREFIX}beacon.ptau" "${PTAU_PATH}${PTAU_PREFIX}final.ptau" -v

echo "verifying local powersOfTau ceremony"
npx snarkjs powersoftau verify "${PTAU_PATH}${PTAU_PREFIX}final.ptau"
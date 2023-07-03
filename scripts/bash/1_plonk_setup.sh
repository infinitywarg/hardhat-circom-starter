#!/bin/bash

# CONTRIBUTIONS=3
RANDOM_BEACON=0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
CURVE=bn128
# CONSTRAINTS=16
LOCAL_PTAU_PATH="./setup/local/"
LOCAL_PTAU_PREFIX="powersOfTau_local_"
HERMEZ_PTAU_PATH="./setup/hermez/"

echo "Choose the powersOfTau ceremony to generate trusted-setup public parameters:"
echo "0. I want to run my own local trusted-setup"
echo "1. Polygon Hermez/zkEVM"
read CEREMONY

echo "How many constraints your circuits will have?"
echo "Please type a number between 10 and 28"
echo "The maximum constraints your circuits can have are 2^number"
read CONSTRAINTS


if [ "$CEREMONY" == 0 ]; then
   if [ -d "$LOCAL_PTAU_PATH" ]; then
      rm -rf ${LOCAL_PTAU_PATH}/PowersOfTau*
   fi
   echo "How many random contributions you need for local setup"
   echo "Please note higher the contributions, more time it will take for ceremony to complete"
   echo "Recommended contributions are between 3 to 10 for local testing"
   read CONTRIBUTIONS

   echo "initiating local powersOfTau ceremony on curve ${CURVE} with max 2^${CONSTRAINTS}"
   echo "WARNING: this trusted-setup ceremony is only for development and does not provide production grade security"
   npx snarkjs powersoftau new ${CURVE} ${CONSTRAINTS} "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}0.ptau" -v

   for ((i=1; i<=$CONTRIBUTIONS; i++)); do
      echo "Applying random contribution $i"
      echo "Old ptau file: ${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}$(($i-1)).ptau ---> New ptau file: ${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}${i}.ptau"
      npx snarkjs powersoftau contribute "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}$(($i-1)).ptau" "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}${i}.ptau" -n="contribution_0${i}" -v -e=$(openssl rand -base64 32)
      rm -rf "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}$(($i-1)).ptau"
   done

   echo "applying random beacon to local powersOfTau ceremony"
   npx snarkjs powersoftau beacon "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}${CONTRIBUTIONS}.ptau" "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}beacon.ptau" ${RANDOM_BEACON} 10 -n="final_beacon"
   rm -rf "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}${CONTRIBUTIONS}.ptau"

   echo "finalizing local powersOfTau ceremony"
   npx snarkjs powersoftau prepare phase2 "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}beacon.ptau" "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}final.ptau" -v
   rm -rf "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}beacon.ptau"

   echo "verifying local powersOfTau ceremony"
   npx snarkjs powersoftau verify "${LOCAL_PTAU_PATH}${LOCAL_PTAU_PREFIX}final.ptau"

   echo "ptau generation complete!"
elif [ "$CEREMONY" == 1 ]; then
   cd ${HERMEZ_PTAU_PATH}
   echo "downloading setup file with 2^20 constraints from Polygon Hermez/zkEVM setup ceremony"
   wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${CONSTRAINTS}.ptau
   mv powersOfTau28_hez_final_${CONSTRAINTS}.ptau powersOfTau_hez_final.ptau 
   echo "ptau download complete!"
fi



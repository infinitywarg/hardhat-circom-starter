pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/poseidon.circom"; 

// I know x0 & x1 such that their hash is public y
// without revealing x0 & x1

template Hasher() {
    signal input x[2];
    signal output y;
    y <== Poseidon(2)(x);
}

component main = Hasher();
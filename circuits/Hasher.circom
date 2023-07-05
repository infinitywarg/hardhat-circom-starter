pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/poseidon.circom"; 

// I know x0 & x1 such that their hash is public y
// without revealing x0 & x1

template Hasher() {
    signal input x[2];
    signal output y;
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== x[0];
    poseidon.inputs[1] <== x[1];
    y <== poseidon.out;
}

component main = Hasher();
pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/poseidon.circom"; 

// I know a such that hash of a is public b
// without revealing a

template Hash() {
    signal input a;
    signal input b;
    component hash = Poseidon(1);
    hash.inputs[0] <== a;
    b === hash.out;
}

component main {public [b]} = Hash();
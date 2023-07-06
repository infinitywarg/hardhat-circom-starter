pragma circom 2.1.6;

template Square() {
    signal input in;
    signal output out;
    out <== in * in;
}
pragma circom 2.2.0;

template Square() {
    signal input in;
    signal output out;
    out <== in * in;
}
pragma circom 2.2.0;

// I know a, b and c such that a*b=c
// withut revealing a, b or c

template Multiplier() {
    signal input a;
    signal input b;
    signal output c;
    c <== a * b;
}

component main = Multiplier();

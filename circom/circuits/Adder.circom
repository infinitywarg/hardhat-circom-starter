pragma circom 2.1.2;

template Adder() {
    signal input a;
    signal input b;
    signal output c;
    c <== a + b;
}

component main = Adder();

pragma circom 2.1.6;

// I know a, b and c such that a square * b square = c square
// withut revealing a and b
// demonstrates composable circuit templates

template Square() {
    signal input in;
    signal output out;
    out <== in * in;
}

template Pythagoras() {
    signal input a;
    signal input b;
    signal output c2;

    component a2 = Square();
    a2.in <== a;
    component b2 = Square();
    b2.in <== b;

    c2 <== a2.out + b2.out;
}

component main = Pythagoras();

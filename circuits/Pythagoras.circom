pragma circom 2.1.6;

include "./templates/Square.circom";

// I know a, b and c such that a square * b square = c square
// withut revealing a and b
// demonstrates composable circuit templates

template Pythagoras() {
    signal input a;
    signal input b;
    signal input c2;

    component sqaure1 = Square();
    sqaure1.in <== a;
    component square2 = Square();
    square2.in <== b;

    c2 === sqaure1.out + square2.out;
}

component main {public [c2]} = Pythagoras();

pragma circom 2.1.6;

include "./templates/Square.circom";

// I know a, b and c such that a square * b square = c square
// withut revealing a and b
// demonstrates composable circuit templates

template Pythagoras() {
    signal input a;
    signal input b;
    signal input c2;

    signal a2 <== Square()(a);
    signal b2 <== Square()(b);
    c2 === a2 + b2;
}

component main {public [c2]} = Pythagoras();

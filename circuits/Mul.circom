pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/mux2.circom"; 
// include "../node_modules/circomlib/circuits/poseidon.circom"; 

template Mul() {
    signal input a;
    signal input b;
    signal output out;

    var scale = 1000000000000000000;

    assert(a < 147946756881789319005730692170996259609 );
    assert(b < 147946756881789319005730692170996259609 );

    signal a_sign <-- a % 10; //no constraint
    signal a_value <-- a / 10; //no constraint
    a === (a_value*10) + a_sign; // constrain

    signal b_sign <-- b % 10;
    signal b_value <-- b / 10;
    b === (b_value*10) + b_sign;

    signal out_value_scaled <== a_value*b_value;
    signal out_value <-- out_value_scaled / scale;
    out_value_scaled === out_value*scale;

        // assigning sign bit
    component mux = Mux2(); 
    mux.c[0] <== 0;
    mux.c[1] <== 1;
    mux.c[2] <== 1;
    mux.c[3] <== 0;

    mux.s[0] <== a_sign;
    mux.s[1] <== b_sign;
    
    signal out_sign <== mux.out;

    out <== (out_value*10) + out_sign;
}

component main = Mul();
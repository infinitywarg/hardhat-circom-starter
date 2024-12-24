pragma circom 2.2.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/escalarmulany.circom";
include "../../node_modules/circomlib/circuits/escalarmulfix.circom";

// templates for curve operations on BabyJubJub twisted edwards curve
// BabyJubJub is constructed on the same scalar field as that of pairing friendly zk curve BN254

template PointCheck() {
    signal input point[2];

    signal x2;
    signal y2;

    var a = 168700;
    var d = 168696;

    x2 <== point[0]*point[0];
    y2 <== point[1]*point[1];

    a*x2 + y2 === 1 + d*x2*y2;
}

template PointAdd() {
    signal input pointP[2];
    signal input pointQ[2];
    signal output outpoint[2];

    signal beta;
    signal gamma;
    signal delta;
    signal tau;

    var a = 168700;
    var d = 168696;

    beta <== pointP[0]*pointQ[1];
    gamma <== pointP[1]*pointQ[0];
    delta <== (-a*pointP[0]+pointP[1])*(pointQ[0] + pointQ[1]);
    tau <== beta * gamma;

    outpoint[0] <-- (beta + gamma) / (1+ d*tau);
    (1+ d*tau) * outpoint[0] === (beta + gamma);

    outpoint[1] <-- (delta + a*beta - gamma) / (1-d*tau);
    (1-d*tau)*outpoint[1] === (delta + a*beta - gamma);
}


template PointMulBase() {
    signal input scalar;
    signal output outpoint[2];

    // babyjub base point, ref: https://eips.ethereum.org/EIPS/eip-2494
    var BASE8[2] = [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];
    var i;

    component scalar_bits = Num2Bits(253);
    scalar_bits.in <== scalar;

    component mulFix = EscalarMulFix(253, BASE8);
    for (i=0; i<253; i++) {
        mulFix.e[i] <== scalar_bits.out[i];
    }
    outpoint[0]  <== mulFix.out[0];
    outpoint[1]  <== mulFix.out[1];
}

template PointMulAny() {
    signal input scalar;
    signal input inpoint[2];
    signal output outpoint[2];

    var i;

    component scalar_bits = Num2Bits(253);
    scalar_bits.in <== scalar;

    component mulAny = EscalarMulAny(253);
    for (i = 0; i < 253; i ++) {
        mulAny.e[i] <== scalar_bits.out[i];
    }
    mulAny.p[0] <== inpoint[0];
    mulAny.p[1] <== inpoint[1];

    outpoint[0] <== mulAny.out[0];
    outpoint[1] <== mulAny.out[1];
}
pragma circom 2.1.6;

include "./templates/BabyJubJub.circom"; 

// I know private key sk such that corresponding public key is pk
// without revealing privKey

template Pubkey() {
    signal input sk;
    signal output pk[2];
    component mulBase = PointMulBase();
    mulBase.scalar <== sk;
    pk[0] <== mulBase.outpoint[0];
    pk[1] <== mulBase.outpoint[1];
}

component main = Pubkey();
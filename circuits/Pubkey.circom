pragma circom 2.2.0;

include "./templates/BabyJubJub.circom"; 

// I know private key sk such that corresponding public key is pk
// without revealing privKey

template Pubkey() {
    signal input sk;
    signal output pk[2];
    pk <== PointMulBase()(sk);
}

component main = Pubkey();
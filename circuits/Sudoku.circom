pragma circom 2.1.3;

template NotEq(){
    signal input in0;
    signal input in1;
    signal inverse;
    inverse <-- 1 / (in0-in1);
    inverse * (in0-in1) === 1;
}

template Distinct(n) {
    signal input in[n];
    component CheckNotEq[n][n];
    for(var i=0; i<n; i++){
        for(var j=0; j<i; j++){
            CheckNotEq[i][j] = NotEq();
            CheckNotEq[i][j].in0 <== in[i];
            CheckNotEq[i][j].in1 <== in[j];
        }
    }
}

template Bits4() {
    signal input in;
    signal bits[4];
    var bitsum = 0;
    for(var i=0;i<4;i++){
            bits[i] <-- (in >> i) & i;
            bits[i] * (bits[i]-1) ===0;
            bitsum = bitsum + 2**i * bits[i];
    }
    bitsum === in;
}

template OneToNine() {
    signal input in;
    component lowerBound = Bits4();
    component upperBound = Bits4();
    lowerBound.in <== in - 1;
    upperBound.in <== in + 6;
}

template Sudoku(n) {
    signal input puzzle[n][n];
    signal input solution[n][n];


    component valuesInRange[n][n];
    component distinctValuesInRow[n];

    for(var i=0; i<n; i++){
        distinctValuesInRow[i] = Distinct(n);
        for(var j=0; j<n; j++){

            valuesInRange[i][j] = OneToNine();
            valuesInRange[i][j].in <== solution[i][j];

            puzzle[i][j] * (puzzle[i][j] - solution[i][j]) === 0;

            distinctValuesInRow[i].in[j] <== solution[i][j];

        }
    }


}

component main {public[puzzle]} = Sudoku(9);
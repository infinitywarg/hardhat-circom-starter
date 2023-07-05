import { readFileSync } from "fs";
import { resolve } from "path";
import { plonk } from "snarkjs";

export class Circuit {
	circuit: string;
	wasmPath: string;
	zkeyPath: string;
	vkey: any;

	constructor(circuit: string) {
		this.circuit = circuit;
		this.vkey = JSON.parse(
			readFileSync(resolve(__dirname, `../build/circuits/${circuit}/${circuit}.vkey.json`), `utf-8`)
		);
		this.zkeyPath = resolve(__dirname, `../build/circuits/${circuit}/${circuit}.zkey`);
		this.wasmPath = resolve(__dirname, `../build/circuits/${circuit}/${circuit}.wasm`);
	}

	async generateProof(inputs: any): Promise<any> {
		const { proof, publicSignals } = await plonk.fullProve(inputs, this.wasmPath, this.zkeyPath);
		let proofCalldata = await plonk.exportSolidityCallData(proof, publicSignals);
		proofCalldata = proofCalldata.split(",")[0].toString();
		return { proofJson: proof, proofCalldata: proofCalldata, publicSignals: publicSignals };
	}

	async verifyProof(proofJson: any, publicSignals: any): Promise<boolean> {
		const verify = await plonk.verify(this.vkey, publicSignals, proofJson);
		return verify;
	}
}

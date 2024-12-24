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
		const calldata: string = (await plonk.exportSolidityCallData(proof, publicSignals)).split("][");
		return {
			offchain: { proof: proof, publicSignals: publicSignals },
			onchain: { proof: JSON.parse(calldata[0] + "]"), publicSignals: JSON.parse("[" + calldata[1]) },
		};
	}

	async verifyProof(proofJson: any, publicSignals: any): Promise<boolean> {
		const verify = await plonk.verify(this.vkey, publicSignals, proofJson);
		return verify;
	}
}

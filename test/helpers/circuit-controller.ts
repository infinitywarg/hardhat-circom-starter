import { readFileSync } from "fs";
import { resolve } from "path";
import { plonk } from "snarkjs";

export class CircuitController {
	circuit: string;
	wasmPath: string;
	zkeyPath: string;
	vkey: any;

	constructor(circuit: string) {
		this.circuit = circuit;
		this.vkey = JSON.parse(
			readFileSync(resolve(__dirname, `../../build/circuits/${circuit}/${circuit}.vkey.json`), `utf-8`)
		);
		this.zkeyPath = resolve(__dirname, `../../build/circuits/${circuit}/${circuit}.zkey`);
		this.wasmPath = resolve(__dirname, `../../build/circuits/${circuit}/${circuit}.wasm`);
	}

	async generateProof(inputs: any): Promise<any> {
		const { proof, publicSignals } = await plonk.fullProve(inputs, this.wasmPath, this.zkeyPath);
		return { proof, publicSignals };
	}

	async verifyProof(proof: any, publicSignals: any): Promise<boolean> {
		const verify = await plonk.verify(this.vkey, publicSignals, proof);
		return verify;
	}
}

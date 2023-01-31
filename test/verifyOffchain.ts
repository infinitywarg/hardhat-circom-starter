import { readdirSync, readFileSync } from "fs";
import { expect } from "chai";
import { resolve } from "path";
import { plonk } from "snarkjs";

function vkey(circuit: string): any {
	return JSON.parse(readFileSync(resolve(__dirname, `../build/${circuit}.circom/${circuit}.vkey.json`), `utf-8`));
}

function wasm(circuit: string): any {
	return resolve(__dirname, `../build/${circuit}.circom/${circuit}.wasm`);
}

function zkey(circuit: string): any {
	return resolve(__dirname, `../build/${circuit}.circom/${circuit}.zkey`);
}

describe("plonk zksnark: test circuits off-chain", function () {
	it("Should verify Adder snark for valid signals", async function () {
		const input = { a: 12, b: 13 };
		const { proof, publicSignals } = await plonk.fullProve(input, wasm(`Adder`), zkey(`Adder`));
		const verify = await plonk.verify(vkey(`Adder`), publicSignals, proof);
		expect(verify).to.equal(true);
	});

	it("Should not verify Adder snark for invalid signals", async function () {
		const input = { a: 12, b: 13 };
		const { proof } = await plonk.fullProve(input, wasm(`Adder`), zkey(`Adder`));
		const publicSignals = ["41"];
		const verify = await plonk.verify(vkey(`Adder`), publicSignals, proof);
		expect(verify).to.equal(false);
	});

	it("Should verify Multiplier snark for valid signals", async function () {
		const input = { a: 12, b: 13 };
		const { proof, publicSignals } = await plonk.fullProve(input, wasm(`Multiplier`), zkey(`Multiplier`));
		const verify = await plonk.verify(vkey(`Multiplier`), publicSignals, proof);
		expect(verify).to.equal(true);
	});

	it("Should not Multiplier Adder snark for invalid signals", async function () {
		const input = { a: 12, b: 13 };
		const { proof } = await plonk.fullProve(input, wasm(`Multiplier`), zkey(`Multiplier`));
		const publicSignals = ["157"];
		const verify = await plonk.verify(vkey(`Multiplier`), publicSignals, proof);
		expect(verify).to.equal(false);
	});
});

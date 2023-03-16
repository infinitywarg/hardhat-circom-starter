import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CircuitController } from "./helpers/circuit-controller";

describe("Verify zk-snarks offchain on node.js", function () {
	describe("Hash Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {
			const hasher = new CircuitController("Hasher");
			const inputs = { x: ["176426142782481314447", "977978797979713415341325"] };
			const { proof, publicSignals } = await hasher.generateProof(inputs);
			console.log(`correct publicSignals: ${JSON.stringify(publicSignals)}`);
			const verify = await hasher.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});
		it("Should not verify zk-snark for incorrect signals", async function () {
			const hasher = new CircuitController("Hasher");
			const inputs = { x: ["176426142782481314447", "977978797979713415341325"] };
			const { proof, publicSignals } = await hasher.generateProof(inputs);
			const incorrectPublicSignals = publicSignals.map((signal: any) => signal + 1);
			console.log(`incorrect publicSignals: ${JSON.stringify(incorrectPublicSignals)}`);
			const verify = await hasher.verifyProof(proof, incorrectPublicSignals);
			expect(verify).to.be.false;
		});
	});

	describe("Multiplier Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {
			const multiplier = new CircuitController("Multiplier");
			const inputs = { a: "12", b: "13" };
			const { proof, publicSignals } = await multiplier.generateProof(inputs);
			console.log(`correct publicSignals: ${JSON.stringify(publicSignals)}`);
			const verify = await multiplier.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});
		it("Should not verify zk-snark for incorrect signals", async function () {
			const multiplier = new CircuitController("Multiplier");
			const inputs = { a: "12", b: "13" };
			const { proof, publicSignals } = await multiplier.generateProof(inputs);
			const incorrectPublicSignals = publicSignals.map((signal: any) => signal + 1);
			console.log(`incorrect publicSignals: ${JSON.stringify(incorrectPublicSignals)}`);
			const verify = await multiplier.verifyProof(proof, incorrectPublicSignals);
			expect(verify).to.be.false;
		});
	});

	describe("Pythagoras Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {
			const pythagoras = new CircuitController("Pythagoras");
			const inputs = { a: "11", b: "31" };
			const { proof, publicSignals } = await pythagoras.generateProof(inputs);
			console.log(`correct publicSignals: ${JSON.stringify(publicSignals)}`);
			const verify = await pythagoras.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});
		it("Should not verify zk-snark for incorrect signals", async function () {
			const pythagoras = new CircuitController("Pythagoras");
			const inputs = { a: "11", b: "31" };
			const { proof, publicSignals } = await pythagoras.generateProof(inputs);
			const incorrectPublicSignals = publicSignals.map((signal: any) => signal + 1);
			console.log(`incorrect publicSignals: ${JSON.stringify(incorrectPublicSignals)}`);
			const verify = await pythagoras.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});
	});
});

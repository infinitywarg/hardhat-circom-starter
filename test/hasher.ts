import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Circuit } from "../utils/Circuit";
import { randomField, poseidon } from "../utils/Circomlib";
import { HasherVerifier, HasherVerifier__factory } from "../typechain-types";

describe("Hasher circuit tests", function () {
	const deployVerifier = async () => {
		const [deployer, relayer] = await ethers.getSigners();
		const Verifier: HasherVerifier__factory = await ethers.getContractFactory("HasherVerifier", deployer);
		const verifier: HasherVerifier = await Verifier.deploy();
		await verifier.deployed();
		// console.log(`Verifier contract deployed to ${verifier.address}`);
		return { verifier, deployer, relayer };
	};

	describe("Verify Offchain", function () {
		it("Should verify the zksnark for correct signals", async function () {
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { proofJson, publicSignals } = await Hasher.generateProof({ x: x });
			let verify;
			verify = await Hasher.verifyProof(proofJson, publicSignals);
			expect(verify).to.be.true;
			const y: string = await poseidon(x);
			verify = await Hasher.verifyProof(proofJson, [y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect signals", async function () {
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { proofJson } = await Hasher.generateProof({ x: x });
			const verify = await Hasher.verifyProof(proofJson, [randomField()]);
			expect(verify).to.be.false;
		});
	});

	describe("Verify Onchain", function () {
		it("Should verify the zksnark for correct signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { proofCalldata, publicSignals } = await Hasher.generateProof({ x: x });
			let verify;
			verify = await verifier.connect(relayer).verifyProof(proofCalldata, publicSignals);
			expect(verify).to.be.true;
			const y: string = await poseidon(x);
			verify = await verifier.connect(relayer).verifyProof(proofCalldata, [y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { proofCalldata } = await Hasher.generateProof({ x: x });
			const verify = await verifier.connect(relayer).verifyProof(proofCalldata, [randomField()]);
			expect(verify).to.be.false;
		});
	});
});

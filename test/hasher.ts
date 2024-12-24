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
		console.log(`Verifier contract deployed to ${verifier.address} from deployer ${deployer.address}`);
		return { verifier, deployer, relayer };
	};

	describe("Verify Offchain in Typescript", function () {
		it("Should verify the zksnark for correct witness & circom-generated public signals", async function () {
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { offchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = offchain;
			let verify;
			verify = await Hasher.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});

		it("Should verify the zksnark for correct witness & typescript-generated public signals", async function () {
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { offchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = offchain;
			let verify;
			const y: string = await poseidon(x);
			verify = await Hasher.verifyProof(proof, [y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect witness", async function () {
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { offchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = offchain;
			const verify = await Hasher.verifyProof(proof, [randomField()]);
			expect(verify).to.be.false;
		});
	});

	describe("Verify Onchain in Solidity", function () {
		it("Should verify the zksnark for correct witness & circom-generated public signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { onchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = onchain;
			let verify;
			verify = await verifier.connect(relayer).verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});

		it("Should verify the zksnark for correct witness & typescript-generated public signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { onchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = onchain;
			let verify;
			const y: string = await poseidon(x);
			verify = await verifier.connect(relayer).verifyProof(proof, [y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect witness", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Hasher = new Circuit("Hasher");
			const x: string[] = [randomField(), randomField()];
			const { onchain } = await Hasher.generateProof({ x: x });
			const { proof, publicSignals } = onchain;
			const verify = await verifier.connect(relayer).verifyProof(proof, [randomField()]);
			expect(verify).to.be.false;
		});
	});
});

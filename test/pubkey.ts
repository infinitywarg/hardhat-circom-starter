import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Circuit } from "../utils/Circuit";
import { randomField, pointMulBase, BabyJubJubPoint } from "../utils/Circomlib";
import { PubkeyVerifier, PubkeyVerifier__factory } from "../typechain-types";

describe("Pubkey circuit tests", function () {
	const deployVerifier = async () => {
		const [deployer, relayer] = await ethers.getSigners();
		const Verifier: PubkeyVerifier__factory = await ethers.getContractFactory("PubkeyVerifier", deployer);
		const verifier: PubkeyVerifier = await Verifier.deploy();
		await verifier.deployed();
		// console.log(`Verifier contract deployed to ${verifier.address}`);
		return { verifier, deployer, relayer };
	};

	describe("Verify Offchain", function () {
		it("Should verify the zksnark for correct witness & circom-generated public signals", async function () {
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).offchain;
			let verify;
			verify = await Pubkey.verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});

		it("Should verify the zksnark for correct witness & typescript-generated public signals", async function () {
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).offchain;
			let verify;
			const pk: BabyJubJubPoint = await pointMulBase(sk);
			verify = await Pubkey.verifyProof(proof, [pk.x, pk.y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect witness", async function () {
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).offchain;
			const verify = await Pubkey.verifyProof(proof, [randomField(), randomField()]);
			expect(verify).to.be.false;
		});
	});

	describe("Verify Onchain", function () {
		it("Should verify the zksnark for correct witness & circom-generated public signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).onchain;
			let verify;
			verify = await verifier.connect(relayer).verifyProof(proof, publicSignals);
			expect(verify).to.be.true;
		});

		it("Should verify the zksnark for correct witness & typescript-generated public signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).onchain;
			let verify;
			const pk: BabyJubJubPoint = await pointMulBase(sk);
			verify = await verifier.connect(relayer).verifyProof(proof, [pk.x, pk.y]);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect witness", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Pubkey = new Circuit("Pubkey");
			const sk: string = randomField();
			const { proof, publicSignals } = (await Pubkey.generateProof({ sk: sk })).onchain;
			const verify = await verifier.connect(relayer).verifyProof(proof, [randomField(), randomField()]);
			expect(verify).to.be.false;
		});
	});
});

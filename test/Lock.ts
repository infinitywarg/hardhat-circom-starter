import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { readdirSync } from "fs";
import { resolve } from "path";
import { plonk } from "snarkjs";

const { utils } = ethers;

async function generateProof(name: string, input: any): Promise<any> {
	const circuit = name.slice(0, -8);
	let { proof, publicSignals } = await plonk.fullProve(
		input,
		resolve(__dirname, `../../circom/build/${circuit}.circom/${circuit}.wasm`),
		resolve(__dirname, `../../circom/build/${circuit}.circom/${circuit}.zkey`)
	);
	const calldata = await plonk.exportSolidityCallData(proof, publicSignals);
	console.log({ proof: proof, publicSignals: publicSignals });
	const publicSignalsCalldata = publicSignals.map((s: any) => {
		return utils.hexZeroPad(utils.hexlify(parseInt(s)), 32);
	});
	console.log({ proofCalldata: calldata.split(",")[0], publicSignalsCalldata: publicSignalsCalldata });
	return { proofCalldata: calldata.split(",")[0], publicSignalsCalldata: publicSignalsCalldata };
}

describe("plonk zk-snark tests", function () {
	async function deployFixture() {
		const [deployer] = await ethers.getSigners();
		let Verifier;
		let verifier;
		let verifierList: string[] = readdirSync(resolve(__dirname, `../contracts/verifiers`));
		let contractListPromises = verifierList.map(async (v) => {
			let name = v.split(".")[0];
			Verifier = await ethers.getContractFactory(name, deployer);
			verifier = await Verifier.deploy();
			await verifier.deployed();
			console.log(`${name} deployed to ${verifier.address}`);
			return { name: name, contract: verifier };
		});
		let contractList = await Promise.all(contractListPromises);

		return { contractList };
	}

	describe("plonk zk-snarks verification", function () {
		it("Should prove the Adder snark for valid signals", async function () {
			const { contractList } = await loadFixture(deployFixture);
			const { name, contract } = contractList.filter((c) => {
				return c.name === "AdderVerifier";
			})[0];
			const input = { a: 12, b: 13 };
			const { proofCalldata, publicSignalsCalldata } = await generateProof(name, input);
			const verify = await contract.verifyProof(proofCalldata, publicSignalsCalldata);
			expect(verify).to.equal(true);
		});

		it("Should prove the Multiplier snark for valid signals", async function () {
			const { contractList } = await loadFixture(deployFixture);
			const { name, contract } = contractList.filter((c) => {
				return c.name === "MultiplierVerifier";
			})[0];
			const input = { a: 12, b: 13 };
			const { proofCalldata, publicSignalsCalldata } = await generateProof(name, input);
			const verify = await contract.verifyProof(proofCalldata, publicSignalsCalldata);
			expect(verify).to.equal(true);
		});
	});
});

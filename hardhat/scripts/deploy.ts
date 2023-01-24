import { ethers } from "hardhat";
import { readdirSync } from "fs";
import { resolve } from "path";

async function main() {
	const [deployer] = await ethers.getSigners();
	let Verifier;
	let verifier;
	let verifierList: string[] = readdirSync(resolve(__dirname, `../contracts/verifiers`));
	verifierList = verifierList.map((v) => {
		return v.split(".")[0];
	});
	verifierList.forEach(async (v) => {
		Verifier = await ethers.getContractFactory(v, deployer);
		verifier = await Verifier.deploy();
		await verifier.deployed();
		console.log(`${v} deployed to ${verifier.address}`);
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

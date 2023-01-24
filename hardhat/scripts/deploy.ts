import { ethers } from "hardhat";
import { readdirSync } from "fs";
import { resolve } from "path";

async function main() {
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
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

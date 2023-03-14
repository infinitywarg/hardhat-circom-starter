import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Verify zk-snarks offchain on node.js", function () {
	describe("Hash Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {});
		it("Should not verify zk-snark for incorrect signals", async function () {});
	});

	describe("Multiplier Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {});
		it("Should not verify zk-snark for incorrect signals", async function () {});
	});

	describe("Pythagoras Circuit", function () {
		it("Should verify zk-snark for correct signals", async function () {});
		it("Should not verify zk-snark for incorrect signals", async function () {});
	});
});

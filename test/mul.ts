import { expect } from "chai";
import { Circuit } from "../utils/Circuit";

describe("Mul circuit tests", function () {
	describe("Verify Offchain", function () {
		it("Should verify the zksnark for correct signals", async function () {
			const Mul = new Circuit("Mul");

			const a = "123456789444440000000000"; // +12345.678944444000000000
			const b = "987656789444440000000000"; // +98765.678944444000000000

			const { proofJson, publicSignals } = await Mul.generateProof({ a: a, b: b });
			let verify;
			verify = await Mul.verifyProof(proofJson, publicSignals);
			console.log(proofJson);
			console.log(publicSignals);
			expect(verify).to.be.true;
			const out = "12193293629781383980384691360";
			verify = await Mul.verifyProof(proofJson, [out]);
			expect(verify).to.be.true;
		});

		// it("Should not verify zk-snark for incorrect signals", async function () {
		// 	const Hasher = new Circuit("Hasher");
		// 	const x: string[] = [randomField(), randomField()];
		// 	const { proofJson } = await Hasher.generateProof({ x: x });
		// 	const verify = await Hasher.verifyProof(proofJson, [randomField()]);
		// 	expect(verify).to.be.false;
		// });
	});
});

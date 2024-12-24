import { randomBytes } from "crypto";
import { buildBabyjub, buildPoseidon } from "circomlibjs";
import { Scalar } from "ffjavascript";

// constrain x and y points to BabyJubJub scalar field
export type BabyJubJubPoint = {
	x: string;
	y: string;
};

export const randomField = (): string => {
	// return Scalar.e(BigInt(`0x${randomBytes(31).toString("hex")}`).toString()).toString();
	const random = BigInt(`0x${randomBytes(32).toString("hex")}`) >> BigInt(4);
	return `0x${random.toString(16).padStart(64, "0")}`;
};

export const poseidon = async (inputs: string[]) => {
	const poseidon = await buildPoseidon();
	const field = poseidon.F;
	const result = poseidon(inputs);
	return field.toObject(result).toString();
};

// export const pointAdd = (point1: BabyJubJubPoint, point2: BabyJubJubPoint): Promise<BabyJubJubPoint> => {};

export const pointMulBase = async (scalar: string): Promise<BabyJubJubPoint> => {
	const babyjubjub = await buildBabyjub();
	const field = babyjubjub.F;
	const base8 = [
		field.e("5299619240641551281634865583518297030282874472190772894086521144482721001553"),
		field.e("16950150798460657717958625567821834550301663161624707787222815936182638968203"),
	];
	const result = babyjubjub.mulPointEscalar(base8, scalar);
	return { x: field.toObject(result[0]).toString(), y: field.toObject(result[1]).toString() };
};

// export const pointMulAny = (point: BabyJubJubPoint, scalar: string): Promise<BabyJubJubPoint> => {};

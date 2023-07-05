import { randomBytes } from "crypto";
import { buildBabyjub, buildPoseidon } from "circomlibjs";
import { Scalar } from "ffjavascript";

// constrain x and y points to scalar field
type BabyJubJubPoint = {
	x: string;
	y: string;
};

export const randomField = (): string => {
	return Scalar.e(BigInt(`0x${randomBytes(31).toString("hex")}`).toString()).toString();
};

export const poseidon = async (inputs: string[]) => {
	const poseidon = await buildPoseidon();
	const poseidonField = poseidon.F;
	const hashResult = poseidon(inputs);
	return poseidonField.toObject(hashResult).toString();
};

// export const pointAdd = (point1: BabyJubJubPoint, point2: BabyJubJubPoint): Promise<BabyJubJubPoint> => {};

// export const pointMulBase = (point: BabyJubJubPoint): Promise<BabyJubJubPoint> => {};

// export const pointMulAny = (point: BabyJubJubPoint, scalar: string): Promise<BabyJubJubPoint> => {};

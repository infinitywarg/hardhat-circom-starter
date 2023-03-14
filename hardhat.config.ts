import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
		},
		localhost: {
			chainId: 31337,
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.8.9",
			},
		],
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./build/cache",
		artifacts: "./build/artifacts",
	},
	mocha: {
		timeout: 180000, // 3 mins max for running tests
	},
};

export default config;

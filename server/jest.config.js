const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/src/__tests__/setup-env.ts'],
	testMatch: ['**/__tests__/**/*.test.ts'],
	transform: {
		...tsJestTransformCfg,
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	roots: ['<rootDir>/src'],
	maxWorkers: 1,
};

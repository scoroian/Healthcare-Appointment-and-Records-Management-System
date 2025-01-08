/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/*.spec.ts"],
  modulePathIgnorePatterns: ["<rootDir>/src/config/environment"],
};

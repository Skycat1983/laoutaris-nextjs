// file: jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // <= setup file here
  testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@ui/(.*)$": "<rootDir>/src/components/ui/$1",
    "^@loaders/(.*)$": "<rootDir>/src/components/loaders/$1",
  },
};

module.exports = createJestConfig(customJestConfig);

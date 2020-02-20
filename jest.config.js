/* eslint-disable */
const tsconfig = require("./tsconfig.json");
const { escapeRegExp, toPairs, fromPairs } = require("lodash");
const { paths } = tsconfig.compilerOptions;

const keyToRegexp = key => `^${escapeRegExp(key).replace("\\*", "(.*)")}$`;
const valueToPathMatcher = ([value]) => value.replace("*", "$1").replace("./", "<rootDir>/");
const entryMapper = ([key, value]) => [keyToRegexp(key), valueToPathMatcher(value)];
const moduleNameMapper = fromPairs(toPairs(paths).map(entryMapper));

module.exports = {
  preset: "jest-preset-typescript",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["lcovonly"],
  moduleNameMapper
};

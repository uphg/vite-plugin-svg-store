import type {Config} from 'jest';
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/test/**/*.(spec|test).ts'
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};


export default config

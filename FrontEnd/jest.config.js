/** @type {import('jest').Config} */
export default {
  // Use jsdom to simulate a browser environment for React component tests
  testEnvironment: 'jest-environment-jsdom',

  // Run this setup file after the test framework is loaded (adds jest-dom matchers)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Only pick up files inside tests/unit/
  testMatch: ['**/tests/unit/**/*.test.{js,jsx}'],

  // Transform JS/JSX through Babel so Jest can handle ESM + React JSX
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // Map CSS module imports to identity-obj-proxy so they don't crash tests
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Support the @ path alias defined in vite.config.js
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Collect coverage from all source files (except entry points & style modules)
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.module.css',
  ],

  // Show individual test results in the console
  verbose: true,
};

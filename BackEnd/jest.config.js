/**
 * Jest config for BackEnd (Node/Express/Prisma).
 * The project is native ESM ("type": "module"), so we use
 * --experimental-vm-modules when running jest (see package.json scripts).
 */
export default {
  testEnvironment: 'node',

  // Pick up API tests and DB tests
  testMatch: [
    '**/tests/api/**/*.test.js',
    '**/tests/db/**/*.test.js',
  ],

  // Required for Jest to handle native ESM files (.js in an ESM package)
  extensionsToTreatAsEsm: [],

  // Show individual test names
  verbose: true,
};

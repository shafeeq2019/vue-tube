import { defineConfig } from "vitest/config";

// Firestore security rule tests; they need the Firestore emulator,
// so they run via `npm run test:rules` (firebase emulators:exec).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.js"],
    fileParallelism: false,
    testTimeout: 20000,
  },
});

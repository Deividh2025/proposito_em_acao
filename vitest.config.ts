import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    environment: "node",
    include: [
      "src/tests/unit/**/*.test.ts",
      "src/tests/integration/**/*.test.ts",
      "src/ai/evals/**/*.test.ts"
    ],
    passWithNoTests: false
  }
});

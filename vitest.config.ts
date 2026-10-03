import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["shared/src/**/*.test.ts", "frontend/src/lib/**/*.test.ts", "frontend/src/server/**/*.test.ts", "backend/src/**/*.test.ts"],
  },
});

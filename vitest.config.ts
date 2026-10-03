import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Même alias que le frontend : @/… pointe sur frontend/src.
  resolve: { alias: { "@": fileURLToPath(new URL("./frontend/src", import.meta.url)) } },
  test: {
    include: ["shared/src/**/*.test.ts", "frontend/src/lib/**/*.test.ts", "frontend/src/server/**/*.test.ts", "backend/src/**/*.test.ts"],
  },
});

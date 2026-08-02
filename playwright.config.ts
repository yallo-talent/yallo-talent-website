import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm dev",
    port: Number(PORT),
    reuseExistingServer: true,
  },
  use: { baseURL: `http://localhost:${PORT}` },
});

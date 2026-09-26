import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // `pg.Pool` connects lazily, so a syntactically valid but unreachable
      // URL is enough to satisfy `src/db/index.ts`'s startup check without
      // needing a real database for these smoke tests (which never submit
      // the contact form or hit /api/health).
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/placeholder",
    },
  },
});

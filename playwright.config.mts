import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.FORM_TEST_BASE_URL || "http://127.0.0.1:3001",
    browserName: "chromium",
    channel: "chrome",
    trace: "off",
  },
});

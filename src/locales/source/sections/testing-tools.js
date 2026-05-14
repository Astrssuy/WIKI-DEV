export const testingToolsSection = {
  id: "testing-tools",
  parentId: "testing",
  title: "Testing tools",
  icon: "⚒",
  summary: "Vitest, Jest, Playwright, Cypress, Testing Library — when to reach for which.",
  blocks: [
    {
      type: "text",
      content:
        "The JavaScript testing ecosystem moved from one monolith (Jest) to several specialized tools. Pick by runtime and use case, not by trend: the fastest test suite is the one your team actually runs.",
    },
    {
      type: "list",
      title: "Unit & integration runners",
      items: [
        "Vitest — Vite-native, drop-in for Jest API, instant feedback in watch mode.",
        "Jest — mature, huge ecosystem, slower start; defaults still work everywhere.",
        "Node's built-in `node --test` — zero deps, fine for small libs.",
        "Bun's `bun test` — fast, Jest-compatible expectations.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",       // for React/DOM tests
    setupFiles: ["./tests/setup.ts"],
    coverage: { reporter: ["text", "html"], include: ["src/**"] },
    globals: true,              // describe/it/expect without imports
  },
});`,
    },
    {
      type: "list",
      title: "Component / UI testing",
      items: [
        "Testing Library (React/Vue/Svelte) — query by role and label, not by class.",
        "`screen.getByRole(\"button\", { name: /save/i })` — accessible queries first.",
        "Avoid `data-testid` unless there's no semantic alternative.",
        "`user-event` simulates real interactions (typing, focus, paste).",
        "Snapshot tests are last-resort; they're easy to write, painful to read.",
      ],
    },
    {
      type: "list",
      title: "End-to-end (browser)",
      items: [
        "Playwright — multi-browser (Chromium/Firefox/WebKit), parallel by default, great traces.",
        "Cypress — single-browser focus, friendly DX, easier for QA-leaning teams.",
        "Run a small set; E2E is where flakiness goes to live.",
        "Record videos and `trace.zip` only on failure to keep CI fast.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Playwright test with API setup
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  // Seed via real API; faster + closer to prod than UI flow
  await request.post("/api/test/reset");
  await request.post("/api/test/users", {
    data: { email: "a@b.test", role: "admin" },
  });
});

test("admin sees the audit log", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("a@b.test");
  await page.getByRole("button", { name: "Send magic link" }).click();
  await page.goto("/admin/audit");
  await expect(page.getByRole("heading", { name: "Audit log" })).toBeVisible();
});`,
    },
    {
      type: "list",
      title: "Network mocking",
      items: [
        "MSW — intercept `fetch`/XHR in tests and the browser; reuse handlers everywhere.",
        "`nock` — Node-only HTTP interceptor.",
        "Prefer real network in E2E against a staging API or a seeded test DB.",
      ],
    },
    {
      type: "text",
      content:
        "Pin one runner per repo. Mixing Jest and Vitest in the same project costs more time than the supposed gain. Build a `npm test` that always works locally without prep — that's the test culture you want.",
    },
  ],
};

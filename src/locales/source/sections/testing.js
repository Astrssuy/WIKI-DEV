export const testingSection = {
  id: "testing",
  title: "Testing",
  icon: "✓",
  summary: "Unit, integration, end-to-end, and the mindset behind a useful test suite.",
  blocks: [
    {
      type: "text",
      content:
        "Tests are an executable contract. Good ones describe behavior in a way that survives refactors; bad ones lock in implementation details and rot. Aim for tests you would not delete to make a refactor possible.",
    },
    {
      type: "list",
      title: "The testing pyramid (still useful)",
      items: [
        "Unit — fast, isolated, lots of them. Pure functions and small classes.",
        "Integration — multiple units together with a real DB / API mock.",
        "End-to-end (E2E) — the whole app in a browser; few, slow, valuable.",
        "Contract — verifies APIs against schemas (Pact, OpenAPI tests).",
        "Property-based — generate inputs to find edge cases (fast-check).",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Vitest — unit test
import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles unicode and trims dashes", () => {
    expect(slugify("  Café — déjà vu  ")).toBe("cafe-deja-vu");
  });
});`,
    },
    {
      type: "list",
      title: "Naming & structure",
      items: [
        "Test names describe behavior: `it(\"returns 404 when post is missing\")`.",
        "Arrange / Act / Assert (AAA) keeps tests readable.",
        "One assertion per logical concept; multiple `expect` per test is fine if they relate.",
        "Don't test the framework; test your code's contract.",
      ],
    },
    {
      type: "list",
      title: "Mocks, stubs, fakes — pick the lightest",
      items: [
        "Prefer real dependencies in tests when fast (in-memory SQLite, fake clocks).",
        "Mock at the boundary (HTTP, file system) — not internal helpers.",
        "MSW (Mock Service Worker) — intercepts HTTP in Node and browsers.",
        "If you need to mock five things to test one, the code wants a refactor.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      code: `// Playwright — end-to-end
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});`,
    },
    {
      type: "list",
      title: "TDD without religion",
      items: [
        "Red → Green → Refactor: write a failing test, make it pass, clean up.",
        "Use it when the design is unclear; it forces you to define what you want.",
        "Skip it for spikes and exploratory code — you'll throw them away anyway.",
        "Coverage is a smell, not a goal. 80% of well-named tests beats 100% of useless ones.",
      ],
    },
    {
      type: "text",
      content:
        "Run unit tests on every save (`--watch`), integration on every PR, E2E on `main` and before releases. Flaky tests poison the suite — fix or delete them; muting alerts trains the team to ignore real failures.",
    },
  ],
};

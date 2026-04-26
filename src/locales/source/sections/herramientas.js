export const herramientasSection = {
  id: "herramientas",
  title: "Tooling",
  icon: "⧉",
  summary: "Editor, linters, formatters, package managers, and other daily drivers.",
  blocks: [
    {
      type: "text",
      content:
        "Tooling lives between you and the code: editor, formatter, linter, type checker, package manager, debugger. Set them up once per project and let pre-commit hooks (or CI) enforce the rules so reviews focus on ideas, not whitespace.",
    },
    {
      type: "list",
      title: "Editor — VS Code",
      items: [
        "`settings.json` per workspace (committed) overrides personal config.",
        "Extensions: ESLint, Prettier, EditorConfig, GitLens, error lens.",
        "`Cmd/Ctrl+P` — jump to file; `Cmd/Ctrl+Shift+P` — command palette.",
        "Integrated terminal — keep `node`/`bun`/`python` handy without leaving the editor.",
      ],
    },
    {
      type: "code",
      lang: "json",
      code: `// .vscode/settings.json — project-wide editor rules
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "files.eol": "\\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}`,
    },
    {
      type: "list",
      title: "Formatter — Prettier",
      items: [
        "Pin a version in `devDependencies`; nobody argues about quotes or semicolons.",
        "`.prettierrc` keeps options minimal; defaults are good for most teams.",
        "Run on `pre-commit` (Husky + lint-staged) or in CI as `prettier --check`.",
      ],
    },
    {
      type: "list",
      title: "Linter — ESLint",
      items: [
        "Catches bugs (`no-undef`, exhaustive deps in React) and style issues.",
        "Prefer the flat config (`eslint.config.js`) on ESLint 9+.",
        "Extend `eslint:recommended` + framework presets (`@typescript-eslint`, `react`).",
        "Treat warnings as errors in CI: `eslint --max-warnings 0`.",
      ],
    },
    {
      type: "code",
      lang: "js",
      code: `// eslint.config.js — flat config example
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
];`,
    },
    {
      type: "list",
      title: "Package managers",
      items: [
        "npm — bundled with Node; safe default; `package-lock.json` committed.",
        "pnpm — fast, content-addressable store; saves disk on monorepos.",
        "yarn — classic v1 or modern Berry (PnP); pick one and stick to it.",
        "Lockfile rule: commit it; `npm ci`/`pnpm i --frozen-lockfile` in CI.",
      ],
    },
    {
      type: "list",
      title: "Pre-commit hooks (Husky + lint-staged)",
      items: [
        "`husky` installs git hooks declaratively from `package.json`.",
        "`lint-staged` runs commands only on staged files (fast).",
        "Common pre-commit chain: `prettier --write` → `eslint --fix` → tests for changed files.",
        "Provide `--no-verify` escape hatch; document when it's acceptable.",
      ],
    },
    {
      type: "code",
      lang: "json",
      code: `// package.json snippet
{
  "scripts": { "prepare": "husky" },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}`,
    },
    {
      type: "list",
      title: "Debugger & profiler",
      items: [
        "Chrome/Edge DevTools — Sources tab; conditional breakpoints; the Performance tab.",
        "VS Code launch.json — debug Node.js or browser straight from the editor.",
        "`console.log` is fine; structured `console.table` and `console.group` are better.",
        "Profile before you optimize; intuition lies, the flame chart does not.",
      ],
    },
    {
      type: "text",
      content:
        "Automate formatting and style (pre-commit or CI) so reviews focus on ideas, not whitespace. For Git commands and flows, open the Git section.",
    },
    {
      type: "code",
      lang: "bash",
      code: `# Team formatting (e.g. Prettier + ESLint)
npm run lint:fix

# Short branch + clear commit
git switch -c feat/wiki-retro
git commit -m "docs: tooling section"`,
    },
  ],
};

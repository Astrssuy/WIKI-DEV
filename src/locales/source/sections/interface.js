export const interfaceSections = [
  {
    id: "interfaz",
    title: "Interface",
    icon: "▣",
    summary: "UI topics hub — open sub-items in the sidebar for deep dives.",
    blocks: [
      {
        type: "text",
        content:
          "This chapter groups practical notes on building browser interfaces. The sidebar nests topics under Interface: pick React, Vite, CSS, Bootstrap, Tailwind CSS, TypeScript for UI, or accessibility. Each sub-page is standalone documentation you can filter with `f` inside the article.",
      },
      {
        type: "list",
        title: "Topics (sub-menu)",
        items: [
          "React — components, hooks, state, and ecosystem basics.",
          "Vite — dev server, HMR, config, and production builds.",
          "CSS — layout, cascade, custom properties, and responsive patterns.",
          "Bootstrap — grid, components, customization, trade-offs.",
          "Tailwind CSS — utility workflow, configuration, and composition.",
          "TypeScript for UI — typing props, narrowing, and strictness with components.",
          "Accessibility — WCAG-minded patterns, ARIA, and keyboard support.",
        ],
      },
    ],
  },
  {
    id: "interfaz-react",
    parentId: "interfaz",
    title: "React",
    icon: "⚛",
    summary: "Components, JSX, hooks, and how data flows to the DOM.",
    blocks: [
      {
        type: "text",
        content:
          "React models UI as a tree of components. Each component is a function (or class) that returns a description of UI (JSX). React reconciles the previous tree with the next and updates the DOM in batches. You think in state and props, not in manual DOM mutation.",
      },
      {
        type: "list",
        title: "Core ideas",
        items: [
          "`props` — inputs from the parent; treat them immutable in the child.",
          "`state` — values that change over time; updating state schedules a re-render.",
          "One-way data flow — data flows down; events flow up via callbacks.",
          "Keys in lists — stable keys help React match list items across renders.",
        ],
      },
      {
        type: "code",
        lang: "tsx",
        code: `function Counter({ step = 1 }: { step?: number }) {
  const [n, setN] = React.useState(0);
  return (
    <button type="button" onClick={() => setN((x) => x + step)}>
      Count: {n}
    </button>
  );
}`,
      },
      {
        type: "list",
        title: "Hooks you use daily",
        items: [
          "`useState` — local state; updater form avoids stale closures in async code.",
          "`useEffect` — sync with the outside world; clean up in the return function.",
          "`useMemo` / `useCallback` — cache values/functions; use when profiling shows benefit.",
          "`useRef` — mutable box or DOM handle; changing `.current` does not re-render.",
          "`useId` — stable ids for labels and `aria-labelledby` (SSR-safe).",
        ],
      },
      {
        type: "text",
        content:
          "Server Components (React 18+/frameworks) run on the server and stream HTML or RSC payloads; client components handle interactivity. For forms, prefer native behavior and progressive enhancement; libraries like React Hook Form pair well with validation schemas (Zod).",
      },
      {
        type: "list",
        title: "Ecosystem & quality",
        items: [
          "Routing — React Router or framework routers (Next.js, Remix) for URLs and data loaders.",
          "Testing — React Testing Library: assert what users see, not implementation details.",
          "Strict Mode — double-invokes some lifecycles in dev to surface unsafe side effects.",
        ],
      },
    ],
  },
  {
    id: "interfaz-vite",
    parentId: "interfaz",
    title: "Vite",
    icon: "⚡",
    summary: "Fast dev server, native ESM, and Rollup-based production builds.",
    blocks: [
      {
        type: "text",
        content:
          "Vite splits development and production: in dev it serves source as native ES modules and uses esbuild to pre-bundle dependencies; hot module replacement (HMR) updates modules without full reloads. Production builds use Rollup for code splitting and tree-shaking.",
      },
      {
        type: "list",
        title: "Why it feels fast",
        items: [
          "Cold start avoids bundling the whole app before serving.",
          "Dependencies prebundle once; your source edits stay unbundled in dev.",
          "HMR boundary is the edited module when possible.",
        ],
      },
      {
        type: "code",
        lang: "ts",
        code: `// vite.config.ts (conceptual)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { sourcemap: true },
});`,
      },
      {
        type: "list",
        title: "Configuration notes",
        items: [
          "`vite.config.*` — plugins, aliases, proxy to your API, HTTPS for local dev.",
          "`import.meta.env` — env vars prefixed with `VITE_` are exposed to client code.",
          "Assets — import files for hashed URLs; large assets can live in `public/` as static.",
          "`base` — set when deploying under a subpath (e.g. GitHub Pages).",
        ],
      },
      {
        type: "text",
        content:
          "Use the official plugins for React, Vue, or Svelte. For mixed SSR frameworks, follow that framework's Vite integration. When debugging production-only issues, run `vite build && vite preview` to serve the Rollup output locally.",
      },
    ],
  },
  {
    id: "interfaz-css",
    parentId: "interfaz",
    title: "CSS",
    icon: "◫",
    summary: "Cascade, layout, custom properties, and responsive patterns.",
    blocks: [
      {
        type: "text",
        content:
          "CSS describes presentation: selectors target elements, the cascade resolves conflicts, and the box model plus formatting contexts (block, flex, grid) determine layout. Modern CSS favors logical properties, `gap`, `clamp()`, and container queries for maintainable responsive UI.",
      },
      {
        type: "list",
        title: "Layout toolbox",
        items: [
          "Flexbox — one axis; great for toolbars, centering, wrapping chips.",
          "Grid — rows and columns together; `minmax` + `auto-fit`/`auto-fill` for card grids.",
          "`position` — `relative`/`absolute` for overlays; `sticky` for section headers.",
        ],
      },
      {
        type: "code",
        lang: "css",
        code: `:root {
  --space: clamp(0.5rem, 2vw, 1.25rem);
  --fg: #0f172a;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space);
  color: var(--fg);
}`,
      },
      {
        type: "list",
        title: "Maintainability",
        items: [
          "Prefer class hooks over deep `article div div` selectors.",
          "Custom properties cascade — theme toggles update once on `:root` or `[data-theme]`.",
          "`@layer` — order resets, components, and utilities predictably.",
          "Use `@media (prefers-reduced-motion: reduce)` to tone down animation.",
        ],
      },
      {
        type: "text",
        content:
          "Measure paint and layout in DevTools when polishing lists and animations. Prefer `transform` and `opacity` for motion; avoid layout thrashing by reading layout properties after writes in the same frame.",
      },
    ],
  },
  {
    id: "interfaz-bootstrap",
    parentId: "interfaz",
    title: "Bootstrap",
    icon: "▢",
    summary: "Grid system, prebuilt components, and Sass variables.",
    blocks: [
      {
        type: "text",
        content:
          "Bootstrap is a CSS (and optional JS) toolkit: a responsive grid, typography, buttons, forms, navbars, modals, and more. You ship shared design decisions quickly; the trade-off is a recognizable look unless you customize.",
      },
      {
        type: "list",
        title: "Using it well",
        items: [
          "Grid — rows and `col-*` breakpoints; prefer utilities (`d-flex`, `gap-*`) for small tweaks.",
          "Components — read docs for required markup and `data-bs-*` hooks.",
          "Customization — override Sass variables and rebuild, or use Bootstrap 5+ with CSS variables where available.",
        ],
      },
      {
        type: "code",
        lang: "html",
        code: `<div class="container py-4">
  <div class="row g-3">
    <div class="col-md-6">
      <div class="card shadow-sm"><div class="card-body">Panel A</div></div>
    </div>
    <div class="col-md-6">
      <div class="card shadow-sm"><div class="card-body">Panel B</div></div>
    </div>
  </div>
</div>`,
      },
      {
        type: "text",
        content:
          "Pair with your bundler (Vite, webpack) to import only the SCSS pieces you need, or start from the CDN for prototypes. For accessibility, keep correct roles and labels; Bootstrap's JS plugins manage focus for modals/offcanvas—avoid breaking that behavior with ad-hoc z-index stacks.",
      },
    ],
  },
  {
    id: "interfaz-tailwind",
    parentId: "interfaz",
    title: "Tailwind CSS",
    icon: "≈",
    summary: "Utility-first styling, JIT compiler, and design tokens in config.",
    blocks: [
      {
        type: "text",
        content:
          "Tailwind generates CSS from class names you put in markup: spacing, color, flex, grid, typography, states (`hover:`, `focus:`), and responsive prefixes (`md:`). The compiler scans your files and outputs only what you use.",
      },
      {
        type: "list",
        title: "Workflow",
        items: [
          "`tailwind.config` — extend theme (colors, fonts, spacing), add plugins, set `content` paths.",
          "Prefer composition with `@apply` sparingly in component CSS; utilities keep colocation obvious.",
          "Use `clsx` or `twMerge` to merge conditional classes safely.",
        ],
      },
      {
        type: "code",
        lang: "html",
        code: `<button
  class="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-2
         text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline
         focus-visible:ring-2 focus-visible:ring-cyan-400"
  type="button"
>
  Save
</button>`,
      },
      {
        type: "text",
        content:
          "Tailwind shines in design-system-like apps where spacing and color ramps stay consistent. If the markup feels noisy, extract repeated patterns into framework components (React/Vue) and keep utilities inside those components' JSX templates.",
      },
    ],
  },
  {
    id: "interfaz-typescript",
    parentId: "interfaz",
    title: "TypeScript",
    icon: "⊤",
    summary: "Types for props, events, and safer refactors in component code.",
    blocks: [
      {
        type: "text",
        content:
          "TypeScript adds static types to JavaScript. In UI code, types document component contracts (props, callbacks), catch impossible states before runtime, and unlock safer refactors across large codebases when paired with strict compiler options.",
      },
      {
        type: "list",
        title: "Compiler options that matter for apps",
        items: [
          "`strict` — enables the main safety flags; prefer it in greenfield projects.",
          "`noImplicitAny` — surfaces untyped values that hide bugs.",
          "`strictNullChecks` — `null`/`undefined` must be handled explicitly.",
        ],
      },
      {
        type: "code",
        lang: "tsx",
        code: `type ButtonProps = {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ variant = "primary", children, onClick }: ButtonProps) {
  return (
    <button type="button" data-variant={variant} onClick={onClick}>
      {children}
    </button>
  );
}`,
      },
      {
        type: "list",
        title: "Patterns",
        items: [
          "Discriminated unions for UI state — `type View = { status: \"ok\"; data: T } | { status: \"err\"; msg: string }`.",
          "`satisfies` — keep literal types while checking against a wider interface.",
          "Event handlers — use `React.MouseEvent<HTMLButtonElement>` (or framework equivalents) instead of bare `any`.",
        ],
      },
      {
        type: "text",
        content:
          "Generate types from OpenAPI or GraphQL when possible so client and server agree. For env vars, use modules that validate at startup instead of casting `as string` everywhere.",
      },
    ],
  },
  {
    id: "interfaz-a11y",
    parentId: "interfaz",
    title: "Accessibility",
    icon: "◎",
    summary: "Inclusive UI: keyboard, screen readers, contrast, and WCAG-oriented habits.",
    blocks: [
      {
        type: "text",
        content:
          "Accessible interfaces work for keyboard and assistive tech users, not only for pointers. WCAG guidelines (perceivable, operable, understandable, robust) give testable criteria; legal requirements in many regions align with WCAG 2.1 Level AA.",
      },
      {
        type: "list",
        title: "Non-negotiables",
        items: [
          "Keyboard — all actions reachable with Tab/Shift+Tab; modals trap focus until closed.",
          "Focus visible — replace default outline with a clear custom ring if you must restyle.",
          "Labels — every control has a programmatic name (`label`, `aria-label`, or `aria-labelledby`).",
          "Color contrast — text and UI graphics meet contrast ratios; do not rely on color alone for meaning.",
        ],
      },
      {
        type: "list",
        title: "ARIA: use with care",
        items: [
          "Prefer native elements (`button`, `a`, `input`) before adding roles.",
          "`aria-expanded`, `aria-controls` — disclose widgets like accordions and menus.",
          "`aria-live` — announce dynamic updates; use polite vs assertive sparingly.",
        ],
      },
      {
        type: "code",
        lang: "html",
        code: `<button type="button" aria-expanded="false" aria-controls="menu-panel" id="menu-btn">
  Menu
</button>
<ul id="menu-panel" role="menu" aria-labelledby="menu-btn" hidden>
  <li role="menuitem"><a href="/docs">Docs</a></li>
</ul>`,
      },
      {
        type: "text",
        content:
          "Test with a keyboard only, with the screen reader your users likely have, and run automated checks (axe, Lighthouse) in CI. Involve disabled users in research when you can; tooling catches only a fraction of real friction.",
      },
    ],
  },
];

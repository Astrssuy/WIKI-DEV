export const inicioSection = {
  id: "inicio",
  title: "Home",
  icon: "◆",
  summary: "Welcome, keyboard shortcuts, and a map of what this wiki covers.",
  blocks: [
    {
      type: "text",
      content:
        "A dev wiki with modular docs, fast search, and a CRT terminal vibe. Use the keyboard like the old days. Switch language and theme in the top bar — partial translations fall back to English automatically.",
    },
    {
      type: "list",
      title: "Shortcuts",
      items: [
        "`/` — focus sidebar menu search",
        "`f` — focus in-section block filter",
        "`Esc` — clear the active search (menu or section)",
        "`1-9` — jump to section (filtered menu order)",
      ],
    },
    {
      type: "list",
      title: "What's inside",
      items: [
        "Interface — React, Vite, CSS, Bootstrap, Tailwind, TypeScript, accessibility.",
        "Backend — API design, databases, auth (sessions, JWT, OAuth).",
        "DevOps — CI/CD, Docker, observability, deploy checklists.",
        "Git — day-to-day commands plus a retro training arcade.",
        "Testing — pyramid, tools (Vitest, Playwright), mocks and fixtures.",
        "Security & Linux — OWASP habits, headers, CLI essentials.",
        "Mobile — responsive layout, touch targets, PWA basics.",
      ],
    },
    {
      type: "list",
      title: "How to read a section",
      items: [
        "Nested topics appear under their parent in the sidebar (e.g. Interface → React).",
        "Press `f` inside an article to filter blocks without leaving the page.",
        "Code blocks are copy-friendly; hover for a subtle CRT glitch.",
        "Open the Git section for quizzes, sequences, and a simulated terminal.",
      ],
    },
    {
      type: "text",
      content:
        "Start with Interface if you build UIs, Backend if you ship APIs, or Git if version control still feels mysterious. There is no wrong order — search (`/`) jumps anywhere instantly.",
    },
  ],
};

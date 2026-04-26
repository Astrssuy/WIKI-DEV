export const inicioSection = {
  id: "inicio",
  title: "Home",
  icon: "◆",
  summary: "Welcome and keyboard shortcuts.",
  blocks: [
    {
      type: "text",
      content:
        "A dev wiki with modular docs, fast search, and a CRT terminal vibe. Use the keyboard like the old days. Switch language in the top bar.",
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
  ],
};

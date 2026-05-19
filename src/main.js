import "./style.css";
import { initI18n, t, getSections, setLanguage, getLocales, currentLanguage } from "./i18n.js";
import { getGamePack } from "./games-pack.js";
import { mountGitGames } from "./git-games.js";
import { applyTheme, getStoredTheme, normalizeTheme } from "./themes.js";
import { getLastSection, saveLastSection, getLastSearch, saveLastSearch, getExpandedGroups, saveExpandedGroups } from "./persistence.js";
import "./scroll-top.js";
import "./footer.js";
import "./hero-typewriter.js";

const app = document.querySelector("#app");

let activeId = getLastSection();
let searchQuery = getLastSearch();
let sectionBlockFilter = "";
/** Grupos del menu lateral expandidos (persistido en localStorage). */
let expandedGroups = new Set(getExpandedGroups());
/** Limpieza de minijuegos Git (canvas / listeners). */
let gitGamesUnmount = null;

/** Tema de color activo (persistido en `localStorage`). */
let currentTheme = applyTheme(getStoredTheme());

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBlock(block) {
  if (block.type === "text") {
    return `<div class="block"><p>${escapeHtml(block.content)}</p></div>`;
  }
  if (block.type === "list") {
    const items = block.items
      .map((line) => {
        const html = line.replace(/`([^`]+)`/g, "<code>$1</code>");
        return `<li>${html}</li>`;
      })
      .join("");
    return `<div class="block"><h4>${escapeHtml(block.title)}</h4><ul>${items}</ul></div>`;
  }
  if (block.type === "code") {
    return `<div class="block"><pre class="pixel glitch-hover" data-lang="${escapeHtml(block.lang)}"><code>${escapeHtml(block.code)}</code></pre></div>`;
  }
  return "";
}

function blockHaystack(block) {
  if (block.type === "text") return block.content;
  if (block.type === "list") return [block.title, ...block.items].join("\n");
  if (block.type === "code") return `${block.lang}\n${block.code}`;
  return "";
}

function blockMatchesFilter(block, q) {
  if (!q) return true;
  return blockHaystack(block).toLowerCase().includes(q.toLowerCase());
}

function sectionMatches(section, q) {
  if (!q) return true;
  const hay = `${section.title} ${section.summary} ${JSON.stringify(section.blocks)}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

function rootsOf(sections) {
  return sections.filter((s) => !s.parentId);
}

function childrenOf(sections, parentId) {
  return sections.filter((s) => s.parentId === parentId);
}

function toggleNavGroup(id) {
  if (expandedGroups.has(id)) expandedGroups.delete(id);
  else expandedGroups.add(id);
  saveExpandedGroups([...expandedGroups]);
}

function isNavGroupOpen(parentId, children) {
  if (!children.length) return false;
  if (expandedGroups.has(parentId)) return true;
  if (parentId === activeId) return true;
  if (children.some((c) => c.id === activeId)) return true;
  if (searchQuery.trim()) return true;
  return false;
}

/** @returns {Array<{ section: object, children: object[] }>} */
function getFilteredNav(sections) {
  const q = searchQuery.trim();
  const roots = rootsOf(sections);
  if (!q) {
    return roots.map((section) => ({
      section,
      children: childrenOf(sections, section.id),
    }));
  }
  return roots
    .map((section) => {
      const kids = childrenOf(sections, section.id);
      const rMatch = sectionMatches(section, q);
      const matchingKids = kids.filter((c) => sectionMatches(c, q));
      if (rMatch) return { section, children: kids };
      if (matchingKids.length) return { section, children: matchingKids };
      return null;
    })
    .filter(Boolean);
}

function restoreInputFocus(selector, selStart, selEnd) {
  const next = app.querySelector(selector);
  if (!next) return;
  next.focus();
  const len = next.value.length;
  const s = typeof selStart === "number" ? Math.min(Math.max(0, selStart), len) : len;
  const en = typeof selEnd === "number" ? Math.min(Math.max(0, selEnd), len) : len;
  if (typeof next.setSelectionRange === "function") next.setSelectionRange(s, en);
}

function render() {
  if (typeof gitGamesUnmount === "function") {
    gitGamesUnmount();
    gitGamesUnmount = null;
  }

  const sections = getSections();
  if (!activeId && sections[0]) activeId = sections[0].id;

  const filtered = getFilteredNav(sections);
  const navFlatIds = new Set();
  filtered.forEach(({ section: sec, children }) => {
    navFlatIds.add(sec.id);
    children.forEach((c) => navFlatIds.add(c.id));
  });
  if (!navFlatIds.has(activeId) && filtered.length) {
    activeId = filtered[0].section.id;
  }

  const section = sections.find((s) => s.id === activeId);
  const fq = sectionBlockFilter.trim();

  let blocksHtml = "";
  if (section) {
    let blocks = [...section.blocks];
    if (fq) blocks = blocks.filter((b) => blockMatchesFilter(b, fq));
    const inner = blocks.map(renderBlock).join("");
    if (inner) blocksHtml = inner;
    else if (fq) {
      blocksHtml = `<p class="block section-filter-empty">${escapeHtml(t("emptySectionFilter"))}</p>`;
    } else {
      blocksHtml = `<p class="block">${escapeHtml(t("emptyContent"))}</p>`;
    }
  }

  const locales = getLocales();
  const langOptions = locales
    .map(
      (l) =>
        `<option value="${escapeHtml(l.code)}"${l.code === currentLanguage() ? " selected" : ""}>${escapeHtml(l.label)}</option>`,
    )
    .join("");

  app.innerHTML = `
    <div class="noise" aria-hidden="true"></div>
    <div class="shell">
      <header class="titlebar">
        <div class="titlebar__brand">
          <span class="titlebar__logo">DEV.wiki</span>
          <span class="titlebar__badge">${escapeHtml(t("badge"))}</span>
        </div>
        <div class="titlebar__actions">
          <label class="titlebar__lang-label" for="theme">${escapeHtml(t("themeLabel"))}</label>
          <select id="theme" class="titlebar__lang-select" aria-label="${escapeHtml(t("themeLabel"))}">
            <option value="crt"${currentTheme === "crt" ? " selected" : ""}>${escapeHtml(t("themeCrt"))}</option>
            <option value="ember"${currentTheme === "ember" ? " selected" : ""}>${escapeHtml(t("themeEmber"))}</option>
            <option value="void"${currentTheme === "void" ? " selected" : ""}>${escapeHtml(t("themeVoid"))}</option>
          </select>
          <label class="titlebar__lang-label" for="lang">${escapeHtml(t("langLabel"))}</label>
          <select id="lang" class="titlebar__lang-select" aria-label="${escapeHtml(t("langLabel"))}">
            ${langOptions}
          </select>
          <time class="titlebar__clock" id="clock"></time>
        </div>
      </header>
      <aside class="sidebar" aria-label="${escapeHtml(t("navAria"))}">
        <div class="search-wrap">
          <label for="q">${escapeHtml(t("searchLabel"))}</label>
          <input id="q" type="search" autocomplete="off" placeholder="${escapeHtml(t("searchPlaceholder"))}" value="${escapeHtml(searchQuery)}" />
        </div>
        <div>
          <p class="nav-title">${escapeHtml(t("navSectionsTitle"))}</p>
          ${
            filtered.length === 0
              ? `<p class="nav-empty">${escapeHtml(t("emptyNav"))}</p>`
              : `<ul class="nav-list" id="nav"></ul>`
          }
        </div>
      </aside>
      <main class="main">
        <section class="hero" aria-labelledby="hero-tag">
          <div class="hero__inner">
            <p class="hero__tag" id="hero-tag">${escapeHtml(t("heroTag"))}</p>
            <p class="hero__type" id="hero-type"><span class="hero__cursor" aria-hidden="true"></span></p>
          </div>
        </section>
        <article class="doc-panel" aria-live="polite">
          <header class="doc-panel__head">
            <span class="doc-panel__icon" aria-hidden="true">${section?.icon ?? "â—‡"}</span>
            <h2 class="doc-panel__title">${escapeHtml(section?.title ?? "—")}</h2>
            <p class="doc-panel__path">/docs/${escapeHtml(activeId)}.md</p>
          </header>
          <div class="doc-panel__toolbar">
            <label class="doc-panel__toolbar-label" for="q-section">${escapeHtml(t("sectionSearchLabel"))}</label>
            <input
              id="q-section"
              class="doc-panel__toolbar-input"
              type="search"
              autocomplete="off"
              placeholder="${escapeHtml(t("sectionSearchPlaceholder"))}"
              value="${escapeHtml(sectionBlockFilter)}"
            />
          </div>
          <div class="doc-panel__body">
            ${section ? blocksHtml : `<p class="block">${escapeHtml(t("emptyContent"))}</p>`}
            ${section?.id === "git" ? `<div id="git-games-root" class="git-games-root" aria-label="${escapeHtml(t("gitGame.blockTitle"))}"></div>` : ""}
          </div>
        </article>
      </main>
      <footer class="statusbar">
        <span><strong>${escapeHtml(t("statusConnected"))}</strong> ${escapeHtml(t("statusConnectedVal"))}</span>
        <span><strong>${escapeHtml(t("statusSection"))}</strong> ${escapeHtml(section?.title ?? "—")}</span>
        <span><strong>${escapeHtml(t("statusTip"))}</strong> ${escapeHtml(t("statusTipVal"))}</span>
      </footer>
    </div>
  `;

  const navEl = app.querySelector("#nav");
  const qInput = app.querySelector("#q");
  const qSection = app.querySelector("#q-section");
  const langSelect = app.querySelector("#lang");
  const themeSelect = app.querySelector("#theme");

  if (navEl) {
    filtered.forEach(({ section: s, children }, i) => {
      const li = document.createElement("li");
      const hasChildren = children.length > 0;
      const open = hasChildren && isNavGroupOpen(s.id, children);
      li.className = hasChildren
        ? `nav-item nav-item--group${open ? " nav-item--expanded" : ""}`
        : "nav-item";

      const idx = i < 9 ? String(i + 1) : "";

      if (hasChildren) {
        const row = document.createElement("div");
        row.className = "nav-group-row";

        const chevron = document.createElement("button");
        chevron.type = "button";
        chevron.className = "nav-btn__chevron";
        chevron.setAttribute("aria-expanded", open ? "true" : "false");
        chevron.setAttribute(
          "aria-label",
          open ? t("nav.collapseGroup") : t("nav.expandGroup"),
        );
        chevron.textContent = "▸";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `nav-btn nav-btn--parent${s.id === activeId ? " nav-btn--active" : ""}`;
        btn.innerHTML = `
          <span class="nav-btn__body">
            <strong>${escapeHtml(s.icon)} ${escapeHtml(s.title)}</strong>
            <span class="nav-meta">${escapeHtml(s.summary)}</span>
          </span>
          ${idx ? `<kbd>${idx}</kbd>` : ""}
        `;

        chevron.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleNavGroup(s.id);
          render();
        });

        btn.addEventListener("click", () => {
          if (!expandedGroups.has(s.id)) {
            expandedGroups.add(s.id);
            saveExpandedGroups([...expandedGroups]);
          }
          activeId = s.id;
          saveLastSection(activeId);
          sectionBlockFilter = "";
          render();
        });

        row.appendChild(chevron);
        row.appendChild(btn);
        li.appendChild(row);

        const sub = document.createElement("ul");
        sub.className = "nav-sub";
        if (!open) sub.hidden = true;
        children.forEach((c) => {
          const subLi = document.createElement("li");
          const subBtn = document.createElement("button");
          subBtn.type = "button";
          subBtn.className = `nav-btn nav-btn--sub${c.id === activeId ? " nav-btn--active" : ""}`;
          subBtn.innerHTML = `
            <span>
              <strong>${escapeHtml(c.icon)} ${escapeHtml(c.title)}</strong>
              <span class="nav-meta">${escapeHtml(c.summary)}</span>
            </span>
          `;
          subBtn.addEventListener("click", () => {
            if (!expandedGroups.has(s.id)) {
              expandedGroups.add(s.id);
              saveExpandedGroups([...expandedGroups]);
            }
            activeId = c.id;
            saveLastSection(activeId);
            sectionBlockFilter = "";
            render();
          });
          subLi.appendChild(subBtn);
          sub.appendChild(subLi);
        });
        li.appendChild(sub);
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `nav-btn${s.id === activeId ? " nav-btn--active" : ""}`;
        btn.innerHTML = `
          <span class="nav-btn__body">
            <strong>${escapeHtml(s.icon)} ${escapeHtml(s.title)}</strong>
            <span class="nav-meta">${escapeHtml(s.summary)}</span>
          </span>
          ${idx ? `<kbd>${idx}</kbd>` : ""}
        `;
        btn.addEventListener("click", () => {
          activeId = s.id;
          saveLastSection(activeId);
          sectionBlockFilter = "";
          render();
        });
        li.appendChild(btn);
      }

      navEl.appendChild(li);
    });
  }

  qInput.addEventListener("input", (e) => {
    const selStart = e.target.selectionStart;
    const selEnd = e.target.selectionEnd;
    searchQuery = e.target.value;
    saveLastSearch(searchQuery);
    render();
    restoreInputFocus("#q", selStart, selEnd);
  });

  qSection.addEventListener("input", (e) => {
    const selStart = e.target.selectionStart;
    const selEnd = e.target.selectionEnd;
    sectionBlockFilter = e.target.value;
    render();
    restoreInputFocus("#q-section", selStart, selEnd);
  });

  langSelect.addEventListener("change", (e) => {
    const code = e.target.value;
    setLanguage(code).then(() => {
      render();
    });
  });

  themeSelect.addEventListener("change", (e) => {
    currentTheme = normalizeTheme(e.target.value);
    applyTheme(currentTheme);
    render();
  });

  const gamesRoot = app.querySelector("#git-games-root");
  if (gamesRoot) {
    gitGamesUnmount = mountGitGames(gamesRoot, t, getGamePack(currentLanguage()));
  }

  updateClock();
  maybeStartTypewriter();
}

let lastHeroKey = "";

function heroKey() {
  return `${currentLanguage()}|${activeId}`;
}

function maybeStartTypewriter() {
  const k = heroKey();
  if (k !== lastHeroKey) {
    lastHeroKey = k;
    startTypewriter();
  }
}

let typeTimer = null;
let clockInterval = null;

function updateClock() {
  const el = app.querySelector("#clock");
  if (!el) return;
  if (clockInterval) clearInterval(clockInterval);
  const tick = () => {
    const now = new Date();
    const locMap = { en: "en-GB", es: "es", fr: "fr", de: "de", pt: "pt-BR" };
    const loc = locMap[currentLanguage()] ?? "en-GB";
    el.textContent = now.toLocaleString(loc, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };
  tick();
  clockInterval = setInterval(tick, 1000);
}

function startTypewriter() {
  const target = app.querySelector("#hero-type");
  if (!target) return;
  const section = getSections().find((s) => s.id === activeId);
  const line = section
    ? `> ${section.title.toUpperCase()} â€” ${section.summary}`
    : t("typewriterReady");
  if (typeTimer) clearInterval(typeTimer);
  target.textContent = "";
  let i = 0;
  typeTimer = setInterval(() => {
    i += 1;
    target.textContent = line.slice(0, i);
    const cur = document.createElement("span");
    cur.className = "hero__cursor";
    cur.setAttribute("aria-hidden", "true");
    target.appendChild(cur);
    if (i >= line.length) {
      clearInterval(typeTimer);
      typeTimer = null;
    }
  }, 22);
}

function onKey(e) {
  if (e.key === "Escape") {
    const qs = app.querySelector("#q-section");
    const q = app.querySelector("#q");
    if (q && document.activeElement === q) {
      q.blur();
      searchQuery = "";
      saveLastSearch("");
      render();
      return;
    }
    if (qs && document.activeElement === qs) {
      qs.blur();
      sectionBlockFilter = "";
      render();
      return;
    }
    return;
  }
  if (e.key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const el = e.target;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
    e.preventDefault();
    app.querySelector("#q-section")?.focus();
    return;
  }
  if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
    const tEl = e.target;
    if (tEl && (tEl.tagName === "INPUT" || tEl.tagName === "TEXTAREA")) return;
    e.preventDefault();
    app.querySelector("#q")?.focus();
    return;
  }
  const n = Number(e.key);
  if (n >= 1 && n <= 9) {
    const tEl = e.target;
    if (tEl && ["INPUT", "TEXTAREA", "SELECT"].includes(tEl.tagName)) return;
    const filtered = getFilteredNav(getSections());
    const pick = filtered[n - 1]?.section;
    if (pick) {
      activeId = pick.id;
      saveLastSection(activeId);
      sectionBlockFilter = "";
      render();
    }
  }
}

document.addEventListener("keydown", onKey);

async function boot() {
  await initI18n();
  const sections = getSections();
  const known = new Set(sections.map((s) => s.id));
  if (!activeId || !known.has(activeId)) {
    activeId = sections[0]?.id ?? "";
    saveLastSection(activeId);
  }
  render();
}

boot();

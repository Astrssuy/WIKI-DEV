/**
 * Footer minimalista con créditos y atajos esenciales.
 * Se autoinstala al importarse y respeta el idioma activo: lee
 * data-i18n-* via i18next si está disponible, si no muestra inglés.
 */
function pick(key, fallback) {
  try {
    const i18 = window.__i18next;
    if (i18 && typeof i18.t === "function") {
      const v = i18.t(key);
      if (v && v !== key) return v;
    }
  } catch {
    /* sin i18n disponible: fallback */
  }
  return fallback;
}

function buildFooter() {
  const f = document.createElement("footer");
  f.className = "wiki-footer";
  f.setAttribute("role", "contentinfo");
  f.innerHTML = `
    <div class="wiki-footer__inner">
      <span class="wiki-footer__brand">DEV.wiki</span>
      <span class="wiki-footer__sep">·</span>
      <span class="wiki-footer__hint">${pick("footer.shortcuts", "Shortcuts:")} <code>/</code> <code>f</code> <code>Esc</code> <code>1-9</code></span>
      <span class="wiki-footer__sep">·</span>
      <span class="wiki-footer__credit">${pick("footer.credit", "Retro guide for developers who are starting out.")}</span>
    </div>
  `;
  return f;
}

function attach() {
  if (document.querySelector(".wiki-footer")) return;
  document.body.appendChild(buildFooter());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attach, { once: true });
} else {
  attach();
}

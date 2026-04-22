/** @type {readonly ["crt", "ember", "void"]} */
export const THEME_IDS = ["crt", "ember", "void"];

export const THEME_STORAGE_KEY = "wiki-theme";

/** @param {string} id */
export function normalizeTheme(id) {
  return /** @type {(typeof THEME_IDS)[number]} */ (THEME_IDS.includes(id) ? id : "crt");
}

export function getStoredTheme() {
  return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY) ?? "crt");
}

/** @param {string} id */
export function applyTheme(id) {
  const t = normalizeTheme(id);
  document.documentElement.dataset.theme = t;
  localStorage.setItem(THEME_STORAGE_KEY, t);
  return t;
}

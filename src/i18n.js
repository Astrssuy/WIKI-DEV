import i18next from "i18next";
import { bundles, locales, LOCALE_STORAGE_KEY } from "./locales/registry.js";

const resources = Object.fromEntries(
  Object.entries(bundles).map(([code, b]) => [code, { translation: b.ui }]),
);

function normalizeLng(code) {
  const base = (code || "en").split("-")[0];
  return bundles[base] ? base : "en";
}

export function initI18n() {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  const lng = normalizeLng(saved || "en");

  return i18next
    .init({
      lng,
      fallbackLng: "en",
      supportedLngs: Object.keys(bundles),
      resources,
      interpolation: { escapeValue: false },
    })
    .then(() => {
      document.documentElement.lang = lng;
      document.documentElement.dir = locales.find((l) => l.code === lng)?.dir ?? "ltr";
    });
}

/** @param {string} key */
export function t(key, opts) {
  return i18next.t(key, opts);
}

export function getSections() {
  return bundles[normalizeLng(i18next.language)].sections;
}

export function setLanguage(code) {
  const lng = normalizeLng(code);
  if (!bundles[lng]) return Promise.resolve();
  localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  return i18next.changeLanguage(lng).then(() => {
    document.documentElement.lang = lng;
    document.documentElement.dir = locales.find((l) => l.code === lng)?.dir ?? "ltr";
  });
}

export function getLocales() {
  return locales;
}

export function currentLanguage() {
  return normalizeLng(i18next.language);
}

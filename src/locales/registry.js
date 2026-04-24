import { sections as sectionsEn } from "./source/sections.js";
import uiEn from "./ui/en.json";

/** Clave en localStorage. Más idiomas: `npm run i18n:generate` (ver scripts/i18n-generate.mjs). */
export const LOCALE_STORAGE_KEY = "wiki-lang";

/** Un solo idioma de partida: inglés (fuente). */
export const locales = [
  { code: "en", label: "English", dir: "ltr" },
];

export const bundles = {
  en: { ui: uiEn, sections: sectionsEn },
};

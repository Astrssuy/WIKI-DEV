import { sections as sectionsEn } from "./source/sections.js";
import uiEn from "./ui/en.json";
import uiEs from "./ui/es.json";
import uiFr from "./ui/fr.json";
import uiDe from "./ui/de.json";
import uiPt from "./ui/pt.json";
import sectionsEs from "./generated/es.json";
import sectionsFr from "./generated/fr.json";
import sectionsDe from "./generated/de.json";
import sectionsPt from "./generated/pt.json";

/** Clave en localStorage. Más idiomas: `npm run i18n:generate` (ver scripts/i18n-generate.mjs). */
export const LOCALE_STORAGE_KEY = "wiki-lang";

/** Cinco idiomas: inglés (fuente) + ES, FR, DE, PT. */
export const locales = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
];

export const bundles = {
  en: { ui: uiEn, sections: sectionsEn },
  es: { ui: uiEs, sections: sectionsEs },
  fr: { ui: uiFr, sections: sectionsFr },
  de: { ui: uiDe, sections: sectionsDe },
  pt: { ui: uiPt, sections: sectionsPt },
};

import { sections as sectionsEn } from "./source/sections.js";
import uiEn from "./ui/en.json";
import uiEs from "./ui/es.json";
import uiFr from "./ui/fr.json";
import uiDe from "./ui/de.json";
import uiPt from "./ui/pt.json";
import uiAr from "./ui/ar.json";
import uiIt from "./ui/it.json";
import uiJa from "./ui/ja.json";
import uiKo from "./ui/ko.json";
import uiRu from "./ui/ru.json";
import uiZh from "./ui/zh.json";
import sectionsEs from "./generated/es.json";
import sectionsFr from "./generated/fr.json";
import sectionsDe from "./generated/de.json";
import sectionsPt from "./generated/pt.json";
import sectionsAr from "./generated/ar.json";
import sectionsIt from "./generated/it.json";
import sectionsJa from "./generated/ja.json";
import sectionsKo from "./generated/ko.json";
import sectionsRu from "./generated/ru.json";
import sectionsZh from "./generated/zh.json";

/** Clave en localStorage. MÃ¡s idiomas: `npm run i18n:generate` (ver scripts/i18n-generate.mjs). */
export const LOCALE_STORAGE_KEY = "wiki-lang";

/**
 * Idiomas disponibles. EN es la fuente y siempre estÃ¡ completo.
 * Los marcados como `partial: true` tienen traducciones incompletas y dependen
 * del fallback a EN para las claves faltantes.
 */
export const locales = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "EspaÃ±ol", dir: "ltr" },
  { code: "fr", label: "FranÃ§ais", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "pt", label: "PortuguÃªs", dir: "ltr" },
  { code: "it", label: "Italiano", dir: "ltr", partial: true },
  { code: "ru", label: "Ð ÑƒÑÑÐºÐ¸Ð¹", dir: "ltr", partial: true },
  { code: "ja", label: "æ—¥æœ¬èªž", dir: "ltr", partial: true },
  { code: "ko", label: "í•œêµ­ì–´", dir: "ltr", partial: true },
  { code: "zh", label: "ä¸­æ–‡", dir: "ltr", partial: true },
  { code: "ar", label: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©", dir: "rtl", partial: true },
];

export const bundles = {
  en: { ui: uiEn, sections: sectionsEn },
  es: { ui: uiEs, sections: sectionsEs },
  fr: { ui: uiFr, sections: sectionsFr },
  de: { ui: uiDe, sections: sectionsDe },
  pt: { ui: uiPt, sections: sectionsPt },
  it: { ui: uiIt, sections: sectionsIt },
  ru: { ui: uiRu, sections: sectionsRu },
  ja: { ui: uiJa, sections: sectionsJa },
  ko: { ui: uiKo, sections: sectionsKo },
  zh: { ui: uiZh, sections: sectionsZh },
  ar: { ui: uiAr, sections: sectionsAr },
};

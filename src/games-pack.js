import en from "./locales/games/en.json";
import es from "./locales/games/es.json";
import fr from "./locales/games/fr.json";
import de from "./locales/games/de.json";
import pt from "./locales/games/pt.json";

const packs = { en, es, fr, de, pt };

export function getGamePack(code) {
  const base = (code || "en").split("-")[0].toLowerCase();
  return packs[base] || en;
}

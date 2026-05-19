/**
 * Repara UTF-8 mal interpretado como Windows-1252 / Latin-1.
 * Uso: node scripts/fix-encoding.mjs
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Unicode -> byte Windows-1252 (solo extensiones fuera de Latin-1) */
const CP1252_UNICODE_TO_BYTE = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c], [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function charToByte(ch) {
  const c = ch.charCodeAt(0);
  if (c <= 0xff) return c;
  return CP1252_UNICODE_TO_BYTE.get(c) ?? null;
}

function decodeBytes(bytes) {
  try {
    const decoded = Buffer.from(bytes).toString("utf8");
    return decoded.includes("\uFFFD") ? null : decoded;
  } catch {
    return null;
  }
}

/** Intenta decodificar una ventana de caracteres como secuencia UTF-8 mal leida. */
function tryDecodeRun(chars) {
  const bytes = chars.map(charToByte);
  if (bytes.some((b) => b === null)) return null;
  return decodeBytes(bytes);
}

const MOJIBAKE_START = new Set([0xc3, 0xc2, 0xe2, 0xc5, 0xc4]);

export function fixString(s) {
  if (typeof s !== "string") return s;

  let out = "";
  let i = 0;
  while (i < s.length) {
    const code = s.charCodeAt(i);
    if (!MOJIBAKE_START.has(code)) {
      out += s[i++];
      continue;
    }

    let decoded = null;
    let consumed = 0;
    for (let len = 4; len >= 2; len--) {
      if (i + len > s.length) continue;
      const run = [...s.slice(i, i + len)];
      const d = tryDecodeRun(run);
      if (d) {
        decoded = d;
        consumed = len;
        break;
      }
    }

    if (decoded) {
      out += decoded;
      i += consumed;
    } else {
      out += s[i++];
    }
  }
  return out;
}

function hasMojibake(s) {
  return typeof s === "string" && /[ÃÂâ][\u0080-\u00BF\u20AC\u201C-\u201F\u0160-\u017E\u2020-\u2022]/.test(s);
}

function walk(value) {
  if (typeof value === "string") return fixString(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    return out;
  }
  return value;
}

async function fixJsonFile(filePath) {
  let raw = await readFile(filePath, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  if (!hasMojibake(raw)) return { changed: false, remaining: 0 };
  const data = JSON.parse(raw);
  const fixed = walk(data);
  const out = `${JSON.stringify(fixed, null, 2)}\n`;
  await writeFile(filePath, out, "utf8");
  const remaining = [...out.matchAll(/[ÃÂ]|â€/g)].length;
  return { changed: true, remaining };
}

const jsonDirs = [
  path.join(root, "src/locales/generated"),
  path.join(root, "src/locales/ui"),
  path.join(root, "src/locales/games"),
];

let count = 0;
for (const dir of jsonDirs) {
  const files = await readdir(dir);
  for (const f of files.filter((x) => x.endsWith(".json"))) {
    const result = await fixJsonFile(path.join(dir, f));
    if (result.changed) {
      console.log(`fixed: ${f} (restan ~${result.remaining} patrones)`);
      count++;
    }
  }
}

console.log(`\nListo. ${count} archivo(s) actualizados.`);

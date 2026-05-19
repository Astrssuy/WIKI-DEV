/**
 * Repara texto UTF-8 mal interpretado como Latin-1 (ej. actualizaciÃ³n → actualización).
 * Uso: node scripts/fix-encoding.mjs
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function needsFix(s) {
  return typeof s === "string" && /Ã|â€|Â(?![a-z])/.test(s);
}

function fixMojibake(s) {
  if (!needsFix(s)) return s;
  try {
    const fixed = Buffer.from(s, "latin1").toString("utf8");
    if (fixed.includes("\uFFFD")) return s;
    return fixed;
  } catch {
    return s;
  }
}

function walk(value) {
  if (typeof value === "string") return fixMojibake(value);
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
  const before = raw;
  const data = JSON.parse(raw);
  const fixed = walk(data);
  const out = `${JSON.stringify(fixed, null, 2)}\n`;
  if (out !== before && out !== `${before.trimEnd()}\n`) {
    await writeFile(filePath, out, "utf8");
    return true;
  }
  return false;
}

async function fixTextFile(filePath) {
  let raw = await readFile(filePath, "utf8");
  if (!needsFix(raw)) return false;
  const fixed = fixMojibake(raw);
  if (fixed === raw) return false;
  await writeFile(filePath, fixed, "utf8");
  return true;
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
    if (await fixJsonFile(path.join(dir, f))) {
      console.log("fixed json:", f);
      count++;
    }
  }
}

for (const rel of ["src/main.js", "src/style.css"]) {
  if (await fixTextFile(path.join(root, rel))) {
    console.log("fixed text:", rel);
    count++;
  }
}

console.log(`Done. ${count} file(s) updated.`);

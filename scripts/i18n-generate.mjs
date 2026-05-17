/**
 * Genera UI + secciones para todos los idiomas objetivo a partir de:
 * - src/locales/ui/en.json
 * - src/locales/source/sections.js
 *
 * Usa el endpoint público usado por translate.google.com ("client=gtx").
 * Ejecutar solo cuando cambie el contenido en inglés: npm run i18n:generate
 *
 * Requiere red. Si falla una cadena, se deja en inglés.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sections as sourceSections } from "../src/locales/source/sections.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const uiDir = path.join(root, "src/locales/ui");
const genDir = path.join(root, "src/locales/generated");

const enUi = JSON.parse(await readFile(path.join(uiDir, "en.json"), "utf8"));

/** [bundleCode, googleTl] — inglés es la fuente en `source/sections.js` + `ui/en.json`. */
const TARGETS = [
  ["es", "es"],
  ["fr", "fr"],
  ["de", "de"],
  ["pt", "pt"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gtx(text, tl, sl = "en") {
  if (!text || !String(text).trim()) return text;
  const chunkSize = 4000;
  if (text.length > chunkSize) {
    let out = "";
    for (let i = 0; i < text.length; i += chunkSize) {
      out += await gtx(text.slice(i, i + chunkSize), tl, sl);
      await sleep(120);
    }
    return out;
  }
  const u = new URL("https://translate.googleapis.com/translate_a/single");
  u.searchParams.set("client", "gtx");
  u.searchParams.set("sl", sl);
  u.searchParams.set("tl", tl);
  u.searchParams.set("dt", "t");
  u.searchParams.set("q", text);
  const res = await fetch(u);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.[0]) return text;
  return data[0].map((x) => x[0]).join("");
}

async function withRetry(fn, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch {
      await sleep(800 * (i + 1));
    }
  }
  return null;
}

async function translateString(s, tl) {
  const r = await withRetry(() => gtx(s, tl));
  await sleep(180);
  return r ?? s;
}

async function translateUi(tl) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(enUi)) {
    out[k] = await translateString(String(v), tl);
    process.stdout.write(`  ui.${k} (${tl})\n`);
  }
  return out;
}

async function translateBlock(block, tl) {
  if (block.type === "code") return { ...block };
  if (block.type === "text") {
    return { ...block, content: await translateString(block.content, tl) };
  }
  if (block.type === "list") {
    const title = await translateString(block.title, tl);
    const items = [];
    for (const it of block.items) {
      items.push(await translateString(it, tl));
    }
    return { ...block, title, items };
  }
  return { ...block };
}

async function translateSections(tl) {
  const out = [];
  for (const sec of sourceSections) {
    process.stdout.write(`  section: ${sec.id}\n`);
    const title = await translateString(sec.title, tl);
    const summary = await translateString(sec.summary, tl);
    const blocks = [];
    for (const b of sec.blocks) {
      blocks.push(await translateBlock(b, tl));
    }
    out.push({ ...sec, title, summary, blocks });
  }
  return out;
}

await mkdir(genDir, { recursive: true });

for (const [code, tl] of TARGETS) {
  process.stdout.write(`\n=== ${code} (${tl}) ===\n`);
  const uiOut = await translateUi(tl);
  await writeFile(path.join(uiDir, `${code}.json`), JSON.stringify(uiOut, null, 2), "utf8");
  const secOut = await translateSections(tl);
  await writeFile(path.join(genDir, `${code}.json`), JSON.stringify(secOut, null, 2), "utf8");
}

process.stdout.write("\nDone. Review JSON for obvious MT issues.\n");

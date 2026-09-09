/**
 * optimize-images.mjs
 *
 * Erzeugt aus den Original-JPGs die WebP- und AVIF-Ableitungen in
 * den Breiten, die _data/profile.yml und _data/lab.yml angeben.
 *
 * Aufruf:
 *     npm install sharp
 *     node tools/optimize-images.mjs
 *
 * Läuft auch als Workflow (.github/workflows/optimize-images.yml),
 * damit du dafür kein Node auf dem eigenen Rechner brauchst.
 *
 * Nach dem ersten erfolgreichen Lauf in _data/site.yml
 * features.responsive_images auf true setzen — dann liefert
 * _includes/img.html <picture> mit srcset statt der Original-JPGs.
 */

import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Die Bildliste steht in den Datendateien, nicht hier — sonst gäbe
   es zwei Wahrheiten darüber, welche Größen gebraucht werden. */
function photoFrom(yamlFile) {
  const text = readFileSync(join(ROOT, "_data", yamlFile), "utf8");
  const block = text.match(/^photo:\n((?:[ \t]+.*\n)+)/m);
  if (!block) return null;

  const get = (key) => {
    const m = block[1].match(new RegExp(`^\\s+${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
  };
  const widths = get("widths");
  return {
    fallback: get("fallback"),
    src: get("src"),
    widths: widths ? JSON.parse(widths) : [],
  };
}

const photos = [photoFrom("profile.yml"), photoFrom("lab.yml")].filter(Boolean);

for (const p of photos) {
  const input = join(ROOT, p.fallback.replace(/^\//, ""));
  if (!existsSync(input)) {
    console.warn(`Übersprungen, Original fehlt: ${p.fallback}`);
    continue;
  }
  const outDir = join(ROOT, dirname(p.src.replace(/^\//, "")));
  mkdirSync(outDir, { recursive: true });

  for (const w of p.widths) {
    const base = join(ROOT, p.src.replace(/^\//, "")) + `-${w}`;
    await sharp(input).rotate().resize({ width: w }).webp({ quality: 78 }).toFile(`${base}.webp`);
    await sharp(input).rotate().resize({ width: w }).avif({ quality: 55 }).toFile(`${base}.avif`);
    console.log(`${p.src}-${w}: webp + avif`);
  }
}

/* ── Vorschaubild für geteilte Links ─────────────────────────────
   1200 × 630 ist das Format, das LinkedIn, WhatsApp und Co. erwarten.
   Name, Rolle und Domain kommen aus profile.yml und site.yml, damit
   das Bild nicht zur zweiten Wahrheit wird. Gezeichnet als SVG und
   von sharp gerastert — so bleibt es ohne Schriftdatei auskömmlich,
   weil nur wenige, große Zeilen darauf stehen. */
function field(file, key) {
  const text = readFileSync(join(ROOT, "_data", file), "utf8");
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
}

const name = field("profile.yml", "name");
const role = field("profile.yml", "role");
const domain = field("site.yml", "domain");

/* Die Farben stammen aus design.yml — dieselbe Palette wie die Seite. */
function token(group, key) {
  const text = readFileSync(join(ROOT, "_data", "design.yml"), "utf8");
  const block = text.match(new RegExp(`^  ${group}:\\n((?:    .*\\n)+)`, "m"));
  if (!block) return "#000000";
  const m = block[1].match(new RegExp(`^\\s+${key}:\\s*"?(#[0-9a-fA-F]{3,8})"?`, "m"));
  return m ? m[1] : "#000000";
}
const bg = token("dark", "bg");
const ink = token("dark", "ink");
const accent = token("dark", "accent");
const muted = token("dark", "ink-muted");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <g fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.85">
    <circle cx="880" cy="315" r="12"/><circle cx="1010" cy="230" r="10"/>
    <circle cx="1010" cy="400" r="10"/><circle cx="1120" cy="315" r="16"/>
    <path d="M892 309 998 235M892 321l106 74M1022 236l84 70M1022 394l84-70"/>
  </g>
  <rect x="80" y="146" width="4" height="338" fill="${accent}"/>
  <text x="128" y="250" fill="${ink}" font-family="Georgia,serif" font-size="86" font-weight="700">${esc(name)}</text>
  <text x="128" y="322" fill="${muted}" font-family="Helvetica,Arial,sans-serif" font-size="38">${esc(role)}</text>
  <text x="128" y="452" fill="${accent}" font-family="Courier New,monospace" font-size="30" letter-spacing="2">${esc(domain)}</text>
</svg>`;

await sharp(Buffer.from(og)).png({ quality: 90 }).toFile(join(ROOT, "assets", "img", "og-default.png"));
console.log("/assets/img/og-default.png: 1200x630");

console.log("\nFertig. Jetzt in _data/site.yml features.responsive_images auf true setzen.");

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

console.log("\nFertig. Jetzt in _data/site.yml features.responsive_images auf true setzen.");

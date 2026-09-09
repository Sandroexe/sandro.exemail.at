/**
 * import-linkedin.mjs
 *
 * ─────────────────────────────────────────────────────────────────
 *  Wichtig vorweg: LinkedIn bietet für Privatpersonen KEINE offene
 *  API, über die sich das eigene Profil auslesen ließe. Ein
 *  Live-Import ist deshalb technisch nicht möglich — wer etwas
 *  anderes behauptet, meint entweder Scraping (gegen die Nutzungs-
 *  bedingungen) oder eine Partner-API, die man als Privatperson
 *  nicht bekommt.
 *
 *  Der offizielle Weg ist der Datenexport:
 *    1. linkedin.com öffnen → Ich → Einstellungen und Datenschutz
 *    2. Datenschutz → "Kopie Ihrer Daten erhalten"
 *    3. "Größere Datei mit Ihren Aktivitäten …" wählen oder gezielt
 *       Positions, Education und Skills ankreuzen
 *    4. Anfordern; LinkedIn schickt nach ein paar Minuten bis 24
 *       Stunden eine E-Mail mit dem ZIP-Download
 * ─────────────────────────────────────────────────────────────────
 *
 * Aufruf:
 *     node tools/import-linkedin.mjs ~/Downloads/Basic_LinkedInDataExport.zip
 *
 * Das Skript SCHREIBT NICHTS von sich aus. Es zeigt einen Diff
 * gegen _data/cv.yml und legt den Vorschlag unter
 * _data/cv.linkedin.yml ab. Was davon übernommen wird, entscheidest
 * du — deine handgeschriebenen Beschreibungen und die englischen
 * Fassungen sind dem Export nämlich unbekannt und gingen sonst
 * verloren.
 *
 * Ohne Abhängigkeiten: Node 20 bringt alles mit, was gebraucht wird.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CV_PATH = join(ROOT, "_data", "cv.yml");
const OUT_PATH = join(ROOT, "_data", "cv.linkedin.yml");

const zipPath = process.argv[2];
if (!zipPath) {
  console.error("Aufruf: node tools/import-linkedin.mjs <pfad-zum-export.zip>");
  console.error("Wie du den Export bei LinkedIn anforderst, steht oben in dieser Datei.");
  process.exit(1);
}
if (!existsSync(zipPath)) {
  console.error(`Datei nicht gefunden: ${zipPath}`);
  process.exit(1);
}

/* ── ZIP auspacken ────────────────────────────────────────────────
   Über das systemeigene unzip bzw. tar, statt eine Bibliothek zu
   ziehen. Beides ist auf macOS, Linux und in Git Bash vorhanden. */
const dir = mkdtempSync(join(tmpdir(), "li-"));
try {
  execFileSync("unzip", ["-o", "-q", zipPath, "-d", dir], { stdio: "inherit" });
} catch {
  execFileSync("tar", ["-xf", zipPath, "-C", dir], { stdio: "inherit" });
}

/* ── CSV lesen ───────────────────────────────────────────────────
   LinkedIn liefert Kommas und Anführungszeichen in Feldern; ein
   naives split(",") zerlegt genau die Zeilen falsch, auf die es
   ankommt. Deshalb ein echter kleiner Parser. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }

  if (!rows.length) return [];
  const head = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

function readCsv(name) {
  for (const candidate of [name, name.replace(".csv", "") + ".csv"]) {
    const p = join(dir, candidate);
    if (existsSync(p)) return parseCsv(readFileSync(p, "utf8"));
  }
  console.warn(`  Hinweis: ${name} war nicht im Export enthalten.`);
  return [];
}

/* "Sep 2022" oder "2022-09-01" → "2022-09" */
const MONTHS = { jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",
                 jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12" };
function toYearMonth(value) {
  if (!value) return null;
  const s = value.trim();
  let m = s.match(/^([A-Za-z]{3})\w*\s+(\d{4})$/);
  if (m) return `${m[2]}-${MONTHS[m[1].toLowerCase()] || "01"}`;
  m = s.match(/^(\d{4})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}`;
  m = s.match(/^(\d{4})$/);
  if (m) return `${m[1]}-01`;
  return null;
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

function yamlString(s) {
  return JSON.stringify(String(s ?? ""));
}

console.log(`\nExport wird gelesen: ${zipPath}\n`);

const positions = readCsv("Positions.csv");
const education = readCsv("Education.csv");
const skills = readCsv("Skills.csv");

const experience = positions.map((p) => ({
  id: slug(p["Company Name"] + "-" + p["Title"]),
  start: toYearMonth(p["Started On"]),
  end: toYearMonth(p["Finished On"]),
  title: p["Title"],
  org: p["Company Name"],
  place: p["Location"] || "",
  description: (p["Description"] || "").replace(/\s+/g, " ").trim(),
}));

const schooling = education.map((e) => ({
  id: slug(e["School Name"]),
  start: toYearMonth(e["Start Date"]),
  end: toYearMonth(e["End Date"]),
  title: e["Degree Name"] || "",
  org: e["School Name"],
  description: (e["Notes"] || "").replace(/\s+/g, " ").trim(),
}));

/* ── YAML-Vorschlag schreiben ───────────────────────────────────── */
let out = `# Aus dem LinkedIn-Datenexport erzeugt am ${new Date().toISOString().slice(0, 10)}.
#
# Das ist ein VORSCHLAG, keine fertige Datei. Übernimm daraus in
# _data/cv.yml, was dir fehlt — und behalte deine eigenen
# Beschreibungen sowie alle *_en-Felder, die LinkedIn nicht kennt.

education:
`;
for (const e of schooling) {
  out += `  - id: ${e.id}\n    start: ${yamlString(e.start)}\n    end: ${e.end ? yamlString(e.end) : "null"}\n`;
  out += `    title: ${yamlString(e.title)}\n    org: ${yamlString(e.org)}\n`;
  if (e.description) out += `    description: ${yamlString(e.description)}\n`;
}
out += `\nexperience:\n`;
for (const e of experience) {
  out += `  - id: ${e.id}\n    start: ${yamlString(e.start)}\n    end: ${e.end ? yamlString(e.end) : "null"}\n`;
  out += `    title: ${yamlString(e.title)}\n    org: ${yamlString(e.org)}\n`;
  if (e.place) out += `    place: ${yamlString(e.place)}\n`;
  if (e.description) out += `    description: ${yamlString(e.description)}\n`;
}
if (skills.length) {
  out += `\n# Skills aus dem Export — profile.yml erwartet zusätzlich level und rating.\n`;
  for (const s of skills) out += `#   - ${s["Name"] || Object.values(s)[0]}\n`;
}
writeFileSync(OUT_PATH, out, "utf8");

/* ── Diff gegen den Ist-Stand ───────────────────────────────────── */
const current = existsSync(CV_PATH) ? readFileSync(CV_PATH, "utf8") : "";
const known = new Set([...current.matchAll(/^\s+id:\s*([A-Za-z0-9_-]+)/gm)].map((m) => m[1]));

const incoming = [...schooling, ...experience];
const isNew = incoming.filter((e) => !known.has(e.id));

console.log("─────────────────────────────────────────────────────────");
console.log(`Gefunden: ${schooling.length} Ausbildungen, ${experience.length} Positionen, ${skills.length} Skills`);
console.log(`Vorschlag geschrieben nach: _data/cv.linkedin.yml`);
console.log("");
if (isNew.length === 0) {
  console.log("Nichts Neues — dein cv.yml kennt bereits alle Stationen aus dem Export.");
} else {
  console.log(`${isNew.length} Station(en) stehen noch NICHT in _data/cv.yml:`);
  for (const e of isNew) {
    console.log(`  + ${e.start || "?"} – ${e.end || "heute"}  ${e.title} @ ${e.org}`);
  }
  console.log("");
  console.log("Übertrag von Hand — dabei description_en und title_en ergänzen,");
  console.log("die der Export nicht mitliefert.");
}
console.log("─────────────────────────────────────────────────────────");

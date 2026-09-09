/**
 * sync-github.mjs
 *
 * Liest _data/github.yml, holt die öffentlichen Repos über die
 * GitHub-REST-API und schreibt das Ergebnis normalisiert nach
 * _data/github.json.
 *
 * Wichtig: Bei einem Fehler wird die bestehende github.json NICHT
 * angefasst. Lieber zeigt die Website etwas ältere Daten, als dass
 * sie leer dasteht.
 *
 * Lauf:  node tools/sync-github.mjs
 * Nötig: Umgebungsvariable GITHUB_TOKEN (im Workflow aus secrets).
 *        Ohne Token funktioniert es auch, dann aber mit dem
 *        niedrigen Limit für anonyme Zugriffe.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "_data", "github.yml");
const OUT_PATH = join(ROOT, "_data", "github.json");

/* ── Ein sehr kleiner YAML-Leser ──────────────────────────────────
   Reicht genau für github.yml und erspart eine Abhängigkeit. Er
   versteht Schlüssel/Wert, einfache Listen und eine Ebene
   Verschachtelung — mehr braucht die Datei nicht. */
function readConfig(text) {
  const out = {};
  let pending = null; // Schlüssel, dessen Kinder gerade folgen

  for (const raw of text.split(/\r?\n/)) {
    // Kommentar am Zeilenende abschneiden, aber nicht innerhalb von
    // Anführungszeichen (Farbwerte wie "#f1e05a" beginnen mit #).
    const line = raw.replace(/\s+#(?![0-9a-fA-F]{3,8}\b).*$/, "").trimEnd();
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const isChild = /^\s/.test(line);

    if (isChild && pending) {
      if (trimmed.startsWith("- ")) {
        // Erstes Kind entscheidet: das hier ist eine Liste.
        if (!Array.isArray(out[pending])) out[pending] = [];
        out[pending].push(parseScalar(trimmed.slice(2)));
      } else {
        const i = trimmed.indexOf(":");
        if (i === -1) continue;
        if (Array.isArray(out[pending]) || out[pending] === null) out[pending] = {};
        const k = trimmed.slice(0, i).trim().replace(/^["']|["']$/g, "");
        out[pending][k] = parseScalar(trimmed.slice(i + 1));
      }
      continue;
    }

    const i = trimmed.indexOf(":");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const value = trimmed.slice(i + 1).trim();

    if (value === "") {
      out[key] = null; // Art (Liste oder Map) klärt das erste Kind
      pending = key;
    } else {
      out[key] = parseScalar(value);
      pending = null;
    }
  }

  // Schlüssel ohne Kinder bleiben nicht als null stehen.
  for (const k of Object.keys(out)) if (out[k] === null) out[k] = [];
  return out;
}

function parseScalar(v) {
  const s = String(v).trim().replace(/^["']|["']$/g, "");
  if (s === "true") return true;
  if (s === "false") return false;
  if (s !== "" && !isNaN(Number(s))) return Number(s);
  return s;
}

async function api(path, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sandro-exemail-at-sync",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${res.statusText} bei ${path}`);
  }
  return res.json();
}

async function main() {
  const cfg = readConfig(readFileSync(CONFIG_PATH, "utf8"));
  const token = process.env.GITHUB_TOKEN || "";
  const user = cfg.username;
  if (!user) throw new Error("username fehlt in _data/github.yml");

  const excludeRepos = new Set((cfg.exclude_repos || []).map((s) => String(s).toLowerCase()));
  const excludeTopics = new Set((cfg.exclude_topics || []).map((s) => String(s).toLowerCase()));
  const featuredTopics = new Set((cfg.featured_topics || []).map((s) => String(s).toLowerCase()));

  // Alle Seiten einsammeln, nicht nur die erste.
  let page = 1;
  let raw = [];
  while (page <= 5) {
    const batch = await api(`/users/${user}/repos?per_page=100&sort=pushed&page=${page}`, token);
    raw = raw.concat(batch);
    if (batch.length < 100) break;
    page++;
  }

  const repos = raw
    .filter((r) => {
      if (!cfg.include_forks && r.fork) return false;
      if (!cfg.include_archived && r.archived) return false;
      if (r.private) return false;
      if (excludeRepos.has(String(r.name).toLowerCase())) return false;
      const topics = (r.topics || []).map((t) => t.toLowerCase());
      if (topics.some((t) => excludeTopics.has(t))) return false;
      return true;
    })
    .map((r) => ({
      name: r.name,
      full_name: r.full_name,
      description: r.description || "",
      html_url: r.html_url,
      // Zwei Repos tragen auf GitHub eine http://-Homepage. Unverändert
      // übernommen landet ein unverschlüsselter Link auf der Seite, den
      // HTMLProofer zu Recht ablehnt. Deshalb hier normalisieren, statt
      // es auf jedem Repo einzeln nachzuziehen.
      homepage: (r.homepage || "").replace(/^http:\/\//i, "https://"),
      language: r.language || "",
      topics: r.topics || [],
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      pushed_at: r.pushed_at,
      created_at: r.created_at,
      featured: (r.topics || []).some((t) => featuredTopics.has(t.toLowerCase())),
    }));

  const sort = cfg.sort || "pushed";
  repos.sort((a, b) => {
    if (sort === "stars") return b.stargazers_count - a.stargazers_count;
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(b.pushed_at) - new Date(a.pushed_at);
  });

  const limited = repos.slice(0, cfg.max_items || 30);

  // Sprachverteilung über die sichtbaren Repos — reicht für eine
  // ehrliche Übersicht und kostet keine zusätzlichen API-Aufrufe.
  const langCount = {};
  for (const r of limited) {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  }

  const out = {
    generated_at: new Date().toISOString(),
    username: user,
    stats: {
      public_repos: limited.length,
      total_stars: limited.reduce((sum, r) => sum + r.stargazers_count, 0),
      languages: Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    },
    repos: limited,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`${limited.length} Repos nach _data/github.json geschrieben.`);
}

main().catch((err) => {
  // Bewusst ohne Schreibzugriff: die alte github.json bleibt stehen.
  console.error("Synchronisation fehlgeschlagen:", err.message);
  console.error("_data/github.json wurde nicht verändert.");
  process.exit(1);
});

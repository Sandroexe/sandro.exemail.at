# Plan — Neubau sandro.exemail.at

**Branch:** `rebuild/v2` · **Stand:** 2026-09-09 · **Status:** wartet auf Freigabe

---

## 1. Dateistruktur

```
.
├── CNAME                      # sandro.exemail.at — unverändert
├── _config.yml                # nur Jekyll-Technik, keine Inhalte
├── CLAUDE.md                  # Projektkonventionen
├── README.md
├── index.html                 # Startseite (nur Front Matter + Includes)
├── 404.html
├── cv.html                    # permalink /cv/
├── projects.html              # permalink /projects/
├── certificates.html          # permalink /certificates/
├── lab.html                   # permalink /lab/
├── links.html                 # permalink /links/
├── contact/index.html         # /contact/  ← Visitenkarte
├── impressum.html             # permalink /impressum/
├── impressum/social.html      # permalink /impressum/social/
├── datenschutz.html           # permalink /datenschutz/
├── vcard.vcf                  # generiert aus contact.yml + social.yml
├── robots.txt
├── _data/                     # ← die einzige Wahrheit (siehe Abschnitt 2)
├── _includes/
├── _layouts/
├── _sass/  bzw. assets/css/
├── assets/
│   ├── css/main.scss          # importiert Tokens aus design.yml
│   ├── js/                    # theme.js, i18n.js, reveal.js, filter.js, contact.js, egg.js
│   ├── fonts/                 # self-hosted WOFF2, subgesetzt
│   └── img/                   # WebP/AVIF-Derivate
├── tools/
│   ├── import-linkedin.mjs    # LinkedIn-Datenexport → cv.yml
│   └── optimize-images.mjs    # JPG → WebP/AVIF + srcset-Größen
├── .github/workflows/
│   ├── sync-github.yml
│   ├── build-check.yml
│   └── lighthouse.yml
└── docs/
    ├── INVENTAR.md            # ✓ fertig
    ├── PLAN.md                # diese Datei
    ├── PFLEGE.md
    └── ARCHITEKTUR.md
```

**Regel für Seitendateien:** Front Matter plus Include-Aufrufe. Kein `<style>`, kein Inline-CSS, kein Fließtext. Prüfbar mit `grep -rl "<style" *.html` → muss leer sein.

---

## 2. Datenmodell

### `site.yml`

```yaml
domain: sandro.exemail.at
url: https://sandro.exemail.at
default_lang: de
languages: [de, en]
meta:
  og_image: /assets/img/og-default.png
  twitter_card: summary_large_image
  theme_color_light: "#faf8f5"
  theme_color_dark: "#12100e"
features:
  easter_egg: true          # zentraler Ein/Aus-Schalter
  github_sync: true
  credly_sync: false
```

### `profile.yml`

```yaml
name: Sandro Exenberger
given_name: Sandro
family_name: Exenberger
role: Elektronik & Netzwerktechnik
role_en: Electronics & Network Engineering
location: Schwoich, Tirol
photo: /assets/img/profile
birth_year: "TODO: Geburtsjahr — nur falls du es öffentlich zeigen willst"
bio_short: …
bio_long: …
skills:
  - { key: linux,    label: Linux / Debian & CachyOS, level: 88, rating: Fortgeschritten }
  - { key: iot,      label: IoT & Elektronik,          level: 75, rating: Erfahren }
  - { key: python,   label: Chatbot & Python,          level: 80, rating: Fortgeschritten }
  - { key: hardware, label: Hardware / Maker,          level: 72, rating: Erfahren }
```

### `social.yml` — dein verbindliches Schema, um `context` erweitert

```yaml
contexts:
  - id: private
    name: Private Kanäle
    responsible: Sandro Exenberger
    blattlinie: "TODO: Blattlinie — siehe Rückfrage 3"
    subject: "Persönliches Portfolio, IT- und Elektronik-Projekte"
  - id: schuelerunion
    name: Schulpolitisches Engagement
    responsible: "TODO: siehe Rückfrage 4"
    blattlinie: "TODO"
    subject: "TODO"

channels:
  - id: github
    name: GitHub
    handle: "@Sandroexe"
    url: https://github.com/Sandroexe
    icon: github
    color: "#ffffff"
    context: private
    show_in: { footer: true, links: true, impressum: true }
    impressum:
      content_type: "Technische Projekte, Quellcode"
```

`contexts` trägt die Verantwortlichkeit **einmal**, `channels` verweist per `context:` darauf — statt sie je Kanal zu wiederholen. Ein neuer Kanal = ein Eintrag unter `channels`, sonst nichts.

**Speist automatisch:** Footer-Icons · `/links/` · `/impressum/social/` · JSON-LD `sameAs` · `/contact/` · `vcard.vcf` · OpenGraph.

### `design.yml` → CSS-Custom-Properties

```yaml
color:
  light: { bg: "#faf8f5", surface: "#ffffff", ink: "#1a1714", accent: "#c2410c", … }
  dark:  { bg: "#12100e", surface: "#1c1917", ink: "#f5f0e8", accent: "#fb923c", … }
space:  { 3xs: 0.25rem, …, 3xl: 8rem }
radius: { sm: 4px, md: 10px, lg: 20px, pill: 999px }
type:
  display: { family: "Fraunces", weights: [400, 700] }
  body:    { family: "Inter", weights: [400, 500, 600] }
  mono:    { family: "JetBrains Mono", weights: [400] }
  scale:   { step--1: 0.833rem, step-0: 1rem, …, step-6: 4.2rem }
motion: { fast: 120ms, base: 240ms, slow: 480ms, ease: "cubic-bezier(.2,.8,.2,1)" }
breakpoint: { sm: 480px, md: 768px, lg: 1100px, xl: 1400px }
```

Eine einzige Datei `assets/css/_tokens.scss` iteriert darüber und schreibt Custom Properties. Prüfbar: `grep -rE "#[0-9a-fA-F]{3,6}" --include=*.html --include=*.scss` findet außerhalb von `design.yml` nichts.

### Weitere Dateien

`contact.yml` · `navigation.yml` · `cv.yml` · `certificates.yml` · `projects.yml` · `lab.yml` · `legal.yml` · `redirects.yml` · `github.yml` (Steuerung) · `github.json` (generiert) · `i18n/de.yml` · `i18n/en.yml`

---

## 3. Design — drei Richtungen

### A · „Werkstattpapier" ⭐ Empfehlung

| | |
|---|---|
| **Idee** | Warmes Papier statt Bildschirm. Deine Inhalte sind handfest — Kabel, Platinen, Racks. Das Design gibt ihnen einen ruhigen, gedruckten Untergrund statt sie in Neon zu tauchen. |
| **Hell** | Papier `#faf8f5`, Tinte `#1a1714`, Akzent gebranntes Orange `#c2410c`, Linien `#e5ded4` |
| **Dunkel** | Rußschwarz `#12100e`, Creme `#f5f0e8`, Akzent Amber `#fb923c` |
| **Typografie** | **Fraunces** (Display, optische Achse, leicht schrullig-technisch) + **Inter** (Text) + **JetBrains Mono** für Specs, IPs, Hardware-Tabellen |
| **Layout** | 12-Spalten-Raster, sichtbar dünne Trennlinien wie in einem Datenblatt, breite Ränder, asymmetrischer Hero (Text zwei Drittel links, Profilbild versetzt rechts, überlappt die Rasterkante) |
| **Bewegung** | Zurückhaltend: Zeilen steigen 12 px auf beim Scroll-Reveal, Hover unterstreicht mit einer Linie, die von links wächst; View Transitions für Seitenwechsel |
| **Hero** | Animiertes SVG-Netzwerkdiagramm — Knoten und Kanten deines Home-Labs zeichnen sich einmal, dann pulsen Datenpakete auf den Kanten. Vektor, ~4 KB, kein Three.js |
| **Warum** | Unverwechselbar, altert nicht, trägt Dark und Light gleich gut, druckt sich hervorragend (wichtig für `/cv/`), und maximal weit weg vom alten Neon-Blau |

### B · „Schaltplan"

Technisches Blau-Grau (`#0f172a` / `#f1f5f9`), Akzent Cyan `#06b6d4`. **Space Grotesk** + **IBM Plex Sans**. Layout auf einem sichtbaren feinen Raster, Karten mit Eckmarkierungen wie Leiterplatten-Fiducials, Verbindungslinien zwischen Sektionen. Bewegung: Linien zeichnen sich beim Scroll. — Ehrlich zum Thema, aber näher am alten Look und in der IT-Portfolio-Welt häufiger.

### C · „Editorial Brutal"

Schwarz/Weiß, ein einziger Signalton (Signalrot `#e11d48`). **Archivo Black** in sehr großen Graden + **Source Serif** als Lesetext. Extreme Größenkontraste, Text bricht bewusst über Rasterkanten, kaum Farbe, keine Karten — Typografie trägt alles. Bewegung: harte Schnitte, Text-Masken. — Sehr eigenständig und mutig, aber die Zertifikats- und Hardware-Tabellen fügen sich schwerer ein.

> **Empfehlung: A.** Es ist das einzige der drei, das gleichzeitig eigenständig, druckfähig und für Datentabellen (Lab, Zertifikate, CV) gut geeignet ist — und es entfernt sich am weitesten vom Altstand, ohne zum Selbstzweck zu werden.

**Easter Egg zu A:** `traceroute`-Spiel. Tippt man irgendwo `mtr` oder klickt fünfmal auf den Netzwerk-Knoten im Hero, läuft ein simulierter Traceroute von deinem Browser durch die Stationen deines Lebenslaufs (Hop 1 Volksschule Schwoich, Hop 7 HTL Anichstraße …) mit echt wirkenden Latenzen. Passt zu CCNA/Netzwerk, nutzt vorhandene `cv.yml`-Daten, ist ~2 KB JS und über `site.yml → features.easter_egg` abschaltbar.

---

## 4. Seitenliste

| URL | Quelle | Besonderheit |
|---|---|---|
| `/` | profile, cv, projects, github.json | Hero-SVG, Skills, Featured-Projekte, CV-Kurzform |
| `/projects/` | projects.yml + github.json | Filter, Suche, Sortierung — ohne JS ungefiltert vollständig |
| `/cv/` | cv.yml | Timeline, `@media print`, PDF-Link |
| `/certificates/` | certificates.yml | Verify-Links |
| `/lab/` | lab.yml | Spec-Tabellen |
| `/links/` | social.yml | vollständig generiert |
| `/contact/` | contact.yml + social.yml | Formular, vCard, QR-Code |
| `/impressum/` | legal.yml | verlinkt prominent auf `/impressum/social/` |
| `/impressum/social/` | social.yml + legal.yml | pro `context` ein Abschnitt, Copy-Button |
| `/datenschutz/` | legal.yml | ohne „externe Dienste"-Absatz |
| `/404.html` | navigation.yml | hilfreiche Weiterleitung |
| 8 Redirect-Seiten | redirects.yml | Meta-Refresh + Canonical + JS |

---

## 5. Was ich ehrlich einschränken muss

1. **Kein lokaler Build.** Auf diesem Rechner sind weder Ruby/Jekyll noch Node oder Python installiert. Ich kann den Build hier **nicht** ausführen. Verifikation läuft deshalb über GitHub Actions (`build-check.yml` mit `jekyll build` + HTMLProofer, `lighthouse.yml`) — die Ergebnisse sind echt und nachprüfbar, kommen aber erst nach dem Push. Alternativ installierst du Ruby+Jekyll lokal, dann dokumentiere ich den Weg in der README. **Sag mir, was dir lieber ist.**
2. **LinkedIn-Live-Import gibt es nicht.** Bestätigt: keine offene API für private Profile. Der Weg über den offiziellen Datenexport (`tools/import-linkedin.mjs`) ist die einzige realistische Lösung — und läuft manuell, nicht automatisch.
3. **Lighthouse ≥ 95 in allen vier Kategorien** ist mit diesem Ansatz realistisch. Falls eine Kategorie hängen bleibt, melde ich das mit Zahlen statt es zu beschönigen.
4. **Rechtstexte sind keine Rechtsberatung.** Ich baue § 5 ECG, § 14 UGB, § 25 MedienG und DSGVO-Verweis fachlich sauber ein, aber die inhaltliche Verantwortung bleibt bei dir.

---

## 6. Offene Fragen — dafür brauche ich dich

| # | Frage | Warum |
|---|---|---|
| 1 | **Straße und Hausnummer** in Schwoich? | § 5 ECG verlangt die vollständige geografische Anschrift. „6334 Schwoich" allein genügt nicht. Wenn du deine Privatadresse nicht öffentlich zeigen willst, ist eine Zustelladresse/Postfach die übliche Alternative — sag mir, welchen Weg du gehst. |
| 2 | **Geburtsjahr** in `profile.yml` aufnehmen? | Du hast es in deinem Vorschlag genannt. Ich rate es nicht — sag Ja mit Jahr, oder Nein. |
| 3 | **Blattlinie** deiner privaten Kanäle? | § 25 MedienG. Vorschlag zum Abnicken: *„Persönliche Website und Social-Media-Kanäle zur Darstellung eigener Projekte, Ausbildung und Interessen aus den Bereichen Elektronik, Netzwerktechnik und Linux."* |
| 4 | **Schülerunion-Kanäle:** betreibst du welche selbst? | Nur wenn ja, kommt der zweite Kontext auf `/impressum/social/`. Falls ja: welche Kanäle, wer ist medienrechtlich verantwortlich, und welche Blattlinie? |
| 5 | **Lebenslauf-PDF** — hast du eines, oder soll `/cv/` per Druck-Stylesheet das PDF sein? | Im Repo liegt keines. Letzteres halte ich für besser: eine Quelle, nie veraltet. |
| 6 | **Design A, B oder C?** | Ohne diese Entscheidung geht Phase 2 nicht los. |

---

## 7. TODO-Liste (Stand jetzt)

- `TODO 1` Straße/Hausnummer → `legal.yml`, `contact.yml`, vCard
- `TODO 2` Geburtsjahr → `profile.yml`
- `TODO 3` Blattlinie privat → `social.yml`
- `TODO 4` Schülerunion-Kontext → `social.yml`
- `TODO 5` Lebenslauf-PDF → `/cv/`
- `TODO 6` `pc-setup.jpg` (2,6 MB) und `profile.jpg` (770 KB) neu ausspielen

---

**Nächster Schritt:** Deine Freigabe zu Abschnitt 3 (Design) und Antworten auf Abschnitt 6. Danach starte ich Phase 2.

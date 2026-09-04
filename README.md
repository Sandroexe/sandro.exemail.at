# 🌐 sandro.exemail.at · Portfolio von Sandro Exenberger

> **"All Systems Operational."** 🟢

Digitales Portfolio, Visitenkarte und Projekt-Showcase aus den Bereichen
**Netzwerktechnik (CCNA)**, **Linux**, **Elektronik** und **Self-Hosting**.
Statisch generiert mit **Jekyll** und ausgeliefert über **GitHub Pages**.

---

## 🏗️ Architektur – modular, ohne Code-Duplikate

Alle wiederkehrenden Inhalte liegen zentral. Eine Änderung propagiert
automatisch auf die gesamte Website.

```text
_data/
  socials.yml          # ALLE Kontaktdaten, Social-Links, Icons, Farben  ← single source of truth
  navigation.yml       # Menüstruktur (Header + Footer)
  certificates.yml     # Zertifikate (Loop in certificates.html)
  projects.yml         # Projekte (Loop in projects.html)
  locales/de.yml       # Sprachkatalog Deutsch  ┐ identische Schlüssel
  locales/en.yml       # Sprachkatalog Englisch  ┘

_includes/
  head.html            # Meta-Tags, OpenGraph, Fonts, CSS, JSON-LD
  lang-init.html       # blockierendes Mini-Skript: Sprache erkennen (localStorage
                       #   'preferred_language' → navigator.language) & <html lang> setzen
  t.html               # Übersetzungs-Helfer  {% include t.html key="…" %}
  header.html          # Seitenkopf → bindet nav.html ein
  nav.html             # Responsive Navigation (Blur, Mobile-Menü, DE|EN-Umschalter)
  footer.html          # Globaler Footer (Socials + Recht aus _data/)
  social-links.html    # Wiederverwendbare Link-Ausgabe (icons | buttons | list)
  icon.html            # Zentrale SVG-Icon-Bibliothek
  github-activity.html # Contribution-Heatmap (index + projects)

_layouts/
  default.html         # Globales Grundgerüst (Hintergrund, Header, Main, Footer)

assets/
  js/main.js           # Mobile-Nav, Sprache, Scroll-Reveal, Skill-Bars, To-Top
  js/github-activity.js # Datenabruf + Rendering der Heatmap (Tailwind-Klassen)
```

## 📄 Seiten (feste URLs – nicht umbenennen!)

| Route | Inhalt |
| :--- | :--- |
| `/index.html` | Hero, Über mich, Tech-Stack, GitHub-Aktivität, Lebenslauf, Terminal |
| `/projects.html` | Projekt-Showcase + Contribution-Heatmap |
| `/certificates.html` | Zertifikate & Kurse (CCNA, LPIC-1, IoT, KI, Soft Skills) |
| `/lab.html` | Workstation, Hardware- & Software-Setup |
| `/links.html` | Digitale Visitenkarte / Linktree — **gedruckt auf Visitenkarten** |
| `/contact/` | Kontaktformular (→ `api.exemail.at`) + Alternativwege |
| `/impressum.html`, `/datenschutz.html` | Rechtliches |
| `/404.html` | Fehlerseite |

## 🌍 Zweisprachigkeit (DE / EN)

- Alle Texte liegen zentral in `_data/locales/{de,en}.yml` (identische Schlüssel).
- `t.html` rendert je String ein Element mit `data-de` **und** `data-en`; der
  Client-Umschalter in `assets/js/main.js` tauscht den sichtbaren Text zur Laufzeit
  (kein Reload, eine URL – gedruckte `links.html`-Links funktionieren immer).
- **Automatik:** `lang-init.html` prüft beim Laden `localStorage('preferred_language')`,
  fällt sonst auf `navigator.language` zurück (`de*` → Deutsch, sonst Englisch) und
  setzt `<html lang>`.
- **Manuell:** eleganter `DE | EN`-Schalter im Header; die Wahl wird sofort in
  `localStorage` gespeichert.

## 🎨 Design (v4 · Tailwind, hell)

Kein eigenes CSS-Framework mehr – Styling läuft komplett über **Tailwind CSS**
(offizielle Play-CDN, eingebunden in `_includes/head.html`). Utility-Klassen
direkt im HTML; nur ~15 Zeilen `<style>` im Head für Scroll-Reveal, Scrollbar
und `prefers-reduced-motion`.

Look: warmes Off-White (`bg-slate-50`) mit Dot-Grid, reinweiße Cards
(`bg-white border-slate-200 shadow-card`), Royal-Blue-Akzent (`blue-600`),
Anthrazit-Headlines (`slate-900`). Bento-Grid, `hover:-translate-y-1`,
Scroll-Reveal. Schrift **Inter** + **JetBrains Mono** (Google Fonts),
Icons **Font Awesome 6** (CDN). Cache-Buster `?v=N` an JS/CDN.

## 🛠️ Lokal bauen

```bash
bundle install
bundle exec jekyll serve
```

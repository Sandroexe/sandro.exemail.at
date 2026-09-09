# sandro.exemail.at

Persönliche Portfolio-Website von Sandro Exenberger — Elektronik, Netzwerktechnik, Linux und Home Lab.

Jekyll auf GitHub Pages. Kein Framework, kein CDN, kein Tracking, keine Cookies.

## Was diese Seite besonders macht

Sie ist konsequent datengetrieben. Jede Information — jede Farbe, jede URL, jeder Satz — existiert **genau einmal** in einer YAML-Datei unter `_data/`. Die HTML-Dateien enthalten keinen Inhalt, sondern nur Aufrufe.

Praktisch heißt das: Ein neuer Social-Media-Kanal ist ein YAML-Eintrag und erscheint danach von selbst in der Fußzeile, auf der Linkseite, im Social-Media-Impressum, in den strukturierten Daten und in der digitalen Visitenkarte. Eine Farbänderung in einer Datei färbt die gesamte Seite um.

Dass das so bleibt, prüft ein Skript bei jedem Push — nicht nur die gute Absicht.

## Loslegen

Ändern willst du fast immer nur eine Datei in `_data/`. Welche das ist, steht in **[`docs/PFLEGE.md`](docs/PFLEGE.md)** — das ist die Datei, die du im Alltag brauchst.

| Ich will … | Datei |
|---|---|
| Social-Media-Kanal aufnehmen | `_data/social.yml` |
| Farben ändern | `_data/design.yml` |
| Lebenslauf ergänzen | `_data/cv.yml` |
| Zertifikat eintragen | `_data/certificates.yml` |
| GitHub-Repo verstecken | Topic `hide` auf GitHub setzen |

## Lokale Vorschau

Braucht Ruby:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Läuft dann auf `http://localhost:4000`.

Zwei Dinge funktionieren lokal nicht, und das ist normal: das Kontaktformular (die API erlaubt per CORS nur die echte Domain) und Links, die auf `sandro.exemail.at` zeigen.

Ohne Ruby: auf einen Branch pushen. `build-check` und `lighthouse` laufen dann in GitHub Actions und melden jedes Problem.

## Prüfen

```bash
bash tools/check-centralisation.sh
```

Findet Farben, Adressen, Telefonnummern und Social-URLs, die sich in eine Seite verirrt haben, sowie fehlende Übersetzungen.

## Aufbau

```
_data/         die einzige Wahrheit
_includes/     Bausteine, hier lebt die Logik
_layouts/      base → default → legal
assets/        CSS, JS, selbst gehostete Schriften
tools/         Sync, Import, Bildoptimierung, Prüfung
docs/          PFLEGE.md · ARCHITEKTUR.md · INVENTAR.md · PLAN.md
```

Wie die Daten auf die Seite kommen, steht in [`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md).

## Automatik

| Workflow | Wann | Was |
|---|---|---|
| GitHub-Repos synchronisieren | alle 6 Stunden | Schreibt `_data/github.json`; die Projektseite aktualisiert sich damit von selbst |
| Build & Link-Check | jeder Push | Jekyll-Build, HTMLProofer, Zentralisierungsprüfung |
| Lighthouse | Push auf `main` | Mobil-Messung, fällt unter Score 95 durch |
| Bilder optimieren | auf Zuruf | Erzeugt WebP und AVIF |

Ein neues öffentliches Repository erscheint innerhalb von sechs Stunden auf `/projects/`, ohne dass die Website angefasst werden muss. Steuern lässt sich das über Repo-Topics: `hide` versteckt, `featured` hebt auf die Startseite.

## Technik

- **Zweisprachig DE/EN** über `_data/i18n/`, umgeschaltet per CSS — funktioniert ohne JavaScript
- **Hell und Dunkel** beide vollständig gestaltet, kein Aufblitzen beim Laden
- **Ohne JavaScript** bleiben alle Inhalte lesbar und alle Links nutzbar
- **`prefers-reduced-motion`** schaltet nicht-essenzielle Bewegung ab
- **Selbst gehostete Schriften**, eigener Icon-Sprite, kein externer Aufruf
- **Druckansicht** für `/cv/` — das ist zugleich der PDF-Export

## Rechtliches

`/impressum/social/` ist eine eigenständige Offenlegungsseite für Social-Media-Profile, gebaut nach § 5 ECG und § 25 Mediengesetz. Sie wird vollständig aus `_data/social.yml` und `_data/legal.yml` erzeugt und gruppiert Kanäle nach Kontext, damit private und schulpolitische Kanäle getrennte Verantwortlichkeiten und Blattlinien tragen.

Die Rechtstexte sind sorgfältig aufgebaut, aber keine Rechtsberatung.

## Lizenz

Quellcode zur Ansicht. Inhalte, Texte und Bilder sind urheberrechtlich geschützt.

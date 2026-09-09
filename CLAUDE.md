# Projektkonventionen

Persönliches Portfolio von Sandro Exenberger auf `sandro.exemail.at`.
Jekyll auf GitHub Pages, HTML, CSS, Vanilla JavaScript. Kein Framework, kein Build-Schritt außer Jekyll.

## Die eine Regel

**Jede Information existiert genau einmal, in einer Datei unter `_data/`.**

Wenn du eine Farbe, eine URL, eine E-Mail-Adresse, einen Namen oder einen Satz Fließtext in eine `.html`-Datei schreibst, ist das ein Fehler — auch wenn es funktioniert. Solche Doppelungen driften auseinander, und genau davon wurde diese Seite befreit.

Vor jedem Commit:

```bash
bash tools/check-centralisation.sh
```

## Was das konkret heißt

**Seiten enthalten keinen Inhalt.** Eine Seitendatei besteht aus Front Matter und Include-Aufrufen. Kein `<style>`-Block, kein Fließtext, keine feste URL. Wenn du Inhalt brauchst, gehört er in `_data/` und wird von dort geholt.

**Text kommt nur über `t.html`.** Nie direkt schreiben:

```liquid
{% include t.html key="nav.projects" %}              <!-- UI-Beschriftung -->
{% include t.html de=item.title en=item.title_en %}  <!-- Inhalt aus _data -->
```

Für Attribute (`alt`, `aria-label`, `placeholder`) gibt es `t-plain.html` plus `data-i18n-attr="alt:key.name"`, damit `site.js` beim Sprachwechsel nachziehen kann.

**Farben und Größen kommen aus `design.yml`.** In `main.css` steht kein einziger Hex-Wert und keine feste Schriftgröße, nur `var(--…)`. Die Tokens entstehen ausschließlich in `_includes/critical.html`. Braucht ein Element eine neue Farbe, kommt sie nach `design.yml` — nicht ins Stylesheet.

Einzige erlaubte Ausnahme: inline `style="--brand:{{ ch.color }}"`. Das setzt keinen Gestaltungswert, sondern reicht einen Datenwert an CSS durch.

**Icons kommen aus dem Sprite.** `{% include icon.html name="github" %}`. Neue Icons als `<symbol>` in `_includes/icons.html`. Nie Font Awesome, nie ein CDN.

## Harte Grenzen

| Regel | Grund |
|---|---|
| Keine externen CDNs, keine Google Fonts, kein Tracking, keine Cookies | Die Datenschutzerklärung behauptet das ausdrücklich. Ein CDN macht sie zur Falschaussage. |
| Nur Plugins von der GitHub-Pages-Whitelist | Alles andere baut nicht. Derzeit: `jekyll-sitemap`, `jekyll-redirect-from`. |
| `/contact/` darf sich nie ändern | Die URL steht auf einer gedruckten Visitenkarte. |
| `CNAME` nie löschen oder ändern | Sonst verliert die Domain ihre Zuordnung. |
| Ohne JavaScript müssen alle Inhalte lesbar und alle Links nutzbar bleiben | Progressive Enhancement. JS fasst nur Zustände an, nie Inhalte. |
| `prefers-reduced-motion: reduce` respektieren | Nicht-essenzielle Bewegung dann komplett aus. |
| Kontrast mindestens 4,5:1 in **beiden** Themes | Sonst fällt der Lighthouse-Lauf durch, und die Seite wird unlesbar. |

## Fakten nie erfinden

Steht eine Angabe über Sandro nicht in den Daten, wird sie **nicht** ergänzt — auch nicht plausibel geraten. Stattdessen ein sichtbares `TODO:` in die YAML-Datei, mit einem Satz, was gebraucht wird. Rechtsangaben wie die Anschrift werden auf der Seite bewusst als markierter Platzhalter gerendert, damit der Mangel auffällt statt unterzugehen.

## Zweisprachigkeit

DE ist Standard, EN gleichwertig. Beide Fassungen stehen im HTML; CSS blendet über `<html data-lang>` die inaktive aus. Das funktioniert ohne JavaScript.

Jeder Schlüssel in `_data/i18n/de.yml` muss es auch in `en.yml` geben — der Zentralisierungscheck prüft das. Fehlt eine `*_en`-Fassung bei Inhaltstexten, wird die deutsche gezeigt; das ist gewollt.

Nie zurück zu `data-de`/`data-en`-Attributen im Markup. Genau das war das Problem am alten Stand.

## Kein lokaler Build vorhanden

Auf dem Rechner des Betreibers sind weder Ruby noch Node installiert. Verifikation läuft deshalb über GitHub Actions:

- `build-check.yml` — Jekyll-Build, HTMLProofer, Zentralisierungscheck
- `lighthouse.yml` — mobil, fällt unter Score 95 durch

**Behaupte nie, ein Build sei grün, ohne dass ein Workflow durchgelaufen ist.** Was ohne Ruby lokal geht: `bash tools/check-centralisation.sh` und ein Balance-Check der Liquid-Tags.

## Verzeichnisse

```
_data/         die einzige Wahrheit
_includes/     Bausteine — hier lebt die Logik
_layouts/      base → default → legal
assets/css/    ein Stylesheet, tokenbasiert
assets/js/     site.js überall, Rest je Seite über Front Matter `scripts:`
assets/fonts/  WOFF2, selbst gehostet, Latin-Subset
tools/         Skripte für Sync, Import, Bilder und Prüfung
docs/          PFLEGE.md ist die wichtigste Datei für den Betreiber
```

## Commits

Deutsch, Präfix nach Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Der Body erklärt **warum**, nicht was — das steht im Diff. Kleinteilig committen.

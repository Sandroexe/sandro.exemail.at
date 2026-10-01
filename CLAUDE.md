# Projektkonventionen

Persönliche Portfolio-Website von Sandro Exenberger auf `sandro.exemail.at`.
Jekyll 4, gebaut und veröffentlicht über GitHub Actions (`.github/workflows/deploy.yml`), HTML, SCSS, Vanilla JavaScript. Sandro ist kein Webentwickler – Dateien, die er bearbeitet, müssen für ihn verständlich bleiben.

## Die eine Regel

**Jede Information existiert genau einmal.** Inhalte stehen in `_data/*.yml`, Design-Werte in `_sass/_theme.scss`, wiederkehrende Texte in `_includes/`. Kein Fließtext, keine feste URL, keine Farbe direkt in Seiten oder Partials.

## Git & Branches (von Sandro vorgegeben)

- `main` ist die einzige Hauptversion und **live**. Muss immer bauen.
- Arbeit in `<typ>/<JJJJ-MM-TT>-<beschreibung>` (`feat`, `fix`, `chore`, `docs`), lokal bauen und testen, in `main` mergen, Branch löschen.
- Vor riskanten Schritten Backup-Tag `stand-JJJJ-MM-TT-<beschreibung>` von `main` setzen und pushen.
- Commits: Deutsch, Conventional-Commits-Präfix, Body erklärt **warum**.

## Harte Grenzen

| Regel | Grund |
| --- | --- |
| Keine externen Ressourcen (CDN, Google Fonts, Tracking, Cookies, Embeds) | Die Datenschutzerklärung sagt das ausdrücklich. |
| Keine Inline-Skripte und keine `style=`-Attribute | Strenge Content-Security-Policy (`_includes/head.html`). Deshalb auch kein `jekyll-redirect-from`. |
| `/contact/`, `/links/` (beide → `/kontakt/`), `/Sandro_Exenberger.vcf`, `/impressum/social/` müssen erreichbar bleiben | Gedruckte Visitenkarte, QR-Code, alte Bio-Links → `_data/weiterleitungen.yml`. |
| `id` eines Kanals in `social.yml` nie ändern | Steht als `/social-impressum/<id>/` in Bios. |
| `CNAME` nie ändern oder löschen | Domain-Zuordnung. |
| Nie löschen: IndexNow-Schlüssel (`_config.yml` → `indexnow`), `verifizierung`, künftige `google*.html`/`BingSiteAuth.xml`, `links.html`, `vcard.vcf`, „⚠ NIE LÖSCHEN“-Weiterleitungen | Suchmaschinen, QR-Code, Visitenkarte – vollständige Liste: README Abschnitt 11. Google ist per DNS-TXT bei `exemail.at` bestätigt. |
| Sitemap-`lastmod` kommt aus Git: neue datengetriebene Seiten brauchen `abhaengig_von` im Front Matter | `_plugins/letzte-aenderung.rb` |
| Ohne JavaScript muss alles lesbar und bedienbar bleiben | Progressive Enhancement. |
| `prefers-reduced-motion` respektieren, Kontrast ≥ 4,5:1 in beiden Themes | Barrierefreiheit, Lighthouse ≥ 95. |

## Fakten nie erfinden

Fehlt eine Angabe über Sandro, wird sie nicht geraten, sondern als `[BITTE AUSFÜLLEN]` in die YAML-Datei geschrieben (die lokale Vorschau zeigt dann einen gelben Hinweisbalken). Belegte Daten der alten Website liegen im Tag `stand-2026-09-29-vor-umstellung-neue-seite`. Rechtliche Unsicherheiten als `[RECHTLICH PRÜFEN]` in Kommentaren markieren und in `RECHTLICHES.md` auflisten.

## Bauen & prüfen

Lokal: `bundle exec jekyll serve` (Ruby ≥ 3.1). Vor jedem Merge: `JEKYLL_ENV=production bundle exec jekyll build` ohne Fehler/Warnungen. Behaupte nie, ein Build oder Deploy sei grün, ohne es gesehen zu haben.

## Wo was liegt

```
_data/        Inhalte (person, social, lebenslauf, zertifikate, galerie, news, rechtliches, …)
_posts/       eigene News-Beiträge (Markdown), _presse/ Presse-Links, _vorlagen/ Kopiervorlagen
_includes/    Bausteine – hier lebt die Logik
_layouts/     default → page / legal; weiterleitung für alte Adressen
_plugins/     seiten-generator.rb: Weiterleitungen + /social-impressum/<id>/; galerie.rb: Galerie-Daten; news.rb: News-Liste, Feldnamen-Übersetzung, Bildnachweise
_sass/        _theme.scss = zentrale Design-Datei, Rest technisch
assets/       css, js, fonts, icons (einzelne SVGs → sprite.svg automatisch), img
              (img/galerie/ = Originale, nie veröffentlicht; img/galerie-web/ erzeugt der Build)
tools/        linkedin-import.py, bilder-optimieren.py (läuft im Workflow vor Jekyll)
```

Anleitungen für Sandro: `README.md` (Bearbeiten), `DEPLOYMENT.md` (Online stellen), `RECHTLICHES.md` (Rechtstexte).

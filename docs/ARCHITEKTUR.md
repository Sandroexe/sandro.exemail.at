# Architektur — wie die Daten auf die Seite kommen

## Das Prinzip in einem Satz

Jede Information existiert genau einmal, in einer YAML-Datei unter `_data/`. Seiten enthalten keine Inhalte, sondern nur Aufrufe.

## Der Datenfluss

```
                       _data/*.yml
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   _includes/          _layouts/           assets/
   (Bausteine)         (Rahmen)            (CSS · JS · Fonts)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                     Seiten (*.html)
                   nur Front Matter +
                     Include-Aufrufe
                            │
                       Jekyll build
                            │
                         _site/
```

Die Richtung ist einbahnig: Daten fließen nach unten. Keine Seite schreibt Inhalte, keine Include-Datei kennt eine konkrete Seite.

## Wer speist was

| Datenquelle | Landet in |
|---|---|
| `site.yml` | `<head>`, Feature-Schalter, Sprachliste |
| `profile.yml` | Hero, Über-mich, Skills, JSON-LD, vCard, Fußzeile |
| `contact.yml` | `/contact/`, `/links/`, Fußzeile, vCard, Impressum, CSP |
| `social.yml` | Fußzeile, `/links/`, `/impressum/social/`, JSON-LD `sameAs`, vCard |
| `navigation.yml` | Kopfzeile, Fußzeile, Rechtslinks, 404 |
| `design.yml` | **alle** CSS-Custom-Properties, `theme-color`-Meta |
| `cv.yml` | `/cv/`, Startseiten-Kurzform, JSON-LD, Easter Egg |
| `certificates.yml` | `/certificates/`, Startseite, JSON-LD, gerechnete Zähler |
| `projects.yml` + `github.json` | `/projects/`, Startseite |
| `lab.yml` | `/lab/` |
| `legal.yml` | `/impressum/`, `/impressum/social/`, `/datenschutz/` |
| `i18n/de.yml` + `i18n/en.yml` | jede sichtbare Beschriftung, `i18n.json` |
| `github.yml` | steuert den Sync-Workflow |

Auffällig ist, wie oft dieselbe Quelle mehrfach vorkommt. Genau darum geht es: `social.yml` einmal ändern wirkt an sechs Stellen.

## Die vier tragenden Includes

**`t.html` — Zweisprachigkeit.** Gibt Deutsch und Englisch nebeneinander als zwei `<span>` aus. Sichtbar ist per CSS immer nur die aktive Sprache, gesteuert über `<html data-lang>`. Deshalb funktioniert das Umschalten grundsätzlich ohne JavaScript, und ohne JavaScript bleibt Deutsch stehen. Für Attribute, in denen keine zwei Spans stehen können, gibt es `t-plain.html`; die tauscht `site.js` bei Bedarf aus `i18n.json` nach.

**`critical.html` — Design-Tokens.** Der einzige Ort, an dem aus `design.yml` CSS-Custom-Properties werden. Steht inline im `<head>`, weil das Farbschema vor dem ersten Bild feststehen muss — sonst blitzt beim Laden das falsche Theme auf. `main.css` benutzt die Tokens nur noch über `var()` und enthält selbst keinen einzigen Hex-Wert.

**`social-list.html` — Kanäle.** Wird von Fußzeile, `/links/` und `/contact/` aufgerufen und entscheidet anhand von `context=` über Auswahl und Darstellung. Kanäle, deren URL noch ein `TODO` ist, werden überall stillschweigend übersprungen — ein unfertiger Eintrag blockiert nie die Seite.

**`project-card.html` — Projekte.** Nimmt entweder ein manuelles Projekt oder ein GitHub-Repo und rendert beides gleich. Trägt ein manuelles Projekt ein `repo:`-Feld, sucht der Include das passende Repo in `github.json`, übernimmt Sterne, Sprache und letzten Push und lässt deinen eigenen Text gewinnen. `project-grid.html` sorgt dafür, dass dieses Repo dann nicht ein zweites Mal als eigene Karte auftaucht.

## Wie die Zweisprachigkeit tatsächlich funktioniert

Der alte Stand hatte `data-de` und `data-en` an jedem Element im Markup — Inhalt im HTML, doppelt gepflegt. Jetzt:

```
_data/i18n/de.yml ─┐
_data/i18n/en.yml ─┴─→ t.html ─→ <span lang="de">…</span><span lang="en">…</span>
                    └─→ i18n.json ─→ site.js ─→ aria-label, alt, placeholder
```

CSS blendet aus, was gerade nicht gilt:

```css
.i18n[lang="en"]{display:none}
:root[data-lang="en"] .i18n[lang="de"]{display:none}
:root[data-lang="en"] .i18n[lang="en"]{display:inline}
```

Der Nachteil ist ehrlich benannt: beide Sprachen stehen im HTML, das Dokument wird etwas größer. Der Vorteil ist, dass es ohne JavaScript funktioniert, keinen zweiten Seitenbaum braucht und ohne Plugin auskommt — GitHub Pages erlaubt `jekyll-polyglot` nicht.

`i18n.json` lädt `site.js` nur dann, wenn jemand tatsächlich auf Englisch umschaltet. Deutsche Besucher holen die Datei nie.

## Zwei Farbschemata ohne Aufblitzen

Drei Ebenen, in dieser Reihenfolge:

1. `:root` trägt die hellen Tokens — der Standard.
2. `@media (prefers-color-scheme:dark)` mit `:root:not([data-theme="light"])` — folgt dem System, solange nichts anderes gewählt wurde.
3. `:root[data-theme="dark"]` — die ausdrückliche Wahl gewinnt in beide Richtungen.

Ein winziges Inline-Skript im `<head>` liest `localStorage` und setzt `data-theme`, **bevor** der Body gerendert wird. Ohne diesen Schritt sähe man beim Laden kurz das falsche Schema.

## Bewegung

Alle Dauern kommen aus `design.yml` als `--mo-*`. Bei `prefers-reduced-motion: reduce` werden sie in `critical.html` auf `1ms` gesetzt, und `main.css` schaltet zusätzlich Animationen und Smooth-Scrolling ab. `site.js` startet den IntersectionObserver dann gar nicht erst, sondern macht alle Elemente sofort sichtbar — sonst bliebe bei abgeschalteter Bewegung Inhalt unsichtbar liegen.

## Was automatisch läuft

| Workflow | Wann | Was |
|---|---|---|
| `sync-github.yml` | alle 6 h, manuell, bei Änderung an `github.yml` | Schreibt `_data/github.json`, committet nur bei echter Änderung |
| `build-check.yml` | jeder Push und PR | Jekyll-Build, HTMLProofer, Zentralisierungsprüfung |
| `lighthouse.yml` | Push auf `main`, PR | Mobil-Messung, fällt unter 95 durch |
| `optimize-images.yml` | manuell, bei Bildänderung | Erzeugt WebP und AVIF, committet sie |

Der Sync-Workflow ist bewusst fehlertolerant: schlägt der API-Aufruf fehl, wird `github.json` **nicht** angefasst. Lieber etwas ältere Daten als eine leere Projektseite.

## Warum kein `redirects.yml`

Ursprünglich geplant war eine Datendatei, aus der Weiterleitungsseiten erzeugt werden. Das geht auf GitHub Pages nicht: Jekyll kann ohne eigenes Plugin keine beliebigen Seiten aus einer Datenquelle erzeugen, und eigene Plugins sind dort nicht erlaubt.

Stattdessen kommt `jekyll-redirect-from` zum Einsatz — offiziell von GitHub Pages unterstützt. Die alten Pfade stehen im Front Matter der jeweiligen Zielseite:

```yaml
permalink: /projects/
redirect_from:
  - /projects.html
  - /projekte/
```

Das ist minimal weniger zentral als eine einzelne Datei, dafür steht die Weiterleitung direkt bei dem Ziel, auf das sie zeigt — und kann nicht auf eine Seite verweisen, die es nicht mehr gibt.

## Die eine bewusste Doppelung

In `vcard.vcf` steht der Dateiname im `permalink`, und in `_data/contact.yml` steht er noch einmal unter `vcard.filename`. Jekyll wertet im Front Matter kein Liquid aus, deshalb lässt sich das nicht auflösen. Es ist die einzige Stelle im Projekt, an der eine Angabe zweimal vorkommt, und sie ist dort kommentiert.

## Prüfbarkeit

`tools/check-centralisation.sh` prüft das Prinzip maschinell, statt sich auf Disziplin zu verlassen:

- kein `<style>`-Block in Seiten oder Includes
- keine Hex-Farbe außerhalb der Datendateien
- E-Mail, Telefonnummer und Social-URLs nur in `_data/`
- Sprachkataloge deckungsgleich

Der Check läuft in `build-check.yml` mit. Rutscht in einem Jahr jemand ab und schreibt eine Adresse fest in eine Seite, fällt das beim nächsten Push auf.

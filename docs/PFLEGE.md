# Pflege — ich will X ändern, welche Datei bearbeite ich?

Das ist die Datei, die du im Alltag brauchst. Die Regel dahinter ist einfach: **du bearbeitest nie eine HTML-Datei.** Alles Inhaltliche steht in `_data/`, und die Seiten holen es sich von dort.

Nach jeder Änderung: committen und pushen. GitHub Pages baut von selbst, das dauert ein bis zwei Minuten.

---

## Schnellübersicht

| Ich will … | Datei |
|---|---|
| Neuen Social-Media-Kanal aufnehmen | `_data/social.yml` |
| Farben oder Schriften ändern | `_data/design.yml` |
| Neue Ausbildung, neuen Job, neues Engagement | `_data/cv.yml` |
| Neues Zertifikat | `_data/certificates.yml` |
| Neues Projekt von Hand | `_data/projects.yml` |
| Ein GitHub-Repo verstecken | Topic `hide` auf GitHub setzen |
| Ein GitHub-Repo auf die Startseite holen | Topic `featured` auf GitHub setzen |
| Neuen Menüpunkt | `_data/navigation.yml` |
| Impressumsdaten, Rechtstexte | `_data/legal.yml` |
| Anschrift, Telefon, E-Mail | `_data/contact.yml` |
| Bio, Rolle, Skills, Foto | `_data/profile.yml` |
| Hardware oder Dienste im Home Lab | `_data/lab.yml` |
| Beschriftungen und Übersetzungen | `_data/i18n/de.yml` und `_data/i18n/en.yml` |
| Easter Egg aus- oder einschalten | `_data/site.yml` → `features.easter_egg` |
| Alte URL weiterleiten | `redirect_from:` im Front Matter der Zielseite |

---

## Neuen Social-Media-Kanal aufnehmen

`_data/social.yml`, unter `channels:` anhängen. Danach erscheint der Kanal **automatisch** in der Fußzeile, auf `/links/`, im Social-Media-Impressum, in den strukturierten Daten und — wenn du willst — in der vCard. Keine HTML-Datei anfassen.

```yaml
  - id: mastodon                       # eindeutig, klein geschrieben
    name: "Mastodon"
    handle: "@sandro@example.social"
    url: "https://example.social/@sandro"
    icon: globe                        # Name aus _includes/icons.html
    color: "#6364ff"
    context: private                   # private oder politik
    show_in:
      footer: true                     # Icon in der Fußzeile
      links: true                      # Karte auf /links/
      impressum: true                  # Eintrag im Social-Impressum
      vcard: false                     # in der .vcf-Visitenkarte
    impressum:
      content_type: "Fachliche Beiträge zu Linux und Netzwerk"
      content_type_en: "Posts about Linux and networking"
```

**Icon fehlt?** In `_includes/icons.html` ein `<symbol id="i-name">` ergänzen — dort liegt jedes Icon genau einmal. Bis dahin tut es `globe` oder `server`.

**Kanal vorübergehend verstecken:** alle drei `show_in`-Werte auf `false`. Löschen musst du nichts.

---

## Farben und Schriften ändern

`_data/design.yml`. Ändere dort einen Wert, und die gesamte Website ändert sich mit — es gibt keinen zweiten Ort, an dem eine Farbe steht.

```yaml
color:
  light:
    accent: "#c2410c"       # ← das ist die Signalfarbe im hellen Modus
  dark:
    accent: "#fb923c"       # ← und im dunklen
```

**Beide Modi mitdenken.** Wenn du `accent` hell änderst, prüfe auch den dunklen Wert. Der Kontrast zum Hintergrund muss mindestens 4,5:1 betragen, sonst fällt der Lighthouse-Lauf durch — und die Seite wird für manche Leute unlesbar.

Schriften stehen unter `type:`. Eine neue Schrift bedeutet drei Schritte: WOFF2 nach `assets/fonts/`, `@font-face` in `assets/css/main.css` ergänzen, Name in `design.yml` eintragen. **Nie Google Fonts per Link einbinden** — die Datenschutzerklärung sagt ausdrücklich, dass keine externen Dienste geladen werden.

---

## Neuer Job, neue Ausbildung, neues Engagement

`_data/cv.yml`. `education:` für Schulen, `experience:` für alles andere. Speist gleichzeitig `/cv/`, die Kurzfassung auf der Startseite, die strukturierten Daten und das Easter Egg.

```yaml
  - id: neue-station                   # eindeutig, klein, mit Bindestrichen
    start: "2026-09"                   # immer YYYY-MM
    end: null                          # null heißt "bis heute"
    title: "Bezeichnung der Tätigkeit"
    title_en: "Job title in English"
    org: "Name der Organisation"
    org_url: "https://…"               # optional
    place: "Ort, Bundesland"
    type: work                         # work oder engagement
    description: >-
      Zwei bis drei Sätze, was du dort tust.
    description_en: >-
      The same in English.
```

Die Einträge werden in der Reihenfolge angezeigt, in der sie in der Datei stehen — neueste zuerst.

---

## Neues Zertifikat

`_data/certificates.yml` unter `items:`. Die Zahlen oben auf `/certificates/` — Anzahl, gültige, Aussteller — werden **gerechnet**, nicht gepflegt. Du musst nichts nachziehen.

```yaml
  - id: neues-zertifikat
    group: linux                       # id aus der groups-Liste oben
    title: "Name des Zertifikats"
    title_en: "Certificate name"
    issuer: "Wer es ausgestellt hat"
    icon: linkedin
    color: "#e95420"
    issued: "2026-05"
    expires: null                      # null = unbefristet
    description: >-
      Was du dabei gelernt hast.
    description_en: >-
      What you learned.
    tags: [Linux, Sysadmin]
    verify_url: "https://…"            # Link zum Nachprüfen
```

Läuft ein Zertifikat ab, wird es automatisch als „Abgelaufen" markiert — du musst nichts tun.

**Neue Gruppe?** Oben unter `groups:` ergänzen, dann in `group:` darauf verweisen. Gruppen ohne Einträge erscheinen nicht.

---

## Projekte

Zwei Quellen, ein Kartenlayout:

**Von Hand** in `_data/projects.yml` — für alles, was kein GitHub-Repo ist (Home Lab, Dienste, Hardware).

```yaml
  - id: neues-projekt
    title: "Projektname"
    title_en: "Project name"
    subtitle: "Ein Halbsatz"
    icon: server
    featured: true                     # auch auf der Startseite
    repo: "Sandroexe/reponame"         # optional, siehe unten
    url: "https://…"                   # optional
    description: >-
      Was es tut und warum.
    description_en: >-
      What it does and why.
    tags: [Linux, Docker]
```

**Automatisch von GitHub.** Legst du ein neues öffentliches Repository an, erscheint es innerhalb von sechs Stunden von selbst auf `/projects/`. Steuern kannst du das ohne jede Code-Änderung:

| Was du willst | Was du tust |
|---|---|
| Repo soll nicht erscheinen | Auf GitHub das Topic `hide` setzen |
| Repo auf die Startseite | Auf GitHub das Topic `featured` setzen |
| Sofort aktualisieren | Actions → „GitHub-Repos synchronisieren" → Run workflow |
| Mehr oder weniger Repos zeigen | `_data/github.yml` → `max_items` |
| Andere Sortierung | `_data/github.yml` → `sort: pushed` / `stars` / `name` |

**Beides verbinden:** Setzt du in `projects.yml` das Feld `repo: "Sandroexe/reponame"`, gewinnt dein selbst geschriebener Text, und Sterne, Sprache und letzter Push kommen automatisch dazu. Das Repo erscheint dann nicht doppelt.

---

## Menü ändern

`_data/navigation.yml`. Statt eines Textes steht dort ein Schlüssel, damit der Punkt in beiden Sprachen stimmt.

```yaml
header:
  - { key: "nav.projects", url: "/projects/" }
  - { key: "nav.blog",     url: "/blog/" }      # ← neu
```

Dazu in **beiden** Sprachdateien den Schlüssel anlegen:

```yaml
# _data/i18n/de.yml          # _data/i18n/en.yml
nav:                         nav:
  blog: "Blog"                 blog: "Blog"
```

Fehlt der Schlüssel in einer Sprache, schlägt `tools/check-centralisation.sh` an — und damit auch der Build-Check.

---

## Texte und Übersetzungen

Beschriftungen, Knopftexte und Fehlermeldungen stehen in `_data/i18n/de.yml` und `_data/i18n/en.yml`. **Jeder Schlüssel muss es in beiden Dateien geben.**

Inhaltliche Texte — Bio, Projektbeschreibungen, Rechtstexte — stehen dagegen direkt in ihrer Datendatei, jeweils als Paar:

```yaml
description: "Deutscher Text"
description_en: "English text"
```

Fehlt die englische Fassung, wird die deutsche gezeigt. Das ist Absicht: lieber verständlich als leer.

---

## Impressum und Datenschutz

`_data/legal.yml` für die Rechtstexte, `_data/contact.yml` für Anschrift und Kontakt. Name und Rolle kommen aus `_data/profile.yml`. Nichts davon steht zweimal.

**Offen:** In `_data/contact.yml` steht bei `address.street` noch ein `TODO`. § 5 ECG verlangt die vollständige geografische Anschrift; PLZ und Ort allein reichen nicht. Solange dort ein TODO steht, zeigt das Impressum an dieser Stelle einen **sichtbar markierten Platzhalter** — das ist Absicht, damit der Mangel auffällt und nicht untergeht.

### Social-Media-Impressum

`/impressum/social/` ist der Link für deine Profil-Bios. Er wird vollständig aus `_data/social.yml` und `_data/legal.yml` erzeugt.

Kanäle sind über `context:` gruppiert. Jeder Kontext trägt seine eigene Verantwortlichkeit und Blattlinie — deshalb steht der politische Account getrennt von den privaten. Rechtlich ist das der Punkt: ein politischer Kanal hat eine andere Blattlinie nach § 25 Mediengesetz als ein privates Portfolio.

Einen weiteren Kontext legst du so an:

```yaml
contexts:
  - id: verein
    order: 3
    name: "Kanäle für den Verein XY"
    responsible: "Wer haftet"
    subject: "Worum es geht"
    blattlinie: "Grundlegende Richtung nach § 25 MedienG"
```

Dann bei den betreffenden Kanälen `context: verein` setzen. Kontexte ohne sichtbare Kanäle werden übersprungen — es entsteht kein leerer Abschnitt.

---

## Kontaktformular testen

Das Formular schickt an `https://api.exemail.at/api/contact` — deinen eigenen Server. Die API akzeptiert per CORS **ausschließlich** die Herkunft `https://sandro.exemail.at`.

> **Das heißt: In der lokalen Vorschau (`localhost:4000`) kann das Formular nicht funktionieren.** Der Browser bricht schon vor dem Absenden ab. Das ist kein Fehler, sondern die Absicherung deiner API.

**So testest du richtig:**

1. Änderung nach `main` pushen und den Pages-Build abwarten.
2. `https://sandro.exemail.at/contact/` im Browser öffnen — nicht localhost.
3. Formular ausfüllen und absenden.
4. Erwartung: grüne Meldung „Danke! Deine Nachricht ist angekommen." und die Nachricht landet bei dir.
5. Klappt es nicht: F12 → Konsole. Dort steht `[contact]` mit dem Grund.

| Fehlerbild | Ursache |
|---|---|
| `CORS`-Fehler auf localhost | Erwartet. Nur auf der echten Domain testen. |
| `CORS`-Fehler auf der echten Domain | Deine API erlaubt die Origin nicht mehr — serverseitig prüfen. |
| `HTTP 500` | Der Endpoint ist erreichbar, verarbeitet aber nicht. Serverlog ansehen. |
| Gar keine Reaktion | Server offline. Die Seite blendet dann automatisch den E-Mail-Weg ein. |

Endpoint ändern: `_data/contact.yml` → `form.endpoint`. Die Content-Security-Policy im `<head>` zieht die erlaubte Adresse automatisch von dort — du musst sie nicht separat pflegen.

---

## Bilder

Original-JPGs liegen im Wurzelverzeichnis (`profile.jpg`, `pc-setup.jpg`). Die kleineren WebP- und AVIF-Fassungen erzeugt ein Workflow:

1. Actions → „Bilder optimieren" → Run workflow
2. Danach in `_data/site.yml` `features.responsive_images: true` setzen
3. Ab dann liefert die Seite `<picture>` mit `srcset` statt der großen Originale

Das lohnt sich: `pc-setup.jpg` ist im Original 2,6 MB.

Neues Bild: JPG ablegen, in `_data/profile.yml` bzw. `_data/lab.yml` unter `photo:` eintragen (`fallback`, `src`, `width`, `height`, `alt`, `alt_en`, `widths`), Workflow laufen lassen.

---

## Lebenslauf als PDF

Es gibt bewusst **keine** separate PDF-Datei — sie würde irgendwann von `cv.yml` abweichen. Stattdessen ist `/cv/` druckoptimiert: Knopf „Drucken oder als PDF speichern" oder einfach Strg+P, dann „Als PDF sichern". Kopfzeile, Fußzeile und alles Interaktive werden dabei automatisch ausgeblendet.

### Daten aus LinkedIn holen

LinkedIn hat für Privatpersonen keine offene API — ein automatischer Abgleich ist nicht möglich. Der offizielle Weg:

1. LinkedIn → Ich → Einstellungen und Datenschutz → Datenschutz → **Kopie Ihrer Daten erhalten**
2. `Positions`, `Education` und `Skills` ankreuzen, anfordern
3. ZIP kommt per E-Mail (Minuten bis 24 Stunden)
4. `node tools/import-linkedin.mjs ~/Downloads/Basic_LinkedInDataExport.zip`

Das Skript **überschreibt nichts**. Es legt einen Vorschlag unter `_data/cv.linkedin.yml` ab und zeigt dir, welche Stationen in `cv.yml` noch fehlen. Übertragen tust du von Hand — deine eigenen Beschreibungen und die englischen Fassungen kennt LinkedIn nämlich nicht.

---

## Prüfen, ob alles noch zentral ist

```bash
bash tools/check-centralisation.sh
```

Prüft, dass keine Farbe, keine E-Mail-Adresse, keine Telefonnummer und keine Social-URL in eine Seite gerutscht ist, dass keine Seite einen eigenen `<style>`-Block hat und dass die Sprachkataloge deckungsgleich sind. Läuft auch bei jedem Push in GitHub Actions.

Wenn dieser Check anschlägt, ist etwas doppelt geworden — genau davor soll er dich bewahren.

---

## Lokale Vorschau

Braucht Ruby. Einmalig:

```bash
gem install bundler
bundle install
```

Dann:

```bash
bundle exec jekyll serve --livereload
```

Die Seite läuft auf `http://localhost:4000`. **Zwei Dinge funktionieren dort nicht** und das ist normal: das Kontaktformular (CORS, siehe oben) und alles, was auf die echte Domain zeigt.

Ohne Ruby geht es auch: pushe auf einen Branch, dann laufen `build-check` und `lighthouse` in GitHub Actions und melden dir jedes Problem.

---

## Was du nicht anfassen solltest

| Datei | Warum |
|---|---|
| `CNAME` | Ohne diese Datei verliert die Domain ihre Zuordnung. |
| `contact/index.html` → `permalink: /contact/` | **Diese URL steht auf deiner gedruckten Visitenkarte.** |
| `_data/github.json` | Wird vom Workflow geschrieben; Änderungen von Hand werden überschrieben. |
| `_includes/critical.html` | Erzeugt die Design-Tokens. Werte gehören nach `design.yml`, nicht hierher. |

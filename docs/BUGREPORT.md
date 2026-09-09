# Bugreport — Audit der Live-Seite

**Stand:** 2026-09-09 · **Geprüft gegen:** `main` @ `7086744`, live auf `https://sandro.exemail.at`
**Grundlage:** Lighthouse-CI-Läufe (10 Seiten), HTMLProofer, gerechnete Kontrastwerte, Live-HTML, Workflow-Logs

## Kurzfassung

Ein einziger Fehler (**B-01**) macht den Großteil des Schadens: **jeder Text, der über einen Übersetzungsschlüssel geholt wird, ist leer.** Betroffen sind sämtliche Menüpunkte, alle Knopfbeschriftungen, alle Formularbeschriftungen, viele Überschriften und der Skip-Link. Das ist auch die Ursache für fast alle Accessibility-Abzüge.

Zwei weitere Fehler sind sichtbar nach außen: das **Vorschaubild für Social-Media-Links fehlt** (B-02) und die **optimierten Bilder werden nie ausgeliefert** (B-03).

| Schwere | Anzahl |
|---|---|
| Kritisch | 2 |
| Mittel | 3 |
| Kosmetisch | 3 |

---

## Kritisch

### B-01 · Jeder Text aus einem Übersetzungsschlüssel ist leer

**Wo:** `_includes/t.html:25-32`, `_includes/t-plain.html:14-20` — wirkt auf **alle** Seiten
**Symptom:** Menü, Knöpfe, Formularbeschriftungen, Skip-Link und viele Überschriften erscheinen ohne Text. Im ausgelieferten HTML:

```html
<a class="skip" href="#main"><span class="i18n" lang="de"></span>…
<li><a href="/projects/"><span class="i18n" lang="de"></span>…
```

Zum Vergleich funktioniert der andere Aufrufweg einwandfrei:

```html
<p class="hero__eyebrow"><span class="i18n" lang="de">Elektronik & Netzwerktechnik</span>…
```

**Ursache:** Liquids Variablen-Parser kann **verschachtelte Klammern nicht lesen**. Sein Muster ist `\[[^\]]+\]` — es bricht bei der ersten schließenden Klammer ab. In

```liquid
{%- assign _de = site.data.i18n.de[_p[0]][_p[1]] -%}
```

wird `[_p[0]]` deshalb als Schlüssel `_p[0` gelesen, was es nicht gibt → `nil` → leerer Span. Der Weg `de=`/`en=` ist nicht betroffen, weil er ohne Klammern auskommt.

Die Daten selbst sind in Ordnung: `/assets/js/i18n.json` liefert 10.226 Bytes mit allen Schlüsseln, `nav.skip` = „Zum Inhalt springen" ist vorhanden. Es ist ausschließlich der Zugriff.

Das ist derselbe Fehlertyp wie beim bereits behobenen `en=P.bio_long_en[forloop.index0]` — nur an einer Stelle, die nicht sofort auffiel, weil die Seite trotzdem baut.

**Folgen:** Lighthouse `link-name` schlägt fehl („Element is in tab order and does not have accessible text") — genannt werden Skip-Link, beide Hero-Knöpfe, alle `sectionhead__link` und der Kontakt-Knopf. Daraus resultieren die Accessibility-Werte 0,82 bis 0,92. Über `t-plain.html` sind zusätzlich `aria-label` und `placeholder` leer, was `/contact/` auf 0,87 drückt.

**Schwere:** kritisch
**Fix:** Die Teilschlüssel vor dem Zugriff an einfache Variablen binden:

```liquid
{%- assign _k0 = _p[0] -%}
{%- assign _k1 = _p[1] -%}
{%- assign _de = site.data.i18n.de[_k0][_k1] -%}
```

Zusätzlich schlage ich eine Prüfung in `tools/check-centralisation.sh` vor, die verschachtelte Klammern in Liquid-Lookups meldet — dieser Fehler baut grün durch und fällt sonst erst im Browser auf.

### B-02 · Vorschaubild für Social-Media-Links fehlt (404)

**Wo:** `_data/site.yml:19` → `meta.og_image: /assets/img/og-default.png`, ausgegeben in `_includes/head.html:34`
**Symptom:** Jede Seite verweist per `og:image` und `twitter:image` auf `https://sandro.exemail.at/assets/img/og-default.png`. Die Datei existiert nicht — geprüft: **HTTP 404**. Wer die Seite auf LinkedIn, WhatsApp oder Instagram teilt, bekommt kein Vorschaubild.
**Ursache:** Ich habe den Pfad beim Aufbau gesetzt, die Grafik aber nie erzeugt.
**Schwere:** kritisch (nach außen sichtbar, betrifft genau die Kanäle, für die die Seite gedacht ist)
**Fix-Vorschlag:** Ein 1200×630-Bild aus `profile.jpg` plus Name und Rolle in `tools/optimize-images.mjs` mitgenerieren, damit es aus denselben Daten entsteht. Bis dahin als Sofortmaßnahme `og_image: /profile.jpg` — das Bild ist quadratisch, funktioniert aber überall.

---

## Mittel

### B-03 · Optimierte Bilder werden erzeugt, aber nie ausgeliefert

**Wo:** `.github/workflows/optimize-images.yml:44`
**Symptom:** Die Startseite lädt `profile.jpg` in voller Größe (2203 × 2203 px, 770 KB), `/lab/` lädt `pc-setup.jpg` mit 5792 × 4344 px und 2,6 MB. Lighthouse bewertet `modern-image-formats`, `uses-responsive-images` und `uses-optimized-images` jeweils mit **0**; die Performance der Startseite liegt bei **0,66**.
**Ursache:** Zwei Fehler übereinander.

1. Der Workflow hat alle zwölf Ableitungen korrekt erzeugt — das Log zeigt `/assets/img/profile-240: webp + avif` bis `/assets/img/pc-setup-1600: webp + avif`. Der anschließende Commit-Schritt prüft aber mit `git diff --quiet -- assets/img`, und **`git diff` sieht keine ungetrackten Dateien**. Ergebnis: „Keine neuen Ableitungen." — die Dateien wurden verworfen.
2. Selbst wenn sie im Repo lägen, steht `features.responsive_images` in `_data/site.yml` noch auf `false`, weil ich es an den ersten erfolgreichen Lauf gekoppelt hatte.

**Schwere:** mittel (kein Funktionsverlust, aber der mit Abstand größte Performance-Posten)
**Fix:** Im Workflow `git add -A assets/img` vor die Prüfung setzen und mit `git diff --cached --quiet` testen; danach `features.responsive_images: true`.

### B-04 · Content-Security-Policy erzeugt auf jeder Seite einen Konsolenfehler

**Wo:** `_includes/head.html:53`
**Symptom:** In der Browserkonsole erscheint auf jeder Seite: *„The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a `<meta>` element."* Lighthouse wertet das als `errors-in-console` = 0 und zieht Best Practices auf 0,93.
**Ursache:** `frame-ancestors` lässt sich technisch nur als HTTP-Header setzen, nicht per Meta-Tag. Die Direktive ist dort wirkungslos.
**Schwere:** mittel (kein Sicherheitsverlust gegenüber heute, aber ein Fehler in der Konsole, und die Klickjacking-Absicherung greift nicht)
**Fix:** `frame-ancestors 'none'` aus dem Meta-Tag entfernen — der Rest der Policy bleibt wirksam. Der Schutz gehört als echter Header an den Rand (Cloudflare Transform Rule); ich kann das nicht setzen, siehe Frage 1.

### B-05 · Aufrufe über HTTP werden nicht auf HTTPS umgeleitet

**Wo:** Domain-Konfiguration, nicht im Repo
**Symptom:** `http://sandro.exemail.at/` antwortet mit **200 ohne Weiterleitung**. HTTPS selbst funktioniert einwandfrei.
**Ursache:** Die Domain läuft über Cloudflare (`Server: cloudflare`, `CF-RAY`, Cloudflare-IPs), der Ursprung ist GitHub Pages. GitHubs eigene HTTPS-Erzwingung lässt sich deshalb nicht aktivieren: Die ACME-Prüfung scheitert am Proxy, die API meldet `bad_authz` und lehnt `https_enforced` ab — ich habe es versucht.
**Folge:** Wer über `http://` kommt, bekommt eine Seite, auf der **das Kontaktformular nicht funktioniert** — deine API erlaubt per CORS ausschließlich die Herkunft `https://sandro.exemail.at`.
**Schwere:** mittel
**Fix:** In Cloudflare unter SSL/TLS → Edge Certificates die Option **„Always Use HTTPS"** einschalten. Dafür brauche ich dich, siehe Frage 1.

---

## Kosmetisch

### B-06 · Tote Konfiguration in `_config.yml`

`sass:` verweist auf ein `_sass`-Verzeichnis, das es nicht gibt — das Stylesheet ist reines CSS mit Liquid. `collections: {}` ist ein Überbleibsel ohne Wirkung. Beides ersatzlos streichen.

### B-07 · Ungenutzte Gruppe im Icon-Sprite

`_includes/icons.html:22` enthält `<defs><g id="stroke-defaults">…</g></defs>`. Ich hatte das als gemeinsame Strichvorgabe gedacht, die Symbole tragen ihre Attribute aber selbst. Streichen.

### B-08 · Dateiname der Visitenkarte steht zweimal

`vcard.vcf` trägt den Namen im `permalink`, `_data/contact.yml` unter `vcard.filename`. Jekyll wertet im Front Matter kein Liquid aus, deshalb ist das nicht auflösbar. Es ist die einzige bewusste Doppelung im Projekt, in beiden Dateien kommentiert und in `docs/ARCHITEKTUR.md` festgehalten. **Kein Fix, nur zur Kenntnis.**

---

## Geprüft und in Ordnung — hier ist nichts zu tun

Damit klar ist, was ich tatsächlich verifiziert habe und was nicht:

| Prüfung | Ergebnis |
|---|---|
| Alle 10 Seiten erreichbar | 200 |
| 9 Legacy-Pfade inkl. `/contact/`, `/impressum.html`, `/datenschutz.html` | 200, Weiterleitung mit `canonical` + Meta-Refresh auf das richtige Ziel |
| HTMLProofer intern | 0 tote Links, 0 fehlende Alt-Texte |
| Kontrast, 16 Token-Paare, beide Themes | alle ≥ 4,5:1 — schlechtester Wert 4,73:1 (`success` hell), Akzent hell 4,89:1 |
| Zentralisierungsprüfung | 6 von 6 grün |
| `_data/github.json` | 7 Repos automatisch synchronisiert, Fallback bei Fehlern greift |
| vCard | rendert korrekt, lässt die Straße sauber weg, solange sie ein TODO ist |
| Social-Impressum | privater Kontext vollständig mit 7 Kanälen; der politische Kontext wird korrekt unterdrückt, solange sein einziger Kanal ein TODO ist |
| Schriften, Skripte, Favicon, Profilbild, `robots.txt`, `sitemap.xml` | alle 200 |
| CNAME, Pages-Build | intakt, grün |

**Noch nicht im Browser geprüft:** Mobilmenü, Theme-Umschalter, Sprachumschalter, Projektfilter, Scroll-Reveals, Formularversand und das Verhalten ohne JavaScript. Das hole ich nach dem Fix von B-01 nach — vorher würde ich überwiegend dessen Auswirkungen nachmessen, weil sämtliche Beschriftungen fehlen.

---

## Abweichungen vom ursprünglichen Auftrag, zur Bestätigung

- **Icons liegen als ein Sprite** in `_includes/icons.html`, nicht als Einzeldateien unter `_includes/icons/`. Jedes Icon existiert genau einmal, es gibt keinen zweiten Netzwerkaufruf und `<use>` färbt sie über `currentColor` in beiden Themes. Alle sieben Kanäle aus `social.yml` haben ein Icon. Für **Credly und Cisco** habe ich eigene Sinnbilder gezeichnet statt der Markenzeichen, weil ich deren Pfaddaten nicht zuverlässig kenne und lieber ein sauberes eigenes Zeichen ausliefere als ein falsch nachgebautes Logo. Sag Bescheid, wenn du dort die echten Marken willst.
- **Es gibt keine PDF-Datei für den Lebenslauf** — wie besprochen ist `/cv/` per Druck-Stylesheet der Export.

---

## Was ich von dir brauche

1. **Cloudflare:** Soll ich B-05 offen lassen, oder schaltest du „Always Use HTTPS" ein? Ohne das ist das Kontaktformular für alle kaputt, die über `http://` kommen.
2. **Unternehmensgegenstand:** Deine zwischenzeitliche Platzhalterseite nannte „IT-Dienstleistungen". Meine `legal.yml` sagt dagegen ausdrücklich, dass die Seite **rein privat und nicht unternehmerisch** betrieben wird, ohne Gewerbeberechtigung und ohne UID. Beides zugleich geht nicht — was stimmt?
3. **Freigabe** für Phase 2 (Reparatur) und Phase 3 (Design-Feinschliff).

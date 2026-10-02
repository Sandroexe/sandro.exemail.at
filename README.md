# sandro.exemail.at – Bearbeitungsanleitung

Persönliche Portfolio-Website von Sandro Exenberger.
Gebaut mit **Jekyll 4**, gehostet auf **GitHub Pages**. Keine Cookies, kein Tracking, keine externen Server.

> **Grundprinzip:** Jeder Inhalt steht an **genau einer** Stelle. Du änderst ihn dort, und die ganze Website passt sich automatisch an.
> Alle Dateien, die du bearbeiten sollst, sind unten mit ✏️ markiert und haben oben eine eigene Anleitung.

📄 Weitere Anleitungen:
- **[DEPLOYMENT.md](DEPLOYMENT.md)** – Website zum ersten Mal online stellen (GitHub, Cloudflare-DNS, HTTPS)
- **[RECHTLICHES.md](RECHTLICHES.md)** – welche Angaben im Impressum Pflicht sind, Social-Media-Impressum einrichten
- **[tools/LIESMICH.md](tools/LIESMICH.md)** – LinkedIn-Daten automatisch übernehmen

---

## Inhalt

1. [Welche Datei ändere ich für was?](#1-welche-datei-ändere-ich-für-was)
2. [Ordnerstruktur](#2-ordnerstruktur)
3. [Lokale Vorschau starten](#3-lokale-vorschau-starten)
4. [Änderungen veröffentlichen](#4-änderungen-veröffentlichen)
5. [Anleitungen für typische Änderungen](#5-anleitungen-für-typische-änderungen)
6. [YAML-Spickzettel](#6-yaml-spickzettel)
7. [Technische Entscheidungen](#7-technische-entscheidungen)
8. [Fehlerbehebung](#8-fehlerbehebung)
9. [Branches, Backups & Notfall](#9-branches-backups--notfall)
10. [Suchmaschinen](#10-suchmaschinen)
11. [NIEMALS löschen](#11-niemals-löschen)

---

## 1. Welche Datei ändere ich für was?

| Ich will …                                         | Datei                         | Abschnitt                                  |
| -------------------------------------------------- | ----------------------------- | ------------------------------------------ |
| meinen Namen, Titel oder Vorstellungstext ändern   | `_data/person.yml`            | NAME & TITEL                               |
| das Profilfoto tauschen                            | `_data/person.yml`            | PROFILFOTO (+ Bild in `assets/img/`)       |
| die Karten „Auf einen Blick" ändern                | `_data/person.yml`            | HIGHLIGHTS                                 |
| einen eigenen News-Beitrag schreiben              | neue Datei in `_posts/`       | Vorlage `_vorlagen/news-beitrag.md`, siehe [5.12](#512-news--presse) |
| einen Presseartikel über mich verlinken            | neue Datei in `_presse/`      | Vorlage `_vorlagen/presse-eintrag.md`, siehe [5.12](#512-news--presse) |
| News-Einstellungen (Startseite, Anzahl, Kategorien) | `_data/news.yml`             | BEREICH / ÜBERSICHT / AKTUELLES            |
| ein Foto in die Galerie stellen                    | `_data/galerie.yml`           | FOTOS (+ Bild in `assets/img/galerie/`), siehe [5.11](#511-galerie-bild-hinzufügen) |
| die „Einblicke" auf der Startseite ein-/ausblenden | `_data/galerie.yml`           | HIGHLIGHTS AUF DER STARTSEITE              |
| den Kasten „Lust auf ein Gespräch?" ändern         | `_data/person.yml`            | KONTAKT-AUFRUF                             |
| eine neue Station im Lebenslauf eintragen          | `_data/lebenslauf.yml`        | BERUFSERFAHRUNG / PRAKTIKA / AUSBILDUNG …  |
| Skills oder Sprachen ändern                        | `_data/lebenslauf.yml`        | SKILLS / SPRACHEN                          |
| ein eigenes Lebenslauf-PDF anbieten                | `_data/lebenslauf.yml`        | PDF-DOWNLOAD (+ PDF in `assets/lebenslauf/`) |
| ein Zertifikat hinzufügen                          | `_data/zertifikate.yml`       | ZERTIFIKATE (+ Datei in `assets/zertifikate/`) |
| E-Mail, Telefon oder Social-Media-Links ändern     | `_data/social.yml`            | KONTAKT / SOCIAL MEDIA                     |
| einen Social-Media-Button ausblenden               | `_data/social.yml`            | beim Kanal `anzeigen: false`               |
| einen Menüpunkt umbenennen/ausblenden/hinzufügen   | `_data/navigation.yml`        | HAUPTMENÜ                                  |
| Footer-Text oder Footer-Links ändern               | `_data/footer.yml`            | TEXTE / LINKS                              |
| Impressum- oder Datenschutz-Angaben ändern         | `_data/rechtliches.yml`       | MEDIENINHABER usw.                         |
| auf „Unternehmen" umschalten                       | `_data/rechtliches.yml`       | MODUS → `modus: "unternehmen"`             |
| Social-Media-Impressum eines Kanals ändern         | `_data/social.yml`            | beim Kanal → Block `rechtliches`           |
| alte Adresse auf eine neue umleiten                | `_data/weiterleitungen.yml`   | WEITERLEITUNGEN                            |
| vCard-Button auf der Kontaktseite ändern           | `_data/social.yml`            | KONTAKTSEITE → `vcard_…`                   |
| Google/Bing-Bestätigungscode eintragen             | `_config.yml`                 | SUCHMASCHINEN → `verifizierung`            |
| Farben, Schriften, Abstände, Rundungen ändern      | `_sass/_theme.scss`           | FARBEN / TYPOGRAFIE / …                    |
| die Hintergrund-Animation abschalten               | `_sass/_theme.scss`           | ANIMATIONEN → `$hintergrund-animation: false;` |
| Website-Titel oder Google-Beschreibung ändern      | `_config.yml`                 | WEBSITE                                    |
| das Kontaktformular einschalten                    | `_config.yml`                 | KONTAKTFORMULAR                            |
| eine ganz neue Seite anlegen (z. B. Projekte)      | neue `.md`-Datei + `_data/navigation.yml` | siehe [5.8](#58-neue-seite-anlegen-z-b-projekte) |

**Nicht anfassen musst du:** `_includes/`, `_layouts/`, alle anderen Dateien in `_sass/`, `assets/js/`, `.github/`.

---

## 2. Ordnerstruktur

```
sandro/
├── _config.yml              ✏️ Globale Einstellungen (Titel, Domain, Kontaktformular)
├── CNAME                       Domain für GitHub Pages (sandro.exemail.at)
├── CLAUDE.md                   Projektregeln für KI-Assistenten (Claude Code)
├── README.md                   Diese Anleitung
├── DEPLOYMENT.md               Anleitung: online stellen
├── RECHTLICHES.md              Erklärung der Rechtstexte
├── Gemfile / Gemfile.lock      Ruby-Pakete (Jekyll)
│
├── _data/                   ✏️ HIER BEARBEITEST DU DEINE INHALTE
│   ├── person.yml              Name, Titel, Foto, Wohnort, Highlights
│   ├── galerie.yml             Fotos der Galerie & „Einblicke" auf der Startseite
│   ├── news.yml                Einstellungen für News & „Aktuelles" auf der Startseite
│   ├── social.yml              LinkedIn, Instagram, Facebook (Seite + Profil), TikTok, Telefon, E-Mail
│   ├── navigation.yml          Hauptmenü
│   ├── lebenslauf.yml          Berufserfahrung, Praktika, Ausbildung, Skills …
│   ├── zertifikate.yml         Zertifikate & Kategorien
│   ├── rechtliches.yml         Impressum, Offenlegung, Datenschutz
│   ├── footer.yml              Footer-Texte und -Links
│   └── weiterleitungen.yml     Alte Adressen → neue Adressen
│
├── _posts/                  ✏️ Eigene News-Beiträge (eine .md-Datei pro Beitrag)
├── _presse/                 ✏️ Presse-Links „Ich in den Medien" (eine .md-Datei pro Artikel)
├── _vorlagen/               ✏️ Vorlagen zum Kopieren: news-beitrag.md, presse-eintrag.md
│
├── _sass/
│   ├── _theme.scss          ✏️ ZENTRALE DESIGN-DATEI
│   └── _*.scss                 Technische Stil-Dateien (nicht anfassen)
│
├── _includes/                  Bausteine: Header, Footer, Social-Icons, SEO …
├── _layouts/                   Seitenvorlagen: default, page, legal, weiterleitung
├── _plugins/                   Weiterleitungen, Social-Impressum-Unterseiten,
│                               IndexNow-Schlüssel, Änderungsdaten für die Sitemap
│
├── index.html                  Startseite
├── lebenslauf.html             /lebenslauf/
├── zertifikate.html            /zertifikate/
├── galerie.html                /galerie/
├── news.html                   /news/ (+ /news/<beitrag>/ automatisch, Feed /feed.xml)
├── kontakt.html                /kontakt/
├── impressum.html              /impressum/
├── datenschutz.html            /datenschutz/
├── social-impressum.html       /social-impressum/ (+ /social-impressum/<kanal>/ automatisch)
├── links.html                  /links/ – leitet auf /kontakt/ weiter (⚠ QR-Code, nie löschen)
├── vcard.vcf                   /Sandro_Exenberger.vcf – digitale Visitenkarte
├── 404.html                    Fehlerseite
├── robots.txt, site.webmanifest, favicon.ico
│
├── assets/
│   ├── css/main.scss           Bindet alle Stile zusammen
│   ├── js/                     theme-init.js, main.js, hero-canvas.js, galerie.js (Lightbox), news.js
│   ├── fonts/                  Inter & JetBrains Mono (lokal, woff2)
│   ├── icons/                  SVG-Icons (+ automatisch erzeugte sprite.svg)
│   ├── img/                 ✏️ Profilfoto, Favicon, Vorschaubild
│   │   ├── galerie/         ✏️ Original-Fotos der Galerie (kommen nie direkt online)
│   │   └── galerie-web/        automatisch erzeugt (nicht im Repository)
│   ├── zertifikate/         ✏️ Zertifikat-PDFs und -Bilder
│   └── lebenslauf/          ✏️ Optional: eigenes Lebenslauf-PDF
│
├── tools/
│   ├── linkedin-import.py      LinkedIn-CSV → YAML
│   ├── indexnow.py             Meldet Änderungen an Bing & Co. (läuft automatisch)
│   ├── bilder-optimieren.py    Galerie-Fotos verkleinern, WebP, GPS entfernen (läuft automatisch)
│   └── LIESMICH.md             Anleitung dazu
│
└── .github/workflows/deploy.yml   Baut & veröffentlicht automatisch
```

---

## 3. Lokale Vorschau starten

Damit siehst du Änderungen auf deinem Mac, **bevor** sie online gehen.

### Einmalig: Ruby installieren

Das auf dem Mac vorinstallierte Ruby (2.6) ist für Jekyll 4 zu alt. So installierst du ein aktuelles:

1. **Homebrew** installieren (falls noch nicht vorhanden) – Befehl von [brew.sh](https://brew.sh) im Terminal ausführen.
2. Im Terminal:
   ```bash
   brew install ruby
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
   echo 'export PATH="$(gem environment gemdir)/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ruby -v    # sollte 3.x anzeigen
   ```
3. Im Projektordner einmalig die Pakete installieren:
   ```bash
   cd pfad/zu/sandro
   bundle install
   ```

### Jedes Mal: Vorschau starten

```bash
bundle exec jekyll serve
```

Dann im Browser öffnen: **http://localhost:4000**

- Änderungen an Dateien in `_data/`, `_sass/` usw. werden **automatisch** übernommen – einfach Browser neu laden.
- Änderungen an **`_config.yml`** brauchen einen Neustart: `Strg + C`, dann Befehl erneut.
- In der Vorschau erscheint oben ein **gelber Balken**, wenn auf einer Seite noch `[BITTE AUSFÜLLEN]` steht. Online ist er nie sichtbar.

> 💡 **Tipp iCloud:** Dein Projekt liegt aktuell in iCloud Drive. Das funktioniert, aber iCloud synchronisiert dann auch die temporären Ordner `_site/` und `.jekyll-cache/` ständig mit. Besser: Projektordner nach z. B. `~/Developer/sandro` verschieben – GitHub ist ohnehin dein Backup.

---

## 4. Änderungen veröffentlichen

Sobald das Repository eingerichtet ist (siehe [DEPLOYMENT.md](DEPLOYMENT.md)), gilt:

**Jede Änderung, die auf GitHub im Branch `main` landet, wird automatisch in 1–2 Minuten veröffentlicht.** `main` ist immer die Live-Version – kleine Textänderungen kannst du direkt dort machen, größere Umbauten laufen über einen Arbeitsbranch (siehe [Abschnitt 9](#9-branches-backups--notfall)).

**Variante A – GitHub Desktop (empfohlen für Einsteiger)**
1. Dateien lokal ändern und speichern.
2. GitHub Desktop öffnen → links siehst du die Änderungen.
3. Unten kurz beschreiben, was du geändert hast (z. B. „CCNA-Zertifikat ergänzt") → **Commit to main**.
4. Oben **Push origin** klicken.

**Variante B – Terminal**
```bash
git add .
git commit -m "CCNA-Zertifikat ergänzt"
git push
```

**Variante C – direkt auf github.com** (für kleine Textänderungen)
Datei im Repository öffnen → Stift-Symbol ✏️ → ändern → **Commit changes**.

**Fortschritt ansehen:** Repository → Reiter **Actions**. Grüner Haken = online. Rotes X = Fehler (meist ein YAML-Tippfehler, siehe [Fehlerbehebung](#8-fehlerbehebung)).

---

## 5. Anleitungen für typische Änderungen

### 5.1 Foto austauschen

1. Foto **quadratisch** zuschneiden, **mindestens 1000 × 1000 Pixel** (Google verwendet es als Vorschaubild).
2. Als `profil.jpg` in den Ordner `assets/img/` legen.
3. Optional (schneller): zusätzlich als `profil.webp` speichern, z. B. kostenlos mit [squoosh.app](https://squoosh.app) (läuft nur im Browser, lädt nichts hoch).
4. In `_data/person.yml`:
   ```yaml
   foto:
     datei: "profil.jpg"
     webp: "profil.webp"      # oder "" wenn keine WebP-Datei
     alt: "Porträtfoto von Sandro Exenberger am Rednerpult"
     breite: 1000
     hoehe: 1000
     klein: "profil-600.jpg"  # optional, gleiches Motiv in 600 × 600
     klein_webp: "profil-600.webp"
     klein_breite: 600
   ```
5. **Google-/Social-Media-Vorschaubild** (`assets/img/vorschaubild.jpg`, 1200 × 630, eingestellt in `_config.yml` → `og_image`): dein Foto randlos, Gesicht in der **Mitte** (Google schneidet oft quadratisch zu), Name dezent links. Neues Foto? Claude bitten: „Erzeuge das Vorschaubild neu aus profil.jpg.“ Danach Startseite in der Google Search Console neu indexieren lassen (Abschnitt 10) und bei LinkedIn den [Post Inspector](https://www.linkedin.com/post-inspector/) aufrufen.
6. Das **Profilfoto** auf der Startseite ist auch das Hauptbild für Google (strukturierte Daten „ProfilePage“ + „Person“). Mindestens 1000 × 1000 Pixel, quadratisch; zusätzlich eine 600-px-Version (`klein` in `person.yml`) für Handys.

**Fotogalerie:** siehe [5.11](#511-galerie-bild-hinzufügen).

### 5.2 Neues Zertifikat hinzufügen

1. PDF und/oder Bild nach `assets/zertifikate/` legen (z. B. `ccna.pdf`, `ccna.jpg`).
   ⚠️ Vorher Geburtsdatum/Adresse auf dem Scan schwärzen.
2. In `_data/zertifikate.yml` die Vorlage unten kopieren, `#` am Zeilenanfang entfernen, ausfüllen:
   ```yaml
     - name: "Python Essentials 1"
       aussteller: "Cisco Networking Academy"
       kategorie: "Programmierung"
       ausgestellt: "2026-03"
       ablauf: ""
       credential_id: ""
       verifizierung_link: "https://… (Link zur Online-Prüfung)"
       beschreibung: >-
         Grundlagen der Programmierung mit Python.
       bild: ""
       bild_alt: ""
       datei: "python-essentials.pdf"
       anzeigen: true
   ```
3. Die Kategorie muss in der Liste `kategorien:` oben vorkommen. Neue Kategorie? Einfach dort ergänzen – der Filter-Button erscheint automatisch.

### 5.3 Neue Station im Lebenslauf

In `_data/lebenslauf.yml` im passenden Abschnitt die **Vorlage** kopieren und **oben** in die Liste `eintraege:` einfügen (neueste zuerst):

```yaml
    - position: "Systemadministrator"
      unternehmen: "Beispiel GmbH"
      unternehmen_link: ""
      ort: "Kufstein, Tirol"
      art: "Vollzeit"
      von: "2027-09"
      bis: ""                 # leer = "heute"
      beschreibung: >-
        Ein bis zwei Sätze zur Tätigkeit.
      aufgaben:
        - "Stichpunkt 1"
      anzeigen: true
```

**Datumsformat:** immer `"JJJJ-MM"` oder `"JJJJ"` in Anführungszeichen. Angezeigt wird automatisch „Sep. 2027".
**LinkedIn-Daten übernehmen:** Tabelle ganz oben in `lebenslauf.yml` oder automatisch mit [tools/LIESMICH.md](tools/LIESMICH.md).

### 5.4 Farbe oder Schrift der ganzen Website ändern

Alles in **`_sass/_theme.scss`**:

```scss
// Hauptfarbe – färbt Buttons, Links, Icons, Menü, Animation … um
$farbe-haupt: #0e7490;     // z. B. #1d4ed8 für Blau, #7c3aed für Violett

// Zweitfarbe für Farbverläufe
$farbe-akzent: #0d9488;
```

- Die Dark-Mode-Variante wird automatisch passend aufgehellt (`$dunkel-farbe-haupt: auto;`). Du kannst dort aber auch einen eigenen Farbcode eintragen.
- **Kontrast prüfen:** Text muss lesbar bleiben (Barrierefreiheit). Prüfen mit [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) – Hauptfarbe gegen Weiß mindestens **4,5 : 1**.
- **Schrift ändern:** Neue Schrift als `.woff2` nach `assets/fonts/` legen (z. B. von [fontsource.org](https://fontsource.org) herunterladen), in `_sass/_fonts.scss` einen `@font-face`-Block nach Vorbild ergänzen und in `_theme.scss` bei `$schrift-text` den Namen vorne eintragen. **Nie** Google Fonts direkt einbinden (Datenschutz!).
- Profilfoto eckig statt rund: `$rundung-foto: 1.5rem;`

### 5.5 Social-Media-Link hinzufügen oder ausblenden

In `_data/social.yml`:

- **Ausblenden:** beim Kanal `anzeigen: false`.
- **Nur an bestimmten Stellen zeigen:** `orte: [footer, kontakt]` (möglich: `header`, `footer`, `startseite`, `kontakt`).
- **Aktuelle Kanäle:** LinkedIn, Instagram, Facebook (Seite), Facebook (Profil), TikTok, Telefon, E-Mail (Reihenfolge = Reihenfolge in `social.yml`). Vorhandene Icons: `mail`, `phone`, `linkedin`, `instagram`, `facebook`, `tiktok`.
- **Neue Plattform (später):** die inaktive Vorlage am Dateiende kopieren, siehe [5.10](#510-social-media-impressum-neuer-kanal--direktlinks).
- **Eigenes Icon:** SVG-Datei (24 × 24, am besten von [lucide.dev](https://lucide.dev) oder [simpleicons.org](https://simpleicons.org)) nach `assets/icons/` legen, z. B. `meinkanal.svg`, und im Eintrag `icon: "meinkanal"` schreiben. Das Icon wird automatisch eingebunden.
- Social-Media-Profile brauchen zusätzlich den Block `rechtliches` – siehe [5.10](#510-social-media-impressum-neuer-kanal--direktlinks).

### 5.6 Menüpunkt hinzufügen, umbenennen, ausblenden

In `_data/navigation.yml`:
- **Umbenennen:** `titel` ändern.
- **Ausblenden:** `anzeigen: false`.
- **Reihenfolge:** Einträge verschieben.
- **Hinzufügen:** Vorlage kopieren (die Seite muss existieren, siehe 5.8).

### 5.7 Rechtliche Daten ändern / Unternehmensmodus

Alles in `_data/rechtliches.yml` – wirkt automatisch auf Impressum, Social-Media-Impressum **und** Datenschutzerklärung.

**Umschalten auf Unternehmen** (erst **nach** der Gewerbeanmeldung!):
1. `modus: "unternehmen"`
2. Abschnitt `unternehmen:` vollständig ausfüllen (GISA-Zahl, ggf. UID, Anschrift unter `medieninhaber.strasse`).
3. `stand:` auf das heutige Datum setzen.
4. Texte noch einmal prüfen lassen. Details: [RECHTLICHES.md](RECHTLICHES.md).

### 5.8 Neue Seite anlegen (z. B. Projekte)

1. Im Hauptordner eine Datei **`projekte.md`** anlegen:
   ```markdown
   ---
   layout: page
   title: "Projekte"
   description: "Meine Projekte aus Elektronik, Netzwerktechnik und Webentwicklung."
   eyebrow: "Portfolio"
   einleitung: "Eine Auswahl von Dingen, die ich gebaut habe."
   permalink: /projekte/
   ---

   ## Diplomarbeit: Smart-Home-Steuerung

   Kurze Beschreibung in **Markdown** – Überschriften mit `##`, Listen mit `-`,
   Links mit `[Text](https://…)`.
   ```
2. In `_data/navigation.yml` eintragen:
   ```yaml
     - titel: "Projekte"
       url: "/projekte/"
       anzeigen: true
   ```
Fertig – Header, Footer, Design, SEO und Sitemap sind automatisch dabei.

### 5.9 Kontaktformular einschalten (optional)

Standardmäßig aus – E-Mail und Telefon reichen. Wenn du eines willst:
1. Formular-Dienst mit **EU-Serverstandort** und **Auftragsverarbeitungsvertrag (AVV)** wählen.
2. In `_config.yml` unter `kontaktformular` `aktiv: true` setzen und die Anbieterdaten eintragen.
3. Vorschau neu starten – Formular, Datenschutz-Abschnitt und Sicherheitsrichtlinie (CSP) passen sich automatisch an.
4. Datenschutzerklärung durchlesen und ggf. prüfen lassen.

### 5.10 Social-Media-Impressum: neuer Kanal & Direktlinks

Jeder Social-Media-Kanal hat im Impressum einen **eigenen Bereich** (Offenlegung + Datenschutz) und eine **eigene Unterseite**. Alles kommt aus dem Block `rechtliches` beim Kanal in `_data/social.yml`.

**Direktlinks für die Bios** (Begründung und Details: [RECHTLICHES.md](RECHTLICHES.md), Abschnitt 4):

| Kanal | Link | Wo eintragen |
| --- | --- | --- |
| LinkedIn | `https://sandro.exemail.at/social-impressum/linkedin/` | **Kontaktinfo → Website hinzufügen** (Typ „Sonstiges", Bezeichnung „Impressum") **und** letzte Zeile im Abschnitt **Info** |
| Instagram | `https://sandro.exemail.at/social-impressum/instagram/` | **Profil bearbeiten → Links** (Titel „Impressum", an **erste** Stelle) **und** letzte Zeile der **Bio** |
| Facebook (Seite) | `https://sandro.exemail.at/social-impressum/facebook/` | **Seite → Info/Intro → Website** hinzufügen **und** im **Intro/Beschreibung**; Details siehe RECHTLICHES.md |
| Facebook (Profil) | `https://sandro.exemail.at/social-impressum/facebook-profil/` | **Profil → Details bearbeiten → Links/Website hinzufügen** **und** in der **Kurzbeschreibung (Bio)**; Details siehe RECHTLICHES.md |
| TikTok | `https://sandro.exemail.at/social-impressum/tiktok/` | **Profil bearbeiten → Website** (falls vorhanden) **und** in der **Bio**; Details siehe RECHTLICHES.md |

**Neuen Kanal hinzufügen (später):**
1. In `_data/social.yml` die **Vorlage ganz unten** kopieren und **nur** das `#` am Zeilenanfang entfernen (die Leerzeichen danach bleiben – sie sind die Einrückung).
2. `id` festlegen (klein, ohne Leerzeichen, z. B. `meinkanal`) – daraus wird `/social-impressum/meinkanal/`. Alle Platzhalter `<…>` ersetzen.
3. Block `rechtliches` ausfüllen: Betreiber + Anschrift und Datenschutz-Link (aus der Datenschutzerklärung der Plattform), Drittland-Text, ggf. Statistik.
4. Speichern → Sprung-Button, Bereich auf der Übersicht, Unterseite und Datenschutztext entstehen automatisch.
5. Den neuen Link in die Bio des Kanals eintragen.

**Kanal aus dem Impressum entfernen:** `impressum_anzeigen: false` – Bereich, Button und Unterseite verschwinden komplett.

### 5.11 Galerie: Bild hinzufügen

> ⚖️ **Vorher: Recht am eigenen Bild.** Sind auf dem Foto **andere Personen erkennbar**, brauchst du **deren Zustimmung** (bei Minderjährigen im Zweifel auch die der Eltern). Hat **jemand anderes fotografiert**, brauchst du die **Erlaubnis des Fotografen** und nennst ihn unter `fotograf`. Details: [RECHTLICHES.md, Abschnitt 7](RECHTLICHES.md#7-fotos-in-der-galerie--recht-am-eigenen-bild--urheberrecht).

**Welches Foto?** JPG (auch PNG/WebP), längste Seite **mindestens 2000 Pixel**, Hoch- oder Querformat egal. Dateiname klein, ohne Leer- und Sonderzeichen, z. B. `schulfest-2026.jpg`. iPhone-Fotos (HEIC) vorher als JPG exportieren. Verkleinern musst du nichts – das passiert automatisch.

**📍 Standort entfernen (wichtig!):** Das Original liegt im öffentlichen GitHub-Repository. Auf der Website werden GPS-Daten automatisch entfernt, im Original bleiben sie aber stehen.
- iPhone: Foto → **Teilen** → oben **Optionen** → **Ort** ausschalten → „In Dateien sichern".
- Mac: Foto in **Vorschau** öffnen → **Werkzeuge → Informationen** → Reiter **GPS** → **Ortsinformationen entfernen**.
- Vergessen? Der Build zeigt unter **Actions** eine gelbe Warnung „… enthält GPS-Standortdaten".

**Schritt für Schritt auf github.com:**
1. Repository öffnen → Ordner **`assets/img/galerie/`** anklicken.
2. Oben rechts **Add file → Upload files** → Foto hineinziehen → unten **Commit changes**.
3. Zurück zur Startseite des Repositorys → **`_data/galerie.yml`** öffnen → Stift-Symbol ✏️.
4. Ganz unten die **Vorlage** markieren, kopieren und direkt **über** der Zeile `# ─── Vorlage zum Kopieren` einfügen. Bei den eingefügten Zeilen **nur** das `#` am Zeilenanfang entfernen (die zwei Leerzeichen vor `- datei` bleiben!).
5. Ausfüllen:
   ```yaml
     - datei: "schulfest-2026.jpg"        # genau wie die hochgeladene Datei
       titel: "Schulfest an der HTL"
       alt_text: "Sandro Exenberger mit Mitschülern am Stand des Makerspace"
       beschreibung: "Ein bis zwei Sätze."  # oder ""
       datum: "2026-06-12"                  # oder "2026-06" oder ""
       ort: "Innsbruck"                     # oder ""
       kategorie: "Veranstaltungen"         # Veranstaltungen, Projekte, Schule oder Arbeit
       fotograf: ""                         # leer = du selbst
       erlaubnis_eingeholt: true            # nur für dich, nie öffentlich
       anzeigen: true
       hervorgehoben: false                 # true = auch auf der Startseite
   ```
6. **Commit changes** → nach 1–2 Minuten ist das Foto online.

**Gut zu wissen:**
- **Reihenfolge:** automatisch nach Datum, neueste zuerst. Fotos ohne Datum stehen am Ende.
- **`alt_text`** beschreibt für blinde Besucher, was zu sehen ist (nicht nur den Titel wiederholen). Pflichtfeld – ohne ihn wird das Foto übersprungen.
- **Bildnachweis:** Alles, was unter `fotograf` steht, erscheint automatisch im Impressum. Nicht zusätzlich in `rechtliches.yml` eintragen.
- **Neue Kategorie:** oben unter `kategorien:` ergänzen – der Filter-Button erscheint automatisch, sobald ein Foto sie nutzt.
- **Startseite:** zeigt höchstens `anzahl` Fotos mit `hervorgehoben: true`; ganz ausschalten mit `startseite → anzeigen: false`.
- **Foto entfernen:** `anzeigen: false` (bleibt gespeichert) oder Eintrag löschen **und** Datei in `assets/img/galerie/` löschen.
- **Foto erscheint nicht?** GitHub → **Actions** → letzter Lauf → gelbe Warnung „Galerie: …" nennt den Grund (Datei fehlt, Tippfehler im Namen, Pflichtfeld leer).
- **Lokale Vorschau:** Die Web-Versionen erzeugt der Build auf GitHub. Lokal einmalig `python3 -m pip install -r tools/requirements.txt`, dann vor `bundle exec jekyll serve` jeweils `python3 tools/bilder-optimieren.py` ausführen.

### 5.12 News & Presse

Auf **/news/** stehen zwei Arten von News gemischt, neueste zuerst. Die neuesten erscheinen automatisch auch auf der Startseite unter „Aktuelles“.

| Art | Wo | Ergebnis |
| --- | --- | --- |
| **Eigener Beitrag** (Blog) | eine Datei pro Beitrag in `_posts/` | Karte auf /news/ + eigene Seite `/news/<titel>/` + RSS-Feed |
| **Presse-Link** („Ich in den Medien“) | eine Datei pro Artikel in `_presse/` | Karte: Schlagzeile als Zitat mit Quelle, dein Satz, Button „Ganzen Artikel auf … lesen“ |

**Neuen Beitrag schreiben (auf github.com):**
1. Repository öffnen → Ordner **`_vorlagen`** → **`news-beitrag.md`** → rechts oben **Copy raw file** (Symbol mit zwei Blättern).
2. Zurück → Ordner **`_posts`** → **Add file → Create new file**.
3. Dateiname: **`JJJJ-MM-TT-titel-in-kleinbuchstaben.md`**, z. B. `2026-10-15-besuch-im-landtag.md`. Das Datum ist das Veröffentlichungsdatum, der Rest wird zur Adresse (`/news/besuch-im-landtag/`). Nur `a–z`, `0–9` und `-`, keine Umlaute oder Leerzeichen.
4. Vorlage einfügen, oben die Felder ausfüllen (jede Zeile ist kommentiert), unter dem zweiten `---` deinen Text schreiben.
5. **Titelbild (optional):** Foto nach `assets/img/galerie/` hochladen (vorher Standort entfernen, siehe 5.11) und bei `titelbild:` nur den Dateinamen eintragen. Es muss nicht in der Galerie erscheinen.
6. **Commit changes** → nach 1–2 Minuten online, auf der Startseite und im Feed. Suchmaschinen werden automatisch informiert.

**Neuen Presse-Link hinzufügen:**
1. Vorlage **`_vorlagen/presse-eintrag.md`** kopieren (wie oben), in **`_presse/`** als `JJJJ-MM-TT-medium-stichwort.md` anlegen.
2. `titel` (Original-Schlagzeile, erscheint als Zitat mit Quelle), `medium`, `datum`, `link` und **`eigene_zusammenfassung`** (1–2 eigene Sätze) ausfüllen. Optional `button_text`, `bild`, `fotograf`.
3. ⚖️ **Außer der Schlagzeile nichts aus dem Artikel übernehmen**, dein Satz in eigenen Worten und nur mit Angaben, die wirklich im Artikel stehen. **Keine Fotos oder Logos** des Mediums verwenden – höchstens ein eigenes Foto (`bild:`), sonst erscheint ein neutrales Zeitungs-Symbol. Details: [RECHTLICHES.md, Abschnitt 8](RECHTLICHES.md#8-news--presse).

**Ausblenden:**
| Ich will … | So geht's |
| --- | --- |
| einen Beitrag/Presse-Link ganz ausblenden (Entwurf) | `veroeffentlicht: false` |
| ihn nur von der Startseite nehmen | `auf_startseite: false` |
| „Aktuelles“ auf der Startseite ausschalten | `_data/news.yml` → `startseite` → `anzeigen: false` |
| den ganzen News-Bereich ausschalten | `_data/news.yml` → `anzeigen: false` (Menüpunkt verschwindet automatisch) |
| endgültig löschen | Datei in `_posts/` bzw. `_presse/` löschen |

**Markdown-Spickzettel** (für den Text unter dem zweiten `---`):

| Was | So schreibst du es |
| --- | --- |
| Zwischenüberschrift | `## Meine Überschrift` (zwei Rauten + Leerzeichen) |
| fett / kursiv | `**fett**` / `*kursiv*` |
| Link | `[Linktext](https://example.com)` |
| Bild im Text | `![Beschreibung des Bildes](/assets/img/galerie-web/DATEINAME-gross.jpg)` – Foto vorher nach `assets/img/galerie/` hochladen, `DATEINAME` ohne Endung |
| Aufzählung | jede Zeile mit `- ` beginnen |
| nummerierte Liste | `1. `, `2. ` … |
| Zitat | Zeile mit `> ` beginnen |
| neuer Absatz | eine Leerzeile dazwischen |

**Gut zu wissen:**
- **Teilen-Buttons** (LinkedIn, WhatsApp, E-Mail, Link kopieren) sind einfache Links – kein Tracking, keine eingebetteten Widgets. Ein-/ausschalten in `news.yml → teilen`. Kommentare gibt es bewusst nicht.
- **Kategorien** stehen in `news.yml`. Filter-Buttons ohne Einträge werden automatisch ausgeblendet.
- **Seitennummern** erscheinen automatisch ab `pro_seite` Einträgen (Standard 9).
- **Bildnachweis:** `fotograf` eines Titelbilds erscheint unter dem Bild und automatisch im Impressum.
- **Fehler?** GitHub → **Actions** → gelbe Warnung „News: …“ nennt Datei und Grund (z. B. fehlende `kurzbeschreibung`, Bild nicht gefunden).
- **Presse-Einträge haben keine eigene Seite.** Eine Seite mit nur 2–3 Sätzen würde Google als „dünnen Inhalt“ werten. Zum Teilen gibt es einen Direktlink: `https://sandro.exemail.at/news/#presse-<dateiname-ohne-.md>`.

---

## 6. YAML-Spickzettel

YAML ist das Format der Dateien in `_data/`. Die häufigsten Fehler:

| ✅ Richtig                         | ❌ Falsch                          | Warum                                   |
| --------------------------------- | --------------------------------- | --------------------------------------- |
| `titel: "HTL: Elektronik"`        | `titel: HTL: Elektronik`          | Doppelpunkt im Text → Anführungszeichen |
| 2 Leerzeichen Einrückung          | Tabulator                          | YAML verbietet Tabs                     |
| `von: "2024-09"`                  | `von: 09/2024`                    | Datumsformat JJJJ-MM                    |
| `anzeigen: true`                  | `anzeigen: ja`                    | nur `true` oder `false`                 |
| `- "Eintrag"` (Minus + Leerzeichen)| `-"Eintrag"`                      | Listen brauchen das Leerzeichen         |

Lange Texte:
```yaml
beschreibung: >-
  Dieser Text darf über mehrere Zeilen gehen
  und wird zu einem Absatz zusammengefügt.
```

Unsicher? Inhalt auf [yamlchecker.com](https://yamlchecker.com) einfügen und prüfen.

---

## 7. Technische Entscheidungen

Kurz dokumentiert, damit du (oder jemand anderes) später versteht, warum etwas so gebaut ist:

| Entscheidung | Begründung |
| --- | --- |
| **Jekyll 4 über GitHub Actions** statt `github-pages`-Gem | Aktuelles Sass (Dart Sass), freie Plugin-Wahl, identischer Build lokal und online. |
| **Farben als CSS-Variablen**, erzeugt aus `_theme.scss` | Eine Änderung färbt alles um, inkl. Dark Mode und Hintergrund-Animation. |
| **Icons als automatisch erzeugtes SVG-Sprite** | Icons liegen einzeln in `assets/icons/`; `sprite.svg` fasst sie beim Bauen zusammen. Neues Icon = Datei ablegen. Fehlende Icons verursachen keinen Fehler. |
| **Schriften lokal** (Inter, JetBrains Mono) | Keine Verbindung zu Google → DSGVO-freundlich, keine Einwilligung nötig. |
| **Keine Inline-Skripte/-Styles** | Erlaubt eine strenge Content-Security-Policy (`script-src 'self'`). |
| **Dark-Mode-Auswahl in localStorage** – nur nach Klick | Kein Cookie; nach § 165 Abs. 3 TKG 2021 ohne Einwilligung zulässig. |
| **E-Mail/Telefon verschlüsselt im HTML** | Schutz vor einfachen Spam-Bots; im Browser ganz normal klickbar, ohne JavaScript als „name [at] domain [punkt] at" lesbar. |
| **Detailansicht mit `<dialog>`** | Natives, barrierefreies Element (Fokus, Escape-Taste) ohne Bibliothek. |
| **Galerie-Lightbox selbst gebaut** (`assets/js/galerie.js`) | Keine externe Bibliothek/kein CDN (Datenschutz, CSP). Ohne JavaScript öffnet der Klick einfach die große Bilddatei. |
| **Galerie-Bilder werden im Build erzeugt** (`tools/bilder-optimieren.py`, Pillow) | Du lädst nur das Original hoch; Vorschaubild, große Version (WebP + JPG) und Social-Media-Bild entstehen automatisch, ohne Metadaten/GPS. Die Originale werden nicht veröffentlicht (`exclude` in `_config.yml`). |
| **Eigene Beiträge als Jekyll-Posts, Presse als Sammlung ohne eigene Seiten** | Datum aus dem Dateinamen, vorheriger/nächster Beitrag und RSS-Feed (`jekyll-feed`) gibt es fertig. Presse-Einträge sind nur Karten mit Link – kein Duplicate Content zum Originalartikel. |
| **Seitennummern auf /news/ im Browser** (`assets/js/news.js`) | Damit der Filter über alle Einträge wirkt und nicht nur über eine Seite. Ohne JavaScript sind alle News sichtbar. |
| **Gleichmäßiges Raster statt Masonry** | Hochformate belegen zwei Zellen übereinander. So bleibt die Reihenfolge „neueste zuerst" von links nach rechts lesbar, und die Seite springt beim Laden nicht (feste Seitenverhältnisse). |
| **Druck-Layout statt PDF-Bibliothek** | „Als PDF speichern" im Browser liefert ein sauberes A4-PDF ohne zusätzliche Abhängigkeiten. |
| **Leiterbahn-Animation per Canvas** | Leicht (ein Zwischenspeicher, wenige Signale), pausiert außerhalb des Sichtbereichs, aus bei „Bewegung reduzieren". |
| **Vorschaubild mit Foto statt Textgrafik** | Google zeigt bei Personen-Suchen bevorzugt ein Gesicht. Strukturierte Daten (WebSite, ProfilePage mit `primaryImageOfPage`, Person) und `max-image-preview:large` machen das Profilfoto zum klaren Hauptbild. |
| **Keine Farbe im `theme-color`-Meta-Tag** | Würde eine zweite Farbangabe außerhalb von `_theme.scss` erfordern. |

**Sicherheits-Header:** GitHub Pages erlaubt keine eigenen HTTP-Header. Die Content-Security-Policy wird daher per `<meta>`-Tag gesetzt (wirksam für Skripte, Styles, Bilder, Formulare). Nicht per Meta möglich sind `frame-ancestors` und `X-Frame-Options` – das ist für eine statische Portfolio-Seite ein vertretbares Restrisiko.

---

## 8. Fehlerbehebung

| Problem | Lösung |
| --- | --- |
| **Actions zeigt rotes X** | Actions → fehlgeschlagenen Lauf öffnen → Schritt „Website mit Jekyll bauen" aufklappen. Meist steht dort die Datei und Zeile mit dem YAML-Fehler. |
| **Änderung nicht sichtbar** | 1–2 Minuten warten, dann Browser-Cache umgehen: `Cmd + Shift + R`. |
| **Lokale Vorschau startet nicht** | `bundle install` erneut ausführen; prüfen, ob `ruby -v` Version 3.x zeigt. |
| **Icon wird nicht angezeigt** | Stimmt der Name in der YAML-Datei exakt mit dem Dateinamen in `assets/icons/` überein (ohne `.svg`)? |
| **Bild wird nicht angezeigt** | Groß-/Kleinschreibung prüfen: `Profil.JPG` ≠ `profil.jpg`. Galerie: gelbe Warnung „Galerie: …" im Actions-Log lesen. |
| **Datum erscheint als Text** | Format `"JJJJ-MM"` in Anführungszeichen verwenden. |

---

## 9. Branches, Backups & Notfall

**Grundregel:** `main` ist die einzige Hauptversion. Was in `main` liegt, ist live und muss immer funktionieren.

| Was | Schema | Beispiel |
| --- | --- | --- |
| Arbeitsbranch | `<typ>/<JJJJ-MM-TT>-<beschreibung>` (typ: `feat`/`feature`, `fix`, `chore`, `docs`, `content`) | `feature/2026-10-01-news-bereich` |
| Backup (bevorzugt) | Git-Tag `stand-JJJJ-MM-TT-<beschreibung>` | `stand-2026-09-29-vor-aufraeumen` |
| Backup, das weiterbearbeitet wird | Branch `backup/JJJJ-MM-TT-<beschreibung>` | `backup/2026-10-01-alte-farben` |

Ablauf: Arbeitsbranch anlegen → ändern → lokal testen → in `main` mergen → Arbeitsbranch löschen. Vor großen oder riskanten Schritten wird zuerst ein Backup-Tag gesetzt. Es bleiben höchstens die letzten 3 Backup-Branches; Tags dürfen bleiben.

**Im Notfall einen alten Stand zurückholen:** Alle gesicherten Stände findest du auf GitHub unter **Code → Tags**; dort kannst du jeden Stand ansehen und als ZIP herunterladen, ohne etwas zu verändern. Um einen Stand wieder live zu schalten, stellst du im Projektordner den Inhalt von `main` auf den Tag zurück und veröffentlichst das als neuen Commit (die Zwischenstände bleiben dabei in der Historie erhalten):

```bash
git switch main && git pull
git rm -r -q . && git checkout stand-2026-09-29-vor-aufraeumen -- .
git commit -m "Zurück auf stand-2026-09-29-vor-aufraeumen" && git push
```

Nach 1–2 Minuten ist der alte Stand online.

**Stand vor dem News-Bereich zurückholen** (Tag `stand-2026-10-01-vor-news`): Befehle oben mit diesem Tag-Namen ausführen. Ohne Terminal: GitHub → **Code → Tags → stand-2026-10-01-vor-news** → ansehen oder als ZIP herunterladen – oder Claude bitten: „Setz die Website auf stand-2026-10-01-vor-news zurück.“ Ausnahme: Die ganz alte Website (`stand-2026-09-29-vor-umstellung-neue-seite`) wurde noch ohne GitHub Actions veröffentlicht – dafür zusätzlich unter **Settings → Pages → Source** wieder „Deploy from a branch" (`main`) wählen.

---

## 10. Suchmaschinen

### Was automatisch passiert (du musst nichts tun)

| Was | Wie |
| --- | --- |
| **Sitemap** `sandro.exemail.at/sitemap.xml` | Wird bei jedem Build neu erzeugt. Jede Seite bekommt ihr echtes Änderungsdatum (`lastmod`) aus der Git-Historie – inklusive der Datendatei, aus der ihr Inhalt stammt (Front-Matter-Feld `abhaengig_von`). |
| **Nicht in der Sitemap** | `/links/` (Weiterleitung, noindex), 404-Seite, vCard, PDFs, alle Weiterleitungen, IndexNow-Schlüssel, Feed |
| **News** | Jeder neue Beitrag landet automatisch in der Sitemap (mit Änderungsdatum aus Git) und wird nach dem Deploy per IndexNow gemeldet. Strukturierte Daten „BlogPosting" und eigenes Vorschaubild pro Beitrag. Feed: `https://sandro.exemail.at/feed.xml` |
| **robots.txt** | Erlaubt alles und verweist auf die Sitemap |
| **Canonical-Tags** | Jede Seite zeigt auf ihre eindeutige Adresse `https://sandro.exemail.at/…/` (immer https, immer mit `/` am Ende) |
| **Alte Adressen** | Leiten auf die neue Seite weiter (`_data/weiterleitungen.yml`, Tabelle unten) |
| **IndexNow** (Bing, Yandex, Seznam, Naver …) | Nach jedem erfolgreichen Deploy meldet der Workflow alle neuen, geänderten und entfernten Seiten. Ergebnis: GitHub → **Actions** → letzter Lauf → Job **indexnow**. Schlägt nur dieser Job fehl, ist die Website trotzdem online. |
| **Google** | Google unterstützt IndexNow nicht; es liest die Sitemap regelmäßig selbst. Die Google Indexing API wird bewusst **nicht** verwendet (nur für Stellenanzeigen/Livestreams erlaubt). |

**Warum eigene Weiterleitungen statt `jekyll-redirect-from`?** Das Plugin baut ein Inline-Skript ein, das die Sicherheitsrichtlinie (CSP) dieser Website blockiert (Konsolenfehler). Unsere Weiterleitungsseiten machen dasselbe ohne Skript: sofortige Weiterleitung per `<meta http-equiv="refresh">`, Canonical auf die neue Adresse und `noindex`. GitHub Pages kann keine echten 301-Weiterleitungen; Google behandelt diese Seiten wie eine Weiterleitung.

### Alte URL → neue URL

Ermittelt aus allen 337 Commits der Git-Historie.

| Alte URL | Neue URL |
| --- | --- |
| `/contact/`, `/contact.html` | `/kontakt/` |
| `/cv/`, `/cv.html` | `/lebenslauf/` |
| `/certificates/`, `/certificates.html` | `/zertifikate/` |
| `/impressum.html`, `/imprint/` | `/impressum/` |
| `/datenschutz.html`, `/privacy/` | `/datenschutz/` |
| `/impressum/social/` | `/social-impressum/` |
| `/links`, `/links/`, `/links.html` | `/kontakt/` |
| `/projects/`, `/projects.html`, `/projekte/` | `/` (keine Projekte-Seite mehr) |
| `/lab/`, `/lab.html` | `/` (keine Home-Lab-Seite mehr) |
| `/`, `/impressum/`, `/datenschutz/`, `/Sandro_Exenberger.vcf` | unverändert |
| `/default.html`, `/footer.html`, `/nav.html` (frühe Bausteine) | 404 – bewusst ohne Weiterleitung |

### Einmalig: Google Search Console

Deine Domain ist bei Google bereits bestätigt – über einen **DNS-TXT-Eintrag bei `exemail.at`** (Cloudflare). Das ist eine *Domain-Property* und gilt automatisch auch für `sandro.exemail.at`.

1. [search.google.com/search-console](https://search.google.com/search-console) öffnen und die vorhandene Property **`exemail.at`** (Typ „Domain") wählen. Keine neue anlegen.
2. **Sitemaps** (links): alte Einträge, die nicht `https://sandro.exemail.at/sitemap.xml` heißen, über die drei Punkte → **Sitemap entfernen**. Dann `https://sandro.exemail.at/sitemap.xml` eintragen → **Senden**. Status sollte nach kurzer Zeit „Erfolgreich" zeigen.
3. **URL-Prüfung** (Suchfeld oben): nacheinander `https://sandro.exemail.at/`, `/lebenslauf/`, `/zertifikate/`, `/kontakt/`, `/impressum/` eingeben → **Indexierung beantragen**. (Google erlaubt nur ca. 10 Anträge pro Tag – die Hauptseiten reichen.)
4. Nach 1–2 Wochen **Seiten** (Indexierung → Seiten) prüfen. Normal und kein Fehler: „Seite mit Weiterleitung" (alte Adressen) und „Nicht gefunden (404)" (frühe Bausteine). Handlungsbedarf nur bei „Serverfehler" oder wenn Hauptseiten „Gecrawlt – zurzeit nicht indexiert" bleiben.

### Einmalig: Bing Webmaster Tools

1. [bing.com/webmasters](https://www.bing.com/webmasters) öffnen und anmelden.
2. Falls die Website fehlt: **Importieren** → **Google Search Console** → Konto verbinden → `exemail.at` übernehmen (bestätigt die Website automatisch).
3. **Sitemaps** → `https://sandro.exemail.at/sitemap.xml` → **Senden**.
4. **IndexNow** (linkes Menü): Nach dem nächsten Deploy sollten hier die gemeldeten URLs erscheinen.

### Was du danach nie wieder manuell machen musst

Sitemap aktualisieren, Änderungsdaten pflegen, Bing über neue oder geänderte Seiten informieren, alte Sitemaps einreichen – das passiert bei jedem Push auf `main` automatisch. Manuell nur noch: optional bei einer **wichtigen neuen Seite** in der Google Search Console „Indexierung beantragen", wenn es schnell gehen soll.

### Wie lange dauert das?

| Suchmaschine | Realistisch |
| --- | --- |
| Bing, Yandex, Seznam (IndexNow) | meist wenige Stunden bis 2–3 Tage |
| Google, Hauptseiten nach „Indexierung beantragen" | einige Tage bis 2 Wochen |
| Google, übrige Seiten über die Sitemap | 1–4 Wochen |
| Alte Adressen verschwinden aus den Suchergebnissen | mehrere Wochen bis wenige Monate |

---

## 11. NIEMALS löschen

Diese Dateien und Einträge sind für Domain, Druckmedien, Profile oder Suchmaschinen nötig – auch nicht beim Aufräumen:

| Was | Warum |
| --- | --- |
| `CNAME`, `_config.yml`, `Gemfile`, `Gemfile.lock`, `.github/workflows/` | Domain, Einstellungen, Build & Deploy |
| `_data/`, `_includes/`, `_layouts/`, `_sass/`, `_plugins/`, alle Seiten | Die Website selbst |
| `links.html` (`/links/` → `/kontakt/`) und `vcard.vcf` (`/Sandro_Exenberger.vcf`) | QR-Code und Visitenkarte |
| Einträge mit „⚠ NIE LÖSCHEN" in `_data/weiterleitungen.yml` | Gedruckte Visitenkarte (`/contact/`), alte Bio-Links, TikTok-Kurzadresse |
| `indexnow` → `schluessel` in `_config.yml` (erzeugt `/47c07f7ba9589a1160b2a52814ca828d.txt`) | IndexNow lehnt Meldungen sonst ab |
| `verifizierung` in `_config.yml` sowie künftige Dateien wie `google*.html` oder `BingSiteAuth.xml` | Bestätigung bei Google/Bing |
| **DNS-TXT-Eintrag `google-site-verification=…` bei `exemail.at` in Cloudflare** | Bestätigt die Google-Search-Console-Property (liegt nicht im Repository!) |
| `README.md`, `DEPLOYMENT.md`, `RECHTLICHES.md`, `CLAUDE.md`, `.gitignore`, `tools/` | Anleitungen und Werkzeuge |
| Alle Fotos/PDFs, die in `_data/` eingetragen sind (inkl. `assets/img/galerie/`) | Werden auf der Website angezeigt |


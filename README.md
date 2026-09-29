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

---

## 1. Welche Datei ändere ich für was?

| Ich will …                                         | Datei                         | Abschnitt                                  |
| -------------------------------------------------- | ----------------------------- | ------------------------------------------ |
| meinen Namen, Titel oder Vorstellungstext ändern   | `_data/person.yml`            | NAME & TITEL                               |
| das Profilfoto tauschen                            | `_data/person.yml`            | PROFILFOTO (+ Bild in `assets/img/`)       |
| die Karten „Auf einen Blick" ändern                | `_data/person.yml`            | HIGHLIGHTS                                 |
| die Fotogalerie ein-/ausblenden                    | `_data/person.yml`            | FOTOGALERIE → `anzeigen: true/false`       |
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
| QR-Linkseite `/links/` anpassen                    | `_data/linkseite.yml`         | (Links selbst: `social.yml`, `navigation.yml`) |
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
├── README.md                   Diese Anleitung
├── DEPLOYMENT.md               Anleitung: online stellen
├── RECHTLICHES.md              Erklärung der Rechtstexte
├── Gemfile / Gemfile.lock      Ruby-Pakete (Jekyll)
│
├── _data/                   ✏️ HIER BEARBEITEST DU DEINE INHALTE
│   ├── person.yml              Name, Titel, Foto, Wohnort, Highlights, Galerie
│   ├── social.yml              E-Mail, Telefon, LinkedIn, Instagram …
│   ├── navigation.yml          Hauptmenü
│   ├── lebenslauf.yml          Berufserfahrung, Praktika, Ausbildung, Skills …
│   ├── zertifikate.yml         Zertifikate & Kategorien
│   ├── rechtliches.yml         Impressum, Offenlegung, Datenschutz
│   └── footer.yml              Footer-Texte und -Links
│
├── _sass/
│   ├── _theme.scss          ✏️ ZENTRALE DESIGN-DATEI
│   └── _*.scss                 Technische Stil-Dateien (nicht anfassen)
│
├── _includes/                  Bausteine: Header, Footer, Social-Icons, SEO …
├── _layouts/                   Seitenvorlagen: default, page, legal
│
├── index.html                  Startseite
├── lebenslauf.html             /lebenslauf/
├── zertifikate.html            /zertifikate/
├── kontakt.html                /kontakt/
├── impressum.html              /impressum/
├── datenschutz.html            /datenschutz/
├── social-impressum.html       /social-impressum/
├── 404.html                    Fehlerseite
├── robots.txt, site.webmanifest, favicon.ico
│
├── assets/
│   ├── css/main.scss           Bindet alle Stile zusammen
│   ├── js/                     theme-init.js, main.js, hero-canvas.js
│   ├── fonts/                  Inter & JetBrains Mono (lokal, woff2)
│   ├── icons/                  SVG-Icons (+ automatisch erzeugte sprite.svg)
│   ├── img/                 ✏️ Deine Fotos, Favicon, Vorschaubild
│   ├── zertifikate/         ✏️ Zertifikat-PDFs und -Bilder
│   └── lebenslauf/          ✏️ Optional: eigenes Lebenslauf-PDF
│
├── tools/
│   ├── linkedin-import.py      LinkedIn-CSV → YAML
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

**Jede Änderung, die auf GitHub im Branch `main` landet, wird automatisch in 1–2 Minuten veröffentlicht.**

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

1. Foto **quadratisch** zuschneiden, ideal 800 × 800 Pixel.
2. Als `profil.jpg` in den Ordner `assets/img/` legen.
3. Optional (schneller): zusätzlich als `profil.webp` speichern, z. B. kostenlos mit [squoosh.app](https://squoosh.app) (läuft nur im Browser, lädt nichts hoch).
4. In `_data/person.yml`:
   ```yaml
   foto:
     datei: "profil.jpg"
     webp: "profil.webp"      # oder "" wenn keine WebP-Datei
     alt: "Porträtfoto von Sandro Exenberger"
     breite: 800
     hoehe: 800
   ```
5. **Social-Media-Vorschaubild** (`assets/img/og-image.png`, 1200 × 630): kannst du jederzeit durch ein eigenes Bild mit gleichem Namen ersetzen.

**Fotogalerie:** In `person.yml` unter `galerie` → `anzeigen: true` setzen und Bilder nach Vorlage eintragen.

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
       verifizierung_link: "https://www.credly.com/badges/…"
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
- **Neue Plattform:** Vorlage am Dateiende kopieren. Mitgelieferte Icons: `mail`, `phone`, `linkedin`, `instagram`, `github`, `youtube`, `facebook`, `twitter`, `globe`, `message-circle`.
- **Eigenes Icon:** SVG-Datei (24 × 24, am besten von [lucide.dev](https://lucide.dev) oder [simpleicons.org](https://simpleicons.org)) nach `assets/icons/` legen, z. B. `tiktok.svg`, und im Eintrag `icon: "tiktok"` schreiben. Das Icon wird automatisch eingebunden.
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

**Neuen Kanal hinzufügen (z. B. GitHub, YouTube, TikTok):**
1. In `_data/social.yml` die **Vorlage ganz unten** kopieren und **nur** das `#` am Zeilenanfang entfernen (die Leerzeichen danach bleiben – sie sind die Einrückung).
2. `id` festlegen (klein, ohne Leerzeichen, z. B. `github`) – daraus wird `/social-impressum/github/`.
3. Block `rechtliches` ausfüllen: Betreiber + Anschrift und Datenschutz-Link (aus der Datenschutzerklärung der Plattform), Drittland-Text, ggf. Statistik.
4. Speichern → Sprung-Button, Bereich auf der Übersicht, Unterseite und Datenschutztext entstehen automatisch.
5. Den neuen Link in die Bio des Kanals eintragen.

**Kanal aus dem Impressum entfernen:** `impressum_anzeigen: false` – Bereich, Button und Unterseite verschwinden komplett.

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
| **Druck-Layout statt PDF-Bibliothek** | „Als PDF speichern" im Browser liefert ein sauberes A4-PDF ohne zusätzliche Abhängigkeiten. |
| **Leiterbahn-Animation per Canvas** | Leicht (ein Zwischenspeicher, wenige Signale), pausiert außerhalb des Sichtbereichs, aus bei „Bewegung reduzieren". |
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
| **Bild wird nicht angezeigt** | Groß-/Kleinschreibung prüfen: `Profil.JPG` ≠ `profil.jpg`. |
| **Datum erscheint als Text** | Format `"JJJJ-MM"` in Anführungszeichen verwenden. |

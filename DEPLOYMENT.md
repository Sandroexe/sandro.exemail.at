# Deployment – die Website online stellen

Schritt-für-Schritt-Anleitung für **sandro.exemail.at** auf **GitHub Pages** mit DNS bei **Cloudflare**.
Dauer: ca. 30 Minuten + Wartezeit für DNS/Zertifikat (meist Minuten, selten bis 24 h).

| Was | Wert |
| --- | --- |
| GitHub-Benutzer | `Sandroexe` |
| Domain | `sandro.exemail.at` |
| DNS-Ziel | `sandroexe.github.io` |
| Repository-Name (Vorschlag) | `sandro-website` |

---

## Vorbereitung

- [ ] Alle `[BITTE AUSFÜLLEN]`-Stellen erledigt (Checkliste: siehe Antwort bzw. Abschnitt „Vor dem Livegang" unten)
- [ ] Lokale Vorschau funktioniert (`bundle exec jekyll serve`, siehe README)
- [ ] Empfohlen: Projektordner **aus iCloud Drive heraus** verschieben, z. B. nach `~/Developer/sandro`. Git und iCloud vertragen sich nicht immer gut.

---

## Schritt 1 – Repository anlegen und Dateien hochladen

**Empfohlen: mit GitHub Desktop** (lädt auch versteckte Ordner wie `.github/` zuverlässig hoch)

1. [GitHub Desktop](https://desktop.github.com) installieren und mit dem Konto `Sandroexe` anmelden.
2. **File → Add Local Repository…** → deinen Projektordner `sandro` wählen.
   GitHub Desktop fragt, ob ein Repository erstellt werden soll → **create a repository** → Name `sandro-website` → **Create Repository**.
3. Links unten „Initial commit" eintragen → **Commit to main**.
4. Oben **Publish repository**:
   - Name: `sandro-website`
   - **„Keep this code private" abhaken** – GitHub Pages ist mit einem kostenlosen Konto nur für **öffentliche** Repositories verfügbar.
     (Das ist unproblematisch: Es liegen keine geheimen Daten im Code. Der LinkedIn-Export ist per `.gitignore` ausgeschlossen.)
   - **Publish Repository**.

> Alternative Terminal:
> ```bash
> cd ~/Developer/sandro
> git init -b main
> git add .
> git commit -m "Erste Version der Website"
> git remote add origin https://github.com/Sandroexe/sandro-website.git
> git push -u origin main
> ```
> (Vorher auf github.com ein leeres Repository `sandro-website` anlegen – ohne README.)

---

## Schritt 2 – GitHub Pages mit „GitHub Actions" aktivieren

1. Auf github.com das Repository öffnen → **Settings** → links **Pages**.
2. Unter **Build and deployment → Source** die Option **GitHub Actions** wählen.
   (NICHT „Deploy from a branch" – sonst wird das veraltete System verwendet.)
3. Reiter **Actions** öffnen. Der Workflow **„Website bauen & veröffentlichen"** sollte laufen (oder oben rechts **Run workflow** klicken).
4. Nach ca. 1–2 Minuten: grüner Haken ✅. Die Seite ist vorübergehend unter `https://sandroexe.github.io/sandro-website/` erreichbar.

---

## Schritt 3 – Domain bei GitHub verifizieren (Schutz vor Domain-Übernahme)

Damit niemand sonst `exemail.at`-Subdomains auf GitHub verwenden kann:

1. github.com → rechts oben dein Profilbild → **Settings** (Konto-Einstellungen, nicht Repository!) → links **Pages**.
2. **Add a domain** → `exemail.at` eingeben → **Add domain**.
3. GitHub zeigt einen **TXT-Eintrag** an, z. B.:
   - Name: `_github-pages-challenge-Sandroexe`
   - Wert: eine lange Zeichenkette
4. Diesen TXT-Eintrag bei Cloudflare anlegen (siehe Schritt 4, Typ **TXT**).
5. Zurück bei GitHub **Verify** klicken (evtl. ein paar Minuten warten).

---

## Schritt 4 – DNS bei Cloudflare einrichten

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Domain **exemail.at** → **DNS → Records** → **Add record**.
2. Eintrag anlegen:

   | Feld | Wert |
   | --- | --- |
   | Type | `CNAME` |
   | Name | `sandro` |
   | Target | `sandroexe.github.io` |
   | Proxy status | **DNS only** (graue Wolke ☁️ – NICHT orange!) |
   | TTL | Auto |

3. **Save**.

> ⚠️ **Warum „DNS only"?** Mit oranger Wolke (Proxy) kann GitHub kein HTTPS-Zertifikat ausstellen, und der gesamte Besucherverkehr liefe zusätzlich über Cloudflare – das müsste dann in der Datenschutzerklärung stehen (Schalter `cloudflare_proxy` in `rechtliches.yml`).
>
> ⚠️ **CAA-Einträge:** Falls bei `exemail.at` bereits `CAA`-Einträge existieren, muss einer davon `letsencrypt.org` erlauben, sonst scheitert das Zertifikat.
>
> ⚠️ Es darf **keinen zweiten** Eintrag (A, AAAA, CNAME) mit dem Namen `sandro` geben.

---

## Schritt 5 – Custom Domain im Repository eintragen und HTTPS erzwingen

1. Repository → **Settings → Pages**.
2. Unter **Custom domain**: `sandro.exemail.at` eintragen → **Save**.
3. GitHub prüft den DNS-Eintrag („DNS check in progress" → **„DNS check successful"**).
4. Warten, bis das Zertifikat ausgestellt ist (meist 5–30 Minuten, max. 24 h). Danach wird die Checkbox **Enforce HTTPS** anklickbar → **aktivieren** ✅.

> Die Datei `CNAME` im Projekt enthält bereits `sandro.exemail.at`. Beim Deployment über GitHub Actions ist aber die Einstellung aus Schritt 5 maßgeblich – beides zusammen schadet nicht.

---

## Schritt 6 – Prüfen, ob alles läuft

1. **https://sandro.exemail.at** öffnen – Schloss-Symbol in der Adressleiste?
2. **http://sandro.exemail.at** öffnen – wirst du automatisch auf **https** umgeleitet?
3. Alle Menüpunkte und Footer-Links durchklicken.
4. **https://sandro.exemail.at/gibt-es-nicht** – erscheint die eigene 404-Seite?
5. **https://sandro.exemail.at/sitemap.xml** und **/robots.txt** aufrufbar?
6. DNS im Terminal prüfen:
   ```bash
   dig sandro.exemail.at +short
   # erwartet: sandroexe.github.io. und danach IP-Adressen 185.199.x.x
   ```
7. Vorschau für Social Media testen: Link in LinkedIn-Beitrag (nicht absenden) einfügen oder den [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) verwenden.
8. Lighthouse: Chrome → Rechtsklick → Untersuchen → **Lighthouse** → „Analyze page load" (Ziel: ≥ 95 in allen Kategorien).

---

## Typische Fehler

| Problem | Ursache & Lösung |
| --- | --- |
| **„DNS check unsuccessful"** / „Domain does not resolve" | DNS braucht Zeit (meist Minuten, bis 24 h). Eintrag bei Cloudflare prüfen: Name `sandro`, Ziel `sandroexe.github.io`, **graue Wolke**. |
| **„Enforce HTTPS" ausgegraut** | Zertifikat noch nicht fertig. Warten. Hilft nach 24 h nicht: Custom Domain in Settings → Pages **entfernen, speichern, neu eintragen**. CAA-Einträge prüfen. |
| **„Your connection is not private" / Zertifikatsfehler** | Proxy (orange Wolke) aktiv oder Zertifikat noch in Ausstellung → auf „DNS only" stellen und warten. |
| **Zu viele Weiterleitungen** | Cloudflare-Proxy aktiv → „DNS only". |
| **404 von GitHub („There isn't a GitHub Pages site here")** | Source steht nicht auf **GitHub Actions**, Workflow nicht gelaufen, oder Custom Domain nicht eingetragen. Actions-Reiter prüfen. |
| **Workflow rot (Build failed)** | Fehlermeldung im Actions-Log lesen → meist YAML-Tippfehler (README → Fehlerbehebung). |
| **Alte Version wird angezeigt** | Browser-Cache: `Cmd + Shift + R`. |

---

## Vor dem Livegang (Test-Checkliste)

**Inhalte**
- [ ] Keine `[BITTE AUSFÜLLEN]`-Stellen mehr (in der lokalen Vorschau erscheint sonst ein gelber Balken; zusätzlich im Projektordner suchen)
- [ ] Echtes Profilfoto eingesetzt, Alt-Text passt
- [ ] E-Mail-Link öffnet das Mailprogramm mit richtiger Adresse, Telefon-Link wählt richtige Nummer (am Handy testen)
- [ ] LinkedIn-, Instagram- und TikTok-Links führen zum richtigen Profil
- [ ] Lebenslauf-Daten und Zertifikatsdaten stimmen
- [ ] „Lebenslauf herunterladen" erzeugt ein sauberes PDF (Chrome, Safari)

**Recht**
- [ ] Impressum, Datenschutz und Social-Media-Impressum vollständig und geprüft (siehe RECHTLICHES.md)
- [ ] Stand-Datum in `rechtliches.yml` aktuell
- [ ] Nichts auf der Website bietet Leistungen von „Exenberger IT Services" an, solange das Gewerbe nicht angemeldet ist
- [ ] Impressum-Links (`sandro.exemail.at/social-impressum/<kanal>/`) in LinkedIn, Instagram und TikTok eingetragen

**Technik**
- [ ] Hell/Dunkel-Umschalter funktioniert, Auswahl bleibt nach Neuladen erhalten
- [ ] Burger-Menü am Handy öffnet/schließt (auch mit Escape-Taste)
- [ ] Nur mit Tastatur bedienbar (Tab, Enter, Escape) – Fokus immer sichtbar, „Zum Inhalt springen" erscheint beim ersten Tab
- [ ] Zertifikate: Filter und Detailansicht funktionieren
- [ ] In den Systemeinstellungen „Bewegung reduzieren" aktivieren → keine Animationen mehr
- [ ] Browser-Konsole (F12) zeigt keine Fehler
- [ ] Lighthouse ≥ 95 (Performance, Barrierefreiheit, Best Practices, SEO)
- [ ] Getestet auf: Chrome, Safari, Firefox, iPhone/Android
- [ ] HTTPS erzwungen, http → https-Weiterleitung klappt

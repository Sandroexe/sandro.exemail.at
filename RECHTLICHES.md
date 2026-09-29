# Rechtliches – Erklärung zu Impressum, Offenlegung & Datenschutz

> ⚠️ **Wichtiger Hinweis:** Die Rechtstexte dieser Website sind eine **sorgfältig erstellte Vorlage** nach österreichischem Recht (Stand: September 2026). Sie ersetzen **keine Rechtsberatung**. Lass sie vor dem Livegang – und spätestens vor dem Umstieg auf den Unternehmensmodus – prüfen, z. B. durch die **Wirtschaftskammer Tirol** (für Mitglieder bzw. Gründer:innen kostenlos), einen Rechtsanwalt oder die Rechtsinformation des Gründerservice.

Alle Angaben stehen zentral in **`_data/rechtliches.yml`** und werden automatisch auf
**/impressum/**, **/social-impressum/** und **/datenschutz/** verwendet.

---

## 1. Welche Gesetze gelten für diese Website?

| Gesetz | Gilt? | Warum |
| --- | --- | --- |
| **Mediengesetz (MedienG) § 25 – Offenlegung** | ✅ **Ja, immer** | Jede Website und jedes Social-Media-Profil ist ein Medium. Die Offenlegung ist Pflicht (Strafe bis 20.000 €, § 27 MedienG). |
| **MedienG § 24 – Impressum** | ❌ Nein | Gilt nur für Druckwerke und „wiederkehrende elektronische Medien" (z. B. Newsletter), nicht für Websites. |
| **E-Commerce-Gesetz (ECG) § 5** | ⚠️ Erst mit Unternehmen | Gilt für „Diensteanbieter", die wirtschaftlich tätig sind. Eine rein private Bewerbungs-/Portfolio-Website fällt nach herrschender Ansicht nicht darunter. |
| **UGB § 14, GewO § 63** | ⚠️ Erst mit Unternehmen | Pflichtangaben für Unternehmer bzw. Gewerbetreibende. |
| **DSGVO / DSG** | ✅ **Ja** | Sobald Daten verarbeitet werden (schon die IP-Adresse beim Hosting). Eine öffentlich zugängliche Website fällt nicht unter die „Haushaltsausnahme". |
| **TKG 2021 § 165** (Cookies & Co.) | ✅ Ja, aber erfüllt | Die Website speichert nur nach aktivem Klick die Hell/Dunkel-Auswahl – das ist ohne Einwilligung erlaubt. Deshalb **kein Cookie-Banner nötig**. |

### „Kleine Website" nach § 25 Abs. 5 MedienG

Diese Website ist eine sogenannte **„kleine Website"**: Sie stellt nur dich persönlich vor und enthält keine Inhalte, die darüber hinaus die öffentliche Meinung beeinflussen sollen (keine politischen Kommentare, kein Blog mit Meinungsbeiträgen). Dann genügt eine **verkürzte Offenlegung**: Name, Wohnort (bzw. bei Unternehmen: Firma, Unternehmensgegenstand, Sitz). Eine „grundlegende Richtung" (Blattlinie) ist **nicht** Pflicht.

> Wenn du später einen Blog mit Meinungsbeiträgen startest, ändert sich die Einstufung: Dann ist u. a. die **grundlegende Richtung verpflichtend**.

---

## 2. Pflicht oder optional? (`rechtliches.yml`)

### Modus `privat` (aktuell)

| Feld | Status | Hinweis |
| --- | --- | --- |
| `medieninhaber.name` | **Pflicht** | § 25 MedienG |
| `medieninhaber.ort`, `land` | **Pflicht** | Wohnort – die **Gemeinde genügt**, keine Straße nötig |
| `medieninhaber.plz` | optional | |
| `medieninhaber.strasse` | optional | Im Privatmodus bewusst leer gelassen (Privatsphäre). |
| E-Mail (aus `social.yml`) | **Pflicht** (DSGVO) | Die Datenschutzerklärung muss Kontaktdaten des Verantwortlichen nennen (Art. 13 DSGVO). Eine E-Mail-Adresse genügt nach überwiegender Ansicht. |
| `telefon_anzeigen` | optional | |
| `grundlegende_richtung` | optional | Bei „kleiner Website" freiwillig |
| `haftung_links_anzeigen`, `urheberrecht_anzeigen` | optional | Rechtlich nicht vorgeschrieben, aber üblich |
| `bildnachweise` | **Pflicht, wenn** fremde Bilder verwendet werden | Urheberrechtsgesetz – Namensnennung des Urhebers |
| `stand` | empfohlen | |

### Modus `unternehmen` (später)

Zusätzlich zu oben – **alle Pflicht, soweit sie auf dich zutreffen**:

| Feld | Rechtsgrundlage |
| --- | --- |
| `firmenname`, `rechtsform` | ECG § 5, UGB § 14 |
| `medieninhaber.strasse` + `plz` + `ort` | ECG § 5: **vollständige geografische Anschrift** (kein Postfach) |
| E-Mail (aus `social.yml`) | ECG § 5 |
| `unternehmensgegenstand` | MedienG § 25 |
| `uid` | ECG § 5 – nur wenn du eine UID-Nummer hast (Kleinunternehmer oft nicht) |
| `gisa` | GISA-Zahl (Gewerbeinformationssystem Austria) – üblich und empfohlen |
| `firmenbuchnummer`, `firmenbuchgericht` | ECG § 5, UGB § 14 – nur bei Eintragung ins Firmenbuch |
| `gewerbebehoerde` | ECG § 5 – zuständige Aufsichtsbehörde (für Schwoich: BH Kufstein) |
| `kammer` | ECG § 5 – Kammerzugehörigkeit (Wirtschaftskammer Tirol) |
| `gewerbe`, `verleihungsstaat` | ECG § 5 – Berufsbezeichnung und Staat der Verleihung |
| `rechtsvorschriften` + Link | ECG § 5 – Hinweis auf anwendbare Vorschriften (GewO) und Zugang dazu (RIS) |

> 🔔 **Online-Streitbeilegung (OS-Plattform):** Früher mussten Online-Händler auf die EU-OS-Plattform verlinken. Diese Plattform wurde am **20. Juli 2025 eingestellt** – der Link ist nicht mehr nötig und daher bewusst nicht enthalten.

---

## 3. ⚠️ „Exenberger IT Services" – noch NICHT bewerben

Solange das Gewerbe **nicht angemeldet** ist:

- **Keine Leistungen anbieten** („Ich erstelle Ihre Website", Preise, „Jetzt anfragen" …). Nach **§ 1 Abs. 4 GewO** gilt schon das **Anbieten** einer gewerblichen Tätigkeit gegenüber einem größeren Personenkreis als Gewerbeausübung – ohne Gewerbeberechtigung ist das eine Verwaltungsübertretung.
- Erlaubt ist, deine Pläne **als Pläne** zu erwähnen (z. B. im Lebenslauf: „Geplant: Gründung eines IT-Unternehmens").
- Deshalb erwähnt die Website das Unternehmen derzeit **nicht** aktiv, und `modus` steht auf `privat`.

**Wenn es so weit ist:**
1. Gewerbe anmelden (z. B. „Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik" – freies Gewerbe, über [gisa.gv.at](https://www.gisa.gv.at) oder das Gründerservice der WK Tirol).
2. `modus: "unternehmen"` setzen und Abschnitt `unternehmen` ausfüllen.
3. `medieninhaber.strasse` ausfüllen (Pflicht!).
4. Datenschutzerklärung und Impressum prüfen lassen; `stand` aktualisieren.

---

## 4. Social-Media-Impressum einrichten

Auch deine **Social-Media-Profile** sind Medien im Sinne des MedienG und brauchen eine Offenlegung. Diese muss **„leicht und unmittelbar auffindbar"** sein – maximal **zwei Klicks** vom Profil entfernt, mit einer eindeutigen Bezeichnung wie **„Impressum"**.

Deine Adresse dafür:

```
https://sandro.exemail.at/social-impressum/
```

Welche Kanäle dort aufgelistet werden, steuerst du in `_data/social.yml` mit `impressum: true`.

### Instagram

1. Profil → **Profil bearbeiten** → **Links** → **Externen Link hinzufügen**.
2. URL: `https://sandro.exemail.at/social-impressum/`
3. Titel: **Impressum**
4. Wenn du mehrere Links hast: den Impressum-Link **an erste Stelle** ziehen, oder in der Bio ergänzen: `Impressum ⬇️` bzw. `Impressum: sandro.exemail.at/social-impressum`.

### LinkedIn (persönliches Profil)

1. Profil → **Kontaktinfo** → Stift-Symbol → **Website hinzufügen**.
2. URL: `https://sandro.exemail.at/social-impressum/` – Typ: **Sonstiges** – Bezeichnung: **Impressum**.
3. Zusätzlich empfohlen: in den Abschnitt **Info** als letzte Zeile schreiben:
   `Impressum: sandro.exemail.at/social-impressum`

### Weitere Plattformen (falls später)

| Plattform | Wo eintragen |
| --- | --- |
| **LinkedIn-Unternehmensseite** | Seite bearbeiten → **Info** → **Website** bzw. benutzerdefinierter Button, plus Hinweis im Info-Text |
| **YouTube** | Kanal anpassen → **Profil** → **Links** → Titel „Impressum", außerdem in der Kanalbeschreibung |
| **TikTok** | **Website**-Feld im Profil (falls verfügbar) bzw. Bio: `Impressum: sandro.exemail.at/social-impressum` |
| **GitHub** | Profil → **Edit profile** → **Website**, oder Link im Profil-README |
| **Facebook** | Seite → **Info** → **Impressum**-Feld |

---

## 5. Datenschutzerklärung – was steht drin und warum?

| Abschnitt | Inhalt |
| --- | --- |
| Verantwortlicher | Du, mit Kontaktdaten (aus `rechtliches.yml` + `social.yml`) |
| Hosting | GitHub Pages speichert Server-Logfiles mit IP-Adresse → Art. 6 Abs. 1 lit. f DSGVO; USA-Übermittlung über das EU-US Data Privacy Framework |
| Cloudflare | **Nur**, wenn `cloudflare_proxy: true` (bei „DNS only" nicht nötig) |
| Schriftarten | Lokal gehostet, keine Verbindung zu Google |
| Local Storage | Hell/Dunkel-Auswahl, erst nach Klick, kein Cookie → § 165 Abs. 3 TKG 2021 |
| Kontaktaufnahme | E-Mail/Telefon: Zweck, Rechtsgrundlage, Speicherdauer. Tipp: `email_anbieter` in `rechtliches.yml` eintragen. |
| Kontaktformular | **Nur**, wenn in `_config.yml` aktiviert |
| Social-Media-Links | Reine Links, keine Datenübertragung beim Seitenaufruf |
| Betroffenenrechte & Beschwerde | Art. 15–21 DSGVO, Österreichische Datenschutzbehörde |

**Wann musst du die Datenschutzerklärung anpassen?**
Sobald du etwas Neues einbaust, das Daten verarbeitet: eingebettete Videos (YouTube), Karten (Google Maps), Analyse-Tools, Newsletter, externe Schriften, einen anderen Hoster. Dann `stand` aktualisieren.

---

## 6. Regelmäßig prüfen

- [ ] Einmal im Jahr: Sind alle Angaben noch aktuell (Wohnort, E-Mail, Kanäle)?
- [ ] Neuer Social-Media-Kanal → in `social.yml` mit `impressum: true` eintragen **und** Impressum-Link im neuen Profil setzen.
- [ ] Nach jeder inhaltlichen Änderung der Rechtstexte: `stand` in `rechtliches.yml` aktualisieren.

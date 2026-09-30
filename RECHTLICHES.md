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

### ⚠ Aktuelle Einstufung: KEINE „kleine Website" mehr

Seit dem Abschnitt **„Politisches Engagement"** im Lebenslauf (u. a. FPÖ-Kandidatur zum Tiroler Landtag) enthält die Website Inhalte, die geeignet sind, die öffentliche Meinung zu beeinflussen. Deshalb gilt die **volle Offenlegung nach § 25 Abs. 2–4 MedienG**:

- Name und Wohnort des Medieninhabers (Gemeinde genügt weiterhin – **keine Straße nötig**)
- **grundlegende Richtung (Blattlinie) ist PFLICHT** und nennt das politische Engagement – für die Website (`rechtliches.yml` → `grundlegende_richtung`) **und** für jeden Social-Media-Kanal (`social.yml` → `rechtliches` → `grundlegende_richtung`)
- Schalter `kleine_website: false` in `rechtliches.yml` – der Hinweissatz „kleine Website" im Impressum ist damit ausgeblendet

Solltest du die politischen Einträge wieder entfernen, kannst du `kleine_website: true` setzen.

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

## 4. Social-Media-Impressum – ein Bereich pro Kanal

Auch deine **Social-Media-Profile** sind Medien im Sinne des MedienG und brauchen eine Offenlegung. Sie muss **„leicht und unmittelbar erreichbar"** sein: höchstens **zwei Klicks** vom Profil entfernt und mit einer eindeutigen Bezeichnung wie **„Impressum"**.

### Aufbau

- **Übersicht:** `sandro.exemail.at/social-impressum/` – Einleitung, Sprung-Buttons, pro Kanal ein aufklappbarer Bereich, am Ende „Für alle Kanäle" (Betroffenenrechte, Beschwerderecht, Link zur Datenschutzerklärung).
- **Eigene Unterseite pro Kanal** (automatisch erzeugt): `sandro.exemail.at/social-impressum/instagram/`, `…/linkedin/`
- **Sprungmarke auf der Übersicht:** `…/social-impressum/#instagram` öffnet den Kanal, scrollt hin und hebt ihn kurz hervor.

### Welcher Link gehört in die Bio? → die Unterseite

**Entscheidung: `/social-impressum/<kanal>/` statt `#<kanal>`.** Gründe:

1. **Robuster:** Manche In-App-Browser (Instagram, LinkedIn) und Link-Kürzer schneiden den `#`-Teil ab oder scrollen nicht zuverlässig dorthin. Eine eigene Adresse funktioniert immer.
2. **Unmittelbar:** Die Unterseite zeigt sofort genau diesen Kanal – ohne Aufklappen, ohne JavaScript.
3. **Eigenständig:** Eigener Seitentitel („Instagram – Impressum & Datenschutz"), eigene Google-Vorschau.

Die `#`-Sprungmarken bleiben zusätzlich für die Navigation auf der Übersicht erhalten.

| Kanal | Link für die Bio |
| --- | --- |
| LinkedIn | `https://sandro.exemail.at/social-impressum/linkedin/` |
| Instagram | `https://sandro.exemail.at/social-impressum/instagram/` |
| Facebook (Seite) | `https://sandro.exemail.at/social-impressum/facebook/` |
| Facebook (Profil) | `https://sandro.exemail.at/social-impressum/facebook-profil/` |
| TikTok | `https://sandro.exemail.at/social-impressum/tiktok/` |

> ⚠️ Die `id` eines Kanals in `social.yml` **nie mehr ändern**, sobald der Link in einer Bio steht.

### Wo genau eintragen?

**Instagram**
1. Profil → **Profil bearbeiten** → **Links** → **Externen Link hinzufügen**.
2. URL: `https://sandro.exemail.at/social-impressum/instagram/` – Titel: **Impressum**
3. Bei mehreren Links den Impressum-Link **an die erste Stelle** ziehen (nur der erste ist ohne weiteren Klick sichtbar).
4. Zusätzlich in die **Bio** (Text) als letzte Zeile: `Impressum: sandro.exemail.at/social-impressum/instagram`

**LinkedIn (persönliches Profil)**
1. Profil → **Kontaktinfo** → Stift-Symbol → **Website hinzufügen**.
2. URL: `https://sandro.exemail.at/social-impressum/linkedin/` – Typ: **Sonstiges** – Bezeichnung: **Impressum**
3. Zusätzlich im Abschnitt **Info** als letzte Zeile: `Impressum: sandro.exemail.at/social-impressum/linkedin`
   (Die Kontaktinfo ist auf dem Handy nur über einen Extra-Klick erreichbar – der Hinweis im Info-Text macht es eindeutig.)

**Facebook (deine Seite „Sandro Exenberger“)**

Der Direktlink gehört auf die **Facebook-Seite**, die auf der Website verlinkt ist. Beide Stellen nutzen:

1. **Website-Feld:** Zur Seite wechseln → **Seite bearbeiten** bzw. **Info** → **Kontaktinfo und Basisinfo** → **Website hinzufügen** → `https://sandro.exemail.at/social-impressum/facebook/`. Erscheint im Intro-Bereich direkt unter dem Seitennamen.
2. **Intro/Beschreibung (Bio):** Seite → **Intro bearbeiten** → als letzte Zeile: `Impressum: sandro.exemail.at/social-impressum/facebook` (der Text-Link ist anklickbar).
3. Optional zusätzlich: einen Beitrag „Impressum & Datenschutz" mit dem Link erstellen und **oben anpinnen**.

**Facebook (dein persönliches Profil `facebook.com/sandro.exenberger`)**

Das öffentliche persönliche Profil ist ein eigener Kanal mit eigener Offenlegung – **ohne** gemeinsame Verantwortlichkeit mit Meta, weil persönliche Profile keine Seitenstatistik haben.

1. **Website/Link:** Profil → **Details bearbeiten** (bzw. **Intro bearbeiten**) → **Links** → **Link hinzufügen** → `https://sandro.exemail.at/social-impressum/facebook-profil/`
2. **Kurzbeschreibung (Bio, max. 101 Zeichen):** `Impressum: sandro.exemail.at/social-impressum/facebook-profil`
3. Sichtbarkeit von Link und Bio auf **Öffentlich** stellen (Weltkugel-Symbol).

**TikTok**

TikTok zeigt das anklickbare **Website-Feld** (Profil bearbeiten → **Website**) nur bei **Unternehmenskonten** oder bei **persönlichen Konten ab ca. 1.000 Followern**; es lässt sich nur in der App bearbeiten und die Adresse muss mit `https://` beginnen.

1. **Website-Feld vorhanden?** → `https://sandro.exemail.at/social-impressum/tiktok/` eintragen.
2. **Zusätzlich immer in die Bio** (Text, TikTok erlaubt max. 80 Zeichen). Dafür gibt es die Kurzadresse `sandro.exemail.at/i/tiktok`, die auf die TikTok-Unterseite weiterleitet:
   `Sandro Exenberger, Schwoich · Impressum: sandro.exemail.at/i/tiktok` (67 Zeichen)
3. **Kein Website-Feld (persönliches Konto unter 1.000 Followern)?** Dann ist genau diese Bio-Zeile die beste Alternative: Name und Wohnort sind bei einer „kleinen Website" bereits die vollständige Offenlegung nach § 25 Abs. 5 MedienG und damit **ohne Klick** sichtbar; die Kurzadresse führt zu Datenschutzhinweisen und Details. **[RECHTLICH PRÜFEN]** ob das als „leicht und unmittelbar erreichbar" genügt.
4. Umstellen auf ein **Unternehmenskonto** schaltet den Link sofort frei, schränkt aber die Musikbibliothek ein und passt erst, wenn du tatsächlich unternehmerisch auftrittst.

**Weitere Plattformen (falls später):** Link zur Kanal-Unterseite `/social-impressum/<id>/` ins **Website-/Link-Feld** des Profils und zusätzlich als letzte Zeile in die **Bio/Beschreibung**, jeweils mit der Bezeichnung „Impressum".

### Pflicht oder freiwillig? (Block `rechtliches` je Kanal in `social.yml`)

| Angabe | Status | Grundlage |
| --- | --- | --- |
| Offenlegung: Name, Wohnort (aus `rechtliches.yml`) | **Pflicht** | § 25 MedienG |
| Kanal/Handle und Link zum Profil | **Pflicht** (Zuordnung, für welchen Kanal die Offenlegung gilt) | § 25 MedienG |
| E-Mail als Kontakt des Verantwortlichen | **Pflicht** | Art. 13 DSGVO |
| `betreiber_name`, `betreiber_anschrift` | **Pflicht** in den Datenschutzhinweisen (Empfänger/Verantwortlicher der Plattformverarbeitung) | Art. 13 DSGVO |
| Welche Daten, Zweck, Rechtsgrundlage, Speicherdauer, Rechte, Beschwerderecht | **Pflicht** | Art. 13 DSGVO |
| `drittland_text` | **Pflicht**, sobald die Plattform Daten in die USA übermittelt | Art. 13 Abs. 1 lit. f DSGVO |
| `datenschutz_link_plattform` | dringend empfohlen | – |
| `gemeinsame_verantwortung` + `vereinbarung_link` | **Pflicht nur** bei Unternehmens-/Fanseiten mit Seitenstatistik | Art. 26 DSGVO |
| `grundlegende_richtung` | freiwillig (bei „kleiner Website"/persönlichem Profil) | § 25 Abs. 5 MedienG |
| `insights_…`, `einstellungen_link_plattform`, `rechte_link_plattform`, `zusaetzliche_hinweise` | freiwillig (Transparenz) | – |
| § 5 ECG | erst im Modus `unternehmen` | ECG |

### Einschätzung: Gemeinsame Verantwortlichkeit bei persönlichen Profilen

Das EuGH-Urteil C-210/16 („Fanpage", 2018) betraf den Betreiber einer **Unternehmens-/Fanseite**, der über die Seitenstatistiken („Insights") der Plattform mitbestimmt, welche Statistiken über Besucher erstellt werden. Bei einem **persönlichen Profil** legst du weder Zwecke noch Mittel der Plattform-Verarbeitung fest. LinkedIn bietet seine Vereinbarung nach Art. 26 DSGVO („Page Insights Joint Controller Addendum") ausdrücklich **nur für Unternehmensseiten** an.
➡️ Deshalb steht bei LinkedIn und Instagram `gemeinsame_verantwortung: false`, und der Text erklärt das offen.

**Ausnahme Facebook-Seite:** Genau diesen Fall hat der EuGH in C-210/16 entschieden: Betreiber einer Facebook-**Seite** sind für die Seitenstatistiken (Insights) gemeinsam mit Meta verantwortlich. Deshalb steht bei Facebook `gemeinsame_verantwortung: true`, verlinkt ist Metas **„Page Insights Controller Addendum"** (<https://www.facebook.com/legal/terms/page_controller_addendum>). Darin übernimmt Meta die Hauptverantwortung für die Insights-Daten, u. a. für die Erfüllung der Betroffenenrechte.

**Ausnahme TikTok:** TikToks „Analytics Joint Controller Addendum" gilt laut Wortlaut für **jedes Konto, das TikTok Analytics erhält** – unabhängig vom Kontotyp. TikTok Analytics steht allen Konten zur Verfügung. Deshalb ist bei TikTok vorsichtshalber `gemeinsame_verantwortung: true` gesetzt und die Vereinbarung verlinkt. TikTok übernimmt darin u. a. Rechtsgrundlage, Information und die Erfüllung der Betroffenenrechte für diese Statistikdaten.

### Stellen, bei denen ich mir rechtlich nicht sicher bin

- **[RECHTLICH PRÜFEN]** Keine gemeinsame Verantwortlichkeit bei persönlichem Profil (siehe oben) – insbesondere bei LinkedIn, weil LinkedIn auch persönlichen Profilen Statistiken anzeigt, und bei Instagram, **falls** du auf ein professionelles Konto (Creator/Business) mit Insights umstellst. Dann `insights_genutzt: true` setzen und klären, ob Metas „Controller Addendum" (Vereinbarung zur gemeinsamen Verantwortlichkeit, auf den Rechtsseiten von Meta) für Instagram gilt.
- **[RECHTLICH PRÜFEN]** TikTok: gemeinsame Verantwortlichkeit über das „Analytics Joint Controller Addendum" auch beim persönlichen Konto (derzeit so angenommen).
- **[RECHTLICH PRÜFEN]** TikTok: Darstellung der Übermittlungen in Drittländer (USA, Malaysia, Singapur; Entscheidung der irischen Datenschutzbehörde vom 2. Mai 2025 zu China) – Stand des Verfahrens prüfen.
- **[RECHTLICH PRÜFEN]** TikTok ohne anklickbaren Bio-Link: genügt Name + Wohnort + Kurzadresse als Text in der Bio?
- **[RECHTLICH PRÜFEN]** Politische Inhalte: Reichen Name + Wohnort + Blattlinie als Offenlegung nach § 25 Abs. 2–4 MedienG, und passt die Formulierung der Blattlinie (Website + alle Kanäle)?
- **[RECHTLICH PRÜFEN]** Kein § 5 ECG für private, nicht wirtschaftlich genutzte Kanäle.
- **[RECHTLICH PRÜFEN]** Drittland-Grundlagen (DPF + Standardvertragsklauseln) für LinkedIn Corporation und Meta Platforms, Inc. – Zertifizierung auf <https://www.dataprivacyframework.gov/list> nachsehen.
- **[RECHTLICH PRÜFEN]** Anschriften der Betreiber (Stand September 2026, aus den Datenschutzerklärungen der Plattformen) – einmal jährlich kontrollieren.

Die Markierungen stehen auch als Kommentare in `_includes/social-kanal.html` und sind auf der Website nicht sichtbar.

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
| Galerie | **Kein eigener Abschnitt nötig:** Alle Fotos und die Großansicht liegen auf dieser Website selbst (kein Drittanbieter, keine Cookies, kein Local Storage). Das deckt der bestehende Satz „Schriftarten, Symbole und Bilder werden ausschließlich von dieser Website selbst geladen" ab. Siehe Abschnitt 7. |
| Betroffenenrechte & Beschwerde | Art. 15–21 DSGVO, Österreichische Datenschutzbehörde |

**Wann musst du die Datenschutzerklärung anpassen?**
Sobald du etwas Neues einbaust, das Daten verarbeitet: eingebettete Videos, Karten, Analyse-Tools, Newsletter, externe Schriften, einen anderen Hoster. Dann `stand` aktualisieren. (Die Galerie gehört **nicht** dazu – siehe Abschnitt 7.)

---

## 6. Regelmäßig prüfen

- [ ] Einmal im Jahr: Sind alle Angaben noch aktuell (Wohnort, E-Mail, Kanäle)?
- [ ] Neuer Social-Media-Kanal → Vorlage in `social.yml` kopieren (inkl. Block `rechtliches`) **und** den Link `/social-impressum/<id>/` im neuen Profil setzen.
- [ ] Nach jeder inhaltlichen Änderung der Rechtstexte: `stand` in `rechtliches.yml` aktualisieren.
- [ ] Neues Foto in der Galerie → Erlaubnis von Fotograf und erkennbaren Personen? (`erlaubnis_eingeholt` in `galerie.yml`)

---

## 7. Fotos in der Galerie – Recht am eigenen Bild & Urheberrecht

**Kurz:** Bevor ein Foto in `_data/galerie.yml` auf `anzeigen: true` steht, müssen zwei Fragen mit „Ja" beantwortet sein:

| Frage | Warum | Was tun |
| --- | --- | --- |
| **Sind alle erkennbaren Personen einverstanden?** | Recht am eigenen Bild (§ 78 Urheberrechtsgesetz) und DSGVO: Ein Foto einer erkennbaren Person ist ein personenbezogenes Datum. Auf einer privaten Website ist die Einwilligung der sicherste Weg (Art. 6 Abs. 1 lit. a DSGVO). | Vorher fragen, am besten schriftlich (E-Mail/Nachricht genügt). Wer später widerruft, dessen Foto nimmst du heraus (`anzeigen: false`). |
| **Darfst du das Foto verwenden, wenn jemand anderes es gemacht hat?** | Der Fotograf hat das Urheberrecht (§§ 1, 20 UrhG, auch bei Handyfotos) und das Recht, genannt zu werden. | Erlaubnis einholen und den Namen unter `fotograf` eintragen – er erscheint dann **automatisch** im Impressum unter „Bildnachweise". Nennt der Fotograf einen bestimmten Wortlaut (z. B. „Foto: Land Tirol/Name"), genau den verwenden. |

`erlaubnis_eingeholt: true/false` ist nur eine Merkhilfe für dich und erscheint nirgends auf der Website. Den Nachweis (E-Mail, Nachricht) hebst du selbst auf.

**Technisch schon erledigt:**
- Auf der Website werden alle Metadaten entfernt (Kamera, Aufnahmezeit, **GPS-Standort**).
- ⚠️ Das **Original** liegt aber im öffentlichen GitHub-Repository. Deshalb vor dem Hochladen den Standort entfernen (Anleitung: README 5.11). Der Build zeigt eine gelbe Warnung, wenn ein Original noch GPS-Daten enthält.

**Datenschutzerklärung:** muss für die Galerie **nicht** angepasst werden – alle Bilder werden von dieser Website selbst ausgeliefert, es gibt keine Verbindung zu Dritten, keine Cookies und keinen Local Storage. Die Fotos selbst sind durch die Einwilligung der abgebildeten Personen gedeckt (siehe oben), nicht durch die Datenschutzerklärung.

**Stellen, bei denen ich mir rechtlich nicht sicher bin:**
- **[RECHTLICH PRÜFEN]** Fotos mit **Minderjährigen** (z. B. Mitschüler): Bis 14 entscheiden die Eltern; bei 14- bis 17-Jährigen ist unklar, ob ihre eigene Zustimmung allein reicht. Im Zweifel Zustimmung von Schüler **und** Eltern einholen oder nur Fotos ohne erkennbare Mitschüler verwenden.
- **[RECHTLICH PRÜFEN]** Fotos, die der **Landtag, eine Partei oder die Schule** gemacht hat (z. B. „Rede im Tiroler Landtag"): Oft gibt es Nutzungsbedingungen (nur redaktionelle Nutzung, Pflicht-Bildnachweis). Vor der Veröffentlichung bei der Pressestelle nachfragen und den geforderten Bildnachweis unter `fotograf` eintragen.
- **[RECHTLICH PRÜFEN]** Fotos von **öffentlichen Veranstaltungen** mit vielen Menschen im Hintergrund: Personen, die nur „Beiwerk" sind, müssen meist nicht einzeln zustimmen – die Grenze ist aber Einzelfallfrage. Deutlich erkennbare Einzelpersonen lieber fragen.


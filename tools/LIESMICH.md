# LinkedIn-Daten übernehmen

Das Skript `linkedin-import.py` wandelt deinen LinkedIn-Datenexport in fertige YAML-Blöcke für
`_data/lebenslauf.yml` und `_data/zertifikate.yml` um.
Es **verändert deine bestehenden Dateien nicht** – du kopierst die Ergebnisse selbst hinein.

## 1. Daten bei LinkedIn anfordern

1. LinkedIn → Profilbild → **Einstellungen & Datenschutz** → **Datenschutz** → **Kopie Ihrer Daten abrufen**.
2. **„Möchten Sie etwas Bestimmtes?"** wählen und ankreuzen: *Positionen, Ausbildung, Zertifizierungen, Kenntnisse, Sprachen* (und ggf. *Ehrenamtliche Tätigkeit*).
3. **Archiv anfordern**. Nach ca. 10 Minuten (manchmal bis 24 h) kommt eine E-Mail mit dem Download-Link.

## 2. Dateien ablegen

ZIP entpacken und die CSV-Dateien in diesen Ordner legen:

```
tools/linkedin-export/
├── Positions.csv
├── Education.csv
├── Certifications.csv
├── Skills.csv
├── Languages.csv
└── Volunteering.csv   (falls vorhanden)
```

> 🔒 Der Ordner `tools/linkedin-export/` ist in `.gitignore` eingetragen und wird **nicht** auf GitHub hochgeladen. Trotzdem nach dem Import am besten löschen.

## 3. Skript ausführen

Im Terminal im Projektordner (Python 3 ist auf dem Mac vorinstalliert):

```bash
python3 tools/linkedin-import.py tools/linkedin-export
```

Ausgabe z. B.:

```
Fertig! Gefunden:
  3 Positionen, 2 Ausbildungen, 1 Ehrenämter,
  14 Skills, 2 Sprachen, 1 Zertifikate
Ergebnis liegt in: …/tools/ausgabe
```

## 4. Ergebnis übernehmen

1. `tools/ausgabe/lebenslauf.import.yml` öffnen.
2. Die gewünschten Einträge (jeweils ab `- position:` / `- schule:` …) in den passenden Abschnitt von `_data/lebenslauf.yml` unter `eintraege:` kopieren. **Einrückung beibehalten!**
3. Nacharbeiten:
   - Praktika von `berufserfahrung` nach `praktika` verschieben.
   - Feld `art` ergänzen (Teilzeit, Praktikum …).
   - Skills auf sinnvolle Gruppen aufteilen.
   - Bei laufender Ausbildung `voraussichtlich: true` setzen.
4. Genauso mit `zertifikate.import.yml` → `_data/zertifikate.yml` (Kategorie anpassen!).
5. Lokale Vorschau prüfen, danach `tools/ausgabe/` und `tools/linkedin-export/` löschen.

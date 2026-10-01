---
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  ✏️  VORLAGE: EIGENER NEWS-BEITRAG                                        ║
# ╠══════════════════════════════════════════════════════════════════════════╣
# ║  So geht's (Details: README.md → Abschnitt 5.12):                        ║
# ║    1. Diese Datei KOPIEREN (nicht hier schreiben!) und im Ordner         ║
# ║       _posts/  speichern.                                                ║
# ║    2. Dateiname:  JJJJ-MM-TT-titel-in-kleinbuchstaben.md                 ║
# ║       z. B.  2026-10-15-besuch-im-landtag.md                             ║
# ║       → Das Datum im Namen ist das Veröffentlichungsdatum.               ║
# ║       → Der Rest wird zur Adresse:  /news/besuch-im-landtag/             ║
# ║         (nur a–z, 0–9 und Bindestriche, keine Umlaute/Leerzeichen)       ║
# ║    3. Die Felder unten ausfüllen, darunter (nach den drei Strichen ---)  ║
# ║       den Text in Markdown schreiben.                                    ║
# ║    4. Titelbild (optional) nach  assets/img/galerie/  hochladen und      ║
# ║       nur den Dateinamen eintragen. Verkleinern und GPS entfernen        ║
# ║       passieren automatisch. Es muss NICHT in der Galerie erscheinen.    ║
# ║                                                                          ║
# ║  Was sollte ich NICHT ändern?                                            ║
# ║    Die Feldnamen, die Einrückung und die beiden Zeilen mit  ---          ║
# ║                                                                          ║
# ║  Diese Kommentarzeilen (mit #) darfst du in deiner Kopie löschen.        ║
# ╚══════════════════════════════════════════════════════════════════════════╝

titel: "Titel des Beitrags"            # (Pflicht) Überschrift – auch für Google und Social Media
kurzbeschreibung: >-                   # (Pflicht) 1–2 Sätze, max. ca. 155 Zeichen: Vorschau auf /news/, Startseite und Google
  Worum geht es in diesem Beitrag? Ein bis zwei Sätze.
datum: ""                              # (optional) nur wenn abweichend vom Dateinamen, Format "JJJJ-MM-TT"
kategorie: "Politik"                   # eine der Kategorien aus _data/news.yml (Politik, Schule, Technik, Persönliches)
tags: []                               # (optional) Schlagwörter, z. B. ["Landtag", "Schülervertretung"]
titelbild: ""                          # (optional) Dateiname in assets/img/galerie/, z. B. "landtag-rede.jpg"
bild_alt: ""                           # Was ist auf dem Titelbild zu sehen? (Pflicht, wenn titelbild gesetzt)
fotograf: ""                           # (optional) Wer hat das Titelbild gemacht? Leer = du selbst. Erscheint unter dem Bild und im Impressum.
veroeffentlicht: true                  # false = Beitrag ist nirgends sichtbar (Entwurf)
auf_startseite: true                   # false = nur auf /news/, nicht unter "Aktuelles" auf der Startseite
---

Hier beginnt der Text. Ein Absatz ist einfach ein Block Text,
zwischen zwei Absätzen bleibt eine Zeile frei.

## Zwischenüberschrift

Text mit **fett**, *kursiv* und einem [Link](https://sandro.exemail.at/).

- Aufzählung
- noch ein Punkt

> Ein Zitat steht nach einem Größer-Zeichen.

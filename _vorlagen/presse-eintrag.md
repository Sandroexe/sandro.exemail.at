---
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  ✏️  VORLAGE: PRESSE-EINTRAG ("Ich in den Medien")                        ║
# ╠══════════════════════════════════════════════════════════════════════════╣
# ║  So geht's (Details: README.md → Abschnitt 5.12):                        ║
# ║    1. Diese Datei KOPIEREN und im Ordner  _presse/  speichern.           ║
# ║    2. Dateiname:  JJJJ-MM-TT-medium-stichwort.md                         ║
# ║       z. B.  2026-10-01-meinbezirk-kandidatenliste.md                    ║
# ║    3. Felder ausfüllen. Unter den drei Strichen kommt NICHTS.            ║
# ║                                                                          ║
# ║  ⚖️  WICHTIG (Urheberrecht & Datenschutz):                                ║
# ║    • Zusammenfassung in DEINEN eigenen Worten – keine Sätze aus dem      ║
# ║      Artikel abschreiben.                                                ║
# ║    • KEINE Fotos, Logos oder Texte aus dem Artikel übernehmen. Als Bild  ║
# ║      nur ein eigenes Foto aus deiner Galerie – oder gar keins (dann      ║
# ║      erscheint ein neutrales Zeitungs-Symbol).                           ║
# ║    • Es wird nichts von der Nachrichtenseite eingebettet; Besucher       ║
# ║      kommen erst per Klick auf "Artikel lesen auf …" dorthin.            ║
# ║                                                                          ║
# ║  Was sollte ich NICHT ändern?                                            ║
# ║    Die Feldnamen, die Einrückung und die beiden Zeilen mit  ---          ║
# ║                                                                          ║
# ║  Diese Kommentarzeilen (mit #) darfst du in deiner Kopie löschen.        ║
# ╚══════════════════════════════════════════════════════════════════════════╝

titel: "Überschrift des Artikels"      # (Pflicht) genau wie beim Medium
medium: "MeinBezirk Kufstein"          # (Pflicht) Name der Zeitung/Website – erscheint als "Artikel lesen auf …"
datum: "2026-10-01"                    # (Pflicht) Erscheinungsdatum des Artikels, "JJJJ-MM-TT"
link: "https://…"                      # (Pflicht) vollständige Adresse des Artikels
eigene_zusammenfassung: >-             # (Pflicht) 2–3 Sätze in DEINEN Worten: Worum geht es, welche Rolle hast du?
  Worum geht es im Artikel und was ist meine Rolle darin?
zitat: ""                              # (optional, sparsam!) max. ein kurzer Satz wörtlich aus dem Artikel – wird als Zitat mit Quelle gezeigt
kategorie: "Politik"                   # eine der Kategorien aus _data/news.yml
bild: ""                               # (optional) EIGENES Foto: Dateiname in assets/img/galerie/ – nie das Foto des Mediums
bild_alt: ""                           # Was ist auf dem Foto zu sehen?
veroeffentlicht: true                  # false = ausblenden
auf_startseite: true                   # false = nur auf /news/, nicht unter "Aktuelles"
---

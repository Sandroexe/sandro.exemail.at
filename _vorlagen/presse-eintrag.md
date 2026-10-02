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
# ║  So sieht die Karte aus:                                                 ║
# ║    „Schlagzeile" – Medium, Datum      (als Zitat mit Quelle)             ║
# ║    Dein eigener Satz                  (eigene_zusammenfassung)           ║
# ║    [Ganzen Artikel auf … lesen]       (öffnet in neuem Tab)              ║
# ║                                                                          ║
# ║  ⚖️  WICHTIG (Urheberrecht & Datenschutz):                                ║
# ║    • Außer der Schlagzeile NICHTS aus dem Artikel übernehmen – dein      ║
# ║      Satz in DEINEN eigenen Worten, nur mit Angaben, die im Artikel      ║
# ║      wirklich stehen.                                                    ║
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

titel: "Überschrift des Artikels"      # (Pflicht) Original-Schlagzeile, Wort für Wort – wird als Zitat mit Quelle angezeigt
medium: "MeinBezirk Kufstein"          # (Pflicht) Name der Zeitung/Website – steht als Quelle unter der Schlagzeile
datum: "2026-10-01"                    # (Pflicht) Erscheinungsdatum des Artikels, "JJJJ-MM-TT"
link: "https://…"                      # (Pflicht) vollständige Adresse des Artikels
eigene_zusammenfassung: >-             # (Pflicht) 1–2 Sätze in DEINEN Worten, z. B. was der Artikel über dich sagt
  Ein persönlicher Satz, z. B. warum der Artikel für mich wichtig ist.
button_text: ""                        # (optional) Beschriftung des Buttons. Leer = "Ganzen Artikel auf <medium> lesen"
kategorie: "Politik"                   # eine der Kategorien aus _data/news.yml
bild: ""                               # (optional) EIGENES Foto: Dateiname in assets/img/galerie/ – nie das Foto des Mediums
bild_alt: ""                           # Was ist auf dem Foto zu sehen?
fotograf: ""                           # (optional) Wer hat DEIN Foto gemacht? Leer = du selbst. Erscheint im Impressum.
veroeffentlicht: true                  # false = ausblenden
auf_startseite: true                   # false = nur auf /news/, nicht unter "Aktuelles"
---

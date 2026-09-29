#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════
 LinkedIn-Import: wandelt deinen LinkedIn-Datenexport (CSV-Dateien) in
 YAML-Blöcke für _data/lebenslauf.yml und _data/zertifikate.yml um.

 Anleitung: tools/LIESMICH.md

 Verwendung:
     python3 tools/linkedin-import.py tools/linkedin-export

 Ergebnis (deine bestehenden Dateien werden NICHT verändert):
     tools/ausgabe/lebenslauf.import.yml
     tools/ausgabe/zertifikate.import.yml
 Von dort kopierst du die gewünschten Einträge in die Dateien in _data/.

 Benötigt nur Python 3 – keine zusätzlichen Pakete.
═══════════════════════════════════════════════════════════════════════════
"""

import csv
import sys
from datetime import datetime
from pathlib import Path

# LinkedIn exportiert je nach Sprache englische oder deutsche Monatsnamen
MONATE = {
    "jan": 1, "jän": 1, "feb": 2, "mar": 3, "mär": 3, "apr": 4, "may": 5, "mai": 5,
    "jun": 6, "jul": 7, "aug": 8, "sep": 9, "oct": 10, "okt": 10, "nov": 11,
    "dec": 12, "dez": 12,
}

SPRACHNIVEAU = {
    "native or bilingual proficiency": ("Muttersprache", 5),
    "full professional proficiency": ("Verhandlungssicher", 5),
    "professional working proficiency": ("Fließend", 4),
    "limited working proficiency": ("Gute Kenntnisse", 3),
    "elementary proficiency": ("Grundkenntnisse", 2),
    "muttersprache oder zweisprachig": ("Muttersprache", 5),
    "fließend": ("Fließend", 4),
    "verhandlungssicher": ("Verhandlungssicher", 5),
    "gute kenntnisse": ("Gute Kenntnisse", 3),
    "grundkenntnisse": ("Grundkenntnisse", 2),
}


def lies_csv(ordner: Path, *namen: str) -> list[dict]:
    """Liest die erste gefundene CSV-Datei. LinkedIn-CSVs haben teils
    Hinweiszeilen vor der Kopfzeile – die werden übersprungen."""
    for name in namen:
        pfad = ordner / name
        if not pfad.exists():
            continue
        zeilen = pfad.read_text(encoding="utf-8-sig").splitlines()
        # Kopfzeile = erste Zeile mit mindestens zwei Kommas
        start = next((i for i, z in enumerate(zeilen) if z.count(",") >= 1 and not z.startswith("Notes")), 0)
        return [
            {k.strip(): (v or "").strip() for k, v in zeile.items() if k}
            for zeile in csv.DictReader(zeilen[start:])
        ]
    return []


def feld(zeile: dict, *namen: str) -> str:
    """Gibt den Wert der ersten vorhandenen Spalte zurück."""
    for name in namen:
        if zeile.get(name):
            return zeile[name]
    return ""


def datum(text: str) -> str:
    """'Sep 2023' / '09/2023' / '2023' / '2023-09-01' → '2023-09' bzw. '2023'."""
    text = text.strip()
    if not text:
        return ""
    for fmt in ("%Y-%m-%d", "%m/%Y", "%Y-%m", "%d.%m.%Y", "%m.%Y"):
        try:
            return datetime.strptime(text, fmt).strftime("%Y-%m")
        except ValueError:
            pass
    teile = text.replace(".", "").split()
    if len(teile) == 2 and teile[0][:3].lower() in MONATE and teile[1].isdigit():
        return f"{teile[1]}-{MONATE[teile[0][:3].lower()]:02d}"
    if text.isdigit() and len(text) == 4:
        return text
    return text


def yaml_text(wert: str) -> str:
    """Sicherer YAML-String in doppelten Anführungszeichen."""
    wert = " ".join(wert.split())
    return '"' + wert.replace("\\", "\\\\").replace('"', '\\"') + '"'


def block_text(wert: str, einrueckung: int) -> str:
    """Mehrzeiliger Text als YAML-Block (>-)."""
    wert = " ".join(wert.split())
    if not wert:
        return '""'
    abstand = " " * einrueckung
    return ">-\n" + abstand + wert


# ─── Umwandlung ───────────────────────────────────────────────────────────

def positionen(ordner: Path) -> list[str]:
    zeilen = lies_csv(ordner, "Positions.csv")
    aus = []
    for z in zeilen:
        aus.append(
            "    - position: {pos}\n"
            "      unternehmen: {firma}\n"
            '      unternehmen_link: ""\n'
            "      ort: {ort}\n"
            '      art: ""\n'
            "      von: {von}\n"
            "      bis: {bis}\n"
            "      beschreibung: {text}\n"
            "      aufgaben: []\n"
            "      anzeigen: true\n".format(
                pos=yaml_text(feld(z, "Title")),
                firma=yaml_text(feld(z, "Company Name")),
                ort=yaml_text(feld(z, "Location")),
                von=yaml_text(datum(feld(z, "Started On"))),
                bis=yaml_text(datum(feld(z, "Finished On"))),
                text=block_text(feld(z, "Description"), 8),
            )
        )
    return aus


def ausbildung(ordner: Path) -> list[str]:
    zeilen = lies_csv(ordner, "Education.csv")
    aus = []
    for z in zeilen:
        aus.append(
            "    - schule: {schule}\n"
            '      schule_link: ""\n'
            "      abschluss: {abschluss}\n"
            "      fachrichtung: {fach}\n"
            '      ort: ""\n'
            "      von: {von}\n"
            "      bis: {bis}\n"
            "      voraussichtlich: false\n"
            "      beschreibung: {text}\n"
            "      aktivitaeten: {akt}\n"
            "      anzeigen: true\n".format(
                schule=yaml_text(feld(z, "School Name")),
                abschluss=yaml_text(feld(z, "Degree Name")),
                fach=yaml_text(feld(z, "Field Of Study", "Field of Study")),
                von=yaml_text(datum(feld(z, "Start Date"))),
                bis=yaml_text(datum(feld(z, "End Date"))),
                text=block_text(feld(z, "Notes", "Description"), 8),
                akt=yaml_text(feld(z, "Activities")),
            )
        )
    return aus


def ehrenamt(ordner: Path) -> list[str]:
    zeilen = lies_csv(ordner, "Volunteering.csv", "Volunteer Experiences.csv")
    aus = []
    for z in zeilen:
        aus.append(
            "    - rolle: {rolle}\n"
            "      organisation: {org}\n"
            '      organisation_link: ""\n'
            "      bereich: {bereich}\n"
            "      von: {von}\n"
            "      bis: {bis}\n"
            "      beschreibung: {text}\n"
            "      anzeigen: true\n".format(
                rolle=yaml_text(feld(z, "Role")),
                org=yaml_text(feld(z, "Company Name", "Organization")),
                bereich=yaml_text(feld(z, "Cause")),
                von=yaml_text(datum(feld(z, "Started On"))),
                bis=yaml_text(datum(feld(z, "Finished On"))),
                text=block_text(feld(z, "Description"), 8),
            )
        )
    return aus


def skills(ordner: Path) -> list[str]:
    return [yaml_text(feld(z, "Name")) for z in lies_csv(ordner, "Skills.csv") if feld(z, "Name")]


def sprachen(ordner: Path) -> list[str]:
    aus = []
    for z in lies_csv(ordner, "Languages.csv"):
        niveau_roh = feld(z, "Proficiency")
        niveau, stufe = SPRACHNIVEAU.get(niveau_roh.lower(), (niveau_roh, ""))
        aus.append(
            "    - sprache: {sprache}\n"
            "      niveau: {niveau}\n"
            "      stufe: {stufe}\n".format(
                sprache=yaml_text(feld(z, "Name")),
                niveau=yaml_text(niveau),
                stufe=stufe if stufe else '""',
            )
        )
    return aus


def zertifikate(ordner: Path) -> list[str]:
    aus = []
    for z in lies_csv(ordner, "Certifications.csv"):
        aus.append(
            "  - name: {name}\n"
            "    aussteller: {aussteller}\n"
            '    kategorie: "Sonstiges"             # ← bitte anpassen\n'
            "    ausgestellt: {von}\n"
            "    ablauf: {bis}\n"
            "    credential_id: {cid}\n"
            "    verifizierung_link: {url}\n"
            '    beschreibung: ""\n'
            '    bild: ""\n'
            '    bild_alt: ""\n'
            '    datei: ""\n'
            "    anzeigen: true\n".format(
                name=yaml_text(feld(z, "Name")),
                aussteller=yaml_text(feld(z, "Authority")),
                von=yaml_text(datum(feld(z, "Started On"))),
                bis=yaml_text(datum(feld(z, "Finished On"))),
                cid=yaml_text(feld(z, "License Number")),
                url=yaml_text(feld(z, "Url")),
            )
        )
    return aus


# ─── Hauptprogramm ────────────────────────────────────────────────────────

def main() -> int:
    if len(sys.argv) != 2:
        print("Verwendung: python3 tools/linkedin-import.py <Ordner mit LinkedIn-CSV-Dateien>")
        return 1

    ordner = Path(sys.argv[1]).expanduser()
    if not ordner.is_dir():
        print(f"Ordner nicht gefunden: {ordner}")
        return 1

    ziel = Path(__file__).resolve().parent / "ausgabe"
    ziel.mkdir(exist_ok=True)

    pos, schule, ehren = positionen(ordner), ausbildung(ordner), ehrenamt(ordner)
    sk, spr, zert = skills(ordner), sprachen(ordner), zertifikate(ordner)

    kopf = (
        "# ════════════════════════════════════════════════════════════════════\n"
        "#  Automatisch erzeugt aus deinem LinkedIn-Export.\n"
        "#  Kopiere die gewünschten Einträge in die passende Datei in _data/.\n"
        "#  Tipp: Praktika aus \"berufserfahrung\" in den Abschnitt \"praktika\"\n"
        "#  verschieben und das Feld \"art\" ergänzen.\n"
        "# ════════════════════════════════════════════════════════════════════\n\n"
    )

    lebenslauf = kopf
    lebenslauf += "berufserfahrung:\n  eintraege:\n\n" + ("\n".join(pos) or "    []\n") + "\n"
    lebenslauf += "ausbildung:\n  eintraege:\n\n" + ("\n".join(schule) or "    []\n") + "\n"
    lebenslauf += "engagement:\n  eintraege:\n\n" + ("\n".join(ehren) or "    []\n") + "\n"
    lebenslauf += (
        "skills:\n  gruppen:\n    - gruppe: \"Aus LinkedIn (bitte aufteilen)\"\n"
        "      icon: \"award\"\n      eintraege:\n"
        + ("".join(f"        - {s}\n" for s in sk) or "        []\n")
        + "\n"
    )
    lebenslauf += "sprachen:\n  eintraege:\n" + ("".join(spr) or "    []\n")

    (ziel / "lebenslauf.import.yml").write_text(lebenslauf, encoding="utf-8")
    (ziel / "zertifikate.import.yml").write_text(
        kopf + "zertifikate:\n\n" + ("\n".join(zert) or "  []\n"), encoding="utf-8"
    )

    print("Fertig! Gefunden:")
    print(f"  {len(pos)} Positionen, {len(schule)} Ausbildungen, {len(ehren)} Ehrenämter,")
    print(f"  {len(sk)} Skills, {len(spr)} Sprachen, {len(zert)} Zertifikate")
    print(f"Ergebnis liegt in: {ziel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

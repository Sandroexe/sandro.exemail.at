#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════════════
#  bilder-optimieren.py – Galerie-Fotos fürs Web aufbereiten
#
#  Läuft automatisch im Build-Workflow (.github/workflows/deploy.yml) vor
#  Jekyll. Lokal nur nötig, wenn du die Galerie in der Vorschau sehen willst:
#      python3 -m pip install -r tools/requirements.txt   (einmalig)
#      python3 tools/bilder-optimieren.py
#
#  Was passiert:
#    Für jedes Foto in  assets/img/galerie/  entstehen in
#    assets/img/galerie-web/  (nicht im Repository, siehe .gitignore):
#      <name>-klein.webp / .jpg   Vorschaubild fürs Raster (kurze Seite 600 px)
#      <name>-gross.webp / .jpg   Großansicht (lange Seite max. 2000 px)
#      <name>-og.jpg              Vorschaubild für Social Media (1200 × 630)
#    Dabei wird das Foto richtig gedreht und ALLE Metadaten (Kamera,
#    Aufnahmezeit, GPS-Standort …) werden entfernt.
#    Zusätzlich: _data/galerie_web.json mit den Abmessungen (gegen
#    "springende" Seiten beim Laden) – liest _plugins/galerie.rb.
#
#  Die Originale werden nie verändert und nie veröffentlicht.
# ═══════════════════════════════════════════════════════════════════════════

import json
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow fehlt – einmalig installieren: python3 -m pip install -r tools/requirements.txt")

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "assets" / "img" / "galerie"
ZIEL = WURZEL / "assets" / "img" / "galerie-web"
DATEN = WURZEL / "_data" / "galerie_web.json"

ENDUNGEN = {".jpg", ".jpeg", ".png", ".webp"}
KLEIN_KURZE_SEITE = 600
GROSS_LANGE_SEITE = 2000
OG_GROESSE = (1200, 630)
QUALITAET_JPG = 82
QUALITAET_WEBP = 80
GPS_TAG = 0x8825


def github_warnung(text):
    print(f"Warnung: {text}")
    if os.environ.get("GITHUB_ACTIONS"):
        print(f"::warning title=Galerie::{text}")


def verkleinern(bild, breite, hoehe):
    if bild.width <= breite and bild.height <= hoehe:
        return bild.copy()
    kopie = bild.copy()
    kopie.thumbnail((breite, hoehe), Image.Resampling.LANCZOS)
    return kopie


def speichern(bild, pfad, icc):
    # Ohne exif=… speichert Pillow KEINE Metadaten – nur das Farbprofil bleibt
    if pfad.suffix == ".webp":
        bild.save(pfad, "WEBP", quality=QUALITAET_WEBP, method=6, icc_profile=icc)
    else:
        bild.save(pfad, "JPEG", quality=QUALITAET_JPG, optimize=True, progressive=True, icc_profile=icc)


def aktuell(quelle, ziele):
    return all(z.exists() and z.stat().st_mtime >= quelle.stat().st_mtime for z in ziele)


def verarbeiten(datei, manifest):
    name = datei.stem
    ziele = {
        "klein_webp": ZIEL / f"{name}-klein.webp",
        "klein_jpg": ZIEL / f"{name}-klein.jpg",
        "gross_webp": ZIEL / f"{name}-gross.webp",
        "gross_jpg": ZIEL / f"{name}-gross.jpg",
        "og": ZIEL / f"{name}-og.jpg",
    }

    with Image.open(datei) as original:
        if original.getexif().get(GPS_TAG):
            github_warnung(
                f"{datei.name} enthält GPS-Standortdaten. Auf der Website werden sie entfernt, "
                "im (öffentlichen) Repository steht das Original aber mit Standort. "
                "Siehe README 5.11 → Standort vor dem Hochladen entfernen."
            )

        if aktuell(datei, ziele.values()) and datei.name in manifest:
            return manifest[datei.name]

        icc = original.info.get("icc_profile")
        bild = ImageOps.exif_transpose(original)
        if bild.mode not in ("RGB", "L"):
            # Transparenz (PNG) auf Weiß legen – JPG kennt keine Transparenz
            hintergrund = Image.new("RGB", bild.size, (255, 255, 255))
            rgba = bild.convert("RGBA")
            hintergrund.paste(rgba, mask=rgba.getchannel("A"))
            bild = hintergrund
        elif bild.mode == "L":
            bild = bild.convert("RGB")

        gross = verkleinern(bild, GROSS_LANGE_SEITE, GROSS_LANGE_SEITE)
        faktor = KLEIN_KURZE_SEITE / min(bild.size)
        klein = verkleinern(bild, round(bild.width * faktor), round(bild.height * faktor))
        og = ImageOps.fit(bild, OG_GROESSE, Image.Resampling.LANCZOS, centering=(0.5, 0.4))

        for schluessel, variante in (("klein", klein), ("gross", gross)):
            speichern(variante, ziele[f"{schluessel}_webp"], icc)
            speichern(variante, ziele[f"{schluessel}_jpg"], icc)
        speichern(og, ziele["og"], icc)

    print(f"  ✓ {datei.name}  →  {gross.width}×{gross.height}")
    return {
        "name": name,
        "breite": gross.width,
        "hoehe": gross.height,
        "klein_breite": klein.width,
        "klein_hoehe": klein.height,
    }


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    try:
        alt = json.loads(DATEN.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        alt = {}

    dateien = sorted(p for p in QUELLE.iterdir() if p.is_file() and p.suffix.lower() in ENDUNGEN) if QUELLE.exists() else []
    namen = {}
    manifest = {}
    for datei in dateien:
        if datei.stem in namen:
            github_warnung(f"{datei.name} und {namen[datei.stem]} haben denselben Namen – {datei.name} wird übersprungen.")
            continue
        namen[datei.stem] = datei.name
        try:
            manifest[datei.name] = verarbeiten(datei, alt)
        except OSError as fehler:
            github_warnung(f"{datei.name} konnte nicht gelesen werden ({fehler}).")

    # Übrig gebliebene Dateien gelöschter Fotos aufräumen
    gueltig = {f"{n}-{v}" for n in namen for v in ("klein.webp", "klein.jpg", "gross.webp", "gross.jpg", "og.jpg")}
    for alt_datei in ZIEL.iterdir():
        if alt_datei.name not in gueltig:
            alt_datei.unlink()

    DATEN.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Galerie: {len(manifest)} Foto(s) aufbereitet.")


if __name__ == "__main__":
    main()

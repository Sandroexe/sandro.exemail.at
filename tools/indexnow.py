#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════
 IndexNow – meldet neue und geänderte Seiten an Bing, Yandex, Seznam & Co.
 Wird automatisch vom GitHub-Actions-Workflow aufgerufen, nicht von Hand.

 Schritt 1 (vor dem Deploy):
   python3 tools/indexnow.py aenderungen --neu _site/sitemap.xml \
       --alt-url https://sandro.exemail.at/sitemap.xml --host sandro.exemail.at \
       --ausgabe indexnow-urls.txt [--zusaetzlich /contact/ /cv/ …]
   → vergleicht die neue Sitemap mit der live veröffentlichten und schreibt
     alle neuen, geänderten (anderes lastmod) und entfernten URLs in die Datei.
     Ist die alte Sitemap nicht abrufbar oder ohne lastmod: alle URLs.

 Schritt 2 (nach dem Deploy):
   python3 tools/indexnow.py senden --urls indexnow-urls.txt \
       --host sandro.exemail.at --schluessel <KEY>
   → prüft, ob die Schlüsseldatei online ist, und sendet die URLs.

 Fehler werden im Log angezeigt (GitHub-Annotation), das Skript beendet sich
 aber immer mit Code 0 – ein IndexNow-Problem soll nie den Deploy stören.
 Nur Python-Standardbibliothek, keine Google Indexing API.
═══════════════════════════════════════════════════════════════════════════
"""

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
API = "https://api.indexnow.org/indexnow"
UA = "sandro.exemail.at IndexNow (GitHub Actions)"


def hinweis(text):
    print(f"::warning::IndexNow: {text}")


def sitemap_lesen(xml_text):
    """→ {url: lastmod oder ""}"""
    wurzel = ET.fromstring(xml_text)
    eintraege = {}
    for url in wurzel.findall("sm:url", NS):
        loc = (url.findtext("sm:loc", default="", namespaces=NS) or "").strip()
        lastmod = (url.findtext("sm:lastmod", default="", namespaces=NS) or "").strip()
        if loc:
            eintraege[loc] = lastmod
    return eintraege


def abrufen(url, versuche=1, pause=0):
    for i in range(versuche):
        try:
            anfrage = urllib.request.Request(url, headers={"User-Agent": UA, "Cache-Control": "no-cache"})
            with urllib.request.urlopen(anfrage, timeout=20) as antwort:
                return antwort.status, antwort.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as fehler:
            status, text = fehler.code, ""
        except Exception as fehler:  # Netzwerkfehler
            status, text = None, str(fehler)
        if i < versuche - 1:
            time.sleep(pause)
    return status, text


def nur_eigene(urls, host):
    return sorted({u for u in urls if urllib.parse.urlparse(u).scheme == "https"
                   and urllib.parse.urlparse(u).netloc == host})


def aenderungen(args):
    with open(args.neu, encoding="utf-8") as f:
        neu = sitemap_lesen(f.read())

    status, text = abrufen(f"{args.alt_url}?nocache={int(time.time())}")
    alt = {}
    if status == 200:
        try:
            alt = sitemap_lesen(text)
        except ET.ParseError:
            hinweis("Live-Sitemap nicht lesbar – melde alle URLs.")
    else:
        hinweis(f"Live-Sitemap nicht abrufbar (Status {status}) – melde alle URLs.")

    if not alt or not any(alt.values()):
        geaendert = set(neu)
        grund = "erster Lauf bzw. alte Sitemap ohne lastmod → alle URLs"
    else:
        geaendert = {u for u, lm in neu.items() if alt.get(u) != lm}
        entfernt = set(alt) - set(neu)
        geaendert |= entfernt
        grund = f"{len(geaendert) - len(entfernt)} neu/geändert, {len(entfernt)} entfernt"

    zusaetzlich = {urllib.parse.urljoin(f"https://{args.host}/", p) for p in (args.zusaetzlich or [])}
    urls = nur_eigene(geaendert | zusaetzlich, args.host)

    with open(args.ausgabe, "w", encoding="utf-8") as f:
        f.write("\n".join(urls) + ("\n" if urls else ""))
    print(f"IndexNow: {len(urls)} URL(s) vorgemerkt ({grund}"
          f"{', + ' + str(len(zusaetzlich)) + ' alte Adressen' if zusaetzlich else ''}).")
    for u in urls:
        print("  ", u)


def senden(args):
    try:
        with open(args.urls, encoding="utf-8") as f:
            urls = nur_eigene([z.strip() for z in f if z.strip()], args.host)
    except FileNotFoundError:
        hinweis(f"Datei {args.urls} fehlt – nichts zu senden.")
        return

    if not urls:
        print("IndexNow: Keine geänderten Seiten – nichts zu senden.")
        return

    schluessel_url = f"https://{args.host}/{args.schluessel}.txt"
    status, text = abrufen(schluessel_url, versuche=6, pause=10)
    if status != 200 or text.strip() != args.schluessel:
        hinweis(f"Schlüsseldatei {schluessel_url} nicht korrekt erreichbar (Status {status}) – Abbruch.")
        return

    daten = json.dumps({
        "host": args.host,
        "key": args.schluessel,
        "keyLocation": schluessel_url,
        "urlList": urls[:10000],
    }).encode("utf-8")
    anfrage = urllib.request.Request(API, data=daten, method="POST", headers={
        "Content-Type": "application/json; charset=utf-8", "User-Agent": UA})
    try:
        with urllib.request.urlopen(anfrage, timeout=30) as antwort:
            print(f"IndexNow: {len(urls)} URL(s) gesendet → HTTP {antwort.status} (200/202 = angenommen).")
    except urllib.error.HTTPError as fehler:
        erklaerung = {400: "ungültiges Format", 403: "Schlüssel ungültig/nicht gefunden",
                      422: "URL passt nicht zum Host", 429: "zu viele Anfragen"}.get(fehler.code, "")
        hinweis(f"API antwortete HTTP {fehler.code} {erklaerung}: {fehler.read().decode('utf-8', 'replace')[:300]}")
    except Exception as fehler:
        hinweis(f"Senden fehlgeschlagen: {fehler}")


def main():
    parser = argparse.ArgumentParser(description="IndexNow für sandro.exemail.at")
    sub = parser.add_subparsers(dest="befehl", required=True)

    a = sub.add_parser("aenderungen")
    a.add_argument("--neu", required=True)
    a.add_argument("--alt-url", required=True)
    a.add_argument("--host", required=True)
    a.add_argument("--ausgabe", required=True)
    a.add_argument("--zusaetzlich", nargs="*")

    s = sub.add_parser("senden")
    s.add_argument("--urls", required=True)
    s.add_argument("--host", required=True)
    s.add_argument("--schluessel", required=True)

    args = parser.parse_args()
    try:
        aenderungen(args) if args.befehl == "aenderungen" else senden(args)
    except Exception as fehler:  # nie den Workflow abbrechen
        hinweis(f"Unerwarteter Fehler: {fehler}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

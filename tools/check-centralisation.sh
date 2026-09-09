#!/usr/bin/env bash
#
# check-centralisation.sh
#
# Prüft automatisch, was sonst nur eine gute Absicht wäre: dass keine
# Information doppelt im Repo steht. Läuft in build-check.yml und
# lässt sich jederzeit von Hand starten:
#
#     bash tools/check-centralisation.sh
#
# Der Sinn: Wenn in einem halben Jahr jemand — auch ich selbst —
# schnell eine E-Mail-Adresse in eine Seite tippt, fällt das hier auf,
# statt still zur zweiten Wahrheit zu werden.

set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
report() {
  echo ""
  echo "✗ $1"
  fail=1
}

# Quelldateien, in denen nichts hartkodiert stehen darf.
# critical.html ist der EINE erlaubte Ort für Inline-CSS: die
# Design-Tokens müssen vor dem ersten Bild dastehen. qr-contact.html
# ist eine erzeugte Grafik.
PAGES=$(git ls-files '*.html' ':!:_data/*' ':!:_includes/qr-contact.html' ':!:_includes/critical.html')
DATA_ONLY_FILES="_data _includes/critical.html"

echo "── Zentralisierungsprüfung ─────────────────────────────────────"

# 1) Keine style-Blöcke in Seiten oder Includes
hits=$(grep -ln '<style' $PAGES 2>/dev/null || true)
if [ -n "$hits" ]; then
  report "style-Block gefunden — CSS gehört nach assets/css/main.css:"
  echo "$hits"
else
  echo "✓ Kein style-Block in Seiten oder Includes"
fi

# 2) Keine Hex-Farben außerhalb von design.yml, social.yml,
#    certificates.yml, github.yml und dem QR-Code
hits=$(grep -lnE '#[0-9a-fA-F]{6}\b' $PAGES assets/css/main.css 2>/dev/null | grep -v 'icons.html' || true)
if [ -n "$hits" ]; then
  report "Hex-Farbe außerhalb der Datendateien gefunden:"
  echo "$hits"
  grep -nE '#[0-9a-fA-F]{6}\b' $hits | head -10
else
  echo "✓ Keine Hex-Farben in Seiten oder im Stylesheet"
fi

# 3) E-Mail-Adresse, Telefonnummer und Name nur in _data
for needle in "sandro@exemail.at" "7406799"; do
  hits=$(grep -ln "$needle" $PAGES 2>/dev/null || true)
  if [ -n "$hits" ]; then
    report "\"$needle\" steht fest in einer Seite — gehört nach _data/contact.yml:"
    echo "$hits"
  else
    echo "✓ \"$needle\" steht nur in den Datendateien"
  fi
done

# 4) Social-URLs nur in social.yml
hits=$(grep -lnE 'https?://(www\.)?(github|linkedin|instagram|xing|reddit|stackoverflow|credly)\.com' $PAGES 2>/dev/null || true)
if [ -n "$hits" ]; then
  report "Social-URL steht fest in einer Seite — gehört nach _data/social.yml:"
  echo "$hits"
else
  echo "✓ Social-URLs stehen nur in _data/social.yml"
fi

# 5) Jeder i18n-Schlüssel muss es in beiden Sprachen geben.
#    Bewusst in awk statt Python: awk ist überall da, und ein
#    fehlender Interpreter darf nicht als bestandene Prüfung
#    durchgehen.
keys_of() {
  awk '
    /^[[:space:]]*(#|$)/ { next }
    /^[A-Za-z0-9_]+:/    { section = $0; sub(/:.*/, "", section); next }
    /^[[:space:]]+[A-Za-z0-9_]+:/ {
      key = $0; sub(/^[[:space:]]+/, "", key); sub(/:.*/, "", key)
      if (section != "") print section "." key
    }
  ' "$1" | sort -u
}
missing=$(comm -3 <(keys_of _data/i18n/de.yml) <(keys_of _data/i18n/en.yml) | tr -d '\t')
if [ -n "$missing" ]; then
  report "Diese i18n-Schlüssel fehlen in einer der beiden Sprachen:"
  echo "$missing"
else
  echo "✓ Sprachkataloge sind deckungsgleich"
fi

# 6) Verschachtelte Klammern in Liquid-Lookups.
#    Liquids Variablen-Parser kennt nur \[[^\]]+\] und bricht bei der
#    ersten schliessenden Klammer ab. `a[b[0]][c]` liefert deshalb
#    stillschweigend nil — der Build bleibt gruen, der Text ist weg.
#    Genau so sind saemtliche Beschriftungen unsichtbar geworden.
hits=$(grep -rnE '\[[A-Za-z_.]+\[' $PAGES _includes/*.html 2>/dev/null | grep -v 'check-centralisation' || true)
if [ -n "$hits" ]; then
  report "Verschachtelte Klammern in einem Liquid-Lookup — Liquid liefert dort nil:"
  echo "$hits"
else
  echo "✓ Keine verschachtelten Klammern in Liquid-Lookups"
fi

# 7) Kein unverschluesselter Link in den Daten
hits=$(grep -rn 'http://' _data/*.yml _data/*.json 2>/dev/null || true)
if [ -n "$hits" ]; then
  report "Unverschluesselter http-Link in den Daten:"
  echo "$hits"
else
  echo "✓ Keine http-Links in den Datendateien"
fi

echo ""
if [ "$fail" -eq 0 ]; then
  echo "Alles zentral. Keine doppelten Angaben gefunden."
else
  echo "Zentralisierungsprüfung fehlgeschlagen."
fi
exit $fail

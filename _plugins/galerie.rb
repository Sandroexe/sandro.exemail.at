# frozen_string_literal: true

# ═══════════════════════════════════════════════════════════════════════════
#  Bereitet die Fotos aus _data/galerie.yml für die Seiten auf – hier nichts
#  ändern.
#
#  Ergebnis (in Liquid verfügbar):
#    site.data.galerie_liste       sichtbare Fotos, neueste zuerst, mit Pfaden
#                                  und Abmessungen der Web-Versionen
#    site.data.galerie_kategorien  Filter-Buttons: nur Kategorien mit Fotos
#    site.data.galerie_fotografen  für den Bildnachweis im Impressum
#    site.data.galerie_fehlend     übersprungene Einträge (Hinweis in der
#                                  lokalen Vorschau)
#
#  Die Web-Versionen erzeugt tools/bilder-optimieren.py (im Workflow vor
#  Jekyll). Es schreibt _data/galerie_web.json mit den Abmessungen.
# ═══════════════════════════════════════════════════════════════════════════

module Galerie
  class Generator < Jekyll::Generator
    safe true
    priority :high # vor letzte-aenderung.rb und jekyll-sitemap

    WEB_PFAD = "/assets/img/galerie-web/"
    PFLICHT = { "datei" => "Dateiname", "titel" => "Titel", "alt_text" => "Alternativtext" }.freeze

    def generate(site)
      @site = site
      daten = site.data["galerie"] || {}
      web = site.data["galerie_web"] || {}
      liste = []
      fehlend = []

      Array(daten["bilder"]).each_with_index do |b, index|
        next unless b.is_a?(Hash) && ja?(b.fetch("anzeigen", true))

        datei = b["datei"].to_s.strip
        leer = PFLICHT.keys.select { |f| b[f].to_s.strip.empty? }
        unless leer.empty?
          melden(fehlend, datei, "Pflichtfeld fehlt: #{leer.map { |f| PFLICHT[f] }.join(', ')}")
          next
        end

        unless File.exist?(File.join(site.source, "assets", "img", "galerie", datei))
          melden(fehlend, datei, "Datei fehlt in assets/img/galerie/ (Groß-/Kleinschreibung beachten)")
          next
        end

        info = web[datei]
        unless info
          melden(fehlend, datei, "noch nicht aufbereitet – python3 tools/bilder-optimieren.py ausführen",
                 warnen: Jekyll.env == "production")
          next
        end

        liste << eintrag(b, info, index)
      end

      # Neueste zuerst; ohne Datum ans Ende; sonst Reihenfolge der Datei
      liste.sort_by! { |e| [e["datum"].empty? ? 1 : 0, umgekehrt(e["datum"]), e["_index"]] }

      site.data["galerie_liste"] = liste
      site.data["galerie_kategorien"] = kategorien(daten["kategorien"], liste)
      site.data["galerie_fotografen"] = fotografen(liste)
      site.data["galerie_fehlend"] = fehlend
      vorschaubild_setzen(liste)
    end

    private

    def ja?(wert)
      wert == true || %w[true ja yes].include?(wert.to_s.strip.downcase)
    end

    def melden(fehlend, datei, grund, warnen: true)
      fehlend << { "datei" => datei, "grund" => grund }
      text = "#{datei.empty? ? '(ohne Dateiname)' : datei}: #{grund} – Foto wird übersprungen"
      if warnen
        Jekyll.logger.warn "Galerie:", text
        puts "::warning title=Galerie::#{text}" if ENV["GITHUB_ACTIONS"]
      else
        Jekyll.logger.info "Galerie:", text
      end
    end

    # "2026-09-24" → -20260924 (negativ, damit neuere Daten vorne stehen)
    def umgekehrt(datum)
      teile = datum.split("-").map(&:to_i)
      -((teile[0] || 0) * 10_000 + (teile[1] || 0) * 100 + (teile[2] || 0))
    end

    def eintrag(b, info, index)
      name = info["name"]
      fotograf = b["fotograf"].to_s.strip
      # "[BITTE AUSFÜLLEN]" nie öffentlich zeigen – nur warnen
      if fotograf.start_with?("[")
        text = "#{b['datei']}: Fotograf fehlt noch (#{fotograf}) – Bildnachweis wird erst angezeigt, wenn er eingetragen ist"
        Jekyll.logger.warn "Galerie:", text
        puts "::warning title=Galerie::#{text}" if ENV["GITHUB_ACTIONS"]
        fotograf = ""
      end
      {
        "_index" => index,
        "id" => "bild-#{Jekyll::Utils.slugify(name)}",
        "datei" => b["datei"].to_s.strip,
        "titel" => b["titel"].to_s.strip,
        "alt_text" => b["alt_text"].to_s.strip,
        "beschreibung" => b["beschreibung"].to_s.strip,
        "datum" => b["datum"].to_s.strip,
        "ort" => b["ort"].to_s.strip,
        "kategorie" => b["kategorie"].to_s.strip,
        "fotograf" => fotograf,
        "hervorgehoben" => ja?(b["hervorgehoben"]),
        "format" => info["hoehe"].to_i > info["breite"].to_i * 1.1 ? "hoch" : "quer",
        "breite" => info["breite"], "hoehe" => info["hoehe"],
        "klein_breite" => info["klein_breite"], "klein_hoehe" => info["klein_hoehe"],
        "klein_webp" => "#{WEB_PFAD}#{name}-klein.webp", "klein_jpg" => "#{WEB_PFAD}#{name}-klein.jpg",
        "gross_webp" => "#{WEB_PFAD}#{name}-gross.webp", "gross_jpg" => "#{WEB_PFAD}#{name}-gross.jpg",
        "og" => "#{WEB_PFAD}#{name}-og.jpg"
      }
    end

    def kategorien(reihenfolge, liste)
      namen = Array(reihenfolge).map(&:to_s)
      unbekannt = liste.map { |e| e["kategorie"] }.uniq - namen - [""]
      unbekannt.each do |k|
        Jekyll.logger.warn "Galerie:", "Kategorie \"#{k}\" steht nicht in der Liste kategorien – Filter-Button wird hinten angehängt"
      end
      (namen + unbekannt).filter_map do |k|
        anzahl = liste.count { |e| e["kategorie"] == k }
        { "name" => k, "anzahl" => anzahl } if anzahl.positive?
      end
    end

    def fotografen(liste)
      liste.reject { |e| e["fotograf"].empty? }
           .group_by { |e| e["fotograf"] }
           .map { |name, fotos| { "name" => name, "titel" => fotos.map { |e| e["titel"] } } }
    end

    # Social-Media-Vorschaubild der Galerie = neuestes Foto (sofern die Seite
    # im Front Matter kein eigenes "image" setzt)
    def vorschaubild_setzen(liste)
      seite = @site.pages.find { |p| p.url == "/galerie/" }
      return unless seite && liste.any? && !seite.data["image"]

      seite.data["image"] = liste.first["og"]
    end
  end
end

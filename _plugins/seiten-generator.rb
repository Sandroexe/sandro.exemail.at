# frozen_string_literal: true

# ═══════════════════════════════════════════════════════════════════════════
#  Erzeugt Seiten automatisch aus den Datendateien – hier nichts ändern.
#
#  1. Weiterleitungen   aus _data/weiterleitungen.yml
#     (eigene Lösung statt jekyll-redirect-from, weil jenes Inline-JavaScript
#     einbaut, das unsere Content-Security-Policy blockieren würde)
#
#  2. Social-Media-Impressum-Unterseiten   aus _data/social.yml
#     /social-impressum/<id>/ für jeden Kanal mit
#     rechtliches → impressum_anzeigen: true
#
#     Pflicht: Jeder Kanal UND die Website brauchen eine "grundlegende
#     Richtung" (§ 25 MedienG, die Kanäle sind politisch/meinungsbildend).
#     Fehlt sie, bricht der Build ab – die bisherige Website bleibt online.
#
#  3. IndexNow-Schlüsseldatei   aus _config.yml (indexnow → schluessel)
#     /<schluessel>.txt im Wurzelverzeichnis – ⚠ nie löschen
#
#  Plugins funktionieren, weil die Website über GitHub Actions gebaut wird
#  (nicht über das eingeschränkte github-pages-Gem).
# ═══════════════════════════════════════════════════════════════════════════

module SeitenGenerator
  # Seite ohne Datei auf der Festplatte
  class DatenSeite < Jekyll::PageWithoutAFile
    def initialize(site, pfad, daten, inhalt)
      verzeichnis, dateiname = aufteilen(pfad)
      super(site, site.source, verzeichnis, dateiname)
      self.data = daten
      self.content = inhalt
    end

    private

    # "/contact/" → ["contact", "index.html"], "/cv.html" → ["", "cv.html"]
    def aufteilen(pfad)
      pfad = "/#{pfad}" unless pfad.start_with?("/")
      if pfad.end_with?("/")
        [pfad.delete_prefix("/").chomp("/"), "index.html"]
      else
        [File.dirname(pfad).delete_prefix("/"), File.basename(pfad)]
      end
    end
  end

  class Weiterleitungen < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      eintraege = site.data.dig("weiterleitungen", "weiterleitungen") || []
      vorhanden = site.pages.map(&:url)

      eintraege.each do |e|
        von = e["von"].to_s.strip
        nach = e["nach"].to_s.strip
        next if von.empty? || nach.empty?

        if vorhanden.include?(von)
          Jekyll.logger.warn "Weiterleitung:", "#{von} existiert bereits als Seite – übersprungen"
          next
        end

        site.pages << DatenSeite.new(
          site, von,
          # Exakte Adresse erzwingen – sonst macht "permalink: pretty"
          # aus "/links.html" einen Ordner "/links/" (Kollision!)
          { "layout" => "weiterleitung", "ziel" => nach, "sitemap" => false,
            "title" => "Weiterleitung", "permalink" => von },
          ""
        )
      end
    end
  end

  class IndexNowSchluessel < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      cfg = site.config["indexnow"] || {}
      schluessel = cfg["schluessel"].to_s.strip
      return unless cfg["aktiv"] && !schluessel.empty?

      unless schluessel.match?(/\A[a-zA-Z0-9-]{8,128}\z/)
        Jekyll.logger.warn "IndexNow:", "Schlüssel ungültig (8–128 Zeichen a–z, A–Z, 0–9, -)"
        return
      end

      site.pages << DatenSeite.new(
        site, "/#{schluessel}.txt",
        { "layout" => nil, "sitemap" => false, "permalink" => "/#{schluessel}.txt" },
        schluessel
      )
    end
  end

  # Warnt, wenn ein in _data/ eingetragenes Icon als Datei in assets/icons/
  # fehlt (z. B. Tippfehler oder nicht mit hochgeladen). Im GitHub-Actions-Log
  # erscheint das als gelbe Warnung.
  class IconPruefung < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      d = site.data
      namen = []
      namen.concat((d.dig("social", "kanaele") || []).map { |k| k["icon"] })
      namen.concat((d.dig("person", "buttons") || []).map { |b| b["icon"] })
      namen.concat((d.dig("person", "highlights") || []).map { |h| h["icon"] })
      lv = d["lebenslauf"] || {}
      %w[berufserfahrung praktika ausbildung engagement politik].each { |a| namen << lv.dig(a, "icon") }
      namen.concat((lv.dig("skills", "gruppen") || []).map { |g| g["icon"] })

      namen.compact.map(&:to_s).reject(&:empty?).uniq.each do |name|
        next if File.exist?(File.join(site.source, "assets", "icons", "#{name}.svg"))

        Jekyll.logger.warn "Icon fehlt:", "assets/icons/#{name}.svg"
        puts "::warning title=Icon fehlt::assets/icons/#{name}.svg wird in _data/ verwendet, existiert aber nicht" if ENV["GITHUB_ACTIONS"]
      end
    end
  end

  class SocialImpressum < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      kanaele = site.data.dig("social", "kanaele") || []
      r = site.data["rechtliches"] || {}
      richtung_pruefen("Website (rechtliches.yml → grundlegende_richtung)", r["grundlegende_richtung"])

      kanaele.each do |k|
        rechtliches = k["rechtliches"]
        next unless rechtliches.is_a?(Hash) && rechtliches["impressum_anzeigen"] == true

        id = k["id"].to_s.strip
        if id.empty? || id !~ /\A[a-z0-9-]+\z/
          Jekyll.logger.warn "Social-Impressum:", "Kanal \"#{k['name']}\" braucht eine gültige id (klein, ohne Leerzeichen)"
          next
        end

        richtung_pruefen(
          "Kanal \"#{k['name']}\" (social.yml → rechtliches → grundlegende_richtung)",
          rechtliches["grundlegende_richtung"].to_s.strip.empty? ? (r.dig("social_impressum", "grundlegende_richtung").to_s.strip.empty? ? r["grundlegende_richtung"] : r.dig("social_impressum", "grundlegende_richtung")) : rechtliches["grundlegende_richtung"]
        )

        site.pages << DatenSeite.new(
          site, "/social-impressum/#{id}/",
          {
            "layout" => "legal",
            "title" => "Impressum #{k['name']}",
            "kompakt" => true,
            "description" => "Offenlegung gemäß § 25 Mediengesetz und Datenschutzhinweise für den #{k['name']}-Kanal von Sandro Exenberger.",
            "kanal_id" => id,
            # Für das Änderungsdatum in der Sitemap (_plugins/letzte-aenderung.rb)
            "abhaengig_von" => ["_data/social.yml", "_data/rechtliches.yml",
                                "_includes/social-kanal.html", "_includes/social-allgemein.html",
                                "_includes/social-kanal-seite.html", "_includes/offenlegung.html"]
          },
          "{% include social-kanal-seite.html %}"
        )
      end
    end

    private

    def richtung_pruefen(wo, text)
      t = text.to_s.strip
      return unless t.empty? || t.start_with?("[")

      raise Jekyll::Errors::FatalException,
            "Grundlegende Richtung fehlt: #{wo}. Sie ist Pflicht (§ 25 MedienG) – bitte eintragen."
    end
  end
end

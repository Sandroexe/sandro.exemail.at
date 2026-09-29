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

  class SocialImpressum < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      kanaele = site.data.dig("social", "kanaele") || []

      kanaele.each do |k|
        rechtliches = k["rechtliches"]
        next unless rechtliches.is_a?(Hash) && rechtliches["impressum_anzeigen"] == true

        id = k["id"].to_s.strip
        if id.empty? || id !~ /\A[a-z0-9-]+\z/
          Jekyll.logger.warn "Social-Impressum:", "Kanal \"#{k['name']}\" braucht eine gültige id (klein, ohne Leerzeichen)"
          next
        end

        site.pages << DatenSeite.new(
          site, "/social-impressum/#{id}/",
          {
            "layout" => "legal",
            "title" => "#{k['name']} – Impressum & Datenschutz",
            "description" => "Offenlegung gemäß § 25 Mediengesetz und Datenschutzhinweise für den #{k['name']}-Kanal von Sandro Exenberger.",
            "kanal_id" => id
          },
          "{% include social-kanal-seite.html %}"
        )
      end
    end
  end
end

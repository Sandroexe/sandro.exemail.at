# frozen_string_literal: true

# ═══════════════════════════════════════════════════════════════════════════
#  Bereitet eigene Beiträge (_posts/) und Presse-Links (_presse/) für die
#  Seiten auf – hier nichts ändern.
#
#  • Übersetzt die deutschen Front-Matter-Felder der Vorlagen in die Felder,
#    die Jekyll, der Feed und die SEO-Angaben erwarten (titel → title,
#    kurzbeschreibung → description, titelbild → Vorschaubild …)
#  • Entfernt Beiträge mit "veroeffentlicht: false" komplett
#  • site.data.news_liste        alle News gemischt, neueste zuerst
#  • site.data.news_filter       Filter-Buttons (nur mit Einträgen)
#  • site.data.bildnachweise_auto  Fotografen aus Galerie UND Beiträgen
#    (für das Impressum)
#  • news.yml → anzeigen: false blendet den ganzen Bereich aus
# ═══════════════════════════════════════════════════════════════════════════

require "time"

module News
  class Generator < Jekyll::Generator
    safe true
    priority :normal # nach galerie.rb, vor letzte-aenderung.rb und jekyll-feed

    def generate(site)
      @site = site
      @einstellungen = site.data["news"] || {}
      @web = site.data["galerie_web"] || {}
      posts = site.posts.docs
      presse = site.collections["presse"]&.docs || []

      posts.reject! { |p| !ja?(p.data.fetch("veroeffentlicht", true)) }

      unless ja?(@einstellungen.fetch("anzeigen", true))
        bereich_ausblenden(posts)
        return
      end

      liste = posts.map { |p| beitrag(p) }
      liste.concat(presse.filter_map { |d| presse_eintrag(d) })
      liste.sort_by! { |e| [e["datum"], e["typ"] == "beitrag" ? 1 : 0] }.reverse!

      site.data["news_liste"] = liste
      site.data["news_filter"] = filter(liste)
      site.data["bildnachweise_auto"] = bildnachweise(posts)
    end

    private

    def ja?(wert)
      wert == true || %w[true ja yes].include?(wert.to_s.strip.downcase)
    end

    def warnen(text)
      Jekyll.logger.warn "News:", text
      puts "::warning title=News::#{text}" if ENV["GITHUB_ACTIONS"]
    end

    def bereich_ausblenden(posts)
      posts.clear
      @site.pages.reject! { |p| p.url.start_with?("/news/") }
      (@site.data.dig("navigation", "hauptmenue") || []).each do |m|
        m["anzeigen"] = false if m["url"] == "/news/"
      end
      @site.data["news_liste"] = []
      @site.data["news_filter"] = []
      @site.data["bildnachweise_auto"] = bildnachweise([])
    end

    # Titelbild aus assets/img/galerie/ (aufbereitet von bilder-optimieren.py)
    def bild(datei, wo)
      datei = datei.to_s.strip
      return nil if datei.empty?

      info = @web[datei]
      unless info
        vorhanden = File.exist?(File.join(@site.source, "assets", "img", "galerie", datei))
        warnen("#{wo}: Bild \"#{datei}\" #{vorhanden ? 'ist noch nicht aufbereitet (python3 tools/bilder-optimieren.py)' : 'fehlt in assets/img/galerie/'} – wird ohne Bild angezeigt")
        return nil
      end

      pfad = "/assets/img/galerie-web/#{info['name']}"
      {
        "klein_webp" => "#{pfad}-klein.webp", "klein_jpg" => "#{pfad}-klein.jpg",
        "gross_webp" => "#{pfad}-gross.webp", "gross_jpg" => "#{pfad}-gross.jpg",
        "og" => "#{pfad}-og.jpg",
        "breite" => info["breite"], "hoehe" => info["hoehe"],
        "klein_breite" => info["klein_breite"], "klein_hoehe" => info["klein_hoehe"]
      }
    end

    def datum_text(wert)
      case wert
      when Time, Date, DateTime then wert.strftime("%Y-%m-%d")
      else wert.to_s.strip
      end
    end

    def beitrag(post)
      d = post.data
      wo = post.relative_path
      d["title"] = d["titel"].to_s.strip unless d["titel"].to_s.strip.empty?
      d["description"] = d["kurzbeschreibung"].to_s.strip unless d["kurzbeschreibung"].to_s.strip.empty?
      warnen("#{wo}: \"titel\" fehlt") if d["titel"].to_s.strip.empty?
      warnen("#{wo}: \"kurzbeschreibung\" fehlt (wichtig für Vorschau und Google)") if d["kurzbeschreibung"].to_s.strip.empty?
      if d["datum"] && !d["datum"].to_s.strip.empty?
        begin
          d["date"] = Time.parse(datum_text(d["datum"]))
        rescue ArgumentError
          warnen("#{wo}: \"datum\" ist kein gültiges Datum (JJJJ-MM-TT) – es gilt das Datum im Dateinamen")
        end
      end
      d["tags"] = Array(d["tags"]).map(&:to_s)
      d["fotograf"] = d["fotograf"].to_s.strip.start_with?("[") ? "" : d["fotograf"].to_s.strip

      b = bild(d["titelbild"], wo)
      d["bild"] = b
      d["image"] = b["og"] if b
      d["lesezeit"] = [(post.content.to_s.split.size / 200.0).ceil, 1].max

      {
        "typ" => "beitrag",
        "id" => "beitrag-#{Jekyll::Utils.slugify(post.basename_without_ext)}",
        "titel" => d["title"].to_s,
        "datum" => datum_text(d["date"]),
        "url" => post.url,
        "kurz" => d["description"].to_s,
        "kategorie" => d["kategorie"].to_s.strip,
        "tags" => d["tags"],
        "bild" => b,
        "bild_alt" => d["bild_alt"].to_s.strip,
        "lesezeit" => d["lesezeit"],
        "auf_startseite" => ja?(d.fetch("auf_startseite", true))
      }
    end

    def presse_eintrag(doc)
      d = doc.data
      wo = doc.relative_path
      return nil unless ja?(d.fetch("veroeffentlicht", true))

      fehlend = %w[titel medium datum link eigene_zusammenfassung].select { |f| d[f].to_s.strip.empty? }
      unless fehlend.empty?
        warnen("#{wo}: Pflichtfeld fehlt (#{fehlend.join(', ')}) – Eintrag wird übersprungen")
        return nil
      end
      unless d["link"].to_s.start_with?("https://", "http://")
        warnen("#{wo}: \"link\" muss mit https:// beginnen – Eintrag wird übersprungen")
        return nil
      end

      {
        "typ" => "presse",
        "id" => "presse-#{Jekyll::Utils.slugify(doc.basename_without_ext)}",
        "titel" => d["titel"].to_s.strip,
        "datum" => datum_text(d["datum"]),
        "medium" => d["medium"].to_s.strip,
        "link" => d["link"].to_s.strip,
        "kurz" => d["eigene_zusammenfassung"].to_s.strip,
        "zitat" => d["zitat"].to_s.strip,
        "kategorie" => d["kategorie"].to_s.strip,
        "bild" => bild(d["bild"], wo),
        "bild_alt" => d["bild_alt"].to_s.strip,
        "auf_startseite" => ja?(d.fetch("auf_startseite", true))
      }
    end

    def filter(liste)
      arten = []
      arten << { "wert" => "beitrag", "name" => "Eigene Beiträge", "anzahl" => liste.count { |e| e["typ"] == "beitrag" } }
      arten << { "wert" => "presse", "name" => "Presse", "anzahl" => liste.count { |e| e["typ"] == "presse" } }
      namen = Array(@einstellungen["kategorien"]).map(&:to_s)
      unbekannt = liste.map { |e| e["kategorie"] }.uniq - namen - [""]
      unbekannt.each { |k| warnen("Kategorie \"#{k}\" steht nicht in news.yml – Filter wird hinten angehängt") }
      kategorien = (namen + unbekannt).map do |k|
        { "wert" => k, "name" => k, "anzahl" => liste.count { |e| e["kategorie"] == k }, "kategorie" => true }
      end
      (arten + kategorien).select { |f| f["anzahl"].positive? }
    end

    # Galerie-Fotografen (aus galerie.rb) + Fotografen der Beitrags-Titelbilder
    def bildnachweise(posts)
      gruppen = {}
      Array(@site.data["galerie_fotografen"]).each do |g|
        g["titel"].each { |t| (gruppen[g["name"]] ||= []) << "Galerie – „#{t}“" }
      end
      posts.each do |p|
        name = p.data["fotograf"].to_s.strip
        next if name.empty? || !p.data["bild"]

        (gruppen[name] ||= []) << "News – „#{p.data['title']}“"
      end
      gruppen.map { |name, wo| { "name" => name, "wo" => wo } }
    end
  end
end

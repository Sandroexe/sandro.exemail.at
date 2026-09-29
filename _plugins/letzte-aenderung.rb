# frozen_string_literal: true

# ═══════════════════════════════════════════════════════════════════════════
#  Setzt für jede Seite "last_modified_at" = Datum der letzten Git-Änderung.
#  jekyll-sitemap schreibt das als <lastmod> in die sitemap.xml.
#
#  Warum ein eigenes Plugin (statt jekyll-last-modified-at)?
#  Die Inhalte stehen in _data/ – ein neues Zertifikat ändert
#  zertifikate.yml, nicht zertifikate.html. Deshalb zählt hier das jüngste
#  Datum aus der Seitendatei UND den Dateien, die im Front Matter unter
#  "abhaengig_von" stehen.
#
#  Voraussetzung: vollständige Git-Historie (im Workflow: fetch-depth: 0).
#  Ohne Git (z. B. ZIP-Download) wird einfach kein Datum gesetzt.
# ═══════════════════════════════════════════════════════════════════════════

require "open3"
require "time"

module LetzteAenderung
  class Generator < Jekyll::Generator
    safe true
    priority :low # nach den anderen Generatoren, vor jekyll-sitemap (:lowest)

    def generate(site)
      @site = site
      @cache = {}
      return unless git_verfuegbar?

      site.pages.each do |seite|
        next unless seite.html?

        dateien = []
        dateien << seite.relative_path if seite.respond_to?(:relative_path) && datei?(seite.relative_path)
        dateien.concat(Array(seite.data["abhaengig_von"]).map(&:to_s))
        dateien.select! { |d| datei?(d) }
        next if dateien.empty?

        datum = dateien.map { |d| git_datum(d) }.compact.max
        seite.data["last_modified_at"] = datum if datum
      end
    end

    private

    def datei?(pfad)
      !pfad.to_s.empty? && File.exist?(File.join(@site.source, pfad))
    end

    def git_verfuegbar?
      _out, status = Open3.capture2e("git", "-C", @site.source, "rev-parse", "--is-inside-work-tree")
      status.success?
    rescue Errno::ENOENT
      false
    end

    def git_datum(pfad)
      @cache[pfad] ||= begin
        out, status = Open3.capture2("git", "-C", @site.source, "log", "-1", "--format=%cI", "--", pfad)
        status.success? && !out.strip.empty? ? Time.parse(out.strip) : nil
      end
    end
  end
end

# Für die lokale Vorschau und die GitHub-Actions-Prüfungen.
# GitHub Pages selbst baut mit seiner eigenen Umgebung; hier wird
# dieselbe Version festgehalten, damit lokal dasselbe herauskommt.
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick", "~> 1.8"

group :test do
  gem "html-proofer", "~> 5.0"
end

# Ruby-Pakete, die für den Bau der Website nötig sind.
# Installieren mit:  bundle install
source "https://rubygems.org"

gem "jekyll", "~> 4.4"

# Wird für "jekyll serve" ab Ruby 3 benötigt
gem "webrick", "~> 1.9"

group :jekyll_plugins do
  gem "jekyll-sitemap", "~> 1.4"
end

# Nur unter Windows nötig (Zeitzonen & Dateiüberwachung)
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
gem "wdm", "~> 0.2", platforms: [:windows]

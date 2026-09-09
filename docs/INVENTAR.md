# Inventar — Bestandsaufnahme vor dem Neubau

**Stand:** 2026-09-09 · **Quelle:** Branch `backup-alte-seite` (Commit `a587029`) sowie `main` (Commit `10c1a28`)

## 0. Ausgangslage: zwei Stände, nicht einer

| Branch | Commit | Was es ist |
|---|---|---|
| `backup-alte-seite` | `a587029` | Der eigentliche **alte Stand** — Dark/Neon (`#007aff`), Glitch-Ästhetik, CSS in jeder Seite, `data-de`/`data-en` im Markup, Three.js-Terminal. **Inhaltsquelle.** |
| `main` | `10c1a28` | Ein bereits begonnener **Teil-Umbau** (Tailwind Play-CDN, Font Awesome CDN, Google Fonts). Design und Technik unbrauchbar für unsere Vorgaben, aber `_data/*` enthält bereits sauber normalisierte Inhalte. **Zweite Inhaltsquelle.** |
| `rebuild/v2` | (neu) | Arbeitsbranch für den Neubau. Abgezweigt von `main`. |

> `main` verletzt drei harte Vorgaben gleichzeitig: Tailwind-Play-CDN, Font-Awesome-CDN und Google-Fonts-CDN — alles externe Requests, während die Datenschutzerklärung „keine externen Dienste" behauptet. Der Neubau übernimmt aus `main` **ausschließlich die YAML-Inhalte**, keinen Code.

## 1. Bestehende Pfade

| Pfad | Datei (alt) | Neubau |
|---|---|---|
| `/` | `index.html` | bleibt |
| `/contact/` | `contact/index.html` | **bleibt — steht auf der Visitenkarte** |
| `/projects.html` | `projects.html` | → `/projects/` + Redirect |
| `/certificates.html` | `certificates.html` | → `/certificates/` + Redirect |
| `/lab.html` | `lab.html` | → `/lab/` + Redirect |
| `/links.html` | `links.html` | → `/links/` + Redirect |
| `/impressum.html` | `impressum.html` | → `/impressum/` + Redirect |
| `/datenschutz.html` | `datenschutz.html` | → `/datenschutz/` + Redirect |
| `/404.html` | `404.html` | neu |
| — | — | **neu:** `/cv/`, `/impressum/social/` |

Interne Verlinkungen im Altstand zeigen auf die `.html`-Varianten (z. B. `/links.html` aus der Kontaktseite). Jede dieser URLs bekommt eine generierte Redirect-Seite aus `_data/redirects.yml`.

## 2. Social-Profile (verbindliche URLs)

| Plattform | Handle | URL |
|---|---|---|
| GitHub | `@Sandroexe` | `https://github.com/Sandroexe` |
| LinkedIn | `sandro-exenberger-1a5486315` | `https://www.linkedin.com/in/sandro-exenberger-1a5486315/` |
| Instagram | `@sandro_exe_2008` | `https://www.instagram.com/sandro_exe_2008/` |
| XING | `Sandro_Exenberger` | `https://www.xing.com/profile/Sandro_Exenberger` |
| Reddit | `u/Sandro_exe08` | `https://www.reddit.com/user/Sandro_exe08/` |
| Credly | `sandro-exenberger` | `https://www.credly.com/users/sandro-exenberger` |
| Stack Overflow | `sandro-exenberger` (ID 32745248) | `https://stackoverflow.com/users/32745248/sandro-exenberger` |

**Bereinigt gegenüber dem Altstand:**

- XING-URL trug den Tracking-Parameter `?nwt_nav=profile` → entfernt.
- Credly-URL zeigte auf `/edit#credly` — eine nur für dich erreichbare Bearbeitungsseite → korrigiert auf das öffentliche Profil.
- Instagram existierte in zwei Schreibweisen (`instagram.com/...` und `www.instagram.com/.../`) → auf eine Form vereinheitlicht.
- **`main` hatte XING und Credly ganz verloren** — hier wieder aufgenommen.

## 3. Kontaktdaten

| Feld | Wert |
|---|---|
| E-Mail | `sandro@exemail.at` |
| Telefon | `+43 676 7406799` (href `+436767406799`) |
| Ort | 6334 Schwoich, Österreich |
| Straße/Hausnummer | ⚠️ **fehlt** — siehe TODO 1 |

## 4. Kontaktformular — Mechanismus

- **Endpoint:** `POST https://api.exemail.at/api/contact` (selbst gehostet, hinter Cloudflare)
- **Payload:** `{ "name", "email", "phone", "message" }` als JSON, `Content-Type: application/json`
- **Antwort:** JSON, wird clientseitig ausgewertet
- **Live-Prüfung am 2026-09-09:** OPTIONS-Preflight → `HTTP 204`, Header `access-control-allow-origin: https://sandro.exemail.at`

> **Wichtige Konsequenz:** Die API akzeptiert **nur** die Origin `https://sandro.exemail.at`. Das Formular funktioniert deshalb prinzipbedingt **nicht** in einer lokalen Jekyll-Vorschau (`localhost:4000`) — dort schlägt der CORS-Check fehl. Das ist kein Fehler, sondern gewollte Absicherung. Der Neubau übernimmt Endpoint und Payload unverändert und behandelt den Netzwerkfehler mit einem `mailto:`-Fallback.

## 5. Inhalte je Seite

**Startseite:** Hero mit Typewriter, Bio (Schülerunion-Regionalvorstand, Schülervertretung ~1600 Schüler:innen, HTL-Incubator, CCNA), Tech-Stack mit vier Skill-Balken (Linux/Debian & CachyOS „Fortgeschritten", IoT & Elektronik „Erfahren", Chatbot & Python „Fortgeschritten", Hardware/Maker „Erfahren"), GitHub-Aktivität, zwei Timelines (Schullaufbahn, Beruf & Engagement), Terminal-Easter-Egg.

**Lebenslauf (bisher nur auf der Startseite):**

| Zeitraum | Station |
|---|---|
| seit 09/2022 | Elektronik & Technische Informatik, HTBLVA Anichstraße Innsbruck |
| 2018–2022 | Mittelschule 2 Kufstein |
| 2014–2018 | Volksschule Schwoich |
| seit 10/2025 | Regionalvorstand Tiroler Unterland, Schülerunion Österreich |
| seit 10/2025 | Gewählte Schülervertretung, HTBLVA Anichstraße (Schulgemeinschaftsausschuss, ~1600 Schüler:innen) |
| seit 06/2025 | Leitung HTL-Incubator (Open Maker Space) |
| 07/2024–08/2024 | Praktikum WörglWeb, Stadtwerke Wörgl GmbH — Netzwerkinfrastruktur, Außendienst, Hardware-Vorkonfiguration |

**Zertifikate (6):** CCNA (Cisco, Jun 2025, 3 Jahre gültig) · LPIC-1 101 Linux-Installation und -Paketverwaltung · Einführung und Einstieg in Linux · GPTs mit ChatGPT erstellen · IoT-Grundlagen für Entwickler:innen – Elektronik-Basiswissen · Die 7 schlimmsten Verhandlungsfehler (alle LinkedIn Learning, Feb. 2026, mit Verify-Links).

**Projekte (manuell):** Portfolio-Website · eigene Domain & E-Mail `@exemail.at` · Home Assistant Energie-Dashboard · AdGuard Home DNS · eigener DynDNS im LXC · Mediathek Jellyfin & Plex.

**Home Lab:** Ryzen 7 9800X3D (8C/16T, 96 MB L3, 5.2 GHz, 120 W) · RTX 5070 ASUS TUF OC (12 GB GDDR7, Blackwell GB205, 220 W) · 32 GB DDR5-6000 CL30 Corsair Vengeance RGB (EXPO) · 2 TB NVMe PCIe 5.0 · CachyOS + Windows 11 Pro Dual-Boot · ZSH + Oh-My-Zsh · BORE/EEVDF-Kernel.

**Rechtstexte:** Impressum (§ 5 ECG, § 14 UGB, § 63 GewO, § 25 MedienG) und Datenschutzerklärung (GitHub-Pages-Hosting, Kontakt per E-Mail, externe Dienste, keine Cookies, Betroffenenrechte).

## 6. Assets

| Datei | Größe | Bewertung |
|---|---|---|
| `profile.jpg` | 770 KB | übernehmen, **muss** zu WebP/AVIF + `srcset` |
| `pc-setup.jpg` | 2,6 MB | übernehmen, **muss** dringend optimiert werden |
| `favicon.ico` | 7 KB | übernehmen |
| `apple-touch-icon.png` | 670 B | übernehmen |
| Lebenslauf-PDF | — | ⚠️ **existiert nicht** — siehe TODO 5 |

## 7. Externe Abhängigkeiten im Altbestand (alle zu entfernen)

| Dienst | Verwendung | Ersatz |
|---|---|---|
| `cdnjs.cloudflare.com` (Three.js r128) | 3D-GitHub-City | entfällt ersatzlos |
| `github-contributions-api.jogruber.de` | Commit-Heatmap | Build-Time-Vorberechnung |
| `img.shields.io` | Badges im README | statische Textangaben |
| `placehold.co` | Avatar-Fallback | lokales Fallback-SVG |
| Google Fonts, Font Awesome, Tailwind Play-CDN | nur auf `main` | self-hosted WOFF2, eigene SVG-Icons, eigenes CSS |

Diese Liste ist der Grund, warum Punkt 4 der alten Datenschutzerklärung („Inhalte von externen Diensten … wodurch Ihre IP-Adresse übermittelt werden kann") überhaupt nötig war. Nach dem Neubau kann dieser Punkt entfallen — die Aussage „keine externen Dienste" wird dann tatsächlich wahr.

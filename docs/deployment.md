# Deployment und Launch (Build-Plan Phase 7)

Statische Seite, gebaut mit `npm run build`, Ausgabe nach `dist/`. Hosting auf
Cloudflare Pages, Build aus GitHub (Spezifikation 11).

## Cloudflare Pages einrichten

1. Repo `huwy7/huwy` mit Cloudflare Pages verbinden.
2. Build-Einstellungen:
   - Build-Befehl: `npm run build`
   - Ausgabeverzeichnis: `dist`
   - Node-Version: 20 oder neuer (Projekt getestet mit Node 22).
3. Produktivbranch: `main` (jeder Push auf `main` baut und deployt).

## Domain, HTTPS, HSTS

- Domain `TODO_DOMAIN` in Cloudflare aufschalten.
- `www` per Weiterleitungsregel auf die nackte Domain umleiten.
- „Always Use HTTPS" aktivieren (erzwingt HTTPS an der Edge).
- HSTS ist über `public/_headers` gesetzt (`Strict-Transport-Security`,
  1 Jahr, `includeSubDomains`). Bei Bedarf `preload` ergänzen — das ist eine
  bewusste, schwer umkehrbare Entscheidung und daher hier nicht vorgewählt.

## Vor dem Live-Gang unbedingt erledigen

- **`site` in `astro.config.mjs`** von `https://TODO_DOMAIN` auf die echte Domain
  setzen. Davon hängen `sitemap.xml`, `canonical` und die Open-Graph-URLs ab.
- **`Sitemap:`-Zeile in `public/robots.txt`** auf die echte Domain setzen.
- Alle `TODO_`-Platzhalter ersetzen (siehe unten).
- Impressum und Datenschutzerklärung mit echten Texten füllen
  (`src/pages/impressum.astro`, `src/pages/datenschutz.astro`).
- Echte, körnige Schwarzweissbilder einsetzen und die Bildqualität kalibrieren
  (siehe `docs/bilder-pipeline.md`), danach das Budget neu messen.
- CMS-OAuth einrichten (siehe `docs/cms.md`).

## Offene Platzhalter (repoweit greppen: `TODO_`)

| Platzhalter | Bedeutung | Vorkommen |
|---|---|---|
| `TODO_NAME` | Name / Wortmarke | 16 |
| `TODO_MAIL` | Kontakt-Mailadresse | 8 |
| `TODO_DOMAIN` | Produktive Domain | 8 |
| `TODO_INSTAGRAM` | Instagram-Link | 6 |
| `TODO_SERIEN` | Titel/Jahr der Serien (in Kommentaren) | — |

## Startcheckliste — Stand

Bereits erfüllt und geprüft:

- [x] Alle internen Links funktionieren, keine 404 ausser der 404-Seite
      (Crawl über `dist/` — alle Ziele vorhanden).
- [x] `sitemap-index.xml` / `sitemap-0.xml` erreichbar und vollständig
      (8 Seiten, 404 korrekt ausgenommen).
- [x] Seite ohne JavaScript vollständig funktionsfähig (Progressive
      Enhancement; nur der Cursor ist optionales JS, CLAUDE.md 4a).
- [x] `mailto:`-Link vorhanden (öffnet den Mail-Client; Adresse ist noch
      `TODO_MAIL`).

Erst nach Deployment / mit echten Inhalten prüfbar:

- [ ] Domain aufgeschaltet, `www` leitet auf die nackte Domain um.
- [ ] HTTPS erzwungen, HSTS aktiv (Header gesetzt, an der echten Domain prüfen).
- [ ] Auf einem echten iPhone in Safari geprüft.
- [ ] Alle `TODO_`-Platzhalter ersetzt.
- [ ] Impressum und Datenschutzerklärung mit echten Texten gefüllt.

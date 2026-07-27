# Deployment und Launch (Build-Plan Phase 7)

Statische Astro-Seite, gebaut mit `npm run build` (Ausgabe `dist/`).

**Hosting-Abweichung von der Spezifikation:** Spezifikation 11 nennt Cloudflare
Pages. Auf Wunsch des Betreibers läuft das Deployment stattdessen über **GitHub
Pages mit GitHub Actions**. Funktional gleichwertig; ein Unterschied ist unten
notiert (keine benutzerdefinierten HTTP-Header).

## Wie es funktioniert

- `.github/workflows/deploy.yml` baut bei jedem Push auf `main` (und manuell per
  „Run workflow") die Seite und veröffentlicht `dist/` auf GitHub Pages.
- `public/CNAME` (`hey.hu-wy.ch`) hält die Domain über Deploys hinweg.
- `site` in `astro.config.mjs` steht auf `https://hey.hu-wy.ch` — davon hängen
  `sitemap.xml`, `canonical` und die Open-Graph-URLs ab.

**Wichtig:** „Deploy from a branch" funktioniert für Astro **nicht** — es liefert
die Quelldateien statt der gebauten Seite. Quelle muss **GitHub Actions** sein.

## Einmalige Einrichtung (im Browser)

1. **Repo → Settings → Pages → Build and deployment → Source: `GitHub Actions`.**
2. **Custom domain**: `hey.hu-wy.ch` eintragen (bzw. bereits gesetzt lassen).
3. **DNS beim Domain-Anbieter** (Zone `hu-wy.ch`): für den Subdomain-Eintrag
   `hey` einen **CNAME** auf `huwy7.github.io` setzen — **nicht** als A-Record
   (GitHub meldet sonst `InvalidARecordError`). Bestehende A-Records für `hey`
   entfernen.
   - Liegt die DNS bei Cloudflare: den Eintrag auf **„DNS only"** (graue Wolke)
     stellen, nicht proxied — sonst kann GitHub kein Zertifikat ausstellen.
4. Warten, bis der DNS-Check grün ist (kann bis zu einige Stunden dauern), dann
   **Enforce HTTPS** aktivieren.

## HTTPS / HSTS

- HTTPS wird von GitHub Pages nach „Enforce HTTPS" erzwungen; HSTS liefert die
  Pages-Infrastruktur dann mit.
- GitHub Pages erlaubt **keine** benutzerdefinierten Header (anders als
  Cloudflare). Zusatz-Header wie `X-Frame-Options` lassen sich hier nicht setzen
  — deshalb wurde die Cloudflare-Datei `public/_headers` entfernt.

## Vor dem Live-Gang noch offen

- Restliche `TODO_`-Platzhalter ersetzen: `TODO_NAME`, `TODO_MAIL`,
  `TODO_INSTAGRAM` (Domain ist gesetzt).
- Echte körnige Schwarzweissbilder einsetzen, Qualität kalibrieren, Budget messen
  (`docs/bilder-pipeline.md`).
- Impressum/Datenschutz: laut Betreiber vorerst nicht nötig (private Nutzung).
  Rechtlicher Hinweis: Sobald die Seite öffentlich erreichbar ist, protokolliert
  der Hoster Personendaten (IP) — dann wäre nach revidiertem CH-DSG eine
  Datenschutzerklärung fällig.
- CMS-OAuth einrichten (`docs/cms.md`), sobald die Live-URL steht.

## Startcheckliste — Stand

- [x] Interne Links funktionieren, keine 404 ausser der 404-Seite (dist-Crawl).
- [x] `sitemap-index.xml` erreichbar und vollständig (8 Seiten, 404 ausgenommen).
- [x] Seite ohne JavaScript vollständig funktionsfähig (nur der Cursor ist
      optionales JS).
- [x] `site`/Domain gesetzt (`hey.hu-wy.ch`).
- [ ] Actions-Deploy grün, Seite unter der Domain erreichbar.
- [ ] `www`/Apex nach Bedarf — hier nur die Subdomain `hey.hu-wy.ch`.
- [ ] HTTPS erzwungen.
- [ ] Auf echtem iPhone in Safari geprüft.
- [ ] Restliche `TODO_`-Platzhalter ersetzt.

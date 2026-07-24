# Fotografie-Portfolio

Statische, deutschsprachige Portfolio-Seite: eine Person, drei Bildserien. Weisser,
ruhiger Hintergrund — der raue Ton kommt aus den schwarzweissen, körnigen Bildern,
nicht aus dem Layout.

## Stack

- [Astro](https://astro.build) (statisch, kein Client-JS ausser dem Cursor)
- TypeScript `strict`
- Vanilla CSS mit Custom Properties (`src/styles/tokens.css` ist die einzige
  Wertequelle)
- Astro Content Collections + `astro:assets`
- Sveltia CMS unter `/admin` (Komfort, keine Abhängigkeit)
- Hosting: Cloudflare Pages

## Entwicklung

```sh
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
npm run check    # astro check (TypeScript/Diagnostics)
```

Node 20+ (getestet mit Node 22).

## Struktur

```
src/
  content/serien/        eine Markdown-Datei pro Serie (Einleitung = Körper)
  content.config.ts      Schema der Collection (Spezifikation 7)
  assets/serien/<slug>/  Bilder der Serie, von astro:assets verarbeitet
  components/Bild.astro   <picture> mit AVIF/WebP/JPEG
  layouts/Basis.astro     Header, Fusszeile, Meta, Cursor-Skript
  pages/                  Startseite, /serien/[slug], über, kontakt, …
  styles/tokens.css       alle Custom Properties
  styles/global.css       Reset, Basistypografie, Bildregeln, Cursor
public/
  admin/                 Sveltia CMS
  fonts/                 selbst gehostete WOFF2 (OFL 1.1)
docs/                    Spezifikation, Build-Plan und Befunde
```

## Dokumentation

- `CLAUDE.md` — verbindliche Projektregeln
- `docs/01-spezifikation.md` — Gestaltung, Layout, Content-Modell
- `docs/02-build-plan.md` — die sieben Bau-Phasen
- `docs/schrift-lizenzen.md` — Lizenzstand der Schriften
- `docs/bilder-pipeline.md` — Bildformate, Qualität, Befunde (Monochrom, Korn)
- `docs/cms.md` — Sveltia CMS und der offene OAuth-Schritt
- `docs/deployment.md` — Cloudflare Pages, Domain, HTTPS/HSTS, Startcheckliste

## Vor dem Live-Gang

Die Seite ist gebaut, aber mit Platzhaltern. Offen (Details in
`docs/deployment.md`):

- `TODO_`-Platzhalter ersetzen: `TODO_NAME`, `TODO_MAIL`, `TODO_DOMAIN`,
  `TODO_INSTAGRAM`, `TODO_SERIEN`.
- Echte körnige Schwarzweissbilder (Graustufen) einsetzen, Bildqualität
  kalibrieren, Budget neu messen.
- Impressum und Datenschutzerklärung mit echten Texten füllen.
- `site` in `astro.config.mjs` auf die echte Domain setzen.
- Deployment auf Cloudflare Pages und CMS-OAuth einrichten.

## Der invertierte Cursor

Einzige Stelle mit clientseitigem JavaScript — bewusste Ausnahme, dokumentiert in
`CLAUDE.md` Abschnitt 4a. Progressive Enhancement: ohne JavaScript funktioniert die
Seite vollständig und unverändert. Nur bei feinem Zeiger, mit `prefers-reduced-motion`-
und Touch-Fallback.

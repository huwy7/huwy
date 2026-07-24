# Schrift-Lizenzen

Befund der Lizenzprüfung aus Build-Plan Phase 0. Beide Schriften sind frei
nutzbar, selbst hostbar und kommerziell einsetzbar. **Kein Blocker.**

## Commit Mono — Beschriftungen (Spezifikation 3.1)

- **Lizenz:** SIL Open Font License, Version 1.1 (OFL-1.1)
- **Urheber:** Eigil Nikolajsen
- **Verifiziert an:** der `LICENSE`-Datei im offiziellen Fontsource-Paket
  `@fontsource/commit-mono` (v1.132) sowie der Repository-Angabe unter
  <https://github.com/eigilnikolajsen/commit-mono> (Schriftdateien: OFL-1.1;
  Website-Code separat MIT — für uns nicht relevant).
- **Lizenztext im Repo:** `public/fonts/commit-mono-OFL.txt`
- **Subsets:** Upstream liefert ausschliesslich `latin`. Einen `latin-ext`-Subset
  gibt es für Commit Mono nicht. Der `latin`-Subset deckt die deutschen Umlaute
  ä ö ü und ß ab (Unicode-Bereich U+0000–00FF), ist für diese Seite also
  vollständig. Central-/Osteuropäische Zeichen (`latin-ext`) fehlen — für den
  deutschsprachigen Inhalt ohne Bedeutung.

## Instrument Sans — Fliesstext (Spezifikation 3.2)

- **Lizenz:** SIL Open Font License, Version 1.1 (OFL-1.1)
- **Urheber:** The Instrument Sans Project Authors, 2022
- **Verifiziert an:** der `LICENSE`-Datei im offiziellen Fontsource-Paket
  `@fontsource/instrument-sans` (v4) sowie der Repository-Angabe unter
  <https://github.com/Instrument/instrument-sans> (`OFL.txt`).
- **Lizenztext im Repo:** `public/fonts/instrument-sans-OFL.txt`
- **Subsets:** `latin` und `latin-ext`.

## Einbindung

- Format WOFF2, selbst gehostet unter `public/fonts/`, kein Fremd-CDN.
- Nur Schnitt 400 und 500 je Familie, `font-display: swap`
  (`src/styles/schriften.css`).
- Bezugsquelle der WOFF2-Dateien: die oben genannten Fontsource-npm-Pakete
  (identische OFL-Dateien). Die Pakete selbst sind **keine** Projekt-Dependency —
  die WOFF2-Dateien wurden entnommen und liegen direkt im Repo.

## OFL-Pflichten (erfüllt)

- Lizenztext liegt bei (`public/fonts/*-OFL.txt`).
- Kein Verkauf der Schrift für sich allein.
- Reservierte Schriftnamen werden nicht für veränderte Versionen verwendet
  (es werden keine veränderten Versionen ausgeliefert).

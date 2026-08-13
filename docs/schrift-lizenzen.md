# Schrift-Lizenzen

Befund der Lizenzprüfung aus Build-Plan Phase 0, später um die beiden
Display-Schriften ergänzt. Alle vier Schriften sind frei nutzbar, selbst hostbar
und kommerziell einsetzbar. **Kein Blocker.**

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

## Caprasimo — Display-Schrift der Farbseite (CLAUDE.md 1a)

- **Lizenz:** SIL Open Font License, Version 1.1 (OFL-1.1)
- **Urheber:** The Caprasimo Project Authors, 2022
- **Verifiziert an:** der `OFL.txt` im offiziellen Repository
  <https://github.com/thomasjockin/Caprasimo> sowie der Lizenzangabe auf
  <https://fonts.google.com/specimen/Caprasimo>.
- **Lizenztext im Repo:** `public/fonts/caprasimo-OFL.txt`
- **Subsets:** `latin` und `latin-ext`.
- **Schnitte:** nur 400 — die Schrift hat keinen weiteren Schnitt, sie ist von
  Haus aus fett.
- **Einsatz:** trägt im Farbmodus die **gesamte** Beschriftung — Kopfzeile,
  Serientitel, Seitentitel, Fliesstext. Auf der düsteren Seite kommt sie nicht
  vor; dort steht Anton.

## Anton — Display-Schrift der düsteren Seite (CLAUDE.md 1a)

- **Lizenz:** SIL Open Font License, Version 1.1 (OFL-1.1)
- **Urheber:** The Anton Project Authors, 2020 (Vernon Adams, Kimberly Geswein,
  Cyreal); gepflegt im Google-Fonts-Repository
- **Verifiziert an:** der `LICENSE` des Fontsource-Pakets `@fontsource/anton`
  (v5.3.0), die den vollständigen OFL-1.1-Text samt Copyright-Zeile enthält.
  Die Datei wurde heruntergeladen und liegt im Repo, nicht nur referenziert.
- **Lizenztext im Repo:** `public/fonts/anton-OFL.txt`
- **Subsets:** `latin` und `latin-ext`.
- **Schnitte:** nur 400 — die Familie hat keinen weiteren, sie ist von Haus aus
  fett.
- **Einsatz:** trägt im düsteren Modus die **gesamte** Beschriftung, spiegelbildlich
  zu Caprasimo auf der Farbseite.
- **Vorgeschichte:** löst **Bebas Neue** ab (ebenfalls OFL-1.1, Dharma Type). Dem
  Betreiber war Bebas Neue zu schmal und zu hoch; Anton setzt denselben Text rund
  27 % breiter (nachgemessen an „CDMX 2026" in gleicher Schriftgrösse) und ist
  dabei deutlich fetter. Die Bebas-Dateien und ihr Lizenztext wurden aus
  `public/fonts/` entfernt.
- **Besonderheit:** Anton HAT Kleinbuchstaben — anders als Bebas Neue, das keine
  Gemeinen kennt und alles als Versalien zeichnete. Beschriftungen stehen im
  Markup weiterhin in Sentence case (Regel 8) und erscheinen seit dem Wechsel
  auch so: „Portfolio" statt „PORTFOLIO". Es gibt weiterhin kein `text-transform`.

## Commit Mono — heute nur noch das Zugangs-Tor

Seit die beiden Modi je eine eigene Display-Schrift tragen, steht Commit Mono
nur noch im Eingabefeld des Zugangs-Tors (`--schrift-tor`). Der Token ist bewusst
von `--schrift-beschriftung` getrennt: das Tor sieht in beiden Modi gleich aus,
und seine Feldbreite (`14ch`) hängt an der Zeichenbreite einer Monospace. Die
Schrift bleibt deshalb im Repo und in `schriften.css`.

## Einbindung

- Format WOFF2, selbst gehostet unter `public/fonts/`, kein Fremd-CDN.
- Nur Schnitt 400 und 500 je Familie, `font-display: swap`
  (`src/styles/schriften.css`).
- Bezugsquelle der WOFF2-Dateien: die oben genannten Fontsource-npm-Pakete
  (identische OFL-Dateien), bei Caprasimo und Anton direkt die
  WOFF2-Auslieferung von Google Fonts. Die Pakete selbst sind **keine**
  Projekt-Dependency — die WOFF2-Dateien wurden entnommen und liegen direkt im
  Repo.

## OFL-Pflichten (erfüllt)

- Lizenztext liegt bei (`public/fonts/*-OFL.txt`).
- Kein Verkauf der Schrift für sich allein.
- Reservierte Schriftnamen werden nicht für veränderte Versionen verwendet
  (es werden keine veränderten Versionen ausgeliefert).

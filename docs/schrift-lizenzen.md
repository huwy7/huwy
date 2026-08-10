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
  vor; dort steht Bebas Neue.

## Bebas Neue — Display-Schrift der düsteren Seite (CLAUDE.md 1a)

- **Lizenz:** SIL Open Font License, Version 1.1 (OFL-1.1)
- **Urheber:** Dharma Type (Ryoichi Tsunekawa), 2010
- **Verifiziert an:** der `OFL.txt` im offiziellen Google-Fonts-Repository
  (<https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneue/OFL.txt>).
  Die Datei wurde heruntergeladen und liegt im Repo, nicht nur referenziert.
- **Lizenztext im Repo:** `public/fonts/bebas-neue-OFL.txt`
- **Subsets:** `latin` und `latin-ext`.
- **Schnitte:** nur 400 — die Google-Fonts-Fassung hat keinen weiteren.
- **Einsatz:** trägt im düsteren Modus die **gesamte** Beschriftung, spiegelbildlich
  zu Caprasimo auf der Farbseite.
- **Besonderheit:** keine Kleinbuchstaben. Gemeine werden als Versalien
  gezeichnet. Das Markup bleibt in Sentence case (Regel 8), es gibt kein
  `text-transform` — die Grossschreibung kommt allein aus der Schrift.

### Verworfen: Protest Revolution

Ein erster Versuch für die düstere Seite (OFL-1.1, Octavio Pardo) wurde vom
Betreiber abgelehnt. Schriftdateien und Lizenztext sind wieder aus dem Repo
entfernt.

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
  (identische OFL-Dateien), bei Caprasimo und Bebas Neue direkt die
  WOFF2-Auslieferung von Google Fonts. Die Pakete selbst sind **keine**
  Projekt-Dependency — die WOFF2-Dateien wurden entnommen und liegen direkt im
  Repo.

## OFL-Pflichten (erfüllt)

- Lizenztext liegt bei (`public/fonts/*-OFL.txt`).
- Kein Verkauf der Schrift für sich allein.
- Reservierte Schriftnamen werden nicht für veränderte Versionen verwendet
  (es werden keine veränderten Versionen ausgeliefert).

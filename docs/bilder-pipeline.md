# Bild-Pipeline — Konfiguration und Befunde

Build-Plan Phase 5. Umsetzung von Spezifikation 5.3, 5.4 und 10.

## Formate und Komponente

Alle Bilder laufen über `src/components/Bild.astro`. Die Komponente gibt ein
`<picture>` aus mit:

- `<source type="image/avif">` — AVIF
- `<source type="image/webp">` — WebP
- `<img>` mit **JPEG** als Fallback

Damit werden AVIF und WebP ausgeliefert, JPEG als Fallback (Spezifikation 5.4).

Zwei Modi:

- **responsiv** (`widths` + `sizes`): Seitenverhältnis bleibt erhalten. Wird für
  **alle** Bilder verwendet — Serienbilder wie Titelbilder der Startseite. Jedes
  Bild gibt sein Seitenverhältnis selbst vor (quer, hoch oder quadratisch); nichts
  wird zugeschnitten. Hochformat-Titelbilder werden auf der Startseite über die
  Höhe gedeckelt (`--vorschau-max-hoehe`) und zentriert.
- **Crop** (`breite` + `hoehe` + `densities`): fester Zuschnitt. Auf der Seite
  selbst nicht mehr im Einsatz; der Modus bleibt in `Bild.astro` erhalten, das
  Open-Graph-Vorschaubild (1200×630) erzeugt die Serienseite direkt über
  `getImage`.

`srcset`-Breiten: 640, 960, 1280, 1600, 2000 (Spezifikation 5.4). Breiten über
der Quellauflösung werden herausgefiltert (kein Upscaling).

Jedes `<img>` trägt `width`, `height`, `alt`, `decoding="async"` und
`loading="lazy"` — **Ausnahme:** das erste Bild der Startseite bekommt
`loading="eager"` und `fetchpriority="high"` (Spezifikation 5.4).

## Qualitätsstufen

Festgelegt in `Bild.astro` (`QUALITAET`):

| Format | Qualität | Begründung |
|---|---|---|
| AVIF | 65 | Ausgangspunkt aus Spezifikation 5.3 |
| WebP | 80 | Ausgangspunkt aus Spezifikation 5.3 |
| JPEG | 80 | Fallback, gleiche Stufe wie WebP |

**Wichtig — noch nicht endgültig kalibriert.** Die Spezifikation verlangt, die
Werte an einem **echten körnigen Schwarzweissbild** zu kalibrieren, weil Korn
hochfrequentes Rauschen ist, das verlustbehaftete Codecs zuerst wegwerfen. Die
aktuellen Platzhalter sind einfarbig grau und zeigen kein Korn — eine
Sichtprüfung ist daran unmöglich. Sobald ein echtes Bild vorliegt:

1. Werte in `Bild.astro` (`QUALITAET`) anpassen, bei 100 %-Ansicht gegen die
   Quelle prüfen.
2. Reisst das Budget (5.5), **kleinere Ausgangsauflösung** wählen, nie stärkere
   Kompression (CLAUDE.md Regel 11).

Alternativ lassen sich die Encoder-Optionen global setzen: Astros Sharp-Service
spreizt `image.service.config.{avif,webp,jpeg}` direkt in die Sharp-Aufrufe
(`astro.config.mjs`).

## Befund 1 — Monochrom-Kodierung

- Astro/Sharp (0.35.3) bietet **keinen** Schalter, ein Bild beim Verarbeiten nach
  Monochrom zu zwingen. Der Sharp-Service ruft weder `greyscale()` noch
  `toColourspace('b-w')` auf.
- **Aber:** Sind die Quelldateien echte Graustufen (Spezifikation 5.4 fordert
  „Graustufen"-Export), bleibt der Farbraum durch die Pipeline erhalten, und
  AVIF/WebP kodieren ohne Chroma-Kanäle — die Ersparnis passiert automatisch,
  ohne Pipeline-Änderung.
- Die aktuellen Platzhalter sind RGB (3 Kanäle) — also **noch nicht** monochrom
  kodiert. Mit echten Graustufen-Quellen ist es das.
- Fazit: **kein Handlungsbedarf im Code**, sondern eine Anforderung an den
  Export. Falls gewünscht, liesse sich Monochrom über einen eigenen
  Image-Service erzwingen — dafür gibt es aber keinen Bedarf, solange die
  Quellen Graustufen sind.

## Befund 2 — AVIF-Korn-Synthese (film grain synthesis)

- **Nicht verfügbar** über die Astro-Toolchain. Sharp 0.35.3 (libvips) belichtet
  für AVIF nur `quality`, `lossless`, `effort`, `chromaSubsampling`, `bitdepth`
  — **kein** Film-Grain-Parameter. Die AV1-Korn-Synthese des AOM-Encoders ist
  hier nicht ansprechbar.
- Konsequenz: Der Weg „stark komprimieren und Korn im Decoder rekonstruieren"
  ist mit diesem Stack **nicht** möglich. Korn wird stattdessen erhalten, indem
  die Qualität nicht zu tief gewählt wird (Kalibrierung oben) und im Zweifel die
  Ausgangsauflösung sinkt, nicht die Qualität.

## Budget (Spezifikation 5.5)

Gemessen am aktuellen Build (nur Platzhalter):

- Grösstes ausgeliefertes Bild: ~23 KB — **weit** unter 700 KB.
- CLS: < 0.05 auf allen Seiten (Maximum 0.0394 auf `/ueber`, vermutlich durch
  `font-display: swap`), gemessen mit einem headless Chromium.

**Vorbehalt:** Diese Zahlen stammen von einfarbigen Platzhaltern. Echte körnige
Fotos sind deutlich grösser. Budget (700 KB pro Bild, 1.2 MB erste
Bildschirmfläche, LCP < 2.0 s auf 4G) muss mit echten Bildern erneut gemessen
werden.

## Lighthouse

In dieser Umgebung ist kein Lighthouse verfügbar. Ersatzweise geprüft: CLS
(< 0.05), Bildgrössen (< 700 KB), korrekte `width`/`height`/`alt`, `eager`/`lazy`.
Der vollständige Lighthouse-Lauf (Accessibility ≥ 95, Performance ≥ 90) sollte
nach dem ersten Deploy auf Cloudflare Pages mit echten Bildern erfolgen.

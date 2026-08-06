# Spezifikation

Verbindliche Vorgabe für Gestaltung, Layout und Content-Modell.
Nicht interpretieren, nicht „verbessern". Bei Zweifel fragen.

---

## 1. Gestalterische Grundhaltung

Weisser Hintergrund, viel Leerraum, keine Dekoration. Die Bilder sind
schwarzweiss, körnig und roh. Die Website ist es nicht.

> **Mood (siehe CLAUDE.md 1a):** Die übergeordnete künstlerische Richtung ist
> düster, roh, industriell — „OG KEEMO"-Stil. Schlagwörter: grain, dark, rough,
> raw, industrial, techno, old school, heavy. Ob der weisse Hintergrund dabei
> bleibt oder die Seite selbst dunkel wird, ist eine bewusst offene Entscheidung.

**Das ist die zentrale Regel dieses Projekts:** Der raue Ton kommt aus den Bildern.
Die Seite trägt ihn, sie imitiert ihn nicht. Eine Seite, die ebenfalls rau sein will,
konkurriert mit den Bildern statt sie zu zeigen — und in Schwarzweiss gibt es keine
Farbe, mit der sich dieser Konflikt kaschieren liesse.

Der Bruch zur reinen Galerie-Ästhetik passiert an genau einer Stelle: in der
Typografie. Alle Beschriftungen laufen in einer Monospace. Das liest sich wie
Kontaktbogen- und Negativhüllen-Beschriftung statt wie ein Museums-Etikett, und es
ist eine Entscheidung, die man einmal trifft und danach nirgends wiederholen muss.

**Das prägende Element der Seite** bleibt der Bildrhythmus: Jedes Bild wird über die
*Höhe* normiert, nicht über die Breite (Abschnitt 5.1). Dadurch bekommt jedes Bild
dasselbe visuelle Gewicht, egal ob hoch oder quer, und der Scroll läuft gleichmässig.

---

## 2. Farbe

```css
--farbe-hintergrund: #ffffff;
--farbe-text:        #111111;
--farbe-text-leise:  #767676;
--farbe-linie:       #e5e5e5;
```

Vier Werte. Keine Akzentfarbe, keine weiteren Grautöne, kein Sepia, kein
gebrochenes Weiss. Links sind schwarz und unterstrichen, nicht farbig.

`--farbe-linie` wird ausschliesslich für die Trennlinie über der Fusszeile benutzt.

Das Weiss ist rein. Ein cremiger oder papierartiger Ton wäre hier ein Fehler: er
legt einen Farbstich unter Bilder, die bewusst keinen haben.

---

## 3. Typografie

Zwei Schriften mit klar getrennten Rollen. Keine dritte.

### 3.1 Monospace — alle Beschriftungen

Wortmarke, Navigation, Serientitel, Jahr, Fusszeile, Meta-Angaben.

**Empfehlung:** `Commit Mono` — frei, selbst hostbar, ruhige Letternformen.
Bewusst **nicht** `JetBrains Mono`, `Fira Code` oder `IBM Plex Mono`: das sind
Entwicklerwerkzeug-Schriften, die entsprechend gelesen werden.

Wer mehr Kante will, kann `Space Mono` nehmen — deutlich eigenwilliger, aber auch
deutlich präsenter. Im Zweifel die ruhigere Variante: die Monospace *an sich* ist
bereits die Geste, die Buchstabenformen müssen es nicht zusätzlich sein.

### 3.2 Grotesk — Fliesstext

Serieneinleitung, Über-Text, Rechtstexte. Alles ab etwa drei Sätzen.

**Empfehlung:** `Instrument Sans`. Bewusst nicht `Inter` — das ist die
Standardantwort und begegnet Besuchern auf jeder zweiten Portfolio-Seite.

### 3.3 Einbindung

```css
--schrift-mono:    "Commit Mono", ui-monospace, "SF Mono", Menlo, monospace;
--schrift-text:    "Instrument Sans", -apple-system, BlinkMacSystemFont, sans-serif;
```

- Selbst gehostet als WOFF2, kein Google-Fonts-CDN (Datenschutz und Ladezeit)
- Nur Schnitt 400 und 500 je Familie
- `font-display: swap`
- Nur Latin und Latin-Extended (Umlaute)
- **Lizenz vor dem Einbinden prüfen und im Repo dokumentieren.** Ich habe den
  aktuellen Lizenzstand beider Schriften nicht verifiziert. Ist eine davon nicht
  frei nutzbar, melden statt ersetzen.

### 3.4 Skala

| Rolle | Familie | Grösse | Gewicht | Zeilenhöhe |
|---|---|---|---|---|
| Wortmarke | mono | 15px | 500 | 1.2 |
| Navigation | mono | 14px | 400 | 1.2 |
| Serientitel Startseite | mono | 14px | 400 | 1.4 |
| Jahr | mono | 14px | 400, `--farbe-text-leise` | 1.4 |
| Serientitel Serienseite | mono | 22px | 400 | 1.3 |
| Fliesstext | text | 16px | 400 | 1.6 |
| Fusszeile, Meta | mono | 12px | 400, `--farbe-text-leise` | 1.5 |

Monospace läuft optisch grösser als eine Grotesk gleicher Punktgrösse. Die Werte
oben sind bereits entsprechend abgesenkt — nicht nachträglich hochziehen.

Kein Wert dazwischen, keine `clamp()`-Fluid-Typografie. Auf Mobile bleiben alle
Grössen gleich, ausser Serientitel Serienseite: dort 19px.

**Verboten:** Schnitt 600 und 700, Kursiv, Versalien, `text-transform`, negatives
`letter-spacing`, Ligaturen in der Monospace (`font-variant-ligatures: none`).

### 3.5 Zeilenlänge

Jeder Fliesstext ist auf `max-width: 60ch` begrenzt und **linksbündig**. Zentrierter
Fliesstext ist der häufigste Fehler auf Fotografen-Seiten und wird hier nicht gemacht.

---

## 4. Raster und Abstände

```css
--container:  1280px;
--rand:       clamp(24px, 6vw, 96px);
```

Abstandsskala, ausschliesslich Vielfache von 8:
`8 16 24 32 48 64 96 128`

Vertikale Abstände zwischen grossen Blöcken werden in `vh` gesetzt, damit der
Rhythmus auf jedem Bildschirm gleich atmet. Alle anderen Abstände in `px`.

Die Ränder bleiben grosszügig. Der weisse Hintergrund wurde bewusst gewählt, damit
die Bilder wie Prints an einer Wand hängen — eine dichte Kontaktbogen-Packung würde
diese Entscheidung wieder aufheben.

**Breakpoint:** genau einer, bei `768px`. Keine weiteren.

---

## 5. Bildregeln

Der wichtigste Abschnitt dieser Spezifikation.

### 5.1 Normierung auf Serienseiten

Das Bildmaterial ist formatgemischt (hoch und quer). Werden alle Bilder auf gleiche
*Breite* skaliert, wirkt ein Hochformat rund doppelt so gross wie ein Querformat und
der Scrollrhythmus bricht.

Deshalb Normierung über die Höhe:

```css
.serie-bild {
  max-height: 78vh;
  width: auto;
  max-width: 100%;
  margin-inline: auto;
  display: block;
}

@media (max-width: 768px) {
  .serie-bild {
    max-height: none;
    width: 100%;
  }
}
```

Auf Mobile kippt die Regel auf volle Breite — ein Querformat bei 78vh Höhe wäre auf
einem Telefon ein Briefmarkenstreifen.

### 5.2 Vorschaubilder auf der Startseite

Alle Serien-Vorschaubilder werden auf **3:2 quer** zugeschnitten und über die volle
Containerbreite ausgegeben. Ohne einheitliches Verhältnis wackelt die vertikale Liste.

Das Vorschaubild wird pro Serie **explizit im Frontmatter benannt** (`titelbild`).
Nicht automatisch das erste Bild der Serie nehmen.

### 5.3 Schwarzweiss und Korn — Verarbeitung

Die Bilder kommen bereits schwarzweiss und gekörnt aus der Entwicklung. Die Website
verändert sie nicht.

- **Keine CSS-Filter.** Kein `filter: grayscale()`, kein `contrast()`, kein
  `sepia()`. Wenn ein Bild farbig ausgeliefert wird, ist die Quelldatei falsch, nicht
  das Stylesheet.
- **Kein Korn-Overlay über der Seite oder über den Bildern.** Auf Material, das
  bereits Korn hat, ergibt das Matsch statt Textur.
- **Monochrom kodieren.** AVIF und WebP können Bilder ohne Chroma-Kanäle speichern.
  Das spart bei Schwarzweiss spürbar Dateigrösse und kostet nichts. Prüfen, ob die
  eingesetzte Pipeline das ausgibt, und das Ergebnis berichten.

**Der Zielkonflikt, den Claude Code kennen muss:** Korn ist hochfrequentes Rauschen —
genau das, was verlustbehaftete Codecs zuerst wegwerfen. Zu aggressive Kompression
bügelt die Bilder glatt und zerstört das, was ihre Wirkung ausmacht.

Deshalb gilt hier: **Bildwirkung vor Dateigrösse.** Die Qualitätsstufen werden an
einem echten körnigen Testbild kalibriert, nicht am Standardwert der Bibliothek.
Ausgangspunkt AVIF Qualität 65 und WebP Qualität 80, dann nach Sichtprüfung
anpassen — und den gewählten Wert samt Begründung im Repo dokumentieren.

AVIF beherrscht theoretisch synthetische Korn-Rekonstruktion (film grain synthesis),
womit sich stark komprimieren und das Korn im Decoder wiederherstellen liesse. Ob die
Astro-Toolchain das unterstützt, habe ich **nicht verifiziert**. Vor der Umsetzung
prüfen und den Befund berichten — nicht annehmen, dass es funktioniert.

### 5.4 Technische Verarbeitung

- Quelldateien unter `src/assets/serien/<slug>/`, lange Kante 2400px, Graustufen,
  IPTC-Copyright eingebettet (macht der Fotograf beim Export)
- Ausgabeformate: AVIF und WebP, JPEG als Fallback
- Breiten für `srcset`: `640, 960, 1280, 1600, 2000`
- `loading="lazy"` und `decoding="async"` auf allen Bildern **ausser** dem ersten
  Bild der Startseite — das bekommt `loading="eager"` und `fetchpriority="high"`
- Jedes Bild braucht `width` und `height` im Markup, damit kein Layout-Shift entsteht

### 5.5 Budget

Wegen des Korns bewusst höher angesetzt als bei einem gewöhnlichen Portfolio:

- Kein ausgeliefertes Bild über **700 KB**
- Erste sichtbare Bildschirmfläche unter **1.2 MB** gesamt
- LCP unter **2.0 s** auf einer simulierten 4G-Verbindung
- CLS unter 0.05

Wird ein Budget gerissen, ist die Antwort **nicht** stärkere Kompression, sondern
eine kleinere Ausgangsauflösung. Reissen die Werte weiterhin: melden, nicht
stillschweigend die Qualität senken.

---

## 6. Seiten

Sechs Seiten. Keine weiteren.

### 6.1 Startseite `/`

> **Überholt.** Die Kopfzeile trägt **keine Wortmarke** und ist **sticky**; sie
> zeigt nur Portfolio und About me plus den Modus-Umschalter. Der Name steht
> ausschliesslich in den Metadaten (Abschnitt 10). Der Block unten ist der alte
> Entwurfsstand und bleibt nur als Historie stehen.

```
Header (80px hoch)
  links:  TODO_NAME, mono 15px/500
  rechts: Serien · Über · Kontakt, mono 14px
  statisch, nicht sticky
  Abstand nach unten: 48px

Für jede Serie:
  Bild 3:2, volle Containerbreite, verlinkt auf die Serienseite
  32px Abstand
  Serientitel (mono), darunter Jahr in --farbe-text-leise
  Abstand zur nächsten Serie: 15vh

Nach der letzten Serie: 15vh

Fusszeile
  1px Linie in --farbe-linie darüber, 32px Abstand danach
  Mail · Instagram · Impressum · Datenschutz, mono 12px
  © TODO_NAME, aktuelles Jahr
  64px Abstand nach unten
```

Kein Intro-Text, kein Hero-Slogan, keine Selbstbeschreibung auf der Startseite. Das
erste sichtbare Element unter dem Header ist ein Bild.

**Sticky ist ausdrücklich ausgeschlossen.** Eine mitscrollende Leiste liegt auf einer
weissen Fotoseite permanent über jedem Bild.

### 6.2 Serienseite `/serien/<slug>`

```
Header
64px

Serientitel, mono 22px
16px
Jahr, mono, --farbe-text-leise
32px
Einleitungstext, Grotesk, 2–4 Sätze, max-width 60ch, linksbündig
12vh

Bilder, eines nach dem anderen, normiert nach 5.1
Abstand zwischen Bildern: 12vh   (Mobile: 48px)
Keine Bildunterschriften, keine Bildnummern

12vh
„Nächste Serie: <Titel> →"   — mono, zyklisch, die letzte verweist auf die erste
Fusszeile
```

Kein Lightbox, kein Klick-zum-Vergrössern, keine Bildzähler, keine Pfeilnavigation,
keine laufende Nummerierung. Das Bild ist bereits so gross wie sinnvoll.

### 6.3 `/ueber`

Zweispaltig ab 768px: links Text (Grotesk, 60ch), rechts Portrait. Darunter nichts.
Unter 768px: Portrait oben, Text darunter.

### 6.4 `/kontakt`

Mailadresse als `mailto:`-Link, Instagram-Handle, optional ein Satz zur
Verfügbarkeit. Kein Formular.

### 6.5 `/impressum` und `/datenschutz`

Reine Textseiten, gleiches Textlayout wie `/ueber`, einspaltig.

Inhaltliche Anforderung (Schweiz, revidiertes DSG): Es wird eine
Datenschutzerklärung benötigt, sobald Personendaten bearbeitet werden — Server-Logs
des Hosters zählen dazu. Ein Impressum ist für eine reine Portfolioseite rechtlich
nicht zwingend, aber üblich.

**Diese Texte werden nicht von Claude Code generiert.** Platzhalter anlegen, Inhalt
liefert der Betreiber.

### 6.6 `/404`

Ein Satz, ein Link zurück zur Startseite. Gleiche Kopf- und Fusszeile.

---

## 7. Content-Modell

Eine Collection: `serien`. Eine Markdown-Datei je Serie unter `src/content/serien/`.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const serien = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    titel: z.string(),
    jahr: z.number().int(),
    reihenfolge: z.number().int(),          // Sortierung auf der Startseite
    titelbild: image(),
    titelbildAlt: z.string(),
    bilder: z.array(z.object({
      datei: image(),
      alt: z.string(),
    })).min(1),
  }),
});

export const collections = { serien };
```

Der Markdown-Körper ist der Einleitungstext der Serienseite.

Sortierung auf der Startseite: nach `reihenfolge` aufsteigend. Nicht nach Jahr,
nicht alphabetisch — die Reihenfolge ist eine kuratorische Entscheidung.

---

## 8. CMS

Sveltia CMS unter `/admin`, konfiguriert gegen die Collection aus Abschnitt 7.
Bild-Upload nach `src/assets/serien/<slug>/`.

**Bekannte Hürde:** Der GitHub-Backend braucht einen OAuth-Vermittler; Sveltia stellt
dafür einen Cloudflare-Worker bereit. Das ist der einzige fummelige Schritt im ganzen
Projekt. Ich habe den aktuellen Stand dieses Workers nicht verifiziert — vor der
Umsetzung die aktuelle Sveltia-Dokumentation prüfen und, falls sich das Verfahren
geändert hat, melden statt improvisieren.

Fällt das CMS aus irgendeinem Grund weg, bleibt das Projekt voll funktionsfähig:
Serien lassen sich per Markdown-Datei und Commit pflegen. Das CMS ist Komfort,
keine Abhängigkeit.

---

## 9. Barrierefreiheit

- Ein `<h1>` je Seite. Überschriftenebenen nicht überspringen
- Sichtbarer Fokusring: `outline: 2px solid var(--farbe-text); outline-offset: 3px`
- Skip-Link zum Hauptinhalt
- `prefers-reduced-motion` respektieren (aktuell existiert keine Animation — die
  Regel gilt trotzdem für künftige Ergänzungen)
- Kontrast: `#767676` auf Weiss ergibt 4.6:1, ausreichend für Fliesstext. Nicht
  weiter aufhellen
- `lang="de"` auf `<html>`
- Alt-Texte beschreiben das Bild, nicht die Technik. „Frau am Fenster, Gegenlicht"
  ist ein Alt-Text. „Schwarzweiss, körnig, analog" ist keiner

---

## 10. Meta und SEO

- Sprechender `<title>` je Seite, endet auf den Namen: `nicolas huwyler - portfolio`
  (Startseite nur der Name; Unterseiten davor der Seitenname, z. B.
  `About me — nicolas huwyler - portfolio`). Die Farb-Startseite lässt das führende
  „Portfolio" weg, weil das Wort schon im Namen steckt.
- `meta description` je Serie aus dem Einleitungstext
- Open-Graph-Bild je Serie: das Titelbild, auf 1200×630 zugeschnitten
- `sitemap.xml` und `robots.txt` generieren
- `JSON-LD` vom Typ `Person` auf `/ueber`
- Favicon als SVG, dazu ein 180×180 PNG für iOS

Keine Keyword-Optimierung, keine versteckten Textblöcke, kein Blog „für SEO".

---

## 11. Deployment

- Repository auf GitHub, Branch `main` ist produktiv
- **GitHub Pages** baut bei jedem Push auf `main` — und zusätzlich `feature` nach
  `/feature` als Vorschau, beides in einem Artefakt
  (`.github/workflows/deploy.yml`). Die frühere Angabe „Cloudflare Pages" ist
  überholt.
- Build: `npm run build`, Ausgabeverzeichnis `dist`
- Domain **`hey.hu-wy.ch`** — steht in `astro.config.mjs` (`site`) und in
  `public/CNAME`, ist aufgeschaltet und in Betrieb.
  Offen: ob die nackte Domain `hu-wy.ch` und `www` einmal darauf umleiten sollen.
- HTTPS erzwingen, HSTS aktiv

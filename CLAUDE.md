# CLAUDE.md

Kontextdatei für Claude Code. Vor jeder Aufgabe lesen. Verbindlich.

---

## 1. Was hier gebaut wird

Ein Fotografie-Portfolio. Eine Person, drei Bildserien, rund 30 Bilder. Statische
Website, deutschsprachig, keine Anwendungslogik.

**Das einzige Ziel der Seite:** Besucher sehen die Bilder gross, schnell und ohne
Ablenkung. Sonst nichts.

> **Nachträgliche Entscheidung des Betreibers:** Kopf- und Fusszeile sind
> **entfernt**, ebenso die Seiten Über, Kontakt, Impressum und Datenschutz sowie
> Mail-/Instagram-Links. Die Seite besteht nur noch aus der Startseite (Liste der
> Serien-Titelbilder, direkt anklickbar) und den Serienseiten. Die Abschnitte zu
> Header, Fusszeile und diesen Seiten in `docs/01-spezifikation.md` (v. a. 6.1,
> 6.3–6.5, 3.4) und im Build-Plan sind dadurch überholt.
>
> **Zugangs-Tor (Platzhalter):** Vor der Seite liegt ein clientseitiges Passwort-Tor
> (zweite bewusste Client-JS-Ausnahme neben dem Cursor). Es ist **kein echter
> Schutz** — auf einer statischen Seite bleiben die Bilder unter ihren URLs
> öffentlich abrufbar. Details und der Weg zu echtem Schutz: `docs/zugang.md`.

### Nicht-Ziele

Diese Dinge werden **nicht** gebaut. Nicht vorschlagen, nicht vorbereiten, keine
Platzhalter dafür anlegen:

- Shop, Warenkorb, Preisliste, Print-Verkauf
- Kundengalerien, Login, Passwortschutz
- Blog, News, Tagebuch
- Kontaktformular (bewusste Entscheidung — es gibt kein Backend)
- Newsletter, Analytics, Cookie-Banner, Consent-Manager
- Mehrsprachigkeit, i18n-Setup, Sprachumschalter
- Dark Mode
- Suche, Filter, Tags, Kategorien
- Korn-/Rausch-/Textur-Overlay über den **Bildern** (der körnige, dunkle
  **Hintergrund** ist dagegen gewollt — siehe Abschnitt 1a)
- Filmrand-Grafik, Sprocket-Löcher, Scan-Artefakte, Vignetten, Polaroid-Rahmen
- Laufende Bildnummern, Indizes, Kontaktbogen-Ansicht

---

## 1a. Künstlerische Richtung (Mood)

Verbindliche Stimmung für **alles**, was wir umsetzen — Bildauswahl, Interaktion,
Typografie, spätere Gestaltung. Sehr künstlerisch, düster, roh. Referenz:
**KEEMO** (OG, düster, hart, kompromisslos). Nicht clean und gefällig, sondern
kantig, roh und schwer.

**Schlagwörter:** grain, dark, rough, raw, industrial, techno, old school, heavy.

Konkret:

- **Bilder** tragen den Ton: schwarzweiss, körnig (grain), rau — nicht geglättet,
  nicht geschönt.
- **Interaktion** unterstreicht ihn: invertierender Cursor, invertierter
  Touch-Schweif, harte Schwarzweiss-Umkehr statt weicher, gefälliger Effekte.
- **Typografie**: Monospace als kantiger, technischer, „old school"-Bruch.
- **Nichts Dekoratives, nichts Liebliches.** Reduktion, Härte, Rohheit,
  industrielle/techno Kälte.

**Gilt ausdrücklich NICHT für die Bilder.** Die Mood-/Stil-Vorgaben beschreiben
Seite und Interaktion, **nicht** die Fotos. Die Bilder sind die eigenen, vom
Betreiber **vor dem Hochladen selbst bearbeiteten Originale** und werden
**unverändert** übernommen — kein Effekt, kein Filter, keine Stil-Verarbeitung,
kein Korn-Overlay, keine Anpassung an die Mood. Einzige, bewusst gewollte und nur
**temporäre** Ausnahme: die interaktive Invertierung unter Cursor/Touch
(Abschnitt 4a). Damit die dunklen, körnigen Bilder sich vom Hintergrund abheben,
liegt ein **weisser Rahmen (Passepartout)** um jedes Bild — der Rahmen ist Chrome
*um* das Bild, kein Eingriff *in* den Bildinhalt (auch kein Polaroid-/Filmrand,
der bleibt Nicht-Ziel).

> **Entscheidung getroffen — die Seite geht dunkel.** Hintergrund ist
> **near-black mit kräftigem Korn** (`public/korn.png` + dezente Vignette,
> `global.css body::before`), Text hell, Bilder mit **weissem Passepartout**.
> Damit ist die frühere „weiss, ruhig"-Doktrin (Spezifikation 1, Regel 6)
> überholt. Auch der Nicht-Ziel-Punkt „Korn-/Textur-Overlay" ist bewusst
> aufgehoben — **aber nur für den Hintergrund**. Über die **Bilder** kommt
> weiterhin kein Korn: sie liegen mit weissem Rahmen darüber und bleiben
> unangetastet.

---

## 2. Offene Punkte

Diese Werte fehlen. Überall `TODO:` als Platzhalter verwenden und beim ersten
Auftreten einmal nachfragen — nicht erfinden, nicht raten:

| Platzhalter | Bedeutung |
|---|---|
| `TODO_NAME` | Name der Fotografin / des Fotografen, Wortmarke im Header |
| `TODO_DOMAIN` | Die bereits registrierte Domain |
| `TODO_MAIL` | Kontakt-Mailadresse |
| `TODO_SERIEN` | Titel und Jahr der Serien |

---

## 3. Stack

| | | Begründung |
|---|---|---|
| Framework | Astro (aktuelle stabile Version) | Statisch, kein Client-JS nötig, Bild-Pipeline eingebaut |
| Sprache | TypeScript, `strict` | |
| Styling | Vanilla CSS mit Custom Properties | Bei sechs Seiten ist ein Utility-Framework nur Konfigurationsaufwand |
| Content | Astro Content Collections, Markdown | |
| Bilder | `astro:assets` | |
| CMS | Sveltia CMS | Git-basiert, kein Backend, Browser-Oberfläche |
| Hosting | Cloudflare Pages, Build aus GitHub | |

**Falls eine dieser Entscheidungen im Weg steht:** melden und begründen, nicht
eigenmächtig ersetzen.

---

## 4. Harte Regeln

1. **Keine neue Dependency ohne Rückfrage.** Ausnahmen: nichts. Auch keine
   Utility-Bibliothek, kein Icon-Paket, kein Animationsframework, kein Lightbox-Plugin.
2. **Kein React, Vue, Svelte, Solid, keine Astro-Islands.** Die ausgelieferte Seite
   enthält grundsätzlich kein clientseitiges JavaScript. **Einzige erlaubte Ausnahme:**
   ein einzelnes, framework-freies Vanilla-Skript für den invertierten Cursor
   (Abschnitt 4a). Es ist reine Progressive Enhancement — ohne JavaScript funktioniert
   die Seite vollständig und unverändert.
3. **Jedes Bild läuft über `astro:assets`.** Nie ein rohes `<img src="/foto.jpg">`.
4. **Alt-Text ist optional (Entscheidung des Betreibers).** Das `alt`-Feld ist
   **kein Pflichtfeld** mehr — weder im CMS noch im Schema. Ist es gefüllt, wird der
   Text als `alt` ausgegeben; ist es leer, rendert das Bild mit `alt=""`. Jedes Bild
   trägt also weiterhin ein `alt`-Attribut (nie gar keins), aber der Inhalt darf
   leer bleiben. Das lockert bewusst die frühere Doktrin („jedes Bild braucht einen
   gefüllten Alt-Text") zugunsten von Aufwand/Flexibilität beim Upload; der
   Zugänglichkeits-Nachteil (fehlende Bildbeschreibung für Screenreader) ist dem
   Betreiber bekannt und in Kauf genommen.
5. **Keine dauerhaften Effekte auf dem Bildinhalt — eine Ausnahme.** Kein Hover-Zoom,
   kein Schatten, kein `border-radius`, kein Ken-Burns-Effekt, kein Fade-in
   beim Scrollen, kein dauerhafter Filter (`grayscale()`, `contrast()`, `sepia()`) —
   die Bilder sind bereits so, wie der Betreiber sie hochlädt. (Der weisse
   Passepartout-Rahmen aus Abschnitt 1a ist gewollt: er umschliesst das Bild, ohne
   den Bildinhalt anzutasten.) **Einzige Ausnahme:** Beim Hovern invertiert
   das Bild unter dem Zeiger kurzzeitig (`filter: invert(1)`) als Teil des
   Cursor-Effekts (Abschnitt 4a). Nur mit JavaScript und feinem Zeiger; ohne
   JavaScript bleiben die Bilder unangetastet. Die Invertierung ist bewusst und
   temporär — kein dauerhafter Farbstich.
6. **Der raue Ton kommt aus den Bildern, nicht aus dem Layout.** Die Seite ist
   weiss, ruhig und diszipliniert. Der einzige gestalterische Bruch ist die
   Monospace für Beschriftungen (Spezifikation 3.1). Diesen Bruch nicht an weiteren
   Stellen wiederholen und nicht durch Texturen, Rahmen oder Effekte verstärken.
7. **Keine Werte hardcoden, die in `tokens.css` stehen.** Immer die Custom Property.
8. **Sentence case in allen Beschriftungen.** Kein Title Case, kein ALL CAPS, kein
   `letter-spacing`-Tuning.
9. **Keine Bilder oder Texte erfinden.** Platzhalterbilder in Phase 1–3 sind graue
   Flächen mit korrektem Seitenverhältnis, keine Stockfotos, keine generierten Bilder.
10. **Kein Rechtsklick-Blocker, kein `user-select: none`, kein Wasserzeichen-Overlay.**
11. **Bildwirkung vor Dateigrösse.** Wird ein Performance-Budget gerissen, ist die
    Antwort eine kleinere Ausgangsauflösung, niemals stärkere Kompression.

---

## 4a. Invertierter Cursor (bewusste Ausnahme)

Bewusste Entscheidung des Betreibers, die Doktrin aus Regel 2 punktuell zu lockern.
Der invertierte Cursor ist die **einzige** erlaubte Stelle mit clientseitigem
JavaScript. Er ist eine Zutat, kein Fundament — alles andere bleibt wie gehabt.

**Was gebaut wird**

- Ein kleiner Kreis folgt dem Zeiger mit weichem Nachlauf und ersetzt ihn.
  `mix-blend-mode: difference` invertiert ihn gegen den Untergrund (schwarz auf
  Weiss, weiss auf Dunkel).
- Interaktive Elemente (Links, Navigation) invertieren beim Hover ihre Farben —
  das ist reines CSS und funktioniert auch ohne JavaScript. Der Cursor vergrössert
  sich zusätzlich über ihnen.
- Über Fotos schrumpft der Ball zu einem kleinen Punkt, und das Bild unter dem
  Zeiger invertiert kurz (`filter: invert(1)`) — angelehnt an die Referenzseite.
- Auf Touch-Geräten (kein Cursor) invertiert die Berührung den Untergrund: eine
  transparente Schicht mit `backdrop-filter: invert(1)` (keine Füllfarbe), per
  Maske als **hart abgegrenzter Kreis** freigegeben, der mit der Bewegung zur
  Kapsel wird (länger mit der Bewegung) und beim Stoppen hart zurückweicht —
  kein weicher Verlauf, kein Verblassen (raw/industrial).

**Guardrails (verbindlich)**

- **Progressive Enhancement.** Ohne JavaScript ist die Seite vollständig und
  unverändert bedienbar; der Cursor ist optional. Kein Framework, keine Astro-Island —
  ein einzelnes Vanilla-Skript, das das Element selbst erzeugt.
- **Über Fotos** (Regel 5, Ausnahme): der grosse Ball schrumpft zu einem kleinen
  Punkt, das Bild unter dem Zeiger invertiert kurz (`filter: invert(1)`). Nur mit
  JavaScript und feinem Zeiger — ohne JavaScript bleiben die Bilder unangetastet.
- **Nur bei feinem Zeiger** (`pointer: fine`). Auf Touch-Geräten passiert nichts,
  der native Zeiger wird dort nie versteckt.
- **`prefers-reduced-motion`:** kein Nachlauf/Lerp, der Cursor folgt sofort.
- Regel 10 bleibt: kein `user-select: none`, kein Rechtsklick-Blocker.
- Der native Zeiger wird nur versteckt, solange JavaScript aktiv und der Zeiger fein
  ist.

---

## 5. Konventionen

```
src/
  content/
    serien/            eine Markdown-Datei pro Serie
  assets/
    serien/<slug>/     Bilder der Serie, von astro:assets verarbeitet
  components/
  layouts/
  pages/
  styles/
    tokens.css         alle Custom Properties, einzige Quelle für Werte
    global.css         Reset, Basistypografie
public/
  admin/               Sveltia CMS
docs/
```

- Dateinamen und Slugs: `kebab-case`, keine Umlaute, keine Leerzeichen
- Komponentenstile bleiben in der `.astro`-Datei (Astro scoped styles). Global nur,
  was wirklich global ist.
- Commits auf Deutsch, imperativ, eine Sache pro Commit

---

## 6. Definition of done

Eine Aufgabe gilt erst als erledigt, wenn **alle** Punkte erfüllt sind:

- [ ] `npm run build` läuft ohne Fehler und ohne Warnungen
- [ ] `npx astro check` ist sauber
- [ ] Auf 375px Breite und auf 1440px Breite geprüft, kein horizontaler Scroll
- [ ] Tastaturbedienung möglich, Fokus sichtbar
- [ ] Kein Element ohne Custom Property gestylt, wo eine existiert
- [ ] Die Abnahmekriterien der jeweiligen Phase aus `docs/02-build-plan.md` sind erfüllt

---

## 7. Arbeitsweise

- Eine Phase aus `docs/02-build-plan.md` pro Durchgang. Nicht vorgreifen.
- Vor dem Schreiben von Code: `docs/01-spezifikation.md` zum betroffenen Bereich lesen.
- Bei Widerspruch zwischen dieser Datei und der Spezifikation: **diese Datei gewinnt**,
  und den Widerspruch melden.
- Bei Unklarheit: fragen. Keine Annahme treffen und weiterbauen.

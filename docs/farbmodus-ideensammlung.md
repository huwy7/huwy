# Ideensammlung & Checkliste — düstere Seite + farbige Seite

> Status: **nur Ideensammlung.** Noch nichts umgesetzt. Diese Datei sammelt alles,
> was besprochen wurde, und dient später als Abarbeitungs-Checkliste.
>
> **Bewusst getrennt in drei Teile — damit keine Funktion vermischt oder am
> falschen Ort eingebaut wird:**
> - **Teil A — Gemeinsam** (gilt für beide Modi)
> - **Teil B — Düstere Seite** (Schwarzweiss, Standard)
> - **Teil C — Farbige Seite** (Farbmodus, Unterseite)

---

## Überblick

Zwei Modi derselben Website:

- **Düster (Standard):** Schwarzweiss, dunkel, raw. Die Hauptseite.
- **Farbig (Unterseite):** getrennter Bereich, retro/vintage/warm, eigener
  Upload-Bereich. Erreichbar über einen Umschalt-Button oben rechts.

**Neuer Leitgedanke für BEIDE Modi:** **kein Untermenü mehr.** Man klickt keine
Serie mehr an, um eine Ebene tiefer zu gehen. Stattdessen laufen/rotieren die
Bilder **direkt auf der Hauptseite** — durchschalten (vor/zurück) und evtl.
automatisches Weiterschalten. Alles auf **einer Ebene**, kein Vor-/Zurückspringen.

## Umsetzungsstand

- **Stufe 1 — erledigt (live):** Modus-abhängiges Layout, **Umschalt-Button**
  (spanisch) in beide Richtungen, **gespiegelte, englische Kopfzeile**
  (`Portfolio`, `About me`/`More about me`), Routen **`/color`** + `/color/ueber-mich`,
  Farbmodus-**Platzhalter-Theme** (warmes Dunkel, kein Hund-Blur). Düstere Seite
  läuft unverändert weiter.
- **Stufe 2 — erledigt (live):** CMS-Sammlung **`farbserien`** (getrennter
  Upload-Bereich in `/admin`, gleiche Felder wie die Schwarzweiss-Serien),
  Content-Collection + gemeinsames Schema, Platzhalter-Farbserien.
- **Stufe 3 — erledigt (live):** **Karussell** im Farbmodus. Jede Farbserie liegt
  als inline scroll-snap-Streifen direkt auf `/color` (gestapelt, neueste oben,
  kein Untermenü). Blättern per Pfeil links/rechts (endlos, reines CSS). Klick aufs
  sichtbare Bild öffnet die **Vollbild-Ansicht** (weiss), dort links/rechts blättern
  (endlos), Schliessen nur über **✕** (weisse Flächen = blättern). Alles reines CSS
  (`:target` + scroll-snap), kein JavaScript.
- **Stufe 4 — erledigt (live):** Düstere Startseite auf dasselbe **Karussell**
  umgestellt. Untermenüs (`/serien/[slug]`) raus, Serien gestapelt inline (neueste
  oben), Titelbild = erstes Serienbild (einmal). „Nächste Serie"-Navigation und
  Vorlade-Mechanismus (`bildVorladen`) entfernt.
- **Nächste Stufe (offen):** (5) finaler warmer/verwaschener Look aus dem eigenen
  Bild des Betreibers — braucht ein Bild vom Betreiber.

---

# Teil A — Gemeinsam (beide Modi)

## A1. Steht fest

- [x] **Passwort-Tor gilt für beide Modi** — einmal im Besuch entsperrt, beides offen.
- [x] **Kopfzeile gespiegelt** je Modus (Details A2b): düster = Menü **links**,
      Umschalt-Button **rechts**; farbig = Menü **rechts**, Umschalt-Button **links**.
- [x] **Sprache:** nur die **Umschalt-Buttons spanisch**; der Rest **englisch** —
      `Portfolio`, `About me` (düster), `More about me` (farbig).
- [x] **Eigenes „About me" pro Modus** mit **anderem Inhalt** (düster:
      künstlerisch/Musik; farbig: z. B. Reisen/Sport). Kein geteiltes About.
- [x] **Route Farbmodus:** `/color` (einheitlich gehalten).
- [x] **Kein Untermenü / keine Serie zum Anklicken.** Aber: **Serien bleiben**,
      untereinander gestapelt; **pro Serie** die Bilder direkt durchschalten (A3/B2).

## A2. Umschalt-Button (Beschriftung)

Verspielter, augenzwinkernder **spanischer** Ton. Erste Ideen:

- **Hin zur Farbe / Sonne** (auf der düsteren Seite, oben rechts):
  - `¿A quién le gusta el sol?` — „Wer mag die Sonne?"
  - `Me gusta el sol` — „Ich mag die Sonne"
  - kurz: `El sol`
- **Zurück zur Nacht / dunkel** (auf der farbigen Seite, oben rechts):
  - `A mí me gusta la noche` — „*Ich* mag die Nacht"
  - `Me gusta la noche` — „Ich mag die Nacht"
  - kurz: `La noche`

Offen: finale Formulierung, Länge (Satz vs. kurz), Stil/Platzierung. Nur diese
Umschalt-Buttons sind spanisch; alle übrigen Beschriftungen englisch (A2b).

## A2b. Kopfzeilen-Layout (gespiegelt) + Sprache

Die Kopfzeile ist zwischen den Modi **gespiegelt**:

- **Düstere Seite:** Menü **links** — `Portfolio`, dann `About me`. Umschalt-Button
  **oben rechts**, spanisch (→ Farbe, z. B. „¿A quién le gusta el sol?").
- **Farbige Seite:** Menü **rechts** — von der Mitte nach aussen `More about me`,
  dann `Portfolio` ganz rechts (Spiegelbild). Umschalt-Button **oben links**,
  spanisch (→ zurück in den düsteren Modus, z. B. „A mí me gusta la noche").

**Sprache:** Menü/Beschriftungen **englisch** (`Portfolio`, `About me`,
`More about me`), nur die Modus-**Umschalt-Buttons spanisch**. Das About heisst
düster **`About me`**, farbig **`More about me`** — damit klar ist, dass es dort
**zusätzliche** Dinge gibt. `Portfolio` führt zur jeweiligen Bild-Hauptseite, das
About zum modus-eigenen.

Hinweis: die heutige deutsche Navigation (`Über mich`) wird beim Umbau auf Englisch
umgestellt.

## A3. Bild-Weiterschaltung statt Untermenü (Karussell) — für BEIDE Modi

Kernwunsch: Bilder **direkt auf der Hauptseite** durchschalten, keine Unterseite.

### Hauptseite (Karussell)

- [ ] **Manuell weiter/zurück** (Pfeile, Wischen/Swipe, Klick auf Bildrand).
- [x] **Kein automatisches Weiterschalten für v1** — bewusst simpel gehalten, nur
      manuell. Auto-Weiterschalten kann später nachgerüstet werden.
- [x] **Gruppierung: nach Serien** (kein durchgehender Fluss). Serien untereinander
      gestapelt, **neuste zuoberst**, ältere weiter unten. Man scrollt runter durch
      die Serien; **pro Serie** ist ein **inline-Karussell** (Bilder in-place
      durchschalten), statt die Serie anzuklicken.
- [x] **Technik: reines CSS** (scroll-snap, No-JS) fürs manuelle Durchschalten —
      kein neues JavaScript (Auto-Modus ist raus, siehe oben).

### Vollbild-Ansicht (Lightbox) — bleibt, jetzt mit Blättern

- [x] **Vollbild bleibt.** Das gerade sichtbare Foto ist **anklickbar** und öffnet
      wie bisher die Vollbild-Ansicht (weisse Fläche, Konzentration aufs Bild).
- [x] In der Vollbild-Ansicht **nach links/rechts weiterschalten** (vor/zurück).
- [x] Vollbild schaltet **nur von Hand** — **kein** automatisches Weiterschalten.
- [x] **Endlos durchschaltbar** — vor und zurück ohne Ende (Loop).
- [x] **Schliessen nur über ✕** (oben rechts) → zurück zur Hauptseite (Portfolio).
- [x] **Weisse Fläche links = zurück, rechts = weiter** (Blättern). Die Fläche
      schliesst **nicht** mehr — sie ist zum Durchschalten da.
- [x] **Technik: reines CSS via `:target`, kein neues JS** (manuelles Blättern, wie
      die heutige Vollbild-Ansicht).

> Hinweis: Mit dem Karussell entfallen die heutigen Serien-**Unterseiten**
> (`/serien/<slug>`) samt „Nächste Serie" und dem Bilder-Vorlade-Mechanismus.
> Die Vollbild-Ansicht mit Links/Rechts-Blättern ersetzt das Durchsehen einer Serie.

## A4. Sonstiges gemeinsam

- [x] **„Über mich" pro Modus** (entschieden, siehe A1) — je eigener Inhalt.
- [ ] **Cursor/Touch-Invert** in beiden Modi gleich (invertiert einfach den Grund).
- [ ] **Weicher Überblend-Effekt beim Umschalten?** (View Transitions = etwas
      Client-JS) — für v1 eher harter Seitenwechsel, später möglich.
- [ ] Bilder bleiben **unangetastet** (keine Filter aufs Bild) — in beiden Modi.
- [ ] Definition of done je Umsetzung: 375px & 1440px, kein H-Scroll,
      Fokus/Tastatur, Kontrast, `astro check` + `npm run build` sauber.

---

# Teil B — Düstere Seite (Schwarzweiss, Standard)

## B1. Optik / Mood — bleibt

- [x] **Düster, dunkel, raw** bleibt der Standard (near-black Grund, Grain, ruhiges
      Weiss als Passepartout). **Nicht** anfassen beim Farbmodus-Bau.
- [x] **Verwischter Hund-Hintergrund** ~10% sichtbarer (Helligkeit/Kontrast) für mehr
      S/W-Dynamik; **nur Hochkant** Richtung Schnauze (rechts) verschoben. Gilt
      **nur** für den Blur-Layer (`body::before`) — das **Sperrbildschirm-Bild**
      (`#tor`) hat keinen filter und bleibt scharf/unangetastet. (Umgesetzt.)

## B2. Umbau: kein Untermenü mehr, aber Serien bleiben (gestapelt)

Heute: Startseite zeigt Serien-Titelbilder → Klick öffnet die Serien-Unterseite.

Neu: **kein Klick in eine Serie**. Die **Serien bleiben** und liegen untereinander
(**neuste zuoberst**, ältere weiter unten — man scrollt runter). Aber **pro Serie**
schaltet man die Bilder **direkt/inline** durch (Karussell aus A3), ohne Unterseite.

- [x] Startseite düster: je Serie ein inline-Karussell, Serien untereinander,
      Sortierung neuste zuoberst (`reihenfolge`, 1 = zuoberst). (Umgesetzt.)
- [x] Serien-Unterseiten (`/serien/<slug>`) **entfernt**, ebenso die „Nächste
      Serie"-Navigation und der **Vorlade-Mechanismus** (`bildVorladen`): mit den
      Bildern direkt auf der Startseite wird nichts mehr vorab in eine Unterseite
      geladen. (Umgesetzt.)
- [x] Vollbild-Ansicht (Lightbox) ins Karussell eingepasst (A3): reines CSS,
      endloses Blättern, Schliessen nur über ✕. (Umgesetzt.)

## B3. „About me" (düster) — eigener Inhalt

- [ ] Künstlerisch/düster gehaltene Themen, z. B. **Musikgeschmack** u. Ä.
      (Gedanke, noch offen). Menü links, Label `About me`, führt zum düsteren About.

## B4. Offene Punkte düster

- [x] Auto-Weiterschalten: **raus für v1** (nur manuell, siehe A3).
- [x] Bildfluss **nach Serien gruppiert** (jede Serie ein eigenes Karussell,
      Serien gestapelt) — nicht durchgehend. (Umgesetzt.)

---

# Teil C — Farbige Seite (Farbmodus, Unterseite)

## C1. Steht fest

- [x] Farbmodus ist eine **Unterseite / eigener Bereich**, **unabhängig** vom
      düsteren Teil (eigene Galerie, eigener Inhalt).
- [x] **Getrennte Optik**.
- [x] **Eigener Upload-Bereich** für Farbfotos — **im selben CMS**, aber als
      **separate Sammlung** (nicht mit den S/W-Serien vermischt).
- [x] **Auch hier kein Untermenü** — Bilder direkt durchschalten/rotieren (A3).

## C2. Optik / Mood — Farbe

Stichworte: **Retro, Vintage, verwaschener Look, ruhige warme Farben (nicht
knallig), leichter Grain, sonnig.**

> **Vorgehen (entschieden):** Noch **nichts** an Palette/Grund bauen. Der Betreiber
> liefert ein **eigenes Bild**, das — wie beim düsteren Modus — **hinter Blur** als
> Hintergrund liegt und den warmen Grundton vorgibt. Palette danach vom Bild ableiten.

- [ ] Grund: **warm, verwaschen** (statt near-black) — sonnig, gedämpft, nicht grell.
- [ ] **Leichter Grain**, heller/wärmer abgestimmt als im düsteren Modus.
- [ ] **Gedämpfte, warme Palette** (creme/sand/sepia-nah), keine kräftigen Farben.
- [ ] Rahmen-Ton auf den warmen Grund abstimmen (nicht kaltes Weiss).
- [ ] Dezenter Vintage-/Verwaschen-Effekt im Hintergrund (nicht über den Fotos).
- [ ] Textfarbe/Kontrast auf warmem Grund prüfen.

## C3. Architektur / CMS

- [x] Route: **`/color`** (einheitlich gehalten).
- [x] Zweite Content-Sammlung `farbserien` (einfaches Schema wie heute:
      Titel, Jahr, Reihenfolge, Titelbild = erstes Bild, weitere Bilder). (Umgesetzt.)
- [x] Eigener Bildordner (`src/assets/farbserien/<slug>/`, Inhalt `src/content/farbserien/`). (Umgesetzt.)
- [x] CMS: zweite Sammlung „Farbserien" in `public/admin/config.yml`
      (separater Upload-Bereich, eigener Medienordner). (Umgesetzt.)
- [x] Farbmodus-Theme als eigener Scope/Mode-Klasse (`data-modus='farbe'`), damit
      der düstere Modus unberührt bleibt. (Umgesetzt.)
- [x] Menü **rechts** (gespiegelt), Umschalt-Button **oben links** (siehe A2b). (Umgesetzt.)

## C4. „More about me" (farbig) — eigener Inhalt

- [x] Label **`More about me`** (statt nur „About me") — signalisiert, dass es hier
      zusätzlichen Inhalt gibt. (Betreiber offen für Alternativen, vorerst so.)
- [ ] Themenmässig anders, z. B. **Reisen, Sport** u. Ä. (Gedanke, noch offen).
      Menü rechts, führt zum farbigen „More about me".
- [ ] Evtl. weitere Signale „hier gibt's mehr" (kleiner Hinweis/Zähler?) — optional,
      offen für Vorschläge.

## C5. Offene Punkte Farbe

- [ ] Genauer Grund-Ton + Palette (Muster/Prototyp nötig).
- [x] Karussell wie im düsteren Modus: **nur manuell**, kein Auto (siehe A3).

---

## Notizen / verworfene Ideen

- Verworfen: scroll-gesteuerter Hintergrund-Verlauf von S/W zu Farbe. Stattdessen
  **getrennter Modus per Button** (sauberer, düsterer Grund bleibt Standard).

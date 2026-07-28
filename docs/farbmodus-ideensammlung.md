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

---

# Teil A — Gemeinsam (beide Modi)

## A1. Steht fest

- [x] **Passwort-Tor gilt für beide Modi** — einmal im Besuch entsperrt, beides offen.
- [x] **Kopfzeile gespiegelt** je Modus (Details A2b): düster = Menü **links**,
      Umschalt-Button **rechts**; farbig = Menü **rechts**, Umschalt-Button **links**.
- [x] **Eigenes „Über mich" pro Modus** mit **anderem Inhalt** (düster:
      künstlerisch/Musik; farbig: z. B. Reisen/Sport). Kein geteiltes „Über mich".
- [x] **Kein Untermenü / keine Serie zum Anklicken** — in beiden Modi Bilder direkt
      auf der Hauptseite durchschalten (siehe A3).

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

Offen: finale Formulierung, Länge (Satz vs. kurz), Stil/Platzierung. Hinweis:
Sentence Case ist sonst Regel (Regel 8) — hier bewusst brechen oder anpassen.

## A2b. Kopfzeilen-Layout (gespiegelt)

Die Kopfzeile ist zwischen den Modi **gespiegelt**:

- **Düstere Seite:** Menü **links** — `Portfolio`, dann `Über mich`. Umschalt-Button
  **oben rechts** (→ Farbe, z. B. „¿A quién le gusta el sol?").
- **Farbige Seite:** Menü **rechts** — von der Mitte nach aussen `mehr über mich`,
  dann `Portfolio` ganz rechts (Spiegelbild). Umschalt-Button **oben links**
  (→ zurück in den düsteren Modus, z. B. „A mí me gusta la noche").

Das Menü bleibt in beiden Modi `Portfolio` + ein „Über mich", nur gespiegelt
angeordnet. Auf der düsteren Seite heisst es **`Über mich`**, auf der farbigen
**`mehr über mich`** — damit klar ist, dass es dort **zusätzliche** Dinge gibt
(nicht dasselbe wie auf der düsteren Seite, wo man es evtl. schon angeklickt hat).
`Portfolio` führt zur jeweiligen Bild-Hauptseite, das „Über mich" zum modus-eigenen.

## A3. Bild-Weiterschaltung statt Untermenü (Karussell) — für BEIDE Modi

Kernwunsch: Bilder **direkt auf der Hauptseite** durchschalten, keine Unterseite.

### Hauptseite (Karussell)

- [ ] **Manuell weiter/zurück** (Pfeile, Wischen/Swipe, Klick auf Bildrand).
- [x] **Kein automatisches Weiterschalten für v1** — bewusst simpel gehalten, nur
      manuell. Auto-Weiterschalten kann später nachgerüstet werden.
- [ ] **Gruppierung:** ein durchgehender Bildfluss, oder weiter nach Serien
      gruppiert (aber inline als Karussell statt als anklickbare Serie)?
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

## B2. Umbau: kein Untermenü mehr (aktuelle Änderung an der düsteren Seite)

Heute: Startseite zeigt Serien-Titelbilder → Klick öffnet die Serien-Unterseite.

Neu gewünscht: **kein Klick in eine Serie**, sondern Bilder **direkt auf der
Hauptseite** durchschalten/rotieren (Karussell-Prinzip aus A3), evtl. automatisch.

- [ ] Startseite düster auf Karussell/Durchschalten umstellen (Details siehe A3).
- [ ] Klären, was mit den heutigen Serien-Unterseiten (`/serien/<slug>`),
      der „Nächste Serie"-Navigation und dem Vorlade-Mechanismus passiert.
- [ ] Vollbild-Ansicht (Lightbox) in das neue Prinzip einpassen (A3).

## B3. „Über mich" (düster) — eigener Inhalt

- [ ] Künstlerisch/düster gehaltene Themen, z. B. **Musikgeschmack** u. Ä.
      (Gedanke, noch offen). Menü links, führt zum düsteren „Über mich".

## B4. Offene Punkte düster

- [x] Auto-Weiterschalten: **raus für v1** (nur manuell, siehe A3).
- [ ] Bildfluss durchgehend oder nach Serien gruppiert (siehe A3).

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

- [ ] Route: `/color` (o. `/farbe`) — **Name noch offen** (englischer Button vs. deutsch).
- [ ] Zweite Content-Sammlung `farbserien` (einfaches Schema wie heute:
      Titel, Jahr, Reihenfolge, Titelbild = erstes Bild, weitere Bilder).
- [ ] Eigener Bildordner (`src/assets/farbserien/<slug>/`, Inhalt `src/content/farbserien/`).
- [ ] CMS: zweite Sammlung „Farbserien" in `public/admin/config.yml`
      (separater Upload-Bereich, eigener Medienordner).
- [ ] Farbmodus-Theme als eigener Scope/Mode-Klasse, damit der düstere Modus
      unberührt bleibt.
- [ ] Menü **rechts** (gespiegelt), Umschalt-Button **oben links** (siehe A2b).

## C4. „mehr über mich" (farbig) — eigener Inhalt

- [x] Label **`mehr über mich`** (statt nur „Über mich") — signalisiert, dass es
      hier zusätzlichen Inhalt gibt. (Betreiber offen für Alternativen, vorerst so.)
- [ ] Themenmässig anders, z. B. **Reisen, Sport** u. Ä. (Gedanke, noch offen).
      Menü rechts, führt zum farbigen „mehr über mich".
- [ ] Evtl. weitere Signale „hier gibt's mehr" (kleiner Hinweis/Zähler?) — optional,
      offen für Vorschläge.

## C5. Offene Punkte Farbe

- [ ] Genauer Grund-Ton + Palette (Muster/Prototyp nötig).
- [x] Karussell wie im düsteren Modus: **nur manuell**, kein Auto (siehe A3).

---

## Notizen / verworfene Ideen

- Verworfen: scroll-gesteuerter Hintergrund-Verlauf von S/W zu Farbe. Stattdessen
  **getrennter Modus per Button** (sauberer, düsterer Grund bleibt Standard).

# Farbmodus — Ideensammlung & Checkliste

> Status: **nur Ideensammlung.** Noch nichts umgesetzt. Diese Datei sammelt alles,
> was besprochen wurde, und dient später als Abarbeitungs-Checkliste. Beim Bauen
> die offenen Punkte (Abschnitt 6) klären, dann Abschnitt 7 abarbeiten.

## 1. Grundidee

Neben dem bestehenden **düsteren Schwarzweiss-Modus** (Standard) gibt es einen
zweiten, **farbigen Modus** als getrennte „Unterseite". Oben rechts in der
Kopfzeile ein Button, der zwischen den Welten wechselt. Technisch dieselbe
Website, aber eigene URLs/Seiten — man „wechselt den Modus".

## 2. Was schon feststeht (Entscheidungen)

- [x] **Standard bleibt düster, dunkel, raw** (S/W-Modus = Hauptseite, unverändert).
- [x] **Passwort-Tor gilt für beide Modi** — einmal im Besuch entsperrt, beides offen.
- [x] Der Farbmodus ist eine **Unterseite / eigener Bereich**, **unabhängig** vom
      düsteren Teil (eigene Galerie, eigener Inhalt).
- [x] **Getrennte Optik** je Modus.
- [x] **Eigener Upload-Bereich** für die Farbfotos — **im selben CMS**, aber als
      **separate Sammlung** (nicht mit den S/W-Serien vermischt).
- [x] **Umschalt-Button oben rechts** in der Kopfzeile; auf der Gegenseite wird er
      durch den Rück-Button ersetzt.

## 3. Architektur (Vorschlag, No-JS)

Modus = **eigene Routen**, kein Zustand, kein Toggle-Skript (bleibt No-JS):

- Dunkel (wie jetzt): `/`, `/serien/<slug>`, `/ueber-mich`
- Farbe (neu): `/color` (o. `/farbe`), `/color/serien/<slug>`
- Der Button ist ein **Link** auf die andere Welt. Unterschiedliches Aussehen =
  eigene Seiten mit eigenem Theme.

CMS: zweite Sammlung **„Farbserien"** mit denselben einfachen Feldern (Titel,
Jahr, Reihenfolge, Titelbild = erstes Bild, weitere Bilder), eigener Bildordner
(z. B. `src/assets/farbserien/<slug>/`, Inhalt `src/content/farbserien/`).

## 4. Der Umschalt-Button (Beschriftung)

Verspielter, augenzwinkernder **spanischer** Ton. Erste Ideen:

- **Hin zur Farbe / Sonne** (auf der düsteren Seite, oben rechts):
  - `¿A quién le gusta el sol?` — „Wer mag die Sonne?"
  - `Me gusta el sol` — „Ich mag die Sonne"
  - kurz: `El sol`
- **Zurück zur Nacht / dunkel** (auf der farbigen Seite, oben rechts):
  - `A mí me gusta la noche` — „*Ich* mag die Nacht"
  - `Me gusta la noche` — „Ich mag die Nacht"
  - kurz: `La noche`

Offen: genaue Formulierung, Länge (ganzer Satz vs. kurz), Stil/Platzierung.
Hinweis: Sentence Case ist sonst Regel auf der Seite (Regel 8) — hier bewusst
brechen oder anpassen.

## 5. Optik des Farbmodus (Mood)

Stichworte des Betreibers: **Retro, Vintage, verwaschener Look, ruhige warme
Farben (nicht knallig), leichter Grain, sonnig, vintage.**

Richtung zum Ausarbeiten:

- [ ] Grund: **warm, verwaschen** (statt near-black) — sonnig, gedämpft, nicht grell.
- [ ] **Leichter Grain** (wie im düsteren Modus, aber heller/wärmer abgestimmt).
- [ ] **Gedämpfte, warme Palette** (creme/sand/sepia-nah), keine kräftigen Farben.
- [ ] Passepartout/Rahmen-Ton auf den warmen Grund abstimmen (nicht kaltes Weiss).
- [ ] Evtl. dezenter Vintage-/Verwaschen-Effekt im Hintergrund (nicht über den Fotos).
- [ ] Textfarbe/Kontrast auf warmem Grund prüfen (Lesbarkeit).
- [ ] Bilder bleiben unangetastet (wie im S/W-Modus) — Farbfotos werden so
      übernommen, wie hochgeladen (keine Filter aufs Bild).

## 6. Offene Punkte / noch zu entscheiden

- [ ] **„Über mich": geteilt oder pro Modus?** (Eine gemeinsame Seite, oder je Modus eigene.)
- [ ] **Umfang Farbmodus:** nur Galerie/Portfolio, oder auch eigene Unterseiten?
- [ ] **Route-Name:** `/color` (zum englischen Button) oder `/farbe` (deutsch)?
- [ ] **Cursor/Touch-Invert & Lightbox** im Farbmodus gleich lassen? (invertiert
      einfach den farbigen Grund) — vermutlich ja.
- [ ] **Genauer Grund-Ton + Palette** des Farbmodus (Muster/Prototyp nötig).
- [ ] **Button-Text final** (siehe Abschnitt 4).
- [ ] **Weicher Überblend-Effekt beim Umschalten?** (View Transitions = etwas
      Client-JS) — für v1 eher harter Seitenwechsel, später möglich.

## 7. Umsetzungs-Checkliste (später abarbeiten)

- [ ] Zweite Content-Sammlung `farbserien` (Schema wie `serien`).
- [ ] CMS: zweite Sammlung „Farbserien" in `public/admin/config.yml` (separater
      Upload-Bereich, eigener Medienordner).
- [ ] Farbmodus-Theme: eigene Tokens/Variante (warmer Grund, Grain, Palette,
      Rahmen-Ton) — als Mode-Klasse/Scope, damit der düstere Modus unberührt bleibt.
- [ ] Routen: `/color` (Startseite Farbmodus) + `/color/serien/<slug>`.
- [ ] Header: Umschalt-Button oben rechts, je Modus die passende Beschriftung/Link.
- [ ] Startseite Farbmodus (Liste der Farbserien-Titelbilder) analog zur S/W-Startseite.
- [ ] Serienseiten Farbmodus (Titelbild = erstes Bild, Lightbox, Vorladen) wie S/W.
- [ ] Passwort-Tor greift auch im Farbmodus (dieselbe Sitzungs-Freischaltung).
- [ ] Sitemap/robots: Farbmodus-Seiten aufnehmen.
- [ ] CLAUDE.md: zweiten Modus/Mood dokumentieren (bewusste Entscheidung).
- [ ] Prüfen: 375px & 1440px, kein H-Scroll, Fokus/Tastatur, Kontrast, `astro check`,
      `npm run build` sauber (Definition of done).

## 8. Notizen / Referenz

- Frühere Alternatividee (verworfen): scroll-gesteuerter Hintergrund-Verlauf von
  S/W zu Farbe. Stattdessen **getrennter Modus per Button** (sauberer, No-JS,
  düsterer Grund bleibt Standard).

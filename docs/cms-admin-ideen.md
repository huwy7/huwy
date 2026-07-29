# CMS-Admin — Ideensammlung / Checkliste (später)

Wunsch des Betreibers: die Admin-Oberfläche **sehr einfach, intuitiv, drag-and-drop**.
Aktuell nutzen wir **Sveltia CMS** (config-getrieben, Formulare/Listen). Die folgende
Vision geht über das hinaus, was Sveltia out-of-the-box bietet — sie braucht
voraussichtlich eine **eigene, gebaute Admin-Oberfläche** (custom UI). Darum hier als
Checkliste für später, nicht sofort.

## Vision (Zielbild)

- **Sehr simpel, viele Funktionen, drag-and-drop** — keine Formular-Listen, kein
  „dies/das". Alles per Ziehen.
- **Zwei Spalten:**
  - **Rechts: zentraler Upload** — alle neu hochgeladenen Bilder liegen hier bereit.
  - **Links: die Serien** (untereinander), jede Serie als Zeile/Block mit ihren Bildern.
- **Bilder per Drag & Drop** aus dem Upload in eine Serie ziehen.
- **Reihenfolge innerhalb einer Serie** per Drag & Drop anpassen.
- **Bilder zwischen Serien** per Drag & Drop verschieben (aus einer Serie in eine andere).
- **Serien-Reihenfolge** per Drag & Drop in der Serienansicht ändern (ganze Serie ziehen).
- **Titel pro Serie** direkt anpassbar (inline editierbar).
- Insgesamt: **nutzerfreundlich, einfach, drag-and-drop-mässig.**

## Offene Punkte / Machbarkeit

- [ ] Klären: mit Sveltia machbar (Grenzen des relation/list-Widgets) oder **eigene
      Admin-SPA** nötig? Vermutlich Custom-UI, die direkt gegen die GitHub-API
      committet (dasselbe flache Bild-Modell: ein Commit pro Änderung an
      `serienbilder/` bzw. `farbbilder/` und `serien/`).
- [ ] Das **flache Bild-Modell** ist die passende Datengrundlage dafür (jedes Bild =
      eigener Eintrag mit `serie` + `reihenfolge`) — Drag & Drop ändert nur `serie`
      und `reihenfolge`. Bereits umgesetzt.
- [ ] Drag & Drop für Reihenfolge = Neuvergabe der `reihenfolge`-Werte in einem Rutsch.
- [ ] Bild in andere Serie ziehen = `serie`-Feld ändern + neue `reihenfolge`.
- [ ] Serien-Reihenfolge ziehen = `reihenfolge` der Serien-Metadaten neu vergeben.
- [ ] Inline-Titel = `titel` der Serien-Metadaten bearbeiten.
- [ ] Mobil-tauglich (Touch-Drag) mitdenken.

## Kleinere, bereits erledigte Verbesserungen (Vollbild)

- [x] **Swipe** in der Vollbild-Ansicht (links/rechts blättern) zusätzlich zum Tippen.
- [x] **✕ grösser + grössere Trefferfläche** (kompakt oben rechts, Blättern bleibt möglich).

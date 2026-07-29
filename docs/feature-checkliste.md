# Feature-Checkliste — Ideen für später

Allgemeine Sammlung von Feature-Ideen, die eingebaut werden sollen — **egal welcher
Bereich** (Admin, Portfolio, About me, farbige oder düstere Seite …). Hier sammeln
wir laufend Ideen und arbeiten sie später ab. Neue Ideen einfach unter „Offen"
ergänzen; Erledigtes nach unten verschieben und abhaken.

## Offen

### Sticky Header (alle Seiten)
- [ ] Die Kopfzeile (Portfolio, About me / More about me, Umschalt-Button) bleibt
      beim Scrollen **immer sichtbar** — egal wohin man scrollt. Aktuell scrollt sie
      mit weg. Umsetzung z. B. `position: sticky` (oder `fixed`) am Header; dabei
      beachten: Zusammenspiel mit dem „jede Serie = volle Bildschirmhöhe"-Layout,
      dem Zugangs-Tor und dem invertierenden Cursor.

### CMS-Admin: Drag-and-Drop-Oberfläche
Wunsch: die Admin-Oberfläche **sehr einfach, intuitiv, drag-and-drop**. Geht über
das hinaus, was Sveltia CMS (config-/formulargetrieben) bietet — braucht
voraussichtlich eine **eigene, gebaute Admin-Oberfläche**.
- [ ] Zwei Spalten: **rechts zentraler Upload**, **links die Serien** (untereinander).
- [ ] Bilder per **Drag & Drop** aus dem Upload in eine Serie ziehen.
- [ ] **Reihenfolge in der Serie** per Drag & Drop.
- [ ] Bilder **zwischen Serien** per Drag & Drop verschieben.
- [ ] **Serien-Reihenfolge** per Drag & Drop (ganze Serie ziehen).
- [ ] **Titel pro Serie** inline editierbar.
- [ ] Touch-/Mobil-tauglich.
- Hinweis: Das **flache Bild-Modell** ist die passende Datengrundlage (Drag ändert
  nur `serie` + `reihenfolge`). Bereits umgesetzt.

## Erledigt

- [x] **Vollbild: Swipe** links/rechts blättert (zusätzlich zum Tippen).
- [x] **Vollbild: ✕ grösser** + grössere Trefferfläche (kompakt oben rechts,
      Blättern bleibt möglich).

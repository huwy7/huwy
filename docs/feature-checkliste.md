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

### CMS-Admin: Drag-and-Drop-Oberfläche — v1 gebaut, Rest offen
Eigenes Werkzeug unter `/admin/anordnen` (neben Sveltia, ersetzt es nicht):
`public/admin/anordnen/`. Reine Vanilla-Datei ohne Dependency; Pointer-basiertes
Drag & Drop (Maus + Touch). Login per GitHub-Token (nur zum Speichern), ein
atomarer Commit auf den einstellbaren Ziel-Branch (Standard `main` = live;
Bildänderungen sollen direkt live gehen).

Erledigt in v1:
- [x] **Reihenfolge in der Serie** per Drag & Drop.
- [x] Bilder **zwischen Serien** per Drag & Drop verschieben (nur innerhalb eines
      Bereichs — kein sw ↔ farbe).
- [x] **Serien-Reihenfolge** per Drag & Drop (Serie am Griff ziehen).
- [x] **Titel/Jahr pro Serie** inline editierbar.
- [x] Touch-/Mobil-tauglich (Pointer Events).
- [x] **Bild antippen → Kontextmenü**: Verschieben (Zielserie wählen) oder
      Löschen. Mobil-freundliche Alternative zum Ziehen.

Noch offen:
- [ ] **Zentraler Upload** neuer Bilder direkt im Werkzeug (aktuell noch über
      Sveltia). Braucht Datei-Upload via GitHub-API (base64 + Commit).
- [ ] **Serien anlegen/löschen** im Werkzeug (aktuell über Sveltia).
- [ ] Komfort-Login via **GitHub-OAuth** statt Token (bestehenden Sveltia-Worker
      wiederverwenden), damit kein Token mehr eingefügt werden muss.
- Hinweis: Das **flache Bild-Modell** ist die Datengrundlage (Drag ändert nur
  `serie` + `reihenfolge` und benennt die kleine Markdown-Datei um; die
  Bild-Assets bleiben unangetastet).

## Erledigt

- [x] **Vollbild: Swipe** links/rechts blättert (zusätzlich zum Tippen).
- [x] **Vollbild: ✕ grösser** + grössere Trefferfläche (kompakt oben rechts,
      Blättern bleibt möglich).

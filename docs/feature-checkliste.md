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

### CMS-Admin: Drag-and-Drop-Oberfläche — v2 gebaut
Eigenes Werkzeug unter `/admin/anordnen` (neben Sveltia, ersetzt es nicht):
`public/admin/anordnen/`. Reine Vanilla-Datei ohne Dependency; Pointer-basiertes
Drag & Drop (Maus + Touch). Login per GitHub-Token (nur zum Speichern), ein
atomarer Commit auf den einstellbaren Ziel-Branch (Standard `main` = live;
Bildänderungen sollen direkt live gehen).

Erledigt:
- [x] **Reihenfolge in der Serie** per Drag & Drop.
- [x] Bilder **zwischen Serien** verschieben (nur innerhalb eines Bereichs).
- [x] **Serien-Reihenfolge** per Drag & Drop (Serie am Griff ziehen).
- [x] **Titel/Jahr pro Serie** inline editierbar.
- [x] Touch-/Mobil-tauglich (Pointer Events).
- [x] **Bild antippen → Kontextmenü** (Verschieben/Löschen bzw. Pool: Hinzufügen).
- [x] **Zwei Spalten**: links Ziele, rechts **Pool aller Repo-Fotos**.
- [x] **Aus dem Pool ziehen** (kopiert) in Serien und Über-mich; mobil per Antippen.
- [x] **Neue Serie anlegen** (Schwarzweiss/Farbe) im Werkzeug.
- [x] **Über-mich-Seiten** als Ziele — ganze Seite mit Fotos befüllbar.
- [x] **Foto-Upload direkt im Werkzeug** (Datei-/Foto-Picker → base64 → ein Commit
      nach `src/assets/pool/`, sofort im Pool). Sveltia für Uploads nicht mehr nötig.

Noch offen:
- [ ] **Serien löschen** im Werkzeug (anlegen geht; löschen noch über Git/Sveltia).
- [ ] **Foto aus dem Pool/Repo löschen** (aktuell bleibt ein Asset liegen, wenn es
      aus allen Zielen entfernt wird).
- [ ] Komfort-Login via **GitHub-OAuth** statt Token.
- Hinweis: Aus dem Pool ziehen ändert nur die kleinen Markdown-Einträge
  (`serie`/`reihenfolge` bzw. Über-mich-Liste); die Bild-Assets bleiben unangetastet.

## Erledigt

- [x] **Vollbild: Swipe** links/rechts blättert (zusätzlich zum Tippen).
- [x] **Vollbild: ✕ grösser** + grössere Trefferfläche (kompakt oben rechts,
      Blättern bleibt möglich).

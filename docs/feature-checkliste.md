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

### Leitprinzip für `/admin/anordnen` (verbindlich)
**Viel möglich, aber übersichtlich.** Alles, was hier hinzukommt, muss für den
Betreiber als Endkunde **so einfach wie möglich zu bedienen** und **so schlicht wie
möglich in der Ansicht** sein. Grosse Funktion, kleine/ruhige Oberfläche. Keine
technischen Begriffe, keine überladenen Panels — im Zweifel weglassen oder hinter
einer klaren Aktion verstecken.

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
- [x] **Über-mich: Text je Foto** (optional) + Anzeige abwechselnd links/rechts.
      Im Werkzeug als Reihen „Foto + Text daneben" (untereinander), damit klar ist,
      welcher Text zu welchem Foto gehört. Serien bleiben eine Bilderreihe.
- [x] **Foto aus dem Pool/Repo löschen** — mit Hinweis, wo es verwendet wird
      (hilft Doppel erkennen); löscht Asset + Verwendungen in einem Commit.
- [x] **Halten zum Ziehen** (Touch): erst nach kurzem Halten ziehbar, sonst scrollt
      man normal über die Fotos. Maus zieht sofort.

- [x] **Serien löschen** im Werkzeug (✕ im Serien-Kopf; löscht beim Speichern die
      Metadaten-Datei + Bild-Einträge, Fotos bleiben im Pool).

Noch offen:
- [ ] **Umzug auf `/admin`** + Sveltia/OAuth-Worker abschalten (kurze URL, ein
      Werkzeug). Erst wenn der Betreiber grünes Licht gibt.
- [ ] Komfort-Login via **GitHub-OAuth** statt Token.
- Hinweis: Aus dem Pool ziehen ändert nur die kleinen Markdown-Einträge
  (`serie`/`reihenfolge` bzw. Über-mich-Liste); die Bild-Assets bleiben unangetastet.

## Erledigt

- [x] **Vollbild: Swipe** links/rechts blättert (zusätzlich zum Tippen).
- [x] **Vollbild: ✕ grösser** + grössere Trefferfläche (kompakt oben rechts,
      Blättern bleibt möglich).

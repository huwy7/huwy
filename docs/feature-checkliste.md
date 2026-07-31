# Feature-Checkliste — Ideen für später

Allgemeine Sammlung von Feature-Ideen, die eingebaut werden sollen — **egal welcher
Bereich** (Admin, Portfolio, About me, farbige oder düstere Seite …). Hier sammeln
wir laufend Ideen und arbeiten sie später ab. Neue Ideen einfach unter „Offen"
ergänzen; Erledigtes nach unten verschieben und abhaken.

## Offen

### Gemeldet am 31.07. (Betreiber)
- [ ] **Abstand Titel→Bild bei gemischten Formaten (Mobil).** Offen, wartet auf eine
      Entscheidung: Der Streifen ist immer so hoch wie das höchste Bild der Serie,
      kürzere Bilder liegen darin mittig — dadurch wächst ihr Abstand zum Titel
      (iPhone Farbseite gemessen: 40 / 73 / 94 / 176 px). „Abstand konstant" und
      „Bild exakt mittig im Sichtbereich" sind gleichzeitig nicht zu haben; das ist
      keine Eigenheit der Farbseite, sondern trifft jede Serie mit Quer- UND
      Hochformaten (düster iPhone ebenso: 40 / 52). Auf dem **Desktop erledigt** —
      dort sind beide Seiten jetzt überall 40 px (siehe unten).

### Leitprinzip für `/admin` (verbindlich)
**Viel möglich, aber übersichtlich.** Alles, was hier hinzukommt, muss für den
Betreiber als Endkunde **so einfach wie möglich zu bedienen** und **so schlicht wie
möglich in der Ansicht** sein. Grosse Funktion, kleine/ruhige Oberfläche. Keine
technischen Begriffe, keine überladenen Panels — im Zweifel weglassen oder hinter
einer klaren Aktion verstecken.

### CMS-Admin: Drag-and-Drop-Oberfläche — v2 gebaut
Eigenes Werkzeug unter `/admin` (Hauptoberfläche; das alte Sveltia-CMS liegt
als Rückfall unter `/admin/cms`): `public/admin/`. Reine Vanilla-Datei ohne Dependency; Pointer-basiertes
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
- [x] **Umzug auf `/admin`**: das Werkzeug ist die Hauptoberfläche, Sveltia liegt
      unter `/admin/cms`. Alte URL `/admin/anordnen` leitet weiter.
- [x] **Sperrbildschirm auch im Admin** — **rein ästhetisch**, damit niemand hinter
      die Bühne sieht. Gleicher Code/dieselbe Sitzung wie die Seite; das Admin-Skript
      lädt erst nach dem Entsperren. **Der GitHub-Token bleibt** der eigentliche
      Mechanismus zum Speichern — das Tor ersetzt ihn nicht und schützt nichts.
- [x] **Halten zum Ziehen** (Touch): erst nach kurzem Halten ziehbar, sonst scrollt
      man normal über die Fotos. Maus zieht sofort.

- [x] **Serien löschen** im Werkzeug (✕ im Serien-Kopf; löscht beim Speichern die
      Metadaten-Datei + Bild-Einträge, Fotos bleiben im Pool).

Noch offen:
- [ ] Sveltia (`/admin/cms`) samt OAuth-Worker ganz abschalten, sobald das
      Werkzeug im Alltag trägt.
- Hinweis: Aus dem Pool ziehen ändert nur die kleinen Markdown-Einträge
  (`serie`/`reihenfolge` bzw. Über-mich-Liste); die Bild-Assets bleiben unangetastet.

**Entscheidung Zugang zum Admin (verbindlich):** Der **GitHub-Token bleibt** — er
ist der Mechanismus zum Speichern und wird **nicht** durch OAuth ersetzt. Der
**Sperrbildschirm ist rein ästhetisch** (nichts von der Bühne sichtbar), kein
Schutzmechanismus. Also: kein OAuth-Login als Aufgabe führen.

## Erledigt

- [x] **Vollbild: Wischen geht jetzt auch auf iOS.** Die Blätterflächen lagen über
      dem Scroll-Streifen und fingen die Berührung ab; sie liegen jetzt innerhalb
      der Bildfläche im Streifen. Ein Wisch blättert genau ein Bild weiter; Tippen,
      Tastatur und Zähler unverändert.
- [x] **Optisches Feedback beim Antippen: nur noch Kopfzeile und ✕.** Das graue
      Aufblitzen des Browsers ist überall aus (`-webkit-tap-highlight-color`), es
      stört also beim Blättern im Vollbild nicht mehr. Kopfzeilen-Beschriftungen und
      das ✕ bekommen beim Drücken denselben abgerundeten, invertierenden Kasten wie
      mit der Maus — reines CSS (`.druck-box`), **kein Touch-Skript**. Die
      Entscheidung „Touch ohne mitlaufende Effekte" bleibt bestehen.
- [x] **Farbseite: weisser Rand wieder da**, damit beim Weiterwischen zwischen zwei
      Bildern 2 × `--rahmen-breite` weisse Fläche liegt. Der Rand liegt **aussen**
      um das Bild: das Bild behält exakt seine Grösse (so gross wie auf der düsteren
      Seite Bild + Rahmen zusammen), die Bildkante fluchtet weiterhin mit dem
      Serientitel, kein horizontaler Überlauf.
- [x] **Abstand Titel→Bild auf dem Desktop vereinheitlicht**: düster und farbig
      zeigen jetzt beide überall 40 px (vorher farbig 24 px bzw. deutlich mehr).
      Ergab sich aus dem wieder eingeführten Rand.
- [x] **Vollbild nutzt auf Mobil die volle Breite** (iPhone, iPad hochkant): keine
      seitlichen Ränder mehr, die Bildfläche verschenken. Die Höhe bleibt gedeckelt,
      damit ✕ und Zähler ihren Platz behalten; sehr hohe Hochformate werden weiterhin
      von der Höhe begrenzt und bleiben ganz sichtbar. Desktop unverändert.
- [x] **Touch komplett effektfrei**: kein mitlaufender Kreis und kein Puls beim
      Antippen. Zeiger-Effekte gibt es nur mit der Maus (auch am Touch-Gerät mit
      angeschlossener Maus).
- [x] **Kein System-Zeiger mehr neben dem eigenen Cursor** (Chrome zeigte ihn über
      Blätterflächen, Zählerstrichen, Vollbild-Zonen und dem ✕).

- [x] **Vollbild blättert wie ein Filmstreifen**: eine Streifen-Ansicht je Serie
      (statt einer Ebene je Bild) — das nächste Foto schiebt sich seitlich herein,
      wie auf der Portfolioseite. Wischen, Klickflächen, Tastatur (←/→, Esc).
- [x] **Pfeile ersetzt durch einen Zähler**: ein feiner Strich je Foto unter dem
      Bild (im Vollbild unten mittig), anklickbar. Die Striche haben keine eigene
      Farbe, sondern **invertieren ihren Untergrund in Graustufen** — dadurch überall
      sichtbar und nie bunt. Der aktive Strich ist **länger und dicker**; beim
      Blättern wächst der neue und der alte schrumpft.
- [x] **Sticky Header (alle Seiten)**: die Kopfzeile bleibt beim Scrollen sichtbar
      (`position: sticky`, `--z-kopf`). Darunter ein weicher Verlauf-Schleier
      (`--kopf-schleier`, je Modus), damit die Beschriftungen lesbar bleiben, wenn
      ein Foto durchscrollt — kein harter Balken. Vollbild und Cursor liegen darüber,
      am Zugangs-Tor bleibt die Kopfzeile ausgeblendet.
- [x] **Vollbild: Swipe** links/rechts blättert (zusätzlich zum Tippen).
- [x] **Vollbild: ✕ grösser** + grössere Trefferfläche (kompakt oben rechts,
      Blättern bleibt möglich).

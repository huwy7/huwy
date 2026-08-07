# Feature-Checkliste — Ideen für später

Allgemeine Sammlung von Feature-Ideen, die eingebaut werden sollen — **egal welcher
Bereich** (Admin, Portfolio, About me, farbige oder düstere Seite …). Hier sammeln
wir laufend Ideen und arbeiten sie später ab. Neue Ideen einfach unter „Offen"
ergänzen; Erledigtes nach unten verschieben und abhaken.

## Offen

### Gemeldet am 31.07. (Betreiber)

- [ ] **Schrift auf dem rauen Hintergrund prüfen.** Der Grund hinter Portfolio und
      About me hat jetzt deutlich härteres Korn (Rauheit mehr als verdoppelt). Damit
      liegt hinter den Beschriftungen keine ruhige Fläche mehr. Anzuschauen:
      - Serientitel und Jahr (Mono, `--groesse-14`) über dem gesprenkelten Grund
      - Kopfzeile: der Verlauf-Schleier (`--kopf-schleier`) muss vielleicht kräftiger
        werden, damit `Portfolio` / `About me` / der Umschalt-Button ruhig stehen
      - die Zählerstriche: sie kehren ihren Untergrund um — auf Korn wird das unruhig
      - Kontrast auf kleinen Geräten in echter Umgebung, nicht nur im Testbrowser
      Betreiber: „die schrift machen wir später".

- [ ] **Abstände auf dem iPhone überarbeiten.** Betreiber: „die Abstände sind besser,
      wenn auch noch nicht perfekt". **Was genau geändert werden soll, ist noch nicht
      definiert** — erst festlegen, dann bauen.

      Stand heute als Ausgangspunkt (Telefon hochkant, beide Seiten):
      - Titel → sichtbare Bildoberkante: 24px
      - sichtbare Bildunterkante → Zähler: 24px
      - Kopfzeile → Titel: mindestens 24px
      - Zähler → unterer Bildschirmrand: mindestens 24px
      - seitlich bis zur sichtbaren Bildkante: 16px (eine Rahmenbreite)
      - zwischen zwei Serien: gerechnet aus deren Höhen, rund 240px auf dem iPhone

      Sichtbare Kante heisst wie überall: düster der weisse Rahmen, farbig das Foto.

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

**Entscheidung Sveltia (verbindlich):** Sveltia unter `/admin/cms` **bleibt als
Rückfall/Backup bestehen** und wird bis auf Weiteres **nicht** abgeschaltet. Das
Abschalten ist damit **keine Aufgabe mehr** — nicht wieder als offener Punkt
aufnehmen und nicht ungefragt entfernen. Ändert sich das, sagt es der Betreiber.

- Hinweis: Aus dem Pool ziehen ändert nur die kleinen Markdown-Einträge
  (`serie`/`reihenfolge` bzw. Über-mich-Liste); die Bild-Assets bleiben unangetastet.

**Entscheidung Zugang zum Admin (verbindlich):** Der **GitHub-Token bleibt** — er
ist der Mechanismus zum Speichern und wird **nicht** durch OAuth ersetzt. Der
**Sperrbildschirm ist rein ästhetisch** (nichts von der Bühne sichtbar), kein
Schutzmechanismus. Also: kein OAuth-Login als Aufgabe führen.

## Erledigt

- [x] **Bauzeit verkürzt — zwei Zwischenspeicher im Deploy**
      (`.github/workflows/deploy.yml`). Vorher wurde bei jedem Push alles neu
      gerechnet, weil GitHub für jeden Durchlauf eine leere Maschine startet.
      Lokal gemessen: **Bau mit vorberechneten Bildern 3 Sekunden, ohne 136** — und
      der Workflow baut zweimal (`main` und `feature`).
      Gespeichert werden die npm-Pakete und Astros Bild-Cache
      (`node_modules/.astro`).
      **Reihenfolge ist entscheidend:** der Bild-Cache muss NACH `npm ci`
      zurückgespielt werden, weil `npm ci` `node_modules` vorher komplett löscht.
      **Kein Backend:** der Cache liegt auf der Baumaschine bei GitHub, nicht auf
      dem Server, der die Seite ausliefert — die Seite bleibt vollständig statisch,
      für Besucher ändert sich kein Byte.
      **Kein Risiko für falsche Bilder:** Astro benennt jede vorberechnete Datei
      nach einer Prüfsumme aus Originalbild und Umrechnung; ein veralteter Eintrag
      passt schlicht nicht mehr und wird neu gerechnet.
      Beide Cache-Schritte dürfen fehlschlagen, ohne den Deploy zu stoppen — die
      Live-Seite hängt nie an einem Cache.
- [x] **`TODO_NAME` festgelegt: `nicolas huwyler - portfolio`.** Entscheidung des
      Betreibers. Eingesetzt an allen 8 Stellen: Tab-Titel jeder Seite,
      `og:site_name`, `og:title` und die unsichtbare `h1`. Auf der Seite selbst
      weiterhin nicht sichtbar — die Kopfzeile trägt bewusst keine Wortmarke.
      Eine Stelle angepasst: der Titel der Farb-Startseite hiess „Portfolio — color
      — …" und hätte „Portfolio" doppelt enthalten; das führende Wort ist weg.
- [x] **`TODO_DOMAIN` aufgeräumt.** Die Domain `hey.hu-wy.ch` war längst in Betrieb
      (`astro.config.mjs`, `public/CNAME`); der Platzhalter lebte nur noch in
      `docs/01-spezifikation.md` und `docs/02-build-plan.md`. Dort eingetragen und
      zugleich die falsche Hosting-Angabe korrigiert: ausgeliefert wird über GitHub
      Pages, nicht über Cloudflare. **Weiterhin offen und dort vermerkt:** ob die
      nackte Domain `hu-wy.ch` und `www` einmal auf `hey.hu-wy.ch` umleiten sollen.
- [x] **Galerie für Telefone im Hochformat neu gebaut**
      (`src/scripts/galerie-mobil.ts`). Bilder so gross wie möglich: seitlich genau
      eine Rahmenbreite bis zur sichtbaren Kante, senkrecht mindestens ein
      Abstandsschritt (24px) zur Kopfzeile und zum unteren Rand. Immer nur eine Serie im Bild,
      erste Serie steht sofort mittig. Abstand zwischen zwei Serien wird aus deren
      tatsächlichen Höhen gerechnet. Keine festen Bildgrössen, keine festen Höhen.
      **Kein Einrasten** — gescrollt wird frei (war zwischenzeitlich eingebaut und
      wurde auf Wunsch wieder entfernt).
      **Tablets, Telefone im Querformat und der Desktop bleiben unverändert** beim
      bisherigen Verhalten; dort machten die neuen Mindestabstände die Bilder kleiner
      (iPhone quer 86px statt 310px Bildhöhe, iPad quer 476px statt 590px).
      Geprüft: 3 iPhones × 2 Seiten × 6 Bildformate (sehr hohes Hochformat bis
      Panorama und sehr kleines Bild), Drehen, Grössenänderung, freies Scrollen.
      Gegenprobe gegen den Stand davor über Desktop, iPad hochkant/quer, iPad mini,
      iPhone quer und schmales Fenster: 385 Werte verglichen, 14 weichen um je 1px
      ab (genauere Höhenmessung), keine einzige Bildgrösse verändert.
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
- [x] **Gleiche Abstände rund ums Bild — auf beiden Seiten, bei jedem Bild.**
      Titel → sichtbare Bildoberkante = 24 px, sichtbare Bildunterkante → Zähler =
      24 px. Gemessen über alle Serien auf 430 px und 1440 px: durchgehend 24/24,
      bei Bildhöhen von 252 bis 648 px. Die **Bildhöhe bleibt dynamisch**.
      Sichtbare Kante ist auf der düsteren Seite der weisse Rahmen, auf der
      farbigen das Foto selbst (dort ist der Rahmen unsichtbar) — deshalb rückt der
      Streifen im Farbmodus um die Rahmenbreite zusammen. Damit die Abstände bei
      jedem Bild stimmen, folgt die Streifenhöhe dem gerade sichtbaren Bild
      (Skript in `Serie.astro`, ohne JavaScript bleibt die Seite voll bedienbar).
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

# Lernnotizen & Konventionen

Lebendige Datei. **Vor jeder grösseren Änderung kurz querlesen**, danach neue
Erkenntnisse eintragen. Ziel: dieselben Fehler nicht zweimal machen und mit der
Zeit schneller/sicherer werden. Kurz halten, konkret, mit dem *Warum*.

---

## Technische Stolpersteine (hart erkauft)

- **Edge/Chromium: `box-shadow` + `backdrop-filter` am selben Element bricht die
  Invertierung** (GPU-abhängig, Firefox unauffällig). Nie kombinieren. War die
  Ursache, dass Cursor/Hover in Edge „weg" waren.
- **`backdrop-filter` per JS inline setzen**, nicht in der CSS-Datei — der
  CSS-Minifier verändert/entfernt den Wert sonst.
- **`import.meta.env.BASE_URL` hat für `/feature` KEINEN abschliessenden Slash**
  (für `/` schon). Immer `BASE_URL.replace(/\/$/,'')` und Slash selbst setzen,
  sonst entstehen Links wie `/featurecolor`.
- **Nach einem Commit über die GitHub-API hinkt das Datei-CDN (raw) 1–2 Min
  hinterher.** Nach dem Speichern NICHT sofort neu vom Netz laden — sonst
  „springen" frische Werte auf den alten Stand zurück. Stattdessen den
  In-Memory-Zustand an das Geschriebene angleichen.
- **Fine-grained GitHub-Token:** braucht „Contents: Read and write" UND das Repo
  im Zugriff. Fehler `403 "Resource not accessible by personal access token"` =
  fehlende Berechtigung, **kein Code-Bug**.
- **Git-Data-API = ein atomarer Commit** für viele Datei-Änderungen/-Umbenennungen:
  `POST /git/blobs` (bei Binärdaten `encoding: base64`), `POST /git/trees` mit
  `base_tree` (Eintrag mit `content` schreibt Text, `sha: null` löscht),
  `POST /git/commits`, `PATCH /git/refs/heads/<branch>`. Kein Zwischenzustand.
- **Grosse Dateien base64-kodieren in Blöcken** (`String.fromCharCode.apply` hat
  ein Argument-Limit): in 0x8000-Häppchen, dann `btoa`.
- **Touch: `touch-action: none` verhindert Scrollen über dem Element.** Für Listen,
  über die man scrollen können muss: `touch-action: pan-y` + „kurz halten, dann
  ziehen" (Timer ~280 ms; Bewegung vorher = Scrollen). Nur die Maus zieht sofort.
- **`public/` wird unverändert ausgeliefert** (nicht durch Astro gebaut). Dateien
  dort = reines Vanilla (kein Import, keine Tokens der Seite, keine Verarbeitung).
- **`astro:assets` verarbeitet nur *referenzierte* Bilder.** Unreferenzierte Assets
  unter `src/assets/` sind harmlos (werden ignoriert). **HEIC wird nicht
  unterstützt** (sharp) → im Upload nur JPG/PNG/WebP zulassen, sonst bricht der Build.
- **Astro scoped styles erreichen `Bild.astro`s `<img>` nicht** → solche Regeln
  müssen in `global.css`.
- **Mehrzeiligen/Sonderzeichen-Text in YAML als doppelt-gequoteten Skalar mit
  `\n`-Escapes schreiben** (`JSON.stringify(text)`): round-trip-sicher, Astros
  YAML-Parser löst `\n`/`\"` korrekt auf. Beim Parsen `JSON.parse` für `"…"`.
- **Über-mich-Modell:** `bilder` ist eine Liste aus `{ bild, text? }` (Text
  optional, pro Bild). Website rendert die Reihen abwechselnd (Bild rechts/links).
  Serien dagegen bleiben eine reine Bilderreihe.
- **Bilder erst nach dem Entsperren laden** (kein Vorladen am Sperrbildschirm):
  `Bild.astro` gibt die echten Quellen in `data-srcset`/`data-src` aus (Platzhalter
  = transparentes 1×1-GIF, `width`/`height` bleiben → kein Layout-Shift). Ein Skript
  in `Basis.astro` (`aktiviereBilder`) setzt sie nach dem Passwort in DOM-Reihenfolge
  aktiv (Serie eins zuerst). `visibility:hidden` allein verhindert das Laden NICHT —
  nur ein fehlendes `src`/`srcset` tut das. Übergang: `#tor` (scharf) blendet per
  `opacity` auf `body::before` (dasselbe Bild, blur+grain) über, dann Inhalt weich
  ein. Rest-Risiko: die URLs stehen in `data-*` im DOM (statische Seite, kein echter
  Schutz — siehe zugang.md); es lädt aber nichts mehr automatisch.
- **Cursor-Box an einem ausgeblendeten Element**: `getBoundingClientRect()` liefert
  bei `display:none` lauter Nullen — die Box darf diese Position NICHT übernehmen,
  sonst wandert der Cursor in die linke obere Ecke (passierte nach dem Entsperren,
  weil der Cursor das Tor-Eingabefeld umschloss). Bei Rechteck 0/0 die Box lösen.
- **Feste Höhen erzeugen geräteabhängigen Leerraum**: Die Karussell-Ansicht hatte
  `height: 72vh` und zentrierte das Bild darin. Auf schmalen Hochkant-Geräten ist ein
  Querformat nur ein Bruchteil davon hoch → riesige Lücke zwischen Titel und Bild,
  je Gerät anders. Besser: Höhe aus dem Bild (Deckel per `max-height` am Foto) und
  `align-items: flex-start`, damit bei gemischten Formaten in einer Serie jedes Bild
  an derselben Stelle beginnt. Ergebnis: überall exakt derselbe Titel-Bild-Abstand.
- **Serie mittig in der SICHTBAREN Fläche**: Jede Serie ist 100svh hoch und ihr
  Inhalt vertikal zentriert. Damit die Mitte unter der sticky Kopfzeile stimmt,
  bekommen alle Sektionen `padding-block-start: var(--header-hoehe)`; die ERSTE
  stattdessen `min-height: calc(100svh - var(--header-hoehe))` und kein Padding
  (dort steht die Kopfzeile schon im Fluss darüber). Ergebnis: Abstand über und
  unter der Serie exakt gleich, auf jedem Gerät. Die Kopfzeile braucht dafür eine
  feste Höhe (`min-height: var(--header-hoehe)`), sonst stimmt die Rechnung nicht —
  Innenabstände so wählen, dass auch ein zweizeiliger Button darunter passt.
- **Letzte Sektion braucht Scroll-Reserve**: Sektionen sind `100svh` hoch (kleines
  Sichtfenster, Browserleiste sichtbar). Blendet iOS Safari die Leiste beim Scrollen
  aus, wächst das Sichtfenster auf `100lvh` — die Seite endet dann zu früh, um die
  LETZTE Sektion ganz nach oben zu bringen. Fix: `.serie:last-of-type
  { padding-block-end: calc(100lvh - 100svh) }` (ohne Leiste = 0).
- **Nicht den Block zentrieren, sondern das BILD**: Wird Titel + Bild gemeinsam
  zentriert, sitzt das Bild um die halbe Titelhöhe zu tief — von Auge deutlich
  sichtbar. Lösung ohne JS: der Titel bekommt seinen eigenen Platz als NEGATIVEN
  oberen Aussenabstand zurück
  (`calc(-1 * (var(--groesse-14) * var(--zeilenhoehe-1-4) + var(--abstand-24)))`),
  dann zentriert die Sektion faktisch nur das Bild. Formel aus Tokens gebaut, passt
  sich also automatisch an. Zusätzlich `align-items: center` im Karussell, damit
  auch in Serien mit gemischten Formaten jedes einzelne Bild mittig liegt.
- **Globales `box-sizing: border-box` frisst dünne Elemente**: Ein Strich mit
  `height: 2px; padding: 8px 0` wird unsichtbar — die 2px enthalten den Innenabstand,
  die Inhaltshöhe wird 0. Für „dünne Linie mit grosser Trefferfläche" am Element
  `box-sizing: content-box` setzen (+ `background-clip: content-box`).
- **Element soll sich dem Untergrund anpassen** (Striche, Cursor, Puls): keine
  eigene Farbe vergeben, sondern `backdrop-filter: grayscale(1) invert(1)` — der
  Graustufen-Anteil verhindert bunte Ränder über farbigen Fotos. Unterscheidung
  (z. B. aktiv/inaktiv) dann NICHT über Farbe, sondern über Grösse/Stärke lösen.
  Wert inline per JS setzen und einen `@supports not`-Rückfall mitgeben.
- **Vollbild als Streifen statt Ebenen**: Eine Ebene je Bild (`:target`, display
  none/block) schaltet hart um. Ein einziger scroll-snap-Streifen je Serie —
  aufgebaut wie das Karussell — schiebt das nächste Foto seitlich herein und bringt
  auf Touch das native Wischen gratis mit. Öffnen: Hash setzen, dann im nächsten
  Frame `scrollTo` ohne Animation auf den Index.
- **Mehrzeiliges neben einzeiligem ausrichten**: `align-items: baseline` (nicht
  `center`) — dann liegt die erste Zeile des umbrechenden Elements auf derselben
  Höhe wie die einzeiligen Nachbarn, nur die zweite Zeile hängt darunter.
- **Schriftgrössen nicht per Breakpoint verkleinern** (Wunsch des Betreibers:
  überall identisch). Passt ein langer Text nicht daneben, lieber NUR dieses Element
  umbrechen lassen (`white-space: normal` + `text-align` an seiner Seite).
- **Stacking-Context-Falle bei sticky Kopfzeile**: Eine Animation mit
  `animation-fill-mode: both` (das weiche Einblenden von `.inhalt` nach dem
  Entsperren) bleibt dauerhaft „in Kraft" und erzeugt einen eigenen
  Stacking-Context. Alles darin (z. B. die Vollbild-Ansicht mit `z-index: 950`)
  bleibt gefangen und liegt dann UNTER der sticky Kopfzeile (`z-index: 100`) —
  obwohl die Zahl grösser ist. Lösung: die Animationsklasse nach dem Einblenden
  per `setTimeout` wieder entfernen. Merke: z-index vergleicht nur INNERHALB
  desselben Stacking-Context.
- **Cursor nur bei Maus, nicht bei Finger** (Entscheidung des Betreibers): Der
  mitlaufende Kreis wirkt mit dem Finger billig. Darum kein Touch-Cursor mehr —
  stattdessen ein kurzer Invert-Puls an der Tippstelle, aber NUR auf Bedienelementen.
  Der Desktop-Cursor inkl. Hover-/Box-Effekten bleibt unverändert und startet auch
  nachträglich, sobald eine echte Mausbewegung kommt (`pointerType === 'mouse'`) —
  so bekommt auch ein iPad mit Maus den vollen Effekt. `(pointer: fine)` allein
  genügt dafür nicht.
- **Animierte Elemente positionieren**: Wenn eine CSS-Animation `transform` nutzt
  (z. B. `scale`), die Position NICHT über `transform` setzen — sonst überschreibt
  die Animation sie. Stattdessen die eigenständige `translate`-Eigenschaft nehmen.
- **Admin-Sperrbildschirm** (`public/admin/tor.js`): sperrt beide Admin-Seiten mit
  demselben Code/derselben Sitzung wie die öffentliche Seite; das Admin-Skript wird
  erst nach dem Entsperren nachgeladen (`data-laden`), damit dahinter nichts läuft.
  **Zweck ist rein ästhetisch** — niemand soll hinter die Bühne sehen. Er ist
  ausdrücklich KEIN Schutzmechanismus und ersetzt nichts: Speichern läuft weiterhin
  über den **GitHub-Token**, und der bleibt so (Entscheidung des Betreibers —
  **kein OAuth-Ersatz** vorschlagen).
- **Admin-Vorschauen NICHT als Vollbild laden** (Performance): `public/` läuft
  nicht durch Astro, also gibt es dort keine fertigen Grössen. Lösung: kleine
  Vorschau über einen On-the-fly-Resizer (wsrv.nl: `?url=ssl:raw.githubusercontent…
  &w=240&output=webp&q=70&we`), mit `onerror`-Fallback aufs Original. Gilt nur im
  Admin-Werkzeug; die **öffentliche Website** nutzt weiter `astro:assets` (passende
  Grösse je Gerät). Externer Dienst ist hier ok, weil das Admin ohnehin extern
  hängt (GitHub-API, Sveltia-CDN) und das Repo öffentlich ist.

## Deploy / Branch-Modell

- **`main` = live (`/`), `feature` = Vorschau (`/feature`).** Ein Workflow baut
  beide in ein Pages-Artefakt. Push auf `feature` ändert die Live-Seite nie.
- **`/feature/admin` MUSS erhalten bleiben** — sonst gibt es keine Teststrecke fürs
  Admin-Werkzeug. Die Vorschau-Instanz zielt standardmässig auf den `feature`-Branch
  (eigener `localStorage`-Schlüssel), damit Testen die Live-Seite nie berührt.
- **`concurrency: pages` serialisiert Deploys** → Runs stehen manchmal erst auf
  `pending`/`queued`, bevor sie laufen. Kein Fehler.
- Das Anordnen-Werkzeug committet Inhalte direkt auf den eingestellten Branch →
  `main` und `feature` laufen dadurch auseinander; das ist normal (Merge/FF regelt es).

## Arbeitsweise mit dem Betreiber

- **Immer erst auf `feature` bauen, dort testen lassen, dann mergen** — nie
  ungefragt auf `main` mergen (Ausnahme: reine Admin-Werkzeug-Dateien, die die
  öffentliche Seite nicht berühren, wenn Testen sonst unmöglich ist).
- Bei Unklarheit fragen, bevor gebaut wird. Änderungen klein und überprüfbar halten.

---

## Leitprinzip `/admin`

**Viel möglich, aber übersichtlich.** Grosse Funktion, kleine/ruhige Ansicht,
einfache Bedienung. Keine technischen Begriffe, keine überladenen Panels — im
Zweifel weglassen oder hinter einer klaren Aktion verstecken.

## Ideen / Backlog (später)

- Aus dem Pool/Repo Fotos wirklich löschen inkl. Hinweis, wo sie verwendet werden.
- Serien löschen im Werkzeug (anlegen geht schon).
- Sveltia (`/admin/cms`) ganz abschalten, sobald das Werkzeug im Alltag trägt.
  (Kein OAuth-Login — der Token bleibt, siehe oben.)

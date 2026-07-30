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

## Leitprinzip `/admin/anordnen`

**Viel möglich, aber übersichtlich.** Grosse Funktion, kleine/ruhige Ansicht,
einfache Bedienung. Keine technischen Begriffe, keine überladenen Panels — im
Zweifel weglassen oder hinter einer klaren Aktion verstecken.

## Ideen / Backlog (später)

- Aus dem Pool/Repo Fotos wirklich löschen inkl. Hinweis, wo sie verwendet werden.
- Serien löschen im Werkzeug (anlegen geht schon).
- OAuth-Login statt Token; Umzug des Werkzeugs auf `/admin`, Sveltia abschalten.

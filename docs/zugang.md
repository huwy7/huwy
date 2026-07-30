# Zugangs-Tor — was es ist und was nicht

## Aktueller Stand (Platzhalter)

Auf jeder Seite liegt ein Tor mit einem Eingabefeld. Erst nach Eingabe des
Codes wird der Inhalt sichtbar; die Freischaltung merkt sich der Browser nur für
den **aktuellen Besuch** (`sessionStorage`). Bei jedem neuen Aufruf der Seite
(neuer Tab, Browser geschlossen und wieder geöffnet) wird der Code erneut
verlangt — innerhalb eines Besuchs kann man aber zwischen Start- und Serienseiten
wechseln, ohne ihn erneut einzugeben. Code ist als SHA-256-Hash im Skript
hinterlegt (`Basis.astro`).

**Platzhalter-Code:** `sesam`. Zum Ändern: neuen SHA-256-Hash bilden und `TOR_HASH`
in `src/layouts/Basis.astro` ersetzen (oder mir den gewünschten Code sagen, ich
tausche den Hash).

## Bilder laden erst nach dem Entsperren

Die Portfolio-Fotos werden **nicht mehr am Sperrbildschirm vorgeladen** — erst
nach korrekter Code-Eingabe (aufgeschobenes Laden, siehe `docs/lernnotizen.md`).
Am Tor liegt damit kein einziges Foto im Netzwerk-Tab, und der Übergang blendet
weich vom scharfen Tor-Bild auf den blur+grain-Hintergrund. Das hebt die Hürde
gegen „mal kurz per F12 die Bilder ansehen" — **ändert aber nichts** am Folgenden:
die Bild-URLs stehen weiterhin im Quelltext/DOM und sind nach dem Laden öffentlich
abrufbar.

## ⚠️ Wichtig: Das ist KEIN echter Schutz

Auf einer **statischen Seite bei GitHub Pages** kann ein Passwortfeld die Bilder
**nicht** wirklich schützen. Das Tor hält nur **zufällige Besucher** ab. Wer will,
kommt trotzdem an alles:

- Die **Bild-Dateien** liegen unter festen, öffentlichen URLs
  (`hey.hu-wy.ch/_astro/…webp|avif|jpeg`) und sind **direkt abrufbar** — das Tor
  läuft nur im Browser und schützt die Dateien nicht.
- Die **HTML-Seiten** werden ebenfalls öffentlich ausgeliefert; das Tor wird nur
  clientseitig davorgelegt.
- Das **GitHub-Repository ist öffentlich** — die Original-Fotos in
  `src/assets/serien/` sind damit direkt auf github.com sichtbar.

**Fazit: Für wirklich private Fotos ist dieses Tor nicht ausreichend.** Es ist ein
optischer Vorhang, kein Schloss.

## Wenn es echt privat sein soll

Dafür braucht es Zugangskontrolle **vor** der Auslieferung — nicht im Browser:

1. **Repository auf privat** stellen (sonst sind die Quelldateien ohnehin
   öffentlich). GitHub Pages aus einem privaten Repo braucht einen kostenpflichtigen
   Plan (GitHub Pro o. ä.).
2. **Echte Zugangskontrolle** davorschalten, z. B.:
   - **Cloudflare Access** (Zero Trust, kostenlose Stufe) vor der Domain — dazu muss
     der Traffic durch Cloudflare laufen (Proxy/orange Wolke statt „DNS only"), was
     mit dem GitHub-Pages-Zertifikat abgestimmt werden muss.
   - oder Hosting auf einer Plattform mit eingebautem Schutz (z. B. Cloudflare Pages
     mit Access, Netlify mit Passwortschutz).

Ohne so etwas gilt: **keine wirklich privaten/sensiblen Fotos hochladen** — sie
wären trotz Tor öffentlich erreichbar.

# CMS — Sveltia (Build-Plan Phase 6)

> **Aktuell:** Die Hauptoberfläche ist das eigene Werkzeug unter **`/admin`**
> (`public/admin/`, siehe `docs/feature-checkliste.md`). Sveltia liegt seither als
> **Rückfall** unter **`/admin/cms`**. Die Pfadangaben unten sind entsprechend zu
> lesen: `public/admin/cms/index.html` und `public/admin/cms/config.yml`.

Sveltia CMS liegt unter `/admin/cms` und ist gegen die Collection `serien`
(Spezifikation 7) konfiguriert. Es ist Komfort, keine Abhängigkeit: Serien lassen
sich jederzeit per Markdown-Datei und Commit pflegen, und die Seite baut und
funktioniert unverändert, wenn `/admin` gelöscht wird.

## Dateien

- `public/admin/cms/index.html` — lädt Sveltia CMS (`@sveltia/cms`) vom CDN. Nur im
  `/admin`, nicht auf der öffentlichen Seite.
- `public/admin/cms/config.yml` — Backend, Medienordner und die Felder der Collection.

Die Felder: `titel`, `jahr`, `reihenfolge`, `titelbild` (zugleich das **erste
Bild** der Serie) und die einfache Bild-Liste `bilder` (weitere Bilder, reine
Uploads ohne Textfelder); der Markdown-Körper ist der optionale Einleitungstext.
Alt-Texte sind entfallen (bewusst schlanker, siehe CLAUDE.md Regel 4). Bilder
werden pro Serie nach `src/assets/serien/<slug>/` gelegt (relativ zur
Markdown-Datei), passend zu `astro:assets`.

## Offen — vom Betreiber zu erledigen

**1. OAuth-Vermittler für das GitHub-Backend.** Das ist der einzige fummelige
Schritt (Spezifikation 8). Ich konnte das **aktuelle** Sveltia-Verfahren aus der
Bau-Umgebung **nicht verifizieren** (Doku nicht erreichbar), und habe deshalb
bewusst nichts improvisiert. Vor dem Live-Gang:

- Aktuelle Sveltia-Dokumentation zum GitHub-Backend / zur Authentifizierung
  lesen.
- Eine GitHub-OAuth-App anlegen und den Vermittler nach aktueller Doku aufsetzen
  (Sveltia stellt dafür üblicherweise einen Cloudflare-Worker bereit).
- In `config.yml` unter `backend` die passenden Werte (z. B. `base_url` /
  `auth_endpoint`) ergänzen.
- Weicht das aktuelle Verfahren von Spezifikation 8 ab: melden, nicht
  improvisieren.

**2. Live-Test der Abnahmekriterien.** Folgende Punkte aus Phase 6 lassen sich
erst nach Deployment und eingerichtetem OAuth prüfen:

- Anmeldung über GitHub funktioniert.
- Eine neue Serie lässt sich vollständig im Browser anlegen, inklusive
  Bildupload.
- Der erzeugte Commit validiert gegen das zod-Schema (Feld-Mapping und die
  relativen Bildpfade `../../assets/serien/<slug>/…` im Zweifel hier
  gegenprüfen).
- Das Bearbeiten funktioniert auch auf dem Telefon.

Bereits erfüllt: Die Seite baut und funktioniert unverändert, wenn `/admin`
gelöscht wird (reiner Static-Passthrough, kein Einfluss auf den Build).

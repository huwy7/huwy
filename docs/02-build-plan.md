# Build-Plan

Sieben Phasen. Eine Phase pro Durchgang. Nach jeder Phase stoppen und die
Abnahmekriterien prüfen lassen, bevor die nächste beginnt.

Jede Phase enthält einen fertigen Prompt zum Einfügen in Claude Code.

---

## Phase 0 — Setup

> Lies `CLAUDE.md` und `docs/01-spezifikation.md`. Lege ein neues Astro-Projekt mit
> TypeScript im `strict`-Modus an, minimales Template, keine Integrationen ausser
> `@astrojs/sitemap`. Erstelle die Ordnerstruktur aus CLAUDE.md Abschnitt 5. Lege
> `src/styles/tokens.css` mit allen Custom Properties aus Spezifikation Abschnitt 2,
> 3 und 4 an. Binde beide Schriften selbst gehostet als WOFF2 ein und prüfe zuvor
> ihren Lizenzstand — ist eine davon nicht frei nutzbar, melden statt ersetzen.
> Kein Layout, keine Seiten, keine Komponenten in dieser Phase.

**Abnahme**
- [ ] `npm run dev` startet, `npm run build` läuft durch
- [ ] `tokens.css` enthält jeden Wert aus Spec 2/3/4 und keinen zusätzlichen
- [ ] Beide Schriften selbst gehostet, kein Aufruf an ein Fremd-CDN im Netzwerk-Tab
- [ ] Lizenzstand beider Schriften im Repo dokumentiert
- [ ] `package.json` enthält keine Dependency, die nicht in CLAUDE.md Abschnitt 3 steht

---

## Phase 1 — Grundlayout

> Baue `src/layouts/Basis.astro` mit Header und Fusszeile nach Spezifikation 6.1,
> plus `global.css` mit Reset und Basistypografie. Lege alle sechs Seiten als leere
> Hüllen an, die dieses Layout benutzen. Verwende `TODO_NAME` und `TODO_MAIL` als
> Platzhalter. Keine Bilder, kein Content, keine Serien.

**Abnahme**
- [ ] Header 80px, statisch, nicht sticky
- [ ] Skip-Link vorhanden und per Tastatur erreichbar
- [ ] Auf 375px kein horizontaler Scroll
- [ ] Alle sechs Routen erreichbar
- [ ] Kein einziger Farb-, Grössen- oder Abstandswert direkt im Code — alles über
      Custom Properties

---

## Phase 2 — Content-Modell

> Lege die Content Collection `serien` exakt nach Spezifikation Abschnitt 7 an.
> Erstelle drei Beispielserien mit Platzhaltertexten und je fünf grauen
> Platzhalterbildern in gemischten Formaten (mindestens ein Hochformat 2:3, ein
> Querformat 3:2, ein Quadrat), damit die Normierungsregel testbar ist. Erzeuge die
> Platzhalter programmatisch als einfarbige Flächen, keine Stockfotos.

**Abnahme**
- [ ] `npx astro check` sauber, Schema greift
- [ ] Drei Serien mit korrekt gesetzter `reihenfolge`
- [ ] Platzhalterbilder decken alle drei Seitenverhältnisse ab

---

## Phase 3 — Startseite und Serienseiten

> Baue die Startseite nach Spezifikation 6.1 und die dynamische Route
> `/serien/[slug]` nach 6.2. Setze die Bildnormierung aus Abschnitt 5.1 und die
> Vorschau-Regel aus 5.2 um. Alle Bilder über `astro:assets`.

**Abnahme**
- [ ] Hoch- und Querformat haben auf dem Desktop dieselbe Höhe und wirken gleich gross
- [ ] Auf 375px füllen alle Bilder die Breite, das Querformat ist nicht winzig
- [ ] Vorschaubilder auf der Startseite haben alle exakt 3:2
- [ ] Abstände: 15vh zwischen Serien auf der Startseite, 12vh zwischen Bildern auf
      der Serienseite, 48px auf Mobile
- [ ] „Nächste Serie" verlinkt zyklisch, die letzte Serie zeigt auf die erste
- [ ] Kein Hover-Effekt auf Bildern ausser der bewussten Cursor-Invertierung
      (`filter: invert(1)` beim Hover, CLAUDE.md 4a/5), kein Lightbox
- [ ] Ausgelieferte Seite enthält kein clientseitiges JavaScript ausser dem
      Cursor-Skript (Progressive Enhancement, CLAUDE.md 4a)

---

## Phase 4 — Restliche Seiten

> Fülle `/ueber`, `/kontakt`, `/404`. `/impressum` und `/datenschutz` bekommen nur
> Struktur und einen sichtbaren `TODO`-Hinweis — die Texte liefert der Betreiber.
> Layoutregeln aus Spezifikation 6.3 bis 6.6.

**Abnahme**
- [ ] Zweispaltiges Über-Layout kippt bei 768px korrekt
- [ ] Kein Fliesstext zentriert, keine Zeile länger als 60ch
- [ ] Kontaktseite enthält kein Formular

---

## Phase 5 — Bilder, Meta, Performance

> Konfiguriere die Bildverarbeitung nach Spezifikation 5.3 und 5.4. Kalibriere die
> Qualitätsstufen an einem echten körnigen Schwarzweissbild, nicht am Standardwert —
> Korn ist genau das, was Codecs zuerst wegwerfen. Prüfe, ob die Pipeline monochrom
> kodieren kann und ob AVIF-Korn-Synthese verfügbar ist; berichte beide Befunde.
> Ergänze danach Meta-Tags, Open-Graph-Bilder, `sitemap.xml`, `robots.txt`, JSON-LD
> und Favicons nach Abschnitt 10. Miss das Budget aus 5.5 und berichte die Werte.

**Abnahme**
- [ ] AVIF und WebP werden ausgeliefert, JPEG als Fallback
- [ ] Korn ist im ausgelieferten Bild bei 100 % Ansicht sichtbar erhalten, nicht
      glattgebügelt — im direkten Vergleich zur Quelldatei geprüft
- [ ] Gewählte Qualitätsstufen samt Begründung im Repo dokumentiert
- [ ] Befund zu Monochrom-Kodierung und AVIF-Korn-Synthese berichtet
- [ ] Kein `filter` auf Bildern ausser der bewussten Hover-Invertierung des
      Cursor-Effekts (`filter: invert(1)`, CLAUDE.md 4a/5)
- [ ] Jedes `<img>` hat `width`, `height`, `alt`
- [ ] Erstes Bild der Startseite `eager` und `fetchpriority="high"`, alle anderen `lazy`
- [ ] Kein ausgeliefertes Bild über 700 KB
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90, gemessen und berichtet
- [ ] CLS unter 0.05

---

## Phase 6 — CMS

> Richte Sveltia CMS unter `/admin` gegen die Collection aus Spezifikation 7 ein.
> Prüfe zuerst die aktuelle Sveltia-Dokumentation zum GitHub-Backend und
> OAuth-Vermittler — das Verfahren kann sich geändert haben. Weicht es von
> Spezifikation Abschnitt 8 ab, melden statt improvisieren.

**Abnahme**
- [ ] Anmeldung über GitHub funktioniert
- [ ] Eine neue Serie lässt sich vollständig im Browser anlegen, inklusive Bildupload
- [ ] Der erzeugte Commit validiert gegen das zod-Schema
- [ ] Das Bearbeiten funktioniert auch auf dem Telefon
- [ ] Die Seite baut und funktioniert unverändert, wenn `/admin` gelöscht wird

---

## Phase 7 — Launch

> Bereite das Deployment auf Cloudflare Pages nach Spezifikation 11 vor und führe
> die Startcheckliste unten durch. Berichte jeden Punkt einzeln mit Befund.

**Checkliste**
- [ ] Domain `TODO_DOMAIN` aufgeschaltet, `www` leitet auf die nackte Domain um
- [ ] HTTPS erzwungen, HSTS aktiv
- [ ] Auf einem echten iPhone in Safari geprüft, nicht nur im Responsive-Modus
- [ ] Alle internen Links funktionieren, keine 404 ausser der 404-Seite
- [ ] `mailto:`-Link öffnet korrekt
- [ ] Alle `TODO_`-Platzhalter ersetzt — repoweit greppen
- [ ] Impressum und Datenschutzerklärung mit echten Texten gefüllt
- [ ] `sitemap.xml` erreichbar und vollständig
- [ ] Seite ohne JavaScript im Browser aufgerufen — sie muss vollständig funktionieren
      (der invertierte Cursor aus CLAUDE.md 4a ist optionale Progressive Enhancement)

---

## Nach dem Launch

Alles Weitere ist eine neue Entscheidung, kein offener Punkt. Insbesondere gilt der
Nicht-Ziele-Katalog aus CLAUDE.md unverändert weiter. Wenn eine vierte Serie
dazukommt, ist das eine Markdown-Datei — kein Anlass, die Architektur zu ändern.

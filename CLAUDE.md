# CLAUDE.md

Kontextdatei für Claude Code. Vor jeder Aufgabe lesen. Verbindlich.

---

## 1. Was hier gebaut wird

Ein Fotografie-Portfolio. Eine Person, drei Bildserien, rund 30 Bilder. Statische
Website, deutschsprachig, keine Anwendungslogik.

**Das einzige Ziel der Seite:** Besucher sehen die Bilder gross, schnell und ohne
Ablenkung, und finden danach die Mailadresse.

### Nicht-Ziele

Diese Dinge werden **nicht** gebaut. Nicht vorschlagen, nicht vorbereiten, keine
Platzhalter dafür anlegen:

- Shop, Warenkorb, Preisliste, Print-Verkauf
- Kundengalerien, Login, Passwortschutz
- Blog, News, Tagebuch
- Kontaktformular (bewusste Entscheidung — es gibt kein Backend)
- Newsletter, Analytics, Cookie-Banner, Consent-Manager
- Mehrsprachigkeit, i18n-Setup, Sprachumschalter
- Dark Mode
- Suche, Filter, Tags, Kategorien
- Korn-, Rausch- oder Textur-Overlay über Seite oder Bildern
- Filmrand-Grafik, Sprocket-Löcher, Scan-Artefakte, Vignetten, Polaroid-Rahmen
- Laufende Bildnummern, Indizes, Kontaktbogen-Ansicht

---

## 2. Offene Punkte

Diese Werte fehlen. Überall `TODO:` als Platzhalter verwenden und beim ersten
Auftreten einmal nachfragen — nicht erfinden, nicht raten:

| Platzhalter | Bedeutung |
|---|---|
| `TODO_NAME` | Name der Fotografin / des Fotografen, Wortmarke im Header |
| `TODO_DOMAIN` | Die bereits registrierte Domain |
| `TODO_MAIL` | Kontakt-Mailadresse |
| `TODO_SERIEN` | Titel und Jahr der Serien |

---

## 3. Stack

| | | Begründung |
|---|---|---|
| Framework | Astro (aktuelle stabile Version) | Statisch, kein Client-JS nötig, Bild-Pipeline eingebaut |
| Sprache | TypeScript, `strict` | |
| Styling | Vanilla CSS mit Custom Properties | Bei sechs Seiten ist ein Utility-Framework nur Konfigurationsaufwand |
| Content | Astro Content Collections, Markdown | |
| Bilder | `astro:assets` | |
| CMS | Sveltia CMS | Git-basiert, kein Backend, Browser-Oberfläche |
| Hosting | Cloudflare Pages, Build aus GitHub | |

**Falls eine dieser Entscheidungen im Weg steht:** melden und begründen, nicht
eigenmächtig ersetzen.

---

## 4. Harte Regeln

1. **Keine neue Dependency ohne Rückfrage.** Ausnahmen: nichts. Auch keine
   Utility-Bibliothek, kein Icon-Paket, kein Animationsframework, kein Lightbox-Plugin.
2. **Kein React, Vue, Svelte, Solid.** Keine Astro-Islands. Die ausgelieferte Seite
   enthält kein clientseitiges JavaScript, ausser dort, wo diese Doku es ausdrücklich
   erlaubt (aktuell: nirgends).
3. **Jedes Bild läuft über `astro:assets`.** Nie ein rohes `<img src="/foto.jpg">`.
4. **Jedes Bild braucht ein `alt`.** Leeres `alt=""` nur bei rein dekorativen Bildern —
   in diesem Projekt existieren keine.
5. **Keine Effekte auf Bildern.** Kein Hover-Zoom, kein Schatten, kein Rahmen, kein
   `border-radius`, kein Filter, kein Ken-Burns-Effekt, kein Fade-in beim Scrollen.
   Insbesondere kein `filter: grayscale()`, `contrast()` oder `sepia()` — die Bilder
   sind bereits schwarzweiss, die Seite verändert sie nicht.
6. **Der raue Ton kommt aus den Bildern, nicht aus dem Layout.** Die Seite ist
   weiss, ruhig und diszipliniert. Der einzige gestalterische Bruch ist die
   Monospace für Beschriftungen (Spezifikation 3.1). Diesen Bruch nicht an weiteren
   Stellen wiederholen und nicht durch Texturen, Rahmen oder Effekte verstärken.
7. **Keine Werte hardcoden, die in `tokens.css` stehen.** Immer die Custom Property.
8. **Sentence case in allen Beschriftungen.** Kein Title Case, kein ALL CAPS, kein
   `letter-spacing`-Tuning.
9. **Keine Bilder oder Texte erfinden.** Platzhalterbilder in Phase 1–3 sind graue
   Flächen mit korrektem Seitenverhältnis, keine Stockfotos, keine generierten Bilder.
10. **Kein Rechtsklick-Blocker, kein `user-select: none`, kein Wasserzeichen-Overlay.**
11. **Bildwirkung vor Dateigrösse.** Wird ein Performance-Budget gerissen, ist die
    Antwort eine kleinere Ausgangsauflösung, niemals stärkere Kompression.

---

## 5. Konventionen

```
src/
  content/
    serien/            eine Markdown-Datei pro Serie
  assets/
    serien/<slug>/     Bilder der Serie, von astro:assets verarbeitet
  components/
  layouts/
  pages/
  styles/
    tokens.css         alle Custom Properties, einzige Quelle für Werte
    global.css         Reset, Basistypografie
public/
  admin/               Sveltia CMS
docs/
```

- Dateinamen und Slugs: `kebab-case`, keine Umlaute, keine Leerzeichen
- Komponentenstile bleiben in der `.astro`-Datei (Astro scoped styles). Global nur,
  was wirklich global ist.
- Commits auf Deutsch, imperativ, eine Sache pro Commit

---

## 6. Definition of done

Eine Aufgabe gilt erst als erledigt, wenn **alle** Punkte erfüllt sind:

- [ ] `npm run build` läuft ohne Fehler und ohne Warnungen
- [ ] `npx astro check` ist sauber
- [ ] Auf 375px Breite und auf 1440px Breite geprüft, kein horizontaler Scroll
- [ ] Tastaturbedienung möglich, Fokus sichtbar
- [ ] Kein Element ohne Custom Property gestylt, wo eine existiert
- [ ] Die Abnahmekriterien der jeweiligen Phase aus `docs/02-build-plan.md` sind erfüllt

---

## 7. Arbeitsweise

- Eine Phase aus `docs/02-build-plan.md` pro Durchgang. Nicht vorgreifen.
- Vor dem Schreiben von Code: `docs/01-spezifikation.md` zum betroffenen Bereich lesen.
- Bei Widerspruch zwischen dieser Datei und der Spezifikation: **diese Datei gewinnt**,
  und den Widerspruch melden.
- Bei Unklarheit: fragen. Keine Annahme treffen und weiterbauen.

/*
  Ordnet jedem Bild-Eintrag einer Sammlung seine Aufnahmedaten zu (Blende, Zeit,
  ISO, Brennweite) für den Polaroid-Streifen unter dem Foto (Serie.astro).

  Warum der Umweg über die Markdown-Dateien: `ImageMetadata` aus `astro:assets`
  trägt in Astro 7 KEINEN Dateipfad — nur die fertige URL mit Hash. Der Weg über
  den Bild-`src` wäre ein Rateweg (Basename aus dem Hash-Dateinamen zurückrechnen)
  und bräche, sobald zwei Serien eine gleich benannte Datei haben. Darum lesen wir
  die Frontmatter-Zeile `bild:` direkt aus der Markdown-Datei und lösen sie relativ
  zu dieser Datei auf — das ist exakt derselbe Pfad, den auch Astro auflöst.

  Läuft nur zur Bauzeit in Node; im Browser-Bundle landet nichts davon.
*/
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { leseAufnahmedaten, type Aufnahmedaten } from './exif';

/*
  Wurzel bewusst über process.cwd() und NICHT über import.meta.url: beim
  `astro build` wird dieses Modul nach `dist/.prerender/` gebündelt, ein relativ
  zur Moduldatei aufgelöster Pfad zeigt dann ins Leere (still, weil readdirSync
  nur wirft und wir eine leere Map zurückgeben — der Streifen fehlte einfach).
  `astro dev` und `astro build` laufen beide mit der Projektwurzel als
  Arbeitsverzeichnis, auch im Deploy-Workflow, der die beiden Checkouts über
  `working-directory` baut.
*/
const WURZEL = process.cwd();

/**
 * Liest alle Markdown-Dateien eines Bild-Ordners und gibt eine Zuordnung
 * `Eintrags-Id → Aufnahmedaten` zurück. Bilder ohne verwertbare EXIF fehlen in
 * der Map; der Streifen erscheint dort dann gar nicht (siehe Serie.astro).
 *
 * @param ordner Ordnername unter `src/content/`, z. B. 'serienbilder'
 */
export function ladeAufnahmedaten(ordner: string): Map<string, Aufnahmedaten> {
  const basis = resolve(WURZEL, 'src/content', ordner);
  const karte = new Map<string, Aufnahmedaten>();

  let dateien: string[];
  try {
    dateien = readdirSync(basis).filter((d) => d.endsWith('.md'));
  } catch {
    return karte; // Ordner fehlt — dann eben keine Daten.
  }

  for (const datei of dateien) {
    const pfad = resolve(basis, datei);
    let inhalt: string;
    try {
      inhalt = readFileSync(pfad, 'utf8');
    } catch {
      continue;
    }
    // Frontmatter-Zeile `bild: ../../assets/...`. Anführungszeichen sind erlaubt,
    // weil das CMS sie je nach Wert setzt.
    const treffer = inhalt.match(/^bild:\s*["']?(.+?)["']?\s*$/m);
    if (!treffer) continue;

    const daten = leseAufnahmedaten(resolve(dirname(pfad), treffer[1]));
    if (daten) karte.set(datei.replace(/\.md$/, ''), daten);
  }

  return karte;
}

export type { Aufnahmedaten };

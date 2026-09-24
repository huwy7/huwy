import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { ladeAufnahmedaten } from './aufnahmedaten';
import type { Aufnahmedaten } from './exif';

// Serien laden und Adressen bilden — an EINER Stelle, weil das inzwischen an
// vielen Orten gebraucht wird: die beiden Portfolio-Startseiten, die Serienseiten
// je Serie, und das Menüband (das auf JEDER Seite steht und die Serien auflisten
// muss, auch auf About me).
//
// Beide Modi tragen denselben Aufbau, nur andere Sammlungen:
//   düster  serien      + serienbilder
//   farbig  farbserien  + farbbilder

export type Modus = 'duester' | 'farbe';

export interface SerieMitBildern {
  slug: string;
  titel: string;
  jahr: number;
  bilder: { bild: ImageMetadata; daten?: Aufnahmedaten }[];
}

/** Basis-Pfad der Astro-Installation ('' bei main, '/feature' in der Vorschau). */
const basis = () => import.meta.env.BASE_URL.replace(/\/$/, '');

/** Startseite des jeweiligen Modus. */
export function portfolioUrl(modus: Modus): string {
  return modus === 'farbe' ? `${basis()}/color` : `${basis()}/`;
}

/**
 * Adresse EINER Serie. Jede Serie hat seit dem Umbau auf ein durchgehendes
 * Menüband eine eigene Seite: nur so lässt sich von About me aus auf eine Serie
 * zeigen, und nur so ist eine Serie überhaupt verlinkbar.
 * Bewusst eigene Seiten statt Hash-Links (`/#bern`): der Hash ist bereits vom
 * Vollbild belegt (`#lb-<slug>`), ein zweiter Verwender würde sich damit ins
 * Gehege kommen.
 * Der Slug kommt aus dem TITEL, nicht aus dem Dateinamen — `/serie/cdmx` statt
 * `/serie/serie-eins` (siehe `titelSlug`).
 */
export function serieUrl(modus: Modus, slug: string): string {
  return modus === 'farbe' ? `${basis()}/color/serie/${slug}` : `${basis()}/serie/${slug}`;
}

/**
 * Titel → Slug für die Adresse. Aus „CDMX" wird `cdmx`, aus „Beispiel farbserie
 * zwei" wird `beispiel-farbserie-zwei`.
 *
 * Vorher stand der Dateiname der Sammlung in der Adresse (`/serie/serie-eins`).
 * Das ist eine interne Ordnungsnummer und sagt einem Besucher nichts — im Link,
 * den man teilt oder in der Adresszeile liest, soll die Serie beim Namen genannt
 * werden.
 *
 * Reihenfolge der Schritte ist wichtig: die deutschen Umlaute werden ZUERST
 * ausgeschrieben (ü → ue), sonst macht die anschliessende Zerlegung daraus ein
 * blosses „u". Danach fallen übrige Akzente weg (é → e, í → i), damit auch
 * „México" oder „Zürich" eine saubere Adresse bekommen.
 * Ergebnis ist kebab-case ohne Umlaute und Leerzeichen (CLAUDE.md Abschnitt 5).
 */
export function titelSlug(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Alle Serien eines Modus, nach `reihenfolge` sortiert, ohne leere. */
export async function ladeSerien(modus: Modus): Promise<SerieMitBildern[]> {
  const farbe = modus === 'farbe';
  const serienSammlung = farbe ? 'farbserien' : 'serien';
  const bilderSammlung = farbe ? 'farbbilder' : 'serienbilder';

  const meta = (await getCollection(serienSammlung)).sort(
    (a, b) => a.data.reihenfolge - b.data.reihenfolge,
  );
  const alleBilder = await getCollection(bilderSammlung);
  // Aufnahmedaten (Blende/Zeit/ISO/Brennweite) zur Bauzeit aus den Bilddateien,
  // für den Polaroid-Streifen unter dem Foto. Bilder ohne EXIF bekommen
  // `undefined` und zeigen keinen Streifen.
  const daten = ladeAufnahmedaten(bilderSammlung);

  // Slug aus dem Titel. Zwei Rückfallebenen, damit der Build nie an einem
  // ungünstigen Titel scheitert und nie zwei Serien dieselbe Adresse bekommen:
  //   · ergibt der Titel keinen brauchbaren Slug (z. B. nur Satzzeichen), gilt
  //     der Dateiname der Sammlung
  //   · ist der Slug schon vergeben, gilt ebenfalls der Dateiname — der ist von
  //     Haus aus eindeutig
  // Kein Durchnummerieren: `…-2` wäre von der Reihenfolge abhängig und würde
  // Adressen verschieben, sobald der Betreiber Serien umsortiert.
  const vergeben = new Set<string>();
  const slugFuer = (id: string, titel: string) => {
    const aus_titel = titelSlug(titel);
    const slug = aus_titel && !vergeben.has(aus_titel) ? aus_titel : id;
    vergeben.add(slug);
    return slug;
  };

  return meta
    .map((serie) => ({
      slug: slugFuer(serie.id, serie.data.titel),
      titel: serie.data.titel,
      jahr: serie.data.jahr,
      bilder: alleBilder
        .filter((b) => b.data.serie === serie.id)
        .sort((a, b) => a.data.reihenfolge - b.data.reihenfolge)
        .map((b) => ({ bild: b.data.bild, daten: daten.get(b.id) })),
    }))
    .filter((s) => s.bilder.length > 0);
}

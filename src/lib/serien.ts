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
 */
export function serieUrl(modus: Modus, slug: string): string {
  return modus === 'farbe' ? `${basis()}/color/serie/${slug}` : `${basis()}/serie/${slug}`;
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

  return meta
    .map((serie) => ({
      slug: serie.id,
      titel: serie.data.titel,
      jahr: serie.data.jahr,
      bilder: alleBilder
        .filter((b) => b.data.serie === serie.id)
        .sort((a, b) => a.data.reihenfolge - b.data.reihenfolge)
        .map((b) => ({ bild: b.data.bild, daten: daten.get(b.id) })),
    }))
    .filter((s) => s.bilder.length > 0);
}

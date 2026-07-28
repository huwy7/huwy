import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema exakt nach Spezifikation Abschnitt 7.
// Abweichung von der Spec-Vorlage: Astro 7 hat die alten Collections
// (`type: 'content'`) durch die Content-Layer-API ersetzt. Statt `type: 'content'`
// wird deshalb der `glob`-Loader verwendet. Das zod-Schema selbst ist unverändert.
// Der Markdown-Körper bleibt der Einleitungstext der Serienseite.
const serien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/serien' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      jahr: z.number().int(),
      reihenfolge: z.number().int(), // Sortierung auf der Startseite
      // Titelbild ist zugleich das erste Bild der Serie (Vorschau auf der
      // Startseite + erstes Bild auf der Serienseite).
      titelbild: image(),
      // Weitere Bilder der Serie, einfache Liste von Bild-Uploads (kein Alt-Text).
      bilder: z.array(image()).default([]),
    }),
});

export const collections = { serien };

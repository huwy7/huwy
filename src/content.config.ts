import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Gemeinsames Schema für beide Serien-Sammlungen (düster + farbig): identisch
// einfach — Titelbild ist zugleich das erste Bild, weitere Bilder als Liste, kein
// Alt-Text (CLAUDE.md Regel 4). Astro 7: glob-Loader statt `type: 'content'`.
const serienSchema = ({ image }: SchemaContext) =>
  z.object({
    titel: z.string(),
    jahr: z.number().int(),
    reihenfolge: z.number().int(), // Sortierung auf der Startseite
    titelbild: image(),
    bilder: z.array(image()).default([]),
  });

// Schwarzweiss-Serien (düsterer Standard-Modus).
const serien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/serien' }),
  schema: serienSchema,
});

// Farbserien (farbiger Modus, /color) — eigener Bereich, gleiche Struktur.
const farbserien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/farbserien' }),
  schema: serienSchema,
});

export const collections = { serien, farbserien };

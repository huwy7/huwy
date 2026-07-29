import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Flaches Bild-Modell: Serien tragen nur noch Metadaten (Titel, Jahr, Reihenfolge).
// Jedes Bild ist ein eigener Eintrag mit Serie (Slug) + Reihenfolge — so lässt es
// sich im CMS zentral hochladen und einer Serie zuweisen, ohne verschachtelte Listen.
const serienMetaSchema = z.object({
  titel: z.string(),
  jahr: z.number().int(),
  reihenfolge: z.number().int(), // Reihenfolge der Serie auf der Seite (1 = zuoberst)
});

const bildSchema = ({ image }: SchemaContext) =>
  z.object({
    bild: image(),
    serie: z.string(), // Slug der zugehörigen Serie
    reihenfolge: z.number().int(), // Position innerhalb der Serie (1 = erstes/Titelbild)
  });

// Schwarzweiss (düster)
const serien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/serien' }),
  schema: serienMetaSchema,
});
const serienbilder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/serienbilder' }),
  schema: bildSchema,
});

// Farbe
const farbserien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/farbserien' }),
  schema: serienMetaSchema,
});
const farbbilder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/farbbilder' }),
  schema: bildSchema,
});

export const collections = { serien, serienbilder, farbserien, farbbilder };

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Produktive Domain. Wird für sitemap.xml, robots.txt und absolute
// Open-Graph-/Canonical-URLs benötigt (Spezifikation 10 und 11).
const site = 'https://hey.hu-wy.ch';

// Basis-Pfad. Standard '/' (main läuft im Wurzelverzeichnis). Der Feature-Branch
// wird im Deploy mit BASE_PATH=/feature gebaut und liegt dann unter /feature —
// eine abgesicherte Vorschau, ohne die Live-Seite (main, '/') zu berühren.
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  // Einzige erlaubte Integration (CLAUDE.md Abschnitt 3, Build-Plan Phase 0).
  integrations: [sitemap()],
});

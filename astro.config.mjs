// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Produktive Domain. Wird für sitemap.xml, robots.txt und absolute
// Open-Graph-/Canonical-URLs benötigt (Spezifikation 10 und 11).
const site = 'https://hey.hu-wy.ch';

// https://astro.build/config
export default defineConfig({
  site,
  // Einzige erlaubte Integration (CLAUDE.md Abschnitt 3, Build-Plan Phase 0).
  integrations: [sitemap()],
});

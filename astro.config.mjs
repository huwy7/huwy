// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO_DOMAIN: produktive Domain eintragen. Wird für sitemap.xml, robots.txt
// und absolute Open-Graph-URLs benötigt (Spezifikation 10 und 11).
const site = 'https://TODO_DOMAIN';

// https://astro.build/config
export default defineConfig({
  site,
  // Einzige erlaubte Integration (CLAUDE.md Abschnitt 3, Build-Plan Phase 0).
  integrations: [sitemap()],
});

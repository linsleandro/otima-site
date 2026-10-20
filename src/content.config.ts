import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Insights — espelho manual do Substack "Dados Sem Achismo" (spec sobre-contato-insights.md).
// Sincronização automática via RSS é decisão pendente com Leandro.
const insights = defineCollection({
  loader: glob({ base: './src/content/insights', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(300),
    pubDate: z.coerce.date(),
    substackUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };

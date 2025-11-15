import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    description: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
    tocDepth: z.number().default(3),
    lang: z.string().default('ko'),
    author: z.string().default('Tolerblanc'),
    series: z.object({
      name: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};

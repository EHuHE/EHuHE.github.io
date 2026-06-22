import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isSafeContentUrl } from "./lib/url";

const safeContentUrl = z.string().refine(isSafeContentUrl, {
  message: "URL must be site-relative, https:, or mailto:",
});

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: safeContentUrl.optional(),
  }),
});

const works = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    externalUrl: safeContentUrl.optional(),
    type: z.enum(["project", "resource", "note"]).default("project"),
  }),
});

const links = defineCollection({
  loader: glob({ base: "./src/content/links", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: safeContentUrl,
    kind: z.enum(["social", "writing", "tool", "contact"]),
    order: z.number().default(100),
  }),
});

export const collections = { posts, works, links };

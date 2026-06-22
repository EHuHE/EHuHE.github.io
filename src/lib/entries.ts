import type { CollectionEntry } from "astro:content";
import type { PostSummary } from "./content";

export type WorkEntry = CollectionEntry<"works">;
export type LinkEntry = CollectionEntry<"links">;
export type PostEntry = CollectionEntry<"posts">;

export interface WorkSummary {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  featured: boolean;
  externalUrl?: string;
  type: "project" | "resource" | "note";
}

export interface LinkSummary {
  id: string;
  title: string;
  description: string;
  url: string;
  kind: "social" | "writing" | "tool" | "contact";
  order: number;
}

export function toPostSummary(entry: PostEntry): PostSummary {
  return {
    id: entry.id,
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    tags: entry.data.tags,
    featured: entry.data.featured,
    draft: entry.data.draft,
  };
}

export function toWorkSummary(entry: WorkEntry): WorkSummary {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    tags: entry.data.tags,
    featured: entry.data.featured,
    externalUrl: entry.data.externalUrl,
    type: entry.data.type,
  };
}

export function toLinkSummary(entry: LinkEntry): LinkSummary {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    url: entry.data.url,
    kind: entry.data.kind,
    order: entry.data.order,
  };
}

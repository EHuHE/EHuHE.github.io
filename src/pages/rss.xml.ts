import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getVisiblePosts } from "../lib/content";
import { toPostSummary } from "../lib/entries";
import { siteProfile } from "../lib/site";
import { withBasePath } from "../lib/url";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL("https://ehuhe.github.io");
  const posts = getVisiblePosts((await getCollection("posts")).map(toPostSummary));
  const items = posts
    .map((post) => {
      const url = new URL(withBasePath(`/posts/${post.slug}/`), baseUrl).toString();

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(post.description)}</description>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.pubDate.toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteProfile.label)}</title>
        <description>${escapeXml(siteProfile.description)}</description>
        <link>${new URL(withBasePath("/"), baseUrl).toString()}</link>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};

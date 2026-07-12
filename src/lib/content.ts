export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  featured?: boolean;
  draft?: boolean;
}

const allTagLabels = new Set(["", "全部", "all"]);

export function sortPostsByDate<T extends Pick<PostSummary, "pubDate">>(posts: readonly T[]): T[] {
  return [...posts].sort((firstPost, secondPost) => {
    return secondPost.pubDate.getTime() - firstPost.pubDate.getTime();
  });
}

export function getVisiblePosts<T extends Pick<PostSummary, "draft" | "pubDate">>(
  posts: readonly T[],
): T[] {
  return sortPostsByDate(posts.filter((post) => !post.draft));
}

export function getRecentPosts<T extends Pick<PostSummary, "draft" | "pubDate">>(
  posts: readonly T[],
  limit: number,
): T[] {
  return getVisiblePosts(posts).slice(0, limit);
}

export function getFeaturedPosts<
  T extends Pick<PostSummary, "draft" | "featured" | "pubDate">,
>(posts: readonly T[], limit: number): T[] {
  const visiblePosts = getVisiblePosts(posts);
  const featuredPosts = visiblePosts.filter((post) => post.featured);
  const remainingSlots = Math.max(0, limit - featuredPosts.length);

  return [
    ...featuredPosts.slice(0, limit),
    ...visiblePosts.filter((post) => !post.featured).slice(0, remainingSlots),
  ];
}

export function getUniqueTags(posts: readonly Pick<PostSummary, "tags" | "draft">[]): string[] {
  const tags = posts
    .filter((post) => !post.draft)
    .flatMap((post) => post.tags)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return [...new Set(tags)].sort((firstTag, secondTag) => firstTag.localeCompare(secondTag, "zh-Hans-CN"));
}

export function filterPostsByTag<T extends PostSummary>(
  posts: readonly T[],
  selectedTag: string,
): T[] {
  const normalizedTag = selectedTag.trim().toLocaleLowerCase();
  const visiblePosts = getVisiblePosts(posts);

  if (allTagLabels.has(normalizedTag)) {
    return visiblePosts;
  }

  return visiblePosts.filter((post) => {
    return post.tags.some((tag) => tag.toLocaleLowerCase() === normalizedTag);
  });
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

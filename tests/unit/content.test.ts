import {
  filterPostsByTag,
  getFeaturedPosts,
  getRecentPosts,
  getUniqueTags,
  getVisiblePosts,
  formatDate,
  sortPostsByDate,
} from "../../src/lib/content";

const posts = [
  {
    id: "draft-note",
    slug: "draft-note",
    title: "草稿",
    description: "不会出现在页面里",
    pubDate: new Date("2026-01-01"),
    tags: ["随笔"],
    featured: false,
    draft: true,
  },
  {
    id: "astro-blog",
    slug: "astro-blog",
    title: "用 Astro 搭建学术主页",
    description: "静态站、内容集合和部署实践",
    pubDate: new Date("2026-05-20"),
    tags: ["Astro", "Static Site"],
    featured: true,
    draft: false,
  },
  {
    id: "typescript-notes",
    slug: "typescript-notes",
    title: "TypeScript 类型设计笔记",
    description: "把类型约束放在系统边界",
    pubDate: new Date("2026-06-02"),
    tags: ["TypeScript", "工程化"],
    featured: true,
    draft: false,
  },
  {
    id: "testing-loop",
    slug: "testing-loop",
    title: "测试驱动的开发节奏",
    description: "用单元测试和 E2E 固化关键行为",
    pubDate: new Date("2026-04-15"),
    tags: ["测试", "工程化"],
    featured: false,
    draft: false,
  },
];

describe("content utilities", () => {
  it("sorts posts by publish date without mutating the input", () => {
    const originalOrder = posts.map((post) => post.id);

    const sortedPosts = sortPostsByDate(posts);

    expect(sortedPosts.map((post) => post.id)).toEqual([
      "typescript-notes",
      "astro-blog",
      "testing-loop",
      "draft-note",
    ]);
    expect(posts.map((post) => post.id)).toEqual(originalOrder);
  });

  it("excludes draft posts from visible posts", () => {
    expect(getVisiblePosts(posts).map((post) => post.id)).toEqual([
      "typescript-notes",
      "astro-blog",
      "testing-loop",
    ]);
  });

  it("returns recent posts after draft filtering", () => {
    expect(getRecentPosts(posts, 2).map((post) => post.id)).toEqual([
      "typescript-notes",
      "astro-blog",
    ]);
  });

  it("prioritizes featured posts and fills remaining slots with recent visible posts", () => {
    const newerRegularPost = {
      id: "latest-regular-note",
      slug: "latest-regular-note",
      title: "最新的普通文章",
      description: "日期比精选文章新，但仍应在精选文章之后补位",
      pubDate: new Date("2026-06-10"),
      tags: ["随笔"],
      featured: false,
      draft: false,
    };
    const draftFeaturedPost = {
      id: "draft-featured-note",
      slug: "draft-featured-note",
      title: "草稿精选文章",
      description: "即使标记为精选也不应展示",
      pubDate: new Date("2026-06-12"),
      tags: ["随笔"],
      featured: true,
      draft: true,
    };

    expect(
      getFeaturedPosts([...posts, newerRegularPost, draftFeaturedPost], 4).map(
        (post) => post.id,
      ),
    ).toEqual([
      "typescript-notes",
      "astro-blog",
      "latest-regular-note",
      "testing-loop",
    ]);
  });

  it("filters posts by a case-insensitive tag", () => {
    expect(filterPostsByTag(posts, "typescript").map((post) => post.id)).toEqual([
      "typescript-notes",
    ]);
  });

  it("returns all visible posts when tag is empty or all", () => {
    expect(filterPostsByTag(posts, "全部").map((post) => post.id)).toEqual([
      "typescript-notes",
      "astro-blog",
      "testing-loop",
    ]);
  });

  it("returns unique tags from visible posts", () => {
    expect(getUniqueTags(posts)).toEqual([
      "测试",
      "工程化",
      "Astro",
      "Static Site",
      "TypeScript",
    ]);
  });

  it("formats dates for the Chinese locale", () => {
    expect(formatDate(new Date("2026-06-04T00:00:00.000Z"))).toMatch(/2026/);
  });
});

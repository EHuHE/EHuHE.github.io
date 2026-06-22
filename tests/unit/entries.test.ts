import { toLinkSummary, toPostSummary, toWorkSummary } from "../../src/lib/entries";

describe("entry mappers", () => {
  it("maps a post collection entry into a post summary", () => {
    const pubDate = new Date("2026-06-10");
    const summary = toPostSummary({
      id: "post-id",
      collection: "posts",
      data: {
        title: "文章标题",
        description: "文章摘要",
        pubDate,
        tags: ["TypeScript"],
        featured: true,
        draft: false,
      },
    } as never);

    expect(summary).toEqual({
      id: "post-id",
      slug: "post-id",
      title: "文章标题",
      description: "文章摘要",
      pubDate,
      tags: ["TypeScript"],
      featured: true,
      draft: false,
    });
  });

  it("maps a work collection entry into a work summary", () => {
    const pubDate = new Date("2026-05-30");
    const summary = toWorkSummary({
      id: "work-id",
      collection: "works",
      data: {
        title: "工具箱",
        description: "开发者资源",
        pubDate,
        tags: ["工具"],
        featured: false,
        externalUrl: "https://github.com/",
        type: "resource",
      },
    } as never);

    expect(summary.title).toBe("工具箱");
    expect(summary.externalUrl).toBe("https://github.com/");
    expect(summary.type).toBe("resource");
  });

  it("maps a link collection entry into a link summary", () => {
    const summary = toLinkSummary({
      id: "rss",
      collection: "links",
      data: {
        title: "RSS",
        description: "订阅文章",
        url: "/rss.xml",
        kind: "writing",
        order: 30,
      },
    } as never);

    expect(summary).toEqual({
      id: "rss",
      title: "RSS",
      description: "订阅文章",
      url: "/rss.xml",
      kind: "writing",
      order: 30,
    });
  });
});

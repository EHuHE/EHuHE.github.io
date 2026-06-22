import { getBasePath, isSafeContentUrl, withBasePath, withoutBasePath } from "../../src/lib/url";

describe("url utilities", () => {
  it("normalizes base paths", () => {
    expect(getBasePath("/repo")).toBe("/repo/");
    expect(getBasePath("repo/")).toBe("/repo/");
    expect(getBasePath("/")).toBe("/");
  });

  it("prefixes internal paths with the configured base path", () => {
    expect(withBasePath("/posts/", "/blog/")).toBe("/blog/posts/");
    expect(withBasePath("/", "/blog/")).toBe("/blog/");
  });

  it("does not prefix external, mail, or hash URLs", () => {
    expect(withBasePath("https://example.com", "/blog/")).toBe("https://example.com");
    expect(withBasePath("mailto:202521120012751@stu.hubu.edu.cn", "/blog/")).toBe(
      "mailto:202521120012751@stu.hubu.edu.cn",
    );
    expect(withBasePath("#content", "/blog/")).toBe("#content");
  });

  it("removes the configured base path from current routes", () => {
    expect(withoutBasePath("/blog/posts/", "/blog/")).toBe("/posts/");
    expect(withoutBasePath("/posts/", "/blog/")).toBe("/posts/");
  });

  it("allows only safe content-managed URLs", () => {
    expect(isSafeContentUrl("/posts/")).toBe(true);
    expect(isSafeContentUrl("https://example.com")).toBe(true);
    expect(isSafeContentUrl("mailto:202521120012751@stu.hubu.edu.cn")).toBe(true);
    expect(isSafeContentUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeContentUrl("//evil.example")).toBe(false);
    expect(isSafeContentUrl("http://example.com")).toBe(false);
  });
});

import worker, { getAssetCandidates } from "../../worker/index.js";

function createAssetEnv(files: Record<string, string>) {
  return {
    ASSETS: {
      async fetch(request: Request) {
        const pathname = new URL(request.url).pathname;
        const body = files[pathname];

        if (body === undefined) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(body, {
          headers: { "content-type": pathname.endsWith(".html") ? "text/html" : "text/plain" },
        });
      },
    },
  };
}

describe("Sites static worker", () => {
  it("maps clean Astro routes to their generated index files", () => {
    expect(getAssetCandidates("/")).toEqual(["/", "/index.html"]);
    expect(getAssetCandidates("/about/")).toEqual(["/about/", "/about/index.html"]);
    expect(getAssetCandidates("/posts/example")).toEqual([
      "/posts/example",
      "/posts/example/index.html",
    ]);
  });

  it("serves generated HTML and preserves static asset paths", async () => {
    const env = createAssetEnv({
      "/index.html": "<h1>Home</h1>",
      "/about/index.html": "<h1>About</h1>",
      "/images/avatar.jpg": "avatar",
    });

    const homeResponse = await worker.fetch(new Request("https://example.test/"), env);
    const aboutResponse = await worker.fetch(new Request("https://example.test/about/"), env);
    const imageResponse = await worker.fetch(
      new Request("https://example.test/images/avatar.jpg"),
      env,
    );

    expect(await homeResponse.text()).toContain("Home");
    expect(await aboutResponse.text()).toContain("About");
    expect(await imageResponse.text()).toBe("avatar");
  });

  it("returns 404 for missing files and 405 for unsupported methods", async () => {
    const env = createAssetEnv({});

    const missingResponse = await worker.fetch(
      new Request("https://example.test/missing"),
      env,
    );
    const postResponse = await worker.fetch(
      new Request("https://example.test/", { method: "POST" }),
      env,
    );

    expect(missingResponse.status).toBe(404);
    expect(postResponse.status).toBe(405);
    expect(postResponse.headers.get("allow")).toBe("GET, HEAD");
  });
});

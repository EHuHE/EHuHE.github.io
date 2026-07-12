import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stageSitesBuild } from "../../scripts/build-sites-worker.mjs";

describe("Sites build staging", () => {
  it("places Astro static output under dist/client beside the worker entrypoint", async () => {
    const root = await mkdtemp(join(tmpdir(), "he-hu-sites-build-"));
    const distDir = join(root, "dist");
    const workerFile = join(root, "worker.js");

    try {
      await mkdir(join(distDir, "_astro"), { recursive: true });
      await mkdir(join(distDir, "about"), { recursive: true });
      await writeFile(join(distDir, "index.html"), "<h1>Home</h1>");
      await writeFile(join(distDir, "about", "index.html"), "<h1>About</h1>");
      await writeFile(join(distDir, "_astro", "app.css"), "body{}");
      await writeFile(workerFile, "export default {};");

      await stageSitesBuild({ distDir, workerFile });

      await expect(readFile(join(distDir, "client", "index.html"), "utf8")).resolves.toContain(
        "Home",
      );
      await expect(
        readFile(join(distDir, "client", "about", "index.html"), "utf8"),
      ).resolves.toContain("About");
      await expect(
        readFile(join(distDir, "client", "_astro", "app.css"), "utf8"),
      ).resolves.toBe("body{}");
      await expect(readFile(join(distDir, "server", "index.js"), "utf8")).resolves.toContain(
        "export default",
      );
      await expect(access(join(distDir, "index.html"))).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

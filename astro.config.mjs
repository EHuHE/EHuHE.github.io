import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const site = process.env.SITE_URL ?? "https://ehuhe.github.io";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  integrations: [mdx()],
  output: "static",
  site,
  base,
});

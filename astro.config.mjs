// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";

/** Contabo / VPS uses Node standalone; set DEPLOY_TARGET=vercel for Vercel. */
const useVercel = process.env.DEPLOY_TARGET === "vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://gadgethubke.com",
  compressHTML: true,
  adapter: useVercel
    ? vercel()
    : node({
        mode: "standalone",
      }),
  build: {
    inlineStylesheets: "auto",
  },
});

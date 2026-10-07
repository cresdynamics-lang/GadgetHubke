import { existsSync } from "node:fs";
import path from "node:path";
import { heroCategories } from "./scenes";
import type { HeroCategory } from "./types";

function fileOk(publicUrl: string): boolean {
  const rel = publicUrl.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", rel));
}

/** Fail the build loudly if any scene image is missing or a category is incomplete. */
export function validateHeroScenes(categories: Record<string, HeroCategory> = heroCategories): void {
  const errors: string[] = [];

  for (const cat of Object.values(categories)) {
    if (!cat.scenes || cat.scenes.length !== 4) {
      errors.push(`[hero:${cat.slug}] expected exactly 4 scenes, got ${cat.scenes?.length ?? 0}`);
    }
    for (const scene of cat.scenes ?? []) {
      if (!scene.title?.trim()) {
        errors.push(`[hero:${scene.id}] title is empty`);
      }
      if (!scene.src || !fileOk(scene.src)) {
        errors.push(`[hero:${scene.id}] missing image: ${scene.src}`);
      }
      for (const swap of scene.swap ?? []) {
        if (!fileOk(swap)) {
          errors.push(`[hero:${scene.id}] missing swap image: ${swap}`);
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`Hero scene validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
}

/**
 * Locate a file served from /public. In dev and at build time that is public/;
 * on the VPS, pages render at request time and the built copy lives in dist/client/.
 */
import fs from "node:fs";
import path from "node:path";

const roots = () => [path.join(process.cwd(), "public"), path.join(process.cwd(), "dist", "client")];

export function publicFilePath(publicUrl: string): string | undefined {
  const rel = decodeURIComponent(publicUrl.split("?")[0]).replace(/^\//, "");
  for (const root of roots()) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) return file;
  }
  return undefined;
}

export function publicFileExists(publicUrl: string): boolean {
  return publicFilePath(publicUrl) !== undefined;
}

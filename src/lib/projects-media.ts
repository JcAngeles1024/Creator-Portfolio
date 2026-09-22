import "server-only";
import path from "node:path";
import { pickCover, scanMediaFolder } from "@/lib/media";
import type { MediaItem } from "@/types";

/**
 * Each project's media lives in /public/projects/<slug> — images and videos
 * together. Adding a project means one entry in src/content/projects.ts for the
 * words, and a folder named after its slug for the media.
 */
export function getProjectMedia(slug: string): MediaItem[] {
  return scanMediaFolder(
    path.join(process.cwd(), "public", "projects", slug),
    `/projects/${slug}`,
  );
}

/** The single item a project card leads with. */
export function getProjectCover(slug: string): MediaItem | undefined {
  return pickCover(getProjectMedia(slug));
}

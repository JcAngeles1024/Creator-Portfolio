import "server-only";
import path from "node:path";
import { scanMediaFolder } from "@/lib/media";
import type { MediaItem } from "@/types";

/**
 * The home page strip is whatever sits in /public/carousel. Drop a file in the
 * folder and it appears; there is no list to register it in.
 * See src/lib/media.ts for the optional filename conventions.
 */
export function getCarouselItems(): MediaItem[] {
  return scanMediaFolder(path.join(process.cwd(), "public", "carousel"), "/carousel");
}

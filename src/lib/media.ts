import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { MediaItem } from "@/types";

/**
 * Shared media-folder scanning. Both the home page carousel and each project's
 * gallery work the same way: point this at a folder, get back tiles sized from
 * the files themselves.
 *
 * Filename conventions, all optional:
 *   - Files appear in filename order; prefix with 01-, 02- to arrange them.
 *   - The filename becomes the alt text: "behind-the-scenes.jpg" reads as
 *     "Behind the scenes".
 *   - "reel@12s.mp4" marks 0:12 as the interesting moment.
 *   - An image sharing a video's name is that video's poster, not its own tile.
 *   - A file named "cover" is treated as the folder's cover image.
 */

export const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
export const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);

/** Pulls width/height out of an MP4/MOV without decoding the file. */
function readVideoSize(filePath: string): { width: number; height: number } | null {
  let fd: number;
  try {
    fd = fs.openSync(filePath, "r");
  } catch {
    return null;
  }

  try {
    const fileSize = fs.statSync(filePath).size;
    const read = (offset: number, length: number) => {
      const buffer = Buffer.alloc(length);
      fs.readSync(fd, buffer, 0, length, offset);
      return buffer;
    };

    let result: { width: number; height: number } | null = null;

    // Walks the ISO base media container looking for a track header box.
    const walk = (start: number, end: number, depth: number) => {
      let offset = start;

      while (offset < end - 8 && depth < 6 && !result) {
        const header = read(offset, 8);
        let boxSize = header.readUInt32BE(0);
        const boxType = header.toString("latin1", 4, 8);
        let headerSize = 8;

        if (boxSize === 1) {
          boxSize = Number(read(offset + 8, 8).readBigUInt64BE(0));
          headerSize = 16;
        }
        if (boxSize < 8 || offset + boxSize > end) break;

        if (boxType === "moov" || boxType === "trak") {
          walk(offset + headerSize, offset + boxSize, depth + 1);
        }

        if (boxType === "tkhd") {
          const box = read(offset + headerSize, 92);
          // Width and height are the last two 16.16 fixed-point values.
          const dimensionsAt = box[0] === 1 ? 88 : 76;
          const width = box.readUInt32BE(dimensionsAt) / 65536;
          const height = box.readUInt32BE(dimensionsAt + 4) / 65536;
          if (width > 0 && height > 0) {
            result = { width: Math.round(width), height: Math.round(height) };
          }
        }

        offset += boxSize;
      }
    };

    walk(0, fileSize, 0);
    return result;
  } catch {
    return null;
  } finally {
    fs.closeSync(fd);
  }
}

/** "01-behind-the-scenes@12s.mp4" becomes "Behind the scenes". */
function toAltText(fileName: string): string {
  const cleaned = stripExtension(fileName)
    .replace(/@\d+s$/i, "")
    .replace(/^[\d\s._-]+/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  // "cover.jpg" and bare numbers describe nothing, so they get no caption.
  if (!cleaned || /^cover$/i.test(cleaned)) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function isCover(fileName: string): boolean {
  return /^cover$/i.test(stripExtension(fileName));
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

/** A cover leads; the rest sort by name, with "2.jpg" before "10.jpg". */
function byFileName(a: string, b: string): number {
  if (isCover(a) !== isCover(b)) return isCover(a) ? -1 : 1;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Reads every image and video in `directory` and returns them as tiles whose
 * URLs start with `urlPrefix`. A missing folder returns an empty list rather
 * than throwing, so the page renders either way.
 */
export function scanMediaFolder(directory: string, urlPrefix: string): MediaItem[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(directory);
  } catch {
    return [];
  }

  const media = fileNames
    .filter((name) => !name.startsWith("."))
    .filter((name) => {
      const extension = path.extname(name).toLowerCase();
      return IMAGE_EXTENSIONS.has(extension) || VIDEO_EXTENSIONS.has(extension);
    })
    .sort(byFileName);

  // An image sharing a video's name is that video's poster, not a tile of its own.
  const videoBaseNames = new Set(
    media
      .filter((name) => VIDEO_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .map(stripExtension),
  );

  const items: MediaItem[] = [];

  for (const name of media) {
    const extension = path.extname(name).toLowerCase();
    const filePath = path.join(directory, name);
    const src = `${urlPrefix}/${encodeURIComponent(name)}`;
    const alt = toAltText(name);

    if (IMAGE_EXTENSIONS.has(extension)) {
      if (videoBaseNames.has(stripExtension(name))) continue;

      let ratio = "4/3";
      try {
        const { width, height } = imageSize(fs.readFileSync(filePath));
        if (width && height) ratio = `${width}/${height}`;
      } catch {
        // Unreadable dimensions fall back to the default shape.
      }
      items.push({ type: "image", src, alt, ratio });
      continue;
    }

    const size = readVideoSize(filePath);
    const baseName = stripExtension(name);
    const poster = media.find(
      (candidate) =>
        IMAGE_EXTENSIONS.has(path.extname(candidate).toLowerCase()) &&
        stripExtension(candidate) === baseName,
    );
    const startMatch = baseName.match(/@(\d+)s$/i);

    items.push({
      type: "video",
      src,
      alt,
      ratio: size ? `${size.width}/${size.height}` : "16/9",
      poster: poster ? `${urlPrefix}/${encodeURIComponent(poster)}` : undefined,
      clip: { start: startMatch ? Number(startMatch[1]) : 0, duration: 5 },
    });
  }

  return items;
}

/** The item a folder leads with — sorting already puts any "cover" first. */
export function pickCover(items: MediaItem[]): MediaItem | undefined {
  return items[0];
}

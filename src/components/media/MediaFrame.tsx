import Image from "next/image";
import type { MediaItem } from "@/types";
import { cn } from "@/lib/utils";

/**
 * One image or video, sized by its own aspect ratio.
 *
 * Videos here carry controls and do not autoplay: a project page is something
 * you look at deliberately, unlike the home page strip.
 */
export function MediaFrame({
  item,
  className,
  sizes = "(max-width: 768px) 100vw, 768px",
  priority = false,
}: {
  item: MediaItem;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const style = { aspectRatio: item.ratio ?? "4/3" };
  const frame = cn("relative w-full overflow-hidden rounded-2xl bg-foreground/5", className);

  if (item.type === "video") {
    return (
      <video
        controls
        preload="metadata"
        playsInline
        poster={item.poster}
        aria-label={item.alt || "Project video"}
        className={frame}
        style={style}
      >
        <source src={item.src} />
        Your browser cannot play this video.
      </video>
    );
  }

  return (
    <div className={frame} style={style}>
      <Image
        src={item.src}
        alt={item.alt || "Project image"}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/** Everything in a project's folder, stacked in filename order. */
export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <figure key={item.src}>
          <MediaFrame item={item} priority={index === 0} />
          {item.alt ? (
            <figcaption className="mt-3 text-sm text-foreground/50">{item.alt}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

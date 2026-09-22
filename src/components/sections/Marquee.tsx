import Image from "next/image";
import { ShowcaseVideo } from "@/components/media/ShowcaseVideo";
import { getCarouselItems } from "@/lib/carousel";
import type { MediaItem } from "@/types";

/**
 * Infinite right-to-left strip. The track holds two identical copies of the
 * list and slides exactly -50%, so the moment it loops the second copy sits
 * where the first one started and the seam is invisible.
 *
 * Every tile is the same height and takes its width from its own aspect ratio,
 * so portrait and landscape media mix without cropping either one. The uneven
 * rhythm that creates is the point.
 *
 * The tiles come from whatever is sitting in /public/carousel — see
 * src/lib/carousel.ts.
 */

function Tile({ item, duplicate = false }: { item: MediaItem; duplicate?: boolean }) {
  // The duplicated half is decorative, so it is hidden from screen readers.
  const hidden = duplicate || undefined;
  const style = { "--tile-ratio": item.ratio ?? "4/3" } as React.CSSProperties;
  const frame = "marquee__item relative overflow-hidden rounded-xl bg-foreground/5";

  if (!item.src) {
    return (
      <li className={frame} style={style} aria-hidden={hidden}>
        <span className="absolute bottom-3 left-3 right-3 text-xs leading-tight text-foreground/30">
          {item.alt}
        </span>
      </li>
    );
  }

  if (item.type === "video") {
    return (
      <li className={frame} style={style} aria-hidden={hidden}>
        <ShowcaseVideo
          src={item.src}
          poster={item.poster}
          label={item.alt}
          start={item.clip?.start}
          duration={item.clip?.duration}
        />
      </li>
    );
  }

  return (
    <li className={frame} style={style} aria-hidden={hidden}>
      <Image
        src={item.src}
        alt={duplicate ? "" : item.alt}
        fill
        sizes="(max-width: 640px) 40vw, 22rem"
        className="object-cover"
      />
    </li>
  );
}

/** `speed` is how long one full loop takes. Higher is slower. */
export function Marquee({ speed = "60s" }: { speed?: string }) {
  const items = getCarouselItems();
  if (items.length === 0) return null;

  // A short list would not fill a wide screen, so pad it out before duplicating.
  const base = items.length < 6 ? [...items, ...items] : items;

  return (
    <section aria-label="Recent media" className="border-y border-foreground/10 py-8">
      <div className="marquee">
        <ul
          className="marquee__track"
          style={{ "--marquee-duration": speed } as React.CSSProperties}
        >
          {base.map((item, index) => (
            <Tile key={`a-${index}`} item={item} />
          ))}
          {/* Second copy is what makes the loop seamless; announced once only. */}
          {base.map((item, index) => (
            <Tile key={`b-${index}`} item={item} duplicate />
          ))}
        </ul>
      </div>
    </section>
  );
}

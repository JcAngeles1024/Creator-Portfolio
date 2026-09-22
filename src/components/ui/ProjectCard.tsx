import Image from "next/image";
import Link from "next/link";
import { getProjectCover } from "@/lib/projects-media";
import type { Project } from "@/types";

/**
 * The cover is the first file in the project's folder — or one named "cover".
 * A video cover shows its poster frame if there is one, otherwise a neutral
 * block, since a card is not the place to start playback.
 */
export function ProjectCard({ project }: { project: Project }) {
  const cover = getProjectCover(project.slug);
  const image = cover?.type === "image" ? cover.src : cover?.poster;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-foreground/10 p-5 transition-colors hover:border-foreground/30"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-foreground/5">
        {image ? (
          <Image
            src={image}
            alt={`${project.title} for ${project.client}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-medium">{project.title}</h3>
          <span className="text-sm text-foreground/50">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-foreground/50">
          {project.client} &middot; {project.category}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/70">{project.summary}</p>
      </div>
    </Link>
  );
}

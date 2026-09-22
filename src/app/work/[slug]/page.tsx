import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/media/MediaFrame";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { getProject, projects } from "@/content/projects";
import { getProjectMedia } from "@/lib/projects-media";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  const cover = getProjectMedia(slug).find((item) => item.type === "image");

  return {
    title: `${project.title} — ${project.client}`,
    description: project.summary,
    openGraph: cover ? { images: [{ url: cover.src }] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const media = getProjectMedia(slug);

  return (
    <article className="py-16">
      <Container>
        <Link
          href="/work"
          className="text-sm text-foreground/50 transition-colors hover:text-foreground"
        >
          &larr; All work
        </Link>

        <header className="mt-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
            {project.client} &middot; {project.year}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">{project.summary}</p>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="mt-12">
          {media.length > 0 ? (
            <MediaGallery items={media} />
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-foreground/5" aria-hidden />
          )}
        </div>

        <div className="mt-12 grid gap-12 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Overview</h2>
            <p className="mt-4 leading-relaxed text-foreground/70">{project.description}</p>
          </div>

          {project.results?.length ? (
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Results</h2>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-block text-sm underline underline-offset-4"
          >
            View live project
          </a>
        ) : null}
      </Container>
    </article>
  );
}

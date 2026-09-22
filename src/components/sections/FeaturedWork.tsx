import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProjects } from "@/content/projects";

export function FeaturedWork() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Recent projects"
          description="A few things worth showing. The rest lives in the full archive."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <Link
          href="/work"
          className="mt-8 inline-block text-sm text-foreground/70 underline underline-offset-4 hover:text-foreground"
        >
          See all work
        </Link>
      </Container>
    </section>
  );
}

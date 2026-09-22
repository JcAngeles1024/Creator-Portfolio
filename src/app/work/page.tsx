import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects across video, branding, photography, and campaigns.",
};

export default function WorkPage() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Archive"
          title="Work"
          description="Everything worth keeping, most recent first."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">{site.role}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          {site.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
          {site.description}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/work">View work</Button>
          <Button href="/contact" variant="outline">
            Start a project
          </Button>
        </div>
      </Container>
    </section>
  );
}

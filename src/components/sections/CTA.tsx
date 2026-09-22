import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function CTA() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-3xl border border-foreground/10 p-10 sm:p-14">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Have something you want made?
          </h2>
          <p className="mt-4 max-w-lg text-foreground/70">
            Currently booking projects. Tell me what you have in mind and I will come back within
            two working days.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/contact">Get in touch</Button>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-foreground/70 underline underline-offset-4 hover:text-foreground"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

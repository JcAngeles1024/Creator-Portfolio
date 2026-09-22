import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";

export function Services() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading eyebrow="What I do" title="Services" />
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {services.map((service) => (
            <div key={service.title}>
              <h3 className="text-lg font-medium">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {service.description}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-foreground/50">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

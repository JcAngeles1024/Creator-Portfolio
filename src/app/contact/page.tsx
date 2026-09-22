import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let us work together"
          description={`Based in ${site.location}. Reply within two working days.`}
        />
        <ContactForm />
        <p className="mt-8 text-sm text-foreground/50">
          Prefer email?{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
        </p>
      </Container>
    </section>
  );
}

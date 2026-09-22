import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.role}.`,
};

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <SectionHeading eyebrow="About" title={site.name} description={site.tagline} />

            <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/70">
              <p>
                Write the short version here: what you make, who you make it for, and the thing
                that makes your work recognisable.
              </p>
              <p>
                Then the longer version: how you got here, the clients or projects that shaped the
                way you work, and what you want to take on next.
              </p>
            </div>
          </div>

          {site.photo ? (
            /* self-start keeps the portrait at the top of the row and lets its
               aspect ratio decide the height - a stretched grid item would
               ignore the ratio and fill the whole row instead. */
            <div
              className="relative w-full self-start overflow-hidden rounded-2xl bg-foreground/5 sm:col-span-2"
              style={{ aspectRatio: site.photoRatio }}
            >
              <Image
                src={site.photo}
                alt={site.name}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                priority
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Clients</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              <li>Northwind</li>
              <li>Atlas Studio</li>
              <li>Meridian</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.2em] text-foreground/50">Recognition</h2>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              <li>Award or feature, 2025</li>
              <li>Award or feature, 2024</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

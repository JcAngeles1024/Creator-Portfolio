import { CTA } from "@/components/sections/CTA";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedWork />
      <Services />
      <CTA />
    </>
  );
}

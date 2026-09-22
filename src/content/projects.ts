import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "project-1",
    title: "Launch Film",
    client: "Northwind",
    year: 2025,
    category: "Video",
    summary: "A 90-second launch film that carried a hardware release across three markets.",
    description:
      "Northwind needed one asset that could anchor a global release. We built the film around a single continuous move through the product's world, then cut it down into six platform-native edits.",
    tags: ["Direction", "Editing", "Colour"],
    featured: true,
    results: ["2.4M organic views", "38% lift in launch-week signups"],
  },
  {
    slug: "project-2",
    title: "Brand System",
    client: "Atlas Studio",
    year: 2025,
    category: "Branding",
    summary: "A modular identity and content kit for a studio publishing daily.",
    description:
      "Atlas was shipping content faster than their brand could keep up. We built a template system that holds together across formats without needing a designer in the loop every time.",
    tags: ["Identity", "Templates", "Art direction"],
    featured: true,
  },
  {
    slug: "project-3",
    title: "Seasonal Campaign",
    client: "Meridian",
    year: 2024,
    category: "Campaign",
    summary: "Twelve weeks of paid and organic creative from one core idea.",
    description:
      "One line of copy, stretched across stills, vertical video, and out-of-home. The campaign ran twelve weeks with a single production block up front.",
    tags: ["Strategy", "Photography", "Paid social"],
    featured: true,
    results: ["4.1x return on ad spend"],
  },
  {
    slug: "project-4",
    title: "Field Notes",
    client: "Self-initiated",
    year: 2024,
    category: "Photography",
    summary: "An ongoing documentary series shot on location.",
    description:
      "A personal project and the reason most clients get in touch. Shot over eighteen months across six countries.",
    tags: ["Documentary", "Photography"],
    featured: true,
  },
  {
    slug: "project-5",
    title: "project 5",
    client: "Self-initiated",
    year: 2024,
    category: "Photography",
    summary: "An ongoing documentary series shot on location.",
    description:
      "A personal project and the reason most clients get in touch. Shot over eighteen months across six countries.",
    tags: ["Documentary", "Photography"],
    featured: false,
  },
  {
    slug: "project-6",
    title: "project 6",
    client: "Self-initiated",
    year: 2024,
    category: "Photography",
    summary: "An ongoing documentary series shot on location.",
    description:
      "A personal project and the reason most clients get in touch. Shot over eighteen months across six countries.",
    tags: ["Documentary", "Photography"],
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const featuredProjects = projects.filter((project) => project.featured);

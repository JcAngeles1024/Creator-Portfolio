export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  role: string;
  tagline: string;
  description: string;
  /** Portrait shown in the header and on the About page. A path under /public. */
  photo: string;
  /** Pixel dimensions of `photo`, as width/height, so it reserves the right space. */
  photoRatio: string;
  email: string;
  location: string;
  url: string;
  nav: NavItem[];
  socials: SocialLink[];
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: "Video" | "Branding" | "Photography" | "Web" | "Campaign";
  summary: string;
  description: string;
  tags: string[];
  featured: boolean;
  results?: string[];
  link?: string;
};

export type Service = {
  title: string;
  description: string;
  deliverables: string[];
};

/**
 * One piece of media — a carousel tile or an item in a project gallery.
 * Discovered from the file itself, so nothing here is written by hand.
 */
export type MediaItem = {
  type: "image" | "video";
  src: string;
  /** Describes the media for screen readers. */
  alt: string;
  /**
   * Shape of the media, written width/height, read from the file's own pixel
   * dimensions: "9/16" for a phone-shaped clip, "16/9" for widescreen.
   */
  ratio?: string;
  /** Still frame shown before a video starts. Optional. */
  poster?: string;
  /**
   * Videos play a short looping window rather than the whole file.
   * `start` is where the window begins, in seconds. Defaults to 0 for 5s.
   */
  clip?: { start?: number; duration?: number };
};

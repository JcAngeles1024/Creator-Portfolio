import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="border-b border-foreground/10">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          {site.photo ? (
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-foreground/5">
              <Image
                src={site.photo}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </span>
          ) : null}
          <span className="text-sm font-semibold tracking-tight">{site.name}</span>
        </Link>
        <nav className="flex items-center gap-6">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}

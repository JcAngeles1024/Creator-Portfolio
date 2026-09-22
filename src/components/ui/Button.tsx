import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors";

const variants = {
  primary: "bg-foreground text-background hover:opacity-90",
  outline: "border border-foreground/20 hover:border-foreground/50",
} as const;

type Variant = keyof typeof variants;

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

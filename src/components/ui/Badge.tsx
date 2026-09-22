export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70">
      {children}
    </span>
  );
}

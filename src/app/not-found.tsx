import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container>
        <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 text-foreground/70">That page does not exist, or it moved.</p>
        <Button href="/" className="mt-8">
          Back home
        </Button>
      </Container>
    </section>
  );
}

import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-gold">404</p>
      <h1 className="mt-4 font-display text-7xl font-extrabold uppercase leading-none sm:text-9xl">Off the line.</h1>
      <p className="mx-auto mt-6 max-w-md text-mist">That page doesn&apos;t exist. Let&apos;s get you back to the snap.</p>
      <div className="mt-10 flex justify-center gap-3">
        <Button href="/" arrow>Home</Button>
        <Button href="/calendar" variant="outline">Calendar</Button>
      </div>
    </Container>
  );
}

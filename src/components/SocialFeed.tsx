import { InstagramIcon } from "./Icons";
import { Button, Container, Photo } from "./ui";
import { SOCIALS } from "@/lib/site";

/**
 * Lightweight Instagram strip: static tiles that link out, so the homepage stays fast.
 * Swap tiles for real post thumbnails (set `src`) or a feed widget later.
 */
export function SocialFeed() {
  const ig = SOCIALS.find((s) => s.key === "instagram")!;
  return (
    <section className="light bg-white py-20 text-ink sm:py-24">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">
            Follow the <span className="text-gold-dim">work.</span>
          </h2>
          <Button href={ig.href} variant="dark" arrow>
            @summitlineacademy
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {["Technique", "Training", "Camp day", "Film study", "Strength", "Game day"].map((label) => (
            <a key={label} href={ig.href} target="_blank" rel="noopener noreferrer" aria-label={`${label} on Instagram`} className="group relative block overflow-hidden">
              <Photo alt={`${label} post on Instagram`} label={label} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8" />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

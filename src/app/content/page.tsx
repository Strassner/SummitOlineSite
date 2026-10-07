import type { Metadata } from "next";
import { PostBrowser } from "@/components/PostBrowser";
import { Button, Heading, PageHero, Section } from "@/components/ui";
import { LIBRARY } from "@/lib/data";
import { LockIcon, PlayIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Offensive Line Content: Tips, Technique & Football IQ",
  description:
    "Free offensive line training tips, technique breakdowns, football IQ, strength and conditioning articles and coach education from Summit Line Academy in Kansas City.",
  alternates: { canonical: "/content" },
};

export default function ContentPage() {
  return (
    <>
      <PageHero
        eyebrow="Content"
        title={
          <>
            Learn the <span className="text-gold">position.</span>
          </>
        }
        intro="Training tips, technique, football IQ, strength and coach education, free from the Summit staff."
      >
        <Button href="/memberships" arrow>Unlock the member library</Button>
      </PageHero>

      <Section>
        <PostBrowser />
      </Section>

      <Section tone="light">
        <Heading light eyebrow="Members only" title="The Summit library." intro="Technique videos, drills, strength sessions and film study, available to active members." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIBRARY.slice(0, 8).map((l) => (
            <div key={l.id} className="relative border border-neutral-300 bg-white p-5">
              <div className="photo-slot mb-4 flex aspect-video items-center justify-center text-white">
                <PlayIcon className="h-10 w-10 opacity-70" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-dim">{l.section}</p>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight">{l.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500"><LockIcon className="h-3.5 w-3.5" /> Members · {l.duration}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/memberships" variant="dark" arrow>Become a member</Button>
        </div>
      </Section>
    </>
  );
}

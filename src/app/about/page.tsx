import type { Metadata } from "next";
import { CoachCard } from "@/components/cards";
import { Reveal } from "@/components/Reveal";
import { Button, Heading, PageHero, Photo, Section } from "@/components/ui";
import { COACHES } from "@/lib/data";
import { PILLARS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, mission and philosophy behind Summit Line Academy, Kansas City's offensive-line-specific training academy for youth, high school and college linemen.",
  alternates: { canonical: "/about" },
};

const LEVELS = ["Youth", "Middle School", "High School", "College"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            One position. <span className="text-gold">Total focus.</span>
          </>
        }
        intro="Summit Line Academy exists for one reason: to develop offensive linemen the right way."
      >
        <Button href="/training" arrow>Explore Training</Button>
        <Button href="/contact" variant="outline">Contact Us</Button>
      </PageHero>

      <Section tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Heading light eyebrow="Our Story" title="Where Summit started." />
            <div className="space-y-5 text-lg leading-relaxed text-neutral-700">
              {/* PLACEHOLDER story copy: replace with the founders' real story */}
              <p>Too many offensive linemen are taught the same generic fundamentals as everyone else on the field. Summit Line Academy was created to change that with dedicated, position-specific instruction.</p>
              <p>What began as private sessions between a coach and a handful of linemen has grown into an academy built around technique, strength, football IQ and discipline.</p>
              <p>[Add the founder story here: playing background, why Summit was started, and what the first season looked like.]</p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <Photo alt="Summit Line Academy founder coaching an offensive lineman" label="Founder / story photo" className="cut-lg aspect-[4/3] w-full" />
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <Heading eyebrow="Our Mission" title="Develop the complete lineman." />
            <p className="text-lg leading-relaxed text-mist">
              To give offensive linemen at every level the coaching, training environment and football understanding they need to play with confidence and consistency, and to become better athletes and people along the way.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Heading eyebrow="Our Philosophy" title="Build from the ground up." />
            <p className="text-lg leading-relaxed text-mist">
              Great offensive line play starts at the feet and hands. We teach stance, first step, hand placement and leverage until they&apos;re automatic, then layer in strength, movement and football IQ.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-px bg-iron sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p} delay={i * 80}>
              <div className="h-full bg-coal p-8">
                <p className="font-display text-sm font-bold text-gold">0{i + 1}</p>
                <h3 className="mt-2 font-display text-4xl font-extrabold uppercase">{p}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="steel">
        <Reveal>
          <Heading eyebrow="Who We Train" title="Youth → College." intro="From a first stance to a college-ready technique, Summit develops linemen across every stage." />
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-4">
          {LEVELS.map((l, i) => (
            <Reveal key={l} delay={i * 100}>
              <li className="relative border border-iron bg-black p-8">
                <span className="font-display text-sm font-bold text-gold">Level 0{i + 1}</span>
                <p className="mt-2 font-display text-4xl font-extrabold uppercase">{l}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section>
        <Reveal>
          <Heading eyebrow="Our Coaches" title="Meet the staff." />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {COACHES.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <CoachCard coach={c} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { CheckIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { Button, Heading, PageHero, Photo, Section } from "@/components/ui";
import { TRAINING_TYPES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Offensive Line Training Programs",
  description:
    "Private offensive line training, small-group sessions, team training, camps and clinics in Kansas City. Position-specific coaching for youth, high school and college linemen.",
  alternates: { canonical: "/training" },
};

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Training"
        title={
          <>
            Every rep <span className="text-gold">coached.</span>
          </>
        }
        intro="Choose the format that fits your athlete. Every option runs on the same Summit curriculum: technique, strength, IQ and discipline."
      >
        <Button href="/book" arrow>Book a Session</Button>
        <Button href="/memberships" variant="outline">View Memberships</Button>
      </PageHero>

      {TRAINING_TYPES.map((t, i) => {
        const light = i % 2 === 1;
        return (
          <Section key={t.id} id={t.id} tone={light ? "light" : "dark"}>
            <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${light ? "" : "lg:[&>*:first-child]:order-2"}`}>
              <Reveal>
                <Photo alt={`${t.title} at Summit Line Academy`} label={t.title} className="cut-lg aspect-[4/3] w-full" />
              </Reveal>
              <Reveal delay={120}>
                <Heading light={light} eyebrow={`0${i + 1}`} title={t.title} intro={t.summary} />
                <ul className="mb-10 space-y-3 text-lg">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button href={t.cta.href} variant={light ? "dark" : "primary"} arrow>
                  {t.cta.label}
                </Button>
              </Reveal>
            </div>
          </Section>
        );
      })}
    </>
  );
}

import type { Metadata } from "next";
import { CoachCard } from "@/components/cards";
import { PageHero, Section } from "@/components/ui";
import { COACHES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Coaches",
  description: "Meet the offensive line coaches of Summit Line Academy in Kansas City: playing experience, coaching background and philosophy.",
  alternates: { canonical: "/coaches" },
};

export default function CoachesPage() {
  return (
    <>
      <PageHero eyebrow="Coaches" title={<>Meet the <span className="text-gold">staff.</span></>} intro="Coaches who have played and taught the position, committed to developing the complete offensive lineman." />
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {COACHES.map((c) => (
            <CoachCard key={c.id} coach={c} />
          ))}
        </div>
      </Section>
    </>
  );
}

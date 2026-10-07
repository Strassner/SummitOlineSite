import type { Metadata } from "next";
import { EventsList } from "@/components/EventsList";
import { Button, PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Football Camps & Clinics in Kansas City",
  description:
    "Offensive line camps and position-specific clinics in Kansas City for youth, high school and college linemen. See dates, ages, what to bring, pricing and register online.",
  alternates: { canonical: "/camps-clinics" },
};

export default function CampsClinicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Camps & Clinics"
        title={
          <>
            Event-level <span className="text-gold">development.</span>
          </>
        }
        intro="Focused clinics and full-day camps built around offensive line technique, football IQ and competition."
      >
        <Button href="/calendar?type=clinic" variant="outline">Full calendar</Button>
      </PageHero>
      <Section>
        <EventsList />
      </Section>
    </>
  );
}

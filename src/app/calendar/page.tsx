import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarView } from "@/components/CalendarView";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Training Calendar & Schedule",
  description:
    "View the Summit Line Academy calendar: private training, small-group sessions, camps and clinics in Kansas City with live availability, coaches and pricing.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Calendar"
        title={
          <>
            Pick your <span className="text-gold">time.</span>
          </>
        }
        intro="Select a session, book it, pay and get your confirmation. Live availability for private training, small groups, camps and clinics."
      />
      <Section>
        <Suspense fallback={<div className="h-96 animate-pulse bg-steel" />}>
          <CalendarView />
        </Suspense>
      </Section>
    </>
  );
}

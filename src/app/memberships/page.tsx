import type { Metadata } from "next";
import { CompareTable, PlansGrid } from "@/components/Plans";
import { Reveal } from "@/components/Reveal";
import { Button, Heading, PageHero, Section } from "@/components/ui";
import { FAQS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Memberships & Packages",
  description:
    "Compare Summit Line Academy memberships: Starter, Elite and Unlimited offensive line training packages with member pricing, priority scheduling and a private member content library.",
  alternates: { canonical: "/memberships" },
};

export default function MembershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Memberships"
        title={
          <>
            Join <span className="text-gold">Summit.</span>
          </>
        }
        intro="Consistent development beats occasional effort. Choose a membership, book your sessions and track your credits from your account."
      />

      <Section tone="light">
        <Reveal>
          <Heading light eyebrow="Packages" title="Membership packages" />
          <PlansGrid tone="light" />
        </Reveal>
        <p className="mt-6 text-sm text-neutral-500">Cancel or change plans any time from your account. Pricing, session counts and benefits are managed in the admin portal.</p>
      </Section>

      <Section tone="light" className="!pt-0">
        <Reveal>
          <Heading light eyebrow="Compare" title="Side by side." />
          <CompareTable />
        </Reveal>
      </Section>

      <Section tone="steel">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <Heading eyebrow="FAQ" title="Good questions." intro="Can't find an answer? We're happy to help." />
            <Button href="/contact?topic=Membership" variant="outline">Ask about memberships</Button>
          </Reveal>
          <div className="divide-y divide-iron border-y border-iron">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl font-bold uppercase tracking-wide">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

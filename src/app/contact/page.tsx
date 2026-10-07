import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, SOCIAL_ICONS } from "@/components/Icons";
import { Container, Section } from "@/components/ui";
import { SITE, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Summit Line Academy",
  description: "Contact Summit Line Academy in Kansas City about private training, memberships, camps and clinics, team training or partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* Split layout from the design reference: giant heading left, pill form right */}
      <section className="light bg-white py-20 text-ink sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <h1 className="font-display text-7xl uppercase leading-[0.95] sm:text-8xl lg:text-[9rem]">
                Let&apos;s <span className="text-gold-dim">talk.</span>
              </h1>
              <p className="mt-8 max-w-md text-lg">
                Tell us what you&apos;re looking for (private training, a membership, a camp or a team program) and a Summit coach will respond with tailored recommendations within one business day.
              </p>
            </div>
            <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100" />}>
              <ContactForm />
            </Suspense>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-display text-5xl uppercase leading-none">Reach us directly</h2>
            <p className="flex items-start gap-3"><MailIcon className="mt-1 h-5 w-5 text-gold" /><a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></p>
            <p className="flex items-start gap-3"><PhoneIcon className="mt-1 h-5 w-5 text-gold" /><a href={SITE.phoneHref} className="hover:text-gold">{SITE.phone}</a></p>
            <p className="flex items-start gap-3"><PinIcon className="mt-1 h-5 w-5 text-gold" /><span>{SITE.location.name}<br />{SITE.location.line1}<br />{SITE.location.full}</span></p>
            <div className="flex gap-3 pt-2">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.key];
                return (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-iron text-mist hover:border-gold hover:text-gold">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            {/* Replace the q= value with the exact training address to enable the live Google Map */}
            <iframe
              title="Map of the Summit Line Academy training area in Kansas City"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border border-iron grayscale invert-[.92] contrast-[.9]"
              src="https://www.google.com/maps?q=Kansas+City,+MO&output=embed"
            />
          </div>
        </div>
      </Section>
    </>
  );
}

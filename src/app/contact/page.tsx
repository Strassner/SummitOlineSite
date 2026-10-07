import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, SOCIAL_ICONS } from "@/components/Icons";
import { Heading, PageHero, Section } from "@/components/ui";
import { SITE, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Summit Line Academy",
  description: "Contact Summit Line Academy in Kansas City about private training, memberships, camps and clinics, team training or partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s <span className="text-gold">talk.</span></>} intro="Questions about training, memberships or events? Send a message and a Summit coach will respond within one business day." />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Heading eyebrow="Send a message" title="How can we help?" />
            <Suspense fallback={<div className="h-80 animate-pulse bg-steel" />}>
              <ContactForm />
            </Suspense>
          </div>
          <div className="space-y-8">
            <div className="space-y-5 border border-iron bg-steel p-8">
              <h2 className="font-display text-3xl font-extrabold uppercase">Direct</h2>
              <p className="flex items-start gap-3"><MailIcon className="mt-1 h-5 w-5 text-gold" /><a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></p>
              <p className="flex items-start gap-3"><PhoneIcon className="mt-1 h-5 w-5 text-gold" /><a href={SITE.phoneHref} className="hover:text-gold">{SITE.phone}</a></p>
              <p className="flex items-start gap-3"><PinIcon className="mt-1 h-5 w-5 text-gold" /><span>{SITE.location.name}<br />{SITE.location.line1}<br />{SITE.location.full}</span></p>
              <div className="flex gap-3 pt-2">
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.key];
                  return (
                    <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center border border-iron text-mist hover:border-gold hover:text-gold">
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">Training location</h2>
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
        </div>
      </Section>
    </>
  );
}

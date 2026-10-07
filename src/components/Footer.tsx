import Link from "next/link";
import { LEGAL, NAV, SITE, SOCIALS } from "@/lib/site";
import { SOCIAL_ICONS } from "./Icons";
import { Logo } from "./Logo";

/** Footer follows the design reference: big wordmark + tagline left, big email + social icons right. */
export function Footer() {
  return (
    <footer className="bg-white text-ink">
      <div className="mx-auto max-w-[90rem] px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Logo className="h-16 w-16 sm:h-20 sm:w-20" />
              <p className="font-display text-4xl uppercase leading-none sm:text-6xl">Summit Line Academy</p>
            </div>
            <p className="mt-4 text-base">{SITE.tagline}</p>
          </div>
          <div className="xl:text-right">
            <a href={`mailto:${SITE.email}`} className="whitespace-nowrap font-display text-[1.35rem] uppercase leading-none hover:text-gold-dim min-[420px]:text-3xl sm:text-5xl">
              {SITE.email}
            </a>
            <div className="mt-5 flex gap-5 xl:justify-end">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.key];
                return (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-gold-dim">
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-neutral-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 font-display text-lg uppercase tracking-[0.15em] text-gold-dim">Navigation</h2>
            <ul className="space-y-2.5 text-sm">
              {[...NAV, { href: "/gallery", label: "Gallery" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-gold-dim">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-display text-lg uppercase tracking-[0.15em] text-gold-dim">Follow</h2>
            <ul className="space-y-2.5 text-sm">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.key];
                return (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-gold-dim">
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-display text-lg uppercase tracking-[0.15em] text-gold-dim">Legal</h2>
            <ul className="space-y-2.5 text-sm">
              {LEGAL.map((l) => (
                <li key={l.slug}>
                  <Link href={`/legal/${l.slug}`} className="hover:text-gold-dim">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-display text-lg uppercase tracking-[0.15em] text-gold-dim">Contact</h2>
            <ul className="space-y-2.5 text-sm">
              <li>{SITE.location.full}</li>
              <li>
                <a href={SITE.phoneHref} className="hover:text-gold-dim">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold-dim">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-xs text-neutral-500">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

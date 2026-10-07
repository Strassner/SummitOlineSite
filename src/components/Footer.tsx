import Link from "next/link";
import { LEGAL, NAV, SITE, SOCIALS } from "@/lib/site";
import { SOCIAL_ICONS } from "./Icons";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-iron bg-black text-bone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-white" markClassName="h-12 w-12" />
            <p className="mt-6 max-w-xs font-display text-2xl font-extrabold uppercase leading-tight tracking-wide text-white">
              Serious training.
              <br />
              Serious development.
            </p>
            <div className="mt-6 space-y-1 text-sm text-ash">
              <p>{SITE.location.full}</p>
              <p>
                <a href={SITE.phoneHref} className="hover:text-white">
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">Navigation</h2>
            <ul className="space-y-3">
              {[...NAV, { href: "/gallery", label: "Gallery" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-mist hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">Follow</h2>
            <ul className="space-y-3">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.key];
                return (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-mist hover:text-white">
                      <Icon className="h-5 w-5" />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">Legal</h2>
            <ul className="space-y-3">
              {LEGAL.map((l) => (
                <li key={l.slug}>
                  <Link href={`/legal/${l.slug}`} className="text-mist hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-iron pt-8 text-sm text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="font-display uppercase tracking-[0.25em]">Discover · Learn · Purchase · Book · Train · Return</p>
        </div>
      </div>
    </footer>
  );
}

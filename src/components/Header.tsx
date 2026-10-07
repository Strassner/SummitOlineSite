"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE, SOCIALS } from "@/lib/site";
import { useApp } from "@/lib/store";
import { SOCIAL_ICONS, CloseIcon, MenuIcon, PhoneIcon } from "./Icons";
import { Logo } from "./Logo";
import { Button } from "./ui";

export function Header() {
  const pathname = usePathname();
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // close the mobile menu after navigating
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const account = app.user ? { href: app.user.role === "admin" ? "/admin" : "/account", label: app.user.role === "admin" ? "Admin" : "My Account" } : { href: "/login", label: "Login" };

  return (
    <>
      {app.announcement && (
        <div className="bg-gold px-4 py-2 text-center text-sm font-semibold text-black">{app.announcement}</div>
      )}
      <div className="hidden border-b border-iron bg-black text-xs text-ash lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2">
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
            <PhoneIcon className="h-3.5 w-3.5" />
            {SITE.phone}
            <span className="mx-2 text-iron">|</span>
            {SITE.location.full}
          </a>
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.key];
              return (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-iron bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link href="/" aria-label={`${SITE.name} home`} className="text-white">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`px-3 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-gold ${isActive(n.href) ? "text-gold" : "text-bone"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={account.href} className="hidden px-3 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-bone hover:text-gold sm:block">
              {account.label}
            </Link>
            <Button href="/book" size="sm" className="sm:min-h-12 sm:px-6 sm:text-sm">
              Book Now
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center text-white xl:hidden"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-black px-5 pb-10 pt-6 transition-all duration-300 sm:top-20 xl:hidden ${open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"}`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[...NAV, { href: account.href, label: account.label }].map((n) => (
            <Link
              key={n.href + n.label}
              href={n.href}
              className={`border-b border-iron py-4 font-display text-3xl font-extrabold uppercase tracking-wide ${isActive(n.href) ? "text-gold" : "text-white"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Button href="/book" size="lg" className="mt-8 w-full">
          Book Now
        </Button>
        <div className="mt-8 flex items-center gap-5 text-ash">
          {SOCIALS.map((s) => {
            const Icon = SOCIAL_ICONS[s.key];
            return (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-white">
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

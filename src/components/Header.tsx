"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE, SOCIALS } from "@/lib/site";
import { useApp } from "@/lib/store";
import { SOCIAL_ICONS, CloseIcon, MenuIcon } from "./Icons";
import { Logo } from "./Logo";
import { Button } from "./ui";

/** Header follows the design reference: white bar, badge + condensed wordmark, plain nav, black BOOK NOW pill. */
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
      {app.announcement && <div className="bg-gold px-4 py-2 text-center text-sm font-semibold text-black">{app.announcement}</div>}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 text-ink backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:h-20 sm:px-8">
          <Link href="/" aria-label={`${SITE.name} home`} className="flex items-center gap-3">
            <Logo priority className="h-11 w-11 sm:h-14 sm:w-14" />
            <span className="hidden whitespace-nowrap font-display text-xl min-[460px]:inline uppercase leading-none tracking-[0.02em] sm:text-3xl xl:hidden 2xl:inline">Summit Line Academy</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`whitespace-nowrap px-3 py-2 text-[0.95rem] transition-colors hover:text-gold-dim ${isActive(n.href) ? "font-semibold underline decoration-2 underline-offset-8" : ""}`}
              >
                {n.label}
              </Link>
            ))}
            <Link href={account.href} className="whitespace-nowrap px-3 py-2 text-[0.95rem] transition-colors hover:text-gold-dim">
              {account.label}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button href="/book" variant="dark" size="sm" className="sm:min-h-12 sm:px-7 sm:text-base">
              Book Now
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white px-5 pb-10 pt-4 text-ink transition-all duration-300 sm:top-20 xl:hidden ${open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"}`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[...NAV, { href: account.href, label: account.label }].map((n) => (
            <Link key={n.href + n.label} href={n.href} className={`border-b border-neutral-200 py-4 font-display text-4xl uppercase ${isActive(n.href) ? "text-gold-dim" : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Button href="/book" variant="dark" size="lg" className="mt-8 w-full">
          Book Now
        </Button>
        <div className="mt-8 flex items-center gap-5">
          {SOCIALS.map((s) => {
            const Icon = SOCIAL_ICONS[s.key];
            return (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

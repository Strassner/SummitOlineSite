"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut, useApp } from "@/lib/store";
import { Button, Container } from "./ui";

const LINKS = [
  { href: "/account", label: "My Profile" },
  { href: "/account/membership", label: "My Membership" },
  { href: "/account/bookings", label: "My Bookings" },
  { href: "/account/content", label: "My Content" },
  { href: "/account/payments", label: "Payments" },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const app = useApp();
  const pathname = usePathname();

  if (!app.ready) return <Container className="py-20"><div className="h-96 animate-pulse bg-steel" aria-busy="true" /></Container>;

  if (!app.user) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-6xl font-extrabold uppercase">Sign in to continue</h1>
        <p className="mx-auto mt-4 max-w-md text-ash">Your bookings, membership and member content live in your account.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href={`/login?next=${encodeURIComponent(pathname)}`} size="lg">Login</Button>
          <Button href={`/signup?next=${encodeURIComponent(pathname)}`} size="lg" variant="outline">Create account</Button>
        </div>
      </Container>
    );
  }

  if (app.user.role === "admin") {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-5xl font-extrabold uppercase">You&apos;re signed in as admin</h1>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/admin" size="lg">Open admin portal</Button>
          <Button variant="outline" size="lg" onClick={() => signOut()}>Sign out</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">Member portal</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Hi, {app.user.name.split(" ")[0]}.</h1>
        </div>
        <div className="flex gap-3">
          <Button href="/calendar" size="sm">Book training</Button>
          <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Account" className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/account" ? pathname === "/account" : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={`shrink-0 border-l-2 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] ${active ? "border-gold bg-steel text-white" : "border-transparent text-ash hover:text-white"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div>{children}</div>
      </div>
    </Container>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mb-8 border border-iron bg-steel p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-extrabold uppercase leading-none">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

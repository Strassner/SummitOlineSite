"use client";

import { getCoaches, getSessions, spotsLeft, useApp, type AppState } from "@/lib/store";
import { KIND_LABEL } from "@/lib/data";
import { formatDate, formatRange, money } from "@/lib/dates";
import type { Session } from "@/lib/types";
import { ClockIcon, PinIcon, UserIcon } from "./Icons";
import { Button, Pill } from "./ui";

export function coachName(app: AppState, id: string) {
  return getCoaches(app).find((c) => c.id === id)?.name ?? "Summit Coach";
}

/** Single schedule line. Shows date, time, location, type, coach, spots and price per the brief. */
export function SessionRow({ session, app, tone = "dark" }: { session: Session; app: AppState; tone?: "dark" | "light" }) {
  const left = spotsLeft(app, session);
  const full = left === 0;
  const isEvent = session.kind === "camp" || session.kind === "clinic" || session.kind === "event";
  const light = tone === "light";
  return (
    <article className={`grid gap-4 border p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-6 ${light ? "border-neutral-300 bg-white" : "border-iron bg-steel"}`}>
      <div className="flex items-baseline gap-3 sm:block sm:text-center">
        <p className={`font-display text-sm font-bold uppercase tracking-[0.2em] ${light ? "text-gold-dim" : "text-gold"}`}>{formatDate(session.date, { weekday: "short" })}</p>
        <p className="font-display text-4xl font-extrabold leading-none">{formatDate(session.date, { month: "short", day: "numeric" })}</p>
      </div>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Pill tone={isEvent ? "gold" : light ? "light" : "dark"}>{KIND_LABEL[session.kind]}</Pill>
          {full ? <Pill tone="light">Full</Pill> : left <= 3 && session.capacity > 1 && <span className="text-xs font-semibold uppercase tracking-widest text-gold">Only {left} left</span>}
        </div>
        <h3 className="font-display text-2xl font-bold uppercase leading-tight">{session.title}</h3>
        <ul className={`mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm ${light ? "text-neutral-600" : "text-ash"}`}>
          <li className="inline-flex items-center gap-1.5"><ClockIcon className="h-4 w-4" />{formatRange(session.start, session.end)}</li>
          <li className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" />{coachName(app, session.coachId)}</li>
          <li className="inline-flex items-center gap-1.5"><PinIcon className="h-4 w-4" />{session.location}</li>
        </ul>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="font-display text-3xl font-extrabold leading-none">{money(session.price)}</p>
          <p className={`text-xs uppercase tracking-widest ${light ? "text-neutral-500" : "text-ash"}`}>{full ? "Sold out" : `${left} of ${session.capacity} ${session.capacity === 1 ? "spot" : "spots"}`}</p>
        </div>
        <Button href={`/book?session=${session.id}`} variant={light ? "dark" : "primary"} size="sm" disabled={full} className={full ? "pointer-events-none opacity-40" : ""}>
          {isEvent ? "Register Now" : "Book"}
        </Button>
      </div>
    </article>
  );
}

/** Homepage "Upcoming Events": auto-populated from the shared schedule */
export function UpcomingEvents({ limit = 4 }: { limit?: number }) {
  const app = useApp();
  const upcoming = getSessions(app)
    .filter((s) => s.date >= app.today)
    .slice(0, limit);
  if (!app.ready) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse border border-iron bg-steel" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {upcoming.map((s) => (
        <SessionRow key={s.id} session={s} app={app} />
      ))}
    </div>
  );
}

/** Featured camps & clinics for the home/training pages */
export function FeaturedEvents({ limit = 3 }: { limit?: number }) {
  const app = useApp();
  const events = getSessions(app).filter((s) => (s.kind === "camp" || s.kind === "clinic") && s.date >= app.today).slice(0, limit);
  if (!app.ready) return <div className="h-40 animate-pulse bg-steel" aria-busy="true" />;
  return (
    <div className="space-y-3">
      {events.map((s) => (
        <SessionRow key={s.id} session={s} app={app} />
      ))}
    </div>
  );
}

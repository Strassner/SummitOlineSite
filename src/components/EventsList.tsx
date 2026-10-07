"use client";

import { KIND_LABEL } from "@/lib/data";
import { formatLong, formatRange, money } from "@/lib/dates";
import { getSessions, priceFor, spotsLeft, useApp } from "@/lib/store";
import { CheckIcon, ClockIcon, PinIcon, UserIcon } from "./Icons";
import { coachName } from "./Sessions";
import { Button, Pill } from "./ui";

/** Full-detail camp & clinic cards: name, date, time, location, ages, description, what to bring, price, spots, register. */
export function EventsList() {
  const app = useApp();
  if (!app.ready) return <div className="h-96 animate-pulse bg-steel" aria-busy="true" />;
  const events = getSessions(app).filter((s) => (s.kind === "camp" || s.kind === "clinic" || s.kind === "event") && s.date >= app.today);
  if (events.length === 0) return <p className="border border-iron p-10 text-center text-ash">No camps or clinics are scheduled right now. Check back soon.</p>;
  return (
    <div className="space-y-6">
      {events.map((e) => {
        const left = spotsLeft(app, e);
        const price = priceFor(app, e);
        return (
          <article key={e.id} className="grid gap-8 border border-iron bg-steel p-6 sm:p-8 lg:grid-cols-[1fr_16rem]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Pill tone="gold">{KIND_LABEL[e.kind]}</Pill>
                {e.ageRange && <Pill>{e.ageRange}</Pill>}
                {left > 0 && left <= 5 && <span className="text-xs font-semibold uppercase tracking-widest text-gold">Only {left} left</span>}
              </div>
              <h2 className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{e.title}</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-mist">
                <li className="inline-flex items-center gap-2"><ClockIcon className="h-4 w-4" />{formatLong(e.date)} · {formatRange(e.start, e.end)}</li>
                <li className="inline-flex items-center gap-2"><PinIcon className="h-4 w-4" />{e.location}</li>
                <li className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" />{coachName(app, e.coachId)}</li>
              </ul>
              <p className="mt-5 max-w-2xl text-mist">{e.description}</p>
              {e.bring && (
                <div className="mt-5">
                  <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">What to bring</p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {e.bring.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-mist"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-iron pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="font-display text-6xl font-extrabold leading-none">{money(price)}</p>
                {price !== e.price && <p className="mt-1 text-xs text-gold">Member price · regular {money(e.price)}</p>}
                <p className="mt-3 text-sm text-ash">{left === 0 ? "Sold out" : `${left} of ${e.capacity} spots available`}</p>
                <div className="mt-2 h-1.5 bg-iron" aria-hidden>
                  <div className="h-full bg-gold" style={{ width: `${Math.round(((e.capacity - left) / e.capacity) * 100)}%` }} />
                </div>
              </div>
              <Button href={`/book?session=${e.id}`} size="lg" disabled={left === 0} className={left === 0 ? "pointer-events-none" : ""} arrow>
                {left === 0 ? "Full" : "Register Now"}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

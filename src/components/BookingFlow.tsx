"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { KIND_LABEL } from "@/lib/data";
import { addDays, formatDate, formatLong, formatRange, money } from "@/lib/dates";
import { SITE } from "@/lib/site";
import { bookSession, canUseCredit, getPlan, getSessions, priceFor, spotsLeft, useApp, type AppState } from "@/lib/store";
import type { Booking, Session } from "@/lib/types";
import { AthleteAdder, DemoNote, SignInForm, SignUpForm } from "./AuthForms";
import { CheckIcon, ClockIcon, PinIcon, UserIcon } from "./Icons";
import { coachName } from "./Sessions";
import { Button, Container } from "./ui";

type Group = "private" | "small-group" | "event";
const GROUPS: { id: Group; title: string; blurb: string }[] = [
  { id: "private", title: "Private Training", blurb: "One-on-one, position-specific coaching." },
  { id: "small-group", title: "Small Group", blurb: "Competitive small-group sessions." },
  { id: "event", title: "Camps & Clinics", blurb: "Special events and position clinics." },
];
const STEPS = ["Training", "Date & time", "Account", "Pay", "Confirmed"];

const groupOf = (s: Session): Group => (s.kind === "camp" || s.kind === "clinic" ? "event" : s.kind === "private" ? "private" : "small-group");

function icsFor(b: Booking, s: Session | undefined, app: AppState) {
  if (!s) return "";
  const stamp = (d: string, t: string) => `${d.replace(/-/g, "")}T${t.replace(":", "")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Summit Line Academy//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.id}@summitlineacademy`,
    `DTSTAMP:${stamp(app.today, "00:00")}`,
    `DTSTART:${stamp(s.date, s.start)}`,
    `DTEND:${stamp(s.date, s.end)}`,
    `SUMMARY:${s.title} (${b.athleteName})`,
    `LOCATION:${s.location}`,
    `DESCRIPTION:Coach ${coachName(app, s.coachId)}. Booked via ${SITE.name}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingFlow() {
  const app = useApp();
  const params = useSearchParams();
  const sessionParam = params.get("session");
  const typeParam = params.get("type");
  const coachParam = params.get("coach");

  const initialGroup: Group | null = typeParam === "private" ? "private" : typeParam === "small-group" ? "small-group" : typeParam === "camp" || typeParam === "clinic" || typeParam === "event" ? "event" : null;
  const [step, setStep] = useState(sessionParam ? 3 : initialGroup ? 2 : 1);
  const [group, setGroup] = useState<Group | null>(initialGroup);
  const [sessionId, setSessionId] = useState<string | null>(sessionParam);
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [payWith, setPayWith] = useState<"card" | "credit" | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [hasAccount, setHasAccount] = useState(false);

  if (!app.ready) return <Container className="py-20"><div className="h-96 animate-pulse bg-steel" aria-busy="true" /></Container>;

  const all = getSessions(app);
  const session = sessionId ? all.find((s) => s.id === sessionId) : undefined;
  const activeGroup = group ?? (session ? groupOf(session) : null);
  const effectiveAthlete = athleteId ?? (app.athletes.length === 1 ? app.athletes[0].id : null);
  const athlete = app.athletes.find((a) => a.id === effectiveAthlete);
  const options = all.filter(
    (s) =>
      s.date >= app.today &&
      activeGroup &&
      groupOf(s) === activeGroup &&
      (!coachParam || s.coachId === coachParam) &&
      (activeGroup === "event" || s.date <= addDays(app.today, 28)),
  );

  const creditOk = session ? canUseCredit(app, session) : false;
  const method: "card" | "credit" = creditOk && payWith !== "card" ? "credit" : "card";
  const price = session ? priceFor(app, session) : 0;
  const plan = getPlan(app, app.membership?.planId);

  function pay() {
    if (!session || !effectiveAthlete) return;
    const r = bookSession(session.id, effectiveAthlete, method);
    if (!r.ok) return setError(r.error ?? "Something went wrong.");
    setBooking(r.booking!);
    setStep(5);
  }

  function download() {
    if (!booking) return;
    const blob = new Blob([icsFor(booking, session, app)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "summit-training.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <Container className="py-12 sm:py-20">
      {/* progress */}
      <ol className="mb-10 grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Booking progress">
        {STEPS.map((l, i) => {
          const n = i + 1;
          return (
            <li key={l} aria-current={step === n ? "step" : undefined}>
              <div className={`h-1.5 ${step >= n ? "bg-gold" : "bg-iron"}`} />
              <p className={`mt-2 hidden font-display text-xs font-bold uppercase tracking-[0.2em] sm:block ${step >= n ? "text-white" : "text-ash"}`}>
                {n}. {l}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <h1 className="mb-6 font-display text-5xl font-extrabold uppercase leading-none">Choose training</h1>
              <div className="grid gap-4 sm:grid-cols-3">
                {GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setGroup(g.id);
                      setSessionId(null);
                      setStep(2);
                    }}
                    className="border border-iron bg-steel p-6 text-left transition-colors hover:border-gold"
                  >
                    <h2 className="font-display text-3xl font-extrabold uppercase leading-none">{g.title}</h2>
                    <p className="mt-3 text-sm text-ash">{g.blurb}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section>
              <h1 className="mb-2 font-display text-5xl font-extrabold uppercase leading-none">Pick a date & time</h1>
              <p className="mb-6 text-ash">
                {GROUPS.find((g) => g.id === activeGroup)?.title}
                {coachParam && ` · with ${coachName(app, coachParam)}`} ·{" "}
                <button className="text-gold underline-offset-4 hover:underline" onClick={() => setStep(1)}>
                  change
                </button>
              </p>
              {options.length === 0 && <p className="border border-iron p-8 text-center text-ash">No open sessions right now. <Link href="/contact" className="text-gold underline">Contact us</Link> to set one up.</p>}
              <div className="space-y-3" role="radiogroup" aria-label="Available sessions">
                {options.map((s) => {
                  const left = spotsLeft(app, s);
                  const sel = sessionId === s.id;
                  return (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={sel}
                      disabled={left === 0}
                      onClick={() => setSessionId(s.id)}
                      className={`grid w-full gap-1 border p-5 text-left transition-colors sm:grid-cols-[9rem_1fr_auto] sm:items-center ${sel ? "border-gold bg-iron" : "border-iron bg-steel hover:border-mist"} disabled:opacity-40`}
                    >
                      <span className="font-display text-xl font-bold uppercase tracking-wide">{formatDate(s.date)}</span>
                      <span>
                        <span className="block font-semibold">{s.title}</span>
                        <span className="text-sm text-ash">
                          {formatRange(s.start, s.end)} · {coachName(app, s.coachId)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block font-display text-2xl font-extrabold">{money(s.price)}</span>
                        <span className="text-xs uppercase tracking-widest text-ash">{left === 0 ? "Full" : `${left} ${left === 1 ? "spot" : "spots"}`}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!session} onClick={() => setStep(3)} arrow>Continue</Button>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section>
              <h1 className="mb-6 font-display text-5xl font-extrabold uppercase leading-none">{app.user ? "Who's training?" : "Create account"}</h1>
              {!session && (
                <p className="mb-6 border border-iron p-4 text-ash">
                  That session isn&apos;t available. <button className="text-gold underline" onClick={() => setStep(2)}>Choose another time</button>.
                </p>
              )}
              {!app.user ? (
                <div className="max-w-md">
                  {hasAccount ? <SignInForm onDone={() => {}} /> : <SignUpForm onDone={() => {}} />}
                  <button onClick={() => setHasAccount((h) => !h)} className="mt-6 text-sm text-gold underline-offset-4 hover:underline">
                    {hasAccount ? "Need an account? Create one" : "Already have an account? Sign in"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-ash">Signed in as <span className="text-white">{app.user.name}</span>. Select the athlete for this session.</p>
                  <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Athlete">
                    {app.athletes.map((a) => {
                      const sel = effectiveAthlete === a.id;
                      return (
                        <button key={a.id} role="radio" aria-checked={sel} onClick={() => setAthleteId(a.id)} className={`border p-5 text-left ${sel ? "border-gold bg-iron" : "border-iron bg-steel hover:border-mist"}`}>
                          <span className="block font-display text-2xl font-bold uppercase">{a.name}</span>
                          <span className="text-sm text-ash">
                            {a.age} yrs · {a.position}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <AthleteAdder compact={app.athletes.length > 0} onAdded={(a) => setAthleteId(a.id)} />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button disabled={!effectiveAthlete || !session} onClick={() => setStep(4)} arrow>Continue</Button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STEP 4 */}
          {step === 4 && session && (
            <section>
              <h1 className="mb-6 font-display text-5xl font-extrabold uppercase leading-none">Review & pay</h1>

              {creditOk && (
                <fieldset className="mb-6">
                  <legend className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">How would you like to pay?</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      ["credit", `Use ${session.credits} membership credit${session.credits > 1 ? "s" : ""}`, `${app.membership?.creditsRemaining ?? "Unlimited"} remaining`],
                      ["card", `Pay ${money(price)} by card`, plan ? `${plan.name} member price` : "Standard price"],
                    ] as const).map(([v, t, d]) => (
                      <button key={v} role="radio" aria-checked={method === v} onClick={() => setPayWith(v)} className={`border p-5 text-left ${method === v ? "border-gold bg-iron" : "border-iron bg-steel"}`}>
                        <span className="block font-display text-xl font-bold uppercase">{t}</span>
                        <span className="text-sm text-ash">{d}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {method === "card" && (
                <div className="mb-6 border border-iron bg-steel p-5">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">Secure checkout</p>
                  <p className="mt-2 text-sm text-ash">
                    Card payments are handled by a PCI-compliant processor (Stripe recommended). This preview simulates the payment step and never collects card numbers.
                  </p>
                </div>
              )}

              <label className="mb-2 flex cursor-pointer items-start gap-3 text-sm text-mist">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-5 w-5 accent-[#b39a62]" />
                <span>
                  I agree to the{" "}
                  <Link href="/legal/terms-and-conditions" target="_blank" className="text-gold underline">Terms</Link>,{" "}
                  <Link href="/legal/cancellation-policy" target="_blank" className="text-gold underline">Cancellation</Link> and{" "}
                  <Link href="/legal/refund-policy" target="_blank" className="text-gold underline">Refund</Link> policies, and have completed or will complete the{" "}
                  <a href={SITE.waiverUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">liability waiver, assumption of risk and photo/video release</a>.
                </span>
              </label>
              {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button disabled={!agreed} onClick={pay} size="lg" arrow>
                  {method === "credit" ? "Confirm booking" : `Pay ${money(price)}`}
                </Button>
              </div>
            </section>
          )}

          {/* STEP 5 */}
          {step === 5 && booking && session && (
            <section className="border border-gold bg-steel p-8 sm:p-12">
              <span className="mb-6 flex h-14 w-14 items-center justify-center bg-gold text-black"><CheckIcon className="h-8 w-8" /></span>
              <h1 className="font-display text-5xl font-extrabold uppercase leading-none">You&apos;re booked.</h1>
              <p className="mt-4 text-lg text-mist">
                {booking.athleteName} is confirmed for <strong className="text-white">{session.title}</strong> on {formatLong(session.date)}, {formatRange(session.start, session.end)}.
              </p>
              <p className="mt-2 text-sm text-ash">A confirmation email and a reminder the day before are sent automatically at launch. Add it to your calendar now:</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={download}>Add to calendar</Button>
                <Button href="/account/bookings" variant="outline">My bookings</Button>
                <Button href="/calendar" variant="ghost">Book another</Button>
              </div>
            </section>
          )}
        </div>

        {/* summary */}
        <aside className="h-fit border border-iron bg-steel p-6 lg:sticky lg:top-28" aria-label="Booking summary">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">Your session</p>
          {session ? (
            <div className="mt-4 space-y-3">
              <h2 className="font-display text-3xl font-extrabold uppercase leading-tight">{session.title}</h2>
              <p className="text-sm text-ash">{KIND_LABEL[session.kind]}</p>
              <ul className="space-y-2 text-sm text-mist">
                <li className="flex gap-2"><ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />{formatLong(session.date)}<br />{formatRange(session.start, session.end)}</li>
                <li className="flex gap-2"><UserIcon className="mt-0.5 h-4 w-4 shrink-0" />{coachName(app, session.coachId)}{athlete && ` · ${athlete.name}`}</li>
                <li className="flex gap-2"><PinIcon className="mt-0.5 h-4 w-4 shrink-0" />{session.location}</li>
              </ul>
              <div className="flex items-end justify-between border-t border-iron pt-4">
                <span className="text-sm text-ash">{plan && price !== session.price ? `${plan.name} price` : "Total"}</span>
                <span className="font-display text-4xl font-extrabold leading-none">{method === "credit" && step >= 4 ? "1 credit" : money(price)}</span>
              </div>
              {plan && price !== session.price && <p className="text-xs text-gold line-through-none">Regular price {money(session.price)}</p>}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ash">Choose a training type and time to see your summary.</p>
          )}
        </aside>
      </div>
      {step === 3 && !app.user && <div className="mt-8 max-w-md"><DemoNote /></div>}
    </Container>
  );
}

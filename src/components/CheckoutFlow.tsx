"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatLong } from "@/lib/dates";
import { SITE } from "@/lib/site";
import { getPlan, getPlans, purchasePlan, useApp } from "@/lib/store";
import { AthleteAdder, SignInForm, SignUpForm } from "./AuthForms";
import { CheckIcon } from "./Icons";
import { Button, Container } from "./ui";

export function CheckoutFlow() {
  const app = useApp();
  const params = useSearchParams();
  const [planId, setPlanId] = useState(params.get("plan") ?? "elite");
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const [signin, setSignin] = useState(false);

  if (!app.ready) return <Container className="py-20"><div className="h-96 animate-pulse bg-steel" aria-busy="true" /></Container>;

  const plan = getPlan(app, planId) ?? getPlans(app)[0];
  const effectiveAthlete = athleteId ?? (app.athletes.length === 1 ? app.athletes[0].id : null);

  return (
    <Container className="py-12 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div>
          <h1 className="mb-8 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Join {plan.name}</h1>

          <section className="mb-10">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">1 · Choose plan</h2>
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Plan">
              {getPlans(app).map((p) => (
                <button key={p.id} role="radio" aria-checked={p.id === plan.id} onClick={() => setPlanId(p.id)} className={`border p-4 text-left ${p.id === plan.id ? "border-gold bg-iron" : "border-iron bg-steel hover:border-mist"}`}>
                  <span className="block font-display text-xl font-bold uppercase">{p.name}</span>
                  <span className="text-sm text-ash">${p.price} / {p.billing}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">2 · Account & athlete</h2>
            {!app.user ? (
              <div className="max-w-md">
                {signin ? <SignInForm onDone={() => {}} /> : <SignUpForm onDone={() => {}} />}
                <button onClick={() => setSignin((s) => !s)} className="mt-6 text-sm text-gold underline-offset-4 hover:underline">
                  {signin ? "Need an account? Create one" : "Already have an account? Sign in"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-ash">Signed in as <span className="text-white">{app.user.name}</span></p>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Athlete">
                  {app.athletes.map((a) => (
                    <button key={a.id} role="radio" aria-checked={effectiveAthlete === a.id} onClick={() => setAthleteId(a.id)} className={`border p-4 text-left ${effectiveAthlete === a.id ? "border-gold bg-iron" : "border-iron bg-steel hover:border-mist"}`}>
                      <span className="block font-display text-xl font-bold uppercase">{a.name}</span>
                      <span className="text-sm text-ash">{a.age} yrs · {a.position}</span>
                    </button>
                  ))}
                </div>
                <AthleteAdder compact={app.athletes.length > 0} onAdded={(a) => setAthleteId(a.id)} />
              </div>
            )}
          </section>

          {app.user && !done && (
            <section>
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">3 · Agree & pay</h2>
              <label className="mb-6 flex cursor-pointer items-start gap-3 text-sm text-mist">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-5 w-5 accent-[#b39a62]" />
                <span>
                  I agree to the <Link href="/legal/terms-and-conditions" target="_blank" className="text-gold underline">Terms</Link>,{" "}
                  <Link href="/legal/cancellation-policy" target="_blank" className="text-gold underline">Cancellation</Link> and{" "}
                  <Link href="/legal/refund-policy" target="_blank" className="text-gold underline">Refund</Link> policies and the{" "}
                  <a href={SITE.waiverUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline">waiver, assumption of risk and photo/video release</a>.
                </span>
              </label>
              <p className="mb-6 border border-iron bg-steel p-4 text-sm text-ash">
                Recurring billing is handled by Stripe (or Square/PayPal) at launch. This preview simulates payment and never collects card details.
              </p>
              <Button
                size="lg"
                disabled={!agreed}
                arrow
                onClick={() => {
                  if (purchasePlan(plan.id, effectiveAthlete ?? undefined)) setDone(true);
                }}
              >
                Start membership · ${plan.price}/{plan.billing}
              </Button>
            </section>
          )}

          {done && (
            <section className="border border-gold bg-steel p-8 sm:p-12">
              <span className="mb-6 flex h-14 w-14 items-center justify-center bg-gold text-black"><CheckIcon className="h-8 w-8" /></span>
              <h2 className="font-display text-5xl font-extrabold uppercase leading-none">Welcome to {plan.name}.</h2>
              <p className="mt-4 text-lg text-mist">
                Your membership is active{app.membership ? ` and renews ${formatLong(app.membership.renewsAt)}` : ""}. Book your first session or explore member content.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/calendar" arrow>Book training</Button>
                <Button href="/account/content" variant="outline">Member content</Button>
                <Button href="/account" variant="ghost">My account</Button>
              </div>
            </section>
          )}
        </div>

        <aside className="h-fit border border-iron bg-steel p-6 lg:sticky lg:top-28" aria-label="Order summary">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">Order summary</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none">{plan.name}</h2>
          <p className="mt-1 text-ash">{plan.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {plan.perks.map((p) => (
              <li key={p} className="flex gap-2"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{p}</li>
            ))}
          </ul>
          <div className="mt-6 flex items-end justify-between border-t border-iron pt-4">
            <span className="text-sm text-ash">Billed every {plan.billing}</span>
            <span className="font-display text-4xl font-extrabold leading-none">${plan.price}</span>
          </div>
        </aside>
      </div>
    </Container>
  );
}

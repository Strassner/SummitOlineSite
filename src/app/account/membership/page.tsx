"use client";

import { Panel } from "@/components/AccountShell";
import { PlansGrid } from "@/components/Plans";
import { Button } from "@/components/ui";
import { formatLong } from "@/lib/dates";
import { cancelMembership, getPlan, useApp } from "@/lib/store";

export default function MembershipPage() {
  const app = useApp();
  const m = app.membership;
  const plan = getPlan(app, m?.planId);
  const athlete = app.athletes.find((a) => a.id === m?.athleteId);

  return (
    <>
      <Panel title="My membership">
        {m && plan ? (
          <div className="space-y-6">
            <div className="grid gap-px bg-iron sm:grid-cols-3">
              {[
                ["Current package", plan.name],
                ["Renewal date", formatLong(m.renewsAt)],
                ["Remaining sessions", m.creditsRemaining === null ? "Unlimited" : `${m.creditsRemaining}${plan.sessions ? ` of ${plan.sessions}` : ""}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-coal p-5">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold">{k}</p>
                  <p className="mt-1 font-display text-3xl font-extrabold uppercase leading-tight">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-ash">
              ${plan.price} / {plan.billing}{athlete ? ` · for ${athlete.name}` : ""} · Payment method on file: card ending 4242 (demo)
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/calendar" arrow>Book with credits</Button>
              <Button variant="outline" onClick={() => { if (confirm("Cancel your membership? It ends at the close of the billing period.")) cancelMembership(); }}>
                Cancel membership
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-ash">You don&apos;t have an active membership yet. Choose a plan to unlock member pricing, credits and the content library.</p>
          </div>
        )}
      </Panel>
      <div className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">{m ? "Change plan" : "Choose a plan"}</div>
      <PlansGrid />
    </>
  );
}

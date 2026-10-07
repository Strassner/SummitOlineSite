"use client";

import { getPlans, useApp } from "@/lib/store";
import type { Plan } from "@/lib/types";
import { CheckIcon } from "./Icons";
import { Button, Photo, Pill } from "./ui";

export function planSessionsLabel(p: Plan) {
  return p.sessions === null ? "Unlimited" : `${p.sessions} / ${p.billing}`;
}

export function PlansGrid({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const app = useApp();
  const plans = getPlans(app);
  const light = tone === "light";
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((p) => {
        const current = app.membership?.planId === p.id;
        return (
          <article key={p.id} className={`relative flex flex-col ${light ? "border border-neutral-200 bg-white text-ink" : "border border-iron bg-steel text-bone"} ${p.featured ? "ring-2 ring-gold" : ""}`}>
            {/* Membership cards lead with a photo, as in the design reference */}
            <Photo src={p.photo} alt={`${p.name} membership training`} label={p.name} className="aspect-[16/10] w-full" />
            {p.featured && (
              <span className="absolute left-4 top-4">
                <Pill tone="gold">Most popular</Pill>
              </span>
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="font-display text-4xl uppercase leading-none">{p.name}</h3>
              <p className="mt-4 font-display text-5xl leading-none">
                ${p.price}
                <span className={`ml-2 font-sans text-base ${light ? "text-neutral-500" : "text-ash"}`}>Every {p.billing}</span>
              </p>
              <p className={`mt-1 text-sm font-semibold uppercase tracking-widest ${light ? "text-gold-dim" : "text-gold"}`}>
                {p.sessions === null ? "Unlimited access" : `${p.sessions} sessions per ${p.billing}`}
              </p>
              <p className={`mt-4 ${light ? "text-neutral-700" : "text-mist"}`}>{p.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-3 text-[0.95rem]">
                    <CheckIcon className={`mt-0.5 h-5 w-5 shrink-0 ${light ? "text-gold-dim" : "text-gold"}`} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {current ? (
                  <Button href="/account/membership" variant={light ? "outlineDark" : "outline"} className="w-full">
                    Current plan · Manage
                  </Button>
                ) : (
                  <Button href={`/checkout?plan=${p.id}`} variant={light ? "dark" : "primary"} className="w-full" arrow>
                    Join Summit
                  </Button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function CompareTable() {
  const app = useApp();
  const plans = getPlans(app);
  const rows: { label: string; value: (p: Plan) => string }[] = [
    { label: "Price", value: (p) => `$${p.price} / ${p.billing}` },
    { label: "Sessions included", value: (p) => (p.sessions === null ? "Unlimited group" : `${p.sessions} per ${p.billing}`) },
    { label: "Member pricing", value: (p) => `${Math.round(p.memberDiscount * 100)}% off drop-ins` },
    { label: "Member content library", value: () => "Included" },
    { label: "Priority scheduling", value: (p) => (p.id === "starter" ? "-" : "Included") },
    { label: "1-on-1 session each month", value: (p) => (p.id === "unlimited" ? "Included" : "-") },
    { label: "Quarterly technique evaluation", value: (p) => (p.id === "starter" ? "-" : "Included") },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="py-4 pr-4 font-display text-sm uppercase tracking-[0.25em] text-neutral-500">Compare</th>
            {plans.map((p) => (
              <th key={p.id} className="px-4 py-4 font-display text-xl font-extrabold uppercase">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-neutral-200">
              <th scope="row" className="py-4 pr-4 text-sm font-semibold text-neutral-700">{r.label}</th>
              {plans.map((p) => (
                <td key={p.id} className="px-4 py-4 text-sm">{r.value(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

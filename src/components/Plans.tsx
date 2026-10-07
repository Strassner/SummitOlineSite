"use client";

import { getPlans, useApp } from "@/lib/store";
import type { Plan } from "@/lib/types";
import { CheckIcon } from "./Icons";
import { Button, Pill } from "./ui";

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
          <article
            key={p.id}
            className={`relative flex flex-col p-8 ${
              p.featured ? "bg-white text-black ring-2 ring-gold" : light ? "border border-neutral-300 bg-white" : "border border-iron bg-steel"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-8">
                <Pill tone="gold">Most popular</Pill>
              </span>
            )}
            <h3 className="font-display text-4xl font-extrabold uppercase leading-none">{p.name}</h3>
            <p className={`mt-2 ${p.featured || light ? "text-neutral-600" : "text-ash"}`}>{p.tagline}</p>
            <p className="mt-8 flex items-end gap-2">
              <span className="font-display text-6xl font-extrabold leading-none">${p.price}</span>
              <span className={`pb-1 text-sm uppercase tracking-widest ${p.featured || light ? "text-neutral-500" : "text-ash"}`}>/ {p.billing}</span>
            </p>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-gold-dim">{p.sessions === null ? "Unlimited access" : `${p.sessions} sessions per ${p.billing}`}</p>
            <ul className="mt-8 flex-1 space-y-3">
              {p.perks.map((perk) => (
                <li key={perk} className="flex gap-3 text-[0.95rem]">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              {current ? (
                <Button href="/account/membership" variant={p.featured ? "dark" : "outline"} className="w-full">
                  Current plan · Manage
                </Button>
              ) : (
                <Button href={`/checkout?plan=${p.id}`} variant={p.featured ? "dark" : light ? "dark" : "primary"} className="w-full" arrow>
                  Join {p.name.replace("Summit ", "")}
                </Button>
              )}
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

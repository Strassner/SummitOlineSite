"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { KIND_LABEL } from "@/lib/data";
import { addDays, formatDate, formatLong, fromISO, toISO, weekdayIndex } from "@/lib/dates";
import { getCoaches, getSessions, spotsLeft, useApp } from "@/lib/store";
import type { SessionKind } from "@/lib/types";
import { SessionRow } from "./Sessions";

const KINDS: ("all" | SessionKind)[] = ["all", "private", "small-group", "clinic", "camp", "event"];
const MONTHS = 3;

export function CalendarView() {
  const app = useApp();
  const params = useSearchParams();
  const initialType = (params.get("type") as SessionKind | null) ?? "all";
  const [kind, setKind] = useState<"all" | SessionKind>(KINDS.includes(initialType) ? initialType : "all");
  const [coach, setCoach] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const all = getSessions(app);
  const coaches = getCoaches(app);

  const filtered = all.filter((s) => s.date >= app.today && (kind === "all" || s.kind === kind) && (coach === "all" || s.coachId === coach));

  const byDate = new Map<string, number>();
  for (const s of filtered) byDate.set(s.date, (byDate.get(s.date) ?? 0) + 1);

  if (!app.ready) return <div className="h-96 animate-pulse bg-steel" aria-busy="true" />;

  const base = fromISO(app.today);
  const view = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWd = weekdayIndex(toISO(view));
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWd }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(view.getFullYear(), view.getMonth(), i + 1))),
  ];

  const list = selected ? filtered.filter((s) => s.date === selected) : filtered.filter((s) => s.date <= addDays(app.today, 28));

  return (
    <div>
      {/* filters */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter by training type" className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`min-h-11 px-4 font-display text-sm font-bold uppercase tracking-[0.15em] transition-colors ${kind === k ? "bg-white text-black" : "border border-iron text-mist hover:border-white hover:text-white"}`}
            >
              {k === "all" ? "All" : KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-ash">
          Coach
          <select value={coach} onChange={(e) => setCoach(e.target.value)} className="field !min-h-11 !w-auto !py-2">
            <option value="all">All coaches</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        {/* month grid */}
        <div className="h-fit border border-iron bg-steel p-5 lg:sticky lg:top-28">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} disabled={monthOffset === 0} aria-label="Previous month" className="h-10 w-10 border border-iron disabled:opacity-30">
              ‹
            </button>
            <p className="font-display text-xl font-bold uppercase tracking-wider">{monthLabel}</p>
            <button onClick={() => setMonthOffset((m) => Math.min(MONTHS - 1, m + 1))} disabled={monthOffset >= MONTHS - 1} aria-label="Next month" className="h-10 w-10 border border-iron disabled:opacity-30">
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-ash">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="py-1">
                {d}
              </span>
            ))}
            {cells.map((iso, i) => {
              if (!iso) return <span key={i} />;
              const n = byDate.get(iso) ?? 0;
              const isSel = selected === iso;
              const past = iso < app.today;
              return (
                <button
                  key={iso}
                  disabled={n === 0}
                  onClick={() => setSelected(isSel ? null : iso)}
                  aria-label={`${formatLong(iso)}${n ? `, ${n} sessions` : ", no sessions"}`}
                  aria-pressed={isSel}
                  className={`relative aspect-square text-sm font-semibold transition-colors ${
                    isSel ? "bg-gold text-black" : n > 0 ? "bg-iron text-white hover:bg-white hover:text-black" : "text-neutral-600"
                  } ${past ? "opacity-30" : ""}`}
                >
                  {Number(iso.slice(8))}
                  {n > 0 && !isSel && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />}
                </button>
              );
            })}
          </div>
          {selected && (
            <button onClick={() => setSelected(null)} className="mt-4 text-sm uppercase tracking-widest text-gold underline-offset-4 hover:underline">
              Clear date · show next 4 weeks
            </button>
          )}
        </div>

        {/* list */}
        <div>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-gold">
            {selected ? formatLong(selected) : "Next 4 weeks"} · {list.length} {list.length === 1 ? "session" : "sessions"}
          </p>
          {list.length === 0 ? (
            <div className="border border-iron p-10 text-center text-ash">
              No sessions match those filters. Try another type or date.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((s, i) => {
                const showDay = i === 0 || list[i - 1].date !== s.date;
                return (
                  <div key={s.id}>
                    {showDay && !selected && <h3 className="mb-2 mt-6 font-display text-lg font-bold uppercase tracking-[0.2em] text-mist first:mt-0">{formatDate(s.date, { weekday: "long", month: "long", day: "numeric" })}</h3>}
                    <SessionRow session={s} app={app} />
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-6 text-xs text-ash">Availability updates as spots are booked. {all.filter((s) => spotsLeft(app, s) === 0).length > 0 && "Sold-out sessions show as Full."}</p>
        </div>
      </div>
    </div>
  );
}

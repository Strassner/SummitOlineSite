"use client";

import { Panel } from "@/components/AccountShell";
import { coachName } from "@/components/Sessions";
import { Button, Pill } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/dates";
import { cancelBooking, useApp } from "@/lib/store";
import type { Booking } from "@/lib/types";

function Row({ b, upcoming, name, onCancel }: { b: Booking; upcoming: boolean; name: string; onCancel: () => void }) {
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
      <p className="font-display text-xl font-bold uppercase">{formatDate(b.date)}<span className="block text-sm font-medium text-ash">{formatTime(b.start)}</span></p>
      <div>
        <p className="font-semibold">{b.title}</p>
        <p className="text-sm text-ash">{b.athleteName} · {name} · {b.paidWith === "credit" ? "Paid with credit" : `$${b.amount} card`}</p>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone={b.status === "cancelled" ? "dark" : "gold"}>{b.status}</Pill>
        {upcoming && b.status === "confirmed" && <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </li>
  );
}

export default function BookingsPage() {
  const app = useApp();
  const upcoming = app.bookings.filter((b) => b.date >= app.today && b.status !== "cancelled").sort((a, b) => a.date.localeCompare(b.date));
  const past = app.bookings.filter((b) => !upcoming.includes(b)).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <Panel title="Upcoming sessions" action={<Button href="/calendar" size="sm">Book</Button>}>
        {upcoming.length === 0 ? <p className="text-ash">No upcoming sessions. Head to the calendar to book your next one.</p> : (
          <ul className="divide-y divide-iron">
            {upcoming.map((b) => <Row key={b.id} b={b} upcoming name={coachName(app, b.coachId)} onCancel={() => cancelBooking(b.id)} />)}
          </ul>
        )}
      </Panel>
      <Panel title="Previous & cancelled">
        {past.length === 0 ? <p className="text-ash">Nothing here yet.</p> : (
          <ul className="divide-y divide-iron">
            {past.map((b) => <Row key={b.id} b={b} upcoming={false} name={coachName(app, b.coachId)} onCancel={() => {}} />)}
          </ul>
        )}
      </Panel>
    </>
  );
}

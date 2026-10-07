"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { KIND_LABEL } from "@/lib/data";
import { addDays, formatDate, formatRange, money } from "@/lib/dates";
import {
  addContentItem,
  addCoach,
  getCoaches,
  getPlans,
  getSessions,
  removeCoach,
  removeContentItem,
  removeSession,
  resetDemo,
  setAnnouncement,
  signOut,
  spotsLeft,
  updatePlan,
  upsertSession,
  useApp,
} from "@/lib/store";
import type { SessionKind } from "@/lib/types";
import { Field } from "./AuthForms";
import { coachName } from "./Sessions";
import { Button, Container, Pill } from "./ui";

const TABS = ["Overview", "Schedule", "Memberships", "Customers", "Bookings", "Payments", "Content", "Coaches", "Announcements"] as const;
type Tab = (typeof TABS)[number];

// Sample customer rows (a real backend supplies these)
const SAMPLE_CUSTOMERS = [
  { name: "John Smith", athletes: "Jack (10), Jake (13)", plan: "Summit Elite", since: "2026-08" },
  { name: "Maria Lopez", athletes: "Diego (16)", plan: "Summit Starter", since: "2026-09" },
  { name: "Derek Walsh", athletes: "Cole (17)", plan: "Summit Unlimited", since: "2026-06" },
  { name: "Tasha Greene", athletes: "Marcus (12)", plan: "None (drop-in)", since: "2026-09" },
];

function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead>
          <tr className="border-b border-iron text-xs uppercase tracking-[0.2em] text-ash">
            {head.map((h) => (
              <th key={h} className="py-3 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
const td = "py-3 pr-4 align-middle";

export function AdminPortal() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>("Overview");
  const [note, setNote] = useState("");

  if (!app.ready) return <Container className="py-20"><div className="h-96 animate-pulse bg-steel" aria-busy="true" /></Container>;
  if (app.user?.role !== "admin") {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-6xl font-extrabold uppercase">Admin access only</h1>
        <p className="mx-auto mt-4 max-w-md text-ash">Sign in with an admin account. In this demo, use the “Demo: Admin” button on the login page.</p>
        <Button href="/login" size="lg" className="mt-8">Go to login</Button>
      </Container>
    );
  }

  const sessions = getSessions(app).filter((s) => s.date >= app.today);
  const coaches = getCoaches(app);
  const plans = getPlans(app);
  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(""), 2500);
  };

  function addSession(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    upsertSession({
      kind: String(f.get("kind")) as SessionKind,
      title: String(f.get("title")),
      date: String(f.get("date")),
      start: String(f.get("start")),
      end: String(f.get("end")),
      location: String(f.get("location")),
      coachId: String(f.get("coach")),
      capacity: Number(f.get("capacity")),
      price: Number(f.get("price")),
      credits: String(f.get("kind")) === "private" ? 2 : ["camp", "clinic"].includes(String(f.get("kind"))) ? 0 : 1,
    });
    e.currentTarget.reset();
    flash("Session added to the public calendar.");
  }

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-gold">Coach / Admin portal</p>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">Run Summit.</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => { if (confirm("Reset all demo data on this device?")) resetDemo(); }}>Reset demo</Button>
          <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
      <p className="mb-6 border border-iron bg-steel p-3 text-xs text-ash">
        <strong className="text-gold">Demo CMS.</strong> Changes you make here save to this browser and instantly update the public site (calendar, prices, coaches, banner). At launch these controls write to a database / headless CMS.
      </p>

      <div role="tablist" aria-label="Admin sections" className="mb-8 flex gap-1 overflow-x-auto border-b border-iron">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 border-b-2 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.16em] ${tab === t ? "border-gold text-white" : "border-transparent text-ash hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>
      {note && <p role="status" className="mb-6 bg-gold px-4 py-2 text-sm font-semibold text-black">{note}</p>}

      {tab === "Overview" && (
        <div className="grid gap-px bg-iron sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Upcoming sessions", sessions.length],
            ["Active plans", plans.length],
            ["Coaches", coaches.length],
            ["Bookings (this device)", app.bookings.filter((b) => b.status !== "cancelled").length],
            ["Customers (sample)", SAMPLE_CUSTOMERS.length],
            ["Open spots (next 14 days)", sessions.filter((s) => s.date <= addDays(app.today, 14)).reduce((n, s) => n + spotsLeft(app, s), 0)],
            ["Revenue (this device)", money(app.payments.filter((p) => p.status === "paid").reduce((n, p) => n + p.amount, 0))],
            ["Announcement", app.announcement ? "Live" : "None"],
          ].map(([k, v]) => (
            <div key={String(k)} className="bg-coal p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold">{k}</p>
              <p className="mt-2 font-display text-5xl font-extrabold leading-none">{v}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Schedule" && (
        <div className="space-y-10">
          <form onSubmit={addSession} className="grid gap-4 border border-iron bg-steel p-6 sm:grid-cols-2 lg:grid-cols-4">
            <h2 className="font-display text-3xl font-extrabold uppercase sm:col-span-2 lg:col-span-4">Add session</h2>
            <Field label="Type">
              <select name="kind" className="field">
                {(Object.keys(KIND_LABEL) as SessionKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-1 lg:col-span-3"><Field label="Title"><input name="title" required className="field" /></Field></div>
            <Field label="Date"><input name="date" type="date" min={app.today} required className="field" /></Field>
            <Field label="Start"><input name="start" type="time" required defaultValue="17:00" className="field" /></Field>
            <Field label="End"><input name="end" type="time" required defaultValue="18:00" className="field" /></Field>
            <Field label="Coach">
              <select name="coach" className="field">{coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </Field>
            <div className="lg:col-span-2"><Field label="Location"><input name="location" required defaultValue="Summit Training Site · Kansas City, MO" className="field" /></Field></div>
            <Field label="Capacity"><input name="capacity" type="number" min={1} defaultValue={8} required className="field" /></Field>
            <Field label="Price ($)"><input name="price" type="number" min={0} defaultValue={45} required className="field" /></Field>
            <div className="flex items-end"><Button type="submit">Add session</Button></div>
          </form>

          <Table head={["Date", "Session", "Coach", "Spots", "Price", ""]}>
            {sessions.slice(0, 40).map((s) => (
              <tr key={s.id} className="border-b border-iron/60">
                <td className={td}>{formatDate(s.date)}<br /><span className="text-ash">{formatRange(s.start, s.end)}</span></td>
                <td className={td}>{s.title}<br /><Pill>{KIND_LABEL[s.kind]}</Pill></td>
                <td className={td}>{coachName(app, s.coachId)}</td>
                <td className={td}>{spotsLeft(app, s)}/{s.capacity}</td>
                <td className={td}>{money(s.price)}</td>
                <td className={`${td} text-right`}><Button variant="ghost" size="sm" onClick={() => { removeSession(s.id); flash("Session removed."); }}>Remove</Button></td>
              </tr>
            ))}
          </Table>
          <p className="text-xs text-ash">Showing the next 40 sessions.</p>
        </div>
      )}

      {tab === "Memberships" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <form
              key={p.id + p.price + (p.sessions ?? "u") + p.billing}
              className="space-y-4 border border-iron bg-steel p-6"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const sessionsVal = String(f.get("sessions")).trim();
                updatePlan(p.id, {
                  name: String(f.get("name")),
                  tagline: String(f.get("tagline")),
                  price: Number(f.get("price")),
                  billing: String(f.get("billing")) as "month" | "quarter" | "year",
                  sessions: sessionsVal === "" ? null : Number(sessionsVal),
                  perks: String(f.get("perks")).split("\n").map((x) => x.trim()).filter(Boolean),
                });
                flash(`${p.name} updated.`);
              }}
            >
              <Field label="Name"><input name="name" defaultValue={p.name} className="field" /></Field>
              <Field label="Tagline"><input name="tagline" defaultValue={p.tagline} className="field" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price ($)"><input name="price" type="number" min={0} defaultValue={p.price} className="field" /></Field>
                <Field label="Billing">
                  <select name="billing" defaultValue={p.billing} className="field"><option value="month">Monthly</option><option value="quarter">Quarterly</option><option value="year">Yearly</option></select>
                </Field>
              </div>
              <Field label="Sessions per period" hint="Leave blank for unlimited."><input name="sessions" type="number" min={0} defaultValue={p.sessions ?? ""} className="field" /></Field>
              <Field label="Benefits (one per line)"><textarea name="perks" rows={6} defaultValue={p.perks.join("\n")} className="field" /></Field>
              <Button type="submit" size="sm">Save plan</Button>
            </form>
          ))}
        </div>
      )}

      {tab === "Customers" && (
        <Table head={["Parent", "Athletes", "Plan", "Since"]}>
          {[
            ...(app.user && app.athletes.length ? [] : []),
            ...SAMPLE_CUSTOMERS,
          ].map((c) => (
            <tr key={c.name} className="border-b border-iron/60"><td className={td}>{c.name}</td><td className={td}>{c.athletes}</td><td className={td}>{c.plan}</td><td className={td}>{c.since}</td></tr>
          ))}
        </Table>
      )}

      {tab === "Bookings" && (
        <>
          <Table head={["Date", "Session", "Athlete", "Status", "Attendance"]}>
            {app.bookings.map((b) => (
              <tr key={b.id} className="border-b border-iron/60">
                <td className={td}>{formatDate(b.date)}</td><td className={td}>{b.title}</td><td className={td}>{b.athleteName}</td>
                <td className={td}><Pill tone={b.status === "cancelled" ? "dark" : "gold"}>{b.status}</Pill></td>
                <td className={td}>{b.status === "attended" ? "Present" : b.status === "cancelled" ? "-" : "Pending"}</td>
              </tr>
            ))}
          </Table>
          {app.bookings.length === 0 && <p className="mt-4 text-ash">No bookings yet. Make one on the public site (or use the demo member) to see it here.</p>}
        </>
      )}

      {tab === "Payments" && (
        <>
          <Table head={["Date", "Description", "Status", "Amount"]}>
            {app.payments.map((p) => (
              <tr key={p.id} className="border-b border-iron/60"><td className={td}>{formatDate(p.date)}</td><td className={td}>{p.description}</td><td className={td}><Pill tone={p.status === "paid" ? "gold" : "dark"}>{p.status}</Pill></td><td className={td}>{money(p.amount)}</td></tr>
            ))}
          </Table>
          {app.payments.length === 0 && <p className="mt-4 text-ash">No payments yet.</p>}
        </>
      )}

      {tab === "Content" && (
        <div className="space-y-8">
          <form
            className="grid gap-4 border border-iron bg-steel p-6 sm:grid-cols-[1fr_14rem_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addContentItem({ title: String(f.get("title")), section: String(f.get("section")) as "Technique Library", members: f.get("members") === "on" });
              e.currentTarget.reset();
              flash("Content added to the member library.");
            }}
          >
            <Field label="Video / resource title"><input name="title" required className="field" /></Field>
            <Field label="Section">
              <select name="section" className="field"><option>Technique Library</option><option>Training Videos</option><option>Football IQ</option></select>
            </Field>
            <Button type="submit">Add</Button>
            <label className="flex items-center gap-2 text-sm text-mist sm:col-span-3"><input type="checkbox" name="members" defaultChecked className="h-4 w-4 accent-[#b39a62]" /> Members only</label>
            <p className="text-xs text-ash sm:col-span-3">File upload connects to a video host (Mux / Vimeo / Cloudflare Stream) at launch.</p>
          </form>
          <Table head={["Title", "Section", "Access", ""]}>
            {app.customContent.map((c) => (
              <tr key={c.id} className="border-b border-iron/60"><td className={td}>{c.title}</td><td className={td}>{c.section}</td><td className={td}>{c.members ? "Members" : "Public"}</td><td className={`${td} text-right`}><Button variant="ghost" size="sm" onClick={() => removeContentItem(c.id)}>Remove</Button></td></tr>
            ))}
          </Table>
          {app.customContent.length === 0 && <p className="text-ash">Items you add appear in members&apos; “My Content” area.</p>}
        </div>
      )}

      {tab === "Coaches" && (
        <div className="space-y-8">
          <Table head={["Name", "Role", ""]}>
            {coaches.map((c) => (
              <tr key={c.id} className="border-b border-iron/60"><td className={td}>{c.name}</td><td className={td}>{c.role}</td><td className={`${td} text-right`}><Button variant="ghost" size="sm" onClick={() => { removeCoach(c.id); flash("Coach removed."); }}>Remove</Button></td></tr>
            ))}
          </Table>
          <form
            className="grid gap-4 border border-iron bg-steel p-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addCoach({
                name: String(f.get("name")),
                role: String(f.get("role")),
                position: String(f.get("position")) || "Offensive Line",
                playing: String(f.get("playing")) || "Add playing background",
                collegePro: "Add college / pro experience",
                coaching: "Add coaching experience",
                certifications: [],
                philosophy: String(f.get("philosophy")) || "Add coaching philosophy",
                bio: String(f.get("bio")) || "Add a short bio.",
              });
              e.currentTarget.reset();
              flash("Coach added. They now appear on the public site.");
            }}
          >
            <h2 className="font-display text-3xl font-extrabold uppercase sm:col-span-2">Add coach</h2>
            <Field label="Name"><input name="name" required className="field" /></Field>
            <Field label="Title / role"><input name="role" required className="field" placeholder="Offensive Line Coach" /></Field>
            <Field label="Position"><input name="position" className="field" /></Field>
            <Field label="Playing background"><input name="playing" className="field" /></Field>
            <div className="sm:col-span-2"><Field label="Short bio"><textarea name="bio" rows={3} className="field" /></Field></div>
            <div className="sm:col-span-2"><Field label="Philosophy"><textarea name="philosophy" rows={2} className="field" /></Field></div>
            <div><Button type="submit">Add coach</Button></div>
          </form>
        </div>
      )}

      {tab === "Announcements" && (
        <form
          className="max-w-2xl space-y-4 border border-iron bg-steel p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setAnnouncement(String(new FormData(e.currentTarget).get("text") ?? "").trim());
            flash("Banner updated across the site.");
          }}
        >
          <h2 className="font-display text-3xl font-extrabold uppercase">Homepage announcement</h2>
          <Field label="Banner text" hint="Shows above the header on every page. Leave blank to hide."><input name="text" defaultValue={app.announcement} className="field" placeholder="Summer camp registration is open: spots are limited." /></Field>
          <div className="flex gap-3">
            <Button type="submit">Publish banner</Button>
            <Button type="button" variant="outline" onClick={() => { setAnnouncement(""); flash("Banner cleared."); }}>Clear</Button>
          </div>
          <p className="text-xs text-ash">Email / SMS announcements to members connect to your email provider at launch.</p>
        </form>
      )}
    </Container>
  );
}

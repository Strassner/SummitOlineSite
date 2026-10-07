"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addAthlete, signIn, signInDemo, signUp } from "@/lib/store";
import type { Athlete } from "@/lib/types";
import { Button } from "./ui";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm font-bold uppercase tracking-[0.18em] text-mist">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ash">{hint}</span>}
    </label>
  );
}

/** Demo notice: real authentication is wired in at launch (see README). */
export function DemoNote() {
  return (
    <p className="border border-iron bg-black/40 p-3 text-xs leading-relaxed text-ash">
      <strong className="text-gold">Demo mode.</strong> Accounts are saved only in this browser. At launch this connects to a real auth provider and Stripe. Passwords are never stored.
    </p>
  );
}

export function SignUpForm({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    if (!name || !email.includes("@")) return setError("Please enter your name and a valid email.");
    signUp({ name, email, phone: String(f.get("phone") ?? "") || undefined });
    onDone();
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Parent / guardian name">
        <input name="name" required autoComplete="name" className="field" placeholder="John Smith" />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
      </Field>
      <Field label="Mobile (for session reminders)">
        <input name="phone" type="tel" autoComplete="tel" className="field" placeholder="(816) 555-0100" />
      </Field>
      <Field label="Password" hint="Demo only: not stored.">
        <input name="password" type="password" minLength={8} autoComplete="new-password" className="field" placeholder="At least 8 characters" />
      </Field>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <Button type="submit" size="lg" className="w-full">Create account</Button>
      <DemoNote />
    </form>
  );
}

export function SignInForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    if (signIn(email)) onDone();
    else setError("No account with that email was found in this browser. Create one or try the demo below.");
  }
  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className="field" />
        </Field>
        <Field label="Password">
          <input name="password" type="password" autoComplete="current-password" className="field" />
        </Field>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
      </form>
      <div className="border-t border-iron pt-5">
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-gold">Explore the demo</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              signInDemo("customer");
              onDone();
            }}
          >
            Demo: Member
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              signInDemo("admin");
              router.push("/admin");
            }}
          >
            Demo: Admin
          </Button>
        </div>
      </div>
      <DemoNote />
    </div>
  );
}

export function AthleteAdder({ onAdded, compact = false }: { onAdded?: (a: Athlete) => void; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const a = addAthlete({
      name: String(f.get("name")).trim(),
      age: Number(f.get("age")),
      position: String(f.get("position")) || "OL",
      school: String(f.get("school") ?? "") || undefined,
    });
    form.reset();
    onAdded?.(a);
    if (compact) setOpen(false);
  }
  if (!open)
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        + Add an athlete
      </Button>
    );
  return (
    <form onSubmit={submit} className="grid gap-4 border border-iron bg-black/30 p-5 sm:grid-cols-2">
      <Field label="Athlete name">
        <input name="name" required className="field" />
      </Field>
      <Field label="Age">
        <input name="age" type="number" min={6} max={25} required className="field" />
      </Field>
      <Field label="Position">
        <select name="position" className="field" defaultValue="OL">
          {["OL", "OT", "OG", "C", "DL", "Other"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      <Field label="School / team (optional)">
        <input name="school" className="field" />
      </Field>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" size="sm">Save athlete</Button>
        {compact && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

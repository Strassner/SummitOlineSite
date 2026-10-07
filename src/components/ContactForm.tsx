"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckIcon } from "./Icons";
import { Field } from "./AuthForms";
import { Button } from "./ui";

export const CONTACT_TOPICS = ["General Question", "Private Training", "Membership", "Camps/Clinics", "Team Training", "Partnership/Sponsorship"];

export function ContactForm() {
  const params = useSearchParams();
  const wanted = params.get("topic");
  const defaultTopic = CONTACT_TOPICS.find((t) => t.toLowerCase().startsWith((wanted ?? "").toLowerCase()) && wanted) ?? CONTACT_TOPICS[0];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div className="border border-gold bg-steel p-8">
        <span className="mb-4 flex h-12 w-12 items-center justify-center bg-gold text-black"><CheckIcon className="h-7 w-7" /></span>
        <h2 className="font-display text-4xl font-extrabold uppercase">Message sent.</h2>
        <p className="mt-2 text-mist">Thanks for reaching out. A Summit coach will reply within one business day.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Name">
        <input name="name" required autoComplete="name" className="field" />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" className="field" />
      </Field>
      <Field label="Phone (optional)">
        <input name="phone" type="tel" autoComplete="tel" className="field" />
      </Field>
      <Field label="I'm reaching out about">
        <select name="topic" defaultValue={defaultTopic} className="field">
          {CONTACT_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message">
          <textarea name="message" required minLength={5} rows={6} className="field" />
        </Field>
      </div>
      {/* honeypot spam protection */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" && <p role="alert" className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

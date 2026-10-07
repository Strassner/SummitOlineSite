"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { CheckIcon } from "./Icons";
import { Field } from "./AuthForms";
import { Button } from "./ui";

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

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
    const body = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (body.website) return setStatus("sent"); // honeypot: silently drop bots

    // Static hosting has no server, so submit to a form service (Formspree, Basin, etc.) when configured,
    // otherwise fall back to the visitor's email app.
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`[${body.topic}] ${body.name}`);
      const text = encodeURIComponent([body.message, "", body.name, body.email, body.phone].filter((l) => l !== undefined && l !== "").join("\n"));
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${text}`;
      return setStatus("sent");
    }
    try {
      const res = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Something went wrong. Please email us directly.");
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
